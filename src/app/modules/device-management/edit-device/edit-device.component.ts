import { Component, OnInit, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent implements OnInit {

    public loading = false;
    selectedItem: any = {};
    currentUserInfo: any = {};
    currentRole = "";
    dongleTypeList: any = [{ "id": "0", "dongleType": "OBD II" }, { "id": "1", "dongleType": "J1939" }];
    adapterId = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z_.-]{2,50}$')]));
    serialNo = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z_.-]{2,50}$')]));
    dongleType = new FormControl('', Validators.required);
    hardwareVersion = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(([0-9]{1,4})?(\.[0-9]{1,4})?(\.[0-9]{1,4})){1,15}$')]));
    firmwareVersion = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(([0-9]{1,4})?(\.[0-9]{1,4})?(\.[0-9]{1,4})){1,15}$')]));

    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'adapterid') {
            if (this.adapterId.hasError('required'))
                return 'You must enter a valid device Id';
            if (this.adapterId.hasError('pattern'))
                return 'Device Id must contain only numbers, alphabets, hyphen(-), underscore(_) and dot(.)';
        }
        if (field.toLowerCase() === 'serialno') {
            if (this.serialNo.hasError('required'))
                return 'You must enter a valid serial number';
            if (this.serialNo.hasError('pattern'))
                return 'Serial No. must contain only numbers, alphabets, hyphen(-), underscore(_) and dot(.)';
        }
        if (field.toLowerCase() === 'dongletype') {
            if (this.dongleType.hasError('required'))
                return 'You must select a valid dongle type';
        }
        if (field.toLowerCase() === 'hardwareversion') {
            if (this.hardwareVersion.hasError('required'))
                return 'You must enter valid hardware version';
            if (this.hardwareVersion.hasError('pattern'))
                return 'Hardware Version must contain only numbers and dot(.)';
        }

        else if (field.toLowerCase() === 'firmwareversion') {
            if (this.firmwareVersion.hasError('required'))
                return 'You must enter valid firmware version';
            if (this.firmwareVersion.hasError('pattern'))
                return 'Firmware Version must contain only numbers and dot(.)';
        }
    }

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private route: ActivatedRoute
    ) {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
        this.route.params.subscribe(params => {
            this.selectedItem.id = params['id'];
            this.getDeviceDetails(this.selectedItem.id);
        });
    }

    ngOnInit() {
    }
    ngAfterViewInit() {
    }
    
    navigateToEdit = function () {
        let route = "/dashboard/devices/edit/" + this.selectedItem.id;
        this.router.navigate([route]);
    }

    /**
    retrieve device Details
    */

    getDeviceDetails = function (id) {
        this.addForm = false;
        this.editForm = false;
        this.loading = true;
        this.model = {};
        let tenantId = "";
        if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantId = this.currentUserInfo.Tenant.id;
        this.restService.makeCall('Fleets', 'GET', '/' + tenantId + '/devices/' + id, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting user info');
            })
    }

    /*device details ends */

    /**
     * Check button click validations for edit device
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
                if (this.hardwareVersion.invalid) {
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
     * Update device information
     */
    saveDevice = function () {
        this.loading = true;
        this.checkValidations()
            .then(() => {
                this.restService.makeCall('Fleets', 'PUT', '/' + this.currentUserInfo.Tenant.id + '/devices/' + this.selectedItem.id, this.selectedItem)
                    .subscribe(resp => {
                        if (resp.body && resp.body.data) {
                            this.loading = false;
                            this.toastr.success('Dongle Information updated successfully.');
                            this.router.navigate(['dashboard/devices/details/'+this.selectedItem.id]);
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error saving data');
                    });
            }).catch(() => {
                this.loading = false;
                //this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });
    }

    /* Edit device Ends here*/
    
    cancelEdit = function () {
        this.router.navigate(['/dashboard/devices']);
    }
}
