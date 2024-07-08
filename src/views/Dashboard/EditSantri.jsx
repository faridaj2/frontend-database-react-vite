/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Input, Select, SelectItem, Textarea, Tooltip, Button, Image, Card, CardBody, CardHeader, RadioGroup, Radio } from '@nextui-org/react'
import { Link } from 'react-router-dom'

import AuthUser from '../../utils/AuthUser'
import ConstKelas from '../../utils/KelasUtils'
import { IoCloudUploadOutline } from "react-icons/io5";
import imageCompression from 'browser-image-compression';

import AllUtils from '../../utils/AllUtils'

function EditSantri() {
    const { getSystem, status, domisili } = ConstKelas()
    const navigate = useNavigate()
    const { nis } = useParams()
    const inputRef = useRef(null)

    const { ToastContainer, toastInfo } = AllUtils()

    const [formal, setKlsFormal] = useState()
    const [diniyah, setKlsDiniyah] = useState()
    const [kamar, setKamar] = useState()

    useEffect(() => {
        getSystem('formal', setKlsFormal)
        getSystem('diniyah', setKlsDiniyah)
        getSystem('kamar', setKamar)
    }, [])

    const { http } = AuthUser()
    const [name, setName] = useState('')
    const [nik, setNik] = useState('')
    const [nisn, setNisn] = useState('')
    const [kk, setKk] = useState('')
    const [email, setEmail] = useState('')
    const [kip, setKip] = useState('')
    const [asalSekolah, setAsalSekolah] = useState('')
    const [tptLahir, setTptLahir] = useState('')
    const [tglLahir, setTglLahir] = useState('')
    const [kelamin, setKelamin] = useState('')
    const [klsFormal, setFormal] = useState(new Set(['']))
    const [klsDiniyah, setDiniyah] = useState(new Set(['']))
    const [alamat, setAlamat] = useState('')
    const [ayah, setAyah] = useState('')
    const [noAyah, setNoAyah] = useState('')
    const [ibu, setIbu] = useState('')
    const [noIbu, setNoIbu] = useState('')
    // const [tahunMasuk, setTahunMasuk] = useState('')
    const [domisiliSiswa, setDomisili] = useState('')
    const [nisSiswa, setNisSiswa] = useState('')
    const [statusSiswa, setStatusSiswa] = useState('')
    const [id, setId] = useState('')
    const [image, setImage] = useState(null)
    const [kmr, setKmr] = useState()
    const [ext, setExt] = useState('')
    const [change, setChange] = useState(false)

    const [isLoading, setIsLoading] = useState()

    const checkNumber = (number) => {
        if (!number) return ''
        return parseInt(number)
    }



    const checkValue = (value) => {
        if (!value) return undefined
        return value
    }



    useEffect(() => {
        document.title = 'Edit Siswa'
        http.get(`/api/getData/${nis}`)
            .then(res => {
                const data = res.data
                setName(checkValue(data.nama_siswa))
                setNik(checkNumber(data.NIK))
                setKk(checkNumber(data.KK))
                setNisn(checkNumber(data.NISN))
                setNisSiswa(checkNumber(data.nis))
                setEmail(checkValue(data.email))
                setKip(checkNumber(data.KIP))
                setAsalSekolah(checkValue(data.asal_sekolah))
                setTptLahir(checkValue(data.tempat_lahir))
                setTglLahir(checkValue(data.tgl_lahir))
                setKelamin(data.kelamin)
                setAlamat(checkValue(data.alamat))
                setAyah(checkValue(data.nama_ayah))
                setNoAyah(checkNumber(data.nomor_ayah))
                setIbu(checkValue(data.nama_ibu))
                setNoIbu(checkNumber(data.nomor_ibu))
                setFormal(data.formal)
                setKmr(data.kamar)
                setDiniyah(data.diniyah)
                setStatusSiswa(data.status)
                setDomisili(data.domisili)
                setId(data.id)

                if (data.foto) setImage('/storage/photos/' + data.foto)

            })
            .catch(err => console.log(err))
    }, [])

    const saveButton = async () => {
        setIsLoading(true)
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
        let compressedImage = null
        if (change) compressedImage = await imageCompression(image, options)



        const data = {
            id: id,
            nama_siswa: name,
            NIK: nik,
            NISN: nisn,
            KK: kk,
            nis: nisSiswa,
            email: email,
            KIP: kip,
            asal_sekolah: asalSekolah,
            tempat_lahir: tptLahir,
            tgl_lahir: tglLahir,
            kelamin: kelamin,
            alamat: alamat,
            nama_ayah: ayah,
            nomor_ayah: noAyah,
            nama_ibu: ibu,
            kamar: kmr,
            nomor_ibu: noIbu,
            formal: klsFormal,
            diniyah: klsDiniyah,
            status: statusSiswa,
            domisili: domisiliSiswa,
            foto: compressedImage,
            ext: ext

        }
        try {

            await http.post(`/api/simpan-siswa`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    const status = res.data.status
                    if (status === 'error') {
                        const data = res.data.data
                        setIsLoading(false)
                        for (const key in data) {
                            toastInfo(`Terjadi error pada: ${key}, periksa kembali.`); // Menampilkan kunci (key) dari setiap elemen objek
                        }
                    } else {
                        navigate(`/dashboard/data-santri/detail/${nis}`)
                        setIsLoading(false)
                    }
                })
                .catch(error => {
                    console.log(error)
                    setIsLoading(false)
                })
        } catch (err) {
            console.log(err)
        }

    }
    const imageUpload = () => {
        inputRef.current.click()
    }
    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setImage(file)
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        setExt(fileExtension);
        setChange(true)
    }
    const handleInputChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();

        setExt(fileExtension);
        setChange(true)
    }
    const getImage = () => {
        if (!image) return "https://i.pinimg.com/564x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"
        if (typeof (image) === 'string') return image
        return URL.createObjectURL(image)
    }

    return (
        <DashboardTemplate>
            <ToastContainer />
            <form action="" className='w-full flex flex-wrap gap-2'>
                <div className='w-full flex justify-between gap-2'>
                    <div>
                        <h1 className='font-bold'>Edit data diri <span className='text-violet-600'> <Link to={`/dashboard/data-santri/detail/${nis}`}>{name}</Link> </span> </h1>
                    </div>
                    <div className='flex gap-2'>
                        <Tooltip content="Kembali ke halaman sebelumnya">
                            <Button color='danger' variant='shadow' onClick={() => navigate('/dashboard/data-santri/')}>Batal</Button>
                        </Tooltip>
                        <Button color='primary' variant='shadow' isLoading={isLoading} onClick={saveButton}>Simpan</Button>
                    </div>
                </div>
                <Card className='w-full lg:max-w-sm self-start'>
                    <CardBody>
                        <div className='w-full'>
                            <Image
                                width={1000}
                                alt="NextUI hero Image with delay"
                                src={getImage()}
                                className='w-full'
                            />

                        </div>
                        <div onClick={imageUpload} onDrop={handleDrop} onDragOver={e => e.preventDefault()} className='text-5xl h-52 outline outline-slate-500 flex items-center justify-center rounded-xl mt-2 hover:bg-slate-300 bg-slate-200 ease-in-out shadow cursor-pointer outline-1 flex-col' >

                            <IoCloudUploadOutline className='text-slate-500' />
                            <span className='text-xs text-slate-700'>Klik atau seret gambar untuk mengupload gambar</span>

                        </div>
                        <input type="file" className='hidden' ref={inputRef} onChange={handleInputChange} />
                    </CardBody>
                </Card>
                <div className='grow'>
                    <div className=''>
                        <Card className='w-full'>
                            <CardHeader>
                                Detail Siswa
                            </CardHeader>
                            <CardBody className='flex flex-col gap-2'>
                                <Input label="Masukkan nama" size='sm' onValueChange={setName} value={name} type='text' />
                                <Input label="Masukkan NIK" size='sm' onValueChange={setNik} value={nik} type='number' />
                                <Input label="Masukkan NISN" size='sm' onValueChange={setNisn} value={nisn} type='number' />
                                <Input label="Masukkan No. KK" size='sm' onValueChange={setKk} value={kk} type='number' />
                                <Input label="Masukkan Asal Sekolah" size='sm' onValueChange={setAsalSekolah} value={asalSekolah} type='text' />
                                <Input label="Masukkan E-Mail" size='sm' onValueChange={setEmail} value={email} type='email' />
                                <Input label="Masukkan KIP" size='sm' onValueChange={setKip} value={kip} type='number' />
                                <Input label="Masukkan Tempat Lahir" size='sm' onValueChange={setTptLahir} value={tptLahir} type='text' />
                                <Input type='date' label="Masukkan Tanggal Lahir" onChange={(e) => setTglLahir(e.target.value)} value={tglLahir} />
                                <Select
                                    label="Pilih Jenis Kelamin" size='sm'
                                    className="w-full"
                                    onChange={e => setKelamin(e.target.value)}
                                    selectedKeys={kelamin}
                                >

                                    <SelectItem key="L" value="L">
                                        Laki Laki
                                    </SelectItem>
                                    <SelectItem key="P" value="P">
                                        Perempuan
                                    </SelectItem>

                                </Select>
                                <Select label="Tingkatan Formal" onChange={e => setFormal(e.target.value)} selectedKeys={[klsFormal]} size='sm'>
                                    {formal?.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select label="Tingkatan Diniyah" onChange={e => setDiniyah(e.target.value)} selectedKeys={[klsDiniyah]} size='sm'>
                                    {diniyah?.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select label="Pilih Kamar" onChange={e => setKmr(e.target.value)} selectedKeys={[kmr]}>
                                    {kamar?.map(item => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {/* <Select size='sm' label="Pilih Domisili" onChange={e => setDomisili(e.target.value)} selectedKeys={[domisiliSiswa]}>
                                    {domisili.map(domisili => (
                                        <SelectItem key={domisili} value={domisili}>
                                            {domisili}
                                        </SelectItem>
                                    ))}
                                </Select> */}
                                <RadioGroup label="Pilih Domisili" value={domisiliSiswa} onValueChange={setDomisili} orientation='horizontal' className='my-2 outline p-2 rounded-md outline-slate-300'>
                                    {domisili.map(domisili => (
                                        <Radio key={domisili} value={domisili}>{domisili === 'pondok' ? 'Pondok' : 'Desa'}</Radio>
                                    ))}
                                </RadioGroup>
                                <Textarea label="Masukkan Alamat" onValueChange={setAlamat} value={alamat} />
                                <Input label="Masukkan Nama Ayah" size='sm' onValueChange={setAyah} type='text' value={ayah} />
                                <Input label="Masukkan No Ayah" size='sm' onValueChange={setNoAyah} type='number' value={noAyah} />
                                <Input label="Masukkan Nama Ibu" size='sm' onValueChange={setIbu} type='text' value={ibu} />
                                <Input label="Masukkan no Ibu" size='sm' onValueChange={setNoIbu} type='number' value={noIbu} />
                                {/* <Select label="Tentukan Status" size='sm' onChange={e => setStatusSiswa(e.target.value)} selectedKeys={[statusSiswa]}>
                                    {status.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </Select> */}
                                <RadioGroup orientation='horizontal' onValueChange={setStatusSiswa} value={statusSiswa} className='my-2 outline p-2 rounded-md outline-slate-300' label="Status Siswa">
                                    {status.map(status => (
                                        <Radio key={status} value={status}>
                                            {status}
                                        </Radio>
                                    ))}
                                </RadioGroup>

                            </CardBody>
                        </Card>

                    </div>
                </div>

            </form>
        </DashboardTemplate >
    )
}

export default EditSantri