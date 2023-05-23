import React from 'react'
import { Link } from 'react-router-dom'

export default function DemoMenu(props) {
  return (
    <div className='demoMenusContent'>
      <h1>Virtual Try-On</h1>
      <ul>
        <li><Link to='/earrings3D'>Earring</Link></li>
      </ul>
    </div>
  )
}