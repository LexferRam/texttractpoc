import { useEffect, useState } from "react";

export const useMobileDevices = () => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileDevice(window.innerWidth < 420); 
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
    return {
        isMobileDevice
    }
}
