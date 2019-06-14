# Notas:

Para instalar las dependecias del servidor

```
npm install
```


Para correr el servidor
```
node server/server
```

Incluir estos archivos y codigos js en la pagina deseada, cambiar la ip si lo requiere.
Cambiar el valor de sala por el deseado
```
<link href="css/chat_client.css" rel="stylesheet">
//
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
    <script>
        var sala = 'agency';
    </script>
    <script src="js/chat_client.js"></script>
```

Incluir este codigo html en su pagina
```
<div class="row chat-window col-xs-5 col-md-3" id="chat_window_1" style="margin-left:10px;min-width: 400px;">
        <div class="col-xs-12 col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading top-bar">
                    <div class="col-md-8 col-xs-8" style="display: inline-block;padding: 0; margin:0;">
                        <h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span> Chat</h3>
                    </div>
                    <div class="col-md-3 col-xs-3" style="display: inline-block; text-align: right;padding: 0; margin:0;">
                        <a href="#"><span class="glyphicon glyphicon-remove icon_close" data-id="chat_window_1">x</span></a>
                    </div>
                </div>
                <div class="panel-body msg_container_base" id="contenedor_mensajes" style="height: 400px">


                </div>
                <div class="panel-footer">
                    <div class="input-group">
                        <input id="btn-input" type="text" class="form-control input-sm chat_input" placeholder="Escribe tu mensaje aquí..." />
                        <span class="input-group-btn">
                                <button class="btn btn-primary btn-sm" id="btn-chat">Send</button>
                                </span>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="chat-window">
        <button class="btn btn-primary" id="chat-open-button">Hablá con nosotros</button>
    </div>
```

Incluimos pagina de ejemplo en startbootstrap-agency-gh-pages


