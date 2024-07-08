/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Chip, DatePicker } from "@nextui-org/react";
import AllUtils from '../../utils/AllUtils';
import AuthUser from '../../utils/AuthUser';
import { parseDate } from "@internationalized/date"


function ModalTransaction({ modal, setModal, data, refresh, income }) {
    const { http } = AuthUser()
    const { addComa, convertDate } = AllUtils()

    const [input, setInput] = useState()
    const [date, setDate] = useState()

    const [isLoading, setIsLoading] = useState(false)

    const onOpenChange = () => {
        setModal(!modal)
    }

    useEffect(() => {
        if (!input) return
        setInput(addComa(input))
    }, [input])

    const onSubmit = () => {
        if (!date) return
        const obj = {
            nama_pembayaran_id: data.paymentId,
            siswa_id: data.siswaId,
            jumlah_pembayaran: parseInt(input.replace(/\./g, '')),
            month: data.month.month,
            dop: convertDate(date)
        }
        setIsLoading(true)
        http.post('/api/income-payment', obj)
            .then(res => {
                refresh()
                setIsLoading(false)
                onOpenChange()

            })
            .catch(res => {
                setIsLoading(false)
                console.log(res)
            })
    }


    useEffect(() => {
        let find = income?.find(item => item.month === data.month.month)
        if (find) {
            setInput(find.price)
            setDate(parseDate(find.dop))
        } else {
            setInput()
            setDate()
        }
    }, [income])
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop='blur'>
            <ModalContent className='shadow-md shadow-violet-800/30'>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Buat Pembayaran</ModalHeader>
                        <ModalBody>
                            <div>
                                <div className='my-4 flex gap-3'>
                                    <Chip color='primary' size='sm' variant='dot'>{data.month.month}</Chip>
                                    <Chip color='primary' size='sm' variant='dot'>{`Rp. ` + addComa(data.month.price)}</Chip>
                                </div>
                                <div className='flex flex-col gap-2 my-2'>
                                    <Input
                                        label="Jumlah Pembayaran"
                                        size='sm' variant='bordered'
                                        labelPlacement='outside'
                                        placeholder='Jumlah pembayaran'
                                        value={input}
                                        onValueChange={setInput}
                                        startContent={`Rp. `}
                                    />
                                    <DatePicker
                                        label="Tanggal pembayaran"
                                        labelPlacement='outside'
                                        variant='bordered'
                                        size='sm'
                                        value={date}
                                        onChange={setDate}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" variant="shadow" onPress={onSubmit} isLoading={isLoading}>
                                Simpan
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalTransaction