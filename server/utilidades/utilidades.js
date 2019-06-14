const crearMensaje = (id, nombre, mensaje) => {

    return {
        id,
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

module.exports = {
    crearMensaje
}