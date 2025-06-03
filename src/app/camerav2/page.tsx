'use client'
import React, { useEffect, useState } from 'react';
import './styles.css'
import ButtonsActions from './_components/ButtonsActions';
import { prompts } from './const/prompts';

const App: React.FC = () => {

  useEffect(() => {
    var url = location.protocol + '//' + location.host;
    console.log(url);
  }, []);

    return (
        <div className='mainContainer'>
            <ButtonsActions
                description="Cédula de Identidad o RIF:"
                promptText={prompts['CI_RIF']}
            />
            <hr />
            <ButtonsActions
                description="Carnet de circulación o Título de propiedad"
                promptText={prompts['CC_CV']}
            />
        </div>
    );
};

export default App;
