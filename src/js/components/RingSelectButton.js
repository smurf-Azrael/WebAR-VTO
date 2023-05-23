import React from 'react'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ringPath1 from '../../assets/img/rings/1.jpg';
import ringPath2 from '../../assets/img/rings/2.jpg';
import ringPath3 from '../../assets/img/rings/3.jpg';
import { Box } from '@mui/material';

const images = [
  {
    id: 0,
    url: ringPath1,
    title: 'Model 1',
    width: '33.33%',
  },
  {
    id: 1,
    url: ringPath2,
    title: 'Model 2',
    width: '33.33%',
  },
  {
    id: 2,
    url: ringPath3,
    title: 'Model 3',
    width: '33.33%',
  },
];



const RoundButton = styled(IconButton)(({ theme }) => ({
    margin: 20,
    boxShadow: '0px 2px 4px #0004',
    width: 50,
    height: 50,
    zIndex: 1024,
    backgroundSize: 50
  }));

export default function RingSelectButton(props) {
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