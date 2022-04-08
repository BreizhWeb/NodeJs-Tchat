/**
 * Réalisé par : Ronan, Julien
 */
const permission = require('./permissions');
const db = require('../db/db');
const cache = require('./cacheData');
const multirooms = require('./multirooms.js')
const logger = require('../log/logger');
const { io } = require('socket.io-client');

async function createMp(socket, data) {
  let room = await db.rooms.create(data.name + "-" + socket.user.pseudo, data.image, data.private)
  db.roles.create(room.room_id, socket.user.user_id, 5)
  await cache.add(socket.user.user_id, room.room_id, 5)
  logger.eventLogger.log('info', `"action":"create mp room", "room_id":${room.room_id}, "user_id":${socket.user.user_id}`)
  inviteUser(socket.user.user_id, room.room_id, data.target_user_id, 5)
  return room
}

async function createRoom(socket, data) {
  let room = await db.rooms.create(data.name, data.image, data.private)
  db.roles.create(room.room_id, socket.user.user_id, 0)
  await cache.add(socket.user.user_id, room.room_id, 0)
  logger.eventLogger.log('info', `"action":"create room", "room_id":${room.room_id}, "user_id":${socket.user.user_id}`)
  return room
}

async function sendMessage(user_id, room_id, content) {
  if (permission.getActionRight(user_id, room_id, permission.actions.sendMessage)) {
    let msg_id = await db.messages.create(user_id, room_id, content)
    logger.eventLogger.log('info', `"action":"send message", "room_id":${room_id}, "user_id":${user_id}, "message_id":${msg_id}`)
    return msg_id
  } else {
    return false
  }
}

async function deleteMessage(user_id, room_id, msg_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteMessage)) {
    db.messages.deleteMsg(msg_id);
    return true
  } else if (user_id == (await db.messages.selectById(msg_id))?.user_id) {
    db.messages.deleteMsg(msg_id);
    return true
  } else {
    return false
  }
}

async function joinRoom(user_id, room_id) {
  let room = await db.rooms.select(room_id)
  if (!room.private) {
    db.roles.create(room_id, user_id, 1);
    cache.add(user_id, room_id, 1);
    return true
  } else {
    return false
  }
}

function inviteUser(user_id, room_id, invited_user_id, invited_user_role = 1) {
  if (cache.value.find(r => r.room_id == room_id && r.user_id == invited_user_id))
    return false
  if (permission.getActionRight(user_id, room_id, permission.actions.inviteUser)) {
    db.roles.create(room_id, invited_user_id, invited_user_role);
    cache.add(invited_user_id, room_id, invited_user_role);
    return true
  } else {
    return false
  }
}

function deleteUser(user_id, room_id, deleted_user_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteUser)) {
    db.roles.deleteUserFromRoom(deleted_user_id, room_id);
    cache.deleteUser(deleted_user_id, room_id);
    // TODO FRONT
    return true
  }
  else {
    return false
  }
}

async function deleteRoom(user_id, room_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteRoom)) {
    db.roles.deleteByRoom(room_id);
    await cache.deleteRoom(room_id);
    return true
  }
  else {
    return false
  }
}

// NO NEED
async function changeRole(user_id, room_id) {
  if (permission.getActionRight(user, room, permission.actions.changeRole)) {
    return true
  }
  else {
    return false
  }
}


module.exports = {
  createRoom,
  createMp,
  sendMessage,
  deleteMessage,
  inviteUser,
  joinRoom,
  deleteUser,
  deleteRoom,
  changeRole,
}
