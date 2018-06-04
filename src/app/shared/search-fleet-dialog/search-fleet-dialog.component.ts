import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { concat } from 'rxjs/operator/concat';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../../services/rest-service/rest-service.service';

@Component({
  selector: 'app-search-fleet-dialog',
  templateUrl: './search-fleet-dialog.component.html',
  styleUrls: ['./search-fleet-dialog.component.css']
})
export class SearchFleetDialogComponent implements OnInit {
    
    fleetListToReturn: any = {};
    model: any = {};
    tenantId = "";
    defaultChecked = true;
    defaultNotChecked = false;
    fleetId: number;
    checkedFleetList: Array<{ fleetId: number}> = [];
    fleetList: any = [];
    allVehicles: Object = {"id":"0","fleetName":"All Vehicles"};
    myModel = true;

    ngOnInit(): void {
        this.getFleetList()
    }

    constructor(
        private toastr: ToastrService,
        private restService: RestService,
        public dialogRef: MatDialogRef<SearchFleetDialogComponent >,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }


    getFleetList() {     
        this.checkedFleetList = [];
        this.tenantId = this.data.tenantIdForFleetList;
        console.log("tenantId" + this.tenantId);
        var URL = '/' + this.tenantId + '/fleets';
                console.log(URL);
                this.restService.makeCall('fleets', 'GET', URL, this.model)
                    .subscribe(resp => {
                        
                            if (resp.body && resp.body.data) {
                                this.fleetList = resp.body.data; 
                            } 
                    })         
     
    }

    getSelectedVehiclesOf = function (Id) {
        if (this.checkedFleetList.length != 0) {
            for (var i = 0; i < this.checkedFleetList.length; i++) {
                if (this.checkedFleetList[i].fleetId == Id) {
                    this.checkedFleetList.splice(i,1);
                    console.log("True!!")
                }
                else {
                    this.checkedFleetList.push({ fleetId: Id });
                }
            }

        }
        else {
            this.checkedFleetList.push({ fleetId: Id });
        }
    }

    sendData = function() {
        this.dialogRef.close(this.checkedFleetList);
    }

    changeDefaultToFalse = function () {
        this.defaultChecked = false;
    }
   
    changeEverythingElseToFalse = function () {
        this.defaultChecked = true;
    }

}


