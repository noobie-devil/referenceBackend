import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import {OAuth2Client} from "google-auth-library";

const GOOGLE_MAILER_CLIENT_ID = process.env['MAILER_CLIENT_ID'];
const GOOGLE_MAILER_CLIENT_SECRET = process.env['MAILER_CLIENT_SECRET'];
const REFRESH_TOKEN = process.env['MAILER_REFRESH_TOKEN'];

let authClient;

const initOAuth2Client = () => {
    const GOOGLE_MAILER_CLIENT_ID = process.env['MAILER_CLIENT_ID'];
    const GOOGLE_MAILER_CLIENT_SECRET = process.env['MAILER_CLIENT_SECRET'];
    const REFRESH_TOKEN = process.env['MAILER_REFRESH_TOKEN'];
    console.log(REFRESH_TOKEN);
    authClient = new OAuth2Client(
        GOOGLE_MAILER_CLIENT_ID,
        GOOGLE_MAILER_CLIENT_SECRET
    );
    authClient.setCredentials({
        refresh_token: REFRESH_TOKEN,
        scope: "https://mail.google.com/"
    });
};

const refreshHandler = async () => {
    try {
        const REFRESH_TOKEN = process.env['MAILER_REFRESH_TOKEN'];
        const tokenResponse = await authClient.refreshToken(REFRESH_TOKEN);
        const accessToken = tokenResponse.tokens.access_token;

        authClient.setCredentials({
            access_token: accessToken,
            refresh_token: REFRESH_TOKEN,
        });

        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        throw error;
    }

}

const getAccessToken = async () => {
    if (!authClient) {
        initOAuth2Client();
    }
    const {credentials} = authClient;

    console.log(authClient);
    if (!authClient.credentials.refresh_token) {
        throw new Error('Missing refresh token. Please provide a callback refresh handler.');
    }
    // try {
        if (!credentials.access_token || credentials.expiry_date < Date.now()) {
            return await refreshHandler();

            // await new Promise((resolve, reject) => {
            //     authClient.refreshAccessToken((err, credentials) => {
            //         if(err) {
            //             reject(err);
            //         } else {
            //             authClient.setCredentials(credentials);
            //             resolve()
            //         }
            //     })
            // })
        } else {
            // Access token còn hiệu lực, trả về access token hiện tại
            return credentials.access_token;
        }
    // } catch (e) {
    //     throw new Error(e);
    // }

}


// const accessTokenObj = await authClient.getAccessToken(async () => {
//     if(!authClient.credentials.refresh_token) {
//         throw new Error('Missing refresh token. Please provide a callback refresh handler.');
//     }
//     if(authClient.credentials.expiry_date < Date.now()) {
//
//         await new Promise((resolve, reject) => {
//             authClient.refreshAccessToken((err, credentials) => {
//                 if(err) {
//                     reject(err);
//                 } else {
//                     authClient.setCredentials(credentials);
//                     resolve()
//                 }
//             })
//         })
//     }
//
//     return authClient.credentials.accessToken;
// });
// const accessToken = await accessTokenObj?.token;
export const sendEmail = asyncHandler(async (data, req, res) => {
    const accessToken = await getAccessToken();

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: process.env['MAILER_ADDRESS'],
            clientId: GOOGLE_MAILER_CLIENT_ID,
            clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            accessToken: accessToken
        },
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
    });

    let info = await transporter.sendMail({
        from: 'Hello',
        to: data?.to,
        subject: data?.subject,
        text: data?.text,
        html: data?.html
    });

    console.log("Message send: %s", info.messageId);
})
