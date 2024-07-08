import AuthUser from "./AuthUser"
export default function ConstKelas() {
    const { http } = AuthUser()

    const getSystem = (type, save) => {
        http.get(`/api/get-sysetem-data/${type}`)
            .then(res => {
                save(JSON.parse(res.data))
            })
            .catch(res => console.log(res))
    }
    const status = ['active', 'nonactive', 'pending']

    const domisili = ['pondok', 'desa']
    const kamarPutri = []
    const kamarPutra = []

    return { status, domisili, getSystem }
}