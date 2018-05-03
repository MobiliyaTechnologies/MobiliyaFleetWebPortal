# FleetManagement
Fleet Management portal is implemented using angular 5 and angular-cli version 1.6 or later. 
Fleet management provides a open source platform to manage fleets. There are four users in system including superadmin, tenant admin, fleet admin and driver. Tenant admin can manage his/her fleets, vehicles and users. He is also able to monitor vehicle parameters and associated reports.

## Getting Started

### Prerequisites
1. You need to have [Node.js](https://nodejs.org) installed.
2. Install [Git](http://www.git-scm.com/downloads).
3. [optional]You need to have [Microsoft Azure](http://portal.azure.com) subscription, if you want to host application on azure.

### Installation
### Clone the repo
1. Take clone of this repository.

### Install npm packages

Install the `npm` packages described in the `package.json`:

```shell
npm install
```

Then you can run the application using below command in terminal/shell.
```shell
ng serve 
```
Application default runs on 4200 port. Open https://localhost:4200 in browser.

## Deployment
Follow below steps for Deployment on [Microsoft Azure](http://portal.azure.com):
1. Create azure webapp using azure portal. For details click [here](https://docs.microsoft.com/en-us/azure/app-service/environment/app-service-web-how-to-create-a-web-app-in-an-ase)
2. Setup deployment option as local git on azure. For details, you can follow [simple](http://www.almguide.com/2014/01/deploying-an-azure-website-from-a-local-git-repo/) option or you can follow official documentation [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-local-git).
3. Clone the git repository from azure portal.
4. Build your code using below command which generates Dist folder. 
    
```shell
ng build 
```
5. Copy content of Dist folder in newly cloned directory. And commit and push your changes on remote branch. Whoaa!! your application is deployed on azure.
