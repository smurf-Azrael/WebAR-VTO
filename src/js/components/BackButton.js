import React from 'react'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Icon } from "@iconify/react";


const PrevButton = styled(IconButton)(({ theme }) => ({
  margin: 20,
  boxShadow: '0px 2px 4px #0004',
  zIndex: 1024
}));

export default function BackButton(props) {
  return (
    <PrevButton aria-label="back" color="success" href="/">
      <Icon icon={'typcn:arrow-back'} />
    </PrevButton>
  )
}