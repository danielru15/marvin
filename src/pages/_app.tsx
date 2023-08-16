import { AuthProvider } from '@/Context/authContext'
import '../styles/global.css'
import { DatosProvider } from '@/Context/datosContext'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <AuthProvider>
    <DatosProvider>
      <Component {...pageProps} />
    </DatosProvider>
  </AuthProvider>  
  )
}
