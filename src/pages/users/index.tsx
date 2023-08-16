import React, {FC, useContext, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { DatosContext } from "../../Context/datosContext"
import {  Avatar, Box,  IconButton, Link, Paper,CircularProgress, Fab, AlertProps, Snackbar, Alert, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, gridClasses,  GridRowModesModel,
  GridRowModes,
  GridRowId,
  GridRowModel,
  GridActionsCellItem,
  GridEventListener,
  GridRowEditStopReasons,} from '@mui/x-data-grid';
import { blue, green, grey } from '@mui/material/colors';
import {  db} from '../../../firebase'
import { collection,onSnapshot, query ,doc, updateDoc, getDocs, where} from "firebase/firestore";
import { Cancel, Delete, Edit, Email, WhatsApp, Save } from '@mui/icons-material';
import WhatsappMessage from '@/components/WhatsappMessage';
import { countries } from '../api/countrysNumber';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { number } from 'yup';



const Index:FC = () => {
  const {datousuarios, setDatousuarios,getRandomColor,formatPhoneNumber,country ,setCountry} = useContext(DatosContext)
  const [rowId, setRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [num,setNum] = useState('')
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
// Crear la consulta a la colección "usuarios"
const usuarios = query(collection(db, 'usuarios'));
  const handleCloseSnackbar = () => setErrorMessage(null);
  const [errorMessage, setErrorMessage] = useState<Pick<
  AlertProps,
  'children' | 'severity'
> | null>(null)
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

const handleEditClick = (params) => () => {
  setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } })
  setRowId(params.id)
 
}
const handleRowModesModelChange = (newRowModesModel: GridRowModesModel,params) => {
  setRowModesModel(newRowModesModel);
  //const editedRow = datousuarios.find((row) => row.id === params.id);
  //console.log(editedRow)
}

const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true
  
  }
}

const handleSaveClick = (id: GridRowId) => () => {
  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
};

const handleCancelClick = (id: GridRowId) => () => {
  setRowModesModel({
    ...rowModesModel,
    [id]: { mode: GridRowModes.View, ignoreModifications: true },
  });
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
        headerName: 'Indicativo*',
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
        headerName: 'Celular*',
        editable: true,
        renderCell: (params) => (
          
          <Box display="flex" alignItems="center">
            <IconButton sx={{ color:green[500] }} onClick={e => controlModal(params)}>
              <WhatsApp  />
            </IconButton>
            {params?.value}
          </Box>
         
        )
    },
      {
        minWidth: 300,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'email',
        headerName: 'Email*',
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
        headerName: 'Rol*',
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
        renderCell: (params) => {
          const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit
          if (isInEditMode) {
            return [
              <Fab
            color='primary'
            sx={{
                width:40,
                height:40,
                bgcolor:green[500],
                '&:hover':{bgcolor:green[700]}
            }}
            disabled={params.id !== rowId}
            onClick={handleSaveClick(params.id)}
        >
            <Save/>
        </Fab>,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(params.id)}
                color="inherit"
              />,
            ];
          }
  
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(params)}
              color="inherit"
            />
          ];
        },
      },
    ]
    


  useEffect(() => {
    

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
  }, []);
   // El arreglo de dependencias vacío asegura que el efecto se ejecute solo una vez al montar el componente
  

  const validateEmail = (email) => {
    const testEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
      email
    )

    return testEmail
  }


  

   const rowudapted = async (updatedRow) => {
    const {celular, email,rol ,cedula,indicativo,id  } =  updatedRow
    const usuarioDocRef =  doc(db,'usuarios', id)
    const phone = findCountryByName(indicativo?.code ? indicativo?.code  : indicativo)
    const isEmailValid = validateEmail(email);

    /*
    const phoneNumberUtil = PhoneNumberUtil.getInstance()
  const parsedNumber = phoneNumberUtil.parseAndKeepRawInput(`+${phone.phone}${celular}`, 'ZZ');
  const isValid = phoneNumberUtil.isValidNumber(parsedNumber);
  if(isValid === false ){
      throw new Error(`El numero ${celular} no es válido para ${phone.label} `);
    }
    */

    if (!isEmailValid) {
      throw new Error('El correo electrónico no es válido o no puede ser vacio');
    }
   
    
    

    
    try {
      await updateDoc(usuarioDocRef, {
        celular:`+${phone.phone}${celular}`,
        email:email,
        rol:rol,
        indicativo:{
          code:phone.code,
          phonecode:phone.phone,
          label:phone.label
        }
       })
       setErrorMessage({ children: 'Usuario actualizado correctamente.', severity: 'success' });
       return updatedRow
   } catch (error) {
      handleProcessRowUpdateError(error);
      return null;
   
   }
   }
 

    const handleProcessRowUpdateError = (error: Error) => {

      const err = 'Cannot read properties of null (reading )'
    setErrorMessage({ children: error.message, severity: 'error' });
  };

  return (
    <Layout title='usuarios'>
         <WhatsappMessage openModal={openModal} params={num} closemodal={closemodal}/>
         <Typography variant='h6' >Las columnas marcadas con * son editables</Typography>
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
                  '& .editable': {
                    bgcolor: '#744747',
                    textTransform:'capitalize'
                  }
                }}
                editMode='row'
                onRowEditStop={handleRowEditStop}
                rowModesModel={rowModesModel}
                processRowUpdate={(updatedRow, originalRow) =>
                  rowudapted(updatedRow)
                }
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowModesModelChange={handleRowModesModelChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                
                pageSizeOptions={[5,10,20]}
              />
              {!!errorMessage && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...errorMessage} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      </Paper>
    </Layout>
  );
};

export default Index;