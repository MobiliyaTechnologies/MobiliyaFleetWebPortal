export const environment = {
    production: true,


    SERVICE_URL: {
          // ----------- Prod ----------------
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
        sim: '/sim/',
        drivers: '/driver/',
        deviceType: '/device-type/',
        deviceUpgrade: '/upgrade/',
        mileageReport: '/vehicleHistory/'
    },


};
