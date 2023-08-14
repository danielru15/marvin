import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'

interface modal {
    openModal:boolean,
    params?:any,
    closemodal: () => void
}
const WhatsappMessage = ({openModal,params, closemodal}:modal) => {
    const [greeting, setGreeting] = useState('');
    const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');


  function capitalize(text: string): string {
    if(text !== '' && text !== undefined) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    
  }

  const handleSendMessage = () => {
   if(greeting !== '' && subject !== '' && message !== ''){
    const encodedMessage = encodeURIComponent(`${greeting} ${capitalize(params.nombre)} ${capitalize(params.apellido)}.\nasunto:${capitalize(subject)}\n\n${capitalize(message)}`);
    const link = `https://api.whatsapp.com/send/?phone=${params.celular}&text=${encodedMessage}`;
    window.open(link, '_blank')
    setMessage('')
    setSubject('')
    setGreeting('')
    closemodal()
   }
  }
  return (
    <Dialog open={openModal} onClose={closemodal}>
      <DialogTitle>Enviar mensaje por whatsapp</DialogTitle>
      <DialogContent>
      <DialogContentText> Completa los campos faltantes antes de enviar un mensaje.</DialogContentText>
      <Grid container spacing={1}>
        <Grid item xs={4}>
            <TextField defaultValue={params.celular}margin="dense"  label="Celular" InputProps={{
            readOnly: true,
          }}/>
        </Grid>
        <Grid item xs={4}>
            <TextField defaultValue={capitalize(params.nombre)} margin="dense" label="Nombre"
          InputProps={{
            readOnly: true,
          }}
          />
        </Grid>
        <Grid item xs={4}>
            <TextField defaultValue={capitalize(params.apellido)} margin="dense" label="Apellido" InputProps={{
            readOnly: true,
          }}/>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth required>
        <InputLabel id="demo-simple-select-label">Saludo</InputLabel>
        <Select  labelId="demo-simple-select-label" id="demo-simple-select" label="Saludo" value={greeting} onChange={(e) => setGreeting(e.target.value)} fullWidth  required>
                <MenuItem value="Buenos días">Buenos días</MenuItem>
                <MenuItem value="Buenas tardes">Buenas tardes</MenuItem>
                <MenuItem value="Buenas noches">Buenas noches</MenuItem>
          </Select>

        </FormControl>
            
        </Grid>
        <Grid item xs={6}>
            <TextField label="Asunto" required value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth/>
        </Grid>
        <Grid item xs={12}>

        <TextField label="Mensaje" required  value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline rows={4}  margin="dense"/>
        </Grid>
      </Grid>
      
      </DialogContent>
      <DialogActions>
          <Button onClick={closemodal} color="error" disableElevation>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained" color="success" disableElevation>Enviar mensaje</Button>
        </DialogActions>
      </Dialog>
  )
}

export default WhatsappMessage