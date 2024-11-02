/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import DashboardTemplate from '../../components/DashboardTemplate'
import { Card, CardBody, Chip, Select, SelectItem } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { IoAddSharp } from "react-icons/io5";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Tooltip, Input, useDisclosure } from "@nextui-org/react"
import { Pagination } from "@nextui-org/pagination";
import { HiOutlineEye } from "react-icons/hi";
import { TbEditCircle } from "react-icons/tb";
import { PiTrashSimpleBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri"

import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import AuthUser from '../../utils/AuthUser';
import getImage from '../../utils/getImage'
import ConstKelas from '../../utils/KelasUtils';

import * as XLSX from 'xlsx';

function DataSantri() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const { http, user, logout } = AuthUser()

    const [dataSiswa, setDataSiswa] = useState()
    const [currentPage, setCurrentPage] = useState()
    const [totalPages, setTotalPages] = useState()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFormal, setSearchFormal] = useState('')
    const [searchDiniyah, setSearcDiniyah] = useState('')
    const [searchTahun, setSearchTahun] = useState('')

    const [idToDelete, setIdToDelete] = useState()

    const getAllSiswa = () => {
        http.get('/api/gettable')
            .then(res => {
                setDataSiswa(res.data.paginate.data)
                setCurrentPage(res.data.paginate.current_page)
                setTotalPages(res.data.total)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        document.title = 'Data Santri'
        getAllSiswa()
    }, [])

    //Link Pagination
    const getSiswa = (e) => {
        http.get(`/api/gettable?page=${e}&search=${searchQuery}&diniyah=${searchDiniyah}&formal=${searchFormal}&tahun=${searchTahun}`)
            .then(res => {
                setDataSiswa(res.data.paginate.data)
                setCurrentPage(res.data.paginate.current_page)
                setTotalPages(res.data.total)
            })
            .catch(err => console.log(err))
    }

    const changePage = (e) => {
        setCurrentPage(e)
        getSiswa(e)
    }
    //Search Siswa 
    const searchSiswa = () => {
        http.get(`/api/gettable?search=${searchQuery}&diniyah=${searchDiniyah}&formal=${searchFormal}&tahun=${searchTahun}`)
            .then(res => {
                setCurrentPage(1)
                setDataSiswa(res.data.paginate.data)
                setTotalPages(res.data.total)
            })
            .catch(res => console.log(res))
    }
    useEffect(() => {
        searchSiswa()
        // console.log(searchQuery, searchDiniyah, searchFormal, searchTahun)
    }, [searchQuery, searchDiniyah, searchFormal, searchTahun])

    const StatusChip = (status) => {
        if (status === 'active') return 'warning'
        if (status === 'pending') return 'default'
        if (status === 'nonactive') return 'danger'
    }
    const { getSystem } = ConstKelas()
    const [formal, setFormal] = useState()
    const [diniyah, setDiniyah] = useState()
    useEffect(() => {
        getSystem('formal', setFormal)
        getSystem('diniyah', setDiniyah)
    }, [])



    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 2014 }, (_, index) => 2015 + index);


    const confirmDelete = (siswa) => {
        setIdToDelete(siswa)
        onOpen()
    }

    const checkUser = () => {
        if (!user.hak) return logout()
        const role = JSON.parse(user.hak)
        if (!role || role === undefined) return logout()
        if (!role.includes('admin')) return 'hidden'
    }

    const exportToExcel = () => {
        http.get(`/api/get-excel?search=${searchQuery}&diniyah=${searchDiniyah}&formal=${searchFormal}&tahun=${searchTahun}`)
            .then(response => {
                const data = response.data
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');

                // Menghasilkan file Excel
                XLSX.writeFile(workbook, 'siswa.xlsx');
            })
    }
    return (
        <DashboardTemplate>
            <div className='w-full'>
                <div className=''>

                    <div className='flex gap-2 items-center'>
                        <Select label="Formal" onChange={(e) => setSearchFormal(e.target.value)} size="sm" className="hidden md:block">
                            <SelectItem key="smp" value="smp">
                                Semua SMP
                            </SelectItem>
                            <SelectItem key="smk" value="smk">
                                Semua SMK
                            </SelectItem>
                            {formal?.map(item => (
                                <SelectItem key={item.key} value={item.key} textValue={item.label}>
                                    {item.label}
                                </SelectItem>
                            ))}


                        </Select>
                        <Select label="Diniyah" onChange={(e) => setSearcDiniyah(e.target.value)} size="sm" className="hidden md:block">
                            {diniyah?.map(item => (
                                <SelectItem key={item.key} value={item.key} textValue={item.label}>
                                    {item.label}
                                </SelectItem>
                            ))}


                        </Select>
                        <Select label="Tahun" onChange={(e) => setSearchTahun(e.target.value)} size="sm" className="hidden md:block" >
                            {yearsArray.reverse().map(item => (
                                <SelectItem key={item} value={item} textValue={item}>
                                    {item}
                                </SelectItem>
                            ))}


                        </Select>
                        <Input
                            label=""
                            isClearable
                            radius="lg"
                            classNames={{
                                label: "text-black/50 dark:text-white/90",
                                input: [
                                    "bg-transparent",
                                    "text-black/90 dark:text-white/90",
                                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                ],
                                innerWrapper: "bg-transparent",
                                inputWrapper: [
                                    "bg-default-200/50",
                                    "dark:bg-default/60",
                                    "backdrop-blur-xl",
                                    "backdrop-saturate-200",
                                    "hover:bg-default-200/70",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focused=true]:bg-default-200/50",
                                    "dark:group-data-[focused=true]:bg-default/60",
                                    "!cursor-text",
                                    "min-w-md"
                                ],
                            }}
                            placeholder="Cari siswa"
                            startContent={
                                <FaSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                            }
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Tooltip content="Tambah Siswa" >
                            <Button className={checkUser()} isIconOnly color='primary' variant='shadow' onClick={() => navigate('/dashboard/data-santri/create-siswa')}><IoAddSharp /></Button>
                        </Tooltip>
                    </div>
                </div>
                <div className='my-2'>
                    <Card className='shadow-md shadow-violet-700/30'>
                        <CardBody className=''>
                            <div className='flex gap-2'>
                                <Button color='primary' variant='shadow' size='sm' className='flex items-center' onClick={exportToExcel}>
                                    <RiFileExcel2Line /> <span>Export to excel</span>
                                </Button>

                            </div>
                        </CardBody>
                    </Card>
                </div>
                <Table aria-label="Example static collection table" isStriped className='mt-2'>
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn className=''>NIS</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {
                            dataSiswa?.map(siswa => (
                                <TableRow key={siswa.id}>
                                    <TableCell className='flex gap-2 items-center'>
                                        <Avatar src={getImage(siswa)} color='primary' isBordered radius='sm' />
                                        <div className='flex flex-col'>
                                            <h3 className='font-semibold text-gray-700 w-full max-w-40 md:max-w-none truncate'>{siswa.nama_siswa}</h3>
                                            <span className='text-xs text-gray-400'>Murid</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-gray-700'>{siswa.nis}</TableCell>
                                    <TableCell>
                                        <Chip color={StatusChip(siswa.status)} size='sm' className='text-white'>{siswa.status}</Chip>
                                    </TableCell>
                                    <TableCell >
                                        <div className='flex items-center gap-2'>
                                            <Tooltip content="Details">
                                                <Button isIconOnly color='warning' variant='shadow' size='sm' onClick={() => navigate(`/dashboard/data-santri/detail/${siswa.nis}`)} className='text-xl text-white'><HiOutlineEye /></Button>
                                            </Tooltip>
                                            <Tooltip content="Edit" className={checkUser()}>
                                                <Button isIconOnly color='primary' variant='shadow' size='sm' className={`text-xl ` + (checkUser())} onClick={() => navigate(`/dashboard/data-santri/edit/${siswa.nis}`)}><TbEditCircle /></Button>
                                            </Tooltip>
                                            <Tooltip content="Hapus" className={checkUser()}>
                                                <Button className={`text-xl ` + (checkUser())} onClick={() => confirmDelete(siswa)} size='sm' variant='shadow' isIconOnly color='danger'><PiTrashSimpleBold /></Button>
                                            </Tooltip>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }


                    </TableBody>
                </Table>
                {!dataSiswa && (
                    <div className='w-full flex items-center justify-center p-5'>
                        <span className="loader"></span>
                    </div>
                )}
                <Pagination showControls total={totalPages} onChange={(e) => changePage(e)} initialPage={1} page={currentPage} className={`my-3 ${totalPages === 1 && 'hidden'}`} />
            </div>
            <ConfirmDeleteModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} getAllSiswa={getAllSiswa} siswa={idToDelete} />
        </DashboardTemplate>
    )
}

export default DataSantri