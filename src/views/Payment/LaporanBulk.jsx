import { useParams } from "react-router-dom"
import AuthUser from "../../utils/AuthUser"
import { useEffect, useState } from "react"

export default function LaporanBulk() {
    const { data } = useParams()
    const { http } = AuthUser()
    const [start, end] = atob(data).split('/')
    const [loading, setIsLoading] = useState(true)

    const [laporan, setLaporan] = useState()

    useEffect(() => {
        document.title = 'Laporan'
        http.post('/api/get/laporan/bulk', {
            start, end
        })
            .then(res => {
                setLaporan(res.data)
                setIsLoading(false)
                res.data.map(item => console.log(item.id,item.nama_pembayaran))
                console.log(res.data)
            })
    }, [])
    return (
        <>
            {loading && (
                <div className="absolute w-full h-full flex items-center justify-center bg-white">
                    <span className="loader"></span>
                </div>
            )}
            <div className="capitalize text-center p-4 text-gray-700 font-bold">Pembayaran Masuk Periode {start} hingga {end}</div>
            <table className="w-full rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold">Jenis Pembayaran</th>
                        <th className="py-3 px-4 text-left font-semibold">Jumlah</th>
                        <th className="py-3 px-4 text-left font-semibold">Nama Siswa</th>
                        <th className="py-3 px-4 text-left font-semibold">NIS</th>
                        <th className="py-3 px-4 text-left font-semibold">Pembayaran</th>
                        <th className="py-3 px-4 text-left font-semibold">Tanggal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {laporan?.map((item, index) => {
                        if(item.nama_pembayaran){
                            return (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-3 px-4 capitalize text-gray-800">{item.nama_pembayaran ? item.nama_pembayaran.payment_name : console.log(item.id)}</td>
                                <td className="py-3 px-4 text-gray-600">Rp {item.jumlah_pembayaran.toLocaleString('id-ID')}</td>
                                <td className="py-3 px-4 text-gray-600 capitalize">{item.siswa.nama_siswa}</td>
                                <td className="py-3 px-4 text-gray-600 capitalize">{item.siswa.nis}</td>
                                <td className="py-3 px-4 text-gray-600">{item.nama_pembayaran && item.nama_pembayaran.bulanan ? item.month : 'Kontan'}</td>
                                <td className="py-3 px-4 text-gray-600 capitalize">{item.dop}</td>
                            </tr>   
                            )
                        }
                })}
                </tbody>
            </table>

        </>
    )
}