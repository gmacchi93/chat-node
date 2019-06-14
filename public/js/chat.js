var messages = document.getElementById("messages");

// fetching initial chat messages from the database
(function() {

    fetch("/chats")
        .then(data => {
            return data.json();
        })
        .then(json => {
            json.map(data => {
                console.log(data);
                let tr = document.createElement("tr");
                let td_fecha = document.createElement("td");
                let td_persona = document.createElement("td");
                let td_mensaje = document.createElement("td");
                td_fecha.append(data.createdAt);
                td_persona.append(data.sender);
                td_mensaje.append(data.message);

                tr.appendChild(td_fecha);
                tr.appendChild(td_persona);
                tr.appendChild(td_mensaje);
                messages
                    .appendChild(tr);
            });
            $('table').DataTable();
        });
})();