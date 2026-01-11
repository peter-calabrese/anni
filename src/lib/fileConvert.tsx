import heic2any from 'heic2any';

// From file input
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9 // 0 to 1
        });

        // Create URL for preview or upload
        const url = URL.createObjectURL(convertedBlob as Blob);
        console.log(url);

        // Or create a File object
        const convertedFile = new File(
            [convertedBlob as Blob],
            file.name.replace(/\.heic$/i, '.jpg'),
            { type: 'image/jpeg' }
        );

    } catch (error) {
        console.error('Conversion failed:', error);
        alert('Could not convert this HEIC file. Please try another image.');
    }
};