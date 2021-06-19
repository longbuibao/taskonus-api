# task-manager-api

This API perform full CRUD operation for users and tasks

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this API.

##### For Ubuntu and Debian

```bash
sudo apt install nodejs
sudo apt install npm
npm install
```
##### For Windows

Install Node.js and npm [[instruction]](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)



## Usage

##### Create a `.env` file in root derectory
```
SECRET_BCRYPT_KEY=your-key
PORT=your-port

NODEMAILER_USERNAME=your-email
NODEMAILER_PASSWORD=your-password
NODEMAILER_PORT=587
NODEMAILER_HOST=your-smpt-mail-server

DB_HOST=your-mongodb-host
DB_USER=your-mongodb-user
DB_PASS=your-mongodb-password
```
to start development
##### Or with this heroku app (https://task-api-ie213-l21.herokuapp.com/) using Postman, import `task-api.postman_collection.json` collection



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
