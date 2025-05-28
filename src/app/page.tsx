'use client'

// LIBRARIES - ICONS --------------------
import { useRef, useState } from "react";
import Button from '@mui/material/Button';
import { IconButton, styled, Tooltip } from "@mui/material";
import { Camera } from "react-camera-pro";

// ICONS ------------------------------
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LocalSeeIcon from '@mui/icons-material/LocalSee';

// COMPONENTS ------------------------------
import CameraGuideLines from "./_components/CameraGuideLines";
import QueryResultDisplay from "./_components/QueryResultDisplay";
import ScannedImagePreview from "./_components/ScannedImagePreview";
import TakePictureButton from "./_components/TakePictureButton";
import { useMobileDevices } from "./hooks/useMobileDevices";
import useTextractAnalizedImage from "./hooks/useTextractAnalizedImage";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  // width: 1,
});

export default function Home() {
  const camera = useRef(null) as any;
  const fileInputRef = useRef(null) as any;

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [hasPermission, setHasPermission] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { analizeImage } = useTextractAnalizedImage({ setLoading, setResult, setShowCameraPreview })
  const { isMobileDevice } = useMobileDevices()

  const handleImageChange = async (file: any) => {
    if (file) {
      setImage({
        ...image,
        uri: URL.createObjectURL(file),
        file: file,
        bufferArray: await file.arrayBuffer(),
      });

      let fileBuffer = await file.arrayBuffer()
      await analizeImage(fileBuffer, 'ci')
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

        <p style={{ color: 'gray'}}>
          Cédula de Identidad o RIF:
        </p>

        <Tooltip title="Subir Documento">
          <IconButton
            onClick={() => fileInputRef.current.click()}
            aria-label="delete"
            style={{color: '#46c0b7'}}
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>

        <VisuallyHiddenInput
          ref={fileInputRef}
          type="file"
          capture={isMobileDevice ? 'environment' : undefined}
          onChange={(e) => {
            setShowCameraPreview(false)
            setResult(null)
            handleImageChange(e.target.files ? e.target.files[0] : null)
          }}
          multiple
        />

        <Tooltip title="Escanear Documento">
          <IconButton
            style={{color: '#46c0b7'}}
            onClick={async () => {
              setShowCameraPreview(true)
              await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
              setHasPermission(true);
              setResult(null)
              setImage(null)
            }}
          >
            <DocumentScannerIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>

      <div  style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
        <ScannedImagePreview image={image} />
      </div>

      {showCameraPreview && hasPermission && <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
          margin: 0,
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        <div style={{ position: 'relative', width: '300px', height: '100%', margin: 'auto' }}>
          <Camera
            ref={camera}
            aspectRatio={1 / .6}
            facingMode='environment'
            errorMessages={{
              noCameraAccessible: 'No se puede acceder a la cámara.',
              permissionDenied: 'Permiso denegado para usar la cámara.',
              switchCamera: 'Error al cambiar de cámara.',
              canvas: 'Error con el canvas.'
            }}
          />
          <CameraGuideLines />
          <TakePictureButton
            camera={camera}
            image={image}
            setImage={setImage}
            analizeImage={analizeImage}
            documentType='ci'
          />
        </div>
      </div>}

      <QueryResultDisplay result={result} />
    </div>
  );
}
