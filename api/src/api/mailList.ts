// Loading mailgun reader and config
import MailgunReader from "../mailgunReader";
import express from "express";
import cacheControl from "../../config/cacheControl";
import mailgunConfig from "../../config/mailgunConfig";
import { validateUsername } from "../utils/emailUtils";

const reader = new MailgunReader(mailgunConfig);

/**
 * Mail listing API, returns the list of emails for a given recipient
 *
 * @param req Express request object containing the recipient parameter
 * @param res Express response object
 */
const mailList = function(req: express.Request, res: express.Response): void {
    let params = req.query;

    // Extract recipient from query parameters
    // recipient may be either the username only (e.g., "john.doe") 
    // or the full email address (e.g., "john.doe@domain.com")
    let recipient = params.recipient as string;

    // Check if recipient parameter exists
    if (!recipient) {
        res.status(400).send({ error: "No valid `recipient` param found" });
        return;
    }

    // Trim leading and trailing whitespace
    recipient = recipient.trim();

    // If recipient includes the domain, extract just the username portion
    let pos = recipient.indexOf("@" + mailgunConfig.emailDomain);
    if (pos >= 0) {
        recipient = recipient.substring(0, pos);
    }

    // Validate the username portion of the email
    try {
        recipient = validateUsername(recipient);
    } catch (e) {
        // Pass the specific error message from the validation function
        res.status(400).send({ error: e.message });
        return;
    }

    // Empty check
    if (!recipient) {
        res.status(400).send({ error: "No valid `recipient` param found" });
        return;
    }

    // Fetch the email list from Mailgun
    reader.recipientEventList(recipient + "@" + mailgunConfig.emailDomain)
        .then(response => {
            // Set cache control headers and return the email list
            res.set('cache-control', cacheControl.dynamic);
            res.status(200).send(response.items);
        })
        .catch(e => {
            console.error(`Error getting list of messages for "${recipient}":`, e);
            res.status(500).send({ error: e.toString() });
        });
};


export default mailList;
