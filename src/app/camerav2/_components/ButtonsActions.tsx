'use client'
import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { extractInfoFromImage } from '../services/geminiService';
import { LoadingSpinner } from '../_components/LoadingSpinner';
import '../styles.css'
import { IconButton, styled, Tooltip } from '@mui/material';
// ICONS ------------------------------
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ImageDataForApi } from '../types/types';
import { useMobileDevices } from '@/app/hooks/useMobileDevices';

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
    promptText,
    capture = false
}: any) => {
    const fileInputRef = useRef(null) as any;
    const scannedImageRef = useRef(null) as any;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageDataForApi, setImageDataForApi] = useState<ImageDataForApi | null>(null);
    const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isMobileDevice } = useMobileDevices()

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, promptText: String) => {
        setExtractedInfo(null);
        setError(null);
        setImageDataForApi(null);
        setImagePreviewUrl(null);
        setSelectedFile(null);

        const files = event.target.files;

        if (files && files.length > 0) {
            const file = files[0];
            // if (!file.type.startsWith('image/')) {
            //     setError('Por favor ingrese un formato válido (PNG, JPEG, GIF, WEBP, etc.).');
            //     return;
            // }
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setImagePreviewUrl(dataUrl);

                const parts = dataUrl.split(',');
                if (parts.length === 2) {
                    const mimeTypePart = parts[0].split(':')[1].split(';')[0];
                    const base64Data = parts[1];
                    setImageDataForApi({ base64: base64Data, mimeType: mimeTypePart });
                    handleSubmit({ base64: base64Data, mimeType: mimeTypePart, promptText })
                } else {
                    setError('Invalid image file format. Could not read base64 data.');
                    setImagePreviewUrl(null);
                    setImageDataForApi(null);
                }
            };
            reader.onerror = () => {
                setError('Failed to read image file.');
                setImagePreviewUrl(null);
                setImageDataForApi(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async ({ base64, mimeType, promptText }: any) => {
        if (!base64 || !mimeType) {
            setError('Por favor, seleccione una imagen.');
            return;
        }
        if (!promptText.trim()) {
            setError('Please enter a prompt or question about the image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setExtractedInfo(null);

        try {
            const result: any = await extractInfoFromImage(
                base64,
                mimeType,
                promptText
            );
            setExtractedInfo(result);
        } catch (apiError: any) {
            setError(apiError.message || 'An unexpected error occurred.');
            console.error("API Error:", apiError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <label
                    htmlFor="imageUpload"
                    className="labelDescription"
                >
                    {description}
                </label>

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
                    id="imageUpload"
                    ref={fileInputRef}
                    type="file"
                    accept="*"//"image/jpeg, image/png"
                    capture={capture ? 'environment' : undefined}
                    onChange={(e) => handleImageChange(e, promptText)}
                />
                {imagePreviewUrl && (
                    <div className='imagePreviewContainer'>
                        {selectedFile?.type.includes("pdf") ? (
                            <iframe className="document-analyze" src={imagePreviewUrl} />
                        ) : (
                            <img
                                src={imagePreviewUrl}
                                alt="Selected preview"
                                className="imagePreview"
                            />
                        )}
                    </div>
                )}

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
                            capture={isMobileDevice ? 'environment' : undefined}
                            onChange={(e) => handleImageChange(e, promptText)}
                        />
                <span>
                    {selectedFile ? `${selectedFile.name}` : null}
                </span>
            </div>

            {(isLoading || error || extractedInfo) && (
                <section>
                    {isLoading && <LoadingSpinner />}
                    {error && (
                        <div>
                            <p>Error:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {extractedInfo && !isLoading && (
                        <div className='extractedInfoContainer'>
                            <pre>
                                {extractedInfo}
                            </pre>
                        </div>
                    )}
                </section>
            )}
        </>
    )
}

export default ButtonsActions