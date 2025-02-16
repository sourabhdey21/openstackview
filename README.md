# OpenStack Dashboard

A modern web application for managing OpenStack resources with a beautiful UI. This application provides a simple interface to view and manage your OpenStack instances, networks, volumes, and images.

## Features

- Modern and responsive UI
- Secure authentication
- Real-time resource monitoring
- Overview of:
  - Instances (VMs)
  - Networks
  - Volumes
  - Images

## Prerequisites

- Docker and Docker Compose
- OpenStack credentials

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd clouddashboard
```

2. Create a `.env` file in the root directory with your OpenStack credentials:
```bash
OS_AUTH_URL=https://192.168.1.71:5000/v3/
OS_USERNAME=admin
OS_PASSWORD=SGE1vma7FuWs1IGB3uFdQhXNZporJXTX
OS_PROJECT_NAME=admin
OS_REGION_NAME=RegionOne
```

3. Build and run the application using Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Architecture

The application is built using:
- Frontend:
  - React
  - Material-UI
  - React Router
  - Axios
- Backend:
  - Python Flask
  - OpenStack SDK
  - JWT Authentication
- Infrastructure:
  - Docker
  - Docker Compose

## Development

To run the application in development mode:

1. Start the backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. Start the frontend:
```bash
cd frontend
npm install
npm start
```

## Security Notes

- The application uses JWT for authentication
- OpenStack credentials are stored securely as environment variables
- HTTPS is recommended for production deployment
- Social login buttons are for demonstration only and not implemented

## License

MIT 