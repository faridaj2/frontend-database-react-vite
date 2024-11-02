/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import JsBarcode from 'jsbarcode';

import AuthUser from "../utils/AuthUser";


const IdCard = ({ template, photo, data, isDownload, setIsDownload }) => {
    const canvasRef = useRef(null)


    const fungsiDownloadCanvas = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Convert canvas content to data URL
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = data?.nama + ' (ID CARD).png';
        downloadLink.click();
    }

    function formatDateToIndonesian(dateString) {
        // Mendapatkan array dengan nama bulan dalam Bahasa Indonesia
        var months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        // Memisahkan tahun, bulan, dan tanggal dari string input
        var parts = dateString.split('-');
        var year = parts[0];
        var month = parseInt(parts[1]);
        var day = parts[2];

        // Mengubah bulan menjadi nama bulan dalam Bahasa Indonesia
        var monthName = months[month - 1];

        // Menggabungkan hasil menjadi format "YYYY Bulan dd"
        var formattedDate = day + ' ' + monthName + ' ' + year;

        return formattedDate;
    }

    const getExp = (formal) => {
        if (data?.status === 'nonactive') return 'Masa berlaku telah habis'
        if (data?.status === 'pending') return 'Menunggu status'

        // get date now
        const nowDate = new Date()

        let total = 0
        let firstChar
        if (formal === null) {
            total = 4
        } else {
            firstChar = formal.substring(0, 1)
            if (isNaN(firstChar)) {
                total = 4
            }
        }
        const first = parseInt(firstChar)
        if (first === 1) total = 3
        if (first === 2) total = 2
        if (first === 3) total = 1
        nowDate.setFullYear(nowDate.getFullYear() + total)
        return formatDateToIndonesian(nowDate.toISOString().split('T')[0])



    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const barcode = document.createElement("canvas")
        JsBarcode(barcode, data?.nis, {
            displayValue: false,
            width: 6,
            height: 70,
            background: "transparent"
        })
        const base64barcode = barcode.toDataURL()

        // Get Image
        const img = new Image();
        img.src = `data:image/jpeg;base64,${template}`
        img.onload = () => {
            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imgPhoto = new Image()
            imgPhoto.src = `data:image/jpeg;base64,${photo}`
            imgPhoto.onload = () => {
                // Calculate position and size for rounded image
                const x = 33;
                const y = 227;
                const width = 205;
                const height = 270;
                const radius = 30;

                // Draw rounded image
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(imgPhoto, x, y, width, height);
                ctx.restore()
            }
            imgPhoto.style.objectFit = 'cover'

            const imgBarcode = new Image()
            imgBarcode.src = base64barcode
            imgBarcode.onload = () => {
                ctx.drawImage(imgBarcode, 29, 516)
            }

            // Add text
            ctx.font = "bold 24px Arial";
            ctx.fillStyle = "black";
            // NIS
            ctx.fillText(': ' + data?.nis, 474, 291);
            // Nama
            ctx.fillText(': ' + data?.nama.toUpperCase(), 474, 322)
            // ttl
            ctx.fillText(': ' + (data?.tptLahir ? `${data?.tptLahir.toUpperCase()}, ` : '') + formatDateToIndonesian(data?.ttl), 474, 352)
            // Alamat
            // Tentukan lebar maksimum kotak untuk alamat
            const maxWidth = 530;
            const address = data?.alamat; // Ambil nilai alamat dari data

            // Pisahkan teks alamat menjadi bagian-bagian yang lebih kecil jika panjangnya melebihi maxWidth
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
                let lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = ctx.measureText(currentLine + ' ' + word).width;
                    if (width < maxWidth) {
                        currentLine += ' ' + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
                return lines;
            }

            // Tampilkan teks alamat dengan fungsi wrapText
            const wrappedAddress = wrapText(address, maxWidth);
            let y = 377; // Tentukan posisi awal y untuk teks alamat

            // Tampilkan setiap bagian teks alamat di kotak dengan posisi yang sesuai
            wrappedAddress.forEach(line => {
                ctx.fillText(': ' + line.toUpperCase(), 474, y);
                y += 25; // Sesuaikan jarak antar baris teks
            });
            // Masa Berlaku
            ctx.fillText(': ' + getExp(data?.formal), 474, 435)
        };
    }, [photo, template]);
    useEffect(() => {
        if (isDownload) {
            fungsiDownloadCanvas()
            setIsDownload(false)
        }
    }, [isDownload])

    return (
        <div>
            <canvas ref={canvasRef} className="w-full overflow-auto" />
        </div>
    );
};



export default function IdCardModal({ cardModal, setCardModal, dataSiswa, toastInfo }) {
    const { http } = AuthUser()
    const onOpenChange = () => {
        const action = cardModal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setCardModal(false)
    }
    const onOpen = () => {
        setCardModal(true)
    }
    const data = {
        nis: dataSiswa?.nis,
        nama: dataSiswa?.nama_siswa,
        ttl: dataSiswa?.tgl_lahir,
        alamat: dataSiswa?.alamat,
        formal: dataSiswa?.formal,
        status: dataSiswa?.status,
        tptLahir: dataSiswa?.tempat_lahir
    }

    const [isDownload, setIsDownload] = useState(false)

    const [photo, setPhoto] = useState('loading')
    const [template, setTemplate] = useState()

    const getBack = () => {
        onClose()
        toastInfo('Lengkapi foto untuk melihat Id Card')
    }
    useEffect(() => {
        http.get(`/api/get-image?id=${dataSiswa?.id}`)
            .then(res => {
                let data = res.data
                setPhoto(data.urlPhoto)
                setTemplate(data.urlTemplate)
            })
            .catch(() => {
                return getBack()

            }
            )
    }, [dataSiswa])

    return (
        <>
            <Modal isOpen={cardModal} onOpenChange={onOpenChange} backdrop="blur" >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ID CARD</ModalHeader>
                            <ModalBody>
                                {photo === 'loading' && (<Spinner />)}
                                {!photo && "Tambahkan foto untuk melihat IDCARD"}
                                {photo && photo !== 'loading' && (<IdCard template={template} photo={photo} data={data} isDownload={isDownload} setIsDownload={setIsDownload} />)}

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" isLoading={isDownload} onPress={() => setIsDownload(true)}>
                                    Download ID Card
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
