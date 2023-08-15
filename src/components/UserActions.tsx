import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react'


interface MyComponentProps {
    params: any;
    rowId: string | null;
    setRowId: (value: string | null) => void;
  }
const UserActions = ({newData,params, rowId, setRowId}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const actualizarData = () => {
        console.log(newData)
        //const {nombre,apellido,edad,id}= params.row
    }
    
  return (
    <Box
        sx={{m:1,
            position:'relative',
        }}
    >
        {
            <Fab
            color='primary'
            sx={{
                width:40,
                height:40,
                bgcolor:green[500],
                '&:hover':{bgcolor:green[700]}
            }}
            disabled={params.id !== rowId || loading}
            onClick={actualizarData}
        >
            <Save/>
        </Fab>
        }
    </Box>
  )
}

export default UserActions