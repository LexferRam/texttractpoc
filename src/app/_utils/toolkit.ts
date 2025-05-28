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


export {
    base64ToFile
}