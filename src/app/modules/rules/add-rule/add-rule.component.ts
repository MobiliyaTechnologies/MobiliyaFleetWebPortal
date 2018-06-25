import { Component, OnInit, ViewChild } from '@angular/core';
import { concat } from 'rxjs/operator/concat';
import { ToastrService } from 'ngx-toastr';
declare var Microsoft: any;
import { RestService } from '../../../services/rest-service/rest-service.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
    selector: 'app-add-rule',
    templateUrl: './add-rule.component.html',
    styleUrls: ['./add-rule.component.css']
})

export class AddRuleComponent implements OnInit {
    @ViewChild('myMap') myMap;
    map: any;
    displayedColumns = ['longitude', 'latitude', 'radius'];
    vehicleName = new FormControl('', [Validators.required]);
    fleetName = new FormControl('', [Validators.required]);
    ruleName = new FormControl('', [Validators.required]);
    rulename = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[A-Z\\a-z\\d-_\\s]+$'), Validators.minLength(2), Validators.maxLength(16)]));
    radius = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(12)]));
    latitude = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,7}(\.[0-9]+)?$'), Validators.minLength(2), Validators.maxLength(16)]));
    longitude = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,7}(\.[0-9]+)?$'), Validators.minLength(2), Validators.maxLength(16)]));
    fleetname = new FormControl('', [Validators.required]);
    latlngrad = true;
    tabIndex = 0;
    vehicleIdValue: any;
    geoFenceMustBeChosen= 0;
    setSpeedValue = 0;
    speedLimitMustBeSet = 0;
    saveButton = false;
    radioBtnValue = 0;
    ruleIdentifier: any = {};
    selecteditem: any = {};
    upgradeFile: any;
    public size = 0;
    displayMap = false;
    geoFenceChoice = 0;
    showProgress = false;
    speedValue = 0;
    filename: any;
    lat: any;
    lng: any;
    rad: any;
    fN: any;
    vN: any;
    step3 = 0;
    file: any;
    fileType: any;
    multipleGeofenceFleet: any = [];
    fleetValueList: any = [];
    vehicleValueList: any = [];
    public fileUploadSelected = false;
    addSpeedLimitModel: any = {};
    currentRole: any;
    addSpeed: any = {};
    addRuleVariable: any = {};
    public file_name: any;
    model: any;
    tenantId: any;
    Id: any;
    currentUserInfo: any = {};
    AssignFleetList: any = {};
    ruleList: any = {};
    AssignVehicleList: any = {};
    data: AOA = [[1, 2], [3, 4]];
    multipleGeofence: any = [];
    hide=true;
    public loading = false;
    constructor(
        private router: Router,
        private toastr: ToastrService,
        private restService: RestService
    ) { }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log("this.currentUserInfo", this.currentUserInfo);
        this.currentRole = this.currentUserInfo.currentRole;
        this.Id = this.currentUserInfo.id;
        this.getFleetList();
    }

    ngAfterViewInit() {
        var _that = this;
        setTimeout(() => {
            if(_that.myMap && _that.myMap.nativeElement)
                _that.map = new Microsoft.Maps.Map(_that.myMap.nativeElement, {
                    credentials: 'AiEsUmLefI71UtYUSlMa1svuDHQbAWnWi-nqwzvhpZmqUI1YN6651ntoRQWEsZCc'
                });
        }, 1000);
    }

    /* Function to check if radius, longitude, latitude and vehicle are correct*/
    checkValidations() {
        return new Promise((resolve, reject) => {
            if (this.radius.invalid || this.latitude.invalid || this.longitude.invalid || this.vehicleName.invalid) {
                if (this.radius.invalid) {
                    this.radius.markAsTouched();
                }

                if (this.latitude.invalid) {
                    this.latitude.markAsTouched();
                }
                if (this.longitude.invalid) {
                    this.longitude.markAsTouched();
                }
                if (this.vehicleName.invalid) {
                    this.vehicleName.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /* Function to check if vehicle is correctly selected*/
    checkValidationsForSpeed() {
        return new Promise((resolve, reject) => {
            if ( this.vehicleName.invalid) {
                if (this.vehicleName.invalid) {
                    this.vehicleName.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /* Function to check if rule Name is valid*/
    checkValidationsForRuleName() {
        return new Promise((resolve, reject) => {
            if (this.rulename.invalid) {
                if (this.rulename.invalid) {
                    this.rulename.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /*Function to get Error messages*/
    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'latitude') {
            if (this.latitude.hasError('required'))
                return 'You must enter a valid Latitude value';
            if (this.latitude.hasError('minlength'))
                return 'Latitude value should be at least 2 numbers';
            if (this.latitude.hasError('pattern'))
                return 'Latitude should contains only numbers and dot'
            if (this.latitude.hasError('maxlength'))
                return 'Latitude value should be at most 16 characters';
        }
        if (field.toLowerCase() === 'rulename') {
            if (this.rulename.hasError('minlength'))
                return 'Rule Name should be at least 2 characters';
            if (this.rulename.hasError('required'))
                return 'You must enter a valid rule Name';
            if (this.rulename.hasError('pattern'))
                return 'Rule Name should contains only alphabets, numbers and spaces'
            if (this.rulename.hasError('maxlength'))
                return 'Rule Name should be at most 16 characters';
        }

        if (field.toLowerCase() === 'radius') {
            if (this.radius.hasError('required'))
                return 'You must enter a valid Radius value in meter';
            if (this.radius.hasError('minlength'))
                return 'Radius value should be at least 1 number';
            if (this.radius.hasError('pattern'))
                return 'Radius should contains only numbers and dot'
            if (this.radius.hasError('maxlength'))
                return 'Radius value should be at most 16 numbers';
        }

        if (field.toLowerCase() === 'longitude') {
            if (this.longitude.hasError('required'))
                return 'You must enter a valid Longitude value';
            if (this.longitude.hasError('minlength'))
                return 'Longitude value should be at least 2 numbers';
            if (this.longitude.hasError('pattern'))
                return 'Longitude should contains only numbers and dot'
            if (this.longitude.hasError('maxlength'))
                return 'Longitude value should be at most 16 characters';
        }

        if (field.toLowerCase() === 'vehiclename') {
            if (this.vehicleName.hasError('required'))
                return 'You must select a vehicle';
        }

    }

    setPushpin = function (lat, lng) {
        var pushPin = { 'latitude': lat, 'longitude': lng };

        var pin = new Microsoft.Maps.Pushpin(pushPin, {
            icon: '../../../assets/images/stop1.png'
        });
        this.map.entities.push(pin);
        this.map.setView({ center: pushPin });
    }

    /*Function to navigate to the next step*/
    selectNext(el) {
        if (this.radioBtnValue == 1 && this.speedLimitMustBeSet == 1) {
            if (this.setSpeedValue == 1) {
                this.checkValidationsForSpeed()
                    .then(() => {
                        this.speedLimitMustBeSet = 0;
                        el.selectedIndex += 1;
                        this.saveButton = true;
                        this.step3 = 1;

                    }).catch(() => {
                        this.loading = false;
                        this.toastr.error('Mandatory field are not filled', 'Validation Error');
                    });
            }
            else {
                this.toastr.error('Set a Speed Limit to continue');
            }
        }
        else if (this.radioBtnValue == 2 && this.geoFenceMustBeChosen == 1) {
            if (this.geoFenceChoice == 1) {

                this.checkValidations()
                    .then(() => {
                        this.step3 = 1;
                        this.lat = parseFloat(this.addRuleVariable.latitude);
                        this.lng = parseFloat(this.addRuleVariable.longitude);
                        if(this.myMap && this.myMap.nativeElement){
                            this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
                                credentials: 'AiEsUmLefI71UtYUSlMa1svuDHQbAWnWi-nqwzvhpZmqUI1YN6651ntoRQWEsZCc'
                            });
                            this.setPushpin(this.lat, this.lng);  
                        }
                        this.rad = parseFloat(this.addRuleVariable.radius);
                        this.latlngrad = true;
                        el.selectedIndex += 1;
                        this.saveButton = true;
                        
                    }).catch((Ex) => {
                        this.loading = false;
                        this.toastr.error('Mandatory fields are not correctly filled', 'Validation Error');
                    });

            }
            else if (this.geoFenceChoice == 2 && this.step3 != 1) {
                if (!this.file) {
                    this.toastr.error('Please select a file to continue.');
                }
                else {
                    el.selectedIndex += 1;
                    this.step3 = 1;
                    this.saveButton = true;
                }

            }
            else {
                this.toastr.error('Select a GeoFence Choice to continue');
            }
        }

        if (this.geoFenceChoice == 0 && this.radioBtnValue == 2 && this.geoFenceMustBeChosen == 0) {

            this.checkValidationsForRuleName()
                .then(() => {
                    this.geoFenceMustBeChosen = 1;
                    el.selectedIndex += 1;

                }).catch(() => {
                    this.loading = false;
                    this.toastr.error('Mandatory field is not correctly filled', 'Validation Error');
                });
        }

        else if ((this.setSpeedValue == 0 || this.setSpeedValue == 1) && this.radioBtnValue == 1 && this.speedLimitMustBeSet == 0) {

            this.checkValidationsForRuleName()
                .then(() => {
                    this.speedLimitMustBeSet = 1;
                    el.selectedIndex += 1;

                }).catch(() => {
                    this.loading = false;
                    this.toastr.error('Mandatory field is not correctly filled', 'Validation Error');
                });
        }
        else if (this.radioBtnValue == 2 && this.geoFenceMustBeChosen == 0 && (this.geoFenceChoice == 1 || this.geoFenceChoice == 2)) {
            el.selectedIndex += 1;
        }

    }

     /*Function to navigate to the previous step*/
    selectPrevious(el) {
        if (this.radioBtnValue == 2) {
            this.geoFenceMustBeChosen = 0;
        }
        if (this.radioBtnValue == 1) {
            this.speedLimitMustBeSet = 0;
        }
        el.selectedIndex -= 1;
        
       
    }

    /*Function to get the name of vehicle using vehicle Id*/
    setVehicleNm = function (id) {
       
        this.loading = true;
        this.model = {};
        this.vehicleIdValue = id.value;
        var URL = '/' + this.tenantId + '/vehicles/' + this.vehicleIdValue;
            this.restService.makeCall('fleets', 'GET', URL, this.model)
                .subscribe(resp => {
                    if (resp.body && resp.body.data) {
                        this.loading = false;
                        this.selecteditem = resp.body.data;
                        this.vN = this.selecteditem.registrationNumber;

                    } else {
                        this.loading = false;

                    }
                }, error => {
                    this.loading = false;
                    this.toastr.error('Error getting vehicle info');
                })    
    }

    /*Function to get the id of the vehicle*/
    setVehicleValue = function (i, name) {
        this.vehicleValueList[i] = name.value;
    }

    /*Function to update the value of Radio Button*/
    updateRadioBtnValue = function (value) {
        this.radioBtnValue = value;
    }

    /*Function to update GeoFence Choice*/
    updateGeoFenceChoice = function (value) {
        this.geoFenceChoice = value;
    }

    /*Function to process the file after upload*/
    onFileClickUpload(event) {
        this.showProgress = true;
        const elem = document.getElementById('bar');
        elem.style.width = '0%';
        this.fileUploadSelected = true;
    }

    /*Function to show the progress of file upload*/
    onClickFile(event) {
        this.fileType = event.target.files[0].type;
        if (this.fileType == "application/vnd.ms-excel" || this.fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.showProgress = true;
            const elem = document.getElementById('bar');
            let width = 1;
            this.file_name = event.target.files[0] ? event.target.files[0].name : '';
         
            console.log(event.target.files[0].type);
            console.log("File Type", this.fileType);
            //application/vnd.ms-excel (.xls)
            //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            this.size = event.target.files[0] ? event.target.files[0].size : 0;
            this.file = event.target.files[0];
            const target: DataTransfer = <DataTransfer>(event.target);
            if (target.files.length !== 1) throw new Error('Cannot use multiple files');
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
                for (var i = 1; i < this.data.length; i++) {
                    this.lat = this.data[i][1];
                    this.lng = this.data[i][0];
                    this.rad = this.data[i][2];
                    this.multipleGeofence.push({ "latitude": this.lat, "longitude": this.lng, "radius": this.rad, "vehicleId": "" });
                }
            };
            reader.readAsBinaryString(target.files[0]);
        }
        else {
            this.toastr.error("Only .xls, .xlsx, .csv files accepted");
      
        }
            
       
    }

    /*Function to get the Fleet List*/
    getFleetList = function () {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.model = {};
        if (this.currentRole == "fleet admin") {
            this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/fleets/' + this.currentUserInfo.fleetId, this.model)
                .subscribe(resp => {
                    if (resp && resp.body) {
                        this.loading = false;
                        this.AssignFleetList = resp.body.data;
                        console.log("this.AssignFleetList", this.AssignFleetList);
                        this.getVehicleList(this.currentUserInfo.fleetId);
                    }
                    else {
                        this.loading = false;
                    }

                }, error => {
                    this.loading = false;
                });
        }
        else {
            this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/fleets', this.model)
                .subscribe(resp => {
                    if (resp && resp.body) {
                        this.loading = false;
                        this.AssignFleetList = resp.body.data;
                    }
                    else {
                        this.loading = false;
                    }

                }, error => {
                    this.loading = false;
                });
        }

   
    }

    /*Function to get the List of Vehicles from a particular fleet*/
    getVehicleList = function (fleetId) {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.model = {};
        if (this.currentRole != "fleet admin") {
            this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/vehicles?fleetId=' + fleetId, this.model)
                .subscribe(resp => {
                    if (resp && resp.body) {
                        this.loading = false;
                        this.AssignVehicleList = resp.body.data;
                        if (this.AssignVehicleList.length != 0) {
                        }
                        else {
                            this.toastr.error('No Vehicles Available');
                        }
                    }
                    else {
                        this.loading = false;
                    }

                }, error => {
                    this.loading = false;
                });
        }
        else {
            this.restService.makeCall('fleets', 'GET', '/' + this.tenantId + '/vehicles?fleetId=' + this.currentUserInfo.fleetId, this.model)
                .subscribe(resp => {
                    if (resp && resp.body) {
                        this.loading = false;
                        this.AssignVehicleList = resp.body.data;
                        if (this.AssignVehicleList.length != 0) {
                        }
                        else {
                            this.toastr.error('No Vehicles Available');
                        }
                    }
                    else {
                        this.loading = false;
                    }

                }, error => {
                    this.loading = false;
                });
        }
       
    }

    /*Function to change the speed Value Slider*/
    changeSpeedValue(slider) {
        this.speedValue = slider.value;
        this.ruleIdentifier = 1;
        this.setSpeedValue = 1;
    }

    /*Function to choose which add Rule function be called*/
    addRule = function () {
        if (this.radioBtnValue == 2) {
            if (this.geoFenceChoice == 1) {
                this.setIndividualGeoFenceRule();
            }
            else {
                this.setMultipleGeoFenceRule();
            }
        }
        else {
            this.setSpeedLimitRule();
        }
    }

    /*Function to set Individual GeoFence Rule*/
    setIndividualGeoFenceRule = function () {
        this.saveButton = true;
        this.loading = true;
        this.addSpeedLimitModel.userId = this.Id;
        this.addSpeedLimitModel.ruleType = "Location";
        this.addSpeedLimitModel.ruleName = this.addRuleVariable.rulename;
        this.addSpeedLimitModel.geofenceList = [{ "latitude": this.addRuleVariable.latitude, "longitude": this.addRuleVariable.longitude, "radius": this.addRuleVariable.radius, "vehicleId": this.addRuleVariable.vehicleName }];
        this.restService.makeCall('trip', 'POST', '/' + this.tenantId + '/geofence', this.addSpeedLimitModel)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.toastr.success('GeoFence Rule added successfully.');
                    this.router.navigate(['dashboard/rules']);
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });

    }

    /*Function to set Speed Limit Rule*/
    setSpeedLimitRule = function () {
        this.loading = true;
        this.saveButton = true;
        this.addSpeedLimitModel.userId = this.Id;
        this.addSpeedLimitModel.ruleType = "Speed";
        this.addSpeedLimitModel.ruleName = this.addRuleVariable.rulename;
        this.addSpeedLimitModel.speedingList = [{ "speedLimit": this.speedValue, "vehicleId": this.addSpeed.vehicleName }];
        this.model = {};
        this.restService.makeCall('trip', 'POST', '/' + this.tenantId + '/speedings', this.addSpeedLimitModel)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.toastr.success('Speed Rule added successfully.');
                    this.router.navigate(['dashboard/rules']);
                }
                else {
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    /*Function to navigate back to the details*/
    navigateToDetails = function () {
        this.router.navigate(['dashboard/rules']);
    }

    /*Function to change the value of Step 3*/
    changeValueOfStep3 = function () {
        this.step3 = 1; 
        this.saveButton = true;
      
    }

    /*Function to delete Entry from the list of Longitude and Latitude*/
    deleteEntry = function (index) {
        this.multipleGeofence.splice(index, 1);
    }

    /*Function to set Multiple GeoFence Rule*/
    setMultipleGeoFenceRule = function () {
        this.checkValidationsForSpeed()
            .then(() => {

                this.addSpeedLimitModel.geofenceList = [];
                this.loading = true;
                this.addSpeedLimitModel.userId = this.Id;
                this.addSpeedLimitModel.ruleType = "Location";
                this.addSpeedLimitModel.ruleName = this.addRuleVariable.rulename;
                for (var i = 0; i < this.multipleGeofence.length; i++) {
                    this.multipleGeofence[i].vehicleId = this.vehicleValueList[i];
                }
                this.addSpeedLimitModel.geofenceList = this.multipleGeofence;

                this.restService.makeCall('trip', 'POST', '/' + this.tenantId + '/geofence', this.addSpeedLimitModel)
                    .subscribe(resp => {
                        if (resp && resp.body) {
                            this.loading = false;
                            this.toastr.success('GeoFence Rule added successfully.');
                            this.router.navigate(['dashboard/rules']);
                        }
                        else {
                            this.loading = false;
                        }

                    }, error => {
                        this.loading = false;
                    });

            }).catch(() => {
                this.loading = false;
                this.toastr.error('Mandatory fields are not filled', 'Validation Error');
            });


    }

    /*Function to change the list of vehicles as per fleet selected*/
    onFleetChange = function (fleetId, num) {
        if (num == 1) {
            this.addSpeed.fleetName = fleetId;
            this.getVehicleList(this.addSpeed.fleetName);
        }
        else if (num == 2) {
            this.addRuleVariable.fleetName = fleetId;
            this.getVehicleList(this.addRuleVariable.fleetName);
        }
    }

    /*Function to change the list of vehicles as per fleet selected*/
    selectFleet = function (fleetId) {
        this.fleetName = fleetId;
        this.AssignVehicleList = null;
        this.getVehicleList(this.fleetName);
    }

}
