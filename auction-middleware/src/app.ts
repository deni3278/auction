import "dotenv/config";
import "reflect-metadata";
import {connect} from "mongoose";
import routes from "./routes";

if (process.env.DB && process.env.DB_NAME) {
    // noinspection JSVoidFunctionReturnValueUsed
    connect(process.env.DB, {dbName: process.env.DB_NAME})
        .then(() => {
            console.log("Successfully connected to the database.");

            if (process.env.PORT) {
                routes.listen(process.env.PORT, () => {
                    console.log(`Middleware is listening at http://localhost/${process.env.PORT}.`);
                });
            } else {
                throw new Error("'PORT' environment variable is not set.");
            }
        })
        .catch(err => {
            console.log("Couldn't connect to the database:");
            console.log(err);
        });
} else {
    throw new Error("'DB' or 'DB_NAME' environment variable is not set.");
}



