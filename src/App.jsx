import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';

// Page
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import DataSantri from './views/Dashboard/DataSantri';
import CreateSiswa from './views/Dashboard/CreateSiswa';
import DetailSiswa from './views/Dashboard/DetailSiswa';
import EditSantri from './views/Dashboard/EditSantri';
import KelolaBerkas from './views/Dashboard/KelolaBerkas';
import ImportMassal from './views/Dashboard/ImportMassal';
import ZonaAdmin from './views/ZonaAdmin/ZonaAdmin';
import Unauthorized from './views/Unauthorized';
import Error from './views/Error';
import Payment from './views/Payment/Payment';
import DetailPayment from './views/Payment/DetailPayment';
import GroupPaymentDetail from './views/Payment/GroupPaymentDetail';
import DetailUserPayment from './views/Payment/DetailUserPayment';
import PenitipanUang from './views/Penitipan/PenitipanUang';
import DetailPenitipanUang from './views/Penitipan/DetailPenitipanUang';
import Keamanan from './views/Keamanan/Keamanan';
import DetailKeamanan from './views/Keamanan/DetailKeamanan';
import RiwayatKeamanan from './views/Keamanan/RiwayatKeamanan';
import Laporan from './views/Payment/Laporan';

import { Provider } from 'react-redux'
import store from './store/store';

import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <Router>
          <Routes>
            {/* Login / halaman Awal */}
            <Route exact path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/data-santri" element={<DataSantri />} />
            <Route path="/dashboard/data-santri/create-siswa" element={<PrivateRoute element={CreateSiswa} roles="admin" />} />
            <Route path="/dashboard/data-santri/detail/:nis" element={<DetailSiswa />} />
            <Route path="/dashboard/data-santri/edit/:nis" element={<PrivateRoute element={EditSantri} roles="admin" />} />

            {/* Halaman kelola berkas */}
            <Route path="/dashboard/data-santri/:nis/kelola-berkas" element={<PrivateRoute element={KelolaBerkas} roles="admin" />} />
            <Route path="/dashboard/data-santri/import-massal" element={<PrivateRoute element={ImportMassal} roles="admin" />} />

            {/* Halaman Payment */}
            <Route path="/dashboard/payment" element={<PrivateRoute element={Payment} roles="keuangan" />} />
            <Route path="/dashboard/payment/detail/:id" element={<PrivateRoute element={DetailPayment} roles="keuangan" />} />
            <Route path="/dashboard/payment/group-payment/:id" element={<PrivateRoute element={GroupPaymentDetail} roles="keuangan" />} />
            <Route path="/dashboard/payment/payment-detail/:paymentId/:siswaId" element={<PrivateRoute element={DetailUserPayment} roles="keuangan" />} />
            <Route path="/dashboard/payment/laporan/:data" element={<PrivateRoute element={Laporan} />} roles="keuangan" />
            {/* Penitipan Uang */}
            <Route path="/dashboard/penitipan" element={<PrivateRoute element={PenitipanUang} roles="penitipan" />} />
            <Route path="/dashboard/penitipan/detail/:id" element={<PrivateRoute element={DetailPenitipanUang} roles="penitipan" />} />
            {/* Keamanan */}
            <Route path="/dashboard/keamanan" element={<PrivateRoute element={Keamanan} roles="keamanan" />} />
            <Route path="/dashboard/keamanan/detail/:id" element={<PrivateRoute element={DetailKeamanan} roles="keamanan" />} />
            <Route path="/dashboard/keamanan/riwayat/:id" element={<PrivateRoute element={RiwayatKeamanan} roles="keamanan" />} />


            {/* Admin */}
            <Route path="/dashboard/zona-admin" element={<PrivateRoute element={ZonaAdmin} roles="admin" />} />

            {/* Another */}
            <Route path="/unathorized" element={<Unauthorized />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </NextUIProvider>
    </Provider>
  );
}

export default App;
