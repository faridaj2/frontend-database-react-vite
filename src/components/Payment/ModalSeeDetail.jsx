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
                        <ModalHeader className="font-lexend text-4xl flex justify-center text-center bg-blue-400 text-white items-center"><span className="text-blue-900 p-1 rounded-2xl px-2">Santri</span><span>Connect</span></ModalHeader>
                        <ModalBody className="p-0">
                            <div className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#60a5fa" fill-opacity="1" d="M0,128L24,144C48,160,96,192,144,176C192,160,240,96,288,69.3C336,43,384,53,432,53.3C480,53,528,43,576,48C624,53,672,75,720,80C768,85,816,75,864,69.3C912,64,960,64,1008,80C1056,96,1104,128,1152,117.3C1200,107,1248,53,1296,58.7C1344,64,1392,128,1416,160L1440,192L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"></path></svg>
                            </div>
                            <div className="pb-3 px-12 flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <div className="text-sm">Pembayaran Bulan</div>
                                    <div className="text-sm">{data.month.month}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm">Status</div>
                                    <div className="text-sm">{fn.getStatus(data.month.month, data.month.price)}</div>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <div className="text-sm">Nominal</div>
                                    <div className="text-sm">Rp. {addComa(data.month.price)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm">Telah dibayar</div>
                                    <div className="text-sm">Rp. {fn.getTotal(data.month.month)}</div>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <div className="text-sm">Tanggal Pembayaran</div>
                                    <div className="text-sm">{fn.getDop(data.month.month)}</div>
                                </div>
                                
                            </div>
                            <div className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#60a5fa" fill-opacity="1" d="M0,128L24,144C48,160,96,192,144,176C192,160,240,96,288,69.3C336,43,384,53,432,53.3C480,53,528,43,576,48C624,53,672,75,720,80C768,85,816,75,864,69.3C912,64,960,64,1008,80C1056,96,1104,128,1152,117.3C1200,107,1248,53,1296,58.7C1344,64,1392,128,1416,160L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
                            </div>
                        </ModalBody>
                        <ModalFooter className="bg-blue-400">
                            {/* <Button color="success" variant="light" onPress={onClose}>
                                Tutup
                            </Button> */}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalSeeDetail