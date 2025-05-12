/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import AuthUser from '../utils/AuthUser'
import { useNavigate } from "react-router-dom"
import Sidebar from './Sidebar';

// Icon
import { RiMenu3Fill } from "react-icons/ri"
import { Button } from '@nextui-org/react';
import AllUtils from '../utils/AllUtils';
import { ToastContainer } from 'react-toastify';



const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { toastInfo } = AllUtils()

    const handleOnline = () => {
        setIsOnline(true);
        toastInfo('Internet anda telah kembali')
    };

    const handleOffline = () => {
        setIsOnline(false);
        toastInfo('Internet anda terputus, periksa kembali')
    };

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

function DashboardTemplate({ children }) {
    const navigate = useNavigate();
    const { user } = AuthUser()

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [path, setPath] = useState('dashboard')
    const [nav, setNav] = useState(false)

    const isOnline = useOnlineStatus();


    return (
        <div className='bg-gradient-to-r from-violet-200 to-pink-200'>
            <ToastContainer />
            {/* <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div> */}
            {/* <Navbar maxWidth='full' isBordered className='sticky mb-0'>
                <NavbarBrand>
                    test
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" variant="flat" onClick={logout}>
                            Log Out
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar> */}
            <div>

            </div>
            <div className='flex gap-2 items-stretch h-screen'>
                {user && <Sidebar isOnline={isOnline} path={path} setPath={setPath} nav={nav} setNav={setNav} />}

                <div className='hideScrollBar overflow-auto w-full p-2'>
                    <div className='w-full flex md:hidden justify-end py-2 mb-3 '>
                        <Button isIconOnly color='primary' onClick={() => setNav(!nav)} variant='shadow'>
                            <RiMenu3Fill />
                        </Button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardTemplate