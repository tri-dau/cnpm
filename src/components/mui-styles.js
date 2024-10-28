// src/components/mui-styles.js
import { styled } from '@mui/material/styles';
import { Box, Paper, TextField, Button } from '@mui/material';

// Root Container
export const RootContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100vw',
}));

// Left Section
export const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
}));

// Logo Container
export const LogoWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2.5),
  left: theme.spacing(2.5),
}));

// Logo
export const Logo = styled('img')(({ theme }) => ({
  width: 300,
  height: 'auto',
}));

// Right Section
export const RightSection = styled(Box)(({ theme }) => ({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
}));

// Form Wrapper
export const FormWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: 400,
}));

// Input Wrapper
export const InputWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

// Styled TextField
export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5),
  },
}));

// Styled Button
export const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  fontWeight: 'bold',
}));

// Styled Link
export const StyledLink = styled(Box)(({ theme }) => ({
  display: 'block',
  textAlign: 'center',
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));