import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';
import { google } from '@agm/core/services/google-maps-types';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SearchFleetDialogComponent } from '../../../shared/search-fleet-dialog/search-fleet-dialog.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-vehicle-layout',
    templateUrl: './vehicle-layout.component.html',
    styleUrls: ['./vehicle-layout.component.css']
})

export class VehicleLayoutComponent implements OnInit {

    dialog: any;
    displayVehicles:any;
    public loading = false;
    model: any = {};
    vehicleList: any = [];
    vehicleListBeforeFleetSelection: any = [];
    selectedItem: any = {};
    userDetails: any = {};
    selectedVehicle: any = {};
    latitude: number;
    longitude: number;
    k = 0;
    firstVehicleInTheList: any = {};
    afterDelete: any = {};
    secondVehicleInTheList: any = {};
    selectedVehicleData: any = {};
    selectedItemForClass = "";
    currentUserInfo: any = {};
    currentRole: any = {};
    tenantId = "";
    tenantIdForFleetList = "";
    isFleetSelected = false;
    fleetId: number;
    fleetIdForFleet: any = {};
    checkedFleetList: Array<{ fleetId: number }> = [];

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private dialogFilter: MatDialog,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

        if (localStorage.getItem('selectedItem')) {
            this.selectedItemForClass = localStorage.getItem('selectedItem');
        }

    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.getVehicles();
        this.displayVehicles = true;
    }

    /*Function to get the list of vehicles*/
    getVehicles = function () {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.fleetIdForFleet = this.currentUserInfo.fleetId;
        this.displayVehicles = true;
        if (this.currentRole == "fleet admin" && this.fleetIdForFleet != null) {
            var URL = '/' + this.tenantId + '/vehicles?fleetId=' + this.fleetIdForFleet;
            this.restService.makeCall('fleets', 'GET', URL, this.model)
                .subscribe(resp => {

                    if (resp.body && resp.body.data) {
                        this.loading = false;
                        this.vehicleList = resp.body.data;
                        if (!(this.vehicleList && this.vehicleList[0])) {
                            this.toastr.error("No vehicles available");
                        }

                        if (this.router.url === '/dashboard/vehicle') {
                            this.selectedItem = this.vehicleList[0];
                           
                            if (this.selectedItem && this.selectedItem.id) {
                                this.displayVehicles = true;
                                this.navigateToDetails(this.selectedItem.registrationNumber);
                            }
                            else {
                                this.displayVehicles = false;
                            }

                        }
                    } else {
                        this.loading = true;

                    }

                }, error => {
                    this.loading = false;
                    this.toastr.error('Error getting list');

                });
        }


        else if (this.currentRole == "tenant admin") {
            var URL = '/' + this.tenantId + '/vehicles';
            this.restService.makeCall('fleets', 'GET', URL, this.model)
                .subscribe(resp => {

                    if (resp.body && resp.body.data) {
                        this.loading = false;
                        this.vehicleList = resp.body.data;
                        if (!(this.vehicleList && this.vehicleList[0])) {
                            this.toastr.error("No vehicles available");
                        }

                        if (this.router.url === '/dashboard/vehicle') {
                            this.selectedItem = this.vehicleList[0];
                            if (this.selectedItem && this.selectedItem.id) {
                                this.displayNoVehicles = true;
                                this.navigateToDetails(this.selectedItem.registrationNumber);
                            }
                            else {
                                this.displayNoVehicles = false;
                            }

                        }
                    } else {
                        this.loading = true;

                    }

                }, error => {
                    this.loading = false;
                    this.toastr.error('Error getting list');

                });
        }

        else {
            this.toastr.error('No vehicles for this user');
            this.loading = false;

        }
       
    }

    /*Function to get the list of Vehicles after the fleet/s is/are selected*/
    getVehiclesAfterFleetSelection = function (checkedFleetList, isFleetSelected) {
            this.loading = true;
            let filter = "";
            this.tenantId = this.currentUserInfo.Tenant.id;
            var URL = '/' + this.tenantId + '/vehicles';
            console.log(URL);
            this.restService.makeCall('fleets', 'GET', URL, this.model)
                .subscribe(resp => {
                    if (resp.body && resp.body.data) {
                            this.loading = false;
                            this.vehicleList = [];
                            this.vehicleListBeforeFleetSelection = resp.body.data;
                            var k = 0;
                            if (checkedFleetList.length == 0 || checkedFleetList[0].fleetId == 0) {
                                this.vehicleList = this.vehicleListBeforeFleetSelection;
                            }
                            else {
                                for (var i = 0; i < this.vehicleListBeforeFleetSelection.length; i++) {
                                    for (var j = 0; j < checkedFleetList.length; j++) {
                                        if (this.vehicleListBeforeFleetSelection[i].fleetId == checkedFleetList[j].fleetId) {
                                            this.vehicleList[k] = this.vehicleListBeforeFleetSelection[i];
                                            k++;
                                        }
                                    }
                                }
                        }

                        if (this.vehicleList.length != 0) {
                            this.selectedItem = this.vehicleList[0];
                        }
                        else {
                            this.vehicleList = this.vehicleListBeforeFleetSelection;
                            this.selectedItem = this.vehicleList[0];
                            this.toastr.error('No vehicles under that fleet');
                        }
                            
                            if (this.selectedItem && this.selectedItem.id) {
                                this.navigateToDetails(this.selectedItem.registrationNumber);
                            }
                        } else {
                               this.loading = false;
                        }
                }, error => {
                    this.loading = false;
                    this.toastr.error('Error getting list');
                });
    }
    /*Function to open select the fleet dialog*/
    openDialog(): void {
        let dialogRef = this.dialogFilter.open(SearchFleetDialogComponent, {
            width: '250px',
            data: { tenantIdForFleetList: this.tenantId },
        });

        dialogRef.afterClosed().subscribe(result => {
            this.checkedFleetList = result;
            console.log("Checked fleet list ", this.checkedFleetList);
            this.isFleetSelected = true;
            this.getVehiclesAfterFleetSelection(this.checkedFleetList, this.isFleetSelected);
        });
    }

    /*Function to navigate to the add vehicle page*/
    navigateToAdd = function () {
        this.router.navigate(['/dashboard/vehicle/add']);
    }

    /*Function to navigate to the details of a particular vehicle*/
    navigateToDetails = function (id) {
        localStorage.setItem('selectedItem', id);
        this.router.navigate(['/dashboard/vehicle/details/' + id]);
    }
}
