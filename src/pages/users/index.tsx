import UserActions from '@/components/UserActions';
import Layout from '@/components/layout/Layout';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
const Index = () => {
  const [rowId, setRowId] = useState(null);

  const columns:any = [
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'nombre',
        headerName: 'Nombre',
        headerAlign: 'left',
        editable: false,
        pinned: 'left',
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'apellido',
        headerName: 'Apellido',
        headerAlign: 'left',
        editable: false,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'cedula',
        headerName: 'Cedula',
        editable: false,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'indicativo',
        headerName: 'Indicativo',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'celular',
        headerName: 'Celular',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'email',
        headerName: 'Email',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        minWidth: 100,
        flex:1,
        headerClassName: 'super-app-theme--header',
        field: 'rol',
        headerName: 'Rol',
        editable: true,
      },
      {
        headerClassName: 'super-app-theme--header',
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        renderCell: (params) => <UserActions {...{ params, rowId, setRowId }} />,
      },
    ]
    

  const rows = [
    { id: '1', nombre: 'Snow', apellido: 'Jon', age: 35 },
    // ... (other rows)
  ];

  return (
    <Layout>
<Box sx={{width:"100%", background:"white", p:2}}>
<Typography variant='h6' component={"h1"} sx={{ my: 2 }}>Registrar Usuario</Typography>
      <Divider/>
      <DataGrid
                columns={columns}
                rows={rows}
                getRowSpacing={(params) => ({
                  top: params.isFirstVisible ? 0 : 5,
                  bottom: params.isLastVisible ? 0 : 5,
                })}
                sx={{
                  height: 450, // Adjust the height as needed
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                  [`& .${gridClasses.row}`]: {
                    bgcolor: grey[200],
                  },
                  '& .super-app-theme--header': {
                    backgroundColor: grey[800],
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  },
                }}
                editMode='row'
                onRowEditStart={(params) => setRowId(params.row.id)}
                onRowEditStop={(params) => setRowId(null)}
              />
     

</Box>
      
  
      

      

    </Layout>
  );
};

export default Index;
