import imageCompression from 'browser-image-compression';
import AuthUser from './AuthUser'
const { http } = AuthUser()

const CompressUpload = async (image, id) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    try {
        const compressedFile = await imageCompression(image, options)
        const formData = new FormData()
        formData.append('foto', compressedFile)
        formData.append('id', id)
        http.post('api/simpan-siswa', formData)
            .then(res => console.log(res))
            .catch(res => console.log(res))

    } catch (err) {
        console.log(err)
    }
}

export default CompressUpload;