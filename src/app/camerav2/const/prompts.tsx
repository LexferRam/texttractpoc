const prompts: any = {
    CI_RIF: "obten la siguiente informacion de la imagen o archivo pdf y retorna en formato JSON(valida realmente sea una cédula de identidad o RIF de venezuela, si no es una cédula o RIF sólo retorna el mensaje: 'Documento inválido'): número de identificación, nombre, apellidos, fecha de vencimiento, tipo de identificación (cédula o RIF)",
    CC_CV: "Eres un experto en capturar la información de un carnet de informacion y marcas, modelos de autos en Venzuela, obten la siguiente informacion de la imagen y retorna en formato JSON(valida realmente sea un carnet de circulación de venezuela, si no es un carnet de circulación válido retorna el mensaje: 'Documento inválido'): año del vehiculo(si viene en formato 2015/2016, tomar el primer año, ejemplo: 2015), marca, modelo, placa, serial de motor(buscar sólo si es un título de propiedad, de los contrario retornar un string vacio), serial carroceria N.I.V o NIV, color del carro, destinado o uso (ejemplo: particular, transporte público, etc), grupo(ejemplo: sport wagon, sedan etc), version(normalmente está junto con el modelo), si la imagen esta borrosa, no se puede leer, o no está alineado los bordes del carnet con los bordes de la camara, retorna el mensaje: 'No se pudo leer la imagen, por favor intenta con otra imagen'."
}

export {
    prompts
}