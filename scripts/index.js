function login() {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    if (!username || !password) {
        alert("missing elements!")
    } else {
        if (username == "testing" && password == "test") {
            document.getElementById('login').style.display = 'none'
            document.getElementById('loader').style.display = 'block'

//eventualy makes a call to the server to get the users data and stuff but for rn it will do nothing....
            let userData = {
                username: '@rr41',
                userIMG: './public/icon.png'
            }
            sessionStorage.setItem("userData", JSON.stringify(userData))

            document.getElementById('loader').style.display = 'none'
            document.getElementById('chat').style.display = 'block'


        } else {
            alert("incorrect thingy")
        }
    }
}

function myKeyPress(e){
    var keynum;
  
    if(window.event) { // IE                  
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                 
      keynum = e.which;
    }
    if (keynum == 13) {
        createNewMessage(document.getElementById("chatInput").value, 'user')
    }
  }

function createNewMessage(message, messageType) {
    document.getElementById("chatInput").value = ""
    //will create a new message by getting the user object from the localstroage. 
    
    //gets the user data...
    let userData = JSON.parse(sessionStorage.getItem("userData"))
    console.log(userData)
    //checks to see if the message is blank if it is then it will return
    if (message == "") { return }


    if (messageType == 'user') {
//creates the message div
    let messageDiv = document.createElement('div')
    messageDiv.classList.add("message")
    messageDiv.id = 'somethingIDKYET!'

    //creates the userIMG
    let userIMG = document.createElement('img')
    userIMG.src = userData.userIMG
    userIMG.classList.add("author")
    //creates the messageBody 
    let messageBody = document.createElement('div')
    messageBody.classList.add("messageBody")

    let username = document.createElement('h1')
    username.classList.add("username")
    username.innerText = userData.username

    let text = document.createElement('p')
    text.classList.add("text")
    text.innerText = message

    messageBody.appendChild(username)
    messageBody.appendChild(text)

    messageDiv.appendChild(userIMG)
    messageDiv.appendChild(messageBody)

    document.getElementById('messages').appendChild(messageDiv)
    //this also needs to send the message to the server (idk how yet)
    sendSomething(message)
    } else if (messageType == 'server') {
        //creates the message div
    let messageDiv = document.createElement('div')
    messageDiv.classList.add("serverMessage")
    messageDiv.id = 'somethingIDKYET!'

    //creates the userIMG
    let userIMG = document.createElement('img')
    userIMG.src = './public/thumbnail.jpg'
    userIMG.classList.add("author")
    //creates the messageBody 
    let messageBody = document.createElement('div')
    messageBody.classList.add("messageBody")

    let username = document.createElement('h1')
    username.classList.add("username")

    username.innerText = '[SERVER]'

    let text = document.createElement('p')
    text.classList.add("text")
    text.innerText = message

    messageBody.appendChild(username)
    messageBody.appendChild(text)

    messageDiv.appendChild(userIMG)
    messageDiv.appendChild(messageBody)

    document.getElementById('messages').appendChild(messageDiv)
    //this also needs to send the message to the server (idk how yet)
    }
    
}

const webSocket = new WebSocket('ws://localhost:8080');
    webSocket.onmessage = (event) => {
      console.log(event)
        createNewMessage(event.data, 'server')
    };
    webSocket.addEventListener("open", () => {
      console.log("We are connected");
    });
    webSocket.addEventListener("close", () => {
      console.log("Socket is CLOSED!")
    });
    function sendSomething(message) {
      webSocket.send(message)
    }