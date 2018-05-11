import { Component, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
declare var Microsoft: any;
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
   
    @ViewChild('myMap') myMap;
    map: any;
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
    modalRef: BsModalRef;;
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
        this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
            credentials: 'AiEsUmLefI71UtYUSlMa1svuDHQbAWnWi-nqwzvhpZmqUI1YN6651ntoRQWEsZCc'
        });

        this.getVehicleInformation(this.selectedItem.registrationNumber);

    }

    ngAfterViewInit() {
        
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
                    this.setPushpin(this.latitude, this.longitude);  
                } else {
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting vehicle info');
            })
    }

    setPushpin = function (lat, lng) {
        var pushPin = { 'latitude': lat, 'longitude': lng };
               
        var pin = new Microsoft.Maps.Pushpin(pushPin);
      
        var backgroundColor = new Microsoft.Maps.Color(10, 0, 0, 0)
        var borderColor = new Microsoft.Maps.Color(150, 200, 0, 0);
        var circlePoints = new Array();
        var lat1 = (lat * Math.PI) / 180;
        var long1 = (lng * Math.PI) / 180;
        //var d = radius / 3956;
        var d = 100 / 3956; 
        d = 100;
        var p2 = new Microsoft.Maps.Location(0, 0);
        for (var x = 0; x <= 360; x += 5) {
            var brng = x * Math.PI / 180;
            console.log("brng", brng);
            p2.latitude = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
            p2.longitude = ((long1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(p2.latitude))) * 180) / Math.PI;
            p2.latitude = (p2.latitude * 180) / Math.PI;
            console.log("p2", p2);
            circlePoints.push(p2);
        }
          this.map.entities.push(pin);
        this.map.setView({ center: pushPin });
        console.log("Circle points", circlePoints);
        var polygon = new Microsoft.Maps.Polygon(circlePoints, { fillColor: backgroundColor, strokeColor: borderColor, strokeThickness: 0 });
        this.map.entities.push(polygon);
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
     

