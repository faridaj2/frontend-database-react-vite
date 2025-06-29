/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import AuthUser from '../../utils/AuthUser';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react"

//Icon
import { FaGear } from "react-icons/fa6";
import { RiDeleteBack2Fill } from "react-icons/ri"
import { IoIosSend } from "react-icons/io"
import { FaPlus } from "react-icons/fa"
import { GrGroup } from "react-icons/gr"
import { TiDelete } from "react-icons/ti"
import { IoIosSave } from "react-icons/io"
import { ImDatabase } from "react-icons/im"

//utilitas
import AllUtils from '../../utils/AllUtils';




function ZonaAdmin() {
    // utilitas
    const { http, user } = AuthUser()
    const { toastSuccess, toastInfo, ToastContainer } = AllUtils()


    // Use State & Disclosure
    const [listUser, setListUser] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selected, setSelected] = useState([])
    const [userSelected, setUserSelected] = useState()
    const [isLoading, setIsLoading] = useState(false)

    // UseStateDeleteModal
    const [isModalOpen, setModalOpen] = useState(false)
    const [modalCreate, setModalCreate] = useState(false)

    // Kelas
    const [formal, setFormal] = useState([])
    const [inputFormal, setInputFormal] = useState()
    const [isSaveFormal, setIsSaveFormal] = useState(false)

    const [diniyah, setDiniyah] = useState([])
    const [inputDiniyah, setInputDiniyah] = useState()
    const [isSaveDiniyah, setIsSaveDiniyah] = useState(false)

    // Kamar
    const [kamar, setKamar] = useState([])
    const [inputKamar, setInputKamar] = useState()
    const [isSaveKamar, setIsSaveKamar] = useState(false)


    useEffect(() => {

        document.title = 'Zona Admin'
        getUser()
        getData('formal', setFormal)
        getData('diniyah', setDiniyah)
        getData('kamar', setKamar)
    }, [])
    const getData = (type, setData) => {
        http.get(`/api/get-sysetem-data/${type}`)
            .then(res => setData(JSON.parse(res.data)))
            .catch(res => console.log(res))
    }

    const getUser = () => {
        http.get('/api/get-account')
            .then(res => setListUser(res.data.user))
            .catch(res => console.log(res))
    }

    const openModalSetting = (user) => {
        onOpen()
        const role = JSON.parse(user.hak)
        setUserSelected(user)
        setSelected(role)
    }

    const changePermission = (onClose) => {
        setIsLoading(true)
        const data = {
            id: userSelected.id,
            access: JSON.stringify(selected)
        }
        http.post('/api/change-permission', data)
            .then(() => {
                toastSuccess('Selesai')
                setIsLoading(false)
                getUser()
                onClose()
            })
            .catch(() => {
                toastInfo('Terjadi Kesalahan')
                setIsLoading(false)
                getUser()
            })
        onOpen()
    }

    const deleteAccount = (accout) => {
        setUserSelected(accout)
        setModalOpen(true)
    }

    const addToArray = (type, setType, input, setInput, save) => {
        if (input === '' || !input) return
        const label = input.toUpperCase()
        const key = input.replace(/\s/g, "").toLowerCase();
        const obj = { label, key }
        const ifExist = type.find(item => item.key === obj.key)
        if (ifExist) return setInput('')
        let array = [...type]
        array.push(obj)
        setInput('')
        setType(array)
        save(true)
    }
    const deleteFromArray = (type, setType, key, save) => {
        const filtered = type.filter(some => some.key !== key)
        setType(filtered)
        save(true)
    }
    const saveData = (data, type, save) => {
        const value = JSON.stringify(data)
        http.post(`/api/save-settings-data/${type}`, value)
            .then(() => {
                save(false)
                save(false)
                toastSuccess('Success')
            })
            .catch(res => console.log(res))
    }
    const backupDb = () => {
        http.get('/api/get-db-backup',)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'backup.sql');
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    }
    return (
        <DashboardTemplate>
            <div className='w-full'>
                <ToastContainer />
                <div className='w-full flex justify-end my-2'>
                    <Button color='primary' onClick={() => setModalCreate(true)}>Tambah User</Button>
                </div>
                <Table aria-label='Tabel user akun' isStriped >
                    <TableHeader>
                        <TableColumn>
                            User
                        </TableColumn>
                        <TableColumn>
                            Action
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {listUser?.map((item, index) => (
                            <TableRow key={index} className='p-2'>
                                <TableCell>
                                    <div>
                                        <div>
                                            {item.name}
                                        </div>
                                        <div className='text-tiny text-gray-400 flex gap-1 mt-2'>{JSON.parse(item.hak).map((item, index) => (
                                            <Chip size='sm' key={item + index} color='primary'>
                                                <div key={index + item}>{item}</div>
                                            </Chip>
                                        ))}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-1 items-center gap-2 text-blue-700'>
                                        <button  onClick={() => openModalSetting(item)} size='sm' isIconOnly isDisabled={user.id === item.id}><FaGear /> </button>
                                        <button disabled={user.id === item.id} onClick={() => deleteAccount(item)}><RiDeleteBack2Fill /> </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Card className='my-2'>
                    <CardHeader>Kelas</CardHeader>
                    <CardBody>
                        <div className='flex flex-col md:flex-row gap-3 w-full'>
                            <div className='outline outline-1 outline-gray-300 rounded-lg w-full'>
                                <div className='flex justify-between items-center p-2'>
                                    <span className='font-medium text-blue-800'>Kelas Formal</span>
                                    <div className='flex gap-2 items-center' >
                                        {isSaveFormal && <Button isIconOnly color='primary' onClick={() => saveData(formal, 'formal', setIsSaveFormal)} size='sm' className='text-xl'><IoIosSave /></Button>}

                                        <Input value={inputFormal} onValueChange={setInputFormal} size='sm' />
                                        <Button className='' isIconOnly size='sm' color='primary' onClick={() => addToArray(formal, setFormal, inputFormal, setInputFormal, setIsSaveFormal)}><FaPlus /></Button>
                                    </div>
                                </div>
                                <Divider className='mt-2' />
                                <div className=''>
                                    {formal?.map(item => (
                                        <div className='flex justify-between items-center p-3 odd:bg-blue-50 hover:bg-blue-200' key={item.key}>
                                            <div className='flex gap-3 items-center'>
                                                <div className='p-2 rounded-md bg-white shadow'><GrGroup /></div>
                                                <div className='font-medium'>
                                                    {item.label}
                                                </div>
                                            </div>
                                            <div className='text-xl'>
                                                <Button color='danger' isIconOnly className='text-xl' variant='light' size='sm' onClick={() => deleteFromArray(formal, setFormal, item.key, setIsSaveFormal)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                            <div className='outline outline-1 outline-gray-300 rounded-lg w-full'>
                                <div className='flex justify-between items-center p-2'>
                                    <span className='font-medium text-blue-800'>Kelas Diniyah</span>
                                    <div className='flex gap-2 items-center' >
                                        {isSaveDiniyah && <Button isIconOnly color='primary' onClick={() => saveData(diniyah, 'diniyah', setIsSaveDiniyah)} size='sm' className='text-xl'><IoIosSave /></Button>}
                                        <Input value={inputDiniyah} onValueChange={setInputDiniyah} size='sm' />
                                        <Button className='' isIconOnly size='sm' color='primary' onClick={() => addToArray(diniyah, setDiniyah, inputDiniyah, setInputDiniyah, setIsSaveDiniyah)}><FaPlus /></Button>
                                    </div>
                                </div>
                                <Divider className='mt-2' />
                                <div className=''>
                                    {diniyah?.map(item => (
                                        <div className='flex justify-between items-center p-3 odd:bg-blue-50 hover:bg-blue-200' key={item.key}>
                                            <div className='flex gap-3 items-center'>
                                                <div className='p-2 rounded-md bg-white shadow'><GrGroup /></div>
                                                <div className='font-medium'>
                                                    {item.label}
                                                </div>
                                            </div>
                                            <div className='text-xl'>
                                                <Button color='danger' isIconOnly className='text-xl' variant='light' size='sm' onClick={() => deleteFromArray(diniyah, setDiniyah, item.key, setIsSaveDiniyah)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-between items-center'>
                        <span className='font-medium text-blue-800'>Kamar</span>
                        <div className='flex gap-2'>
                            {isSaveKamar && <Button isIconOnly color='primary' onClick={() => saveData(kamar, 'kamar', setIsSaveKamar)} size='sm' className='text-xl'><IoIosSave /></Button>}
                            <Input size='sm' value={inputKamar} onValueChange={setInputKamar} />
                            <Button color='primary' size='sm' isIconOnly onClick={() => addToArray(kamar, setKamar, inputKamar, setInputKamar, setIsSaveKamar)}><FaPlus /></Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Divider className='mt-2' />
                        <div className=''>
                            {kamar?.map(item => (
                                <div className='flex justify-between items-center p-3 bg-blue-100 hover:bg-blue-200' key={item.key}>
                                    <div className='flex gap-3 items-center'>
                                        <div className='p-2 rounded-md bg-white shadow'><GrGroup /></div>
                                        <div className='font-medium'>
                                            {item.label}
                                        </div>
                                    </div>
                                    <div className='text-xl'>
                                        <Button color='danger' isIconOnly className='text-xl' variant='light' size='sm' onClick={() => deleteFromArray(kamar, setKamar, item.key, setIsSaveKamar)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
                <Card className='mt-2'>
                    <CardHeader className='flex justify-between items-center'>
                        <span className='font-medium text-blue-800'>Database</span>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Button color='primary' onClick={backupDb} variant='shadow'> <ImDatabase /> <span className='font-bold'>BACKUP</span></Button>
                        </div>
                    </CardBody>
                </Card>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Atur hak akses untuk {userSelected.name}</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-3">
                                        <CheckboxGroup
                                            label="Pilih hak akses"
                                            color="warning"
                                            value={selected}
                                            onValueChange={setSelected}
                                        >
                                            <Checkbox value="user">User</Checkbox>
                                            <Checkbox value="admin">Admin</Checkbox>
                                            <Checkbox value="keuangan">Keuangan</Checkbox>
                                            <Checkbox value="penitipan">Penitipan</Checkbox>
                                            <Checkbox value="keamanan">Keamanan</Checkbox>
                                        </CheckboxGroup>
                                        <p className="text-default-500 text-small">Selected: {selected.join(", ")}</p>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" isLoading={isLoading} onPress={() => changePermission(onClose)}>
                                        <IoIosSend />
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <ModalConfirmDelete isModalOpen={isModalOpen} setModalOpen={setModalOpen} account={userSelected} toastInfo={toastInfo} toastSuccess={toastSuccess} getUser={getUser} />
                <AddUser modalCreate={modalCreate} setModalCreate={setModalCreate} toastSuccess={toastSuccess} getUser={getUser} toastInfo={toastInfo} />

            </div>
        </DashboardTemplate >
    )
}

function ModalConfirmDelete({ isModalOpen, setModalOpen, account, toastInfo, toastSuccess, getUser }) {
    const { http } = AuthUser()
    const [isLoading, setIsLoading] = useState(false)

    const onOpenChange = () => {
        const action = isModalOpen ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setModalOpen(false)
    }
    const onOpen = () => {
        setModalOpen(true)
    }
    const handleDelete = () => {
        setIsLoading(true)
        const id = account.id
        http.post('/api/delete-account', { id })
            .then(() => {
                setIsLoading(false)
                toastSuccess('Berhasil menghapus akun')
                getUser()
                onClose()
            })
            .catch(() => {
                toastInfo('Terjadi kesalahan')
                setIsLoading(false)
                onClose()
            })

    }

    return (
        <Modal isOpen={isModalOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Konfirmasi untuk menghapus</ModalHeader>
                        <ModalBody>
                            apa anda yakin akan menghapus <span className="font-semibold text-blue-900">{account.name}</span>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Batal
                            </Button>
                            <Button color="danger" isLoading={isLoading} onClick={handleDelete}>
                                Hapus
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

const AddUser = ({ modalCreate, setModalCreate, toastSuccess, getUser, toastInfo }) => {

    const { http } = AuthUser()
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const onOpenChange = () => {
        const action = modalCreate ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setModalCreate(false)
    }
    const onOpen = () => {
        setModalCreate(true)
    }

    const handleSubmit = () => {
        setIsLoading(true)
        const data = {
            name: username,
            email: email,
            password: password
        }
        http.post('/api/auth/register', data)
            .then(() => {
                getUser()
                toastSuccess('Pendaftaran Berhasil')
                setIsLoading(false)
                onClose()
            })
            .catch(() => {
                setIsLoading(false)
                onClose()
                toastInfo('Terjadi Kesalahan')
            })
    }
    return (
        <Modal isOpen={modalCreate} onOpenChange={onOpenChange} backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Tambah Pengguna</ModalHeader>
                        <ModalBody>
                            <Input label="Username" type='text' onValueChange={setUsername} />
                            <Input label="Email" type='email' onValueChange={setEmail} />
                            <Input label="Password" onValueChange={setPassword} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" isLoading={isLoading} onClick={handleSubmit}>
                                Sumbit
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}




export default ZonaAdmin