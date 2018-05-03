import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, Input, Output, EventEmitter,TemplateRef  } from '@angular/core';
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
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {

  public loading = false;
  selectedItem: any = {};
  currentUserInfo: any = {};
  currentRole = "";
  fleetDetails:any={};
  fleetOwner:any={};
  selectedVehicleList=new MatTableDataSource();
  displayedColumns = ['#', 'vehicleModel', 'vehicleRegNo', 'OwnerName','connectedDongle'];
  modalRef: BsModalRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() someEvent = new EventEmitter();

  callParent=function() {
      this.someEvent.next();
  }


  constructor(
      private router: Router,
      private restService: RestService,
      private renderer2: Renderer2,
      private toastr: ToastrService,
      private globals: Globals,
      private vs: ValdationsService,
      private route: ActivatedRoute,
      private modalService: BsModalService
  ) {
      this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.currentRole = this.currentUserInfo.currentRole;
      this.route.params.subscribe(params => {
          this.selectedItem.id = params['id'];
          if(this.selectedItem){
            this.getFleetDetails(this.selectedItem.id);
            this.getAssociatedVehicles(this.selectedItem.id);
          }
          else
            this.toastr.error('Error getting fleet information, Please try agian');
      });
  }

  ngOnInit() {


  }
  ngAfterViewInit() {
      this.selectedVehicleList.paginator = this.paginator;
  }



  navigateToEdit = function () {
      let route="/dashboard/fleets/edit/"+this.selectedItem.id;
      this.router.navigate([route]);
  }

  /**
  Fleet Details
  */

setDeviceAndDriverName(vehicleList){
      vehicleList.forEach(element => {
            if(element.Device && element.Device.deviceName){
                element.deviceName=element.Device.deviceName;
            }          
            else{
                element.deviceName="";
            }
            if(element.Driver && element.Driver.firstName){
                element.ownerName=element.Driver.firstName;
                if(element.Driver.lastName)
                    element.ownerName=element.ownerName + ' ' +element.Driver.firstName;
            }          
            else{
                element.ownerName="";
            }
      });
  }

  getAssociatedVehicles = function (id) {
      this.loading = true;
        let tenantId = "";
        let fleetIdFilter="";
        if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantId = this.currentUserInfo.Tenant.id;
        if(id)
            fleetIdFilter="?fleetId="+id;
        this.restService.makeCall('Fleets', 'GET', '/' + tenantId +'/vehicles' + fleetIdFilter, this.model)
            .subscribe(resp => {

                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedVehicleList = resp.body.data;
                    this.setDeviceAndDriverName(this.selectedVehicleList);
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting user info');
            })
  }  

  getFleetOwner = function (id) {
      this.loading = true;
      this.restService.makeCall('Users', 'GET', '/users/' + id, this.model)
        .subscribe(resp => {

            if (resp.body && resp.body.data) {
                this.loading = false;
                this.fleetOwner = resp.body.data;
            }
            else if(resp && !(resp.type==0)){
                this.loading = false;
                this.toastr.error('Error getting fleet owner info');
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting fleet owner info');
        })
  }  


  getFleetDetails = function (id) {
      this.loading = true;
        let tenantId = "";
        if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantId = this.currentUserInfo.Tenant.id;
        this.restService.makeCall('Fleets', 'GET', '/' + tenantId +'/fleets/' + id, this.model)
            .subscribe(resp => {

                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data;
                    this.getFleetOwner(this.selectedItem.fleetAdminId);
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting fleet info');
            })
  }

  /*Fleet details ends */

  /* Edit fleet Ends here*/
  /* delete fleet */
  deleteFleet = function (id) {
      this.loading = true;
      let tenantId = "";
      if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
          tenantId = this.currentUserInfo.Tenant.id;

      this.restService.makeCall('Fleets', 'DELETE', '/' + tenantId+ '/fleets/' + id, this.model)
          .subscribe(resp => {
              if (resp && resp.body) {
                  this.loading = false;
                  this.toastr.success('Fleet Information deleted successfully.');
                  this.router.navigate(['/dashboard/fleets']);
                }
                else if(resp && resp.length == 0){
                    this.loading=false;
                    this.toastr.pop("Unable to delete fleet. Please try again later.");
                }

          }, error => {
              this.loading = false;
              this.toastr.error('Error deleting data');
          });
  }
  /*delete fleet ends*/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }   

}
