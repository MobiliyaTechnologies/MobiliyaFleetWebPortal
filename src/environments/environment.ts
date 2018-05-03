export const environment = {
    production: true,

    SERVICE_URL: {
        USER: 'https://identity-service.azurewebsites.net',
        FLEET: 'https://fleet-service.azurewebsites.net',
        TRIP: 'https://trip-service.azurewebsites.net'
    },

    API_ENDPOINT: {
        login: '/login',
        users: '/users/',
        company: '/companies/',
        roles: '/roles/',
        rights: '/rights/',
        logout: '/logout/',
        forgotPassword: '/forgot-password',
        changePassword: 'change-password',
        resetPassword: '/reset-password',
        devices: '/devices/',
        vehicles: '/vehicles/',
        drivers: '/driver/',
        deviceType: '/device-type/',
        deviceUpgrade: '/upgrade/',
        mileageReport: '/vehicleHistory/'
    },
    REPORTS_ENDPOINTS: {

        reportInitialURL: 'https://app.powerbi.com/reportEmbed?reportId=',
        reportQueryParams : '&navContentPaneEnabled=false&filterPaneEnabled=false',
        
        //Prod
       reportIds: {
        mileageReportUrl:'58629aa5-2af4-46af-b8d9-49ae9a05d035',
        speedReportUrl:'80a8d526-01a6-470c-a1bb-0620d7d4724a',
        mileage:  '7e7dcdf9-e84a-4d52-a427-e1ea0a15aa90'
       }

    }
};
