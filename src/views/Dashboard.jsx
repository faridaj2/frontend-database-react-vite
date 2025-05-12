/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import DashboardTemplate from '../components/DashboardTemplate'
import { Card, CardBody, CardHeader, Divider, Select, SelectItem } from '@nextui-org/react'
import AuthUser from '../utils/AuthUser'
import ChartComponent from '../components/Dashboard/ChartComponent'

function Dashboard() {
    const { http } = AuthUser()
    const [data, setData] = useState()
    const [year, setYear] = useState();
    const [arrayYear, setArrayYear] = useState()

    useEffect(() => {
        document.title = 'Dashboard'
        getDashboardData()
        generateYear()
    }, [])
    const getDashboardData = () => {
        http.get('/api/get-dashboard-data')
            .then(res => setData(res.data))
            .catch(res => console.log(res))
    }
    const generateYear = () => {
        const currentYear = new Date().getFullYear();

        // Membuat array dari tahun sekarang ke tahun 2017
        const yearsArray = [];
        for (let year = currentYear; year >= 2017; year--) {
            yearsArray.push(year);
        }
        setArrayYear(yearsArray)
        setYear({ startYear: yearsArray[5].toString(), endYear: yearsArray[0].toString() });


    }
    const changeStart = e => {
        const val = e.target.value
        setYear(prevYear => ({
            ...prevYear,
            startYear: val
        }))
    }
    const changeEnd = e => {
        const val = e.target.value
        setYear(prevYear => ({
            ...prevYear,
            endYear: val
        }))
    }

    return (
        <DashboardTemplate>
            <div className=''>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>

                    <div className='w-full'>
                        <Card className='w-full shadow-xl shadow-violet-700/20'>
                            <CardHeader>
                                <span className='text-tiny font-semibold'>
                                    Jumlah Seluruh Santri
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
                <div className='bg-blue-100 rounded-2xl z-50'>
                    <div className='flex mt-4 justify-end p-2'>
                        <div className='w-full max-w-sm flex gap-2'>
                            <Select size='sm' color='warning' variant='flat' label="Tahun Awal" onChange={changeStart} selectedKeys={[year?.startYear]}>
                                {arrayYear?.map(item => (
                                    <SelectItem key={`${item}`} value={item} textValue={item}>{item}</SelectItem>
                                ))}
                            </Select>
                            <Select size='sm' color='warning' variant='flat' label="Tahun Akhir" onChange={changeEnd} selectedKeys={[year?.endYear]}>
                                {arrayYear?.map(item => (
                                    <SelectItem key={`${item}`} value={item} textValue={item}>{item}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <ChartComponent startYear={year?.startYear} endYear={year?.endYear} />
                </div>

            </div>
        </DashboardTemplate>
    )
}

export default Dashboard