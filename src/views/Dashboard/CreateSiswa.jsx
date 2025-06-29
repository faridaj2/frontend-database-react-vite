/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import DashshboardTemplate from '../../components/DashboardTemplate'
import { Input, Button, Tooltip, Textarea, Card, CardBody } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { Select, SelectItem } from "@nextui-org/select";
import AuthUser from '../../utils/AuthUser';
import constKelas from '../../utils/KelasUtils';

function CreateSiswa() {
    const [name, setName] = useState()
    const [nik, setNik] = useState()
    const [nisn, setNisn] = useState()
    const [kk, setKk] = useState()
    const [email, setEmail] = useState()
    const [kip, setKip] = useState()
    const [asalSekolah, setAsalSekolah] = useState()
    const [tptLahir, setTptLahir] = useState()
    const [tglLahir, setTglLahir] = useState()
    const [kelamin, setKelamin] = useState()
    const [klsFormal, setFormal] = useState()
    const [klsDiniyah, setDiniyah] = useState()
    const [alamat, setAlamat] = useState()
    const [ayah, setAyah] = useState()
    const [noAyah, setNoAyah] = useState()
    const [ibu, setIbu] = useState()
    const [noIbu, setNoIbu] = useState()
    const [tahunMasuk, setTahunMasuk] = useState()
    const [nis, setNis] = useState()
    const [kmr, setKmr] = useState()

    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    const { getSystem } = constKelas()
    const [formal, setKlsFormal] = useState()
    const [diniyah, setKlsDiniyah] = useState()
    const [kamar, setKamar] = useState()

    useEffect(() => {
        getSystem('diniyah', setKlsDiniyah)
        getSystem('formal', setKlsFormal)
        getSystem('kamar', setKamar)
    }, [])

    const { http } = AuthUser()
    useEffect(() => {
        document.title = 'Tambah Siswa'
    }, [])






    const navigate = useNavigate()


    const getNis = (year) => {
        setTahunMasuk(year)
        const newYear = year.split("-")[0]

        http.post('/api/utils/get-new-nis', { year: newYear })
            .then((res) => {
                setNis(res.data)
                setIsDisabled(false)
            })
            .catch((err) => console.log(err))


    }
    const submitForm = () => {
        if (!nis) return
        if (!name) return
        setIsLoading(true)
        const data = {
            'nama_siswa': name,
            'NIK': nik,
            'NISN': nisn,
            'KK': kk,
            'asal_sekolah': asalSekolah,
            'tempat_lahir': tptLahir,
            'tgl_lahir': tglLahir,
            'kelamin': kelamin,
            'formal': klsFormal,
            'diniyah': klsDiniyah,
            'email': email,
            'KIP': kip,
            'status': 'active',
            'foto': '',
            'alamat': alamat,
            'nama_ayah': ayah,
            'nomor_ayah': noAyah,
            'nama_ibu': ibu,
            'nomor_ibu': noIbu,
            'nis': nis,
            'tahun_daftar': tahunMasuk,
            'kamar': kmr
        }

        http.post('/api/tambah-siswa', data)
            .then(res => {
                setIsLoading(false)
                navigate('/dashboard/data-santri')
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }


    return (
        <DashshboardTemplate>
            <div className='w-full'>
                <div className='my-3'>
                    <Card>
                        <CardBody>
                            <div>
                                <Button size="sm" color='primary' onClick={() => navigate('/dashboard/data-santri/import-massal')}>Import Data Massal</Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>


                <form action="" className='w-full'>

                    <div className='w-full flex gap-10 flex-col'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='font-semibold text-gray-700 tracking-wide text-sm px-2'>Data diri</div>
                            <Input className='col-span-2' label="Masukkan nama" size='sm' onValueChange={setName} type='text' />
                            <Input label="Masukkan NIK" size='sm' onValueChange={setNik} type='number' />
                            <Input label="Masukkan NISN" size='sm' onValueChange={setNisn} type='number' />
                            <Input label="Masukkan No. KK" size='sm' onValueChange={setKk} type='number' />
                            <Input label="Masukkan Asal Sekolah" size='sm' onValueChange={setAsalSekolah} type='text' />
                            <Input label="Masukkan E-Mail" size='sm' onValueChange={setEmail} type='email' />
                            <Input label="Masukkan KIP" size='sm' onValueChange={setKip} type='number' />
                            <Input className='col-span-2' label="Masukkan Tempat Lahir" size='sm' onValueChange={setTptLahir} type='text' />
                            <Input className="col-span-2" type='date' label="Masukkan Tanggal Lahir" onChange={(e) => setTglLahir(e.target.value)} />
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 items-center gap-2'>
                            <div className='font-semibold text-gray-700 tracking-wide text-sm px-2 col-span-2 md:col-span-4'>Sekolah, Diniyah</div>
                            <Select
                                label="Pilih Jenis Kelamin"
                                className="w-full"
                                onChange={(e) => setKelamin(e.target.value)}
                            >

                                <SelectItem key="L" value="L">
                                    Laki Laki
                                </SelectItem>
                                <SelectItem key="P" value="P">
                                    Perempuan
                                </SelectItem>

                            </Select>
                            <Select label="Tingkatan Formal" onChange={(e) => setFormal(e.target.value)}>
                                {formal?.map((item) => (
                                    <SelectItem key={item.key} value={item.label}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Tingkatan Diniyah" onChange={(e) => setDiniyah(e.target.value)}>
                                {diniyah?.map((item) => (
                                    <SelectItem key={item.key} value={item.label}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Pilih kamar" onChange={(e) => setKmr(e.target.value)}>
                                {kamar?.map(item => (
                                    <SelectItem key={item.key} value={item.key}>
                                        {item.label}
                                    </SelectItem>
                                ))}

                            </Select>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='font-semibold text-gray-700 tracking-wide text-sm px-2 col-span-2'>Alamat & Detail Orang Tua</div>
                            <Textarea className='col-span-2' label="Masukkan Alamat" onValueChange={setAlamat} />
                            <Input label="Masukkan Nama Ayah" size='sm' onValueChange={setAyah} type='text' />
                            <Input label="Masukkan No Ayah" size='sm' onValueChange={setNoAyah} type='number' />
                            <Input label="Masukkan Nama Ibu" size='sm' onValueChange={setIbu} type='text' />
                            <Input label="Masukkan no Ibu" size='sm' onValueChange={setNoIbu} type='number' />
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='font-semibold text-gray-700 tracking-wide text-sm px-2 col-span-2'>Detail tambahan & NIS</div>
                            <Input
                                type='date'
                                label="Tahun Masuk"
                                onChange={(e) => getNis(e.target.value)}
                                classNames={{
                                    input: ['text-blue-900']
                                }}
                            />
                            <Tooltip content="NIS Otomatis">
                                <Input label="NIS SISWA" isDisabled value={nis} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mt-4 items-center'>
                        <Tooltip content="Kembali ke halaman sebelumnya">
                            <Button className='w-full md:w-24' color='danger' onClick={() => navigate('/dashboard/data-santri/')}>Batal</Button>
                        </Tooltip>
                        <Button className='w-full md:w-24' color='primary' onClick={submitForm} isLoading={isLoading} isDisabled={isDisabled}>Simpan</Button>
                    </div>

                </form>
            </div>
        </DashshboardTemplate >
    )
}

export default CreateSiswa