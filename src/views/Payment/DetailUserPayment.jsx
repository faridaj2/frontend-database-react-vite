/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

// Component
import DashboardTemplate from '../../components/DashboardTemplate'
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import ModalSeeDetail from '../../components/Payment/ModalSeeDetail'
import ModalTransaction from '../../components/Payment/ModalTransaction'

// Utilitas
import AuthUser from '../../utils/AuthUser'
import AllUtils from '../../utils/AllUtils'
// Icon
import { MdOutlineEditNote } from "react-icons/md"
import { BiDetail } from "react-icons/bi"

function DetailUserPayment() {
    const { http } = AuthUser()
    const { paymentId, siswaId } = useParams()
    const { changeDateFormat, addComa, generateArrayMonth } = AllUtils()
    const navigate = useNavigate()

    // Modal State
    const [detailModal, setModalDetail] = useState(false)
    const [transasksiModal, setTransaksi] = useState(false)


    // Data
    const [data, setData] = useState({})
    const [siswa, setSiswa] = useState()
    const [income, setIncome] = useState([])

    // Get Data
    useEffect(() => {
        document.title = "Detail Pembayarn Siswa"
        getData()
        getSiswa()
        getIncome()
    }, [])
    useEffect(() => {
        if (income && data.arrayMonth) {
            if (income.length > 0 && data.arrayMonth.length > 0) {
                const array1 = data.arrayMonth
                const array2 = income
                http.post(`/api/set-status-payment/${paymentId}/${siswaId}`, { status: chekArray(array1, array2) })
            }
        }
    }, [income])

    function chekArray(arrayA, arrayB) {
        if (arrayA.length !== arrayB.length) {
            return false; // Jika panjang array tidak sama, langsung kembalikan false
        }

        for (let i = 0; i < arrayA.length; i++) {
            if (arrayA[i].month !== arrayB[i].month || arrayB[i].price < arrayA[i].price) {
                return false; // Jika bulan tidak sama atau harga b lebih kecil dari a, kembalikan false
            }
        }

        return true; // Jika semua objek memenuhi kondisi, kembalikan true
    }


    const getSiswa = () => {
        http.get(`/api/get-data-siswa/${siswaId}/${paymentId}`)
            .then(res => {
                if (res.data.status === 'ok') {
                    setSiswa(res.data.data)
                } else {
                    throw new Error('Error')
                }
            })
            .catch(res => console.log(res))
    }

    const getData = () => {
        http.get(`/api/get-payment/${paymentId}`)
            .then(res => {
                console.log(res)
                const data = res.data.data
                const d = {
                    name: data.payment_name,
                    desc: data.desc,
                    type: parseInt(data.bulanan) === 0 ? 'Kontan' : 'Bulanan',
                    tenggat: data.tenggat,
                    startDate: data.start_date,
                    endDate: data.end_date,
                    meta: data.meta ? JSON.parse(data.meta) : [],
                    default: data.default,
                    groupId: data.group_payment_id
                }
                if (parseInt(data.bulanan) === 1 && data.meta) {
                    let array1 = generateArrayMonth(data.start_date, data.end_date)
                    let array2 = JSON.parse(data.meta)

                    const mapArray2 = array2.reduce((acc, obj) => {
                        acc[obj.month] = obj
                        return acc
                    }, {})

                    const mergedArray = array1.map(month => {
                        const price = mapArray2[month] ? mapArray2[month].price : data.default
                        return { month, price }
                    })

                    d.arrayMonth = mergedArray
                } else {
                    let month = generateArrayMonth(data.start_date, data.end_date)

                    const merged = month.map(item => {
                        return { month: item, price: data.default }
                    })
                    d.arrayMonth = merged
                }
                setData(d)
            })
            .catch(res => console.log(res))
    }
    const getIncome = () => {
        http.get(`/api/get-all-income/${siswaId}/${paymentId}`)
            .then(res => {
                let d = res.data
                const newArray = d.map(item => {
                    return { month: item.month, price: item.jumlah_pembayaran, dop: item.dop }
                })
                setIncome(newArray)
            })
            .catch(res => console.log(res))
    }

    // Modal set
    const [dataDetailModal, setDataDetailModal] = useState()
    const openDetailModal = (item) => {
        setDataDetailModal(item)
        setModalDetail(true)
    }
    const openTransaksiModal = (item) => {
        setDataDetailModal(item)
        setTransaksi(true)
    }

    // getStatus
    const getStatus = (month, price) => {
        let status = income.find(item => item.month === month)
        price = parseInt(price)
        if (status) {
            if (status.price === price) {
                return 'Lunas'
            } else if (status.price > price) {
                let lebih = status.price - price
                return `Lebih Rp. ${addComa(lebih)}`
            } else {
                let kurang = price - status.price
                return `Kurang Rp.${addComa(kurang)}`
            }
        } else {
            return 'Belum Lunas'
        }

    }
    // Get Total
    const getTotal = month => {
        let find = income.find(item => item.month === month)
        if (find) {
            return addComa(find.price)
        } else {
            return '--'
        }

    }
    // get DOP
    const getDop = month => {
        let find = income.find(item => item.month === month)
        if (find) {
            return find.dop
        } else {
            return '--'
        }
    }

    // Refresh
    const refresh = () => {
        getData()
        getIncome()
    }


    return (
        <DashboardTemplate>
            <div className='w-full rounded-md shadow-md shadow-violet-700/40 relative overflow-hidden p-3 flex flex-wrap gap-3 bg-white'>
                <div className='p-2 rounded-md flex-1'>
                    <div className='text-black/70 text-tiny'>Nama Pembayaran</div>
                    <div className='font-medium'>{data?.name}</div>
                </div>
                <div className='p-2 rounded-md flex-1'>
                    <div className='text-black/70 text-tiny'>Deskripsi</div>
                    <div className='font-medium'>{data?.desc}</div>
                </div>
                <div className='p-2 rounded-md flex-1'>
                    <div className='text-black/70 text-tiny'>Jenis Pembayaran</div>
                    <div className='font-medium'>{data?.type}</div>
                </div>
                <div className='p-2 rounded-md flex-1'>
                    <div className='text-black/70 text-tiny'>{data?.type === 'Kontan' ? 'Tenggat' : 'Durasi'}</div>
                    <div className='font-medium'>{data && data?.type === 'Kontan' ? changeDateFormat(data.tenggat) : (
                        <div className='mt-2'>
                            <div className='text-tiny text-black/40'>Bulan Awal</div>
                            <div>{changeDateFormat(data.startDate)}</div>
                            <div className='text-tiny text-black/40 mt-2'>Bulan Akhir</div>
                            <div>{changeDateFormat(data.endDate)}</div>
                        </div>
                    )}</div>
                </div>
                <div className='p-2 rounded-md flex-1'>
                    <div className='text-black/70 text-tiny'>Pembayaran</div>
                    <div className='font-medium'>Rp. {addComa(data?.default)}</div>
                </div>
                {data?.type === 'Bulanan' && (
                    <div className='p-2 rounded-md flex-1'>
                        <div className='text-black/70 text-tiny'>Pembayaran Khusus</div>
                        <div className='mt-2 flex gap-2 flex-wrap'>
                            {data?.meta && data.meta.map((item, index) => (
                                <Tooltip key={'meta' + index} content={`Rp. ${addComa(item.price)}`}>
                                    <Chip size='sm' color='primary' variant='dot' className='cursor-pointer hover:bg-violet-300 transition-all ease-in-out'>{item.month}</Chip>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className='mt-5'>
                <div className='font-medium text-2xl mb-2 text-violet-700' >Detail Pembayaran <br /> <Link to={`/dashboard/data-santri/detail/${siswa?.nis}`}>{siswa?.nama_siswa}</Link></div>
                <div>
                    <Table isStriped aria-label='table-siswa'>
                        <TableHeader>
                            <TableColumn>#</TableColumn>
                            <TableColumn>Tanggal</TableColumn>
                            <TableColumn>Jumlah Pembayaran</TableColumn>
                            <TableColumn>Telah dibayar</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Aksi</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.type === 'Bulanan' && data?.arrayMonth.map((month, index) => (
                                <TableRow key={`table${index}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{month.month}</TableCell>
                                    <TableCell>Rp. {addComa(month.price)}</TableCell>
                                    <TableCell>Rp. {income && getTotal(month.month)}</TableCell>
                                    <TableCell>{income && getStatus(month.month, month.price)}</TableCell>
                                    <TableCell><div className='flex gap-2'>
                                        <Button color='primary' variant='shadow' size='sm' onClick={() => openTransaksiModal(month)} isIconOnly><MdOutlineEditNote /></Button>
                                        <Button color='primary' variant='shadow' size='sm' onClick={() => openDetailModal(month)} isIconOnly><BiDetail /></Button>
                                    </div></TableCell>
                                </TableRow>
                            ))}

                            {data?.type === 'Kontan' && (
                                <TableRow key={`table1`}>
                                    <TableCell>1</TableCell>
                                    <TableCell>{data.tenggat}</TableCell>
                                    <TableCell>Rp. {addComa(data.default)}</TableCell>
                                    <TableCell>Rp. {getTotal(data.tenggat)}</TableCell>
                                    <TableCell>{getStatus(data.tenggat, data.default)}</TableCell>
                                    <TableCell><div className='flex gap-2'>
                                        <Button color='primary' variant='shadow' size='sm' onClick={() => openTransaksiModal({ month: data.tenggat, price: data.default, type: 'kontan' })} isIconOnly><MdOutlineEditNote /></Button>
                                        <Button color='primary' variant='shadow' size='sm' onClick={() => openDetailModal({ month: data.tenggat, price: data.default, type: 'kontan' })} isIconOnly><BiDetail /></Button>
                                    </div></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {transasksiModal && <ModalTransaction modal={transasksiModal} setModal={setTransaksi} data={{ paymentId, siswaId, month: dataDetailModal }} refresh={refresh} income={income} />}
            {detailModal && <ModalSeeDetail modal={detailModal} setModal={setModalDetail} data={{ paymentId, siswaId, month: dataDetailModal }} fn={{ getTotal, getStatus, getDop }} />}
        </DashboardTemplate>
    )
}

export default DetailUserPayment