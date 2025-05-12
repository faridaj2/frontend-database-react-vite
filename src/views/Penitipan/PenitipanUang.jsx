/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { Avatar, Divider, Input } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'

import { FcSearch } from "react-icons/fc"
import AuthUser from '../../utils/AuthUser'
import getImage from '../../utils/getImage'
import AllUtils from '../../utils/AllUtils'

function PenitipanUang() {
    const navigate = useNavigate()
    const { http } = AuthUser()
    const { addComa } = AllUtils()

    const [paginate, setPaginate] = useState()
    const [search, setSearch] = useState('')

    const [riwayat, setRiwayat] = useState([])

    useEffect(() => {
        document.title = 'Penitipan Uang'
        getSiswa()
        getHistory()
    }, [])

    useEffect(() => {
        getSiswa()
    }, [search])

    const getSiswa = () => {
        http.get(`/api/gettable?search=${search}`)
            .then(res => setPaginate(res.data.paginate))
            .catch(error => console.log(error))
    }
    const getHistory = () => {
        http.get('/api/history-terakhir')
            .then(res => {
                console.log(res.data)
                setRiwayat(res.data)
            })
            .catch(res => console.log(res))
    }



    return (
        <DashboardTemplate>
            <div className='flex flex-col md:flex-row gap-2'>
                <div className='grow'>
                    <div className='px-2'>
                        <Input color='primary' size='' value={search} onValueChange={setSearch} variant='faded' placeholder="Cari Siswa" endContent={<FcSearch />} />
                    </div>
                    <Divider className='my-3' />
                    <div className='overflow-y-auto h-[80vh] scroll bg-blue-100 rounded-2xl'>
                        <div className='flex flex-col gap-2 m-2'>
                            {paginate && paginate.data.map(data => (
                                <div key={data.id} onClick={() => navigate(`/dashboard/penitipan/detail/${data.id}`)} className='border-1 p-2 hover:shadow-md hover:shadow-violet-700/30 transition bg-white rounded-xl cursor-pointer flex justify-between items-center pr-4'>
                                    <div className=' flex gap-2 items-center'>
                                        <Avatar color='primary' radius='sm' src={getImage(data)} />
                                        <div>
                                            <div className='text-medium font-semibold truncate w-full max-w-40 md:w-full md:max-w-60'>{data.nama_siswa}</div>
                                            <div className='text-tiny text-gray-600'>{data.nis}</div>
                                        </div>
                                    </div>
                                    <div className='text-tiny'>
                                        Rp. {data.uang_saku ? addComa(data.uang_saku) : 0}
                                    </div>
                                </div>
                            ))}
                            {!paginate && (
                                <div className='w-full flex items-center justify-center p-5'>
                                    <span className="loader"></span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="w-96">
                    <div className='my-3'>
                        Riwayat Transaksi
                    </div>
                    <div className='flex flex-col gap-2 overflow-y-scroll h-screen scroll px-2'>
                        {riwayat?.map(item => (
                            <div className='rounded-xl p-2 mb-1 flex flex-col gap-2 cursor-pointer hover:shadow-lg bg-white/90' key={item.id + 'ite'} onClick={() => navigate(`/dashboard/penitipan/detail/${item.siswa.id}`)}>
                                <div className=''>
                                    <div className='text-xs text-gray-500'>Nama</div>
                                    <div className='text-sm font-bold tracking-wide p-2 rounded-xl inline-block mt-2'>{item.siswa.nama_siswa}</div>
                                </div>
                                <div className=''>
                                    <div className='text-xs text-gray-500'>Keterangan</div>
                                    <div className='text-sm font-bold tracking-wide p-2 rounded-xl inline-block mt-2'>{item.keterangan}</div>
                                </div>
                                <div className=''>
                                    <div className='text-xs text-gray-500'>Nominal</div>
                                    <div className='text-sm font-bold tracking-wide p-2 rounded-xl inline-block mt-2'>Rp. {addComa(item.uang)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    )
}

export default PenitipanUang