import { useState, useEffect } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Input,
    Select,
    SelectItem,
    Chip
} from "@nextui-org/react";

import AllUtils from '../../utils/AllUtils';
import AuthUser from '../../utils/AuthUser';

export default function ModalAdministrasi({ modal, setModal, reset }) {
    const onOpenChange = () => {
        reset()
        setModal(!modal)
    }

    // Utilitas
    const { addComa } = AllUtils()
    const { http } = AuthUser()
    const [listKolom, setListKolom] = useState([])

    // Get data

    const getKolom = () => {
        http.get('/api/pspdb/read/kolom')
            .then(r => {
                setListKolom(r.data)
                setLoading(false);
            })
    }
    // State edit, delete
    const [itemState, setItemState] = useState()

    const edit = (item) => {
        setItemState(item)
        setEditModal(!editModal)
    }
    const deleteHandle = item => {
        setItemState(item)
        setDeleteModal(!deleteModal)
    }

    // UseEffect
    useEffect(() => {
        getKolom()
    }, [])

    // Modal
    const [kolomModal, setKolomModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [historyModal, setHistoryModal] = useState(false)

    const [loading, setLoading] = useState(true)

    const orderUp = id => {
        setLoading(true)
         http.get(`/api/pspdb/edit/kolom/order/up/${id}`)
        .then(r => getKolom())
    }
    const orderDown = id => {
        setLoading(true)
        http.get(`/api/pspdb/edit/kolom/order/down/${id}`)
        .then(r => getKolom())
    }
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange} size="full">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Daftar Kolom</ModalHeader>
                            <ModalBody>
                                <div className="border shadow rounded-xl p-3 flex gap-2">
                                    <Button color="primary" onClick={() => setKolomModal(!kolomModal)}>Tambah Kolom</Button>
                                    <Button color="primary" isIconOnly onClick={() => setHistoryModal(!historyModal)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                                    </Button>
                                </div>
                                {
                                    loading &&
                                    <div className='w-full flex items-center justify-center p-5'>
                                        <span className="loader"></span>
                                    </div>
                                }
                                <Table isStriped aria-label="Table Administrasi" className={`${loading && 'hidden'}`}>
                                    <TableHeader>
                                        <TableColumn>Nama Kolom</TableColumn>
                                        <TableColumn>Sekolah</TableColumn>
                                        <TableColumn>Kelamin</TableColumn>
                                        <TableColumn>Biaya</TableColumn>
                                        <TableColumn>Aksi</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {listKolom && listKolom.map((item, index) => (
                                            <TableRow key={`row` + index}>
                                                <TableCell className='text-nowrap'>{item.nama_kolom}</TableCell>
                                                <TableCell className='text-xs uppercase'>{!item.formal ? 'Semua' : item.formal}</TableCell>
                                                <TableCell className='text-xs uppercase'>{!item.kelamin ? 'Semua' : item.kelamin.toUpperCase()}</TableCell>
                                                <TableCell className='uppercase text-xs'>Rp. {addComa(item.harga)}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <button className='text-gray-600 hover:text-gray-900' onClick={() => edit(item)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                                                    </button>
                                                    <button className='text-gray-600 hover:text-gray-900' onClick={() => deleteHandle(item)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                    <button className='text-gray-600 hover:text-gray-900' onClick={() => orderUp(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-up-icon lucide-move-up"><path d="M8 6L12 2L16 6" /><path d="M12 2V22" /></svg>
                                                    </button>
                                                    <button className='text-gray-600 hover:text-gray-900' onClick={() => orderDown(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-down-icon lucide-move-down"><path d="M8 18L12 22L16 18" /><path d="M12 2V22" /></svg>
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ModalKolom kolomModal={kolomModal} setKolomModal={setKolomModal} getKolom={getKolom} />
            {
                editModal &&
                <EditModal modal={editModal} setModal={setEditModal} item={itemState} getKolom={getKolom} />
            }
            {
                deleteModal &&
                <DeleteModal modal={deleteModal} setModal={setDeleteModal} item={itemState} getKolom={getKolom} />
            }
            {
                historyModal &&
                <HistoryModal modal={historyModal} setModal={setHistoryModal} getKolom={getKolom}/>
            }
        </>
    )
}

function ModalKolom({ kolomModal, setKolomModal, getKolom }) {
    const onOpenChange = () => setKolomModal(!kolomModal)

    const { addComa, ToastContainer, toastInfo } = AllUtils()
    const { http } = AuthUser()

    // Data
    const [kolom, setKolom] = useState("")
    const [biaya, setBiaya] = useState("")
    const [sekolah, setSekolah] = useState("")
    const [kelamin, setKelamin] = useState("")

    // state button
    const [isLoading, setIsLoading] = useState(false)

    // UseEffect
    useEffect(() => {
        if (!biaya) return
        setBiaya(addComa(biaya))
    }, [biaya])

    const submit = () => {
        setIsLoading(true)
        if (!kolom || !biaya) return toastInfo('Nama Kolom/Biaya tidak boleh kosong')

        http.post('/api/pspdb/store/kolom', {
            kolom, sekolah, kelamin, biaya: biaya.replace(/\./g, '')
        })
            .then(res => getKolom())


        setKolom("")
        setBiaya("")
        setKolomModal(false)

    }
    return (
        <>
            <ToastContainer />
            <Modal isOpen={kolomModal} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Tambah Kolom</ModalHeader>
                            <ModalBody>
                                <Input
                                    className=""
                                    defaultValue=""
                                    label="Nama Kolom"
                                    type="text"
                                    variant="bordered"
                                    value={kolom}
                                    onValueChange={setKolom}
                                />
                                <Input
                                    className=""
                                    defaultValue=""
                                    label="Biaya"
                                    type="text"
                                    variant="bordered"
                                    value={biaya}
                                    onValueChange={setBiaya}
                                    startContent={`Rp. `}
                                />
                                <Select
                                    label="Sekolah"
                                    selectedKeys={[sekolah]}
                                    onChange={e => setSekolah(e.target.value)}
                                >
                                    <SelectItem key="" value="">
                                        Semua
                                    </SelectItem>
                                    <SelectItem key="smp" value="smp">
                                        SMP
                                    </SelectItem>
                                    <SelectItem key="smk" value="smk">
                                        SMK
                                    </SelectItem>
                                </Select>
                                <Select
                                    label="Kelamin"
                                    selectedKeys={[kelamin]}
                                    onChange={e => setKelamin(e.target.value)}
                                >
                                    <SelectItem key="" value="">
                                        Semua
                                    </SelectItem>
                                    <SelectItem key="l" value="l">
                                        Laki-Laki
                                    </SelectItem>
                                    <SelectItem key="p" value="p">
                                        Perempuan
                                    </SelectItem>
                                </Select>

                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onClick={submit}>Tambah</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}
function EditModal({ modal, setModal, item, getKolom }) {
    const onOpenChange = () => setModal(!modal)
    const { addComa } = AllUtils()
    const { http } = AuthUser()

    // Data
    const [kolom, setKolom] = useState("")
    const [biaya, setBiaya] = useState("")
    const [sekolah, setSekolah] = useState("smp")
    const [kelamin, setKelamin] = useState("")

    useEffect(() => {
        if (!item) return
        setKolom(item?.nama_kolom)
        setBiaya(item?.harga)
        setSekolah(item?.formal)
        setKelamin(item?.kelamin)
    }, [])

    useEffect(() => {
        if (!biaya) return
        setBiaya(addComa(biaya))
    }, [biaya])

    const submit = () => {
        http.post('/api/pspdb/edit/kolom', {
            kolom, sekolah, kelamin, biaya: biaya.replace(/\./g, ''), id: item.id
        })
            .then(r => getKolom())
        setModal(false)
    }

    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Tambah Kolom</ModalHeader>
                            <ModalBody>
                                <Input
                                    className=""
                                    defaultValue=""
                                    label="Nama Kolom"
                                    type="text"
                                    variant="bordered"
                                    value={kolom}
                                    onValueChange={setKolom}
                                />
                                <Input
                                    className=""
                                    defaultValue=""
                                    label="Biaya"
                                    type="text"
                                    variant="bordered"
                                    value={biaya}
                                    onValueChange={setBiaya}
                                />
                                <Select
                                    label="Sekolah"
                                    selectedKeys={[sekolah]}
                                    onChange={e => setSekolah(e.target.value)}
                                >
                                    <SelectItem key="">
                                        Semua
                                    </SelectItem>
                                    <SelectItem key="smp">
                                        SMP
                                    </SelectItem>
                                    <SelectItem key="smk">
                                        SMK
                                    </SelectItem>
                                </Select>
                                <Select
                                    label="Kelamin"
                                    selectedKeys={[kelamin]}
                                    onChange={e => setKelamin(e.target.value)}
                                >
                                    <SelectItem key="">
                                        Semua
                                    </SelectItem>
                                    <SelectItem key="l">
                                        Laki-Laki
                                    </SelectItem>
                                    <SelectItem key="p">
                                        Perempuan
                                    </SelectItem>
                                </Select>

                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onClick={submit}>Edit</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}
function DeleteModal({ modal, setModal, item, getKolom }) {
    const onOpenChange = () => {
        setModal(!modal)
    }
    const { http } = AuthUser()
    const handleDelete = () => {
        http.post(`/api/pspdb/edit/kolom/status/delete/${item.id}`)
        .then(r => getKolom())
        onOpenChange()
    }
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Yakin akan menghapus</ModalHeader>
                            <ModalBody>
                                <div className='text-center'>
                                    <div className='flex justify-center p-2 rounded-xl items-center'>
                                        <div className='text-2xl font-bold'>{item.nama_kolom}</div>
                                    </div>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color='danger' onClick={handleDelete}>Hapus</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}
function HistoryModal({ modal, setModal, getKolom }) {
    const onOpenChange = () => setModal(!modal)

    const { http } = AuthUser();
    const [columns, setColumns] = useState()

    const getCol = () => {
        http.get('/api/pspdb/read/kolom?status=1')
            .then(r => setColumns(r.data))
    }
    useEffect(() => {
        getCol()
    }, [])

    const handleRestore = (id) => {
        http.post(`/api/pspdb/edit/kolom/status/restore/${id}`)
        .then(r => {
            getCol()
            getKolom()})
    }
    
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange} size="full">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">History Modal</ModalHeader>
                            <ModalBody>
                                <Table isStriped aria-label="Table History">
                                    <TableHeader>
                                        <TableColumn>Nama Tabel</TableColumn>
                                        <TableColumn>Kelas</TableColumn>
                                        <TableColumn>Kelamin</TableColumn>
                                        <TableColumn>Biaya</TableColumn>
                                        <TableColumn>Aksi</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {columns?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className='text-xs'>{item.nama_kolom}</TableCell>
                                                <TableCell className='text-xs uppercase'>{item.formal = '' ? 'Semua' : item.formal}</TableCell>
                                                <TableCell className='text-xs'>Laki-Laki</TableCell>
                                                <TableCell className='text-xs'>Rp. 50.000</TableCell>
                                                <TableCell className='text-xs'>
                                                    <button className='text-gray-500 hover:text-gray-900' onClick={() => handleRestore(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive-restore-icon lucide-archive-restore"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h2" /><path d="M20 8v11a2 2 0 0 1-2 2h-2" /><path d="m9 15 3-3 3 3" /><path d="M12 12v9" /></svg>
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                                {!columns && (
                                    <div className='w-full flex items-center justify-center p-5'>
                                        <span className="loader"></span>
                                    </div>
                                )}

                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                            
                        </>
                    )}
                </ModalContent>

            </Modal>
        </>
    )
}
