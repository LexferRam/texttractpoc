'use client'
import React from 'react';
import './styles.css'
import ButtonsActions from './_components/ButtonsActions';
import { prompts } from './const/prompts';

const App: React.FC = () => {

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
