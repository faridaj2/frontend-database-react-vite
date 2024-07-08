import React, { useEffect, useRef, useState } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { Card, CardHeader, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Accordion, AccordionItem } from '@nextui-org/react';
import AllUtils from '../../utils/AllUtils';
import * as XLSX from 'xlsx';
import AuthUser from '../../utils/AuthUser';

function ImportMassal() {
    const { toastInfo, toastSuccess, ToastContainer } = AllUtils()
    const { http } = AuthUser()

    const inputFile = useRef(null)
    const [json, setJson] = useState()
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        document.title = 'Import Mass Data'
    }, [])

    function convertToDate(serialNumber) {
        var excelEpoch = new Date(1899, 11, 31);
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        var date = new Date(excelEpoch.getTime() + (serialNumber) * millisecondsPerDay);

        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    }

    const uploadFile = (event) => {

        const fileInput = event.target.files[0]
        // Cek extensi
        const ext = fileInput.name.split('.').pop()
        if (ext !== 'xlsx') {
            return toastInfo('File harus berupa Excel, atau berformat .xlsx')
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const json = [];
            const headers = jsonData[0];

            for (let i = 1; i < jsonData.length; i++) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    if (headers[j] === 'tgl_lahir' || headers[j] === 'tahun_daftar') {
                        row[headers[j]] = convertToDate(jsonData[i][j])
                    } else if (headers[j] === 'nomor_ibu' || headers[j] === 'nomor_ayah') {
                        if (!jsonData[i][j]) {
                            row[headers[j]] = null
                        } else {
                            row[headers[j]] = String(jsonData[i][j])
                        }
                    }

                    else {
                        row[headers[j]] = jsonData[i][j]
                    }
                    // row[headers[j]] = jsonData[i][j];
                }
                json.push(row);
            }
            toastSuccess('Selesai')
            setJson(json)
        }
        reader.readAsArrayBuffer(fileInput);
    }
    const resetInput = () => {
        inputFile.current.value = ''
        setJson()
        setError(false)
    }

    const getNis = async (year) => {
        try {
            const res = await http.post('/api/utils/get-new-nis', { year });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    const beginUpload = async () => {
        setUploading(true)
        const newArray = Array.from(json);
        const arraySuccess = []
        for (const [index, el] of newArray.entries()) {
            const tahunDaftar = el.tahun_daftar;
            // Mengubah format tanggal
            const year = tahunDaftar.split('-')[0];
            const NIS = await getNis(year);
            el.nis = NIS;

            try {
                await http.post('/api/tambah-siswa', el)
                    .then(res => {
                        if (res.data.status) {
                            toastInfo(`terjadi error pada ${el.nama_siswa}`)
                        } else {
                            toastSuccess(`${el.nama_siswa} berhasil ditambahkan`)
                            arraySuccess.push(index)
                        }

                    })
                    .catch(res => console.log(res))
            } catch (err) {
                console.log(err);
            }
        }

        const arrayToSet = newArray.filter((_, index) => !arraySuccess.includes(index))
        setJson(arrayToSet)
        setUploading(false)
        setError(true)
    }

    const getStatus = (status) => {
        // if (status === 'hold') return ''
        // if (status === 'pending') return 'bg-green-100'
        return ''
    }
    const exportXlsx = () => {
        const data = json.map(({ nis, ...rest }) => rest)
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx');
    }

    return (
        <DashboardTemplate>
            <div className='w-full overflow-x-auto p-3'>
                <div>
                    <ToastContainer />
                    <Card>
                        <CardHeader className=''>
                            <div className='w-full flex justify-between items-center'>
                                <h1>Import data massal</h1>
                                {!json ? (
                                    <Button size='sm' color='primary' onClick={() => inputFile.current.click()}>Upload File</Button>
                                ) :
                                    (
                                        <div className='flex gap-2'>
                                            <Button size='sm' color='warning' onClick={exportXlsx} className={'text-white ' + (!error && 'hidden')}>Export data error</Button>
                                            <Button size='sm' color='danger' onClick={resetInput}>Reset</Button>
                                            <Button size='sm' color='primary' isLoading={uploading} onClick={beginUpload}>Upload</Button>
                                        </div>
                                    )
                                }
                                <input type="file" onChange={uploadFile} ref={inputFile} hidden />
                            </div>
                        </CardHeader>
                        <CardBody className='w-full overflow-hidden'>
                            <Table aria-label='Sample Data Siswa'>
                                <TableHeader>
                                    <TableColumn>Nama Siswa</TableColumn>
                                    <TableColumn>NIK</TableColumn>
                                    <TableColumn>NISN</TableColumn>
                                    <TableColumn>KK</TableColumn>
                                    <TableColumn>Tempat Lahir</TableColumn>
                                    <TableColumn>Tanggal Lahir</TableColumn>
                                    <TableColumn>Gender</TableColumn>
                                    <TableColumn>Email</TableColumn>
                                    <TableColumn>KIP</TableColumn>
                                    <TableColumn>alamat</TableColumn>
                                    <TableColumn>Asal Sekolah</TableColumn>
                                    <TableColumn>Nama Ayah</TableColumn>
                                    <TableColumn>No Ayah</TableColumn>
                                    <TableColumn>Nama Ibu</TableColumn>
                                    <TableColumn>No Ibu</TableColumn>
                                    <TableColumn>Tahun Daftar</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {json?.map((data, index) => (
                                        <TableRow key={index} className={getStatus(data.uploaded)}>
                                            <TableCell > {data.nama_siswa}</TableCell>
                                            <TableCell>{data.NIK}</TableCell>
                                            <TableCell>{data.NISN}</TableCell>
                                            <TableCell>{data.KK}</TableCell>
                                            <TableCell>{data.tempat_lahir}</TableCell>
                                            <TableCell>{data.tgl_lahir}</TableCell>
                                            <TableCell>{data.kelamin}</TableCell>
                                            <TableCell>{data.email}</TableCell>
                                            <TableCell>{data.KIP}</TableCell>
                                            <TableCell>{data.alamat}</TableCell>
                                            <TableCell>{data.asal_sekolah}</TableCell>
                                            <TableCell>{data.nama_ayah}</TableCell>
                                            <TableCell>{data.nomor_ayah}</TableCell>
                                            <TableCell>{data.nama_ibu}</TableCell>
                                            <TableCell>{data.nomor_ibu}</TableCell>
                                            <TableCell>{data.tahun_daftar}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                            <Accordion
                                itemClasses={{
                                    title: 'text-md'
                                }}>
                                <AccordionItem title="Tutorial mengupload">
                                    <ul className='list-decimal'>
                                        <li>File harus berformat excel yaitu xlsx</li>
                                        <li>Kolom tanggal lahir dan tahun daftar harus berformat date</li>
                                        <li>Kolom tanggal lahir dan tahun daftar harus berformat lengakp dari tahun, bulan, dan hari</li>
                                        <li>Setelah anda mengexport data yang error anda harus mengubah format kolom tanggal lahir dan tahun daftar secara manual</li>
                                        <li>untuk kolom email harus berbeda atau tidak boleh sama, karena akan menimbulkan kegagalan upload</li>

                                    </ul>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </div >

            </div >
        </DashboardTemplate >
    )
}

export default ImportMassal