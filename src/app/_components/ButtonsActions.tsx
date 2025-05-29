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
import UploadFileIcon from '@mui/icons-material/UploadFile';

// COMPONENTS ------------------------------
import CameraGuideLines from "./CameraGuideLines";
import QueryResultDisplay from "./QueryResultDisplay";
import ScannedImagePreview from "./ScannedImagePreview";
import TakePictureButton from "./TakePictureButton";
import { useMobileDevices } from "../hooks/useMobileDevices";
import useTextractAnalizedImage from "../hooks/useTextractAnalizedImage";
import SimpleBackdrop from "./BackDrop";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
});

const ButtonsActions = ({
    description,
    documentType
}: any) => {
    const camera = useRef(null) as any;
    const fileInputRef = useRef(null) as any;
    const scannedImageRef = useRef(null) as any;

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
            await analizeImage(fileBuffer, documentType)
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleBackdrop open={loading} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

                <p style={{ color: 'gray', textAlign: 'center' }}>
                    {description}:
                </p>

                <Tooltip title="Subir Documento">
                    <IconButton
                        onClick={() => fileInputRef.current.click()}
                        aria-label="delete"
                        style={{ color: '#46c0b7' }}
                    >
                        <UploadFileIcon />
                    </IconButton>
                </Tooltip>

                <VisuallyHiddenInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => {
                        setShowCameraPreview(false)
                        setResult(null)
                        handleImageChange(e.target.files ? e.target.files[0] : null)
                    }}
                    multiple
                />

                {isMobileDevice && (
                    <>
                    <Tooltip title="Escanear Documento">
                    <IconButton
                        onClick={() => scannedImageRef.current.click()}
                        aria-label="delete"
                        style={{ color: '#46c0b7' }}
                    >
                        <DocumentScannerIcon />
                    </IconButton>
                </Tooltip>

                <VisuallyHiddenInput
                    ref={scannedImageRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    capture={isMobileDevice ? 'environment' : 'user'}
                    onChange={(e) => {
                        setShowCameraPreview(false)
                        setResult(null)
                        handleImageChange(e.target.files ? e.target.files[0] : null)
                    }}
                    multiple
                /></>)}
                {/*}
                <Tooltip title="Escanear Documento">
                    <IconButton
                        style={{ color: '#46c0b7' }}
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
                </Tooltip> */}
            </div>

            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
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
                        documentType={documentType}
                    />
                </div>
            </div>}

            <QueryResultDisplay result={result} />
        </div>
    )
}

export default ButtonsActions