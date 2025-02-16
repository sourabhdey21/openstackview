from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from keystoneauth1.identity import v3
from keystoneauth1 import session
from novaclient import client as nova_client
from neutronclient.v2_0 import client as neutron_client
from cinderclient import client as cinder_client
from glanceclient import client as glance_client
import requests
from functools import wraps
import jwt
import datetime
from datetime import timezone

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Environment variables for OpenStack
OS_AUTH_URL = os.getenv('OS_AUTH_URL')
OS_USERNAME = os.getenv('OS_USERNAME')
OS_PASSWORD = os.getenv('OS_PASSWORD')
OS_PROJECT_NAME = os.getenv('OS_PROJECT_NAME')
OS_REGION_NAME = os.getenv('OS_REGION_NAME')

# JWT Secret Key from environment variable
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Log OpenStack configuration (without sensitive data)
logger.info(f"OpenStack Auth URL: {OS_AUTH_URL}")
logger.info(f"OpenStack Project Name: {OS_PROJECT_NAME}")
logger.info(f"OpenStack Region: {OS_REGION_NAME}")

# Pricing configuration (INR per hour)
PRICING = {
    'm1.tiny': 5.0,    # ₹5/hour
    'm1.small': 10.0,   # ₹10/hour
    'm1.medium': 20.0,  # ₹20/hour
    'm1.large': 40.0,   # ₹40/hour
    'default': 15.0     # Default price for unknown flavors
}

def get_openstack_session(username, password):
    try:
        auth = v3.Password(
            auth_url=OS_AUTH_URL,
            username=username,
            password=password,
            project_name=OS_PROJECT_NAME,
            user_domain_id='default',
            project_domain_id='default'
        )
        sess = session.Session(auth=auth, verify=False)
        # Test the session
        sess.get_token()
        return sess
    except Exception as e:
        logger.error(f"Failed to create OpenStack session: {str(e)}")
        raise

def calculate_instance_cost(instance, flavor_name):
    try:
        # Get the hourly rate for the instance type
        hourly_rate = PRICING.get(flavor_name, PRICING['default'])
        
        # Calculate uptime in hours
        created = datetime.datetime.strptime(instance.created, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        now = datetime.datetime.now(timezone.utc)
        uptime_seconds = (now - created).total_seconds()
        uptime_hours = uptime_seconds / 3600
        
        # Calculate total cost
        total_cost = uptime_hours * hourly_rate
        
        return {
            'uptime_hours': round(uptime_hours, 2),
            'hourly_rate': hourly_rate,
            'total_cost': round(total_cost, 2)
        }
    except Exception as e:
        logger.error(f"Error calculating instance cost: {str(e)}")
        return {
            'uptime_hours': 0,
            'hourly_rate': 0,
            'total_cost': 0
        }

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            token = token.split(' ')[1]
            jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    try:
        logger.info(f"Login attempt for user: {username}")
        # Verify credentials with OpenStack
        sess = get_openstack_session(username, password)
        sess.get_token()
        
        # Generate JWT token
        token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET_KEY)
        
        logger.info(f"Login successful for user: {username}")
        return jsonify({
            'token': token,
            'message': 'Login successful'
        })
    except Exception as e:
        logger.error(f"Login failed for user {username}: {str(e)}")
        return jsonify({'error': str(e)}), 401

@app.route('/api/resources', methods=['GET'])
@token_required
def get_resources():
    try:
        logger.info("Fetching OpenStack resources")
        sess = get_openstack_session(OS_USERNAME, OS_PASSWORD)
        
        # Initialize clients
        nova = nova_client.Client('2', session=sess)
        neutron = neutron_client.Client(session=sess)
        cinder = cinder_client.Client('3', session=sess)
        glance = glance_client.Client('2', session=sess)
        
        # Fetch instances
        logger.info("Fetching instances")
        instances = nova.servers.list()
        logger.info(f"Found {len(instances)} instances")

        # Fetch networks
        logger.info("Fetching networks")
        networks = neutron.list_networks()
        logger.info(f"Found {len(networks['networks'])} networks")

        # Fetch volumes with proper conversion to list
        logger.info("Fetching volumes")
        try:
            volumes_list = list(cinder.volumes.list())
            logger.info(f"Found {len(volumes_list)} volumes")
        except Exception as e:
            logger.error(f"Error fetching volumes: {str(e)}")
            volumes_list = []

        # Fetch images with proper conversion to list
        logger.info("Fetching images")
        try:
            images_list = list(glance.images.list())
            logger.info(f"Found {len(images_list)} images")
        except Exception as e:
            logger.error(f"Error fetching images: {str(e)}")
            images_list = []

        # Fetch keypairs
        logger.info("Fetching keypairs")
        try:
            keypairs_list = list(nova.keypairs.list())
            logger.info(f"Found {len(keypairs_list)} keypairs")
        except Exception as e:
            logger.error(f"Error fetching keypairs: {str(e)}")
            keypairs_list = []
        
        # Get flavor information
        logger.info("Fetching flavors")
        flavors = {flavor.id: flavor for flavor in nova.flavors.list()}
        
        # Process instances
        processed_instances = [{
            'id': server.id,
            'name': server.name,
            'status': server.status,
            'addresses': server.addresses,
            'flavor': flavors[server.flavor['id']].name if server.flavor['id'] in flavors else 'unknown',
            'created': server.created,
            'pricing': calculate_instance_cost(server, flavors[server.flavor['id']].name if server.flavor['id'] in flavors else 'default')
        } for server in instances]

        # Process volumes
        processed_volumes = []
        for volume in volumes_list:
            try:
                processed_volumes.append({
                    'id': volume.id,
                    'name': volume.name or 'Unnamed Volume',
                    'size': volume.size,
                    'status': volume.status,
                    'created_at': volume.created_at,
                    'volume_type': volume.volume_type,
                    'bootable': volume.bootable,
                    'attachments': volume.attachments
                })
            except Exception as e:
                logger.error(f"Error processing volume {getattr(volume, 'id', 'unknown')}: {str(e)}")

        # Process images
        processed_images = []
        for image in images_list:
            try:
                processed_images.append({
                    'id': image.id,
                    'name': image.name or 'Unnamed Image',
                    'status': image.status,
                    'size': getattr(image, 'size', 0),
                    'min_disk': getattr(image, 'min_disk', 0),
                    'min_ram': getattr(image, 'min_ram', 0),
                    'created_at': getattr(image, 'created_at', None),
                    'updated_at': getattr(image, 'updated_at', None)
                })
            except Exception as e:
                logger.error(f"Error processing image {getattr(image, 'id', 'unknown')}: {str(e)}")

        # Process keypairs
        processed_keypairs = []
        for keypair in keypairs_list:
            try:
                processed_keypairs.append({
                    'name': keypair.name,
                    'fingerprint': keypair.fingerprint,
                    'public_key': keypair.public_key,
                    'created_at': getattr(keypair, 'created_at', None)
                })
            except Exception as e:
                logger.error(f"Error processing keypair {getattr(keypair, 'name', 'unknown')}: {str(e)}")

        # Calculate total cost
        total_cost = sum(instance['pricing']['total_cost'] for instance in processed_instances)
        
        # Construct the final response
        resources = {
            'instances': processed_instances,
            'networks': networks['networks'],
            'volumes': processed_volumes,
            'images': processed_images,
            'keypairs': processed_keypairs,
            'pricing_info': {
                'total_cost': total_cost,
                'currency': 'INR',
                'rates': PRICING
            }
        }
        
        logger.info("Successfully fetched all resources")
        return jsonify(resources)
    except Exception as e:
        logger.error(f"Error fetching resources: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 