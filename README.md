# Github Explorer

## Execute this app locally
*Assuming you have Node installed*
- Clone this repo
- Browse at the root of the cloned repo
- Run `npm install` to install project dependencies
- Create the file `.env` based on `.env.example` with your own configuration
- Run `grunt serve-build` and browse at `localhost:4000` to run your app locally

## Check the app on the web
The Landing page is [here](https://damienrochat.github.io/TWEB-App-01/)
Open [http://github-explorer.herokuapp.com](http://github-explorer.herokuapp.com)

## Run MongoDB with Docker
- Server : `docker run -p 27017:27017 mongo:latest`
- Client : `docker run -it mongo:latest mongo --host 192.168.99.100`