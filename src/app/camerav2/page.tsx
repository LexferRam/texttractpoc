"use client";
import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const IDCardScanner = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState<any>(null);
  const [model, setModel] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar el modelo de detección de objetos
  useEffect(() => {
    async function loadModel() {
      const loadedModel = await cocoSsd.load();
      console.log(loadedModel)
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  // Iniciar la cámara
  const startCamera = async () => {
    setScanning(true);
    setMessage('Escaneando...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      
      // Comenzar el escaneo periódico
      scanForID();
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setMessage('Error al acceder a la cámara');
    }
  };

  // Función para escanear en busca de una cédula
  const scanForID = async () => {
    //   if (!model || !scanning) return;
    //   console.log(model)
    //   console.log('scanForID')
    
    try {
      // Realizar detección de objetos
      const predictions = await model.detect(videoRef.current);

      console.log('predictions', predictions)
      
      // Buscar objetos que podrían ser una cédula (wallet, book, etc.)
      const idLikeObjects = predictions.filter((pred: any) => 
        ['book', 'wallet', 'laptop'].includes(pred.class)
      );

      console.log('idLikeObjects', idLikeObjects)
      
      if (idLikeObjects.length > 0) {
        // Tomar la foto
        takePhoto();
        setMessage('Cédula detectada!');
        setScanning(false);
      } else {
        // Continuar escaneando
        setTimeout(scanForID, 500);
      }
    } catch (err) {
      console.error("Error en detección:", err);
      setTimeout(scanForID, 1000);
    }
  };

  // Tomar la foto
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas: any = canvasRef.current;
    
    if (!video || !canvas) return;
    
    // Ajustar dimensiones del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar el frame actual del video en el canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir a URL de datos
    const photoDataUrl = canvas.toDataURL('image/jpeg');
    setPhoto(photoDataUrl);
    
    // Detener la cámara
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((track: any) => track.stop());
    }
  };

  return (
    <div className="scanner-container">
      <h2>Escáner de Cédula de Identidad</h2>
      
      {!scanning && !photo && (
        <button onClick={startCamera}>Iniciar Escaneo</button>
      )}
      
      <div className="video-container" style={{ display: scanning ? 'block' : 'none' }}>
        <video ref={videoRef} autoPlay playsInline muted />
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {photo && (
        <div className="photo-preview">
          <h3>Foto capturada:</h3>
          <img src={photo} alt="Cédula capturada" style={{ maxWidth: '100%' }} />
        </div>
      )}
      
      {message && <p>{message}</p>}
    </div>
  );
};

export default IDCardScanner;
