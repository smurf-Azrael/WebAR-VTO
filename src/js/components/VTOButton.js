import React from 'react'
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react';


export default React.forwardRef((props, ref) => {
  const style = {
    color: '#a87764',
    backgroundColor: '#784734',
    margin: 2,
    top: 2,
    right: 2,
    position: 'fixed',
    zIndex: 1024
  }
  return (
    <IconButton color="success" sx={style} onClick={props.onClick} ref={ref}>
      <Icon icon="uil:capture"/>
    </IconButton>
  )
})
