// Dependencies loading
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// Note: mailgunConfig is not used in this file, so we can remove it

// Extend Express interface to include express property
declare global {
    namespace Express {
        interface Application {
            express: typeof express;
        }
    }
}

// Initializing the express app
const app = express();

// Allow cross site requests (for now)
app.use(cors());

// Setup JSON encoding
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add an easy way to get the express module
app.express = express;

// Export the app module, for actual server deployment (on X)
export = app;
