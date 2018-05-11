import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var Microsoft: any;
import { SearchFleetDialogComponent } from '../../../shared/search-fleet-dialog/search-fleet-dialog.component';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { AgmCoreModule } from '@agm/core';

@Component({
    selector: 'app-vehicle-trip-history-details',
    templateUrl: './vehicle-trip-history-details.component.html',
    styleUrls: ['./vehicle-trip-history-details.component.css']
})
export class VehicleTripHistoryDetailsComponent implements OnInit {
    @ViewChild('myMap') myMap;
    map: any;
    public loading = false;
    public icon = "../../../assets/images/stop1.png"
    tripId: any;
    tenantId: any;
    vehicleId: any;
    incrementBy: number;
    latitudeValue: any;
    longitudeValue: any;
    rpm = 0;
    FaultSPN = "";
    FaultDescription = "";
    dpfAshLoad = 0;
    vehicleSpeed = 0;
    engineIntakeManifoldTemp = 0;
    oilTemp = 0;
    dpfInletTemp = 0;
    dpfSootLoad = 0;
    pctLoad = 0;
    pctTorque = 0;
    dpfOutletTemp = 0;
    ambientTemp = 0;
    engineCrankcasePressure = 0;
    scrOutletNox = 0;
    scrInletNox = 0;
    oilPressure = 0;
    endOdometer = "";
    dpfPressureDifferential = 0;
    totalNoOfPassiveRegenerations = 0;
    totalNoOfActiveRegenerations = 0;
    barometricPressure = 0;
    airIntakeTemperature = 0;
    tripDetails: any = [];
    key: any = [];
    tripDetailsOfVehicle: any = [];
    tripDetailsOfVehicleAtStart: any;
    tripDetailsOfVehicleZero: any = {};
    coordinates: any = [];
    coordinatesStartEnd: any = [];
    coordinatesEnd: any = {};
    coordinatesStart: any = {};
    tripDetailsOfVehicleAtEnd: any;
    latitude: any;
    tripCommonId: any;
    longitude: any;
    tripDetailsLength: number;
    model: any;
    constructor(
        private restService: RestService,
        public dialogRef: MatDialogRef<SearchFleetDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }



    onNoClick(): void {
        this.dialogRef.close();
    }


    ngOnInit() {
        this.getVehicleTripHistory();
    }

    ngAfterViewInit() {
        this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
            credentials: 'AiEsUmLefI71UtYUSlMa1svuDHQbAWnWi-nqwzvhpZmqUI1YN6651ntoRQWEsZCc',
            zoom: 10
            });
    }

    /*Function to get Trip History for a particular Vehicle*/
    getVehicleTripHistory = function() {
        this.tripId = this.data.selectedTripForDetailsId;
        this.tenantId = this.data.tenantIdDetails;
        this.loading = true;
        this.model = {};

        var URL = '/' + this.tenantId + '/trips/' + this.tripId;
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.tripDetails = resp.body.data;
                    this.tripCommonId = this.tripDetails.commonId;
                    console.log("this.tripDetails", this.tripDetails);
                    this.vehicleId = this.tripDetails.vehicleId;
                    if (this.tripDetails.locationDetails.length != 0 && this.tripDetails.locationDetails.length>2) {
                        this.latitude = parseFloat(this.tripDetails.locationDetails[0].latitude);
                        this.longitude = parseFloat(this.tripDetails.locationDetails[0].longitude);
                        this.getCoordinates(this.tripDetails);
                    }
                   
                    
                    
                    this.getVehicleTripHistoryDetails(this.vehicleId);

                } else {
                    this.loading = false;

                }
            }, error => {
                this.loading = false;
            })
    }

    /*Function to get details of the trip for a particular Vehicle*/
    getVehicleTripHistoryDetails = function(vehicleId) {
        this.loading = true;
        this.tripId = this.data.selectedTripForDetailsId;
        this.tenantId = this.data.tenantIdDetails;
        this.model = {};
        var URL = '/' + this.tenantId + '/vehicleHistory?vehicleId=' + vehicleId + '&order=asc&tripId=' + this.tripCommonId + '&limit=0';
        this.tripDetailsOfVehicleZero.EngineSerialNo = "NA";
        this.tripDetailsOfVehicleZero.EngineVIN = "NA";
        this.tripDetailsOfVehicleZero.Odometer = "NA";
       
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.tripDetailsOfVehicle = resp.body.data;
                    console.log("this.tripDetailsOfVehicle", this.tripDetailsOfVehicle);
                    this.tripDetailsOfVehicleZero = this.tripDetailsOfVehicle[0].data;
                    this.FaultSPN = this.tripDetailsOfVehicleZero.FaultSPN;
                    this.FaultDescription = this.tripDetailsOfVehicleZero.FaultDescription;
                    this.vehicleDataToBeDisplayed(this.tripDetailsOfVehicle);

                } else {
                    this.loading = false;

                }
            }, error => {
                this.loading = false;
            })
    }

    /*Function to process the data and calculating average values of parameters */
    vehicleDataToBeDisplayed = function(tripDetailsOfVehicle) {
        this.loading = true;
        this.tripDetailsLength = tripDetailsOfVehicle.length;
        if (this.tripDetailsLength > 10) {
            this.incrementBy = Math.floor((this.tripDetailsLength) / 10);
        }
        else {
            this.incrementBy = 1;
        }
        
        this.tripDetailsOfVehicleAtStart = tripDetailsOfVehicle[0];
        this.tripDetailsOfVehicleAtEnd = tripDetailsOfVehicle[this.tripDetailsLength - 1];
        this.endOdometer = this.tripDetailsOfVehicleAtEnd.data.Odometer;
        for (var i = 0; i < this.tripDetailsLength; i += this.incrementBy) {

            if (tripDetailsOfVehicle[i] && tripDetailsOfVehicle[i].data) {
                if (tripDetailsOfVehicle[i].data.RPM != -1 && tripDetailsOfVehicle[i].data.RPM !== 'NA') {
                    this.rpm += tripDetailsOfVehicle[i].data.RPM;
                }
                if (tripDetailsOfVehicle[i].data.Speed != -1 && tripDetailsOfVehicle[i].data.Speed !== 'NA') {
                    this.vehicleSpeed += tripDetailsOfVehicle[i].data.Speed;
                }
                if (tripDetailsOfVehicle[i].data.PctLoad != -1 && tripDetailsOfVehicle[i].data.PctLoad !== 'NA') {
                    this.pctLoad += tripDetailsOfVehicle[i].data.PctLoad;
                }
                if (tripDetailsOfVehicle[i].data.PctTorque != -1 && tripDetailsOfVehicle[i].data.PctTorque !== 'NA') {
                    this.pctTorque += tripDetailsOfVehicle[i].data.PctTorque;
                }
                if (tripDetailsOfVehicle[i].data.EngineCrankcasePressure != -1 && tripDetailsOfVehicle[i].data.EngineCrankcasePressure !== 'NA') {
                    this.engineCrankcasePressure += tripDetailsOfVehicle[i].data.EngineCrankcasePressure;
                }
                if (tripDetailsOfVehicle[i].data.EngineIntakeManifoldTemp != -1 && tripDetailsOfVehicle[i].data.EngineIntakeManifoldTemp !== 'NA') {
                    this.engineIntakeManifoldTemp += tripDetailsOfVehicle[i].data.EngineIntakeManifoldTemp;
                }
                if (tripDetailsOfVehicle[i].data.OilTemp != -1 && tripDetailsOfVehicle[i].data.OilTemp !== 'NA') {
                    this.oilTemp += tripDetailsOfVehicle[i].data.OilTemp;
                }
                if (tripDetailsOfVehicle[i].data.AirIntakeTemperature != -1 && tripDetailsOfVehicle[i].data.AirIntakeTemperature !== 'NA') {
                    this.airIntakeTemperature += tripDetailsOfVehicle[i].data.AirIntakeTemperature;
                }
                if (tripDetailsOfVehicle[i].data.AmbientTemp != -1 && tripDetailsOfVehicle[i].data.AmbientTemp !== 'NA') {
                    this.ambientTemp += tripDetailsOfVehicle[i].data.AmbientTemp;
                }
                if (tripDetailsOfVehicle[i].data.OilPressure != -1 && tripDetailsOfVehicle[i].data.OilPressure !== 'NA') {
                    this.oilPressure += tripDetailsOfVehicle[i].data.OilPressure;
                }
                if (tripDetailsOfVehicle[i].data.BarometricPressure != -1 && tripDetailsOfVehicle[i].data.BarometricPressure !== 'NA') {
                    this.barometricPressure += tripDetailsOfVehicle[i].data.BarometricPressure;
                }
                if (tripDetailsOfVehicle[i].data.TotalNoOfActiveRegenerations != -1 && tripDetailsOfVehicle[i].data.TotalNoOfActiveRegenerations !== 'NA') {
                    this.totalNoOfActiveRegenerations += tripDetailsOfVehicle[i].data.TotalNoOfActiveRegenerations;
                }
                if (tripDetailsOfVehicle[i].data.TotalNoOfPassiveRegenerations != -1 && tripDetailsOfVehicle[i].data.TotalNoOfPassiveRegenerations !== 'NA') {
                    this.totalNoOfPassiveRegenerations += tripDetailsOfVehicle[i].data.TotalNoOfPassiveRegenerations;
                }
                if (tripDetailsOfVehicle[i].data.SCRInletNox != -1 && tripDetailsOfVehicle[i].data.SCRInletNox !== 'NA') {
                    this.scrInletNox += tripDetailsOfVehicle[i].data.SCRInletNox;
                }
                if (tripDetailsOfVehicle[i].data.SCROutletNox != -1 && tripDetailsOfVehicle[i].data.SCROutletNox !== 'NA') {
                    this.scrOutletNox += tripDetailsOfVehicle[i].data.SCROutletNox;
                }
                if (tripDetailsOfVehicle[i].data.DPFPressureDifferential != -1 && tripDetailsOfVehicle[i].data.DPFPressureDifferential !== 'NA') {
                    this.dpfPressureDifferential += tripDetailsOfVehicle[i].data.DPFPressureDifferential;
                }
                if (tripDetailsOfVehicle[i].data.DPFSootLoad != -1 && tripDetailsOfVehicle[i].data.DPFSootLoad !== 'NA') {
                    this.dpfSootLoad += tripDetailsOfVehicle[i].data.DPFSootLoad;
                }
                if (tripDetailsOfVehicle[i].data.DPFOutletTemp != -1 && tripDetailsOfVehicle[i].data.DPFOutletTemp !== 'NA') {
                    this.dpfOutletTemp += tripDetailsOfVehicle[i].data.DPFOutletTemp;
                }
                if (tripDetailsOfVehicle[i].data.DPFInletTemp != -1 && tripDetailsOfVehicle[i].data.DPFInletTemp !== 'NA') {
                    this.dpfInletTemp += tripDetailsOfVehicle[i].data.DPFInletTemp;
                }
                if (tripDetailsOfVehicle[i].data.DPFAshLoad != -1 && tripDetailsOfVehicle[i].data.DPFAshLoad !== 'NA') {
                    this.dpfAshLoad += tripDetailsOfVehicle[i].data.DPFAshLoad;
                }

            }




        }
        this.rpm = Math.floor(this.rpm / 10);
        this.vehicleSpeed = Math.floor(this.vehicleSpeed / 10);
        this.loading = false;

    }

    /*Function to get the co-ordinates of longitude and latitude to plot a polyline*/
    getCoordinates = function(tripDetails) {
        if (tripDetails.locationDetails && tripDetails && tripDetails.locationDetails != 0) {
            for (var i = 0; i < tripDetails.locationDetails.length; i++) {
                this.latitudeValue = parseFloat(tripDetails.locationDetails[i].latitude);
                this.longitudeValue = parseFloat(tripDetails.locationDetails[i].longitude);
                if (i == 0 || i == (tripDetails.locationDetails.length - 1)) {
                    this.coordinatesStartEnd.push({ "latitude": parseFloat(tripDetails.locationDetails[i].latitude), "longitude": parseFloat(tripDetails.locationDetails[i].longitude) });
                }
                this.coordinates.push({ "latitude": parseFloat(tripDetails.locationDetails[i].latitude), "longitude": parseFloat(tripDetails.locationDetails[i].longitude) });
            }
            console.log("this.map", this.map);
            var line = new Microsoft.Maps.Polyline(this.coordinates, {
                strokeColor: 'black',
                strokeThickness: 3 
            });
            var pinStart = new Microsoft.Maps.Pushpin(this.coordinates[0]);
            var pinEnd = new Microsoft.Maps.Pushpin(this.coordinates[this.coordinates.length-1]);
            //Add the polyline to map
            this.map.entities.push(pinStart);
            this.map.entities.push(pinEnd);
            this.map.entities.push(line);
            this.map.setView({ center: this.coordinates[0]});
        }
    }

}
