/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from 'react-router-dom'
import { useState } from 'react'

// Utilities
import AuthUser from '../../utils/AuthUser'
import { useEffect } from 'react'

// Next Ui

import { Button } from "@nextui-org/react";

// Icon
import { IoPrint } from "react-icons/io5";

// Utilitas
import AllUtils from '../../utils/AllUtils';

function Laporan() {
    // Utilities
    const { http } = AuthUser()
    const { addComa } = AllUtils()

    const { data } = useParams()
    const decodedString = JSON.parse(atob(data))

    const [detail, setDetail] = useState()
    const [dt, setDt] = useState()
    const [meta, setMeta] = useState()

    useEffect(() => {
        document.title = `Laporan Keuangan`
        http.get('/api/get-laporan', {
            params: decodedString,
        })
            .then(res => {
                setDetail(res.data.detail)
                setDt(res.data.data)
                if (res.data.detail.meta) setMeta(JSON.parse(res.data.detail.meta))
            })
            .catch(res => console.log(res))
    }, [])


    return (
        <div className='p-2 bg-gray-200 min-h-svh'>
            <div className='print:hidden'>
                <Button color="primary" onClick={() => window.print()}><IoPrint /> Print</Button>
            </div>

            <div className='bg-white p-2 mt-2' id='print'>
                <div className='font-times text-xl font-bold print:text-center my-2'>Laporan {detail?.payment_name}</div>
                <div className='border-b border-black'></div>
                <table className='font-times w-full'>
                    <tbody className='w-full'>
                        <tr>
                            <td>Deskripsi</td>
                            <td>{detail?.desc}</td>
                        </tr>
                        <tr>
                            <td>Periode</td>
                            <td> {decodedString.start} <span className=''>/</span> {decodedString.end}</td>
                        </tr>
                        <tr>
                            <td>Jumlah harus dibayar</td>
                            <td> Rp. {addComa(detail?.default)}</td>
                        </tr>
                        <tr>
                            <td>Bulan khusus</td>
                            <td className='flex gap-2'> {meta?.map((item, index) => (
                                <div key={index + 'month'}>
                                    [ {item.month} / Rp. {addComa(item.price)} ]
                                </div>

                            ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='my-5 justify-between'>

                    <table aria-label="Laporan" className='font-times w-full border-black border'>
                        <thead>
                            <th className='border border-black p-2 bg-yellow-400'>No</th>
                            <th className='border border-black p-2 bg-yellow-400'>Tanggal</th>
                            {(detail?.bulanan && (
                                <th className='border border-black p-2 bg-yellow-400'>Bulan</th>
                            ))}
                            <th className='border border-black p-2 bg-yellow-400'>Pembayaran</th>
                            <th className='border border-black p-2 bg-yellow-400'>Siswa</th>
                            <th className='border border-black p-2 bg-yellow-400'>NIS</th>

                        </thead>
                        <tbody>
                            {dt?.map((item, index) => (
                                <tr key={index}>
                                    <td className='border border-black p-1'>{index + 1}</td>
                                    <td className='border border-black p-1'>{item.dop}</td>
                                    {(detail?.bulanan && (
                                        <td className='border border-black p-1'>{item.month}</td>
                                    ))}
                                    <td className='border border-black p-1'>Rp. {addComa(item.jumlah_pembayaran)}</td>
                                    <td className='border border-black p-1'>{item.siswa.nama_siswa}</td>
                                    <td className='border border-black p-1'>{item.siswa.nis}</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>

                    {
                        dt?.length === 0 ? <div className='text-center m-5'>Tidak ada data</div> : null
                    }

                </div>
            </div>






        </div>




    )
}

export default Laporan