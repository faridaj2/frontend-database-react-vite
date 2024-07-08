/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardTemplate from '../components/DashboardTemplate'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import AuthUser from '../utils/AuthUser'

function Dashboard() {
    const { http } = AuthUser()
    const [data, setData] = useState()
    useEffect(() => {
        document.title = 'Dashboard'
        getDashboardData()
    }, [])
    const getDashboardData = () => {
        http.get('/api/get-dashboard-data')
            .then(res => setData(res.data))
            .catch(res => console.log(res))
    }

    return (
        <DashboardTemplate>
            <div className=''>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>

                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Seluruh Santriss
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.semuaSantri : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Santri Putra
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.santriPutra : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Santri Putri
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.santriPutri : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Santri SMK
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.santriSmk : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Santri SMP
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.santriSmp : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Santri Madin
                                </span>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div>
                                    <h1 className='text-4xl font-bold'>{data ? data.santriMadin : 0}</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

            </div>
        </DashboardTemplate>
    )
}

export default Dashboard