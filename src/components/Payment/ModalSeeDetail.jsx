import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";

// Utilitas
import AllUtils from "../../utils/AllUtils";

function ModalSeeDetail({ modal, setModal, data, fn }) {
    const capture = useRef(null)
    const { addComa } = AllUtils()
    const onOpenChange = () => {
        setModal(!modal)
    }
    const [loading, setLoading] = useState(false)
    const makeImage = async () => {
        if (capture.current) {
            try {
                setLoading(true)
                const canvas = await html2canvas(capture.current, {
                    useCORS: true, 
                    allowTaint: true,
                    scale: 10
                });

                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                [blob.type]: blob
                            })
                        ]);
                        setLoading(false)
                        alert('Bukti Pembayaran Telah Disalin');
                    } catch (err) {
                        const link = document.createElement('a');
                        link.download = 'screenshot.png';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        setLoading(false)
                    }
                }, 'image/png');
            } catch (error) {
                setLoading(false)
            }
        }
    };
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur" placement="center" ref={capture}>
            <ModalContent className="shadow-md shadow-violet-700/40" >
                {(onClose) => (
                    <>
                        <ModalHeader className="font-lexend text-4xl flex justify-center text-center bg-blue-400 text-white items-center"><span className="text-blue-900 p-1 rounded-2xl px-2">Santri</span><span>Connect</span></ModalHeader>
                        <ModalBody className="p-0" >
                            <div className="w-full" >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 285"><path fill="#60a5fa" fillOpacity="1" d="M0,128L48,160C96,192,192,256,288,245.3C384,235,480,149,576,133.3C672,117,768,171,864,176C960,181,1056,139,1152,149.3C1248,160,1344,224,1392,256L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
                            </div>
                            <div className="pb-3 px-12 flex flex-col gap-2 -translate-y-8 relative">
                                <div className="flex justify-center flex-col items-center font-lexend font-bold gap- mb-10 text-sm md:text-xl">
                                    <img className="w-24" src="/logo.png" alt="" />
                                    <h1 className="text-blue-700">PP. Darussalam Blokagung 2</h1>
                                </div>
                                {loading && (
                                    <div className="absolute w-96 h-96 flex items-center justify-center top-2 left-[50%] translate-x-[-50%] bg-white/30 backdrop-blur-sm">
                                        <span className="loader"></span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <div className="text-sm">Nama Santri</div>
                                    <div className="text-sm truncate text-xs font-semibold uppercase">{data.siswa.nama_siswa}</div>
                                </div>
                                {/* <hr /> */}
                                {data.month.type == 'kontan' ?
                                    (
                                        <div className="flex justify-between">
                                            <div className="text-sm">Pembayaran</div>
                                            <div className="text-sm">{data.nama}</div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between">
                                            <div className="text-sm">Pembayaran Syahriah</div>
                                            <div className="text-sm">{data.month.month}</div>
                                        </div>
                                    )}
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#60a5fa" fillOpacity="1" d="M0,128L24,144C48,160,96,192,144,176C192,160,240,96,288,69.3C336,43,384,53,432,53.3C480,53,528,43,576,48C624,53,672,75,720,80C768,85,816,75,864,69.3C912,64,960,64,1008,80C1056,96,1104,128,1152,117.3C1200,107,1248,53,1296,58.7C1344,64,1392,128,1416,160L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
                            </div>
                        </ModalBody>
                        <ModalFooter className="bg-blue-400 flex flex-col justify-center">
                            <p onClick={() => makeImage()} className="text-center text-xs text-white cursor-pointer">Download Aplikasi SantriConnect di https://app.darussalam2.com</p>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalSeeDetail