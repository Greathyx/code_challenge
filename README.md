# Viaplay Lunchbot

## mongodb-backend
1. Install NodeJS: https://nodejs.org/en/download/.
2. Install MongoDB: https://docs.mongodb.com/manual/administration/install-community/.
3. Navigate into the `/mongodb-backend` folder through a terminal.
4. Import the Restaurants database from the `provision/db.json` file:
   ```
   mongoimport --host <your_mongodb_host> --db viaplay --collection restaurants --type json --file ./provision/db.json --jsonArray
   ```
   E.g. My mongodb host is `127.0.0.1:27017`. Please see more details on https://docs.mongodb.com/guides/server/import/.
5. Install node dependencies: `npm install`.
6. Run the db server: `npm start`.

## vue-frontend
1. Navigate into the `/vuefrontend` folder through a terminal.
2. Install node dependencies: `npm install`.
3. Compiles and hot-reloads for development: `npm run serve`.