var messages = document.getElementById("messages");

// fetching initial chat messages from the database
(function() {

    fetch("/chats")
        .then(data => {
            return data.json();
        })
        .then(json => {
            json.map(data => {
                let li = document.createElement("li");
                let span = document.createElement("span");
                messages.appendChild(li).append(data.message);
                messages
                    .appendChild(span)
                    .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
            });
        });
})();