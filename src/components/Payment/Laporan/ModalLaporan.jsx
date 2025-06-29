import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, DateRangePicker, Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { parseDate } from '@internationalized/date'
import { I18nProvider } from "@react-aria/i18n";
import {  useState } from "react";
import AllUtils from "../../../utils/AllUtils";

export default function ModalLaporan({modal, setModal}){
    const navigate = useNavigate()
    const [date, setDate] = useState(null)
    const onOpenChange = () => setModal(!modal)
    const { convertDate } =  AllUtils()

    const handleSubmit = () => {
        if(!date) return
        let dateSubmit = `${convertDate(date.start)}/${convertDate(date.end)}`
        let d = btoa(dateSubmit)
        window.open(`/dashboard/payment/laporan/bulk/${d}`, '__blank')
    }
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                <I18nProvider locale="id-ID">
                                    <DateRangePicker value={date} onChange={setDate} className="w-full" label="Pilih Range Laporan" />
                                </I18nProvider>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={handleSubmit} className="w-full" color="primary">Buka Laporan</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}