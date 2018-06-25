import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { VehicleTripHistoryDetailsComponent } from '../vehicle-trip-history-details/vehicle-trip-history-details.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-vehicle-trip-history',
  templateUrl: './vehicle-trip-history.component.html',
  styleUrls: ['./vehicle-trip-history.component.css']
})
export class VehicleTripHistoryComponent implements OnInit {
    selectedTripForColourChange: any;
    tenantId: any;
    latlng: any;
    address: any;
    selectedItemForClass: any;
    public loading = false;
    selectedTripForDetailsId: any = {};
    noTrip: false;
    currentUserInfo: any;
    selectedItem: any = {};
    selectedTrip: any = {};
    tripList: any = [];
    model: any = {};
    constructor(
        private restService: RestService,
        private dialogDetails: MatDialog,
        private route: ActivatedRoute
    ) {

        this.route.params.subscribe(params => {
            this.selectedItem.id = params['id'];
        });
    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.getTripHistory(this.selectedItem.id);
  }
    /*Function to get List of trips for a particular vehicle*/
    getTripHistory = function (id) {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        var URL = '/' + this.tenantId + '/trips?vehicleId=' + id;
        console.log(URL);
        this.restService.makeCall('Trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data && resp.body.data.length != 0) {
                    this.loading = false;
                    this.noTrip = false;
                    this.tripList = resp.body.data;
                    console.log("this.triplist", this.tripList);
                    this.selectedTrip = this.tripList[0].commonId;
                    this.selectedTripForColourChange = this.tripList[0].commonId;
                }
                else {
                    this.noTrip = true;
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                //this.toastr.error('Error getting list');

            });

    }

     /*Function to navigate to the details dialog of a particular trip*/
    openTripDetailsDialog(commonId): void {
        this.selectedTripForColourChange = commonId;
        console.log("common Id", commonId);
        let dialogRef = this.dialogDetails.open(VehicleTripHistoryDetailsComponent, {
            width: '1800px',
            data: {
                selectedTripForDetailsId: commonId,
                tenantIdDetails: this.tenantId
            },
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

}
