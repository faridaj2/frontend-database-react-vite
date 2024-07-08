/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Spinner } from "@nextui-org/react";



function ViewPdf({ viewModal, setViewModal, berkas }) {

    const onOpenChange = () => {
        const action = viewModal ? onClose : onOpen;
        action();
    }
    const onClose = () => {
        setViewModal(false)
    }
    const onOpen = () => {
        setViewModal(true)
    }



    return (
        <Modal isOpen={viewModal} onOpenChange={onOpenChange} size='full'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">File Pdf</ModalHeader>
                        <ModalBody>
                            {berkas ? (
                                <object width="100%" height="100%" data={berkas} type="application/pdf" aria-label='file-pdf'></object>
                            ) :
                                (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <Spinner size='lg' />
                                    </div>
                                )}
                        </ModalBody>
                        {/* <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter> */}
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ViewPdf