import { Modal, ModalBody, ModalHeader, ModalContent, ModalFooter, Button, Accordion, AccordionItem } from "@nextui-org/react"
import AllUtils from "../../utils/AllUtils"
import AuthUser from "../../utils/AuthUser"
import { useState, useEffect } from "react"

export default function DetailUser({modal, setModal, data, reset}){
    const {http} = AuthUser()
    const [sts, setStatus] = useState(data?.siswa?.pspdb_siswa_list?.status)

    const onOpenChange = () => setModal(!setModal)
    const { addComa } = AllUtils()
    const getPayment = (id) => {
        let find = data?.payment?.find(payment => payment.pspdb_kolom_list_id == id) ?? '----'
        return find.jumlah ? 'Rp. '+addComa(find.jumlah) : ''
    }
    const handleDelete = () => {
        http.post(`/api/pspdb/listed/remove/${data.siswa.id}`)
        .then(res => {
            reset()
            setModal(false)
        })
    }
    const changeStatus = () => {
        http.post(`/api/pspdb/listed/change/status/${data.siswa.id}`)
        .then(res => {
            reset()
            setStatus(res.data)
        })
    }
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="bg-[#0099ff] font-lexend text-center text-white flex justify-center">{data.siswa.nama_siswa}</ModalHeader>
                            <ModalBody className="p-0">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,224L20,186.7C40,149,80,75,120,42.7C160,11,200,21,240,37.3C280,53,320,75,360,80C400,85,440,75,480,80C520,85,560,107,600,128C640,149,680,171,720,154.7C760,139,800,85,840,96C880,107,920,181,960,197.3C1000,213,1040,171,1080,165.3C1120,160,1160,192,1200,208C1240,224,1280,224,1320,202.7C1360,181,1400,139,1420,117.3L1440,96L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"></path></svg>
                                </div>
                                <div className="p-5 px-10 flex flex-col gap-5">
                                    {data?.kolom.map((kolom, index) => (
                                        <div key={'kolom'+index} className="flex justify-between font-lexend tracking-wide gap-4 items-center text-sm">
                                            <div className="truncate capitalize">{kolom.nama_kolom}</div>
                                            <hr className="grow" />
                                            <div className="truncate">{getPayment(kolom.id)}</div>
                                        </div>
                                    ))}
                                </div>
                                {sts != 'Lunas' ? (
                                    <button onClick={changeStatus} className="text-2xl text-blue-500 font-lexend">Belum Lunas</button>
                                ):(
                                    <button onClick={changeStatus} className="text-2xl text-blue-500 font-lexend">Lunas</button>
                                )}
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                <Accordion>
                                    <AccordionItem key="1" aria-label="Accordion">
                                         <Button onClick={handleDelete} color="danger" className="w-full">Hapus</Button>
                                    </AccordionItem>
                                </Accordion>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}