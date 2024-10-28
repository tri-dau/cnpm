import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  RootContainer,
  LeftSection,
  RightSection,
  LogoWrapper,
  Logo,
  FormWrapper,
  InputWrapper,
  StyledTextField,
  StyledButton,
  StyledLink
} from './mui-styles';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
  textAlign: 'center',
}));

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert("Email không hợp lệ");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu và Xác nhận mật khẩu không khớp!");
      return;
    }

    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <RootContainer>
      <LeftSection sx={{ bgcolor: 'primary.main' }}>
        <LogoWrapper>
          <Logo src="dau2.png" alt="Logo" />
        </LogoWrapper>
        <StyledTypography variant="h4">
          TRANG THÔNG TIN
        </StyledTypography>
      </LeftSection>

      <RightSection>
        <FormWrapper component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom align="center">
            Đăng ký
          </Typography>

          <InputWrapper>
            <StyledTextField
              label="Tên người dùng"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              required
              fullWidth
            />
          </InputWrapper>

          <InputWrapper>
            <StyledTextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              required
              fullWidth
            />
          </InputWrapper>

          <InputWrapper>
            <StyledTextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
              fullWidth
            />
          </InputWrapper>

          <InputWrapper>
            <StyledTextField
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
              fullWidth
            />
          </InputWrapper>

          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
          >
            Đăng ký
          </StyledButton>
        </FormWrapper>

        <StyledLink component={RouterLink} to="/">
          Về trang chủ
        </StyledLink>
      </RightSection>
    </RootContainer>
  );
}

export default Register;