import { Component, Inject, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';
import { google } from '@agm/core/services/google-maps-types';
import { MatDialogRef, MatDialog } from '@angular/material';

import { SearchFleetDialogComponent } from '../../../shared/search-fleet-dialog/search-fleet-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGaugeModule } from 'ngx-gauge'; 
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-vehicle-details',
    templateUrl: './vehicle-details.component.html',
    styleUrls: ['./vehicle-details.component.css']
})
  
export class VehicleDetailsComponent implements OnInit {
    currentRole: any;
    public loading = false;
    deviceName: any = "";
    companyName: any = "";
    model: any = {};
    vehicleList: any = [];
    dataArray: any = [];
    deleteVehicleId: any;
    selectedItem: any = {};
    sendItemForReload: any = {};
    userDetails: any = {};
    selectedVehicle: any = {}
    latitude: number;
    longitude: number;
    k = 0;
    selectedItemForClass: any = {};
    selectedVehicleData: any = {};
    firstVehicleInTheList: any = {};
    secondVehicleInTheList: any = {};
    currentUserInfo: any = {};
    tenantId = "";
    tenantIdForFleetList = "";
    isFleetSelected = false;
    fleetId: number;
    checkedFleetList: Array<{ fleetId: number }> = [];
    modalRef: BsModalRef;
    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private dialogFilter: MatDialog,
        private route: ActivatedRoute,
        private dialogDetails: MatDialog,
        private modalService: BsModalService
    ) {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
       
        this.currentRole = this.currentUserInfo.currentRole;
        this.route.params.subscribe(params => {
            this.selectedItem.registrationNumber = params['id'];
        });


        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

        if (localStorage.getItem('selectedItem')) {
            this.selectedItemForClass = localStorage.getItem('selectedItem');
        }


    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.getVehicleInformation(this.selectedItem.registrationNumber);

    }


    /*Function to get vehicle information of a particular vehicle using registration number*/
    getVehicleInformation = function (regNum) {
        this.loading = true;
        this.model = {};
        var URL = '/' + this.tenantId + '/vehicles?registrationNumber=' + regNum;
        this.restService.makeCall('fleets', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data[0];
                    this.deviceName = this.selectedItem.Device.deviceName;
                    this.getUserDetails(this.selectedItem.userId);
                    this.getVehicleHistory(this.selectedItem.id);

                } else {
                    this.loading = false;

                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting vehicle info');
            })

    }

    /*Function to get history of a particular vehicle using vehicle Id*/
    getVehicleHistory = function (vehicleId) {
        
        this.loading = true;
        this.model = {};
        var URL = '/' + this.tenantId + '/vehicleHistory?vehicleId=' + vehicleId + '&limit=1';
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data && resp.body.data.length!=0) {
                    this.loading = false;
                    this.selectedVehicle = resp.body.data[0];
                    this.selectedVehicleData = this.selectedVehicle.data;
                    this.longitude = parseFloat(this.selectedVehicleData.Longitude);
                    this.latitude = parseFloat(this.selectedVehicleData.Latitude);
                } else {
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting vehicle info');
            })
    }

    /*Function to get details of the driver associated with the vehicle*/
    getUserDetails = function (userId) {
        this.loading = true;

        this.tenantId = this.currentUserInfo.Tenant.id;
        var URL = '/users/' + userId;
        if (userId != null) {
            this.restService.makeCall('Users', 'GET', '/users/' + userId, this.model)
                .subscribe(resp => {
                    if (resp.body && resp.body.data) {
                        this.loading = false;
                        this.userDetails = resp.body.data;
                        this.companyName = this.userDetails.Tenant.tenantCompanyName;
                    } else {
                        this.loading = true;
                    }
                }, error => {
                    this.loading = false;
                    this.toastr.error('Error getting list');
                });

        }
        
    }

    /*Function to navigate to the Trip History function*/
    navigateToTripHistory = function (id) {
        this.router.navigate(['/dashboard/vehicle/tripHistory/' + id]);
    }

    /*Function to navigate to the edit vehicles page*/
    navigateToEditDetails = function (id) {
        this.router.navigate(['/dashboard/vehicle/editVehicle/' + id]);
    }

    /*Function to open confirmation box before deleting a vehicle*/
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    /*Function to delete the vehicle using vehicle Id*/
    deleteVehicle = function (id) {
        this.model = {};
        this.restService.makeCall('fleets', 'DELETE', '/' + this.tenantId + '/vehicles/' + id, this.model)
            .subscribe(resp => {
                this.loading = false;
                if (resp && resp.body) {
                    this.toastr.success('Vehicle Information deleted successfully.');
                    this.router.navigate(['dashboard/vehicle']);
                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting data');
            });
    }



}
     

