import React from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Grid version 1
import { AppBar } from '@mui/material';

const Start = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  backgroundColor: '#ddddff',
  height: '100vh',
  margin: 0
}));

const WearingButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  padding: '20px 30px',
  margin: '250px 0px',
  textAlign: 'center',
  borderRadius: 120,
  fontSize: 30,
  backgroundColor: '#6666dd',
  outline: '12px solid #6666dd80'
}));

const Title = styled(AppBar)(({ theme }) => ({
  fontFamily: 'Roboto',
  width: '100%',
  padding: '20px 0px',
  margin: 0,
  fontSize: 60,
  backgroundColor: '#fff',
  color: '#6666dd',
  boxShadow: 'none',
  textShadow: '0px 3px 3px #00000040',
  boxShadow: '0px 5px 5px #33339980'
}));

export default function DemoMenu() {
  return (
    <Start className='demoMenusContent' sx={{ width: '100%' }}>
      <Title>Virtual Try-On</Title>
      <WearingButton href='/earrings3D' variant='contained' >Earring</WearingButton>
    </Start>
  );
}