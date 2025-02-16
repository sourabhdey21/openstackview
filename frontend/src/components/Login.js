import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cloud as CloudIcon } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '10%',
    right: '5%',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  }
});

const StyledPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  position: 'relative',
  overflow: 'hidden',
});

const CloudLogo = styled(CloudIcon)({
  fontSize: '4rem',
  color: '#005bea',
  marginBottom: '1rem',
});

const Title = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  background: 'linear-gradient(45deg, #005bea, #00c6fb)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '1.5rem',
  textAlign: 'center',
});

const Subtitle = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: '#666',
  marginBottom: '2rem',
  textAlign: 'center',
});

const LoginButton = styled(Button)({
  background: 'linear-gradient(45deg, #005bea 30%, #00c6fb 90%)',
  border: 0,
  borderRadius: '25px',
  boxShadow: '0 3px 5px 2px rgba(0, 91, 234, 0.3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '20px 0',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(45deg, #004bd1 30%, #00b3e0 90%)',
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#005bea',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#005bea',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    fontFamily: "'Poppins', sans-serif",
  },
  marginBottom: '1rem',
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GradientBackground>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CloudLogo />
            <Title variant="h4">
              OpenStack Cloud
            </Title>
            <Subtitle variant="subtitle1">
              Welcome back! Please login to your account.
            </Subtitle>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{
                          color: '#005bea',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 91, 234, 0.04)',
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography 
                  color="error" 
                  align="center" 
                  sx={{ 
                    mt: 1, 
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.875rem' 
                  }}
                >
                  {error}
                </Typography>
              )}
              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
              >
                Sign In
              </LoginButton>
            </form>
          </Box>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
};

export default Login; 