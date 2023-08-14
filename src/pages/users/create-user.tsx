import React,{useState,useContext, FC, useEffect} from 'react'
import Layout from '@/components/layout/Layout'
import { Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { createUserWithEmailAndPassword} from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { collection, query, where,  doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import { PhoneNumberUtil } from 'google-libphonenumber';
import Swal from 'sweetalert2'
import PhoneCode from '@/components/PhoneCode'
import { DatosContext } from '@/Context/datosContext'
import { format } from 'date-fns';
import { Validar } from '@/interfaces/usuarios'


const CreateUser:FC = () => {
  const {
      apellido, setApellido,cedula,  
      setCedula, celular, setCelular, email, 
      setEmail,rol,setRol,country ,setCountry
    } = useContext(DatosContext)
  const usuariosdb = collection(db, "usuarios")
  const [nombre, setNombre]= useState<string>('')
  
  const [validarEmail, setValidarEmail]= useState<Validar>({
    error:false,
    message:''
  })
  const [validarCedula, setValidarCedula]= useState<Validar>({
    error:false,
    message:'',
  })
  const [validarCelular, setValidarCelular]= useState<Validar>({
    error:false,
    message:''
  })
  const [validarnombre, setValidarNombre]= useState<Validar>({
    error:false,
    message:''
  })
  const [validarapellido, setValidarApellido]= useState<Validar>({
    error:false,
    message:'',
  })
  let isValid
  // validaciones
  const validarNombre = () => {
    const patronNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s']+$/.test(nombre)
    if(nombre !== ''){
      if(patronNombre === false ){
        setValidarNombre({
            error:true,
            message:'el nombre no puede contener numeros',
        })
      }else {
        setValidarNombre({
            error:false,
            message:'',
        })
      }
    }else {
        setValidarNombre({
            error:false,
            message:'',
        })
    }
    
  }

  const validarApellido = () => {
    const patronApellido = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s']+$/.test(apellido)
    if(apellido !== ''){
      if(patronApellido === false ){
        setValidarApellido({
            error:true,
            message:'el apellido no puede contener numeros',
        })
      }else {
        setValidarApellido({
            error:false,
            message:'',
        })
      }
    }else {
      setValidarApellido({
            error:false,
            message:'',
        })
    }

  }
  const validCedula = async () => {
    const queryCedula = (await getDocs(query(usuariosdb, where("cedula", "==", cedula)))).empty
    if(cedula !== ''){
      if(queryCedula === false){
        setValidarCedula({
          error:true,
          message:'ya se encuentra un usuario registrado con este documento',
        })
      }else {
        setValidarCedula({
          error:false,
          message:''
        })
      }
    }else {
      setValidarCedula({
        error:false,
        message:''
      })

    }
  }

  const validEmail = async () => {
    const queryEmail =  (await getDocs(query(usuariosdb, where("email", "==", email)))).empty
    let testEmail =!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
    if(email !== ''){
      if(testEmail === true ){
        setValidarEmail({
          error:true,
          message:'Correo electrónico inválido'
        })
      }else {
        setValidarEmail({
          error:false,
          message:''
        })
      }

    }else{
      setValidarEmail({
        error:false,
        message:''
      })
    }

    if(testEmail === false) {
      if(queryEmail === false){
        setValidarEmail({
          error:true,
          message:'el email ya se encuentra registrado'
        })
      }else {
        setValidarEmail({
          error:false,
          message:''
        })
      }
      
    }
  }
  
  
  const validCelular = async () => {
    const querytCelular = (await getDocs(query(usuariosdb, where("celular", "==", celular)))).empty
 
  if(celular !== '' && country.code !== '' && country.phonecode !== undefined) {
    const phoneNumberUtil = PhoneNumberUtil.getInstance()
  const parsedNumber = phoneNumberUtil.parseAndKeepRawInput(`+${country.phonecode}${celular}`, 'ZZ');
  isValid = phoneNumberUtil.isValidNumber(parsedNumber);
  const regionCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber)
    if(isValid){
      setValidarCelular({
        error:false,
      message:''
      })
      if(querytCelular === false){
        setValidarCelular({
          error:true,
        message:'el numero ingresado ya se encuentra registrado'
        })
      }else {
        setValidarCelular({
          error:false,
        message:''
        })
  
      }
      
    }else {
      setValidarCelular({
        error:true,
      message:`el numero ingresado no es un numero valido para ${country?.pais+regionCode}`
      })
      setCelular('')
  
    }
  }else {
    setValidarCelular({
      error:false,
    message:'',
    })
  }
  }



// Funcion Registrar
  const Registrarusuario = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const queryEmail =  await getDocs(query(usuariosdb, where("email", "==", email)))
    const querytCelular = await getDocs(query(usuariosdb, where("celular", "==", celular)))
    const queryCedula = await getDocs(query(usuariosdb, where("cedula", "==", cedula)))
    try {
      if (queryCedula && queryEmail.empty && querytCelular) {
        const infoUser = await createUserWithEmailAndPassword(auth,email,cedula)
        console.log(infoUser)
        const fecha = infoUser.user.metadata.creationTime
        const dateObj = new Date(fecha)
        const formattedDate = format(dateObj, 'dd/MM/yyyy')
        await setDoc(doc(usuariosdb,cedula), {
            nombre:nombre,
            apellido:apellido,
            cedula:cedula,
            celular:`+${country.phonecode}${celular}`,
            email:email,
            indicativo:country,
            rol:rol,
            id:infoUser.user.uid,
            created_at:formattedDate,
            lastLogin_at:''
        })
        
        
      }
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado exitosamente',
        showConfirmButton: false,
        timer: 1500
      })
      setNombre('')
      setApellido('')
      setCedula('')
      setCelular('')
      setEmail('')
      setCountry({
        label:'',
        code:'',
        phonecode:''
      })

    } catch (error) {
      console.error(error)
    }

  }
  
  return (
    <Layout title={'Registrar Usuario'}>
        <Box component={"form"} sx={{ m: 3 }} onSubmit={Registrarusuario}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={1} sx={{p:2}}>
              <Typography variant='h6' component={"h6"}>Información personal</Typography>
              <Divider sx={{my:2}}/>
              <Grid container spacing={2}>
                  <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  label={"Nombre"}
                  helperText={validarnombre.message}
                  error={validarnombre.error}
                  onBlur={validarNombre}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  helperText={validarapellido.message}
                  error={validarapellido.error}
                  onBlur={validarApellido}
                  label={"Apellido"}
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                  fullWidth
                  required
                  type='number'
                  label={"Cedula"}
                  value={cedula}
                  helperText={validarCedula.message}
                    error={validarCedula.error}
                 onChange={e => setCedula(e.target.value)}
                 onBlur={validCedula}
                  />
                </Grid>
                <Grid item xs={6}>
                  <PhoneCode setCountry={setCountry} country={country}/>
          </Grid>
                <Grid item xs={6}>
                  <TextField 
                  fullWidth
                  required
                  helperText={validarCelular.message}
                    error={validarCelular.error}
                  label={"Celular"}
                  value={celular}
                  onBlur={validCelular}
                  onChange={e => setCelular(e.target.value)}
                  />
                </Grid>
              </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper elevation={1} sx={{p:2}}>
                <Typography variant='h6' component={"h6"}>Información cuenta</Typography>
                <Divider sx={{my:2}}/>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField 
                    fullWidth
                    required
                    type='email'
                    label={"email"}
                    value={email}
                    helperText={validarEmail.message}
                    error={validarEmail.error}
                   onChange={e => setEmail(e.target.value)}
                   onBlur={validEmail}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                    fullWidth
                    required
                    type='password'
                    label={"Contraseña"}
                    value={cedula}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                      <Select
                       labelId="demo-simple-select-label"
                       id="demo-simple-select"
                       value={rol}
                       label="Rol"
                       onChange={(e) => setRol(e.target.value)}
                      
                      >
                        <MenuItem value={"Admin"}>Admin</MenuItem>
                        <MenuItem value={"Editor"}>Editor</MenuItem>
                        <MenuItem value={'Inactivo'}>Inactivo</MenuItem>
                      </Select>
                      

                    </FormControl>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Button sx={{mt:2}} variant='contained' type="submit">Crear usuario</Button>
        </Box>
      
    </Layout>
  )
}

export default CreateUser