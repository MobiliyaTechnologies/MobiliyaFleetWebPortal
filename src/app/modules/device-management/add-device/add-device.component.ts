import { Component, OnInit, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
    public loading = false;
    selectedItem: any = {};
    roles: any = [];
    currentUserInfo: any = {};
    currentRole = "";
    addDeviceModel: any = {};
    //dongleTypeList: any = [{ "id": "0", "dongleType": "OBD II" }, { "id": "1", "dongleType": "J1939" }];
    dongleTypeList: any = ["OBD II","J1939"];

    adapterId = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z_.-]{2,50}$')]));
    serialNo = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z_.-]{2,50}$')]));
    dongleType = new FormControl('', Validators.required);
    hardwareVersion = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(([0-9]{1,4})?(\.[0-9]{1,4})?(\.[0-9]{1,4})){1,15}$')]));
    firmwareVersion = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(([0-9]{1,4})?(\.[0-9]{1,4})?(\.[0-9]{1,4})){1,15}$')]));

    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'adapterid') {
            if(this.adapterId.hasError('required'))
                return 'You must enter a valid device Id';
            if(this.adapterId.hasError('pattern'))
                return 'Device Id must contain only numbers, alphabets, hyphen(-), underscore(_) and dot(.)';
        }
        if (field.toLowerCase() === 'serialno') {
            if(this.serialNo.hasError('required'))
                return 'You must enter a valid serial number';
            if(this.serialNo.hasError('pattern'))
                return 'Serial No. must contain only numbers, alphabets, hyphen(-), underscore(_) and dot(.)';
        }
        if (field.toLowerCase() === 'dongletype') {
            if(this.dongleType.hasError('required'))
                return 'You must select a valid dongle type';
        }
        if (field.toLowerCase() === 'hardwareversion') {
            if(this.hardwareVersion.hasError('required'))
                return 'You must enter valid hardware version';
            if(this.hardwareVersion.hasError('pattern'))
                return 'Hardware Version must contain only numbers and dot(.)';
        }

        else if (field.toLowerCase() === 'firmwareversion') {
            if(this.firmwareVersion.hasError('required'))
                return 'You must enter valid firmware version';
            if(this.firmwareVersion.hasError('pattern'))
                return 'Firmware Version must contain only numbers and dot(.)';
        }
    }

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService
    ) { }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
    }

    /**
     * Stores metadata and sets initial values before add Device action
     */
    addDeviceStart = function () {
        this.addDeviceModel = {};
        this.adapterId.reset();
        this.serialNo.reset();
        this.dongleType.reset();
        this.hardwareVersion.reset();
        this.firmwareVersion.reset();
    }

    /**
     * Check button click validations for add device
     */
    checkValidations() {
        return new Promise((resolve, reject) => {
            if (this.adapterId.invalid || this.serialNo.invalid
                || this.dongleType.invalid || this.hardwareVersion.invalid || this.firmwareVersion.invalid) {

                if (this.adapterId.invalid) {
                    this.adapterId.markAsTouched();
                }
                if (this.serialNo.invalid) {
                    this.serialNo.markAsTouched();
                }
                if (this.dongleType.invalid) {
                    this.dongleType.markAsTouched();
                }
                if (this.hardwareVersion.invalid ) {
                    this.hardwareVersion.markAsTouched();
                }
                if (this.firmwareVersion.invalid) {
                    this.firmwareVersion.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /**
     * Add device api call
     */
    addDevice = function () {
        this.checkValidations()
            .then(() => {

                let addModel: any = {};
                addModel.deviceName = this.addDeviceModel.adapterId;
                addModel.deviceType = this.addDeviceModel.dongleType;
                addModel.serialNo = this.addDeviceModel.serialNo;
                addModel.hardwareVersion = this.addDeviceModel.hardwareVersion;
                addModel.protocolVersion = this.addDeviceModel.firmwareVersion;
                let api = '/'+this.currentUserInfo.Tenant.id+'/devices';
                this.loading = true;

                this.restService.makeCall('Fleets', 'POST', api, addModel)
                    .subscribe(resp => {
                        if (resp && resp.body && resp.body.data) {
                            this.loading = false;
                            this.toastr.success('Device Information added successfully.');
                            localStorage.setItem('selectedItem',resp.body.data.id);
                            this.router.navigate(['dashboard/devices/details/'+resp.body.data.id]);
                        }
                        else if (resp && resp.length == 0) {
                            this.loading = false;
                            //this.toastr.error('Something went wrong. Please try with different device id');
                            this.addDeviceStart();
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error adding device');
                    });
            }).catch(() => {
                this.loading = false;
                //this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });


    }

    cancelAdd= function () {
        this.router.navigate(['/dashboard/devices']);
    }

}
