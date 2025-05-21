// Loading mailgun reader and config
import MailgunReader from "../mailgunReader";
import express from "express";
import cacheControl from "../../config/cacheControl";
import mailgunConfig from "../../config/mailgunConfig";

const reader = new MailgunReader(mailgunConfig);

/**
 * Get and return the URL link from the mailgun API - for the mail content
 * 
 * NOTE - this is to be deprecated
 *
 * @param req Express request object
 * @param res Express response object
 */
const mailGetUrl = function(req: express.Request, res: express.Response): void {
    let params = req.query;
    let url = params.url as string;
    if (url == null || url === "") {
        res.status(400).send('{ "error" : "No `url` param found" }');
        return;
    }

    reader.getUrl(url).then(response => {
        res.set('cache-control', cacheControl.static);
        res.status(200).send(response);
    })
    .catch(e => {
        console.error("Error: ", e);
        res.status(500).send(`{"error": "${e}"}`);
    });
};

export default mailGetUrl;
