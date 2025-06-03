'use client'
import React, { useEffect, useState } from 'react';
import './styles.css'
import ButtonsActions from './_components/ButtonsActions';
import { prompts } from './const/prompts';

const App: React.FC = () => {
      const [localIp, setLocalIp] = useState('');
  console.log('🚀 ~ App ~ localIp:', localIp);

  useEffect(() => {
    const getLocalIP = async () => {
      const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;

      const pc = new RTCPeerConnection({
        iceServers: [],
      });

      pc.createDataChannel('');

      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const ipMatch = ipRegex.exec(ice.candidate.candidate);
          if (ipMatch) {
            setLocalIp(ipMatch[0]);
            pc.onicecandidate = null; 
          }
        }
      };
    };

    getLocalIP();
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
