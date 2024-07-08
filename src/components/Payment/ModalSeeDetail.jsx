import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import React from 'react'

// Utilitas
import AllUtils from "../../utils/AllUtils";

function ModalSeeDetail({ modal, setModal, data, fn }) {
    const { addComa } = AllUtils()
    const onOpenChange = () => {
        setModal(!modal)
    }


    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent className="shadow-md shadow-violet-700/40">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Detail Transaksi</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-3">
                                <div>Pembayaran Bulan</div>
                                <div className="text-center">:</div>
                                <div>{data.month.month}</div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>Status</div>
                                <div className="text-center">:</div>
                                <div>{fn.getStatus(data.month.month, data.month.price)}</div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>Nominal</div>
                                <div className="text-center">:</div>
                                <div>Rp. {addComa(data.month.price)}</div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>Telah dibayar</div>
                                <div className="text-center">:</div>
                                <div>Rp. {fn.getTotal(data.month.month)}</div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>Tanggal Pembayaran</div>
                                <div className="text-center">:</div>
                                <div>{fn.getDop(data.month.month)}</div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" variant="light" onPress={onClose}>
                                Tutup
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalSeeDetail