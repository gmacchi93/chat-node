var nombre = null;
var privado = null;

var idSocket = null;
var usuarioGeneral = {
    nombre: nombre,
    sala: sala
};

$(function() {
    var socket = io('http://localhost:3000/');
    var activo = true;

    socket.on('connect', function() {
        idSocket = this.id;
        console.log('Conectado al servidor', this);
    });


    $('#btn-chat').click(function() {
        activo = true;
        let mensaje = $('#btn-input').val();
        console.log(mensaje);


        let objMensaje = {
            'mensaje': mensaje
        };

        let accion = 'crearMensaje';

        if (privado != null) {
            objMensaje.para = privado;
            accion = 'mensajePrivado';
        }

        socket.emit(accion, objMensaje, function(resp) {
            let fecha = new Date(resp.fecha);
            let fechaFormateada = '';
            if (fecha.getHours() < 10) {
                fechaFormateada += '0' + fecha.getHours().toString();
            } else {
                fechaFormateada += fecha.getHours().toString();
            }
            fechaFormateada += ':';

            if (fecha.getMinutes() < 10) {
                fechaFormateada += '0' + fecha.getMinutes().toString();
            } else {
                fechaFormateada += fecha.getMinutes().toString();
            }

            let mensajeHtml = `<div class="row msg_container base_sent">
                        <div class="col-md-10 col-xs-10 ">
                            <div class="messages msg_sent">
                                <p>${resp.mensaje}</p>
                                <time datetime="2009-11-13T20:00">${fechaFormateada}</time>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-2 avatar">
                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                        </div>
                    </div>`;

            $('#contenedor_mensajes').append(mensajeHtml);


            console.log(resp);
        })

    });

    function inicializarSocket() {

        setInterval(function() {
            console.log('timer', activo);
            if (activo) {
                activo = false;
            } else {
                socket.emit('salirChat', {}, function(data) {
                    console.log('sali del chat', data);

                });
                socket.emit('disconnect', {}, function(resp) {
                    console.log(resp);

                })
                location.reload();
            }
        }, 10000);

        usuarioGeneral.nombre = nombre;
        console.log(usuarioGeneral);

        socket.emit('entrarChat', usuarioGeneral, function(resp) {
            console.log('Usuarios conectados', resp);
        });

        // escuchar
        socket.on('disconnect', function() {

            console.log('Perdimos conexión con el servidor');

        });
        socket.on('crearMensaje', function(mensaje) {
            console.log('Servidor:', mensaje);
            //renderizarMensajes(mensaje, false);
            //scrollBottom();
        });

        // Escuchar cambios de usuarios
        // cuando un usuario entra o sale del chat
        socket.on('listaPersona', function(personas) {
            // renderizarUsuarios(personas);
        });

        // Mensajes privados
        socket.on('mensajePrivado', function(mensaje) {
            console.log(mensaje);
            privado = mensaje.id;
            let resp = mensaje;
            if (mensaje.mensaje === 'sala nueva') {
                socket.emit('salirChat', {}, function(data) {
                    usuarioGeneral.sala = idSocket;
                    socket.emit('entrarChat', usuarioGeneral, function(resp) {
                        console.log('Usuarios conectados', resp);
                    });
                });
            } else {
                let fecha = new Date(resp.fecha);
                let fechaFormateada = '';
                if (fecha.getHours() < 10) {
                    fechaFormateada += '0' + fecha.getHours().toString();
                } else {
                    fechaFormateada += fecha.getHours().toString();
                }
                fechaFormateada += ':';

                if (fecha.getMinutes() < 10) {
                    fechaFormateada += '0' + fecha.getMinutes().toString();
                } else {
                    fechaFormateada += fecha.getMinutes().toString();
                }

                let mensajeHtml = `<div class="row msg_container base_receive">
                        <div class="col-md-2 col-xs-2 avatar">
                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                        </div>
                        <div class="col-xs-10 col-md-10">
                            <div class="messages msg_receive">
                                <p>${mensaje.mensaje}</p>
                                <time datetime="2009-11-13T20:00">${fechaFormateada}</time>
                            </div>
                        </div>
                    </div>`;

                $('#contenedor_mensajes').append(mensajeHtml);


                console.log(resp);
            }


            console.log('Mensaje privado', mensaje);

        });
    }

    $('#chat-open-button').click(function() {
        if (nombre != null) {
            $("#chat_window_1").show();
            $(this).hide();
        } else {
            let nombreAux = prompt("Por favor ingrese su nombre", null);
            if (nombreAux != null) {
                nombre = nombreAux;
                inicializarSocket();
                $("#chat_window_1").show();
                $(this).hide();
            }
        }

    });
});
$(document).on('click', '.panel-heading span.icon_minim', function(e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function(e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function(e) {
    var size = $(".chat-window:last-child").css("margin-left");
    size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $("#chat_window_1").clone().appendTo(".container");
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function(e) {
    //$(this).parent().parent().parent().parent().remove();
    $("#chat_window_1").hide();
    $('#chat-open-button').show();
});