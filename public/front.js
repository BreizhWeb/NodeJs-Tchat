$(document).ready(function () {
  var socket = io.connect();
  socket.emit("userlist", 1, function (data) {
    $('.utilisateurs').append(JSON.stringify(data));
  });

  function convertToPlain(html) {
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  function newRoom(room) {
    if (!$(`#btn-${room.room_id}`).length) {
      $("#btnRoomsList").append(`
        <div id="btn-${room.room_id}" class="btnRoom">
          ${room.name}
        </div>
      `)
    }
    if (!$(`#room-${room.room_id}`).length) {
      $('#rooms').append(`
        <div class="room" id="room-${room.room_id}">
          <h2>${room.name}</h2>
          <div class="chatWrapper">
            <div class="chatWindow"></div>
            <form class="messageForm">
              <input type="text" size="35" class="message" placeholder="Say something...">
              <input type="submit" value="Submit">
            </form>
          </div>
        </div>
      `)
      $(`#room-${room.room_id}`).submit(function (e) {
        e.preventDefault();
        sendMsg(room.room_id)
      })
    }
    return room.id;
  }

  function sendMsg(roomid) {
    socket.emit("send message", {
      msg: $(`#room-${roomid} input.message`).val(),
      room: roomid
    },
      () => {
        $(`#room-${roomid} input.message`).val('')
      }
    );
  }

  function switchRoom(room) {
    $(".room").hide();
    $(`#room-${room.room_id}`).show()
  }

  function buildUI(user, roomid = 0) {
    user.rooms?.forEach(room => newRoom(room))
    $(".btnRoom").on("click", function (e) {
      switchRoom(user.rooms.find(room => room.room_id == e.target.id.match(/[0-9]+/)))
    })
    switchRoom(user.rooms.find(room => room.room_id == roomid) || user.rooms[0])
    $("#login").remove()
    $("#mainWrapper").show()
  }
  $("#createroom").on("click", function (e) {
    $('#modal').addClass('show')
    $('#modal .modalcontent').html(`
      <form id="createroomform">
        <label>Nom : <input type="text" name="name" /></label>
        <label>Image url : <input type="text" name="image" /></label>
        <label>Private : <input type="checkbox" name="private" /></label>
        <input type="submit" value="Submit">
        <span class="close">x</span>
      </form >
    `)
    $('#createroomform').submit(function (e) {
      e.preventDefault()
      console.log(e);
      socket.emit(
        "create room",
        {
          name: $('input[name=name]').val(),
          image: $('input[name=image]').val(),
          private: $('input[name=private]').val() == 'on' ? true : false
        },
        function (user, newroomid) {
          buildUI(user, newroomid)
          $('#modal').removeClass('show')
          $('#modal .modalcontent').html('')
        }
      )
    })
    $("#modal .close").on("click", function (e) {
      $('#modal').removeClass('show')
    })
  })

  socket.on("new message", function (data, callback) {
    $(`#room-${data.room_id} .chatWindow`).append(`
      <div class='message'>
        <strong>${convertToPlain(data.user)}</strong>: 
        ${convertToPlain(data.msg)}
      </div>
    `)
  })

  socket.on("connection", function (data) {
    $("#usernameForm").submit(function (e) {
      e.preventDefault()
      let pseudo = $("#username").val()
      if (pseudo) {
        socket.emit("new user", pseudo, function (data) {
          data ? buildUI(data) : $("#error").html("Username is wrong")
        })
      }
      $("#username").val("")
    })
  })
})