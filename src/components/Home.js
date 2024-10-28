// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  AppBar,
  Toolbar,
  Container,
} from '@mui/material';
import {
  LogoWrapper,
  Logo,
} from './mui-styles';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const PostCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const PostImage = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%',
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  '-webkit-line-clamp': 2,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
}));

const PostDescription = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': 3,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
}));

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm fetch data từ API
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Dữ liệu mẫu khi chưa có kết nối database
  const samplePosts = [
    {
      id: 1,
      title: 'RTX 5090 & Ryzen 9900X3D build',
      description: 'Đánh giá chi tiết về hiệu năng của bộ PC cao cấp với RTX 5090 và Ryzen 9900X3D...',
      image: '/images/rtx5090.jpg'
    },
    {
      id: 2,
      title: 'Tiêu đề bài viết 2',
      description: 'Mô tả chi tiết về bài viết 2...',
      image: '/images/post2.jpg'
    },
    // Thêm các bài viết mẫu khác
  ];

  return (
    <Box>
      {/* Header với nút đăng nhập/đăng ký */}
      <StyledAppBar position="static">
        <Toolbar>
          <LogoWrapper>
            <Logo src="dau2.png" alt="Logo" />
          </LogoWrapper>
          <Box sx={{ marginLeft: 'auto' }}>
            <LoginButton
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
            >
              Đăng nhập
            </LoginButton>
            <LoginButton
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
            >
              Đăng ký
            </LoginButton>
          </Box>
        </Toolbar>

      </StyledAppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {(posts.length > 0 ? posts : samplePosts).map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard>
                <PostImage
                  image={post.image}
                  title={post.title}
                  sx={{
                    backgroundColor: 'grey.200',
                  }}
                />
                <CardContent>
                  <PostTitle variant="h6">
                    {post.title}
                  </PostTitle>
                  <PostDescription variant="body2" color="text.secondary">
                    {post.description}
                  </PostDescription>
                </CardContent>
              </PostCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;