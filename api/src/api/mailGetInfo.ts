// Loading mailgun reader and config
import MailgunReader from "../mailgunReader";
import express from "express";
import cacheControl from "../../config/cacheControl";
import mailgunConfig from "../../config/mailgunConfig";

const reader = new MailgunReader(mailgunConfig);

interface EmailDetails {
    name: string;
    emailAddress?: string;
    subject: string;
    recipients: string[];
}

/**
 * Get and return the static email header details from the mailgun API given the mailKey
 *
 * @param req Express request object
 * @param res Express response object
 */
const mailGetInfo = function(req: express.Request, res: express.Response): void {
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
        let emailDetails: EmailDetails = {
            name: "",
            subject: "",
            recipients: []
        };

        // Format and extract the name of the user
        let [name, ...rest] = formatName(response.from);
        emailDetails.name = name;

        // Extract the rest of the email domain after splitting
        if (rest[0].length > 0) {
            emailDetails.emailAddress = ' <' + rest;
        }

        // Extract the subject of the response
        emailDetails.subject = response.subject;

        // Extract the recipients
        emailDetails.recipients = response.recipients;

        // Return with cache control
        res.set('cache-control', cacheControl.static);
        res.status(200).send(emailDetails);
    })
    .catch(e => {
        console.error(`Error getting mail metadata info for /${region}/${key}: `, e);
        res.status(500).send(`{"error": "${e}"}`);
    });
};

function formatName(sender: string): [string, string] {
    let [name, ...rest] = sender.split(' <');
    return [name, rest.join(' <')];
}

export default mailGetInfo;
