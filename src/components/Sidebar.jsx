import { Avatar, Divider } from '@nextui-org/react'
import { motion } from 'framer-motion';

// Icon
import { RxDashboard } from "react-icons/rx";
import { IoIosArrowForward, IoMdPeople } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa6"
import { TbLogout } from "react-icons/tb"
import { HiOutlineBanknotes } from "react-icons/hi2"
import { GoLaw } from "react-icons/go"

import { RiMenu3Fill } from "react-icons/ri"
import { CiWifiOn, CiWifiOff } from "react-icons/ci";
import { Button } from '@nextui-org/react';

import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import AuthUser from '../utils/AuthUser';
function Sidebar({ nav, setNav, isOnline }) {
    let location = useLocation()

    const { user, logout } = AuthUser()
    const navigate = useNavigate();

    if (!user) logout()
    const handleClick = (path) => {
        navigate(path);
    }

    const getClass = (menu) => {
        let path = location.pathname.split('/')[2]
        if (path === menu) return 'bg-violet-500 text-white shadow-lg shadow-violet-700/40'
    }

    const getRole = (role) => {
        const roles = JSON.parse(user.hak)
        if (!roles.includes(role) && !roles.includes('admin')) return 'hidden'
    }



    return (
        <motion.div
            className={`min-w-48 md:block bg-white pl-3 py-3 text-blue-700 fixed md:static h-full z-[40] pr-3 border border-r w-full md:w-auto`}
            initial={{ left: '-100%' }}
            animate={{ left: nav ? '0%' : '-100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className=''>
                <div className='flex items-center gap-2 justify-between '>
                    <div className='flex justify-start items-center gap-2'>
                        <div className='text-2xl rounded outline outline-1 outline-white shadow p-2 '><Avatar src='/logo.png' isBordered color='primary' /></div>
                        <div>
                            <h1 className='font-semibold uppercase'>SantriHub</h1>
                            <p className='text-xs  font-semibold'>{user.name}</p>
                            <div>
                                {isOnline ? (
                                    <CiWifiOn />
                                ) : (
                                    <CiWifiOff />
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button className='md:hidden' isIconOnly color='primary' onClick={() => setNav(!nav)} variant='shadow'>
                            <RiMenu3Fill />
                        </Button>
                    </div>
                </div>
                <Divider className='my-5' />
                <h1 className='font-bold text-xs uppercase mb-3'>Dashboard</h1>
                <div className='flex flex-col gap-3 '>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass(undefined)}`} onClick={() => handleClick('/dashboard')}><IoIosArrowForward className='text-sm' /> <RxDashboard /> <span className='font-semibold  text-sm'>Dashboard</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass('data-santri')}`} onClick={() => handleClick('/dashboard/data-santri')}><IoIosArrowForward className='text-sm' /> <IoMdPeople /> <span className='font-semibold text-sm'>Data Santri</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass('payment')} ` + (getRole('keuangan'))} onClick={() => handleClick('/dashboard/payment')}><IoIosArrowForward className='text-sm' /> <FaMoneyBillWave /> <span className='font-semibold text-sm'>Keuangan</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass('penitipan')} ` + (getRole('penitipan'))} onClick={() => handleClick('/dashboard/penitipan')}><IoIosArrowForward className='text-sm' /> <HiOutlineBanknotes /> <span className='font-semibold text-sm'>Uang Saku</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass('keamanan')} ` + (getRole('keamanan'))} onClick={() => handleClick('/dashboard/keamanan')}><IoIosArrowForward className='text-sm' /> <GoLaw /> <span className='font-semibold text-sm'>Keamanan</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ${getClass('zona-admin')} ` + (getRole('admin'))} onClick={() => handleClick('/dashboard/zona-admin')}><IoIosArrowForward className='text-sm' /> <MdAdminPanelSettings /> <span className='font-semibold text-sm'>Zona Admin</span></button>
                    <button className={`flex gap-2 items-center  hover:bg-violet-500 rounded-md hover:text-white transition-all ease-in-out p-2 ')}`} onClick={logout}><IoIosArrowForward className='text-sm' /> <TbLogout /> <span className='font-semibold text-sm'>Log Out</span></button>
                </div>
            </div>
        </motion.div>
    )
}

export default Sidebar