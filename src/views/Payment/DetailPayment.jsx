/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Component
import DashboardTemplate from '../../components/DashboardTemplate'
import DeleteModalPayment from '../../components/Payment/DeleteModalPayment'

// Utilitas
import AuthUser from '../../utils/AuthUser'
import { Button, Card, CardBody, CardHeader, DatePicker, DateRangePicker, Divider, Input, Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { motion } from 'framer-motion'
import AllUtils from '../../utils/AllUtils'
import { parseDate } from '@internationalized/date'
import { I18nProvider } from "@react-aria/i18n";

// Icon
import { FaChartLine } from "react-icons/fa"
import { GiMoneyStack } from "react-icons/gi"
import { MdDateRange } from "react-icons/md"
import { FaGear } from "react-icons/fa6"
import { IoClose } from "react-icons/io5"
import { FaPlus } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FcCollapse } from "react-icons/fc"
import { FaSearch } from "react-icons/fa"
import { BsFileEarmarkExcel } from "react-icons/bs";


const ModalDownloadLaporan = ({ modal, setModal, id }) => {
    const onOpenChange = () => {
        modal ? setModal(false) : setModal(true)
    }
    let [date, setDate] = useState()
    const [final, setFinal] = useState()
    const [dsb, setDsb] = useState(true)

    const { convertDate } = AllUtils()

    useEffect(() => {
        if (date && date.start) {
            setDsb(false)
            const data = {
                start: convertDate(date.start),
                end: convertDate(date.end),
                id
            }
            setFinal(btoa(unescape(encodeURIComponent(JSON.stringify(data)))))
        }
    }, date)

    const newTab = () => {
        window.open(`/dashboard/payment/laporan/${final}`)
        setDate()
        setModal(false)
    }

    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur" size="lg" isDismissable="false">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Download Laporan</ModalHeader>
                        <ModalBody>

                            <I18nProvider locale="id-ID">
                                <DateRangePicker label="Pilih rentang tanggal" value={date} onChange={setDate} aria-label='date picker' />
                            </I18nProvider>


                            <Button color='primary' disabled={dsb} onClick={newTab} >Buka</Button>

                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>

                    </>
                )}
            </ModalContent>
        </Modal>
    )
}


function DetailPayment() {
    const { http } = AuthUser()
    const navigate = useNavigate()
    const { id } = useParams()
    // const navigate = useNavigate()
    const { addComa, changeDateFormat, generateArrayMonth, convertDate, ToastContainer, toastInfo, toastSuccess } = AllUtils()
    const [arrayMonth, setArrayMonth] = useState()

    const [isLoading, setIsLoading] = useState(false)

    const [dataReset, setDataReset] = useState()
    const reset = () => {
        const data = dataReset
        setNamaPembayaran(data.payment_name)
        setDesc(data.desc)
        setBulanan(data.bulanan === 1 ? 'bulanan' : 'cash')
        setDefaultPrice(data.default)
        if (!data.tenggat) {
            setStartDate(data.start_date)
            setEndDate(data.end_date)
            setRange({
                start: parseDate(data.start_date),
                end: parseDate(data.end_date)
            })
        }
        if (data.meta) setMeta(JSON.parse(data.meta))
        if (data.tenggat) {
            setInputTenggat(parseDate(data.tenggat))
        }
    }

    const [detail, setDetail] = useState(false)
    const [settings, setSettings] = useState(false)

    const [namaPembayaran, setNamaPembayaran] = useState()
    const [desc, setDesc] = useState()
    const [bulanan, setBulanan] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [meta, setMeta] = useState()
    const [tenggat, setTenggat] = useState()
    const [inputTenggat, setInputTenggat] = useState()
    const [range, setRange] = useState()
    const [defaultPrice, setDefaultPrice] = useState()

    const [pembayaranBulanan, setPembayaranBulanan] = useState()
    const [selectedMonth, setSelectedMonth] = useState()

    const [group, setGroup] = useState([])
    const [groupId, setGroupId] = useState("")
    const [idGroup, setIdGroup] = useState("")

    const [modalLaporan, setModalLaporan] = useState(false)

    useEffect(() => {
        if (!range) return
        setStartDate(convertDate(range.start))
        setEndDate(convertDate(range.end))
        setArrayMonth(generateArrayMonth(convertDate(range.start), convertDate(range.end)))
    }, [range])



    useEffect(() => {
        if (defaultPrice && defaultPrice !== '') setDefaultPrice(addComa(defaultPrice))
        if (pembayaranBulanan && pembayaranBulanan !== '') setPembayaranBulanan(addComa(pembayaranBulanan))
    }, [defaultPrice, pembayaranBulanan])
    useEffect(() => {
        if (!inputTenggat) return
        setTenggat(convertDate(inputTenggat))
    }, [inputTenggat])


    useEffect(() => {
        document.title = "Detail Pembayaran"
        getData()

    }, [])

    // Modal delete
    const [modalDelete, setModalDelete] = useState(false)
    const [idToDelete, setIdToDelete] = useState()
    const openModalDelete = () => {
        setModalDelete(!modalDelete)
        setIdToDelete(id)
    }


    const getData = () => {
        http.get(`/api/get-payment/${id}`)
            .then(res => {
                if (res.status === 200) {
                    // data
                    const data = res.data.data
                    setNamaPembayaran(data.payment_name)
                    setDesc(data.desc)
                    setBulanan(data.bulanan === 1 ? 'bulanan' : 'cash')
                    setDefaultPrice(data.default)
                    if (!data.tenggat) {
                        setStartDate(data.start_date)
                        setEndDate(data.end_date)
                        setRange({
                            start: parseDate(data.start_date),
                            end: parseDate(data.end_date)
                        })
                    }
                    if (data.meta) setMeta(JSON.parse(data.meta))
                    if (data.tenggat) {
                        setInputTenggat(parseDate(data.tenggat))
                    }
                    setDataReset(data)
                    // 
                    const groupName = res.data.groupPayment
                    setGroup(groupName)
                    if (data.group_payment_id) {
                        setGroupId(data.group_payment_id.toString())
                        setIdGroup(data.group_payment_id.toString())
                    }
                } else if (res.status === 203) {
                    throw new Error('Redirect')
                }
            })
            .catch(err => {
                console.log(err)
                navigate('/dashboard/payment/')
            })
    }
    const addToMeta = () => {
        if (!selectedMonth) return
        let array;
        if (meta) {
            array = [...meta]
        } else {
            array = []
        }

        const month = selectedMonth
        const price = pembayaranBulanan ? pembayaranBulanan.replace(/\./g, '') : 0

        if (!array.some(item => item.month === month)) {
            const data = { month: month, price: price }
            array.push(data)
            setMeta(array)
        }


        setSelectedMonth()
        setPembayaranBulanan(0)

    }
    const closeSettings = () => {
        reset()
        setSettings(!settings)
    }
    const submitSave = () => {
        const data = {
            payment_name: namaPembayaran,
            desc: desc,
            group_payment_id: groupId
        }
        if (bulanan === 'bulanan') {
            data.bulanan = 1
            if (!startDate || !endDate) return
            if (!startDate && !endDate) return
            data.start_date = startDate
            data.end_date = endDate
            if (defaultPrice) {
                data.default = defaultPrice.replace(/\./g, '')
            } else {
                data.default = null
            }
            data.tenggat = null
            if (meta !== null) data.meta = JSON.stringify(meta)
        } else {
            data.bulanan = 0
            data.start_date = null
            data.end_date = null
            if (defaultPrice) {
                data.default = defaultPrice.replace(/\./g, '')
            } else {
                data.default = null
            }
            if (!inputTenggat) return
            data.tenggat = tenggat
            data.meta = null
        }
        setIsLoading(true)
        http.post(`/api/update-payment-detail/${id}`, data)
            .then(() => {
                setSettings(false)
                getData()
                setIsLoading(false)
            })
            .catch(res => {
                console.log(res)
                setIsLoading(true)
            })
    }

    const deleteFromMeta = index => {
        let array = [...meta]
        array.splice(index, 1)
        setMeta(array)
    }

    // Data Siswa
    const [siswa, setSiswa] = useState()
    const [page, setPage] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (groupId) getGroupId()
    }, [currentPage, search, idGroup])

    const getGroupId = () => {
        http.get(`/api/get-siswa-group-payment/${idGroup}?page=${currentPage}&q=${search}`)
            .then(res => {
                const data = res.data
                setSiswa(data.data)
                setPage(Math.ceil(data.total / data.per_page))
            })
            .catch(res => console.log(res))
    }



    return (
        <DashboardTemplate>
            <ToastContainer />
            <motion.div
                className='right-0 h-full bg-black/50 backdrop-blur-sm w-full fixed top-0 z-40 transition-all flex justify-end'
                initial={{ left: '100%' }}
                animate={{ left: settings ? '0' : '100%' }}
                transition={{ duration: .2, ease: 'easeInOut' }}
            >
                <div className='w-full md:w-96 bg-white h-full overflow-scroll hideScrollBar'>
                    <div className='p-3 flex justify-end'>
                        <Button color='primary' size='sm' variant='shadow' onClick={closeSettings} isIconOnly>{!settings ? <FaGear /> : <IoClose />}</Button>
                    </div>
                    <div className='p-3 flex flex-col gap-4'>

                        <div className='mt-5 font-semibold'>Pengaturan Umum</div>
                        <Input aria-label='Pembayaran Nama' label="Nama Pembayaran" size='sm' value={namaPembayaran} onValueChange={setNamaPembayaran} variant='underlined' labelPlacement='outside' />
                        <Input label="Deskripsi" size='sm' value={desc} onValueChange={setDesc} variant='underlined' labelPlacement='outside' />
                        <Select aria-label='Jenis Pembayaran' selectedKeys={[bulanan]} onChange={e => setBulanan(e.target.value)} label="Jenis pembayaran" variant='underlined'>
                            <SelectItem key="bulanan" value="bulanan">
                                Bulanan
                            </SelectItem>
                            <SelectItem key="cash" value="cash">
                                Kontan
                            </SelectItem>
                        </Select>
                        <Select aria-label='Group Pembayaran' selectedKeys={[groupId]} onChange={e => setGroupId(e.target.value)} label="Group Pembayaran" variant='underlined'>
                            {group?.map(item => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.group_name}
                                </SelectItem>
                            ))}
                        </Select>
                        {bulanan === "bulanan" ?
                            <DateRangePicker label="Pilih Jangka Bulan" value={range} onChange={setRange} variant='underlined' />
                            :
                            <DatePicker label="Tenggat" value={inputTenggat} onChange={setInputTenggat} variant='underlined' />
                        }
                        <Input startContent={'Rp.'} label="Pembayaran" size='sm' variant='underlined' value={defaultPrice} onValueChange={setDefaultPrice} labelPlacement='outside' />
                        {
                            bulanan === 'bulanan' &&
                            <div>
                                <div className='mt-5 font-semibold'>Pengaturan Bulanan</div>
                                <div >
                                    <Select label="Bulan" selectedKeys={[selectedMonth]} onChange={e => setSelectedMonth(e.target.value)} labelPlacement='outside' variant='underlined'>
                                        {arrayMonth?.map(item =>
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>

                                        )}
                                    </Select>
                                    <Input variant='underlined' value={pembayaranBulanan} onValueChange={setPembayaranBulanan} label="Masukkan jumlah" startContent={'Rp.'} endContent={<Button size='sm' color='primary' onClick={addToMeta} isIconOnly variant='shadow'><FaPlus /></Button>} />
                                </div>
                            </div>

                        }
                        {
                            bulanan === 'bulanan' &&
                            <div>
                                {meta?.map((item, index) =>
                                    <div className='flex justify-between items-center border-b-1 pb-2' key={item}>
                                        <div>{item.month}</div>
                                        <div className='flex gap-2 items-center'><span>{addComa(item.price)}</span> <Button color='primary' variant='shadow' size='sm' isIconOnly onClick={() => deleteFromMeta(index)}><IoClose className='cursor-pointer' /></Button></div>
                                    </div>

                                )}
                            </div>
                        }
                        <Button color='primary' variant='shadow' className='mt-2' onClick={submitSave} isLoading={isLoading}>Simpan</Button>
                    </div>
                </div>
            </motion.div>
            <div className='flex flex-col md:flex-row justify-between mb-3 gap-2 md:items-center'>
                <div className=''>
                    <div className='text-xl font-bold text-primary truncate text-center md:text-left'>
                        {namaPembayaran}
                    </div>
                </div>
                <div className='flex items-center gap-2 justify-center'>
                    <div className={` transition-all ease-in-out cursor-pointer ${detail && 'rotate-180'}`} onClick={() => setDetail(!detail)}><FcCollapse /></div>
                    <Button color='primary' size='sm' variant='shadow' onClick={() => setModalLaporan(true)}><BsFileEarmarkExcel /> Download Laporan</Button>
                    <Button color='primary' size='sm' onClick={() => setSettings(!settings)} isIconOnly>{!settings ? <FaGear /> : <IoClose />}</Button>
                    <Button color='danger' size='sm' onClick={openModalDelete} isIconOnly><FaTrash /></Button>
                </div>
            </div>
            <motion.div
                className={`w-full flex flex-col md:flex-row gap-4 overflow-hidden`}
                initial={{ height: '0px' }}
                animate={{ height: !detail ? '0px' : 'auto' }}
                transition={{ duration: .3, ease: 'easeInOut' }}
            >
                <div className='w-full'>

                    <Card className='bg-blue-100'>
                        <CardHeader className='font-bold text-2xl flex justify-between'>
                            Detail
                        </CardHeader>
                        <CardBody>
                            <div className='flex flex-col gap-3'>
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-white p-2 rounded-md text-blue-700'>
                                        <FaChartLine className='text-xl' />
                                    </div>
                                    <div>
                                        <h4 className='text-tiny text-gray-500 font-semibold'>Nama Pembayaran</h4>
                                        <h2 className='text-sm font-semibold uppercase'>{namaPembayaran}</h2>
                                    </div>
                                </div>
                                <Divider />
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-white p-2 rounded-md text-blue-700'>
                                        <FaChartLine className='text-xl' />
                                    </div>
                                    <div>
                                        <h4 className='text-tiny text-gray-500 font-semibold'>Deskripsi</h4>
                                        <h2 className='text-sm font-semibold uppercase'>{desc}</h2>

                                    </div>
                                </div>
                                <Divider />
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-white p-2 rounded-md text-blue-700'>
                                        <FaChartLine className='text-xl' />
                                    </div>
                                    <div>
                                        <h4 className='text-tiny text-gray-500 font-semibold'>Jenis Pembayaran</h4>
                                        <h2 className='text-sm font-semibold'>{bulanan === 'bulanan' ? 'Bulanan' : 'Kontan '}</h2>
                                    </div>
                                </div>
                                <Divider />
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-white p-2 rounded-md text-blue-700'>
                                        <FaChartLine className='text-xl' />
                                    </div>
                                    <div>
                                        <h4 className='text-tiny text-gray-500 font-semibold'>Tanggal</h4>
                                        {bulanan === "bulanan" ?
                                            <h2 className='text-sm font-semibold'>{changeDateFormat(startDate)} - {changeDateFormat(endDate)}</h2> :
                                            <h2 className='text-sm font-semibold'>{tenggat}</h2>
                                        }
                                    </div>
                                </div>

                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className='w-full'>
                    <Card className='bg-blue-100'>
                        <CardHeader className='font-bold text-2xl flex justify-between'>
                            Tambahan
                        </CardHeader>
                        <CardBody className='flex flex-col gap-4'>
                            <div className='flex gap-2 items-center rounded-md'>
                                <div className='bg-white p-2 rounded-md text-blue-700'>
                                    <GiMoneyStack className='text-xl' />
                                </div>
                                <div>
                                    <h4 className='text-tiny text-gray-500 font-semibold'>Jumlah pembayaran {bulanan === 'bulanan' && 'per bulan'}</h4>
                                    <h2 className='text-sm font-semibold'>Rp. {addComa(defaultPrice)}</h2>
                                </div>
                            </div>
                            <div className='flex gap-2 items-center rounded-md'>
                                <div className='bg-white p-2 rounded-md text-blue-700'>
                                    <GiMoneyStack className='text-xl' />
                                </div>
                                <div>
                                    <h4 className='text-tiny text-gray-500 font-semibold'>Group Pembayaran</h4>
                                    <h2 className='text-sm font-semibold'>{group.find(item => item.id === parseInt(groupId)) && group.find(item => item.id === parseInt(groupId)).group_name}</h2>
                                </div>
                            </div>

                            {bulanan === 'bulanan' &&
                                <>

                                    <Divider />
                                    <div className='font-semibold text-lg flex flex-col justify-between'>
                                        <h2>Pembayaran bulan khusus</h2>
                                        <div className='mt-2 flex gap-3 md:gap-4 xl:gap-8 justify-start flex-wrap'>
                                            {meta?.map(item => (
                                                <div className='flex gap-2 items-center rounded-md' key={item.month}>
                                                    <div className='bg-white p-2 rounded-md text-blue-700'>
                                                        <MdDateRange className='text-xl' />
                                                    </div>
                                                    <div>
                                                        <h4 className='text-tiny text-gray-500 font-semibold'>{item.month}</h4>
                                                        <h2 className='text-sm font-semibold'>Rp. {addComa(item.price)}</h2>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </>
                            }
                        </CardBody>
                    </Card>
                </div>
            </motion.div>

            {/* Body Content */}
            <Input className='shadow-md shadow-violet-700/30 rounded-lg mt-2' value={search} onValueChange={setSearch} endContent={<FaSearch />} />
            <div className='mt-2'>
                <Table aria-label='Table Siswa'
                    className='shadow-md shadow-violet-700/30 rounded-lg'
                    bottomContent={<div className='w-full flex items-center justify-center'><Pagination isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={currentPage}
                        total={page}
                        onChange={e => setCurrentPage(e)}
                    /></div>}

                    isStriped
                >
                    <TableHeader>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>NIS</TableColumn>
                        <TableColumn>Formal</TableColumn>
                        <TableColumn>Diniyah</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {siswa?.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className='text-nowrap'>{item.nama_siswa}</TableCell>
                                <TableCell>{item.nis}</TableCell>
                                <TableCell className='uppercase'>{item.formal}</TableCell>
                                <TableCell className='uppercase'>{item.diniyah}</TableCell>
                                <TableCell><Button size='sm' className='hover:-translate-y-1 transition-all' color='primary' variant='shadow' onClick={() => navigate(`/dashboard/payment/payment-detail/${id}/${item.id}`)}>detail</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DeleteModalPayment modal={modalDelete} setModal={setModalDelete} id={idToDelete} info={toastInfo} success={toastSuccess} />
            <ModalDownloadLaporan modal={modalLaporan} setModal={setModalLaporan} id={id} bulanan={bulanan} />
        </DashboardTemplate>
    )
}

export default DetailPayment