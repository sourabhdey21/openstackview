import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Image as ImageIcon,
  ExitToApp as LogoutIcon,
  CurrencyRupee as RupeeIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  boxShadow: '0 3px 5px 2px rgba(0, 91, 234, 0.3)',
});

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: '#f5f5f5',
  paddingTop: '80px',
});

const StyledCard = styled(Card)({
  height: '100%',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const CardHeader = styled(Box)({
  padding: '1.5rem',
  background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
});

const CardTitle = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: '1.25rem',
  color: 'white',
});

const StyledList = styled(List)({
  padding: '1rem',
});

const StyledListItem = styled(ListItem)({
  borderRadius: '12px',
  marginBottom: '0.5rem',
  background: 'rgba(0, 91, 234, 0.02)',
  '&:hover': {
    background: 'rgba(0, 91, 234, 0.05)',
  },
});

const ResourceName = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  color: '#2c3e50',
});

const ResourceId = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: '#7f8c8d',
  fontSize: '0.875rem',
});

const StatusChip = styled(Chip)({
  borderRadius: '12px',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  '&.success': {
    background: 'rgba(46, 213, 115, 0.15)',
    color: '#2ed573',
  },
  '&.warning': {
    background: 'rgba(255, 171, 0, 0.15)',
    color: '#ffab00',
  },
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const BrandText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: '1.5rem',
  background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const PricingCard = styled(StyledCard)({
  background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  color: 'white',
});

const PricingContent = styled(Box)({
  padding: '1.5rem',
});

const PriceText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const PriceLabel = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.875rem',
});

const RateChip = styled(Chip)({
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  fontFamily: "'Poppins', sans-serif",
  borderRadius: '12px',
  '& .MuiChip-icon': {
    color: 'white',
  },
});

const LoadingMessage = styled(Typography)({
  textAlign: 'center',
  color: '#666',
  fontFamily: "'Poppins', sans-serif",
  padding: '2rem',
});

const ErrorMessage = styled(Typography)({
  textAlign: 'center',
  color: '#e74c3c',
  fontFamily: "'Poppins', sans-serif",
  padding: '2rem',
});

// Add new styled components for volume and image details
const DetailText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: '#7f8c8d',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const Dashboard = () => {
  const [resources, setResources] = useState({
    instances: [],
    networks: [],
    volumes: [],
    images: [],
    pricing_info: {
      total_cost: 0,
      rates: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const response = await axios.get(`${API_URL}/api/resources`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);
        setResources(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.response?.data?.error || 'Failed to fetch resources');
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/');
        }
      }
    };

    fetchResources();
    const interval = setInterval(fetchResources, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const ResourceCard = ({ title, icon: Icon, items, renderItem }) => (
    <StyledCard>
      <CardHeader>
        <Icon sx={{ fontSize: 28 }} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <StyledList>
        {items.map((item, index) => (
          <StyledListItem key={item.id || index}>
            {renderItem(item)}
          </StyledListItem>
        ))}
        {items.length === 0 && (
          <Typography
            sx={{
              textAlign: 'center',
              color: '#95a5a6',
              fontFamily: "'Poppins', sans-serif",
              padding: '1rem',
            }}
          >
            No {title.toLowerCase()} found
          </Typography>
        )}
      </StyledList>
    </StyledCard>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <StyledAppBar position="fixed">
          <StyledToolbar>
            <BrandText variant="h6">
              OpenStack Cloud Dashboard
            </BrandText>
          </StyledToolbar>
        </StyledAppBar>
        <DashboardContainer>
          <Container maxWidth="xl">
            <LoadingMessage>Loading resources...</LoadingMessage>
          </Container>
        </DashboardContainer>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex' }}>
        <StyledAppBar position="fixed">
          <StyledToolbar>
            <BrandText variant="h6">
              OpenStack Cloud Dashboard
            </BrandText>
          </StyledToolbar>
        </StyledAppBar>
        <DashboardContainer>
          <Container maxWidth="xl">
            <ErrorMessage>Error: {error}</ErrorMessage>
          </Container>
        </DashboardContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <BrandText variant="h6">
            OpenStack Cloud Dashboard
          </BrandText>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </StyledToolbar>
      </StyledAppBar>
      <DashboardContainer>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Pricing Overview Card */}
            <Grid item xs={12}>
              <PricingCard>
                <PricingContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <PriceLabel>Total Cost</PriceLabel>
                      <PriceText>
                        <RupeeIcon />
                        {formatPrice(resources.pricing_info?.total_cost || 0).replace('₹', '')}
                      </PriceText>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(resources.pricing_info?.rates || {}).map(([type, rate]) => (
                        type !== 'default' && (
                          <RateChip
                            key={type}
                            icon={<RupeeIcon />}
                            label={`${type}: ${rate}/hr`}
                          />
                        )
                      ))}
                    </Box>
                  </Box>
                </PricingContent>
              </PricingCard>
            </Grid>

            {/* Instances Card */}
            <Grid item xs={12} md={6}>
              <ResourceCard
                title="Instances"
                icon={ComputerIcon}
                items={resources.instances}
                renderItem={(instance) => (
                  <Box sx={{ width: '100%' }}>
                    <ResourceName variant="subtitle1">
                      {instance.name}
                    </ResourceName>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <StatusChip
                        label={instance.status}
                        className={instance.status === 'ACTIVE' ? 'success' : 'warning'}
                        size="small"
                      />
                      <ResourceId>
                        {instance.flavor}
                      </ResourceId>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ color: '#7f8c8d', fontSize: '1rem' }} />
                        <ResourceId>
                          {instance.pricing.uptime_hours.toFixed(1)} hours
                        </ResourceId>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RupeeIcon sx={{ color: '#7f8c8d', fontSize: '1rem' }} />
                        <ResourceId>
                          {formatPrice(instance.pricing.total_cost)}
                        </ResourceId>
                      </Box>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* Keep other resource cards */}
            <Grid item xs={12} md={6}>
              <ResourceCard
                title="Networks"
                icon={CloudIcon}
                items={resources.networks}
                renderItem={(network) => (
                  <Box sx={{ width: '100%' }}>
                    <ResourceName variant="subtitle1">
                      {network.name}
                    </ResourceName>
                    <ResourceId sx={{ mt: 1 }}>
                      ID: {network.id}
                    </ResourceId>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ResourceCard
                title="Volumes"
                icon={StorageIcon}
                items={resources.volumes}
                renderItem={(volume) => (
                  <Box sx={{ width: '100%' }}>
                    <ResourceName variant="subtitle1">
                      {volume.name}
                    </ResourceName>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <StatusChip
                        label={volume.status}
                        className={volume.status.toLowerCase() === 'available' ? 'success' : 'warning'}
                        size="small"
                      />
                      <DetailText>
                        <strong>Size:</strong> {volume.size}GB
                      </DetailText>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <DetailText>
                        <strong>Type:</strong> {volume.volume_type}
                      </DetailText>
                      <DetailText>
                        <strong>Bootable:</strong> {volume.bootable === 'true' ? 'Yes' : 'No'}
                      </DetailText>
                      <DetailText>
                        <strong>Created:</strong> {new Date(volume.created_at).toLocaleString()}
                      </DetailText>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ResourceCard
                title="Images"
                icon={ImageIcon}
                items={resources.images}
                renderItem={(image) => (
                  <Box sx={{ width: '100%' }}>
                    <ResourceName variant="subtitle1">
                      {image.name}
                    </ResourceName>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <StatusChip
                        label={image.status}
                        className={image.status.toLowerCase() === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <DetailText>
                        <strong>Size:</strong> {(image.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                      </DetailText>
                      <DetailText>
                        <strong>Min Requirements:</strong> {image.min_disk}GB Disk, {image.min_ram}MB RAM
                      </DetailText>
                      <DetailText>
                        <strong>Updated:</strong> {new Date(image.updated_at).toLocaleString()}
                      </DetailText>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>
    </Box>
  );
};

export default Dashboard; 