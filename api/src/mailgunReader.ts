// AXIOS dependencies
import axios from "axios";

// Define interfaces for TypeScript
interface MailgunConfig {
    apiKey: string;
    emailDomain: string;
    mailgunApi?: string;
}

interface AuthOption {
    auth: {
        username: string;
        password: string;
    };
}

interface RegionKey {
    region: string;
    key: string;
}

/**
* Simple axios get, with response data
* @param urlWithParams URL with parameters
* @param options Request options
*/
const axiosGet = function(urlWithParams: string, options: any): Promise<any> {
    return new Promise(function(resolve, reject) {
        // console.log(urlWithParams);
        axios.get(urlWithParams, options).then(response => {
            resolve(response.data);
        }).catch(e => {
            // console.log(e);
            reject(e);
        });
    });
};

/**
* Simple MailgunApi accessor class for reading event stream, and saved emails
*
* Example usage
* ```
* let reader = new mailgunReader( { apiKey:"api-*****", emailDomain:"inboxkitten.com" })
*
* // Returns a list of email recieve events
* reader.recipientEventList("some-domain.inboxkitten.com");
*
* // Get and return the email json
* reader.getRecipentEmail("some-email-id");
* ```
*/
class MailgunReader {
    private _config: MailgunConfig;
    private _authOption: AuthOption;

    constructor(config: MailgunConfig) {
        // The config object being used
        this._config = config;

        // Validate the config for required parameters
        if (this._config.apiKey == null || this._config.apiKey.length <= 0) {
            throw new Error("Missing config.apiKey");
        }
        if (this._config.emailDomain == null || this._config.emailDomain.length <= 0) {
            throw new Error("Missing config.emailDomain");
        }

        // Default mailgun domain if not used
        this._config.mailgunApi = this._config.mailgunApi || "https://api.mailgun.net/v3";

        // Setup the authentication option object
        this._authOption = {
            auth: {
                username: "api",
                password: this._config.apiKey
            }
        };
    }

    /**
     * Validate the request email against list of domains
     *
     * @param email Email to validate
     */
    recipientEmailValidation(email: string): boolean {
        // @TODO - the validation
        return true;
    }

    /**
     * Get and return a list of email events
     *
     * See : https://documentation.mailgun.com/en/latest/api-events.html#event-structure
     *
     * @param email Email to get events for
     * @return Promise object, returning list of email events
     */
    recipientEventList(email: string): Promise<any> {
        // Validate email format
        if (!this.recipientEmailValidation(email)) {
            return Promise.reject("Invalid email format : " + email);
        }

        // Compute the listing url
        let urlWithParams = this._config.mailgunApi + "/" + this._config.emailDomain + "/events?recipient=" + email;

        // Lets get and return it with a promise
        return axiosGet(urlWithParams, this._authOption);
    }

    /**
     * Validate the url parameter for a valid mailgun api URL.
     * This is to safeguard the getURL from api key leakage
     *
     * @param url URL to validate
     */
    getUrlValidation(url: string): boolean {
        // @TODO - the validation
        return true;
    }

    /**
     * Get the content of URL and return it, using the mailgun key.
     * This is useful for stored emails returned by the event stream.
     *
     * @param url URL to get content from
     */
    getUrl(url: string): Promise<any> {
        // Validate the URL
        if (!this.getUrlValidation(url)) {
            return Promise.reject("Invalid getUrl request : " + url);
        }

        // Lets get and return it with a promise
        return axiosGet(url, this._authOption);
    }

    /**
     * Get the content of URL and return it, using the mailgun key.
     * This is useful for stored emails returned by the event stream.
     *
     * @param params Region and key parameters
     */
    getKey(params: RegionKey): Promise<any> {
        const { region, key } = params;

        // Inject the region to the mailgunApi
        let apiUrl = this._config.mailgunApi;
        apiUrl = apiUrl.replace("://", "://storage-" + region + ".");
        let urlWithParams = apiUrl + "/domains/" + this._config.emailDomain + "/messages/" + key;
        
        // Lets get and return it with a promise
        return axiosGet(urlWithParams, this._authOption);
    }
}

// Export the mailgunReader class
export = MailgunReader;
