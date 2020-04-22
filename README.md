# Upgraded-Socket.io-RoomChat

A web socket chat using :  
* [node]() framework 
* [socket.io](https://socket.io/docs)
* [redis]()
* [MongoDB]()

**This project is an upgraded version off [this exemple](https://github.com/Applelo/Socket.io-Room-Chat)**

## Installation

If you don't have Python installed yet, [get it here](https://www.python.org/downloads)  
I recommend you to use the package manager [pip](https://pip.pypa.io/en/stable/) to setup a virtual environment. I personnaly used [virtualenv](https://virtualenv.pypa.io/en/latest), but you're free to choose one that suits you best.  
Go to the project root folder and type the following commands :

```bash
pip install virtualenv
virtualenv venv
```
Then, install all packages in requirements.txt on your venv :  
```bash
pip install -r requirements.txt
```

## Setup project

The project needs a .env file for configuration, it should contain :  
````bash
DB_URI = your neo4j graph database uri
USERNAME = username for authenication in the current graph
PASSWORD = password for authentication in the current graph
````
