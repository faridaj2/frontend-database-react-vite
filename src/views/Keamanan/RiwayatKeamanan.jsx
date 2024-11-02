/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import DashboardTemplate from "../../components/DashboardTemplate"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Table, TableHeader, TableCell, TableBody, TableRow, TableColumn, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";

// Icon

// Utilitas
import AuthUser from "../../utils/AuthUser"
import getImage from "../../utils/getImage"
import { Avatar } from "@nextui-org/react"

const ModalDetail = ({ modal, setModal, detail, reset }) => {
    const onOpenChange = () => setModal(!modal)
    const { http } = AuthUser()
    const deleteHandler = () => {
        http.post(`/api/delete-permanent`, { id: detail.id })
            .then(() => {
                reset()
                setModal(false)
            })
    }
    return (
        <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Detail Pelanggaran</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-2">
                                <div className="border-1 p-2 rounded-md bg-gray-100">
                                    <div className="text-tiny">Pelanggaran</div>
                                    <div>{detail.pelanggaran}</div>
                                </div>
                                <div className="border-1 p-2 rounded-md bg-gray-100">
                                    <div className="text-tiny">Poin Pelanggaran</div>
                                    <div>{detail.poin_pelanggaran}</div>
                                </div>
                                <div className="border-1 p-2 rounded-md bg-gray-100">
                                    <div className="text-tiny">Tanggal</div>
                                    <div>{detail.tanggal}</div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="shadow" onClick={deleteHandler}>
                                Hapus
                            </Button>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Tutup
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>

    )
}

function RiwayatKeamanan() {
    const { id } = useParams()
    const { http } = AuthUser()
    const navigate = useNavigate()

    // Var
    const [data, setData] = useState()
    const [detail, setDetail] = useState()
    const [modalDetail, setModalDetail] = useState()
    const [page, setPage] = useState()


    // UseEffect
    useEffect(() => {
        document.title = "Detail Keamanan"
        getSiswa()
    }, [])

    useEffect(() => {
        getSiswa()
    }, [page])

    // fungsi
    const getSiswa = () => {
        http.get(`/api/get-riwayat-pelanggar/${id}`)
            .then(res => {
                const data = res.data
                if (JSON.stringify(data.siswa) === '{}') return navigate('/dashboard/keamanan')
                if (!data.poinPelanggaran) return navigate('/dashboard/keamanan')
                setData(data)
            })
            .catch(() => navigate('/dashboard/keamanan'))
    }
    const openDetail = item => {
        setDetail(item)
        setModalDetail(true)
    }
    return (
        <DashboardTemplate>
            <div className="flex items-center gap-3 border-1 p-5 rounded-xl shadow-xl bg-white shadow-violet-500/20 justify-between">
                <div className="flex gap-4 items-center">
                    <Avatar src={getImage(data && data.siswa)} color="primary" isBordered />
                    <div>
                        <div>{data?.siswa.nama_siswa}</div>
                        <div className="text-tiny text-gray-500">{data?.siswa.nis}</div>
                    </div>
                </div>

            </div>

            <div className="mt-2">
                <Table>
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn>Pelanggaran</TableColumn>
                        <TableColumn>Poin</TableColumn>
                        <TableColumn>Tanggal</TableColumn>
                        <TableColumn>Aksi</TableColumn>
                    </TableHeader>
                    <TableBody items={data?.poinPelanggaran.data}>
                        {data?.poinPelanggaran.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.pelanggaran}</TableCell>
                                <TableCell>{item.poin_pelanggaran}</TableCell>
                                <TableCell>{item.tanggal}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" color="primary" variant="shadow" onClick={() => openDetail(item)}>Detail</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-2">
                {data && data.poinPelanggaran.last_page !== 1 && <Pagination showControls total={data.poinPelanggaran.last_page} page={page} onChange={(e) => setPage(e)} />}
            </div>
            <ModalDetail modal={modalDetail} setModal={setModalDetail} detail={detail} reset={getSiswa} />
        </DashboardTemplate>
    )
}

export default RiwayatKeamanan