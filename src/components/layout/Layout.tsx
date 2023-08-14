import React, { FC, ReactNode } from 'react';
import Sidenav from '../Sidenav'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuAppBar from '../Menubar';
import { Divider, Typography } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout:FC<LayoutProps> = ({children,title}) => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }))
      
  return (
    
     <Box sx={{display:"flex"}}>
        <MenuAppBar/>
        <Sidenav/>

        <Box component="main" sx={{width:"100%", flexGrow: 1, p:3 , overflowX:'auto'}}>
          <DrawerHeader />
          <Box sx={{ background:"white", p:3}}>
          <Typography variant='h6' component={"h1"} sx={{ my: 2,fontWeight:"bold", textTransform:'uppercase' }}>{title}</Typography>
          <Divider sx={{ m: 3 }}/>
        {children}
        </Box>   
      </Box>   
    </Box>
    
   
  )
}

export default Layout