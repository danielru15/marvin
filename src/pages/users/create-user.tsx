import React,{useState} from 'react'
import Layout from '@/components/layout/Layout'
import { Box, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { collection, query, where,  doc, setDoc } from "firebase/firestore";

/*
const [nombre, setNombre]= useState('')
const [apellido, setApellido]= useState('')
const [cedula, setCedula]= useState('')
const [celular, setCelular]= useState('')
const [usuario ,setUsuario]= useState('')
const [email ,setEmail]= useState('')
const [password ,setPassword]= useState('')
*/

const CreateUser = () => {

/*
  const Registrarusuario = async (e:any) => {
    e.preventDefault()
    try {
      const usuariosdb = collection(db, "usuarios")
      const quertUser = query(usuariosdb, where("cedula", "==","1"))
      console.log(quertUser)
      if (!quertUser || quertUser === null ) {
        const infoUser = await createUserWithEmailAndPassword(auth,email,password)
        await setDoc(doc(usuariosdb,infoUser.user.uid), {
            nombre:nombre,
            apellido:apellido,
            cedula:cedula,
            celular:celular,
            usuario:usuario,
            password:password
        })
      }else {
        console.log('no se pudo registrar')
      } 
    } catch (error) {
        console.error(error)
    }
  }
  */
  return (
    <Layout>
      <Box sx={{width:"100%", background:"white", p:2}}>
      <Typography variant='h6' component={"h1"} sx={{ my: 2 }}>Registrar Usuario</Typography>
      <Divider/>
        <Box component={"form"} sx={{ m: 3 }} //onSubmit={Registrarusuario}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={1} sx={{p:2}}>
              <Typography variant='h6' component={"h6"} sx={{ fontWeight:"bold" }}>Información personal</Typography>
              <Divider sx={{my:2}}/>
              <Grid container spacing={2}>
                  <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  label={"Nombre"}
                  //onChange={e => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  label={"Apellido"}
                 // onChange={e => setApellido(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  type='number'
                  label={"Cedula"}
                 // onChange={e => setCedula(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  type='number'
                  label={"Celular"}
                  //onChange={e => setCelular(e.target.value)}
                  />
                </Grid>
              </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper elevation={1} sx={{p:2}}>
                <Typography variant='h6' component={"h6"} sx={{ fontWeight:"bold" }}>Información cuenta</Typography>
                <Divider sx={{my:2}}/>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <TextField 
                    fullWidth
                    required
                    label={"usuario"}
                   // onChange={e => setUsuario(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                    fullWidth
                    required
                    type='email'
                    label={"email"}
                   // onChange={e => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                    fullWidth
                    required
                    type='password'
                    label={"Contraseña"}
                    //onChange={e => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Button sx={{mt:2}} variant='contained' type="submit">Crear usuario</Button>
        </Box>
      </Box>  
    </Layout>
  )
}

export default CreateUser