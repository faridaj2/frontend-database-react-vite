/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Divider, Pagination, Chip, Spinner, Checkbox, Tooltip } from "@nextui-org/react";

// Icon
import { CgArrowsExchange } from "react-icons/cg"
import { FaPlus } from "react-icons/fa"
import { PiMoneyWavyFill } from "react-icons/pi"
import { FaCheck } from "react-icons/fa"
import { CiBoxList } from "react-icons/ci"

// utilitas
import ConstKelas from '../utils/KelasUtils';
import AuthUser from '../utils/AuthUser';

function ModalGroupPayment({ isOpen, setIsOpen, id, refresh }) {
    const { http } = AuthUser()
    const { getSystem } = ConstKelas()
    const [formal, setFormal] = useState()
    const [diniyah, setDiniyah] = useState()

    useEffect(() => {
        getSystem('formal', setFormal)
        getSystem('diniyah', setDiniyah)
    }, [])

    const onOpenChange = () => {
        const action = isOpen ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setIsOpen(false)
    }
    const onOpen = () => {
        setIsOpen(true)
    }

    const [isActive, setIsActive] = useState()
    const [selected, setSelected] = useState([])
    const [search, setSearch] = useState('')
    const [data, setData] = useState()
    const [page, setPage] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [select, setSelect] = useState()

    const addToSelected = item => {
        setSelected([...selected, item])
    }
    const deleteFromSelected = (id) => {
        const newData = selected.filter(item => item.id !== id)
        setSelected(newData)
    }

    const debounce = (callback, delay) => {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(callback, delay);
        };
    };


    useEffect(() => {
        const delayedSearch = debounce(getSiswa, 1500);
        if (search && search.length < 3) return
        setCurrentPage(1)
        delayedSearch();
    }, [search, isActive])
    useEffect(() => {
        getSiswa()
    }, [currentPage])
    const getSiswa = () => {
        setIsLoading(true)
        http.get(`/api/${id}/get-list-siswa?q=${search}&page=${currentPage}&active=${isActive}`)
            .then(res => {
                const data = res.data
                setPage(Math.ceil(data.total / data.per_page))
                setData(data)
                // console.log(res)
                setIsLoading(false)
            })
            .catch(res => {
                console.log(res)
                setIsLoading(false)
            })
    }
    const changePage = (e) => {
        setCurrentPage(e)
    }
    const addData = data => {
        const array = [...selected]
        data.forEach(dataBaru => {
            const isDuplikat = selected.some(item => item.id === dataBaru.id)
            if (!isDuplikat) array.push(dataBaru)
        })
        setSelected(array)
    }
    const setBySelecet = () => {
        if (select === undefined) return
        const data = Array.from(select)[0]
        if (data === undefined) return
        setIsLoading(true)
        http.get(`/api/get-siswa/kelas/${data}?active=${isActive}`)
            .then(res => {
                const data = res.data
                addData(data)
                setIsLoading(false)
            })
            .catch(res => setIsLoading(false))

    }
    const submitData = () => {
        const idSiswa = selected.map(item => item.id)
        http.post(`/api/add-santri-to-group/${id}`, idSiswa)
            .then(res => {
                refresh()
                onClose()
            })
            .catch(res => console.log(res))
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='full' backdrop='blur'>
            <ModalContent className='overflow-scroll'>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Pilih daftar</ModalHeader>
                        <ModalBody>
                            <div className='flex gap-2 flex-col md:flex-row justify-between items-stretch w-full'>
                                <div className='rounded-xl shadow-lg w-full outline outline-1 outline-blue-200 p-2 relative'>
                                    {isLoading && (
                                        <div className='w-full h-full bg-white/50 absolute z-50 flex items-center justify-center'>
                                            <Spinner />
                                        </div>
                                    )}

                                    <div className='flex gap-2 justify-between items-center w-full'>
                                        <Input placeholder='Cari siswa...' variant='flat' size='lg' value={search} onValueChange={setSearch} />
                                        <Tooltip content="Hanya ambil siswa dengan status aktif">
                                            <Checkbox isSelected={isActive} onValueChange={setIsActive} />
                                        </Tooltip>
                                        <div className='flex gap-2 w-full items-center justify-end'>
                                            <div className='max-w-sm w-full'>
                                                <Select label="Berdasarkan kelas" className='' size='sm' selectedKeys={select} onSelectionChange={setSelect}>
                                                    {formal?.map(item => (
                                                        <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>
                                                    ))}
                                                    {diniyah?.map(item => (
                                                        <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Button variant='flat' color='primary' size='lg' onClick={setBySelecet} isIconOnly><FaPlus /></Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className='my-2' />
                                    <div className='max-h-96 overflow-auto m-2 flex flex-col gap-2'>
                                        {data?.data.map(item => (
                                            <div key={item.id} className='p-2 rounded-md bg-blue-50 text-blue-900 flex justify-between items-center'>
                                                <div className='w-full flex justify-between mr-10'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='bg-white shadow p-2 rounded-full'>
                                                            <PiMoneyWavyFill />
                                                        </div>
                                                        {item.nama_siswa}
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <Chip color='warning' variant='bordered' size='sm'>{item.formal}</Chip>
                                                        <Chip color='warning' variant='bordered' size='sm'>{item.diniyah}</Chip>
                                                    </div>
                                                </div>
                                                {selected.find(select => select.id === item.id) ? <Button size='sm' color='danger' className='text-tiny' isIconOnly onClick={() => deleteFromSelected(item.id)}><FaCheck /></Button> : <Button size='sm' color='primary' className='text-xl' isIconOnly onClick={() => addToSelected(item)}><CgArrowsExchange /></Button>}
                                            </div>
                                        ))}

                                    </div>
                                    <div className='flex items-center p-2 w-full justify-center'>
                                        <Pagination total={page} page={currentPage} onChange={e => changePage(e)} showControls />
                                    </div>
                                </div>
                                <div className='rounded-xl shadow-lg w-full outline outline-1 outline-blue-200 p-2 relative'>
                                    <div className='text-base font-semibold bg-blue-500 text-blue-700 rounded-full p-2 flex gap-2 items-center'>
                                        <div className='bg-white p-3 rounded-full'>
                                            <CiBoxList />
                                        </div>
                                        <div className='text-white'>
                                            Total : {selected.length}
                                        </div>
                                    </div>
                                    <Divider className='my-2' />
                                    <div className='flex flex-col gap-2 p-2 overflow-auto h-96'>
                                        {selected?.map(item => (
                                            <div key={item.id} className='p-2 rounded-md bg-blue-50 text-blue-900 flex justify-between items-center'>
                                                <div className='w-full flex justify-between mr-10'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='bg-white shadow p-2 rounded-full'>
                                                            <PiMoneyWavyFill />
                                                        </div>
                                                        {item.nama_siswa}
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <Chip color='warning' variant='bordered' size='sm'>{item.formal}</Chip>
                                                        <Chip color='warning' variant='bordered' size='sm'>{item.diniyah}</Chip>
                                                    </div>
                                                </div>
                                                <Button size='sm' color='danger' className='text-tiny' isIconOnly onClick={() => deleteFromSelected(item.id)}><FaCheck /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Tutup
                            </Button>
                            <Button color="primary" onClick={submitData}>
                                Tambahkan
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalGroupPayment