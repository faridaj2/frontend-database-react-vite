/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

import { Button, Divider, Tooltip, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, DateRangePicker, Radio, RadioGroup } from '@nextui-org/react'

import DashboardTemplate from '../../components/DashboardTemplate'
import ModalCreatePayment from '../../components/ModalCreatePayment'


// Icon
import { FaPlus } from "react-icons/fa"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { Link } from 'react-router-dom'
import { GiCash } from "react-icons/gi"
import { BsCalendar2MonthFill } from "react-icons/bs"
import { MdGroups2 } from "react-icons/md"


// Utilst
import AllUtils from '../../utils/AllUtils'
import AuthUser from '../../utils/AuthUser'
import { useNavigate } from 'react-router-dom'

import { Tabs, Tab } from "@nextui-org/tabs";

const ModalGroupPembayaran = ({ modal, setModal, toastInfo, toastSuccess, refresh }) => {
  const { http } = AuthUser()
  const onOpenChange = () => {
    const action = modal ? onClose : onOpen;
    action();
  }
  const onClose = () => {
    setModal(false)
  }
  const onOpen = () => {
    setModal(true)
  }

  const [isLoading, setIsLoading] = useState(false)

  const [namaPembayaran, setNamaPembayaran] = useState()
  const [desc, setDesc] = useState()

  const submitHandler = () => {

    if (!namaPembayaran) return toastInfo('Nama Pembayaran tidak boleh kosong')
    if (!desc) return toastInfo('Deskripsi tidak boleh kosong')
    const data = {
      groupName: namaPembayaran,
      desc: desc
    }
    setIsLoading(true)
    http.post('/api/create-group-payment', data)
      .then(res => {
        setNamaPembayaran()
        setDesc()
        toastSuccess('Group pembayaran telah berhasil dibuat')
        refresh()
        setIsLoading(false)
      })
      .catch(res => {
        console.log(res)
        setIsLoading(false)
      })
    setIsLoading(false)
    onClose()
  }
  return (
    <Modal isOpen={modal} onOpenChange={onOpenChange} backdrop="blur" size="lg" isDismissable="false">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Buat group pembayaran baru</ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-3'>
                <Input placeholder='Group pembayaran spp' label="Nama Pembayaran" onValueChange={setNamaPembayaran} value={namaPembayaran} labelPlacement='outside' />
                <Input placeholder='Deskripsi' label="Deskripsi group" value={desc} onValueChange={setDesc} labelPlacement='outside' />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Tutup
              </Button>
              <Button color="primary" onPress={submitHandler} isLoading={isLoading}>
                Buat
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}



function Payment() {
  const { ToastContainer, toastSuccess, toastInfo } = AllUtils()
  const { http } = AuthUser()

  // Modal Create Modal Pembayaran
  const [createModal, setCreateModal] = useState(false)
  // Modal Cteate group payment
  const [groupModal, setGroupModal] = useState()
  // Modal Download Laporan
  const [modalLaporan, setModalLaporan] = useState(false)


  const [table, setTable] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const navigate = useNavigate()

  // Use Effect Method
  useEffect(() => {
    document.title = "Keuangan"
    getAllTabelPayment()
    getAllGroupPayment()
  }, [])

  // Payment
  const getAllTabelPayment = () => {
    setIsLoading(true)
    http.get('/api/get-tabel-payment')
      .then(res => {
        setTable(res.data)
        setIsLoading(false)
        setPage(res.data.links.length - 2)
      })
      .catch(res => console.log(res))

  }

  const changeTable = (page) => {
    setIsLoading(true)
    http.get(`/api/get-tabel-payment?page=${page}`)
      .then(res => {
        setTable(res.data)
        setIsLoading(false)
      })
      .catch(res => console.log(res))

  }

  const [groupPayment, setGroupPayment] = useState()
  const [groupPage, setGroupPage] = useState()

  // Group Payment
  const getAllGroupPayment = () => {
    http.get('/api/get-group-payment')
      .then(res => {
        setGroupPayment(res.data)
        setGroupPage(res.data.links.length - 2)
      })
      .catch(res => console.log(res))
  }
  const changeGroupTable = (page) => {
    setIsLoading(true)
    http.get(`/api/get-group-payment?page=${page}`)
      .then(res => {
        setGroupPayment(res.data)
        setIsLoading(false)
      })
      .catch(res => console.log(res))

  }




  return (
    <DashboardTemplate>
      <ToastContainer />

      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" color='primary'>
          <Tab key="pembayaran" title="Pembayaran">
            <h3 className='text-lg font-semibold text-blue-700 mb-2'>Pembayaran</h3>


            {isLoading &&
              <div className='w-full flex items-center justify-center p-5'>
                <span className="loader"></span>
              </div>
            }
            <Tooltip content="Tambah Pembayaran Baru">
              <Button size='sm' color='primary' isIconOnly variant='shadow' onClick={() => setCreateModal(true)}><FaPlus /></Button>
            </Tooltip>


            <div className='mt-3 flex gap-3 flex-col'>
              {
                table?.data.map((item, index) => (
                  <Link to={'/dashboard/payment/detail/' + item.id} className='bg-white hover:bg-blue-100 p-2 rounded-md flex justify-between items-center shadow-lg shadow-violet-700/20 transition-all ease-in-out' key={index}>
                    <div className='flex items-center'>
                      <div className='bg-white rounded-md p-3 mr-2 text-violet-800 shadow-md shadow-violet-700/10'>
                        <FaMoneyBillTransfer />
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-600'>
                          {item.payment_name}
                        </h4>
                        <p className='text-tiny text-gray-600'>{item.desc}</p>
                      </div>
                    </div>
                    <div>
                      <Tooltip content={item.bulanan ? 'Bulanan' : 'Cash'}>
                        <div className='p-3 text-violet-700 bg-white rounded-md'>
                          {item.bulanan ? <BsCalendar2MonthFill /> : <GiCash />}
                        </div>
                      </Tooltip>
                    </div>
                  </Link>
                ))
              }
            </div>
            <Pagination className='mt-2' showControls total={page} initialPage={1} page={table?.current_page} onChange={e => changeTable(e)} isCompact />

          </Tab>
          <Tab key="group" title="Group Pembayaran">
            <div>
              <h3 className='text-lg font-semibold text-blue-700 mb-2'>Group Pembayaran</h3>
              <div className='py-3 rounded-xl bg-white'>
                <Tooltip content="Tambah group pembayaran baru">
                  <Button size='sm' color='primary' isIconOnly variant='shadow' onClick={() => setGroupModal(true)}><FaPlus /></Button>
                </Tooltip>
                <div className='mt-4 flex flex-col gap-4 '>
                  {groupPayment?.data.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 justify-start outline outline-1 outline-gray-100 p-2 rounded-md shadow-lg shadow-violet-700/20 bg-white text-slate-700 cursor-pointer hover:bg-slate-100 transition-all ease-in' onClick={() => navigate(`/dashboard/payment/group-payment/${item.id}`)}>
                      <div className='bg-white rounded-md p-3 mr-2 text-violet-800 shadow-md shadow-violet-700/10'>
                        <MdGroups2 className='text-xl' />
                      </div>
                      <div className='text-left'>
                        <h4 className='text-gray-600'>
                          {item.group_name}
                        </h4>
                        <div className='text-tiny text-gray-400'>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                  {!groupPayment && (
                    <div className='w-full flex items-center justify-center p-5'>
                      <span className="loader"></span>
                    </div>
                  )}
                </div>
                <Pagination className='my-4' showControls total={groupPage} initialPage={1} page={groupPayment?.current_page} onChange={e => changeGroupTable(e)} isCompact />
              </div>
            </div>
          </Tab>

        </Tabs>
      </div>
      <ModalGroupPembayaran modal={groupModal} setModal={setGroupModal} toastInfo={toastInfo} toastSuccess={toastSuccess} refresh={getAllGroupPayment} />
      <ModalCreatePayment modal={createModal} setModal={setCreateModal} toastInfo={toastInfo} toastSuccess={toastSuccess} refresh={getAllTabelPayment} />

    </DashboardTemplate>
  )
}

export default Payment