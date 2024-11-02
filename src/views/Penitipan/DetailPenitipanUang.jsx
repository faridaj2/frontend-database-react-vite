/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import DashboardTemplate from "../../components/DashboardTemplate"
import AuthUser from "../../utils/AuthUser"
import { useParams } from "react-router-dom"
import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react"
import { motion } from "framer-motion"

import { I18nProvider } from "@react-aria/i18n";

// Modal
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, DatePicker, Avatar } from "@nextui-org/react";

// icon
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs"
import { MdDelete } from "react-icons/md"

// Utilitas
import AllUtils from "../../utils/AllUtils"
import getImage from "../../utils/getImage"

function DetailPenitipanUang() {
    const { id } = useParams()
    const { http } = AuthUser()

    const { addComa } = AllUtils()

    const [deposit, setDeposit] = useState(false)
    const [tarik, setTarik] = useState(false)

    const [month, setMonth] = useState()
    const [selectedMonth, setSelectedMonth] = useState()
    const [history, setHistory] = useState()
    const [siswa, setSiswa] = useState()
    const [executed, setExecuted] = useState(false)
    const [detail, setDetail] = useState()
    const [modalDetail, setModalDetail] = useState()

    useEffect(() => {
        document.title = 'Detail Penitipan Uang'
        getSiswa()
        getMonth()
    }, [])
    useEffect(() => {
        if (month && month.length > 0 && !executed) {
            setSelectedMonth(month[0].value);
            setExecuted(true);
        }
    }, [month, executed]);
    useEffect(() => {
        if (!selectedMonth) return
        setHistory()
        getHistory()
    }, [selectedMonth, siswa])

    const getHistory = () => {
        http.get(`/api/get-riwayat-payment?id=${id}&date=${selectedMonth}`)
            .then(res => setHistory(res.data))
            .catch(error => console.log(error))
    }
    const reset = () => {
        getSiswa()
        getMonth()
    }
    const getSiswa = () => {
        http.get(`/api/getSiswaById?id=${id}`)
            .then(res => setSiswa(res.data))
            .catch(error => console.log(error))
    }
    const getMonth = () => {
        http.get(`/api/money-management/get-month?id=${id}`)
            .then(res => {
                setMonth(res.data)
            })
            .catch(error => console.log(error))
    }
    const openModalDetail = data => {
        setDetail(data)
        setModalDetail(true)
    }
    return (
        <DashboardTemplate>
            <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="grow w-full">
                    <div className="w-full text-center p-2 rounded-xl bg-white m-2">
                        <div className="py-20 font-bold text-3xl font-mono">
                            <div> Rp. {addComa(siswa && siswa.uang_saku ? siswa.uang_saku : '0')}</div>
                        </div>
                        <div className="flex gap-3 items-center my-3 border-1 border-violet-500 p-4 rounded-xl shadow-md">
                            <Avatar src={getImage(siswa && siswa)} isBordered color="primary" />
                            <div className="flex flex-col items-start">
                                <div className="font-semibold text-gray-700">{siswa?.nama_siswa}</div>
                                <div className="text-tiny text-gray-500">{siswa?.nis}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button color="primary" size="lg" variant="shadow" className="w-full" onClick={() => setDeposit(true)}><BsCaretUpFill />Deposit</Button>
                            <Button color="danger" size="lg" variant="shadow" className="w-full" onClick={() => setTarik(true)}><BsCaretDownFill />Withdraw</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-sm md:m-2 mx-auto">
                    <div className="rounded-xl p-2 bg-white text-violet-700 font-semibold flex justify-between items-center">
                        <div>Riwayat</div>
                        <div className="w-1/2">
                            <Select label="Pilih Bulan" size="sm" selectedKeys={[selectedMonth]} onChange={e => setSelectedMonth(e.target.value)} >
                                {month?.map(item => (
                                    <SelectItem key={item.value} value={item.value}>{item.month_year}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {
                            history
                                ?
                                history.length > 0 ?
                                    history?.map(data => (
                                        <div className={"flex items-center gap-3 p-2 text-white rounded-xl shadow-md shadow-danger-700/30 cursor-pointer " + (data.jenis === 'masuk' ? 'bg-primary' : 'bg-danger')} key={data.id} onClick={() => openModalDetail(data)}>
                                            {data.jenis === 'keluar' ? <BsCaretDownFill /> : <BsCaretUpFill />}
                                            <div>
                                                Rp. {addComa(data.uang)}
                                            </div>
                                            <div className="bg-white text-black rounded-md px-2 text-tiny ml-auto">{data.date}</div>
                                        </div>
                                    ))
                                    :
                                    <Spinner />
                                :
                                <div className="text-center">Tidak ada riwayat</div>
                        }
                    </div>
                </div>
            </div >
            <ModalDeposit modal={deposit} setModal={setDeposit} id={siswa?.id} reset={reset} />
            <ModalTarik modal={tarik} setModal={setTarik} id={siswa?.id} reset={reset} />
            {modalDetail && <DetailModal modal={modalDetail} setModal={setModalDetail} detail={detail} reset={reset} />}

        </DashboardTemplate >
    )
}

const ModalDeposit = ({ modal, setModal, id, reset }) => {
    const onOpenChange = () => setModal(!modal)
    const [uang, setUang] = useState()
    const [desc, setDesc] = useState()
    const [date, setDate] = useState()


    const { addComa, convertDate } = AllUtils()
    const { http } = AuthUser()

    useEffect(() => {
        if (!uang) return
        setUang(addComa(uang))
    }, [uang])

    const submitHandler = e => {
        e.preventDefault()
        if (!uang || !desc || !date) return
        const data = {
            siswa_id: id,
            keterangan: desc,
            uang: parseInt(uang.replace(/\./g, '')),
            jenis: 'masuk',
            date: convertDate(date)
        }
        http.post('/api/money-management', data)
            .then(() => {
                setDate()
                setUang()
                setDesc()
                reset()
                onOpenChange()
            })
            .catch(error => console.log(error))
    }
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Deposit</ModalHeader>
                        <ModalBody>
                            <form className="grid grid-cols-1 gap-2" onSubmit={submitHandler}>
                                <Input startContent="Rp. " value={uang} color="primary" variant="bordered" placeholder="Jumlah deposit" onValueChange={setUang} />
                                <Textarea color="primary" placeholder="Keterangan" variant="bordered" value={desc} onValueChange={setDesc} />

                                <I18nProvider locale="id-ID">
                                    <DatePicker color="primary" variant="bordered" value={date} onChange={setDate} />
                                </I18nProvider>
                                <Button type="submit" color="primary" > <BsCaretUpFill /> Deposit</Button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
const ModalTarik = ({ modal, setModal, id, reset }) => {
    const onOpenChange = () => setModal(!modal)
    const [uang, setUang] = useState()
    const [desc, setDesc] = useState()
    const [date, setDate] = useState()


    const { addComa, convertDate } = AllUtils()
    const { http } = AuthUser()

    useEffect(() => {
        if (!uang) return
        setUang(addComa(uang))
    }, [uang])

    const submitHandler = e => {
        e.preventDefault()
        if (!uang || !desc || !date) return
        const data = {
            siswa_id: id,
            keterangan: desc,
            uang: parseInt(uang.replace(/\./g, '')),
            jenis: 'keluar',
            date: convertDate(date)
        }
        http.post('/api/money-management', data)
            .then(() => {
                setDate()
                setUang()
                setDesc()
                reset()
                onOpenChange()
            })
            .catch(error => console.log(error))
    }
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">WithDraw</ModalHeader>
                        <ModalBody>
                            <form className="grid grid-cols-1 gap-2" onSubmit={submitHandler}>
                                <Input startContent="Rp. " value={uang} color="primary" variant="bordered" placeholder="Jumlah deposit" onValueChange={setUang} />
                                <Textarea color="primary" placeholder="Keterangan" variant="bordered" value={desc} onValueChange={setDesc} />

                                <I18nProvider locale="id-ID">
                                    <DatePicker color="primary" variant="bordered" value={date} onChange={setDate} />
                                </I18nProvider>
                                <Button type="submit" color="danger" > <BsCaretDownFill /> WithDraw</Button>
                            </form>
                        </ModalBody>
                        <ModalFooter>

                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )

}
const DetailModal = ({ modal, setModal, detail, reset }) => {
    const { http } = AuthUser()
    const onOpenChange = () => setModal(!modal)
    const [menu, setMenu] = useState(false)
    const deleteHandler = () => {
        http.post('/api/money-management/delete', { id: detail?.id })
            .then(() => {
                reset()
                onOpenChange()
            })
            .catch(res => console.log(res))
    }

    const { addComa } = AllUtils()
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Detail</ModalHeader>
                        <ModalBody className="relative">
                            <motion.div className="absolute flex items-center justify-center w-full bg-white top-0 right-0 rounded p-4 h-full z-20"
                                initial={{ y: 500 }}
                                animate={{ y: menu ? 0 : 500, opacity: menu ? 1 : 0, scale: menu ? 1 : 0 }}
                            >
                                <div className="text-center text-xl">
                                    Hapus transaksi ini?
                                    <div className="mt-6 flex gap-2 justify-center">
                                        <Button color="default" onClick={() => setMenu(false)} variant="shadow">Batal</Button>
                                        <Button color="danger" onClick={deleteHandler} variant="shadow">Hapus</Button>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="flex justify-end items-center gap-2">
                                <Button isIconOnly color="danger" variant="shadow" onClick={() => setMenu(!menu)}>
                                    <MdDelete />
                                </Button>
                            </div>
                            <div className="border-1 p-2 rounded-md " >
                                <div className="text-tiny text-gray-500">Jenis Transaksi</div>
                                <div className={`uppercase inline p-1 rounded-md text-white text-tiny mt-2 ${detail?.jenis === 'masuk' ? 'bg-primary' : 'bg-danger'}`}>{detail && detail.jenis === 'masuk' ? 'Deposito' : 'Penarikan'}</div>

                            </div>
                            <div className="border-1 p-2 rounded-md" >
                                <div className="text-tiny text-gray-500">Jumlah Uang</div>
                                <div className="uppercase">Rp. {addComa(detail?.uang)}</div>
                            </div>
                            <div className="border-1 p-2 rounded-md" >
                                <div className="text-tiny text-gray-500">Tanggal</div>
                                <div className="uppercase">{detail?.date}</div>
                            </div>
                            <div className="border-1 p-2 rounded-md h-40 scroll overflow-y-auto" >
                                <div className="text-tiny text-gray-500">Keterangan</div>
                                <div className="uppercase">{detail?.keterangan}</div>
                            </div>
                        </ModalBody>
                        <ModalFooter>

                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal >
    )
}



export default DetailPenitipanUang