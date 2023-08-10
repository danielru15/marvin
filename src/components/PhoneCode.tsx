import { countries } from '@/pages/api/countrysNumber'
import { Autocomplete, Box, TextField } from '@mui/material'
import React from 'react'
const PhoneCode = ({setCountry, country}:any) => {
  return (
    <Autocomplete
                  id="country-select-demo"
                  fullWidth
                  options={countries}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  onChange={(e,newValue) => setCountry({pais:newValue?.label,code:newValue?.phone})}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} >
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
              renderInput={(params) => (
                <TextField
                required
                {...params}
                label="Seleccione un país"
                inputProps={{
               ...params.inputProps,
               autoComplete: 'new-password', // disable autocomplete and autofill
              }}
              />
             )}/>
  )
}

export default PhoneCode