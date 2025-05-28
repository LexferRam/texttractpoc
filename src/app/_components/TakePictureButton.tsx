import { Fab } from "@mui/material";
import LocalSeeIcon from '@mui/icons-material/LocalSee';
import { base64ToFile } from "../_utils/toolkit";

const TakePictureButton = ({
    camera,
    image,
    setImage,
    analizeImage,
    documentType
}: any) => {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'absolute', transform: 'translate(0%, 30%)'}}>
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
                    await analizeImage(fileBuffer, documentType);
                }}
                aria-label='Tomar foto 1'
                style={{color: '#46c0b7'}}
            >
                <LocalSeeIcon fontSize="medium" />
            </Fab>
        </div>
    )
}

export default TakePictureButton