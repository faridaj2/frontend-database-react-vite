/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import DashboardTemplate from "../../components/DashboardTemplate"
import AuthUser from "../../utils/AuthUser"
import { useParams } from "react-router-dom"
import { Button, Chip, Select, SelectItem } from "@nextui-org/react"

// icon
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs"

function DetailPenitipanUang() {
    const { id } = useParams()
    const { http } = AuthUser()
    useEffect(() => {
        getSiswa()
    }, [])
    const [siswa, setSiswa] = useState()
    const getSiswa = () => {
        http.get(`/api/getSiswaById?id=${id}`)
            .then(res => setSiswa(res.data))
            .catch(error => console.log(error))
    }
    return (
        <DashboardTemplate>
            <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="grow w-full">
                    <div className="w-full text-center p-2 rounded-xl bg-white m-2">
                        <div className="py-20 font-bold text-3xl font-mono">
                            <Chip color="default" size="sm" variant="dot" className="mb-5">{siswa?.nama_siswa}</Chip>
                            <div> Rp. 5.000.000</div>
                        </div>
                        <div className="flex gap-2">
                            <Button color="primary" size="lg" variant="shadow" className="w-full"><BsCaretUpFill />Deposit</Button>
                            <Button color="danger" size="lg" variant="shadow" className="w-full"><BsCaretDownFill />Tarik</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-sm md:m-2 mx-auto">
                    <div className="rounded-xl p-2 bg-white text-violet-700 font-semibold flex justify-between items-center">
                        <div>Riwayat</div>
                        <div className="w-1/2">
                            <Select label="Pilih Bulan" size="sm">
                                <SelectItem>oke</SelectItem>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3 p-2 bg-danger text-white border-1 rounded-xl shadow-md shadow-danger-700/30">
                            <BsCaretDownFill />
                            <div>
                                Rp. 500.0000
                            </div>
                            <div className="bg-white text-black rounded-md px-2 text-tiny ml-auto">27/11/2010</div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-primary text-white border-1 rounded-xl shadow-md shadow-danger-700/30">
                            <BsCaretUpFill />
                            <div>
                                Rp. 500.0000
                            </div>
                            <div className="bg-white text-black rounded-md px-2 text-tiny ml-auto">27/11/2010</div>
                        </div>
                    </div>
                </div>
            </div >
        </DashboardTemplate >
    )
}

const modalDeposit = () => {

}
const modalTarik = () => {

}



export default DetailPenitipanUang