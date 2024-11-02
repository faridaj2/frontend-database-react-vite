/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react"
import { useEffect } from "react"
import DashboardTemplate from "../../components/DashboardTemplate"
import { Divider, Input, Button, Textarea, DatePicker, Avatar, Pagination, Checkbox } from "@nextui-org/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

// Icon
import { IoMdClose, IoMdAdd } from "react-icons/io"
import { FaSearch } from "react-icons/fa"

// Utitilitas
import AuthUser from "../../utils/AuthUser"
import { I18nProvider } from "@react-aria/i18n";
import AllUtils from "../../utils/AllUtils"
import getImage from "../../utils/getImage"


function Keamanan() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [pencarian, setPencarian] = useState(false)
    const { http } = AuthUser()
    const { convertDate } = AllUtils()
    // var
    const [search, setSearch] = useState()
    const [siswa, setSiswa] = useState()
    const [selected, setSelected] = useState([])

    const [pelanggaran, setPelanggaran] = useState()
    const [poin, setPoin] = useState()
    const [date, setDate] = useState()

    // Search Pelanggar
    const [searchPelanggar, setSearchPelanggar] = useState("")
    const [pelanggar, setPelanggar] = useState()
    const [page, setPage] = useState(1)
    const [all, setAll] = useState(true)

    // UseEffect
    useEffect(() => {
        document.title = 'Keamanan'
    }, [])
    useEffect(() => {
        getSiswaP()
    }, [searchPelanggar, page, all])

    useEffect(() => {
        if (!search) return setSiswa()
        searchSiswa()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])


    // Function add siswa
    const searchSiswa = () => {
        http.get(`/api/gettable?search=${search}`)
            .then(res => {
                setSiswa(res.data.paginate.data)
            })
            .catch(error => console.log(error))
    }
    const addToSelected = item => {
        const array = [...selected]
        if (!array.includes(item)) {
            array.push(item)
            setSelected(array)
        }
    }
    const removeSelected = index => {
        const array = [...selected]
        array.splice(index, 1)
        setSelected(array)
    }
    const submitHandler = () => {
        if (!selected) return
        if (!pelanggaran) return
        if (!poin) return
        if (!date) return

        const id = selected.map(item => item.id)
        const tanggal = convertDate(date)
        const data = {
            id, pelanggaran, poin, tanggal
        }

        http.post('/api/add-pelanggaran', data)
            .then(() => {
                setSelected()
                setPelanggaran()
                setDate()
                setPoin()
                getSiswaP()
                setOpen(false)
            })
    }
    // Function get Siswa With Pelanggaran
    const getSiswaP = () => {
        http.get(`/api/get-siswa-with?page=${page}&search=${searchPelanggar}&status=${all}`)
            .then(res => {
                setPelanggar(res.data)
            })
    }
    return (
        <DashboardTemplate>
            <div className="flex h-full flex-col md:flex-row">
                <div className="grow h-full flex flex-col">
                    <div className="flex gap-2">
                        <Input color="primary" placeholder="Cari Siswa" endContent={<FaSearch />} value={searchPelanggar} onValueChange={setSearchPelanggar} />
                    </div>
                    <div className="my-2 flex flex-col md:flex-row gap-2 items-center">
                        {/* <Button className="grow md:grow-0" size="sm" color="primary" variant="shadow">Pemutihan</Button> */}
                        <Button className="grow md:grow-0" size="sm" color="primary" variant="shadow" onClick={() => setOpen(!open)}>Tambah Pelanggaran Baru</Button>
                        <Checkbox className="grow md:grow-0" isSelected={all} onValueChange={setAll}>Dengan Pelanggaran</Checkbox>
                    </div>
                    <div className="grow border-1 p-2 rounded-xl flex flex-col gap-2 overflow-y-auto scroll">
                        <AnimatePresence>
                            {pelanggar && pelanggar.data.map(item => (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -100, opacity: 0 }}
                                    className="border-1 shadow bg-white p-3 rounded-md flex items-center gap-3 cursor-pointer" key={`pelanggar-${item.id}`} onClick={() => navigate(`/dashboard/keamanan/detail/${item.id}`)}>
                                    <Avatar color="primary" src={getImage(item)} isBordered size="sm"></Avatar>
                                    <div>
                                        <div>{item.nama_siswa}</div>
                                        <div className="text-tiny text-gray-500">{item.nis}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {!pelanggar && (
                            <div className='w-full flex items-center justify-center p-5'>
                                <span className="loader"></span>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        {pelanggar && pelanggar.last_page !== 1 && <Pagination showControls total={pelanggar.last_page} page={page} onChange={(e) => setPage(e)} />}
                    </div>
                </div>
                <AnimatePresence>
                    {open &&
                        <motion.div
                            className="h-full w-full max-w-[425px]"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <div className="border-1 p-2 rounded-xl mt-2 md:mt-0 md:ml-2 h-full">
                                <div>
                                    <div className="flex flex-col gap-2">
                                        {selected && selected.map((item, index) => (
                                            <div className="bg-primary-50 p-2 rounded-xl flex justify-between items-center" key={`select-${item.id}`}>
                                                <div>
                                                    <div className="uppercase font-semibold text-primary">
                                                        {item.nama_siswa}
                                                    </div>
                                                    <div className="text-tiny text-gray-500">
                                                        {item.nis}
                                                    </div>
                                                </div>
                                                <Button className="ml-auto" isIconOnly color="primary" size="sm" onClick={() => removeSelected(index)}><IoMdClose /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Divider className="my-3" />
                                    <div className="flex items-center gap-2 cursor-pointer mb-2 relative justify-between" onClick={() => setPencarian(!pencarian)}>
                                        <span className="text-primary text-tiny italic">Pencarian</span>
                                        <Divider className="w-2/3" />
                                        <FaSearch className="text-tiny text-primary" />
                                    </div>
                                    <motion.div
                                        className="overflow-hidden"
                                        initial={{ height: 0 }}
                                        animate={{ height: pencarian ? 'auto' : 0 }}
                                    >
                                        <Input color="primary" variant="flat" placeholder="Cari Siswa" value={search} onValueChange={setSearch} startContent={<FaSearch />} />
                                        <div className="scroll overflow-y-auto max-h-44 my-2 grid grid-cols-1 gap-2">
                                            {siswa && siswa.map(item => (
                                                <div className="border-1 p-3 rounded-md flex gap-4 items-center" key={item.id}>
                                                    <div >
                                                        <div className="uppercase font-semibold text-primary">
                                                            {item.nama_siswa}
                                                        </div>
                                                        <div className="text-tiny text-gray-500">
                                                            {item.nis}
                                                        </div>
                                                    </div>
                                                    <Button className="ml-auto" isIconOnly color="primary" size="sm" onClick={() => addToSelected(item)}><IoMdAdd /></Button>
                                                </div>
                                            ))}

                                        </div>
                                    </motion.div>
                                    <div className="mt-3">
                                        <Textarea color="primary" placeholder="Jenis Pelanggaran" value={pelanggaran} onValueChange={setPelanggaran} />
                                        <Input color="primary" placeholder="Poin" type="number" className="mt-2" value={poin} onValueChange={setPoin} />
                                        <I18nProvider locale="id-ID">
                                            <DatePicker color="primary" className="mt-2" value={date} onChange={setDate} />
                                        </I18nProvider>
                                        <Button className="w-full mt-2" color="primary" onClick={submitHandler}>Tambahkan</Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div >
        </DashboardTemplate >
    )
}

export default Keamanan