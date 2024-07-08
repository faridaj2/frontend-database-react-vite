import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";
import { Card, CardBody, Image } from '@nextui-org/react'
import AuthUser from '../utils/AuthUser'
import getImage from '../utils/getImage'


function ConfirmDeleteModal({ isOpen, onOpen, onOpenChange, getAllSiswa, siswa }) {
    const { http } = AuthUser()
    const [isLoading, setIsLoading] = useState(false)
    const id = siswa?.id ?? null
    const deleteSiswa = (onClose) => {
        setIsLoading(true)
        http.post('/api/deleteSiswa', { id })
            .then(res => {
                getAllSiswa()
                onClose()
                setIsLoading(false)
            })
            .catch(res => {
                setIsLoading(false)
                onClose()
            })
    }
    const dataPribadi = [
        { label: "Nama", tableName: siswa?.nama_siswa },
        { label: "NIS", tableName: siswa?.nis },
        { label: "NIK", tableName: siswa?.NIK },
        { label: "NISN", tableName: siswa?.NISN },
        { label: "KK", tableName: siswa?.KK },
        { label: "Domisili", tableName: siswa?.domisili },
        { label: "KIP", tableName: siswa?.KIP },
    ]
    const checkValue = (e) => {
        if (!e) return "------"
        return e
    }
    const StatusChip = () => {
        if (siswa?.status === 'active') return 'warning'
        if (siswa?.status === 'pending') return 'default'
        if (siswa?.status === 'nonactive') return 'danger'
    }
    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmasi Untuk Menghapus</ModalHeader>
                            <ModalBody>
                                <Card>
                                    <CardBody>
                                        <div>
                                            <Image
                                                width={2000}
                                                height={200}
                                                alt="NextUI hero Image with delay"
                                                src={getImage(siswa)}
                                                className='w-full h-52 object-cover'
                                            />

                                        </div>
                                        <div>
                                            <div className='flex flex-col gap-3 mt-5'>
                                                {dataPribadi.map(item => (
                                                    <div className='flex flex-col gap-1' key={`detailSiswa` + item.label}>
                                                        <div className='text-xs text-gray-500'>
                                                            {item.label}
                                                        </div>
                                                        <div className='font-semibold text-base'>
                                                            {checkValue(item.tableName)}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='flex flex-col gap-1' >
                                                    <div className='text-xs text-gray-500'>
                                                        status
                                                    </div>
                                                    <div className='font-semibold text-base'>
                                                        <Chip size='sm' color={StatusChip()}>{siswa?.status}</Chip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </CardBody>
                                </Card>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="danger" isLoading={isLoading} onPress={() => deleteSiswa(onClose)}>
                                    Hapus
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ConfirmDeleteModal