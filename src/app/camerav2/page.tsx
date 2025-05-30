'use client'
import React from 'react';
import './styles.css'
import ButtonsActions from './_components/ButtonsActions';

const App: React.FC = () => {

    return (
        <div className='mainContainer'>
            <ButtonsActions
                description="Cédula de Identidad o RIF:"
                promptText={'obten la siguiente informacion de la imagen o archivo pdf y retorna en formato JSON(valida realmente sea una cédula de identidad o RIF de venezuela, si no es un documento válido retorna el mensaje: "Documento inválido"): número de identificación, nombre, apellidos, fecha de vencimiento, tipo de identificación (cédula o RIF)'}
                capture={false}
            />
            <hr />
            <ButtonsActions
                description="Carnet de circulación o Título de propiedad"
                promptText={'obten la siguiente informacion de la imagen y retorna en formato JSON(valida realmente sea un carnet de circulación de venezuela, si no es un documento válido retorna el mensaje: "Documento inválido"): año del vehiculo, marca, modelo, placa, serial de motor(está arriba del nombre del titular), serial carroceria N.I.V o NIV, color del carro, destinado o uso (ejemplo: particular, transporte público, etc), grupo(ejemplo: sport wagon, sedan etc), version(normalmente está junto con el modelo)'}
                capture={false}
            />
        </div>
    );
};

export default App;
