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

    useEffect(() => {
        getSiswa()
    }, [])

    useEffect(() => {
        getSiswa()
    }, [search])

    const getSiswa = () => {
        http.get(`/api/gettable?search=${search}`)
            .then(res => setPaginate(res.data.paginate))
            .catch(error => console.log(error))
    }



    return (
        <DashboardTemplate>
            <div className='flex flex-col md:flex-row gap-2'>
                <div className='grow'>
                    <div className='px-2'>
                        <Input color='primary' size='' value={search} onValueChange={setSearch} variant='faded' placeholder="Cari Siswa" endContent={<FcSearch />} />
                    </div>
                    <Divider className='my-3' />
                    <div className='overflow-y-auto h-[80vh] scroll'>
                        <div className='flex flex-col gap-2 m-2'>
                            {paginate && paginate.data.map(data => (
                                <div key={data.id} onClick={() => navigate(`/dashboard/penitipan/detail/${data.id}`)} className='border-1 p-2 hover:shadow-md hover:shadow-violet-700/30 transition bg-white rounded-xl cursor-pointer flex justify-between items-center pr-4'>
                                    <div className=' flex gap-2 items-center'>
                                        <Avatar src={getImage(data)} />
                                        <div>
                                            <div className='text-medium font-semibold truncate w-full max-w-40 md:w-full md:max-w-60'>{data.nama_siswa}</div>
                                            <div className='text-tiny text-gray-400'>{data.formal} - {data.diniyah}</div>
                                        </div>
                                    </div>
                                    <div className='text-tiny'>
                                        Rp. {data.uang_saku ? addComa(data.uang_saku) : 0}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <div className='grow hidden md:block'>
                    <div className='p-2 border-1 bg-white shadow rounded-xl'>Transaksi Terakhir</div>
                </div>
            </div>
        </DashboardTemplate>
    )
}

export default PenitipanUang