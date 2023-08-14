import React, {FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { DatosContext } from "../../Context/datosContext"
import UserActions from '@/components/UserActions';
import {  Avatar, Box,  IconButton, Link, Paper } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, gridClasses,  GridRowModesModel,
  GridRowModes,
  GridRowId,
  GridRowModel,
  GridActionsCellItem,} from '@mui/x-data-grid';
import { blue, green, grey } from '@mui/material/colors';
import {  db} from '../../../firebase'
import { collection,onSnapshot, query} from "firebase/firestore";
import { Email, WhatsApp } from '@mui/icons-material';
import WhatsappMessage from '@/components/WhatsappMessage';
import { countries } from '../api/countrysNumber';


const Index:FC = () => {
  const {datousuarios, setDatousuarios,getRandomColor,formatPhoneNumber,country ,setCountry} = useContext(DatosContext)
  const [rowId, setRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [num,setNum] = useState('')
  const controlModal = (params) => {
    setOpenModal(!openModal)
    setNum(params.row)
  }
  const closemodal = () => {
    setOpenModal(!openModal)
    setNum('')
}
const findCountryByName = (countryName) => {
  const country = countries.find((c) => c?.code === countryName);
  return country ? country: null;
};


  const columns:GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      headerClassName: 'super-app-theme--header',
      width: 100,
      filterable:false,
      sortable:false,
      renderCell: (params: GridCellParams) => (
        <Avatar
         sx={{bgcolor:getRandomColor(params.row.nombre)}}
        >
          {params.row.nombre[0]}{params.row.apellido[0]}
        </Avatar>
      ),
    },
    {
      minWidth: 150,
      flex:1,
      headerClassName: 'super-app-theme--header',
      field: 'cedula',
      headerName: 'Cedula',
      editable: false,
      sortable:false,      
    },
      {
        minWidth: 150,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'nombre',
        headerName: 'Nombre',
        headerAlign: 'left',
        editable: false,
      },
      {
        minWidth: 150,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'apellido',
        headerName: 'Apellido',
        headerAlign: 'left',
        editable: false,
      },
      {
        minWidth: 220,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'indicativo',
        headerAlign: 'left',
        headerName: 'Indicativo',
        editable:true,
        type: 'singleSelect',
        pinnable:true,
        valueOptions:[countries].flat(), 
        getOptionValue: (value: any) => value.code, 
        getOptionLabel: (value: any) => `${value.label} +${value.phone}`,
        renderCell: (params) => {
          const selectedCountry = params.value.code ? params.value?.code : params.value;
          const countryLabel = params.value.code ? findCountryByName(params.value?.code) : findCountryByName(params.value)

          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={`https://flagcdn.com/w20/${selectedCountry?.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${selectedCountry?.toLowerCase()}.png 2x`}
                  alt={selectedCountry?.label}
                  style={{ marginRight: 8, width: 24}}
                />
              {`${countryLabel.label} +${countryLabel.phone}`}
            </div>
          );
        }
        
      },
      {
        minWidth: 200,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'celular',
        headerAlign: 'left',
        headerName: 'Celular',
        editable: true,
        renderCell: (params) => (
          
          <Box display="flex" alignItems="center">
            <IconButton sx={{ color:green[500] }} onClick={e => controlModal(params)}>
              <WhatsApp  />
            </IconButton>
            {formatPhoneNumber(params.value)}
          </Box>
         
        )
    },
      {
        minWidth: 300,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'email',
        headerName: 'Email',
        editable: true,
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <IconButton sx={{ color:blue[500] }}>
              <Link href={`mailto:${params.value}`} color="inherit">
                <Email  />
              </Link>
            </IconButton>
            
            {params.value}
          </Box>
        )
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        type: 'singleSelect',
        valueOptions: ['Admin', 'Editor', 'Inactivo'],
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'created_at',
        headerName: 'Creado',

        editable: false,
      },
      {
        minWidth: 150,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'lastLogin_at',
        headerName: 'Ultima conexión',
        editable: false,
      },
      {
        headerClassName: 'super-app-theme--header',
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        renderCell: (params) => <UserActions {...{ params, rowId, setRowId }} />,
      },
    ]
    


  useEffect(() => {
    // Crear la consulta a la colección "usuarios"
    const usuarios = query(collection(db, 'usuarios'));

    // Establecer un observador para recibir actualizaciones en tiempo real
    const unsubscribe = onSnapshot(usuarios, (querySnapshot) => {
      // Iterar a través de los cambios en los documentos
      querySnapshot.docChanges().forEach((change) => {
        // Crear un objeto newData con el ID y los datos del documento
        const newData = { id: change.doc.id, ...change.doc.data() };
        
        // Manejar los diferentes tipos de cambios
        if (change.type === 'added') {
          // Verificar si el dato ya existe en el estado antes de agregarlo
          if (!datousuarios.some(item => item.id === newData.id)) {
            setDatousuarios(prevState => [...prevState, newData]);
          }
        } else if (change.type === 'modified') {
          // Actualizar el dato modificado en el estado
          setDatousuarios(prevState =>
            prevState.map(item =>
              item.id === newData.id ? newData : item
            )
          );
        } else if (change.type === 'removed') {
          // Eliminar el dato del estado si fue removido
          setDatousuarios(prevState =>
            prevState.filter(item => item.id !== newData.id)
          );
        }
      });
    },(error) => {
      console.log(error)
    });

    // Función de limpieza: desuscribirse cuando el componente se desmonte
    return () => {
      unsubscribe();
    };
  }, []); // El arreglo de dependencias vacío asegura que el efecto se ejecute solo una vez al montar el componente

   
  
  return (
    <Layout title='usuarios'>
         <WhatsappMessage openModal={openModal} params={num} closemodal={closemodal}/>
      <Paper elevation={1} >
      <DataGrid
                columns={columns}
                rows={datousuarios}
                getRowSpacing={(params) => ({
                  top: params.isFirstVisible ? 0 : 5,
                  bottom: params.isLastVisible ? 0 : 5,
                })}
                sx={{
                  height: 400,
                   // Adjust the height as needed
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                    
                  },
                  [`& .${gridClasses.row}`]: {
                    bgcolor: grey[200],
                    textTransform:'capitalize'
                  },
                  '& .super-app-theme--header': {
                    backgroundColor: grey[800],
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  },
                  '& .Mui-error': {
                    backgroundColor: `rgb(126,10,15, 0.1)`,
                    color: '#750f0f',
                  },
                }}
                editMode='row'
                filterMode="server"
                
                onRowEditStart={(params) => setRowId(params.row.id)}
                onRowEditStop={(params) => setRowId(null)}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                
                pageSizeOptions={[5,10,20]}
              />
              

      </Paper>
    </Layout>
  );
};

export default Index;
