import React from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Grid version 1
import { AppBar } from '@mui/material';

const Start = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  backgroundImage: `url("assets/img/bg.jpg")`,
  height: '100vh',
  margin: 0
}));

const WearingButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  padding: '40px 80px',
  margin: '250px 0px',
  textAlign: 'center',
  borderRadius: 120,
  fontSize: 30
}));

const Title = styled(AppBar)(({ theme }) => ({
  fontFamily: 'Roboto',
  width: '100%',
  padding: '20px 0px',
  margin: 0,
  fontSize: 60,
  backgroundColor: '#fff4',
  color: '#33333f80',
  boxShadow: 'none',
  textShadow: '0px 3px 3px #00000040'
}));

export default function DemoMenu() {
  return (
    <Start className='demoMenusContent' sx={{ width: '100%' }}>
      <Title>Virtual Try-On</Title>
      <WearingButton href='/earrings3D' variant='outlined' >Earring</WearingButton>
    </Start>
  );
}