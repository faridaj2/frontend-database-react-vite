/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import AllUtils from '../../utils/AllUtils'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, Button, Divider, Input } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react"
import { IoCloudUploadOutline } from "react-icons/io5"
import { FaFilePdf } from "react-icons/fa6"
import AuthUser from '../../utils/AuthUser';
import ConfirmDeleteBerkas from '../../components/ConfirmDeleteBerkas';

import ViewPdf from '../../components/ViewPdf';

//Toastify

import DashboardTemplate from '../../components/DashboardTemplate'

const KelolaBerkas = () => {
    const { http } = AuthUser()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { nis } = useParams()
    const [siswa, setSiswa] = useState()
    const { getSantri, toast, ToastContainer, toastInfo, toastSuccess, getBerkasSiswa } = AllUtils()
    const inputFile = useRef(null)

    const [file, setFile] = useState()
    const [namaBerkas, setNamaBerkas] = useState()

    const [daftar, setDaftar] = useState()
    const [openModal, setOpenModal] = useState(false)

    const [berkasToDelete, setBerkasToDelete] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])




    useEffect(() => {
        document.title = 'Kelola Berkas'
        getSantri(nis, setSiswa)
    }, [])
    useEffect(() => {
        if (siswa) getListBerkas()
    }, [siswa])

    const getListBerkas = () => getBerkasSiswa(siswa.id, setDaftar)

    const uploadEvent = () => inputFile.current.click()
    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setFile(file)
    }
    const changeInput = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        setFile(file)
    }
    const getSize = (size) => {
        if (!size) return '0 b'
        if (size < 1024) {
            return size + ' b';
        } else if (size < 1048576) {
            return (size / 1024).toFixed(2) + ' KB';
        } else {
            return (size / 1048576).toFixed(2) + ' MB';
        }
    }
    const uploadFile = (onClose) => {
        if (!file) return toastInfo('File tidak boleh kosong');
        if (file.name.split('.').pop() !== 'pdf') return toastInfo('File harus berupa PDF');
        if (!namaBerkas) return toastInfo('Harap isi nama berkas')
        const formData = new FormData();
        formData.append('id', siswa?.id);
        formData.append('nama_berkas', namaBerkas);
        formData.append('file', file);

        toast.promise(
            http.post('/api/upload-berkas-siswa', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }),
            {
                pending: 'Mengunggah File',
                success: 'Permintaan Selesai, Menunggu Status',
                error: 'Terjadi kesalahan'
            }
        )
            .then(response => {
                if (response && response.status === 200) {
                    toastSuccess('Status: Sukses, Berhasil diupload')
                    onClose()
                    setFile()
                    setNamaBerkas()
                    getBerkasSiswa(siswa?.id, setDaftar)
                } else {
                    // Lempar ke blok .catch() untuk respons dengan status selain 200
                    throw new Error(response)
                }
            })
            .catch(error => {
                toastInfo('Terjadi Kesalahan hubungi developer')
                onClose()
                setFile()
                setNamaBerkas()

            });
    };

    const handleOpenModal = (e) => {
        setOpenModal(true)
        setBerkasToDelete(e)
    }
    const deleteFile = (id) => {
        http.delete(`/api/hapus-berkas/${id}`)
            .then(data => {
                getListBerkas()
                toastSuccess('Berkas berhasil dihapus')
            })
            .catch(data => {
                console.log(data)
                toastInfo('Terjadi kesalahan hubungi pengembang')
            })
    }
    const [viewModal, setViewModal] = useState()
    const [urlPdf, setUrlPdf] = useState()
    const getUrlPdf = (berkas) => {
        http.get(`/api/get-url-pdf/${berkas}`)
            .then(res => {
                setUrlPdf(res.data)
            })
            .catch(res => console.log(res))
    }

    const openViewModal = (pdf) => {
        setUrlPdf(null)
        getUrlPdf(pdf.berkas)
        setViewModal(true)
    }




    return (
        <DashboardTemplate>
            <ToastContainer />
            <div className='w-full flex gap-2 flex-col'>
                <Card className='w-full'>
                    <CardHeader className='w-full'>
                        <div className='flex justify-between items-center w-full'>
                            <h1 className='font-bold'>Kelola Berkas Untuk <span className='text-violet-600'> <Link to={`/dashboard/data-santri/detail/${siswa?.nis}`}>{siswa?.nama_siswa}</Link> </span> </h1>
                            <Button size='sm' color='primary' onPress={onOpen}>Tambah Berkas</Button>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Table aria-label="Example static collection table" className='mt-2'>
                            <TableHeader>
                                <TableColumn>BERKAS</TableColumn>
                                <TableColumn>ACTION</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {
                                    daftar?.map(file => (
                                        <TableRow key={file.id}>
                                            <TableCell>
                                                {file.nama_berkas}
                                            </TableCell>
                                            <TableCell className='flex gap-2'>
                                                <Button size='sm' color='primary' onClick={() => openViewModal(file)}>Lihat</Button>
                                                <Button size='sm' color='danger' onClick={() => handleOpenModal(file)}>Hapus</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }


                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
            <ConfirmDeleteBerkas openModal={openModal} setOpenModal={setOpenModal} deleteBerkas={deleteFile} berkas={berkasToDelete} />
            <ViewPdf viewModal={viewModal} setViewModal={setViewModal} berkas={urlPdf} />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Upload File</ModalHeader>
                            <ModalBody>
                                <div className='outline outline-1 outline-gray-400 rounded-md p-2 flex items-center overflow-hidden'>
                                    <div className='mr-3 ml-2'>
                                        <FaFilePdf className='text-4xl' />
                                    </div>
                                    <div className='w-full text-right truncate'>
                                        <span className='font-bold text-gray-950'>{file ? file?.name : 'Tidak ada berkas terpilih'}</span>
                                        <Divider />
                                        <span className='text-tiny text-gray-500'>{getSize(file?.size)}</span>
                                    </div>
                                </div>
                                <div>
                                    <Input className='outline outline-1 outline-gray-400 rounded-md' onValueChange={setNamaBerkas} value={namaBerkas} label="Masukkan Nama File" />
                                </div>
                                <div onClick={uploadEvent} onDragOver={e => e.preventDefault()} onDrop={handleDrop} className='w-full outline outline-1 outline-gray-400 py-5 flex flex-col justify-center items-center rounded-md bg-gray-50 hover:bg-gray-200 cursor-pointer'>
                                    <IoCloudUploadOutline className='text-9xl text-gray-700' />
                                    <span className='text-gray-700 text-tiny'>Klik atau jatuhkan File untuk mengupload</span>
                                    <input type="file" className='hidden' ref={inputFile} onChange={changeInput} />
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button isIconOnly color="primary" onClick={() => uploadFile(onClose)}>
                                    <IoCloudUploadOutline className='text-xl font-bold' />
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </DashboardTemplate>
    )
}


export default KelolaBerkas