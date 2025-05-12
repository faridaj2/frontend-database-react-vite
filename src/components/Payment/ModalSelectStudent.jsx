import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter, Input, Button} from "@nextui-org/react"
import AuthUser from "../../utils/AuthUser"

export default function ModalSelectStudent({modal, setModal, searchBar, students}){
    const {http} = AuthUser()
    const onOpenChange = () => setModal(!modal)
    
    const handleSubmit = (id) => {
        http.post('/api/pspdb/add/listed', {
           id
        })
    }
    return (
        <>
            <Modal isOpen={modal} onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader>Pilih Siswa</ModalHeader>
                            <ModalBody>
                                <Input
                                endContent={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>}
                                onValueChange={e => searchBar(e)}
                                />
                                {students?.map((item, index) => (
                                    <div className="flex flex-col gap-2 overflow-auto h-59" key={'tb'+index}>
                                        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-xl">
                                            <div className="text-sm uppercase truncate tracking-wider">{item.nama_siswa}</div>
                                            <div>
                                                <Button isIconOnly color="primary" size="sm" onClick={() => handleSubmit(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus-icon lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                    
                </ModalContent>
            </Modal>
        </>
    )
}