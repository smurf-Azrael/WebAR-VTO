import React from 'react'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';

const RoundButton = styled(IconButton)(({ theme }) => ({
    margin: 20,
    boxShadow: '0px 2px 4px #0004',
    width: 50,
    height: 50,
    zIndex: 1024,
    backgroundSize: 50
  }));

export default function RingSelectButton(props) {
  const { images } = props;
  return (
    <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            minWidth: 300,
            margin: 0,
            width: '100%'
        }}>
      {images.map((image) => (
        <RoundButton
            key={image.id}
            style={{ backgroundImage: `url(${image.url})` }}
            onClick={() => {props.setModel(image.id)}}
        />
      ))}
    </Box>
  );
}