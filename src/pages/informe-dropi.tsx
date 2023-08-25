import { PieCard } from '@/components/PieCard';
import Layout from '@/components/layout/Layout'
import { Box, FormControl, Grid, Input, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';

const InformeDropi = () => {
  type OrderData = Record<string, any>;
  const [datosDropi, setDatosDropi] = useState<OrderData[]>([])
  const [productStats, setProductStats] = useState({
    mostDeliveredProduct: null,
    mostDeliveredCount: -1,
    leastDeliveredProduct: null,
    leastDeliveredCount: Infinity,
    mostCancelledProduct: null,
    mostCancelledCount: -1,
    leastCancelledProduct: null,
    leastCancelledCount: Infinity,
    mostReturnedProduct: null,
    mostReturnedCount: -1,
    leastReturnedProduct: null,
    leastReturnedCount: Infinity,
  });

  const [departmentStats, setDepartmentStats] = useState({
    mostBuyingDepartment: '',
    mostBuyingCity: '',
    mostBuyingProduct: '',
    leastBuyingDepartment: '',
    leastBuyingCity: '',
    leastBuyingProduct: '',
  });

   // Mostrar en pesos 
   const formatodivisa = new Intl.NumberFormat('es-CO',{
    style:'currency',
    currency:'COP'
})
  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            setDatosDropi(json)
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}


// Obtenemos valores únicos de la propiedad "estado"
const estadosInfome = [...new Set(datosDropi.map(item => item.ESTATUS))]

// Valores de columnas a sumar
const ColumnsSuma = [
  'TOTAL DE LA ORDEN','PRECIO FLETE','COSTO DEVOLUCION FLETE','PRECIO PROVEEDOR X CANTIDAD'
  // ... objetos con propiedades 'ESTATUS', 'total facturado', 'total iva', 'total neto', ...
]


const getTotalByStatusAndProperties = (data, statuses, properties) => {
  // Mapeamos los estados para calcular las sumas por estado
  const result = statuses.map(status => {
    // Inicializamos un objeto para las sumas totales por estado
    const totalByStatus = properties.reduce((totals, property) => {
      // Inicializamos la suma total para la propiedad actual
      totals[property] = data.reduce((sum, item) => {
        // Verificamos si el estado y la propiedad son válidos para sumar
        if (item.ESTATUS === status && typeof item[property] === 'number' && !isNaN(item[property]) && item[property] !== null) {
          return sum + item[property];
        }
        // Si no es válido, mantenemos la suma actual
        return sum;
      }, 0);
      return totals;
    }, {});

    // Retornamos un objeto con el estado y las sumas totales por propiedad
    return { status, ...totalByStatus };
  });

  // Calculamos la suma total de todas las propiedades
  const totalByProperties = properties.reduce((totals, property) => {
    totals[property] = result.reduce((sum, item) => sum + item[property], 0);
    return totals;
  }, {});

  // Agregamos el objeto final "total" con las sumas totales de todas las propiedades
  result.push({ status: "TOTAL", ...totalByProperties });

  return result;
};

  // Calculamos las sumas totales utilizando la función getTotalByStatusAndProperties
  const totalCalculadoPorEstado = getTotalByStatusAndProperties(datosDropi,estadosInfome,ColumnsSuma )


  // Función que suma dinámicamente una propiedad en los objetos del array, excluyendo los estados especificados
const sumaPropiedadconEstadosExcluidos = (datos, propiedad, estadosExcluidos) => {
  // Utilizamos el método reduce para iterar sobre el array de datos
  return datos.reduce((acumulador, objeto) => {
    // Verificamos si el estado del objeto está en los estados excluidos
    if (!estadosExcluidos.includes(objeto.status)) {
      // Obtenemos el valor de la propiedad o establecemos 0 si no existe
      const valorPropiedad = objeto[propiedad] || 0;
      // Sumamos el valor de la propiedad al acumulador
      return acumulador + valorPropiedad;
    }
    // Si el estado está excluido, no sumamos y retornamos el acumulador sin cambios
    return acumulador;
  }, 0); // El 0 es el valor inicial del acumulador
}

// Variables estado de resulatdos
const [publicidad, setPublicidad] = useState<number>(0)
const venta1 = totalCalculadoPorEstado?.find(dato => dato.status === 'TOTAL')
const entregado = totalCalculadoPorEstado?.find(dato => dato.status === 'ENTREGADO')
const cancelados = totalCalculadoPorEstado?.find(dato => dato.status === 'CANCELADO')
const rechazados = totalCalculadoPorEstado?.find(dato => dato.status === 'RECHAZADO')
const totalEntregado = entregado ? entregado['TOTAL DE LA ORDEN']: 0
const totalCanceladas = cancelados ? cancelados['TOTAL DE LA ORDEN']: 0
const totalRechazados = rechazados ? rechazados['TOTAL DE LA ORDEN']: 0
const costoMercancia = entregado ? entregado['PRECIO PROVEEDOR X CANTIDAD']: 0
const devolucion = totalCalculadoPorEstado?.find(dato => dato.status === 'DEVOLUCION')
const totalDevolucion = devolucion ? devolucion['TOTAL DE LA ORDEN'] : 0
const fletesDevolucion = devolucion ? devolucion['PRECIO FLETE'] : 0
const fletesOrdenesDeVuelta = devolucion ? devolucion['COSTO DEVOLUCION FLETE'] : 0
const venta2 = sumaPropiedadconEstadosExcluidos(totalCalculadoPorEstado, 'TOTAL DE LA ORDEN', ['CANCELADO','TOTAL','RECHAZADO'])
const precioFlete = sumaPropiedadconEstadosExcluidos(totalCalculadoPorEstado, 'PRECIO FLETE', ['CANCELADO','TOTAL','RECHAZADO','DEVOLUCION'])
const utilidad1= ((totalEntregado) - (costoMercancia) - (precioFlete) - (fletesDevolucion) - (fletesOrdenesDeVuelta))
const utilidad2= ((utilidad1) - (publicidad))
const RechCan = totalCanceladas + totalRechazados 

//garfico representativo
const dataVenta1 = [["estado", "representacion"],["Entregados",(totalEntregado/venta1['TOTAL DE LA ORDEN'])] ]

useEffect(() => {
  const calculateProductStats = () => {
    const deliveredSales = datosDropi.filter(sale => sale.ESTATUS === "ENTREGADO");
    const cancelledSales = datosDropi.filter(sale => sale.ESTATUS === "CANCELADO");
    const returnedSales = datosDropi.filter(sale => sale.ESTATUS === "DEVOLUCION");

    if (deliveredSales.length > 0) {
      const totalUnitsByProduct = {};

      deliveredSales.forEach(sale => {
        const productName = sale.PRODUCTO;
        if (!totalUnitsByProduct[productName]) {
          totalUnitsByProduct[productName] = {
            delivered: 0,
            cancelled: 0,
            returned: 0,
          };
        }
        totalUnitsByProduct[productName].delivered += sale.CANTIDAD;
      });

      cancelledSales.forEach(sale => {
        const productName = sale.PRODUCTO;
        if (!totalUnitsByProduct[productName]) {
          totalUnitsByProduct[productName] = {
            delivered: 0,
            cancelled: 0,
            returned: 0,
          };
        }
        totalUnitsByProduct[productName].cancelled += sale.CANTIDAD;
      });

      returnedSales.forEach(sale => {
        const productName = sale.PRODUCTO;
        if (!totalUnitsByProduct[productName]) {
          totalUnitsByProduct[productName] = {
            delivered: 0,
            cancelled: 0,
            returned: 0,
          };
        }
        totalUnitsByProduct[productName].returned += sale.CANTIDAD;
      });

      let mostDeliveredProduct = null;
      let mostDeliveredCount = -1;
      let leastDeliveredProduct = null;
      let leastDeliveredCount = Infinity;
      let mostCancelledProduct = null;
      let mostCancelledCount = -1;
      let leastCancelledProduct = null;
      let leastCancelledCount = Infinity;
      let mostReturnedProduct = null;
      let mostReturnedCount = -1;
      let leastReturnedProduct = null;
      let leastReturnedCount = Infinity;

      for (const product in totalUnitsByProduct) {
        const { delivered, cancelled, returned } = totalUnitsByProduct[product];

        // Más entregas
        if (delivered > mostDeliveredCount) {
          mostDeliveredCount = delivered;
          mostDeliveredProduct = product;
        }

        // Menos entregas
        if (delivered < leastDeliveredCount) {
          leastDeliveredCount = delivered;
          leastDeliveredProduct = product;
        }

        // Más cancelados
        if (cancelled > mostCancelledCount) {
          mostCancelledCount = cancelled;
          mostCancelledProduct = product;
        }

        // Menos cancelados
        if (cancelled < leastCancelledCount) {
          leastCancelledCount = cancelled;
          leastCancelledProduct = product;
        }

        // Más devoluciones
        if (returned > mostReturnedCount) {
          mostReturnedCount = returned;
          mostReturnedProduct = product;
        }

        // Menos devoluciones
        if (returned < leastReturnedCount) {
          leastReturnedCount = returned;
          leastReturnedProduct = product;
        }
      }

      setProductStats({
        mostDeliveredProduct,
        mostDeliveredCount,
        leastDeliveredProduct,
        leastDeliveredCount,
        mostCancelledProduct,
        mostCancelledCount,
        leastCancelledProduct,
        leastCancelledCount,
        mostReturnedProduct,
        mostReturnedCount,
        leastReturnedProduct,
        leastReturnedCount,
      });
    } else {
      setProductStats({
        mostDeliveredProduct: "",
        mostDeliveredCount: 0,
        leastDeliveredProduct: "",
        leastDeliveredCount: 0,
        mostCancelledProduct: "",
        mostCancelledCount: 0,
        leastCancelledProduct: "",
        leastCancelledCount: 0,
        mostReturnedProduct: "",
        mostReturnedCount: 0,
        leastReturnedProduct: "",
        leastReturnedCount: 0,
      });
    }
  };

  calculateProductStats();
}, [datosDropi]);


useEffect(() => {
  if (datosDropi.length === 0) {
    return; // Evitar cálculos si el arreglo está vacío
  }

  // Calcular estadísticas de departamentos y ciudades
  const departmentCityStats = datosDropi.reduce((stats, sale) => {
    const department = sale['DEPARTAMENTO DESTINO'];
    const city = sale['CIUDAD DESTINO'];
    const product = sale['PRODUCTO'];

    if (!stats[department]) {
      stats[department] = {
        cities: {},
        products: {},
        totalOrders: 0,
      };
    }

    if (!stats[department].cities[city]) {
      stats[department].cities[city] = 0;
    }
    if (!stats[department].products[product]) {
      stats[department].products[product] = 0;
    }

    stats[department].cities[city] += 1;
    stats[department].products[product] += sale.CANTIDAD;
    stats[department].totalOrders += 1;

    return stats;
  }, {});

  // Calcular los departamentos, ciudades y productos que más y menos compran
  const mostBuyingDepartment = Object.keys(departmentCityStats).reduce(
    (maxDepartment, department) =>
      departmentCityStats[department].totalOrders > departmentCityStats[maxDepartment].totalOrders
        ? department
        : maxDepartment
  );
  const leastBuyingDepartment = Object.keys(departmentCityStats).reduce(
    (minDepartment, department) =>
      departmentCityStats[department].totalOrders < departmentCityStats[minDepartment].totalOrders
        ? department
        : minDepartment
  );

  const mostBuyingCity =
    departmentCityStats[mostBuyingDepartment]?.cities
      ? Object.keys(departmentCityStats[mostBuyingDepartment].cities).reduce(
          (maxCity, city) =>
            departmentCityStats[mostBuyingDepartment].cities[city] >
            departmentCityStats[mostBuyingDepartment].cities[maxCity]
              ? city
              : maxCity
        )
      : '';

  const leastBuyingCity =
    departmentCityStats[leastBuyingDepartment]?.cities
      ? Object.keys(departmentCityStats[leastBuyingDepartment].cities).reduce(
          (minCity, city) =>
            departmentCityStats[leastBuyingDepartment].cities[city] <
            departmentCityStats[leastBuyingDepartment].cities[minCity]
              ? city
              : minCity
        )
      : '';

  const mostBuyingProduct =
    departmentCityStats[mostBuyingDepartment]?.products
      ? Object.keys(departmentCityStats[mostBuyingDepartment].products).reduce(
          (maxProduct, product) =>
            departmentCityStats[mostBuyingDepartment].products[product] >
            departmentCityStats[mostBuyingDepartment].products[maxProduct]
              ? product
              : maxProduct
        )
      : '';

  const leastBuyingProduct =
    departmentCityStats[leastBuyingDepartment]?.products
      ? Object.keys(departmentCityStats[leastBuyingDepartment].products).reduce(
          (minProduct, product) =>
            departmentCityStats[leastBuyingDepartment].products[product] <
            departmentCityStats[leastBuyingDepartment].products[minProduct]
              ? product
              : minProduct
        )
      : '';

  setDepartmentStats({
    mostBuyingDepartment,
    mostBuyingCity,
    mostBuyingProduct,
    leastBuyingDepartment,
    leastBuyingCity,
    leastBuyingProduct,
  });
}, [datosDropi])



  return (
    <Layout title={'informe financiero dropi'}>
      <input type="file" name="upload"
        id="upload"  onChange={readUploadFile}/>
      <Box sx={{height:370,overflowY:'auto'}}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <Typography variant='h6' component={"h2"} sx={{ my: 1, fontWeight:'bold'}}>Estadísticas de Productos</Typography>
              <Box >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper elevation={1} sx={{height:200, padding:1, background:'linear-gradient(158deg,#358a94,#5bb460)', overflowY:'auto'}}>
                      <Typography sx={{color:'whitesmoke', fontWeight:'bold'}}>Producto con más entregas:</Typography>
                      <Typography sx={{color:'whitesmoke',fontSize:14}}>- {productStats.mostDeliveredProduct}</Typography>
                      <Typography sx={{color:'whitesmoke'}}>Entregas: {productStats.mostDeliveredCount}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={1} sx={{height:200, padding:1, background:'linear-gradient(158deg,#282246,#1e2f8d)', overflowY:'auto' }}>
                      <Typography sx={{color:'whitesmoke', fontWeight:'bold'}}>Producto con menos entregas:</Typography>
                      <Typography sx={{color:'whitesmoke',fontSize:14}}>- {productStats.leastDeliveredProduct}</Typography>
                      <Typography sx={{color:'whitesmoke'}}>Entregas: {productStats.leastDeliveredCount}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                  <Paper elevation={1} sx={{height:200, padding:1,background:'linear-gradient(158deg,#358a94,#5bb460)', overflowY:'auto'}}>
                  <Typography sx={{color:'whitesmoke', fontWeight:'bold'}}>Producto con más cancelaciones:</Typography>
                      <Typography sx={{color:'whitesmoke',fontSize:14}}>- {productStats.mostCancelledProduct}</Typography>
                      <Typography sx={{color:'whitesmoke'}}>Cancelaciones: {productStats.mostCancelledCount}</Typography>
                  </Paper>
                  </Grid>
                  <Grid item xs={6}>
                  <Paper elevation={1} sx={{height:200, padding:1,background:'linear-gradient(158deg,#282246,#1e2f8d)', overflowY:'auto'}}>
                  <Typography sx={{color:'whitesmoke', fontWeight:'bold'}}>Producto con menos cancelaciones:</Typography>
                      <Typography sx={{color:'whitesmoke',fontSize:14}}>- {productStats.leastCancelledProduct}</Typography>
                      <Typography sx={{color:'whitesmoke'}}>Cancelaciones: {productStats.leastCancelledCount}</Typography>
                  </Paper>
                  </Grid>
                </Grid>
              </Box>
              </Grid>
              <Grid item xs={6}>
              <Typography variant='h6' component={"h2"} sx={{ my: 1, fontWeight:'bold'}}>Estadísticas de Productos</Typography>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={1}>
                  <PieCard titulo={'venta 1'} data={dataVenta1}/>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                 <Paper elevation={1}>
                 
                </Paper>
              </Grid>
              </Grid>
              </Grid>
            </Grid>
        <Grid container spacing={2}>
          <Grid item xs={7}>
              <Typography variant='h6' component={"h2"} sx={{ my: 2, textTransform:'capitalize',fontWeight:'bold' }}>Valores totales</Typography>
              <TableContainer component={Paper} >
              <Table sx={{ minWidth: 500  }} size="small"  aria-label="simple table">
              <TableHead sx={{backgroundColor:grey[800]}}>
                  <TableRow>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>ESTADO</TableCell>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>TOTAL DE LA ORDEN</TableCell>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>PRECIO FLETE</TableCell>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>COSTO DEVOLUCION FLETE</TableCell>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>PRECIO PROVEEDOR X CANTIDAD</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {totalCalculadoPorEstado?.map((row) => (
                      <TableRow
                      key={row.status}
                      sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor:green[600],textTransform:'uppercase', color:'whitesmoke' } }}
                    >
                      <TableCell component="th" scope="row" sx={{fontSize:13}}>
                        {row.status}
                      </TableCell>
                      <TableCell align="right">{formatodivisa.format(row['TOTAL DE LA ORDEN'])}</TableCell>
                      <TableCell align="right">{formatodivisa.format(row['PRECIO FLETE'])}</TableCell>
                      <TableCell align="right">{formatodivisa.format(row['COSTO DEVOLUCION FLETE'])}</TableCell>
                      <TableCell align="right">{formatodivisa.format(row['PRECIO PROVEEDOR X CANTIDAD'])}</TableCell>
                      
                    </TableRow>
                    
                    ))}
                    
                  </TableBody>
              </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={5}>
            <Typography variant='h6' component={"h2"} sx={{ my: 2, textTransform:'capitalize',fontWeight:'bold' }}>Estado de resultados para </Typography>
            <Typography variant='h6' component={"h2"} sx={{ fontSize:16, color:blue[400]}}>Venta 1 incluye cancelados y rechazados.</Typography>
            <Typography variant='h6' component={"h2"} sx={{fontSize:16, color:green[400]}}>Venta 2 resta en el totalde la venta rechazados y cancelados.</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500, height:200 , overflowY:'hidden',  }} size="small"  aria-label="simple table">
              <TableHead sx={{backgroundColor:grey[800]}}>
                  <TableRow>
                  <TableCell align="left" sx={{color:'white',fontSize: 12}}></TableCell>
                    <TableCell align="left" sx={{color:'white',fontSize: 12}}>VALOR</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                  <TableRow sx={{backgroundColor:blue[400]}}>
                    <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                        Venta 1
                      </TableCell>
                      <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                        {formatodivisa.format(venta1['TOTAL DE LA ORDEN'])}
                      </TableCell>
                  </TableRow>
                  <TableRow sx={{backgroundColor:green[400]}}>
                    <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                        Venta 2
                      </TableCell>
                      <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                      {formatodivisa.format(venta2)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                        Entregado
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatodivisa.format(totalEntregado)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                        Costo mercancia
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(costoMercancia)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Fletes
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(precioFlete)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Fletes devolución
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(fletesDevolucion)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Fletes ordenes devueltas 
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(fletesOrdenesDeVuelta)}
                      </TableCell>
                  </TableRow>
                  <TableRow sx={{backgroundColor:blue[400]}}>
                    <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                      Utilidad 1 
                      </TableCell>
                      <TableCell component="th" scope="row" sx={{color:utilidad1 > 0 ? 'black' : 'red', fontWeight:'bold'}}>
                        {formatodivisa.format(utilidad1 ? utilidad1 : 0)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Publicidad  
                      </TableCell>
                      <TableCell component="th" scope="row">
                      <FormControl  variant="standard">
                      <Input
                        type='number'
                        value={publicidad}
                        onChange={e => setPublicidad(parseFloat(e.target.value))}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      />
                      </FormControl>
                      </TableCell>
                  </TableRow>
                  <TableRow sx={{backgroundColor:green[400]}}>
                    <TableCell component="th" scope="row" sx={{fontWeight:'bold'}}>
                      Utilidad 2  
                      </TableCell>
                      <TableCell component="th" scope="row" sx={{color:utilidad2 > 0 ? 'black' : 'red', fontWeight:'bold'}}>
                      {formatodivisa.format(utilidad2 ? utilidad2 : 0)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Cancelados + rechezados 
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(RechCan)}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Devueltas 
                      </TableCell>
                      <TableCell component="th" scope="row">
                      {formatodivisa.format(totalDevolucion)}
                      </TableCell>
                  </TableRow>
                  </TableBody>
              </Table>
              </TableContainer>  
            </Grid>
        </Grid>
        </Box>
    </Layout>
    
  )
}

export default InformeDropi