const getImage = (siswa) => {
    if (!siswa?.foto) return "https://i.pinimg.com/564x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"
    return '/storage/photos/' + siswa?.foto
}

export default getImage