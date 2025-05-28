import React from 'react'

const CameraGuideLines = () => {
    return (
        < div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
        }>
            {/* Marco exterior */}
            < div style={{
                width: '98%',
                height: '98%',
                border: '2px dashed rgba(255, 255, 255, 0.7)',
                borderRadius: '4px',
                position: 'relative'
            }}>
                {/* Guía para la posición de la cabeza */}
                {/* < div style={{
                    position: 'absolute',
                    top: '46%',
                    right: '11%',
                    height: '22%',
                    width: '15%',
                    border: '2px dashed rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%'
                }} /> */}

                {/* Guía para los hombros */}
                {/* <div style={{
                    position: 'absolute',
                    top: '71%',
                    right: '4%',
                    // transform: 'translateX(-50%)',
                    width: '30%',
                    height: '20%',
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
                }} /> */}

            </div >
        </div >
    )
}

export default CameraGuideLines