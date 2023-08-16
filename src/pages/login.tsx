import { FC ,useContext, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { AuthContext } from '@/Context/authContext';
import { Alert, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from "next/router";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignIn:FC = () => {
  const {login}= useContext(AuthContext)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
 
  const {push} = useRouter();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El correo electrónico o contraseña son incorrectos.';
      case 'auth/user-not-found':
        return 'El usuario no se encuentra registrado.';
      // Agrega más casos para otros códigos de error según necesites
      default:
        return 'Ocurrió un error durante el inicio de sesión.';
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica de autenticación
    try {
      await login(email,password)
      push("/users")
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresar al sistema.
        </Typography>
        {error && <Alert severity="error" sx={{m:1}}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
          onChange={ e => setEmail(e.target.value)}
            margin="normal"
            required
            fullWidth
            type='email'
            label="Email"
            autoFocus
          />
          <FormControl fullWidth margin='normal' variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            onChange={e => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar sesion
          </Button>
        </Box>
        <Link href="/forgot-password">Olvido su contraseña?</Link>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
export default SignIn