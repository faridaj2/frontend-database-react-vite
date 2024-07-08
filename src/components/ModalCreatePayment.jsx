import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, DateRangePicker, DatePicker } from "@nextui-org/react";
import AuthUser from '../utils/AuthUser'
import AllUtils from '../utils/AllUtils';

function ModalCreatePayment({ modal, setModal, toastInfo, toastSuccess, refresh }) {
    const { http } = AuthUser()
    const { convertDate } = AllUtils()
    const [isLoading, setIsLoading] = useState(false)

    const [paymentName, setPaymentName] = useState()
    const [desc, setDesc] = useState()
    const [bulanan, setBulanan] = useState(false)
    const [tenggat, setTenggat] = useState()
    const [monthly, setMonthly] = useState()


    // const stringToDate = (string) => {
    //     const date = new Date(Date.parse(string))
    //     return date
    // }

    const submitForm = () => {

        if (!paymentName) return toastInfo('Masukkan nama pembayaran')
        if (!desc) return toastInfo('Masukkan deskripsi pembayaran')

        const data = {
            paymentName: paymentName,
            desc: desc,
            bulanan: bulanan
        }

        if (bulanan) {
            if (!monthly) return toastInfo('Tanggal harus diisi')
            data.start_date = convertDate(monthly.start)
            data.end_date = convertDate(monthly.end)
        } else {
            if (!tenggat) return toastInfo('Tanggal harus diisi')
            data.tenggat = convertDate(tenggat)
        }
        setIsLoading(true)
        http.post('/api/create-payment', data)
            .then(res => {
                setIsLoading(false)
                toastSuccess('Pembayaran telah dibuat')
                setPaymentName()
                setDesc()
                setBulanan(false)
                setTenggat()
                setMonthly()
                refresh()
                onClose()

            })
            .catch(res => {
                setIsLoading(false)
                toastInfo('Gagal membuat pembayaran')
                refresh()
                onClose()
            })
    }


    const onOpenChange = () => {
        const action = modal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setModal(false)
    }
    const onOpen = () => {
        setModal(true)
    }

    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} size='3xl' backdrop='blur' isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Buat Pembayaran Baru</ModalHeader>
                        <ModalBody>
                            <div className='flex gap-5 flex-col'>
                                <Input label="Nama Pembayaran" labelPlacement='outside' value={paymentName} onValueChange={setPaymentName} placeholder='SPP KOS 2024' />
                                <Input label="Deskripsi" labelPlacement='outside' value={desc} onValueChange={setDesc} placeholder='Pembayaran mulai 21 Feb 2021 - 20 Jan 2022' />
                                <Checkbox onValueChange={setBulanan} isSelected={bulanan}>Bulanan</Checkbox>
                                {bulanan && (
                                    <DateRangePicker
                                        label="Jangka Bulanan"
                                        className="max-w-xs"
                                        labelPlacement='outside'
                                        onChange={setMonthly}
                                        value={monthly}
                                    />
                                )}
                                {!bulanan && (
                                    <DatePicker label="Tenggat Pembayaran" labelPlacement='outside' className="max-w-[284px]" value={tenggat} onChange={setTenggat} showMonthAndYearPickers />
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Tutup
                            </Button>
                            <Button color="primary" onClick={submitForm} isLoading={isLoading}>
                                Buat Pembayaran
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalCreatePayment