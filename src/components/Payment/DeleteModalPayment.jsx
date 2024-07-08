import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { useNavigate } from 'react-router-dom';

// Utilitas
import AuthUser from '../../utils/AuthUser';


function DeleteModalPayment({ modal, setModal, id, info, success }) {
    const navigate = useNavigate()
    const { http } = AuthUser()
    const onOpenChange = () => {
        setModal(!modal)
    }
    const [inputValues, setInputValues] = useState(["", "", "", ""]);
    const inputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

        if (value.length === 0 && index > 0) {
            document.getElementById(`input${index}`).focus();
        } else if (value.length === 1 && index < inputValues.length - 1) {
            document.getElementById(`input${index + 2}`).focus();
        }
    };

    const handleSubmit = () => {
        let num = [...inputValues]
        num = parseInt(num.join(""))
        if (num === 1234) {
            http.get(`/api/delete-payment/${id}`)
                .then(res => {
                    const data = res.data
                    if (data === 'success') {
                        navigate('/dashboard/payment')
                    } else {
                        throw new Error('Terjadi Kesalahan')
                    }
                })
                .catch(res => info(res))
        } else {
            info("Gagal terhapus")
        }
    }


    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur" >
            <ModalContent className='shadow-md shadow-violet-700/40'>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Konfirmasi Penghapusan</ModalHeader>
                        <ModalBody>
                            <div className='w-full text-center'>
                                Apa anda yakin ingin meneruskan?
                                ketik 1234 untuk melanjutkan
                            </div>
                            <div className='flex gap-3 justify-center'>
                                {inputValues.map((value, index) => (
                                    <input
                                        key={index}
                                        className='bg-slate-200 w-10 h-14 rounded-md text-center' value={value}
                                        onChange={(e) => inputChange(index, e.target.value)}
                                        maxLength={1}
                                        id={`input${index + 1}`}
                                    />
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Batal
                            </Button>
                            <Button color="danger" onPress={handleSubmit} variant='shadow'>
                                Hapus
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default DeleteModalPayment