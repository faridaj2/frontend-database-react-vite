/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"
import ModalGroupPayment from '../../components/ModalGroupPayment'

// Next ui
import { Card, CardHeader, CardBody, Divider, Button, Input, Pagination, Checkbox } from '@nextui-org/react'

// Icon
import { FaChartLine } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import { FaUserLarge } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"
import { MdDelete } from "react-icons/md"

// Utilitas
import AuthUser from '../../utils/AuthUser'
import AllUtils from '../../utils/AllUtils'

const UpdateModal = ({ modal, setModal, name, desc, toastInfo, toastSuccess, id, refresh }) => {
    const { http } = AuthUser()
    const onOpenChange = () => {
        const action = modal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setModal(false)
    }
    const onOpen = () => {
        setModal(true)
    }

    const [groupName, setGroupName] = useState(name)
    const [desk, setDesk] = useState(desc)
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        if (groupName === '' || desk === '') return toastInfo("Nama & Deskripsi tidak boleh kosong")
        setIsLoading(true)
        const data = {
            group_name: groupName,
            desc: desk
        }
        http.patch(`/api/edit-payment-group/${id}`, data)
            .then(res => {
                setIsLoading(false)
                refresh()
                onClose()
            })
            .catch(res => console.log(res))
    }

    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit Detail Pembayaran</ModalHeader>
                        <ModalBody className='flex flex-col gap-3'>
                            <Input label="Nama Group Pembayaran" labelPlacement='outside' value={groupName} onValueChange={setGroupName} placeholder='Group Pembayaran' />
                            <Input label="Deskripsi" labelPlacement='outside' value={desk} onValueChange={setDesk} placeholder='Deskripsi' />
                        </ModalBody>
                        <ModalFooter>

                            <Button color="primary" onPress={submitHandler} isLoading={isLoading}>
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
const DeleteModal = ({ modal, setModal, id, notif }) => {
    const navigate = useNavigate()
    const { http } = AuthUser()
    const onOpenChange = () => {
        const action = modal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setModal(false)
    }
    const onOpen = () => {
        setModal(true)
    }
    const deleteHandler = () => {
        http.get(`/api/delete-group-payment/${id}`)
            .then(res => {
                if (res.data === 'ok') {
                    navigate('/dashboard/payment')
                } else {
                    onClose()
                    notif('Galat error')
                }
            })
    }
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Lanjutkan Mengahapus</ModalHeader>
                        <ModalFooter>
                            <Button onClick={onClose}>
                                Batal
                            </Button>
                            <Button color="primary" onClick={deleteHandler}>
                                Hapus
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

function GroupPaymentDetail() {
    const { http } = AuthUser()
    const { id } = useParams()
    const { ToastContainer, toastInfo, toastSuccess } = AllUtils()

    const [groupName, setGroupName] = useState()
    const [desc, setDesc] = useState()

    const [modalUpdate, setModalUpdate] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [isOpen, setIsOpen] = useState()

    const [siswa, setSiswa] = useState([])
    const [page, setPage] = useState()
    const [currentPage, setCurrentPage] = useState(1)

    const [search, setSearch] = useState("")

    const [selected, setSelected] = useState([])
    useEffect(() => {
        document.title = "Detail Group Pembayaran"
        getData()
        getGroupId()
    }, [])

    const getData = () => {
        http.get(`/api/get-payment-group-detail/${id}`)
            .then(({ data }) => {
                setGroupName(data.group_name)
                setDesc(data.desc)
                setIsOpen(false)
            })
            .catch(res => console.log(res))
    }
    const changePage = e => {
        setCurrentPage(e)
    }
    useEffect(() => {
        getGroupId()
    }, [currentPage, search])
    const getGroupId = () => {
        http.get(`/api/get-siswa-group-payment/${id}?page=${currentPage}&q=${search}`)
            .then(res => {
                const data = res.data
                setSiswa(data.data)
                setPage(Math.ceil(data.total / data.per_page))
            })
            .catch(res => console.log(res))
    }
    const getStatus = id => {
        if (selected.includes(id)) {
            return true
        } else {
            return false
        }
    }
    const submitStatus = (status, id) => {
        let array = [...selected]
        let index = array.indexOf(id);
        if (!status) {
            array.splice(index, 1);
        } else {
            array.push(id)
        }
        setSelected(array)
    }
    const deleteMethod = () => {
        http.post(`/api/delete-from-group-payment/${id}`, selected)
            .then(res => {
                setCurrentPage(1)
                getGroupId()
                setSelected([])
            })
            .catch(res => console.log(res))
    }





    return (
        <DashboardTemplate>
            <ToastContainer />
            <div>
                <Card className='text-violet-700 shadow-md shadow-blue-700/30 bg-transparent'>
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
                    <CardHeader className='font-bold text-2xl flex justify-between' >
                        Detail
                        <div className='flex gap-1'>
                            <Button color="primary" Button size='sm' variant='shadow' isIconOnly onClick={() => setModalUpdate(true)}> <FaEdit /></Button>
                            <Button color="primary" Button size='sm' variant='shadow' isIconOnly onClick={() => setIsOpen(true)}> <FaPlus /></Button>
                            <Button color="danger" Button size='sm' variant='shadow' isIconOnly onClick={() => setDeleteModal(true)}> <MdDelete /></Button>
                        </div>
                    </CardHeader >
                    <CardBody>
                        <div className='flex flex-col gap-3'>
                            <div className='flex gap-2 items-center'>
                                <div className='bg-white p-2 rounded-md text-blue-700 shadow-md shadow-violet-700/40'>
                                    <FaChartLine className='text-xl' />
                                </div>
                                <div>
                                    <h4 className='text-tiny text-black/70 font-semibold'>Nama Group Pembayaran</h4>
                                    <h2 className='text-sm font-semibold uppercase'>{groupName}</h2>
                                </div>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <div className='bg-white p-2 rounded-md text-blue-700 shadow-md shadow-violet-700/40'>
                                    <FaChartLine className='text-xl' />
                                </div>
                                <div>
                                    <h4 className='text-tiny text-black/70 font-semibold'>Deskripsi</h4>
                                    <h2 className='text-sm font-semibold uppercase'>{desc}</h2>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card >
                <Divider className='my-3' />
                <div>
                    <div className='flex gap-2'>
                        <Input placeholder='Cari siswa...' value={search} onValueChange={setSearch} endContent={<FaSearch className='text-gray-500' />} />
                        {selected.length > 0 && <Button color='danger' variant='ghost' isIconOnly onClick={deleteMethod}><MdDeleteSweep /></Button>}
                    </div>

                    <Divider className='my-2' />
                    <div className='flex flex-col gap-2'>
                        {siswa?.map((item) => (
                            <Link key={item.id} className='bg-slate-100 rounded-md hover:bg-blue-200 p-2 flex justify-between transition-all ease-in-out hover:shadow-md hover:shadow-violet-700/30 hover:-translate-x-2'>
                                <div className='flex gap-2 items-center'>
                                    <div>
                                        <Checkbox isSelected={getStatus(item.id)} onValueChange={e => submitStatus(e, item.id)} />
                                    </div>
                                    <div className='p-4 bg-white rounded-md'>
                                        <FaUserLarge className='text-blue-700' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='font-medium uppercase text-gray-700'>{item.nama_siswa}</div>
                                        <div className='text-tiny text-gray-600'>{item.nis}</div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-tiny bg-blue-500 text-white font-bold rounded-lg p-2'>
                                        {item.formal}
                                    </div>
                                    <div className='text-tiny bg-blue-500 text-white font-bold rounded-lg p-2'>
                                        {item.diniyah}
                                    </div>

                                </div>

                            </Link>
                        ))}
                    </div>
                    <Pagination className='my-2' total={page} page={currentPage} initialPage={1} onChange={e => changePage(e)} showControls />
                </div>
            </div >
            {(groupName && desc) && <UpdateModal modal={modalUpdate} setModal={setModalUpdate} name={groupName} desc={desc} toastInfo={toastInfo} toastSuccess={toastSuccess} id={id} refresh={getData} />}
            {isOpen && <ModalGroupPayment isOpen={isOpen} setIsOpen={setIsOpen} id={id} refresh={getGroupId} />}
            <DeleteModal modal={deleteModal} setModal={setDeleteModal} id={id} notif={toastInfo} />


        </DashboardTemplate >
    )
}

export default GroupPaymentDetail