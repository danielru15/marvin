import Layout from '../../components/layout/Layout'
import { Email, Phone, WhatsApp } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, CardHeader, Divider, Grid, IconButton, Paper, Typography } from '@mui/material'
import React, { useEffect,useContext,useState } from 'react'
import { useRouter } from 'next/router';
import { AuthContext } from '@/Context/authContext';
import { green } from '@mui/material/colors';
import Link from 'next/link';
import { DatosContext } from '@/Context/datosContext';

const Me = () => {
  const {getUserById} = useContext(AuthContext)
  const {getRandomColor} = useContext(DatosContext)
  const router = useRouter();
  const { id } = router.query;
  const [dataUser, setdatauser] = useState<any>(null)
  const bgColor = dataUser?.nombre ? getRandomColor(dataUser.nombre) : 'black';
  
  useEffect(() => {
    getUserById (id).then((data)=> {
      if (data) {
        setdatauser(data)
      } 
      else {
        console.log('No se encontraron datos para este ID');
      }
    }).catch((error) => {
    console.error('Error al obtener los datos:', error);
    })
  
    return () => {
      
    }
  }, [id])
  // Función para obtener una URL de imagen aleatoria
const getRandomImage = () => {
  const imageUrls = [
    'https://fastly.picsum.photos/id/683/800/202.jpg?hmac=1Jj8ObtnJfoNUnV9APG4burO1uXDFUCPqUc9ZUI9Wgk',
    'https://fastly.picsum.photos/id/565/800/202.jpg?hmac=U-n88ypwShZ30GTgvzePtDiAKKEUllHZKXXUhgmzGNs',
    'https://fastly.picsum.photos/id/383/800/202.jpg?hmac=el8acKOPDh4LPgJmNi15e-k_au1QJaGGZguWTY2H-tI',
    'https://fastly.picsum.photos/id/176/800/202.jpg?hmac=_o2_EeLjHmdIYAJHkz6qwKcwkRy7ct8jx2l7yBkRe0w',
    'https://fastly.picsum.photos/id/911/800/202.jpg?hmac=t073EKtoTIkwVveats_RCnDlSHVDBFYPIu4WpJtNWB0'
    // Agrega más URLs de imágenes aquí
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};
const coverImage = getRandomImage()

  return (
    <Layout title={''}>
      <Card variant="outlined" sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Box sx={{ position: 'relative' }}>
        <img
          src={coverImage}
          alt="Cover"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <Avatar
          sx={{
            width: 100,
            height: 100,
            position: 'absolute',
            bottom: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor:bgColor
          }}
        >
          {dataUser?.nombre[0].toUpperCase()}{dataUser?.apellido[0].toUpperCase()}
        </Avatar>
      </Box>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{textTransform:'capitalize'}}>
            {dataUser?.nombre} {dataUser?.apellido}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" >
            <IconButton sx={{color:green[500]}}>
              <Link href={`mailto:${dataUser?.email}`} color="inherit">
                <Email sx={{color:'black'}}/>
              </Link>
            </IconButton>
              {dataUser?.email}
            </Typography>
            <Typography variant="subtitle1">
            <IconButton sx={{ color:green[500] }}>
              <WhatsApp  />
            </IconButton>
            {dataUser?.celular}     
            </Typography>
            <Typography variant="subtitle1">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={`https://flagcdn.com/w20/${dataUser?.indicativo.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${dataUser?.indicativo.code?.toLowerCase()}.png 2x`}
                  alt={dataUser?.indicativo.code?.label}
                  style={{marginRight: 8, marginLeft: 8, width: 24}}
                />
                {dataUser?.indicativo.label}
            </Box>
              </Typography>
            <Typography variant="subtitle1">
                Ultima conexion: {dataUser?.lastLogin_at}
              </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardHeader title="About Me" />
      <CardContent>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
          elit vel justo pharetra posuere. Suspendisse potenti. Nulla
          facilisi. Aenean non neque id libero ultricies euismod. Suspendisse
          potenti.
        </Typography>
      </CardContent>
    </Card>
  
    </Layout>
  )
}

export default Me