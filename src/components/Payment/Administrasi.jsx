import {
	Button,
	Select,
	SelectItem,
	Modal,
	CheckboxGroup,
	Checkbox,
	Input
} from "@nextui-org/react";

import ModalAdministrasi from "./ModalAdministrasi";
import ModalSelectStudent from "./ModalSelectStudent";
import DetailUser from "./DetailUser";

import { useNavigate } from 'react-router-dom';

import AuthUser from "../../utils/AuthUser";
import AllUtils from "../../utils/AllUtils";

import { useState, useEffect, useRef } from 'react'

export default function Administrasi() {
	const navigate = useNavigate();
	const { http } = AuthUser()
	const [modal, setModal] = useState(false)
	const [filter, setFilter] = useState(false)
	const [laporan, setLaporan] = useState(false)
	const [loading, setLoading] = useState(true)
	const [modalStudent, setModalStudent] = useState(false)
	const [v, setV] = useState(JSON.parse(localStorage.getItem('view_')) ? JSON.parse(localStorage.getItem('view_')) : [])

	const [sekolah, setSekolah] = useState("")
	const [kelamin, setKelamin] = useState("")
	const [lunas, setLunas] = useState("")
	const [tahun, setTahun] = useState("")

	const [columns, setColumns] = useState()
	const [sstudents, setSstudents] = useState()
	const [payments, setPayments] = useState([])
	const [years, setYears] = useState()

	const [modalUserDetail, setModalUserDetail] = useState(false)

	const [students, setStudents] = useState()

	const { addComa } = AllUtils()

	const context = useRef(null)

	const [refreshStatus, setRefreshStatus] = useState(false);


	useEffect(() => {
		localStorage.setItem('view_', JSON.stringify(v))
	}, [v])
	useEffect(() => {
		getStudents()
		getPayment()
		getKolom()
	}, [sekolah, kelamin, lunas, tahun])

	useEffect(() => {
			if(students && columns && payments.length == 0){
				students.map(s => {
					columns.map(c => {
						let input = document.getElementById(`input-${s.id}-${c.id}`)
						if(input) input.value = ''
					})
				})
				if (columns) setLoading(false)
			}
			if(students && columns && payments.length > 0){
				payments.map(item => {
					let input = document.getElementById(`input-${item.siswa_id}-${item.pspdb_kolom_list_id}`)
					if(input) input.value = addComa(item.jumlah)
				})
				if (columns) setLoading(false)
			}
			
		
	}, [payments, students, columns])

	// Unlisted Students
	const searchStudents = (search = '') => {
		http.get(`/api/pspdb/search/unlisted?search=${search}`)
			.then(r => setSstudents(r.data))
	}
	// Listed Students
	const getStudents = (search = '') => {
		if(!tahun) return
		http.get(`/api/pspdb/search/listed?search=${search}&formal=${sekolah}&kelamin=${kelamin}&status=${lunas}&tahun=${tahun}`)
			.then(r => setStudents(r.data))
	}
	const [status, setStatus] = useState()

	const getKolom = () => {
		http.get(`/api/pspdb/read/kolom?sekolah=${sekolah}&kelamin=${kelamin}`)
			.then(r => {
				setColumns(r.data)
			})
	}
	const getPayment = () => {
		http.get(`/api/pspdb/payment/read?formal=${sekolah}&kelamin=${kelamin}&status=${lunas}&tahun=${tahun}`)
			.then(r => {
				if(r.data.length > 0){
					setPayments(r.data)
				}else{
					setPayments([])
				}
			})
	}
	const getYear = () => {
		http.get('/api/pspdb/menu/get/year')
		.then(res => {
			let newData = [...new Set(res.data.map(item => item.slice(0,4)))].map(year => {
				return { key: year, label: year };
			});
			setYears(newData.reverse())
			setTahun(newData[0].key.toString())
		})
	}
	useEffect(() => {
		getKolom()
		searchStudents()
		getStudents()
		getPayment()
		getYear()
	}, [])
	useEffect(() => {
		getStatus()
	}, [columns, students])
	const getStatus = () => {
		let data = []
		students?.map(student => {
			columns?.map(column => {
				let item = { sid: student.id, cid: column.id, status: false }
				data.push(item)
			})
		})
		setStatus(data)
		
	}
	const updateStatusInput = (siswa, kolom, newStatus) => {
		const data = [...status]
		let updatedData = data.map(item => {
			if(item.sid == siswa && item.cid == kolom){
				return {...item, status : newStatus}
			}else{
				return item
			}
		})
		setStatus(updatedData); 
	};
	const handelEdit = (siswa, kolom) => {
		let input = document.getElementById(`input-${siswa}-${kolom}`)
		input.disabled = false
		updateStatusInput(siswa, kolom, true)
		setRefreshStatus(prev => !prev);
	}
	const getStatusInput = (siswa, kolom) => {
		const data = [...status]
		let foundItem = data.find(item => item.sid == siswa && item.cid == kolom);
		return foundItem ? foundItem.status : false;
		
	}
	const handleSave = (siswa, kolom) => {
		let input = document.getElementById(`input-${siswa}-${kolom}`)
		input.disabled = true
		input.classList.remove('disabled:bg-white')
		updateStatusInput(siswa, kolom, false)
		setRefreshStatus(prev => !prev);
		let value = input.value
		// if(!value) return input.classList.add('disabled:bg-white')
		value = value.replace(/\./g, '')
		http.post('/api/pspdb/payment/in', {
			siswa, kolom, value
		})
			.then(r => {
				input.classList.add('disabled:bg-white')
				getPayment()
			})
	}

	const [dataUser, setDataUser] = useState()
	const userDetailPayment = (id) => {
		setModalUserDetail(true)
		const payment = payments.filter(item => item.siswa_id == id)
		const siswa = students.find(item => item.id == id)
		const kolom = columns.filter(item => (item.formal == siswa.formal.slice(1,4) || item.formal == "") && (item.kelamin == siswa.kelamin.toLowerCase() || item.kelamin == '') )
		setDataUser({payment, kolom, siswa})
	}
	const CetakLaporan = () => {
		let data = `${sekolah}/${kelamin}/${lunas}/${tahun}`
		data = btoa(data)
		// navigate(`/dashboard/payment/laporan/administrasi/${data}`)
		window.open(`/dashboard/payment/laporan/administrasi/${data}`, '_blank');
	}


	return (
		<>
			<div className="border p-2  mb-2 rounded-xl shadow flex justify-end items-center gap-2 bg-white">
				<Button isIconOnly color="primary" size="sm" onClick={() => setModalStudent(!modalStudent)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus-icon lucide-user-round-plus"><path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="M19 16v6" /><path d="M22 19h-6" /></svg>
				</Button>
				<Button isIconOnly size="sm" color={filter ? 'primary' : 'default'} onClick={() => setFilter(!filter)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-funnel-icon lucide-funnel"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" /></svg>
				</Button>
				<Button size="sm" color="primary" onClick={() => setModal(!modal)}
					startContent={
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-between-vertical-end-icon lucide-between-vertical-end"><rect width="7" height="13" x="3" y="3" rx="1" /><path d="m9 22 3-3 3 3" /><rect width="7" height="13" x="14" y="3" rx="1" /></svg>
					}
				>
					Kolom
				</Button>
				<Button
					size="sm"
					color="primary"
					startContent={
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-chart-column-increasing-icon lucide-file-chart-column-increasing"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M8 18v-2" /><path d="M12 18v-4" /><path d="M16 18v-6" /></svg>
					}
					onClick={CetakLaporan}
				>
					Laporan
				</Button>
			</div>
			{filter && (
				<>
					<div className="border p-2 rounded-xl shadow mb-2 grid grid-cols-2 md:grid-cols-4 gap-2 bg-white">
						<Select variant="bordered" color="primary" label="Sekolah" size="sm"
							selectedKeys={[sekolah]}
							onChange={e => setSekolah(e.target.value)}
						>
							<SelectItem key="smp">
								SMP
							</SelectItem>
							<SelectItem key="smk">
								SMK
							</SelectItem>
						</Select>
						<Select variant="bordered" color="primary" label="Kelamin" size="sm"
							selectedKeys={[kelamin]}
							onChange={e => setKelamin(e.target.value)}
						>
							<SelectItem key="l">
								Laki-Laki
							</SelectItem>
							<SelectItem key="p">
								Perempuan
							</SelectItem>
						</Select>
						<Select variant="bordered" color="primary" label="Status" size="sm"
							selectedKeys={[lunas]}
							onChange={e => setLunas(e.target.value)}
						>
							<SelectItem key="">
								Semua
							</SelectItem>
							<SelectItem key="Lunas">
								Lunas
							</SelectItem>
							<SelectItem key="Belum Lunas">
								Belum Lunas
							</SelectItem>
						</Select>
						<Select isRequired variant="bordered" color="primary" label="Tahun" size="sm"
							selectedKeys={[tahun]}
							onChange={e => setTahun(e.target.value)}
							items={years}
						>
							{(animal) => <SelectItem>{animal.label}</SelectItem>}
						</Select>
					</div>
					<div className="border shadow p-2 rounded-xl  mb-2 flex gap-2 bg-white">
						<div className="flex gap-3">
							<CheckboxGroup
								color="primary"
								label=""
								orientation="horizontal"
								size="sm"
								value={v}
								onValueChange={setV}
							>
								<Checkbox value="harga">Harga</Checkbox>
								<Checkbox value="sekolah">Sekolah</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</>
			)}


			<div className={`relative overflow-x-auto bg-white rounded-xl shadow ${loading && 'hidden'}`}>
				<table className="w-full text-sm text-left overflow-auto print" id="table">
					<thead className="text-xs text-gray-500 font-sans print">
						<tr className="h-10">
							<th className="px-6 uppercase">Nama Siswa</th>
							{columns?.map((item, index) => (
								<th className="px-6 py-3 text-nowrap uppercase" key={`${index}th`}>
									{item.nama_kolom}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className={`${!v.includes('sekolah') && 'hidden'} bg-gray-100`}>
							<td className="px-6 border text-gray-600 py-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school-icon lucide-school"><path d="M14 22v-4a2 2 0 1 0-4 0v4" /><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10" /><path d="M18 5v17" /><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" /><path d="M6 5v17" /><circle cx="12" cy="9" r="2" /></svg></td>
							{columns?.map((item, index) => <td key={`${index}tr2`} className="px-6 text-xs text-cente py-2 border"><div className="uppercase mr-2 bg-blue-500 p-1 text-white inline-block rounded-full px-4 font-bold tracking-wide text-[0.6rem]">{item.formal == '' ? 'Semua' : item.formal}</div><div className="uppercase bg-blue-500 p-1 text-white inline-block rounded-full px-4 font-bold tracking-wide text-[0.6rem]">{item.kelamin == 'l' && 'Laki Laki' || item.kelamin == '' && 'Semua' || item.kelamin == 'p' && 'Perempuan'}</div></td>)}
						</tr>
						<tr className={`${!v.includes('harga') && 'hidden'} bg-gray-100`}>
							<td className="px-6 border text-gray-600 py-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins-icon lucide-coins"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg></td>
							{columns?.map((item, index) => <td key={`${index}tr`} className="px-6 text-xs text-nowrap text-cente py-2 border">Rp. {addComa(item.harga)}</td>)}
						</tr>
						{students &&
							students?.map((item, index) => (
								<tr
									key={`table-${index}`}
									className="bg-white border-b border-gray-200 text-gray-700"
								>
									<th
										scope="row"
										className="px-6 col-3 py-4 font-medium text-gray-900 whitespace-nowrap font-semibold cursor-pointer hover:bg-blue-100 transition"
										onClick={() => userDetailPayment(item.id)}
									>
										{item.nama_siswa}
									</th>

									{columns?.map((col, colIndex) => {
										const isFormalMatch = item.formal.slice(1, 4) === col.formal || col.formal === "";
										const isGenderMatch = item.kelamin.toLowerCase() === col.kelamin.toLowerCase() || col.kelamin === "";

										return isFormalMatch && isGenderMatch ? (
											<td key={`col-${colIndex}`} className="w-14">
												<div className="flex p-2 gap-2 items-center">
													<span className="text-gray-500 font-lexend">
														Rp.
													</span>
													<input
														id={`input-${item.id}-${col.id}`}
														disabled={!getStatusInput(item.id, col.id)}
														className="h-9 p-2 focus:outline-none focus:bg-gray-100 bg-slate-100 rounded disabled:bg-white"
														type="text"
														onChange={e => e.target.value = addComa(e.target.value)}
														// value={}
													/>
													<button className={`text-blue-800 ${getStatusInput(item.id, col.id) && 'hidden'}`} onClick={() => handelEdit(item.id, col.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-pen-line-icon lucide-file-pen-line"><path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" /><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><path d="M8 18h1" /></svg></button>
													<button className={`text-blue-800 ${!getStatusInput(item.id, col.id) && 'hidden'}`} onClick={() => handleSave(item.id, col.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg></button>
												</div>
											</td>
										) : (
											<td key={`col-${colIndex}`} className="bg-blue-50" />
										);
									})}
								</tr>
							))
						}

					</tbody>
				</table>
			</div>
			{
				loading &&
				<div className='w-full flex items-center justify-center p-5'>
					<span className="loader"></span>
				</div>
			}

			{modal &&
				<ModalAdministrasi modal={modal} setModal={setModal} reset={getKolom} />
			}
			<ModalSelectStudent modal={modalStudent} setModal={setModalStudent} searchBar={searchStudents} students={sstudents} reset={getStudents} />
			<DetailUser modal={modalUserDetail} setModal={setModalUserDetail} data={dataUser} reset={getStudents}/>
		</>
	)
}

function ModalLaporan({ modal, setModal }) {
	const onOpenChange = () => setModal(!modal)
	return (
		<>
			<Modal isOpen={modal} onOpenChange={onOpenChange}>

			</Modal>
		</>
	)

}

