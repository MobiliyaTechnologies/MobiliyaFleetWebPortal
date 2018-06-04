'use strict';
var http = require('http');

// Creating a little node server
http.createServer(function (req, res) {
    var config =  {
        "production": true,
    
        "SERVICE_URL": {
            "USER": "https://"+process.env.CUSTOMCONNSTR_identity,
            "FLEET": "https://"+process.env.CUSTOMCONNSTR_fleet,
            "TRIP": "https://"+process.env.CUSTOMCONNSTR_trip
        },
    
        "API_ENDPOINT": {
            "login": "/login",
            "users": "/users/",
            "company": "/companies/",
            "roles": "/roles/",
            "rights": "/rights/",
            "logout": "/logout/",
            "forgotPassword": "/forgot-password",
            "changePassword": "change-password",
            "resetPassword": "/reset-password",
            "devices": "/devices/",
            "vehicles": "/vehicles/",
            "drivers": "/driver/",
            "deviceType": "/device-type/",
            "deviceUpgrade": "/upgrade/",
            "mileageReport": "/vehicleHistory/"
        },
        "REPORTS_ENDPOINTS": {
    
            "reportInitialURL": "https://app.powerbi.com/reportEmbed?reportId=",
            "reportQueryParams" : "&navContentPaneEnabled=false&filterPaneEnabled=false",
            "reportIds": {
            "mileageReportUrl":"58629aa5-2af4-46af-b8d9-49ae9a05d035",
            "speedReportUrl":"80a8d526-01a6-470c-a1bb-0620d7d4724a",
            "mileage":  "7e7dcdf9-e84a-4d52-a427-e1ea0a15aa90"
           }
    
        }
    }


    try {

        const headers = {
            'Content-Type': 'application/json',

        };
		res.writeHead(200, headers);
        res.end(JSON.stringify(config));

        // http.get(process.env.CUSTOMCONNSTR_resturl + '/api/GetAzureADConfiguration', (resp) => {
        //     let data = '';

        //     // A chunk of data has been recieved.
        //     resp.on('data', (chunk) => {
        //         data += chunk;
        //     });

        //     // The whole response has been received. Print out the result.
        //     resp.on('end', () => {
        //         console.log(JSON.parse(data));
        //         config.config.clientId=JSON.parse(data).ApplicationId;
        //         config.config.tenant=JSON.parse(data).ActiveDirectoryTenant;
        //         res.writeHead(200, headers);
        //         res.end(JSON.stringify(config));
        //     });

        // }).on("error", (err) => {
        //     console.log("Error: " + err.message);
        // });

    } catch (err) {
        res.writeHead(500);
        res.end(err.toString());
    }
}).listen(process.env.PORT);