import AuthUser from "./AuthUser";
import { useNavigate } from "react-router-dom";
// Toastify
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllUtils = () => {
    const { http } = AuthUser()
    const navigate = useNavigate()

    const getSantri = (nis, setSiswa) => {
        http.get(`/api/getData/${nis}`)
            .then(res => {
                setSiswa(res.data)
            })
            .catch(res => {
                navigate('/dashboard/data-santri/')
            })
    }
    const getBerkasSiswa = (id, setBerkas) => {
        http.get(`/api/get-berkas/${id}`)
            .then(data => {
                // console.log(data.data)
                return setBerkas(data.data)
            })
            .catch(err => console.log(err))
    }


    //Toast
    const toastInfo = (info) => {
        toast.info(info, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
    const toastSuccess = (success) => {
        toast.success(success, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
    const addComa = (input) => {
        if (!input) return
        if (typeof input !== 'string') {
            input = input.toString()
        }
        let num = input.replace(/\D/g, '')
        num = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        return num
    }
    const convertDate = (obj) => {
        if (!obj) return
        const { month, day, year } = obj
        const date = `${year}-${month}-${day}`
        return date
    }
    const changeDateFormat = (date) => {
        if (!date) return
        date = date.split('-')
        var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        const year = date[0]
        const index = parseInt(date[1].replace(/0/g, '')) - 1
        const month = bulan[index]
        return `${month}-${year}`
    }
    const generateArrayMonth = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const monthYearRange = [];

        while (start <= end) {
            const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const month = monthNames[start.getMonth()];
            const year = start.getFullYear();
            monthYearRange.push(`${month}-${year}`);

            start.setMonth(start.getMonth() + 1);
        }

        return monthYearRange;
    }


    return { getSantri, toast, toastInfo, toastSuccess, ToastContainer, getBerkasSiswa, addComa, convertDate, changeDateFormat, generateArrayMonth }

}

export default AllUtils

