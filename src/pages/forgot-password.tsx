import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Alert } from '@mui/material';
import Link from 'next/link';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [error, setError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: '',
  });

  const RecuperarClave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usuariosdb = collection(db, 'usuarios');
    const queryEmail = (await getDocs(query(usuariosdb, where('email', '==', email)))).empty;
    try {
      if (email !== '') {
        if (queryEmail === false) {
          await sendPasswordResetEmail(auth, email);
          setAlert(true);
          setError({
            error: false,
            message: '',
          });
        }
        if (queryEmail === true) {
          setError({
            error: true,
            message: 'El usuario no se encuentra registrado',
          });
          setAlert(false);
        }
      }
    } catch (error) {
      console.error(error);
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
        <Typography component="h1" variant="h5">
          Recuperar contraseña
        </Typography>
        {alert === true ? (
          <Alert sx={{ m: 3 }}>
            Se envió un link de restablecimiento de contraseña al correo: {email}
          </Alert>
        ) : null}
        <Box component="form" onSubmit={RecuperarClave}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            error={error.error}
            helperText={error.message}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            autoFocus
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Recuperar Contraseña
          </Button>
        </Box>
        <Link href="/login">Iniciar sesión</Link>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
