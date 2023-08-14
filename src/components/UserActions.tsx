import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react'


interface MyComponentProps {
    params: any;
    rowId: string | null;
    setRowId: (value: string | null) => void;
  }
const UserActions = ({params, rowId, setRowId}:MyComponentProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const actualizarData = () => {
        setLoading(true)
        //const {nombre,apellido,edad,id}= params.row
    }
    console.log(params)
  return (
    <Box
        sx={{m:1,
            position:'relative',
        }}
    >
        {
            success ? 
            <Fab
                color='success'
                sx={{
                    width:40,
                    height:40
                }}
            >
                <Check/>
            </Fab>
            :
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
        {loading && <CircularProgress size={52} sx={{
            color:green[500],
            position:'absolute',
            top:-6,
            lef:-6,
            zIndex:1

        }}/>}
    </Box>
  )
}

export default UserActions