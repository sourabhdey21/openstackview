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
  Tabs,
  Tab,
  Paper,
  Button,
  Menu,
  MenuItem,
  LinearProgress,
  Avatar,
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
  Key as KeyIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
  Storage as DiskIcon,
  Brightness4,
  Brightness7,
  Info as InfoIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(17, 24, 39, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.mode === 'light' 
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'}`,
  '& .MuiIconButton-root': {
    color: theme.palette.text.primary,
  }
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.background.default,
  paddingTop: '80px',
}));

const MotionCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(30, 41, 59, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(255, 255, 255, 0.1)'}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
}));

const Logo = styled('img')({
  width: '40px',
  height: '40px',
  marginRight: '1rem',
});

const StyledTabs = styled(Tabs)({
  backgroundColor: 'white',
  borderBottom: '1px solid #e0e0e0',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: '1rem',
    minWidth: 120,
  },
});

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

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

const PricingCard = styled(MotionCard)({
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

const DetailText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: '#7f8c8d',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: theme.palette.text.primary,
  '&.active': {
    background: theme.palette.mode === 'light' 
      ? 'rgba(59, 130, 246, 0.1)'
      : 'rgba(59, 130, 246, 0.2)',
    color: '#3b82f6',
  },
  '&:hover': {
    background: theme.palette.mode === 'light'
      ? 'rgba(59, 130, 246, 0.05)'
      : 'rgba(59, 130, 246, 0.15)',
  },
}));

const ResourceCard = styled(MotionCard)({
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const StatusBadge = styled(Chip)(({ status, theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: '0 8px',
  height: '24px',
  ...(status === 'ACTIVE' && {
    background: theme.palette.mode === 'light'
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(16, 185, 129, 0.2)',
    color: theme.palette.mode === 'light' ? '#059669' : '#34d399',
    border: `1px solid ${theme.palette.mode === 'light'
      ? 'rgba(16, 185, 129, 0.2)'
      : 'rgba(16, 185, 129, 0.3)'}`,
  }),
  ...(status === 'WARNING' && {
    background: theme.palette.mode === 'light'
      ? 'rgba(245, 158, 11, 0.1)'
      : 'rgba(245, 158, 11, 0.2)',
    color: theme.palette.mode === 'light' ? '#d97706' : '#fbbf24',
    border: `1px solid ${theme.palette.mode === 'light'
      ? 'rgba(245, 158, 11, 0.2)'
      : 'rgba(245, 158, 11, 0.3)'}`,
  }),
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  borderRadius: '8px',
  background: theme.palette.mode === 'light'
    ? 'rgba(59, 130, 246, 0.05)'
    : 'rgba(59, 130, 246, 0.1)',
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.mode === 'light' ? '#6b7280' : '#9ca3af',
  },
}));

const CostOverview = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  borderRadius: '16px',
  padding: '1.5rem',
  color: 'white',
  marginBottom: '2rem',
  boxShadow: theme.palette.mode === 'light'
    ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
    : '0 10px 15px -3px rgba(30, 64, 175, 0.3)',
}));

const ResourceHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
});

const ResourceTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
}));

const ResourceMetrics = styled(Box)({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
});

const PricingSection = styled(Box)(({ theme }) => ({
  marginBottom: '2rem',
  padding: '1.5rem',
  borderRadius: '16px',
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(30, 41, 59, 0.9)',
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
}));

const PricingTable = styled(Box)(({ theme }) => ({
  marginTop: '1rem',
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  }
}));

const Dashboard = () => {
  const [resources, setResources] = useState({
    instances: [],
    networks: [],
    volumes: [],
    images: [],
    keypairs: [],
    pricing_info: {
      total_cost: 0,
      rates: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('instances');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const fetchResources = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get(`${API_URL}/api/resources`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setResources(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch resources');
      setLoading(false);
      setRefreshing(false);
      if (error.response?.status === 401) {
        navigate('/');
      }
    }
  };

  useEffect(() => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const renderPricingSection = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PricingSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <CalculateIcon />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Infrastructure Cost Calculation
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          Your infrastructure cost is calculated based on the following factors:
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PricingTable>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Instance Pricing (Per Hour)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(resources.pricing_info?.rates || {}).map(([type, rate]) => (
                  type !== 'default' && (
                    <Box key={type} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'light' 
                        ? 'rgba(59, 130, 246, 0.05)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}>
                      <Typography>{type}</Typography>
                      <Typography sx={{ fontWeight: 500 }}>₹{rate}/hour</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </PricingTable>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: theme.palette.mode === 'light' 
                ? 'rgba(16, 185, 129, 0.05)'
                : 'rgba(16, 185, 129, 0.1)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InfoIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  How Costs Are Calculated
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Instance costs are based on the flavor type and uptime
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Uptime is calculated from instance creation time
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Total cost = (Uptime in hours) × (Hourly rate)
              </Typography>
              <Typography variant="body2">
                • Costs are updated in real-time every 30 seconds
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </PricingSection>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <StyledAppBar position="fixed">
          <Toolbar>
            <Logo src="/logo192.png" alt="OpenStack Logo" />
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: theme.palette.text.primary 
              }}
            >
              OpenStack Cloud Dashboard
            </Typography>
          </Toolbar>
        </StyledAppBar>
        <LinearProgress sx={{ width: '100%', position: 'fixed', top: '64px' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontFamily: "'Plus Jakarta Sans', sans-serif" 
            }}
          >
            Loading your cloud resources...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Logo src="/logo192.png" alt="OpenStack Logo" />
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: theme.palette.text.primary,
              fontWeight: 600
            }}
          >
            OpenStack Cloud Dashboard
          </Typography>
          <IconButton 
            onClick={fetchResources}
            disabled={refreshing}
            sx={{ mr: 2 }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={colorMode.toggleColorMode} 
            color="inherit"
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>

      <DashboardContainer>
        <Container maxWidth="xl">
          <CostOverview elevation={0}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Total Infrastructure Cost
                </Typography>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  <RupeeIcon sx={{ fontSize: '2.5rem' }} />
                  {formatPrice(resources.pricing_info?.total_cost || 0).replace('₹', '')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {Object.entries(resources.pricing_info?.rates || {}).map(([type, rate]) => (
                    type !== 'default' && (
                      <Chip
                        key={type}
                        icon={<RupeeIcon sx={{ color: 'white !important' }} />}
                        label={`${type}: ${rate}/hr`}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          borderRadius: '8px',
                          '& .MuiChip-icon': { color: 'white' },
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                    )
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CostOverview>

          <Box sx={{ mb: 4, display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            <NavButton
              startIcon={<ComputerIcon />}
              onClick={() => setActiveSection('instances')}
              className={activeSection === 'instances' ? 'active' : ''}
            >
              Instances
            </NavButton>
            <NavButton
              startIcon={<CloudIcon />}
              onClick={() => setActiveSection('networks')}
              className={activeSection === 'networks' ? 'active' : ''}
            >
              Networks
            </NavButton>
            <NavButton
              startIcon={<StorageIcon />}
              onClick={() => setActiveSection('volumes')}
              className={activeSection === 'volumes' ? 'active' : ''}
            >
              Volumes
            </NavButton>
            <NavButton
              startIcon={<ImageIcon />}
              onClick={() => setActiveSection('images')}
              className={activeSection === 'images' ? 'active' : ''}
            >
              Images
            </NavButton>
            <NavButton
              startIcon={<KeyIcon />}
              onClick={() => setActiveSection('keypairs')}
              className={activeSection === 'keypairs' ? 'active' : ''}
            >
              Key Pairs
            </NavButton>
            <NavButton
              startIcon={<CalculateIcon />}
              onClick={() => setActiveSection('pricing')}
              className={activeSection === 'pricing' ? 'active' : ''}
            >
              Pricing
            </NavButton>
          </Box>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {activeSection === 'instances' && resources.instances.map((instance) => (
                <Grid item xs={12} md={6} lg={4} key={instance.id}>
                  <MotionCard variants={cardVariants}>
                    <ResourceHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <ComputerIcon />
                        </Avatar>
                        <Box>
                          <ResourceTitle>{instance.name}</ResourceTitle>
                          <StatusBadge
                            label={instance.status}
                            status={instance.status}
                          />
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ResourceHeader>
                    
                    <ResourceMetrics>
                      <MetricBox>
                        <MemoryIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {instance.flavor}
                        </Typography>
                      </MetricBox>
                      <MetricBox>
                        <TimeIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {instance.pricing.uptime_hours.toFixed(1)} hours
                        </Typography>
                      </MetricBox>
                      <MetricBox>
                        <RupeeIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatPrice(instance.pricing.total_cost)}
                        </Typography>
                      </MetricBox>
                    </ResourceMetrics>
                  </MotionCard>
                </Grid>
              ))}

              {activeSection === 'networks' && resources.networks.map((network) => (
                <Grid item xs={12} md={6} lg={4} key={network.id}>
                  <MotionCard variants={cardVariants}>
                    <ResourceHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'info.light' }}>
                          <CloudIcon />
                        </Avatar>
                        <ResourceTitle>{network.name}</ResourceTitle>
                      </Box>
                    </ResourceHeader>
                    <Typography variant="body2" color="textSecondary">
                      ID: {network.id}
                    </Typography>
                  </MotionCard>
                </Grid>
              ))}

              {activeSection === 'volumes' && resources.volumes.map((volume) => (
                <Grid item xs={12} md={6} lg={4} key={volume.id}>
                  <MotionCard variants={cardVariants}>
                    <ResourceHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                          <DiskIcon />
                        </Avatar>
                        <Box>
                          <ResourceTitle>{volume.name}</ResourceTitle>
                          <StatusBadge
                            label={volume.status}
                            status={volume.status.toLowerCase() === 'available' ? 'ACTIVE' : 'WARNING'}
                          />
                        </Box>
                      </Box>
                    </ResourceHeader>
                    <ResourceMetrics>
                      <MetricBox>
                        <StorageIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {volume.size} GB
                        </Typography>
                      </MetricBox>
                      <MetricBox>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Type: {volume.volume_type}
                        </Typography>
                      </MetricBox>
                    </ResourceMetrics>
                  </MotionCard>
                </Grid>
              ))}

              {activeSection === 'images' && resources.images.map((image) => (
                <Grid item xs={12} md={6} lg={4} key={image.id}>
                  <MotionCard variants={cardVariants}>
                    <ResourceHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.light' }}>
                          <ImageIcon />
                        </Avatar>
                        <Box>
                          <ResourceTitle>{image.name}</ResourceTitle>
                          <StatusBadge
                            label={image.status}
                            status={image.status.toLowerCase() === 'active' ? 'ACTIVE' : 'WARNING'}
                          />
                        </Box>
                      </Box>
                    </ResourceHeader>
                    <ResourceMetrics>
                      <MetricBox>
                        <DiskIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {(image.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                        </Typography>
                      </MetricBox>
                      <MetricBox>
                        <MemoryIcon />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {image.min_ram}MB RAM, {image.min_disk}GB Disk
                        </Typography>
                      </MetricBox>
                    </ResourceMetrics>
                  </MotionCard>
                </Grid>
              ))}

              {activeSection === 'keypairs' && resources.keypairs?.map((keypair) => (
                <Grid item xs={12} md={6} lg={4} key={keypair.name}>
                  <MotionCard variants={cardVariants}>
                    <ResourceHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                          <KeyIcon />
                        </Avatar>
                        <ResourceTitle>{keypair.name}</ResourceTitle>
                      </Box>
                    </ResourceHeader>
                    <Typography variant="body2" sx={{ color: '#4b5563', mt: 1 }}>
                      Fingerprint: {keypair.fingerprint}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                      Created: {new Date(keypair.created_at).toLocaleString()}
                    </Typography>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {activeSection === 'pricing' && renderPricingSection()}
        </Container>
      </DashboardContainer>
    </Box>
  );
};

export default Dashboard; 