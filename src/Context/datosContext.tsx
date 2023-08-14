import { createContext, useState, useEffect, PropsWithChildren, useRef} from "react";
import { Country, Usuarios } from "@/interfaces/usuarios";
export { useContext,useEffect } from "react";
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';


export const DatosContext = createContext<any | null>(null)

export const DatosProvider = ({ children }:PropsWithChildren) => {
    const drawerWidth = 240;
    const [open, setOpen] = useState(true)
    const [datousuarios, setDatousuarios] = useState<Usuarios[]>([])
    const [apellido, setApellido]= useState<string>('')
  const [cedula, setCedula]= useState<string>('')
  const [celular, setCelular]= useState<string>('')
  const [email ,setEmail]= useState<string>('')
  const [country ,setCountry]= useState<Country>({
    label:'',
    code:'',
    phonecode:''
  })
  const [rol ,setRol]= useState<string>('')

  // Función para generar un color aleatorio en formato hexadecimal basado en una cadena
  const getRandomColor= (nombre: string):string  =>{
    const vibrantColors = ['#a80000', '#1c00a8', '#8d00a3', '#002510', '#005ed1','#bb002c', '#ef6902'];
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % vibrantColors.length;
    return vibrantColors[colorIndex];
  }

  // Función para formatear un número de teléfono en el formato deseado
const formatPhoneNumber = (phoneNumber: string): string => {

  if(phoneNumber !== '' || phoneNumber !== undefined || phoneNumber !== null){
  const phoneNumberUtil = PhoneNumberUtil.getInstance();
  const parsedNumber = phoneNumberUtil.parse(phoneNumber);
  const formattedNumber: string = phoneNumberUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL)

  return formattedNumber
  }
};


const formatIdNumber = (idNumber: string):string => {
  const formattedParts : string[] = [];
  if (idNumber.length % 3 === 1) {
    formattedParts.push(idNumber.substring(0, 1));
    idNumber = idNumber.substring(1);
  }

  for (let i = 0; i < idNumber.length; i += 3) {
    formattedParts.push(idNumber.substring(i, i + 3));
  }

  return formattedParts.join('.');
}

  
    return(
        <DatosContext.Provider value={{
          formatIdNumber,
          formatPhoneNumber,
          getRandomColor,
            drawerWidth,
            open,
            setOpen,
            apellido, 
            setApellido,
            cedula, 
            setCedula,
            celular, 
            setCelular,
            email,
            setEmail,
            rol,
            setRol,
            country ,
            setCountry,
            datousuarios, setDatousuarios
        }}>
        {children}
        </DatosContext.Provider>
    )

}