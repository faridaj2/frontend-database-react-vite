/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Image, Chip, Tooltip, Accordion, AccordionItem } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from '@nextui-org/react';
import { FaWhatsapp } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";

import ConstKelas from '../../utils/KelasUtils';

// Icon
import { FaFilePdf } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md"
import { FaIdCard } from "react-icons/fa";

// Template
import DashboardTemplate from '../../components/DashboardTemplate'
import ViewPdf from '../../components/ViewPdf';
import IdCardModal from '../../components/IdCardModal';

// Utilitas
import getImage from '../../utils/getImage';
import AllUtils from '../../utils/AllUtils';
import AuthUser from '../../utils/AuthUser';



function DetailSiswa() {
    const { getSystem } = ConstKelas()
    const { nis } = useParams()
    const navigate = useNavigate()
    const { http, user } = AuthUser()


    const { getSantri, getBerkasSiswa, ToastContainer, toastInfo } = AllUtils()

    const [siswa, setSiswa] = React.useState()
    const [berkas, setBerkas] = React.useState()
    const [formal, setFormal] = useState()
    const [diniyah, setDiniyah] = useState()
    const [kamar, setKamar] = useState()

    useEffect(() => {
        document.title = 'Detail Siswa'
        getSantri(nis, setSiswa)
        getSystem('formal', setFormal)
        getSystem('diniyah', setDiniyah)
        getSystem('kamar', setKamar)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chekAccess = () => {
        const roles = JSON.parse(user.hak)
        if (!roles.includes('admin')) return 'hidden'
    }

    const findMatch = (match, type) => {
        const item = type?.find(entry => entry.key === match)
        if (item) {
            return item.label
        }
    }

    const StatusChip = () => {
        if (siswa?.status === 'active') return 'warning'
        if (siswa?.status === 'pending') return 'default'
        if (siswa?.status === 'nonactive') return 'danger'
    }

    const dataSiswa = [
        { label: "Nama Santri", tableName: siswa?.nama_siswa },
        { label: "Alamat Santri", tableName: siswa?.alamat },
        { label: "Kelas Formal", tableName: findMatch(siswa?.formal, formal) },
        { label: "Kelas Diniyah", tableName: findMatch(siswa?.diniyah, diniyah) },
        { label: "Tanggal Lahir", tableName: siswa?.tgl_lahir },
        { label: "Tempat Lahir", tableName: siswa?.tempat_lahir },
        { label: "Gender", tableName: siswa?.kelamin },
        { label: "Kamar", tableName: findMatch(siswa?.kamar, kamar) },
        { label: "Asal Sekolah", tableName: siswa?.asal_sekolah },


    ]

    const dataWali = [
        { label: "Nama Ayah", tableName: siswa?.nama_ayah },
        { label: "Nomor Ayah", tableName: siswa?.nomor_ayah },
        { label: "Nama Ibu", tableName: siswa?.nama_ibu },
        { label: "Nomor Ibu", tableName: siswa?.nomor_ibu },
    ]

    const dataPribadi = [
        { label: "Nama", tableName: siswa?.nama_siswa },
        { label: "NIS", tableName: siswa?.nis },
        { label: "NIK", tableName: siswa?.NIK },
        { label: "NISN", tableName: siswa?.NISN },
        { label: "KK", tableName: siswa?.KK },
        { label: "Domisili", tableName: siswa?.domisili },
        { label: "KIP", tableName: siswa?.KIP },
        { label: "Tahun Daftar", tableName: siswa?.tahun_daftar }
    ]

    const checkValue = (e) => {
        if (!e) return "------"
        return e
    }

    const waButton = (e) => {
        if (!e) return
        let number = e.toString()

        if (number.startsWith("0")) {

            number = "62" + e.slice(1)
            return window.open(`https://wa.me/${number}`)

        } else if (number.startsWith("8")) {
            number = "62" + number
            return window.open(`https://wa.me/${number}`)
        }
        return window.open(`https://wa.me/${number}`)
    }
    useEffect(() => {
        if (siswa) {
            getBerkasSiswa(siswa.id, setBerkas)
            getPembayaran()
        }
    }, [siswa])


    const [viewModal, setViewModal] = useState(false)
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
    const [downlaodLoading, setDownloadLoading] = useState(false)
    const downloadBerkas = (berkas, namaBerkas) => {
        setDownloadLoading(true)
        http({
            url: `/api/download-berkas/${berkas}`,
            method: 'GET',
            responseType: 'blob'
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = siswa?.nama_siswa + ' (' + namaBerkas + ').pdf'
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setDownloadLoading(false)
            })
            .catch(() => setDownloadLoading(false))
    }
    // Modal for id Card
    const [isModal, setIdmodal] = useState(false)

    // api for pembayaran
    const [pembayaran, setPembayaran] = useState([])
    const [done, setDone] = useState([])

    const getPembayaran = () => {
        http.get('/api/user/get-user-tagihan', {
            headers: { 'ID': siswa?.id }
        })
            .then(e => {
                setPembayaran(Object.values(e.data.pembayaran))
                setDone(Object.values(e.data.done))
            })
            .catch(e => console.log(e))
    }



    return (
        <DashboardTemplate>
            <ToastContainer />
            <div className='w-full flex gap-2 flex-col'>
                <div className='flex flex-col md:flex-row gap-2 w-full'>
                    <div className='w-full md:max-w-sm'>
                        <Card className='bg-transparent shadow-xl shadow-violet-700/30'>
                            <CardBody>
                                <Image
                                    width={1000}
                                    alt="Foto Profil Siswa"
                                    src={getImage(siswa)}
                                    className='w-full md:max-w-sm shadow-md shadow-violet-700/40'
                                />
                                <div className='flex flex-col gap-3 mt-5'>
                                    {dataPribadi.map(item => (
                                        <div className='flex flex-col gap-1' key={`detailSiswa` + item.label}>
                                            <div className='text-xs text-gray-500'>
                                                {item.label}
                                            </div>
                                            <div className='font-semibold text-base'>
                                                {checkValue(item.tableName)}
                                            </div>
                                        </div>
                                    ))}
                                    <div className='flex flex-col gap-1' >
                                        <div className='text-xs text-gray-500'>
                                            status
                                        </div>
                                        <div className='font-semibold text-base'>
                                            <Chip size='sm' className='text-white' color={StatusChip()}>{siswa?.status}</Chip>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className='grow flex flex-col gap-2'>
                        <Card className='w-full bg-white/30 backdrop:blur-md shadow-xl shadow-violet-700/30'>

                            <CardHeader className='flex flex-col items-start'>
                                <div className='font-semibold text-black text-base'>
                                    Detail Siswa
                                </div>
                            </CardHeader>
                            <CardBody className="grid gap-6 grid-cols-2">
                                {dataSiswa.map(item => (
                                    <div className='flex flex-col gap-1' key={`dataSiswa` + item.label}>
                                        <div className='text-xs text-gray-500'>
                                            {item.label}
                                        </div>
                                        <div className='font-semibold text-base'>
                                            {checkValue(item.tableName)}
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                        <Card className='w-full bg-white/30 backdrop:blur-md shadow-xl shadow-violet-700/30'>

                            <CardHeader className='flex flex-col items-start'>
                                <div className='font-semibold text-black text-base'>
                                    Detail Wali Santri
                                </div>
                            </CardHeader>
                            <CardBody className="grid gap-6 grid-cols-2">
                                {dataWali.map(item => (
                                    <div className='flex flex-col gap-1' key={`dataWali` + item.label}>
                                        <div className='text-xs text-gray-500'>
                                            {item.label}
                                        </div>
                                        <div className='font-semibold text-base'>
                                            {checkValue(item.tableName)}
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                            <CardFooter>
                                {siswa?.nomor_ayah && (
                                    <Button color='warning' className='font-semibold text-white flex items-center mr-2' onClick={() => waButton(siswa?.nomor_ayah)} >
                                        <FaWhatsapp /> No Ayah
                                    </Button>
                                )}
                                {
                                    siswa?.nomor_ibu && (
                                        <Button color='warning' className='font-semibold text-white flex items-center' onClick={() => waButton(siswa?.nomor_ibu)} >
                                            <FaWhatsapp /> No Ibu
                                        </Button>
                                    )
                                }
                            </CardFooter>
                        </Card>


                    </div>
                </div>
                <div className={`fixed z-50 right-5 bg-white p-2 shadow rounded-full ${chekAccess()}`}>
                    <div className='flex gap-2'>
                        <Tooltip content="Edit detail santri">
                            <Button className='rounded-full' color='primary' size='sm' variant="shadow" onClick={() => navigate(`/dashboard/data-santri/edit/${siswa?.nis}`)} isIconOnly>
                                <MdEdit className='text-xl' />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Export Id Card">
                            <Button className='rounded-full' color='primary' size='sm' variant="shadow" onClick={() => setIdmodal(true)} isIconOnly>
                                <FaIdCard />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className='w-full'>
                    <Card className='w-full shadow-xl shadow-violet-700/30'>
                        <CardHeader className='flex justify-between'>
                            <div className='font-semibold text-black text-base'>
                                Berkas Berkas Santri
                            </div>
                            <Button size='sm' color='primary' radius='lg' variant='shadow' onClick={() => navigate(`/dashboard/data-santri/${siswa?.nis}/kelola-berkas`)}>
                                Kelola Berkas
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div className='flex gap-2 flex-wrap justify-center md:justify-start'>
                                {
                                    berkas?.map(berkas => (
                                        <Card className='max-w-sm shadow-xl shadow-violet-700/30' key={berkas.id}>
                                            <CardHeader>
                                                <span className='font-semibold'>
                                                    {berkas.nama_berkas}
                                                </span>
                                            </CardHeader>
                                            <CardBody className='flex items-center justify-center'>
                                                <span className='text-9xl text-center'>
                                                    <FaFilePdf />
                                                </span>
                                            </CardBody>
                                            <CardFooter className='flex gap-2'>
                                                <Tooltip content="Lihat berkas">
                                                    <Button onClick={() => openViewModal(berkas)} size='sm' isIconOnly variant='shadow' radius='full' color='primary' className='w-full'>
                                                        <FaRegEye className='text-xl' />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Download Berkas">
                                                    <Button isLoading={downlaodLoading} size='sm' radius='full' isIconOnly variant='shadow' color='secondary' onClick={() => downloadBerkas(berkas.berkas, berkas.nama_berkas)}>
                                                        <FaDownload />
                                                    </Button>
                                                </Tooltip>
                                            </CardFooter>
                                        </Card>
                                    ))
                                }


                            </div>

                        </CardBody>
                    </Card>
                </div>
                <div className='w-full'>
                    <Card>
                        <CardHeader className='flex justify-between'>
                            <div className='font-semibold text-black text-base'>
                                Pembayaran Santri
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className='flex gap-2 flex-wrap justify-center md:justify-start'>
                                <Accordion>
                                    <AccordionItem key={1} aria-label='Pembayaran Berlaku' title="Pembayaran Berlaku">
                                        <div className='flex gap-2 '>
                                            {pembayaran?.map((item, index) => (
                                                <Button color='primary' key={index} className='py-2'>
                                                    {item.payment_name}
                                                </Button>
                                            ))}
                                        </div>
                                    </AccordionItem>
                                    <AccordionItem key={2} aria-label='Pembayaran Selesai' title="Pembayaran Selesai">
                                        <div className='flex gap-2 '>
                                            {done?.map((item, index) => (
                                                <Button color='primary' key={index} className='py-2'>
                                                    {item.payment_name}
                                                </Button>
                                            ))}
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </CardBody>
                    </Card>

                </div>
            </div>
            <ViewPdf viewModal={viewModal} setViewModal={setViewModal} berkas={urlPdf} />
            {siswa &&
                (
                    <IdCardModal cardModal={isModal} setCardModal={setIdmodal} dataSiswa={siswa} toastInfo={toastInfo} />
                )
            }


        </DashboardTemplate>
    )
}

export default DetailSiswa