# Upgraded-Socket.io-RoomChat

A web socket chat using :  
* [NodeJS](https://nodejs.org) framework 
* [socket.io](https://socket.io/docs)
* [redis](https://redis.io)
* [MongoDB](https://www.mongodb.com)

**This project is an upgraded version of [this tutorial](https://github.com/Applelo/Socket.io-Room-Chat).**

## Project description
As it consists in a "in and out" chat, a user is deleted from database when he disconnects, but all of his message are kept. This can be improved by a simple login mechanism, since a username can be used by several people through time (only if the username isn't currently used by someone logged in the chat room).

### Chat commands
Users can type special commands in chat. It must always begin with a "!". 
See below the full command list :  
* `!bestsender` : shows the user who sent the most messages in the room
* `!nbusers` : shows the number of logged user in the room
* `!currentusers` : prints all logged users in the room

### Installation
If you don't have NodeJS installed yet, [get it here](https://nodejs.org)  
Go to the project root folder and install dependencies by running :
```bash
npm install 
```

### Setup and Run
1. Since Redis runs on default configurations, just open a terminal and run `redis-server`
2. Init MongoDB with `mongod --port 3000 --dbpath your_data_folder_path`
3. Note that you can make replica sets in MongoDB for more fault tolerance, [see here how to do it](https://docs.mongodb.com/manual/replication)
4. You are now free to run the app ! Go to the project root folder and run `node server/server.js`

## Possible improvements
* Make multiple chat room and the possibility to switch betwwen each other
* Add a login mechanism to avoid any filthy identity theft
* Add more chat commands to display useful information about the chat room
