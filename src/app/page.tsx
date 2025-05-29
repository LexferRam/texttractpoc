import React from 'react';
import ButtonsActions from './_components/ButtonsActions';
export default function Home() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ButtonsActions description="Cédula de Identidad o RIF" documentType='ci'/>
      <ButtonsActions description="Carnet de circulación o Título de propiedad" documentType='cc'/>
    </div>
  );
}
