import React from 'react'

const ScannedImagePreview = ({
    image
}: any) => {
    return (
        <>
            {image ? (
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap: 10}}>
                    {image?.file?.type.includes("pdf") ? (
                        <iframe className="document-analyze" src={image.uri} />
                    ) : (
                        <img src={image.uri} className="image-analyze" />
                    )}
                    <p style={{ color: 'gray'}}>{image?.file?.name}</p>
                </div>
            ) : null}
        </>
    )
}

export default ScannedImagePreview