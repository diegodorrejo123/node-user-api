const mongoose = require('mongoose')
const dataBaseName = 'develop'
const uri = `mongodb+srv://develop:develop@cluster0.q0i9x.mongodb.net/${dataBaseName}
?retryWrites=true&w=majority`
mongoose.connect(uri).then((result) => {
    console.log("Base de Datos conectada");
}).catch((error) => {
    console.log("Error al conectar con la base de datos");
})