import { Query } from "@aws-sdk/client-textract";

export const venezuelanIdQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "What is the venezuelan id?", // required
    Alias: "Nro de cedula",
  },
  {
    // Query
    Text: "NOMBRES", // required
    Alias: "Nombres",
  },
  {
    // Query
    Text: "APELLIDOS", // required
    Alias: "Apellidos",
  },
  {
    // Query
    Text: "Director", // required
    Alias: "Director",
  },
  {
    // Query
    Text: "What is the date of birth?", // required
    Alias: "F de nacimiento",
  },
  {
    // Query
    Text: "What is the first date in F EXPEDICION?", // required
    Alias: "F de expedicion",
  },
  {
    // Query
    Text: "What is the last date?", // required
    Alias: "F de vencimiento",
  },
  {
    // Query
    Text: "What is the edo civil?", // required
    Alias: "Edo civil",
  },
];

export const venezuelanCirculationCertificateQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "Which the id number?", // required
    Alias: "Serial de motor",
  },
  {
    // Query
    Text: "placa", // required
    Alias: "Placa",
  },
  {
    // Query
    Text: "What is the name?", // required
    Alias: "Nombre completo",
  },
  {
    // Query
    Text: "What is the venezuelan id?", // required
    Alias: "Cedula",
  },
  {
    // Query
    Text: "which the vehicle properties?", // required
    Alias: "Propiedades del vehiculo",
  },
  {
    // Query
    Text: "what is the year or date?", // required
    Alias: "Edad del vehiculo",
  },
  {
    // Query
    Text: "Serial N.I.V.", // required
    Alias: "Serial de carroceria",
  },
  {
    // Query
    Text: "what is the weight?", // required
    Alias: "Peso",
  },
  {
    // Query
    Text: "number of ejes", // required
    Alias: "Cantidad de ejes",
  },
  {
    // Query
    Text: "letters next to the word ejes", // required
    Alias: "Color del vehiculo",
  },
  {
    // Query
    Text: "number of ptos", // required
    Alias: "Cantidad de puestos",
  },
];

export const InvoiceQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "Factura N", // required
    Alias: "Numero de factura",
  },
  {
    // Query
    Text: "What is the main RIF?", // required
    Alias: "RIF Factura",
  },
  {
    // Query
    Text: "N de control", // required
    Alias: "Numero de control",
  },
  {
    // Query
    Text: "Nombre o razon social", // required
    Alias: "Nombre o razon social",
  },
  {
    // Query
    Text: "Domicilio fiscal", // required
    Alias: "Domicilio fiscal",
  },
  {
    // Query
    Text: "Condiciones de pago | cond de pago", // required
    Alias: "Condiciones de pago",
  },
  {
    // Query
    Text: "Telefono", // required
    Alias: "Telefono",
  },
  {
    // Query
    Text: "What is the fecha or fecha de emision?", // required
    Alias: "Fecha de emision",
  },
  {
    // Query
    Text: "Base imponible", // required
    Alias: "Base imponible",
  },
  {
    // Query
    Text: "Monto exento", // required
    Alias: "Monto exento",
  },
  {
    // Query
    Text: "What is the Subtotal?", // required
    Alias: "Subtotal",
  },
  {
    // Query
    Text: "What is the Total?", // required
    Alias: "Monto total",
  },
];

export const RifQueries: Query[] = [
  {
    // Query
    Text: "What is N comprobante code?", // required
    Alias: "Nro comprobante",
  },
  {
    // Query
    Text: "Domicilio Fiscal", // required
    Alias: "Domicilio fiscal",
  },
  {
    // Query
    Text: "What is the Fecha de inscripcion?", // required
    Alias: "Fecha inscripcion",
  },
  {
    // Query
    Text: "What is the Fecha de ultima actualizacion", // required
    Alias: "Fecha de ultima actualizacion",
  },
  {
    // Query
    Text: "What is the Fecha de vencimiento", // required
    Alias: "Fecha de vencimiento",
  },
  {
    // Query
    Text: "What is the Firma autorizada code?", // required
    Alias: "Firma autorizada",
  },
];
