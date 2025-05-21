'use client'
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import { Fab, IconButton, styled, Tooltip } from "@mui/material";
import { Camera } from "react-camera-pro";

// AWS SDK ------------------------------
import {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandInput,
  AnalyzeDocumentCommandOutput,
} from "@aws-sdk/client-textract";

// ICONS ------------------------------
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import getDocumentQueries from "@/utils/getDocumentQueries";
import LocalSeeIcon from '@mui/icons-material/LocalSee';

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
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [hasPermission, setHasPermission] = useState(false);
  const [result, setResult] = useState<any>(null);

  function base64ToFile(base64String: any, filename: any, mimeType: any) {
    // Remove the data URL prefix if present (e.g., "data:image/png;base64,")
    const base64WithoutPrefix = base64String.split(';base64,').pop();

    // Convert the Base64 string to a binary string
    const binaryString = atob(base64WithoutPrefix);

    // Create a Uint8Array from the binary string
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return the File object
    return new File([bytes], filename, { type: mimeType });
  }

  const client = new TextractClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY || "",
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET || "",
    },
  });

  const handleImageChange = async (file: any) => {
    if (file) {
      setImage({
        ...image,
        uri: URL.createObjectURL(file),
        file: file,
        bufferArray: await file.arrayBuffer(),
      });

      let fileBuffer = await file.arrayBuffer()
      await analizeImage(fileBuffer)
    }
  };

  const isVenezuelanIdCard = (idCard: string) => {
    const regex = /^[V|E|J|P][0-9]{5,9}$/;
    return regex.test(idCard);
  };

  const analizeImage = async (file: any) => {
    setLoading(true)

    const command = new AnalyzeDocumentCommand({
      // AnalyzeDocumentRequest
      Document: {
        // Document
        Bytes: file
          ? new Uint8Array(file)
          : undefined, // e.g. Buffer.from("") or new TextEncoder().encode("")
      },
      FeatureTypes: [
        // FeatureTypes // required
        "QUERIES",
      ],
      QueriesConfig: {
        // QueriesConfig
        Queries: getDocumentQueries('ci'),
      },
    });
    const response: AnalyzeDocumentCommandOutput = await client.send(command);

    console.log(response)

    if (response) {
      const data: any = [];
      const blocks = response.Blocks;
      const lines = blocks?.filter((line) => line.BlockType === "LINE") ?? [];

      const cedIndex = lines?.findIndex((line) => {
        if (line?.Text) {
          return isVenezuelanIdCard(line.Text);
        }
      });

      const queries = blocks
        ? blocks?.filter((query) => query.BlockType === "QUERY")
        : null;
      const queriesResult = blocks
        ? blocks?.filter((query) => query.BlockType === "QUERY_RESULT")
        : null;


      if (queries && queriesResult) {
        queries?.map((query) => {
          let id =
            query.Relationships && query.Relationships[0].Ids
              ? query?.Relationships[0]?.Ids[0]
              : null;
          let found = queriesResult?.find((result) => result.Id === id);

          if (found && query.Query?.Alias && found.Text) {
            // generalConfidenceValues.push(found?.Confidence ?? 0);
            data.push({
              key: query?.Query?.Alias,
              value: found?.Text,
              confidence: found?.Confidence,
            });
          }
        });
      }
      setResult(data);
      setLoading(false)

    } else {
      console.error('ERROR ANALIZANDO CON TEXTRACT')
    }
  }

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768); // Ajusta el valor según tus necesidades
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className={styles.page}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            loading={loading}
            loadingPosition="start"
            startIcon={<CloudUploadIcon fontSize="small" />}
            style={{ textTransform: 'capitalize', backgroundColor: 'rgb(252, 45, 34)', color: 'white' }}
            onClick={() => setShowCameraPreview(false)}
          >
            Cargar Documento
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                setShowCameraPreview(false)
                handleImageChange(e.target.files ? e.target.files[0] : null)
              }}
              multiple
            />
          </Button>

        {isMobileDevice && <Tooltip title="Acceder a la camara">
          <IconButton color="success" onClick={async() => {
            setShowCameraPreview(true)
            await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false // cambiar a true si necesitas audio
            });
            setHasPermission(true);
          }}>
            <LocalSeeIcon fontSize="medium" />
          </IconButton>
        </Tooltip>}

        {image ? (
          <div>
            {image?.file?.type.includes("pdf") ? (
              <iframe className="document-analyze" src={image.uri} />
            ) : (
              <img src={image.uri} className="image-analyze" />
            )}
            <p>{image?.file?.name}</p>
          </div>
        ) : null}
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
            // numberOfCamerasCallback={setNumberOfCameras}
            facingMode='environment'
            errorMessages={{
              noCameraAccessible: 'No se puede acceder a la cámara.',
              permissionDenied: 'Permiso denegado para usar la cámara.',
              switchCamera: 'Error al cambiar de cámara.',
              canvas: 'Error con el canvas.'
            }}
          />
          {/* Líneas guía para foto de carnet */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Marco exterior */}
            <div style={{
              width: '98%',
              height: '98%',
              border: '2px dashed rgba(255, 255, 255, 0.7)',
              borderRadius: '4px',
              position: 'relative'
            }}>
              {/* Guía para la posición de la cabeza */}
              <div style={{
                position: 'absolute',
                top: '5%',
                left: '10%',
                height: '15%',
                width: '17%',
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '50%'
              }} />

              {/* Guía para los hombros */}
              <div style={{
                position: 'absolute',
                top: '22%',
                left: '18%',
                transform: 'translateX(-50%)',
                width: '30%',
                height: '10%',
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderTopLeftRadius: '100px 100px',
                borderTopRightRadius: '100px 100px',
                // borderBottom: 0,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                paddingTop: '10px'
              }} />

            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'absolute', transform: 'translate(0%, 30%)' }}>
            <Fab
              onClick={async () => {
                const photo: any = camera?.current?.takePhoto();
                console.log(photo)

                const file = base64ToFile(photo, 'example.png', "image/png")

                setImage({
                  ...image,
                  uri: URL.createObjectURL(file),
                  file: file,
                  bufferArray: await file.arrayBuffer(),
                });

                let fileBuffer = await file.arrayBuffer()
                await analizeImage(fileBuffer)
              }}
              aria-label='Tomar foto 1'
              color='primary'
            >
              <LocalSeeIcon fontSize="large" />
            </Fab>
          </div>
        </div>
      </div>}


    {result && result.length > 0 ? (
          <div className="grid-container">
            {result.map((res: any, index: any) => {
              return (
                <div
                  key={`data-doc-${index}`}
                  style={{
                    height: "auto",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h4 style={{ textAlign: "center", flex: 1 }}>{res.key}</h4>

                  <p style={{ textAlign: "center" }}>{res.value}</p>


                </div>
              );
            })}
          </div>
        ) : null}

    </div>
  );
}
