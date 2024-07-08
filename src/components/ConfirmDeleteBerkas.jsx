import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function ConfirmDeleteBerkas({ openModal, setOpenModal, berkas, deleteBerkas }) {
    const [isLoading, setIsLoading] = useState(false)

    const onOpenChange = () => {
        const action = openModal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setOpenModal(false)
    }
    const onOpen = () => {
        setOpenModal(true)
    }
    const handleDelete = async () => {
        await setIsLoading(true)
        await deleteBerkas(berkas.id)
        await setIsLoading(false)
        await onClose()

    }






    return (
        <>
            <Modal isOpen={openModal} onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Konfirmasi untuk menghapus</ModalHeader>
                            <ModalBody>
                                apa anda yakin akan menghapus <span className="font-semibold text-blue-900">{berkas.nama_berkas}</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button color="danger" onPress={handleDelete} isLoading={isLoading}>
                                    Hapus
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
