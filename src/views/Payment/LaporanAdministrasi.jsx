import { useParams } from "react-router-dom"
import AuthUser from "../../utils/AuthUser"
import { useEffect, useState } from "react"
import AllUtils from "../../utils/AllUtils"

export default function LaporanAdministrasi() {
    const {addComa} = AllUtils()
    const { http } = AuthUser()
    const { data } = useParams()
    const [sekolah, kelamin, lunas, tahun] = atob(data).split('/')

    const [load, setLoad] = useState(true)

    const [students, setStudents] = useState()
    const [columns, setColumns] = useState()
    const [payments, setPayments] = useState()

    const getStudents = (search = '') => {
        http.get(`/api/pspdb/search/listed?search=${search}&formal=${sekolah}&kelamin=${kelamin}&status=${lunas}&tahun=${tahun}`)
            .then(r => setStudents(r.data))
    }
    const getKolom = () => {
        http.get(`/api/pspdb/read/kolom?sekolah=${sekolah}&kelamin=${kelamin}`)
            .then(r => {
                setColumns(r.data)
            })
    }
    const getPayment = () => {
        http.get(`/api/pspdb/payment/read?formal=${sekolah}&kelamin=${kelamin}&status=${lunas}&tahun=${tahun}`)
            .then(r => {
                if (r.data.length > 0) {
                    setPayments(r.data)
                } else {
                    setPayments([])
                }
            })
    }
    useEffect(() => {
        getStudents()
        getKolom()
        getPayment()
        document.title = 'Laporan Administrasi'
    }, [])

    useEffect(() => {
        if(students, payments, columns) setLoad(false)
    }, [students, payments, columns])

    const findPayment = (id, sid) => {
        let data = payments?.find(item => item.pspdb_kolom_list_id == id && item.siswa_id == sid)
        let column = columns?.find(item => item.id == id)
        let siswa = students?.find(item => item.id == sid)
        if((column.formal == siswa.formal.slice(1,4) || column.formal == '') && (column.kelamin == siswa.kelamin.toLowerCase() || column.kelamin == '')){
            return data && addComa(data.jumlah)
        }
    }

    const cellClass = "border p-2"

    return (
        <>
            {load && (
                <div hidden className={`absolute w-full h-full top-0 left-0 flex items-center justify-center bg-white`}>
                    <span className="loader"></span>
                </div>
            )}
            <div className="p-10 bg-black/50 h-[100vh]">
                <div className="p-10 bg-white rounded-xl">
                    <table className="w-full border font-lexend bg-white">
                        <thead className="border">
                            <td className="border pl-2">#</td>
                            <td className="border col-span-2 pl-2">Nama Siswa</td>
                            {columns?.map(item => <td className="border capitalize pl-2" key={'th' + item.id}>{item.nama_kolom}</td>)}
                        </thead>
                        <tbody>

                            {students?.map((item, index) => (
                                <tr key={'tb' + item.id}>
                                    <td className={cellClass}>{index + 1}</td>
                                    <td className={cellClass}>{item.nama_siswa}</td>
                                    {columns?.map(c => <td key={'c'+c.id} className={cellClass}>{findPayment(c.id, item.id)}</td>)}
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}