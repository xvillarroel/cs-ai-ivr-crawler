//https://rggb625ecnpsneg42m62hki3wq0lsmlh.lambda-url.us-east-1.on.aws/

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import axios from 'axios';

const globals = {
    SERVICEACCOUNTAUTH: new JWT({
        email:  'javascript-writer@groupsproject-370909.iam.gserviceaccount.com',
        key:    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtAUZp72L3zq+6\nGdBUrgGqs7kbUtWx0mKHfdMiliRsLe6wj0UYdhSqU/Nd505ic0EGRwrhxL3rq4FV\nIQI5creAGfNWzOZKtAPMV4YoSqN8HgfvF/DrLgGAwScn56dVituCOxv4j9pXQIIo\nMiIm9O13mWlEBEFjw+jXP/Z+6M7Rgk25lDZR0/1A/KX5eG/XJ0fmcC+TSM0NpS6V\nKrbqHweFfgLDTbUqsf8TUOqLFJ0Qaj7VBuGjd9yp9+icZ68giksMuyFdqlo4MKD6\ns2WW3YR2NeSbQ/+D+6IGWyts+9NA9OVDazaT1nJ6+KYO+Oq6c1l8lxS9ur01JrSU\nPIP1PLTjAgMBAAECggEAOG8MCw5dmDxBslEtVhIU1RwfK7yPnJvmLBBtSQD1DJzH\nGa0CewI5p34PCvii5xZ1hZizAgZtdWzSmXRVB2xWU2EjsZLRJFkoTAXY61e9kIUz\nTVjf67dsIhXfsfKs8QiEpiyl6STzsjaGvpnr7g1DURon7ln9ApAraduhirBilpCD\ne6HpFv81gRT+2ujzFvWWW4NE0E2uy8LxnOxSyFGOpK4PUWPpoJuLf52MCwOae+oB\nRXKpxjMjM9kBJ4Rex9ugR6ETwkf1JDQfa/uM/cOlEQjqS9rp20jbZCWPtYfSpLt0\n+nr+TfM+nGYYu0zWRLH6mTHVnHGItFcjUAQTIZdk0QKBgQDWYglr4IIAZh6BYe/z\nbXI+mQN9UbkTzQ691abyjY5pUEu0lKd/HrYwS0Phzj+5lhaUtrEvbN0HclaTCEd7\n10v0m30jiwJPQDmu9RXj6Tl3qKb2rxnHLviX9ypJ7mkDHO7KTRDahVvm6jZmcHnR\nzNA/9mYLpiVNpGQakoyVVX3vrQKBgQDOluu1C2j5PCuGkmkEEOSb4uZt9MvTGdDi\ns/7fcPEyPS/1Vbh/IrKwBBSnfpcUfCpD1dC8YbQhjsHewdPqnpiOHFj9hOsoQeH4\nRYaZTRFAW95a6LnBRmTXqCWyru8Q2Llr3Zz0agtc/L1+LvF2jcltjNgsAfed0Gu3\nNiswM+SIzwKBgEH4QxvuJzMGOabow1TuPfSjU16R8lj0he/GuivzgXpI2jMEd5J3\nmeq8jnQC6rsqQ2KZ4WZNoqpy9c8jAhRKyTXJTzXLxfcrNVTwWD8c+rEmtdI9Sbpw\natEgnuPHOItbsOOR2XjVBtXFBt55CBOWahL0uKwnAV2mE6PVqusdNra1AoGARbJI\n5xVoXt1b2dS/NS310lmkX+g8c4W8IR+UlxFlbguSiHRZABtWqWdXCIL+uVyCbcxO\n1Z8oxEGDSoGd2wOSeC88HpufMj+32qiqFkIX1dyokYb+VCRJlTAXN8coxEg5lhh4\nAUVdfAuQamev8s027YycyYwIW+eaz36o52Q6b6UCgYAUs79KmYnzSWBI4NGueCGB\n6isZWyB/CXm7FO19YNLeUZSaeCtV6MpE3bnuu/lD0RTZeh3kO9iCU/hSBe2NLywt\nR5sECyYkR5WA4on/XUk5dlPu1XGtrdH9EBg6idDTdbSoE5r1PAQ3uztYAVecztOW\nEovCHd0/5Gw1Cw5aanfUqw==\n-----END PRIVATE KEY-----\n',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    }),
    ROWOFFSET: 1,
    GPT_URL: 'https://api.openai.com/v1',
    GPT_MODEL: `gpt-4-0125-preview`, //https://platform.openai.com/docs/models/continuous-model-upgrades

};

////////////////////////////////////////////////////////////////

const makeCall = async (url, headers = {}, responseType = 'json', method = 'GET', payload = null, timeout = 30000, includeHeaders = false) => {
    const response = await axios({
            url: url,
            method: method,
            headers: headers,
            data: payload,
            responseType: responseType,
            timeout: timeout,
        }).catch(err => {
            return {
                data: {
                    error: err.message,
                    status: err.status,
                    request: {
                        action: `${method} ${url}`,
                        headers: headers,
                        body: payload
                    },
                    response: err?.response?.data,
                }
            }
        });

    return includeHeaders 
        ? {
            headers: response.headers,
            body   : response.data
        }
        : response.data;
};

const assembleResponse = async (status, message) => {
    let object = {
        statusCode: status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: message
    }
    return object;
};

function getRowIndex(matrix, phone) {
    if (phone.indexOf('+') === -1) {
      phone = '+' + phone;
    }
    return matrix.findIndex(row => row[3].replace(/ /g,'') === phone);
}

const convertToMatrix = (row) => {
    return row.map(
        index => { let array = Object.values(index)[2]
            return array; 
        }  
    );
};

const getCategoryAI = async (message) => {

    let response;
    let prompt = `
    [ROLE]
    You are an accounts payable agent who is calling a phone number that was given to you. 
    
    [TASK]
    When calling, you got the following response:
    MESSAGE: "Crawling  14154170824 (CAb9d877483d0489bfb7837679150d85b5). Please wait..."
    
    Now, you have to decide if this is an IVR message, a Human message or the call just Failed. 
    A- If it's an IVR, then you have to decide what kind of IVR it is. 
        1. If it has a message that tells you to wait so they can transfer the call or communicate with you with a human, then respond (IVR) Just wait.
        2. If it has a message that tells you "Please leave a message after the tone" (or something similar), then respond (IVR) Just wait.
        3. If it is one of those IVRs that has menus like "press 1 for X and press 2 for Y", then respond (IVR) Press buttons. 
        4. If you can categorize the message in two of the categories, choose the upper one. For example, if the message contains  "press 1 for X and press 2 for Y", but in the end, it says "if you want to talk to an operator, please wait", then you must respond with option 1 "(IVR) Just wait.".
    
    B- If it is not an IVR, it is because it is a Human. In such a case, respond with (PASS) Human.
    
    C- If the call Failed, you must categorize what type of failure based on the message. We have three categories:
        1. If you hear a message that says something like "This call cannot be completed as you dialed it" or something similar, then respond with "(FAIL) Cannot be completed".
        2. If the message is either blank or says something like "call disconnected", or the message looks like "Crawling <a bunch of numbers>. Please wait...", then it is a "(FAIL) No one answers".

    D- If you cannot categorize the message into the categories that I explained, just respond "Other". 
    
    [FORMAT]
    You can only respond with one of the following phrases: 
    
    - (PASS) Human
    - (IVR) Just wait
    - (IVR) Leave a message
    - (IVR) Press buttons
    - (FAIL) Cannot be completed
    - (FAIL) No one answers
    - Other
    `;

    let body = {
                "model": globals.GPT_MODEL,
                "messages": [{
                    "role": "system",
                    "content": prompt
                }],
                "temperature": 0.1,
                "max_tokens": 500,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
                };

    try {
        response = await makeCall(
            `${globals.GPT_URL}/chat/completions`,
            {
                'Authorization': process.env.GPT_KEY,
                'Content-Type': 'application/json'
            },
            'json',
            'POST',
            body,
            60000
        );
    } catch (error) {
        console.log(error.message);
    }

    console.log(JSON.stringify(response));
    return response.choices[0].message.content;

};

export const handler = async (event, context) => {

    console.log (`****************\n Starting Function - V1 (PROD VERSION) \n****************`)
    let response; 

    let body = JSON.parse(event.body);

        if (event.requestContext && event.requestContext.http.method !== 'POST') {
            response = await assembleResponse(400,'Method is not allowed - Only accepts POST'); //if it's not a POST 
            console.log(JSON.stringify(response),null,2);
            return response;
        } 

        if (!body.phone_number) {

            response = await assembleResponse(400,`Variable 'phone_number' is missing. `); //if it's not a POST 
            console.log(JSON.stringify(response),null,2);
            return response;

        } 

    let sheetid = body.sheetid;
    let tabName = (!body.tab) ? "Raw" : body.tab; //get the the DD/MM/YYYY
    let message = body.message;
    let phoneNumber = body.phone_number;

    const doc = new GoogleSpreadsheet(sheetid, globals.SERVICEACCOUNTAUTH);
    await doc.loadInfo();
    console.log(`Title of the doc: ${doc.title}`);

    let activeSheet = doc.sheetsByTitle[tabName];

        if (!activeSheet){
            response = await assembleResponse(400,`The tab ${tabName} cannot be found.`); 
            console.log(JSON.stringify(response),null,2);
            return response;
        }

    await activeSheet.loadCells('A1:Z');
    let rows = await activeSheet.getRows();
    let rawMatrix = convertToMatrix(rows); 
    let rowIndex = getRowIndex(rawMatrix, phoneNumber)

        if (!rowIndex){
            response = await assembleResponse(400,`The number ${phoneNumber} cannot be found in the "${tabName}" sheet.`); 
            console.log(JSON.stringify(response),null,2);
            return response;
        }

    let category = await getCategoryAI(message);

    try {
        rows[rowIndex].set('AP Contact Number', (`'+${phoneNumber.replace('+','')}`));
        rows[rowIndex].set('Crawled', true);
        rows[rowIndex].set('Message Parsed', message);
        rows[rowIndex].set('Category', category);
        await rows[rowIndex].save();
    } catch (error) {
        console.error(`ERROR: ${error.toString()}`);
    }

    let relativeIndex = rowIndex + 2;

    response = await assembleResponse(200,`Message written in row ${relativeIndex}`); //if it's not a POST 
    console.log(JSON.stringify(response, null, 2))
    return response;

};

// (async () => {
//     await handler({
//                     version: '2.0',
//                     routeKey: '$default',
//                     rawPath: '/',
//                     rawQueryString: '',
//                     headers: {
//                     'content-length': '107',
//                     'x-amzn-tls-version': 'TLSv1.2',
//                     'x-forwarded-proto': 'https',
//                     'postman-token': 'cd2f5956-44b3-4298-88e9-d10dfba4bc74',
//                     'x-forwarded-port': '443',
//                     'x-forwarded-for': '181.43.127.230',
//                     accept: '*/*',
//                     'x-amzn-tls-cipher-suite': 'ECDHE-RSA-AES128-GCM-SHA256',
//                     'x-amzn-trace-id': 'Root=1-65a09bf8-79d301b26d42233e44bb8237',
//                     host: 'ytzivrzj76ejwc2vdbnzwladdm0nvubi.lambda-url.us-east-1.on.aws',
//                     'content-type': 'application/json',
//                     'accept-encoding': 'gzip, deflate, br',
//                     'user-agent': 'PostmanRuntime/7.36.0'
//                     },
//                     requestContext: {
//                     accountId: 'anonymous',
//                     apiId: 'ytzivrzj76ejwc2vdbnzwladdm0nvubi',
//                     domainName: 'ytzivrzj76ejwc2vdbnzwladdm0nvubi.lambda-url.us-east-1.on.aws',
//                     domainPrefix: 'ytzivrzj76ejwc2vdbnzwladdm0nvubi',
//                     http: {
//                         method: 'POST',
//                         path: '/',
//                         protocol: 'HTTP/1.1',
//                         sourceIp: '181.43.127.230',
//                         userAgent: 'PostmanRuntime/7.36.0'
//                     },
//                     requestId: '9c8c29ec-37aa-4d1e-bc32-fcd3abf82fdf',
//                     routeKey: '$default',
//                     stage: '$default',
//                     time: '12/Jan/2024:01:55:04 +0000',
//                     timeEpoch: 1705024504027
//                     },
//                     body: '{\r\n' +
//                     '    "sheetid": "13rBFlGSpmXah2pzvUjYDm6xsv5tDhGFBu1q2ImvQQVk",\r\n' +
//                     '    "message": "We are sorry, your call cannot be completed as dialed. Please try again. ",\r\n' +
//                     '    "phone_number": "+14078363111"\r\n' +
//                     '}',
//                     isBase64Encoded: false
//                     })
// })() 




// {
//     "sheetid": "",
//     "tab": "01/11/2024",
//     "message": "This is a test"
// }

//https://ytzivrzj76ejwc2vdbnzwladdm0nvubi.lambda-url.us-east-1.on.aws/



