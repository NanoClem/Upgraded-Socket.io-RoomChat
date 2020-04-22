# Upgraded-Socket.io-RoomChat

A web socket chat using :  
* [NodeJS](https://nodejs.org) framework 
* [socket.io](https://socket.io/docs)
* [redis](https://redis.io)
* [MongoDB]()

**This project is an upgraded version of [this tutorial](https://github.com/Applelo/Socket.io-Room-Chat).**

## Project description

## Installation

If you don't have NodeJS installed yet, [get it here](https://nodejs.org)  
Go to the project root folder and install dependencies by running :
```bash
npm install 
```

## Setup Redis
The app need redis to store logged users. Since it runs on default configurations, just open a terminal and run :
````bash
redis-server
````

## Setup MongoDB
Open a new terminal and run :
````bash
mongod --port 3000 --dbpath your_data_folder_path
````

## Run app
You are now free to run the app ! Go to the project root folder and run in a new terminal :
````bash
node server/server.js
````
