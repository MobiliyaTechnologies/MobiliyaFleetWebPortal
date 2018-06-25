import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-vehicle',
    templateUrl: './edit-vehicle.component.html',
    styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {
    tenantId: any;
    currentUserInfo: any;
    roleIdDriver: any;
    modelUnassignDriver: any = {};
    currentRole: any;
    public loading = false;
    deviceIdList: any = [];
    enableAddVehicle = false;
    enableAddDevice = false;
    enableAddFleet = false;
    enableAddGeoFence = false;
    AssignDriverList: any = [];
    RuleList: any = [];
    deviceDetails: any;
    driverDetails: any;
    selectedvehicle: any = {};
    roles: any = {};
    selectedVehicleToReturn: any = {};
    unAssignDriverObject = { "id": "0", "firstName": "-" };
    //yearList: any = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
    AssignFleetList: any = [];
    yearList: any = [{ "id": "0", "yearOfManufacture": "2020" }, { "id": "1", "yearOfManufacture": "2019" }, { "id": "2", "yearOfManufacture": "2018" }, { "id": "3", "yearOfManufacture": "2017" }, { "id": "4", "yearOfManufacture": "2016" },
    { "id": "5", "yearOfManufacture": "2015" }, { "id": "6", "yearOfManufacture": "2014" }, { "id": "7", "yearOfManufacture": "2013" }, { "id": "8", "yearOfManufacture": "2012" }, { "id": "9", "yearOfManufacture": "2011" },
    { "id": "0", "yearOfManufacture": "2010" }, { "id": "1", "yearOfManufacture": "2009" }, { "id": "2", "yearOfManufacture": "2008" }, { "id": "3", "yearOfManufacture": "2007" }, { "id": "4", "yearOfManufacture": "2006" },
    { "id": "5", "yearOfManufacture": "2005" }, { "id": "6", "yearOfManufacture": "2004" }, { "id": "7", "yearOfManufacture": "2003" }, { "id": "8", "yearOfManufacture": "2002" }, { "id": "9", "yearOfManufacture": "2001" },
    { "id": "0", "yearOfManufacture": "2000" }, { "id": "1", "yearOfManufacture": "1999" }, { "id": "2", "yearOfManufacture": "1998" }, { "id": "3", "yearOfManufacture": "1997" }, { "id": "4", "yearOfManufacture": "1996" }];

    fuelTypeList: any = [{ "id": "0", "fuelType": "Petrol" }, { "id": "1", "fuelType": "Diesel" }];
    vehicleId: any;
    registrationNumber = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    brandName = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    modelName = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    deviceId = new FormControl('', [Validators.required]);
    geoFencing = new FormControl('', [Validators.required]);
    yearOfManufacture = new FormControl('', [Validators.required]);
    fuelType = new FormControl('', [Validators.required]);
    fleetName = new FormControl('', [Validators.required]);
    color = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\s]*$'), Validators.minLength(3), Validators.maxLength(16)]));
    fleetId = new FormControl('', [Validators.required]);
    userId = new FormControl('', [Validators.required]);

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private restService: RestService,
        private route: ActivatedRoute
    ) {

        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.route.params.subscribe(params => {
            this.vehicleId = params['id'];

        });

    }


    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.getRoles();
    }

    /*Function to check validations*/
    checkValidations() {
        return new Promise((resolve, reject) => {
            if (this.registrationNumber.invalid || this.brandName.invalid
                || this.modelName.invalid) {

                if (this.registrationNumber.invalid) {
                    this.registrationNumber.markAsTouched();
                }

                if (this.brandName.invalid) {
                    this.brandName.markAsTouched();
                }

                if (this.modelName.invalid) {
                    this.modelName.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /*Function to get Driver Id*/
    getRoles = function () {
        this.loading = true;
        this.restService.makeCall('Users', 'GET', '/roles', this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.roles = resp.body.data;
                    console.log("this.roles", this.roles);
                    for (var j = 0; j < this.roles.length; j++) {
                        if (this.roles[j].roleName == "driver") {
                            this.roleIdDriver = this.roles[j].id;
                        }
                    }
                    this.getOtherDetails()
                }
            }, error => {
                this.loading = false;
                //this.toastr.error('Error getting list');
            });
    }
    getOtherDetails=function(){
        this.getVehicleDetails(this.vehicleId);
        this.getDeviceList();
        this.getFleetList();
        this.getRulesList();
    }
    /*Function to get Vehicle Details of the vehicle to be edited using vehicle Id*/
    getVehicleDetails = function (vehicleId) {
        this.loading = true;
        this.model = {};
        var URL = '/' + this.tenantId + '/vehicles/' + vehicleId;
        this.restService.makeCall('fleets', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedvehicle = resp.body.data;
                    this.selectedVehicleToReturn.id = this.selectedvehicle.id;
                    this.selectedVehicleToReturn.brandName = this.selectedvehicle.brandName;
                    this.selectedVehicleToReturn.model = this.selectedvehicle.model;
                    if (this.selectedvehicle.color != null) {
                        this.selectedVehicleToReturn.color = this.selectedvehicle.color;
                    }

                    if (this.selectedvehicle.yearOfManufacture != null) {
                        this.selectedVehicleToReturn.yearOfManufacture = this.selectedvehicle.yearOfManufacture;
                    }

                    this.selectedVehicleToReturn.fuelType = this.selectedvehicle.fuelType;
                    this.selectedVehicleToReturn.registrationNumber = this.selectedvehicle.registrationNumber;
                    if (this.selectedvehicle.deviceId != null) {
                        this.selectedVehicleToReturn.deviceId = this.selectedvehicle.deviceId;
                        this.getDeviceDetails(this.selectedvehicle.deviceId);
                    }

                    if (this.selectedvehicle.fleetId != null) {
                        this.selectedVehicleToReturn.fleetId = this.selectedvehicle.fleetId;
                        this.getUserList(this.selectedVehicleToReturn.fleetId);
                    }

                    if (this.selectedvehicle.userId != null) {
                        this.selectedVehicleToReturn.userId = this.selectedvehicle.userId;
                        this.getDriverDetails(this.selectedvehicle.userId);
                    }

                    this.selectedVehicleToReturn.geoFencing = this.selectedvehicle.geoFencing;
                } else {

                    this.loading = true;
                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error getting vehicle information');

            })


    }

    /*Function to save Vehicle Details after editing*/
    saveVehicleDetails = function () {
        this.loading = true;
        this.selectedVehicleToReturn.registrationNumber = this.selectedVehicleToReturn.registrationNumber.replace(/[^A-Z0-9]/ig, "");
        // //Check if driver is same then delete remove flag and userId else set remove flag to true 
        // if (this.selectedvehicle.userId == this.selectedVehicleToReturn.userId) {
        //     delete this.selectedVehicleToReturn.userId;
        //     delete this.selectedVehicleToReturn.isRemoveDriver;
        // }
        // else{
        //     this.selectedVehicleToReturn.isRemoveDriver=true;
        // }
        // //Check if device is same then delete remove flag and deviceId else set remove flag to true
        // if(this.selectedvehicle.deviceId==this.selectedVehicleToReturn.deviceId){
        //     delete this.selectedVehicleToReturn.deviceId;
        //     delete this.selectedVehicleToReturn.isRemoveDevice;
        // }
        // else{
        //     this.selectedVehicleToReturn.isRemoveDevice=true;
        // }
        if (this.selectedVehicleToReturn.userId == "0") {
            this.selectedVehicleToReturn.isRemoveDriver=true;
            delete this.selectedVehicleToReturn.userId;
        }
        else{
            delete this.selectedVehicleToReturn.isRemoveDriver;
        }
        delete this.selectedVehicleToReturn.isRemoveDevice;
        //User/Driver remained same
        this.checkValidations()
            .then(() => {
                this.restService.makeCall('fleets', 'PUT', '/' + this.tenantId + '/vehicles/' + this.vehicleId, this.selectedVehicleToReturn)
                .subscribe(resp => {
                    if (resp.body && resp.body.data) {
                        this.loading = false;
                        this.toastr.success('Vehicle Information updated successfully.');
                        this.router.navigate(['dashboard/vehicle']);
                    }
                    else if(resp && (resp.length==0)){
                        this.loading = false;
                    }
                }, error => {
                    this.loading = false;
                });
            }).catch(() => {
                this.loading = false;
                //this.toastr.error('Mandatory fields are not filled', 'Validation Error');
            });
    }

    /*Function to get appropriate error message if a particular validation fails*/
    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'registrationnumber') {
            if (this.registrationNumber.hasError('required'))
                return 'You must enter a valid Registration Number';
            if (this.registrationNumber.hasError('minlength'))
                return 'Registration Number should be at least 4 characters';
            if (this.registrationNumber.hasError('pattern'))
                return 'Registration Number should contain only alphabets, numbers and spaces'
            if (this.registrationNumber.hasError('maxlength'))
                return 'Registration Number should be at most 16 characters';
        }

        if (field.toLowerCase() === 'brandname') {
            if (this.brandName.hasError('required'))
                return 'You must enter a valid brand Name';
            if (this.brandName.hasError('minlength'))
                return 'Brand Name should be at least 4 characters';
            if (this.brandName.hasError('pattern'))
                return 'Brand Name should contain only alphabets, numbers and spaces'
            if (this.brandName.hasError('maxlength'))
                return 'Brand Name should be at most 16 characters';
        }

        if (field.toLowerCase() === 'modelname') {
            if (this.modelName.hasError('required'))
                return 'You must enter a valid Model Name';
            if (this.modelName.hasError('minlength'))
                return 'Model Name should be at least 4 characters';
            if (this.modelName.hasError('pattern'))
                return 'Model Name should contain only alphabets, numbers and spaces'
            if (this.modelName.hasError('maxlength'))
                return 'Model Name should be at most 16 characters';
        }

        if (field.toLowerCase() === 'yearofmanufacture') {
            if (this.yearOfManufacture.hasError('required'))
                return 'You must select a year';
        }

        if (field.toLowerCase() === 'fueltype') {
            if (this.fuelType.hasError('required'))
                return 'You must select fuel type';
        }

        if (field.toLowerCase() === 'color') {
            //if (this.color.hasError('required'))
            //    return 'You must enter a valid color';
            if (this.color.hasError('minlength'))
                return 'Color should be at least 3 characters';
            if (this.color.hasError('pattern'))
                return 'Color should contain only alphabets and spaces'
            if (this.color.hasError('maxlength'))
                return 'Color should be at most 16 characters';
        }

    }

    /*Function to get list of fleets*/
    getFleetList = function () {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.model = {};
        this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/fleets', this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.AssignFleetList = resp.body.data;
                    if (this.AssignFleetList.length != 0) {
                        this.enableAddFleet = true;
                    }
                    else {
                        this.toastr.error('No Fleet Available');
                    }
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to get list of unassigned drivers*/
    getUserList = function (fleetId) {
        this.loading = true;
        this.model = {};
        this.restService.makeCall('Users', 'GET', '/users?isDriverAssign=0&&roleId=' + this.roleIdDriver + '&&fleetId=' + fleetId, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.AssignDriverList = resp.body.data;
                    if (this.AssignDriverList.length != 0) {
                        this.enableAddVehicle = true;
                        this.AssignDriverList.unshift(this.unAssignDriverObject);
                    }
                    else {
                        this.toastr.error('No Unassigned Driver Available');
                    }
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to get list of Rules of the type Location*/
    getRulesList = function () {
        this.loading = true;
        this.model = {};
        var URL = '/' + this.tenantId + '/rules?ruleType=Location';
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.RuleList = resp.body.data;
                    if (this.RuleList.length != 0) {
                        this.enableAddGeoFence = true;
                    }
                    else {
                        this.toastr.error('No GeoFence Rule Available');
                    }

                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to cancel Edit Vehicle function*/
    cancelEdit = function () {
        this.router.navigate(['/dashboard/vehicle']);
    }

    /*Function to get list of unassigned Devices*/
    getDeviceList = function () {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.model = {};
        this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/devices?isDeviceAssign=0', this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.deviceIdList = resp.body.data;
                    if (this.deviceIdList.length != 0) {
                        this.enableAddDevice = true;
                    }
                    else {
                        this.toastr.error('No Dongles Available');
                    }

                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to get details of allocated Device and add to the unassigned devices*/
    getDeviceDetails = function (deviceId) {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.model = {};
        this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/devices/' + deviceId, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.deviceDetails = resp.body.data;
                    this.deviceIdList.push(this.deviceDetails);
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to get details of allocated driver and add to the unassigned drivers*/
    getDriverDetails = function (userId) {
        this.loading = true;
        this.model = {};
        if (userId) {
            this.restService.makeCall('Users', 'GET', '/users/' + userId, this.model)
                .subscribe(resp => {
                    if (resp && resp.body) {
                        this.loading = false;
                        this.driverDetails = resp.body.data;
                        console.log("this.driverDetails", this.driverDetails);
                        this.AssignDriverList.push(this.driverDetails);
                    }
                    else {
                        this.loading = false;
                    }

                }, error => {
                    this.loading = false;
                });
        }

    }

    /*Function to change the list of drivers as per fleet selected*/
    onFleetChange = function (fleetId) {
        this.selectedVehicleToReturn.fleetId = fleetId;
        this.getUserList(this.selectedVehicleToReturn.fleetId);
    }

}
