//https://rggb625ecnpsneg42m62hki3wq0lsmlh.lambda-url.us-east-1.on.aws/

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const globals = {
    SERVICEACCOUNTAUTH: new JWT({
        email:  'javascript-writer@groupsproject-370909.iam.gserviceaccount.com',
        key:    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtAUZp72L3zq+6\nGdBUrgGqs7kbUtWx0mKHfdMiliRsLe6wj0UYdhSqU/Nd505ic0EGRwrhxL3rq4FV\nIQI5creAGfNWzOZKtAPMV4YoSqN8HgfvF/DrLgGAwScn56dVituCOxv4j9pXQIIo\nMiIm9O13mWlEBEFjw+jXP/Z+6M7Rgk25lDZR0/1A/KX5eG/XJ0fmcC+TSM0NpS6V\nKrbqHweFfgLDTbUqsf8TUOqLFJ0Qaj7VBuGjd9yp9+icZ68giksMuyFdqlo4MKD6\ns2WW3YR2NeSbQ/+D+6IGWyts+9NA9OVDazaT1nJ6+KYO+Oq6c1l8lxS9ur01JrSU\nPIP1PLTjAgMBAAECggEAOG8MCw5dmDxBslEtVhIU1RwfK7yPnJvmLBBtSQD1DJzH\nGa0CewI5p34PCvii5xZ1hZizAgZtdWzSmXRVB2xWU2EjsZLRJFkoTAXY61e9kIUz\nTVjf67dsIhXfsfKs8QiEpiyl6STzsjaGvpnr7g1DURon7ln9ApAraduhirBilpCD\ne6HpFv81gRT+2ujzFvWWW4NE0E2uy8LxnOxSyFGOpK4PUWPpoJuLf52MCwOae+oB\nRXKpxjMjM9kBJ4Rex9ugR6ETwkf1JDQfa/uM/cOlEQjqS9rp20jbZCWPtYfSpLt0\n+nr+TfM+nGYYu0zWRLH6mTHVnHGItFcjUAQTIZdk0QKBgQDWYglr4IIAZh6BYe/z\nbXI+mQN9UbkTzQ691abyjY5pUEu0lKd/HrYwS0Phzj+5lhaUtrEvbN0HclaTCEd7\n10v0m30jiwJPQDmu9RXj6Tl3qKb2rxnHLviX9ypJ7mkDHO7KTRDahVvm6jZmcHnR\nzNA/9mYLpiVNpGQakoyVVX3vrQKBgQDOluu1C2j5PCuGkmkEEOSb4uZt9MvTGdDi\ns/7fcPEyPS/1Vbh/IrKwBBSnfpcUfCpD1dC8YbQhjsHewdPqnpiOHFj9hOsoQeH4\nRYaZTRFAW95a6LnBRmTXqCWyru8Q2Llr3Zz0agtc/L1+LvF2jcltjNgsAfed0Gu3\nNiswM+SIzwKBgEH4QxvuJzMGOabow1TuPfSjU16R8lj0he/GuivzgXpI2jMEd5J3\nmeq8jnQC6rsqQ2KZ4WZNoqpy9c8jAhRKyTXJTzXLxfcrNVTwWD8c+rEmtdI9Sbpw\natEgnuPHOItbsOOR2XjVBtXFBt55CBOWahL0uKwnAV2mE6PVqusdNra1AoGARbJI\n5xVoXt1b2dS/NS310lmkX+g8c4W8IR+UlxFlbguSiHRZABtWqWdXCIL+uVyCbcxO\n1Z8oxEGDSoGd2wOSeC88HpufMj+32qiqFkIX1dyokYb+VCRJlTAXN8coxEg5lhh4\nAUVdfAuQamev8s027YycyYwIW+eaz36o52Q6b6UCgYAUs79KmYnzSWBI4NGueCGB\n6isZWyB/CXm7FO19YNLeUZSaeCtV6MpE3bnuu/lD0RTZeh3kO9iCU/hSBe2NLywt\nR5sECyYkR5WA4on/XUk5dlPu1XGtrdH9EBg6idDTdbSoE5r1PAQ3uztYAVecztOW\nEovCHd0/5Gw1Cw5aanfUqw==\n-----END PRIVATE KEY-----\n',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    }),
    ROWOFFSET: 1,

};

////////////////////////////////////////////////////////////////

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

    try {
        rows[rowIndex].set('AP Contact Number', (`'+${phoneNumber.replace('+','')}`));
        rows[rowIndex].set('Crawled', true);
        rows[rowIndex].set('Message Parsed', message);
        await rows[rowIndex].save();
    } catch (error) {
        console.error(`ERROR: ${error.toString()}`);
    }

    response = await assembleResponse(200,`Message written in row ${rowIndex}`); //if it's not a POST 
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
//                     '    "phone_number": "+12290000000"\r\n' +
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



