// Loading mailgun reader and config
import MailgunReader from "../mailgunReader";
import express from "express";
import cacheControl from "../../config/cacheControl";
import mailgunConfig from "../../config/mailgunConfig";

const reader = new MailgunReader(mailgunConfig);

/**
 * Get and return the static email HTML content from the mailgun API, given the mailKey
 *
 * @param req Express request object
 * @param res Express response object
 */
const mailGetHtml = function(req: express.Request, res: express.Response): void {
    let region = req.query.region as string;
    let key = req.query.key as string;
    
    if (region == null || region === "") {
        res.status(400).send('{ "error" : "No `region` param found" }');
        return;
    }

    if (key == null || key === "") {
        res.status(400).send('{ "error" : "No `key` param found" }');
        return;
    }

    reader.getKey({region, key}).then(response => {
        let body = response["body-html"] || response["body-plain"];
        if (body === undefined || body == null) {
            body = 'The kittens found no messages :(';
        }

        // Add JS injection to force all links to open as a new tab
        // instead of opening inside the iframe
        body += '<script>' +
            'let linkArray = document.getElementsByTagName("a");' +
            'for (let i=0; i<linkArray.length; ++i) { linkArray[i].target="_blank"; }' +
            // eslint-disable-next-line
            '<\/script>';

        res.set('cache-control', cacheControl.static);
        res.status(200).send(body);
    })
    .catch(e => {
        console.error(`Error getting mail HTML for /${region}/${key}: `, e);
        res.status(500).send(`{"error": "${e}"}`);
    });
};

export default mailGetHtml;
