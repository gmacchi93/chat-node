const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

//database connection
const Chat = require("../models/Chat");
const connect = require("../dbconnect");
const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {


        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);
        console.log(data);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        console.log(usuarios.personas);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje(null, 'Administrador', `${ data.nombre } se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('salirChat', (data, callback) => {
        let persona = usuarios.borrarPersona(client.id);

        if (persona !== undefined) {
            client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje(client.id, 'Administrador', `${ persona.nombre } salió`));
            client.broadcast.to(persona.sala).emit('listaPersona', usuarios.getPersonasPorSala(persona.sala));

        }


        callback(persona);

    });

    client.on('crearMensaje', (data, callback) => {


        let persona = usuarios.getPersona(client.id);
        console.log('crear mensaje', persona);
        let mensaje = crearMensaje(client.id, persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        //save chat to the database
        connect
            .then(db => {
                console.log("connected correctly to the server");
                let chatMessage = new Chat({ message: data.mensaje, sender: persona.nombre });

                chatMessage.save();
                console.log("Saved");
            });

        callback(mensaje);
    });


    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log(personaBorrada);
        if (personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje(client.id, 'Administrador', `${ personaBorrada.nombre } salió`));
            client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

        }



    });

    // Mensajes privados
    client.on('mensajePrivado', (data, callback) => {
        console.log('mensajePrivado', data);
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(client.id, persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
        callback(mensaje);

    });

});