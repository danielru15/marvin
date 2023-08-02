import Layout from '@/components/layout/Layout'
import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const index = () => {
  return (
    <Layout>
      <Box sx={{width:"100%", background:"white", p:2}}>
      <Typography variant='h6' component={"h1"}>Usuarios</Typography>
      <Divider sx={{ my: 2 }}/>
      </Box>

    </Layout>
  )
}

export default index