import React, { PropsWithChildren } from 'react'
import Sidenav from '../Sidenav'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuAppBar from '../Menubar';

const Layout = ({children}:PropsWithChildren)  => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }))
      
  return (
    <>
    <MenuAppBar/>
    <Box sx={{display:"flex"}}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
        
    </Box>
    </>
  )
}

export default Layout