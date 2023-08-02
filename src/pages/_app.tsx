import '../styles/global.css'
import { DatosProvider } from '@/Context/datosContext'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <DatosProvider>
    <Component {...pageProps} />
  </DatosProvider>
  )
}
