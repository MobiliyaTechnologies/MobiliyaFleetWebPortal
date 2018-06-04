import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { concat } from 'rxjs/operator/concat';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
    currentRole: any;
    model: any;
    roleIdDriver: any;
    tenantId: any;
    enableAddVehicle = false;
    enableAddFleet = false;
    enableAddDevice = false;
    enableAddGeoFence = false;
    currentUserInfo: any = {};
    addVehicleModel: any = {};
    yearList: any = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011,2010, 2009, 2008,2007,2006,2005,2004,2003,2002, 2001,2000, 1999, 1998,1997,1996];
    fuelTypeList: any = [{ "id": "0", "fuelType": "Petrol" }, { "id": "1", "fuelType": "Diesel" }];
    deviceIdList: any = {};
    AssignFleetList: any = {};
    AssignDriverList: any = {};
    roles: any = {};
    RuleList: any = {};
    registrationNumber = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    brandName = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    modelName = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    color = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(3), Validators.maxLength(16)]));
    deviceId = new FormControl('', [Validators.required]);
    geoFencing = new FormControl('', [Validators.required]);
    fleetName = new FormControl('', [Validators.required]);
    driverName = new FormControl('', [Validators.required]);
    yearOfManufacture = new FormControl('', [Validators.required]);
    fuelType = new FormControl('', [Validators.required]);
    public loading= false;


    constructor(
        private router: Router,
        private toastr: ToastrService,
        private restService: RestService
    ) { }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
        this.getRoles();
        this.getDeviceList();
        this.getFleetList();
        this.getRulesList();
  }

    /*Function to check validations*/
    checkValidations() {
        return new Promise((resolve, reject) => {
            if (this.registrationNumber.invalid || this.brandName.invalid
                || this.modelName.invalid || this.yearOfManufacture.invalid) {

                if (this.registrationNumber.invalid) {
                    this.registrationNumber.markAsTouched();
                }

                if (this.brandName.invalid) {
                    this.brandName.markAsTouched();
                }

                if (this.modelName.invalid) {
                    this.modelName.markAsTouched();
                }
                if (this.yearOfManufacture.invalid) {
                    this.yearOfManufacture.markAsTouched();
                }
                if (this.fuelType.invalid) {
                    this.fuelType.markAsTouched();
                }
                //if (this.deviceId.invalid) {
                //    this.deviceId.markAsTouched();
                //}
                
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
                    console.log("DRIVER ID", this.roleIdDriver);
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
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
                this.toastr.error('Error deleting data');
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
                        this.toastr.error('No GeoFence Rules Available');
                    }
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting data');
            });
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
                        this.toastr.error('No Fleets Available');
                    }
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting data');
            });
    }

    /*Function to get list of unassigned drivers*/
    getUserList = function (fleetId) {
        this.loading = true;
        this.model = {};
        this.restService.makeCall('Users', 'GET', '/users?isDriverAssign=0&&roleId=' + this.roleIdDriver+'&&fleetId=' + fleetId, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.AssignDriverList = resp.body.data;
                    if (this.AssignDriverList.length != 0) {
                        this.enableAddVehicle = true;
                    }
                    else {
                        this.toastr.error('No Users Available');
                    }
                }
                else {
                   
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting data');
            });
    }

    /*Function to add a new Vehicle*/
    addVehicleFunction = function () {
        this.checkValidations()
            .then(() => {
                let addModel: any = {};
                addModel.brandName = this.addVehicleModel.brandName;
                addModel.model = this.addVehicleModel.modelName;
                addModel.yearOfManufacture = this.addVehicleModel.yearOfManufacture;
                addModel.fuelType = this.addVehicleModel.fuelType;
                addModel.registrationNumber = this.addVehicleModel.registrationNumber;
                addModel.deviceId = this.addVehicleModel.deviceId;
                addModel.color = this.addVehicleModel.color;

                if (this.addVehicleModel.geoFencing != null) {
                    addModel.geoFencing = this.addVehicleModel.geoFencing;
                }
                if (this.currentRole != "fleet admin") {
                    if (this.addVehicleModel.fleetName != null) {
                        addModel.fleetId = this.addVehicleModel.fleetName;
                    }
                }
                else if (this.currentRole == "fleet admin") {
                    if (this.currentUserInfo.fleetId != null) {
                        addModel.fleetId = this.currentUserInfo.fleetId;
                    }
                }
              
                if (this.addVehicleModel.driverName != null) {
                    addModel.userId = this.addVehicleModel.driverName;
                }
                let api = '/' + this.currentUserInfo.Tenant.id + '/vehicles';
                this.loading = true;

                this.restService.makeCall('Fleets', 'POST', api, addModel)
                    .subscribe(resp => {
                        if (resp && resp.body && resp.body.data) {
                            this.loading = false;
                            this.toastr.success('Vehicle Information added successfully.');
                            localStorage.setItem('selectedItem', resp.body.data.id);
                            this.router.navigate(['dashboard/vehicle']);
                        }
                        else if (resp && resp.length == 0) {
                            this.toastr.error('Vehicle not added successfully');
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error adding data');
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
                return 'You must enter a valid brand Name' ;
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

     /*Function to cancel Add Vehicle function*/
    cancelAdd = function () {
        this.router.navigate(['/dashboard/vehicle']);
    }

     /*Function to change the list of drivers as per fleet selected*/
    onFleetChange = function (fleetId) {
        this.addVehicleModel.fleetName = fleetId;
        this.getUserList(this.addVehicleModel.fleetName);
    }

}
