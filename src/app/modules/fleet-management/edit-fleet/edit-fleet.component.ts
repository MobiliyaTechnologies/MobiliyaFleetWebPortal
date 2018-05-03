import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-fleet',
  templateUrl: './edit-fleet.component.html',
  styleUrls: ['./edit-fleet.component.css']
})
export class EditFleetComponent implements OnInit {

  public loading = false;
  selectedItem: any = {};
  currentUserInfo: any = {};
  currentRole = "";
  fleetDetails:any={};
  fleetOwner:any={};
  fleetList:any=[];
  selection = new SelectionModel(true, []);
  selectedFleet:string;

  selectedVehicleList=new MatTableDataSource();
  displayedColumns = ['select','#', 'vehicleModel', 'vehicleRegNo', 'OwnerName','connectedDongle'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @Output() someEvent = new EventEmitter();

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
      private modalService: BsModalService,
      private _location: Location
  ) {
      this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.currentRole = this.currentUserInfo.currentRole;
      this.route.params.subscribe(params => {
          //this.param1 = params['token'];
          this.selectedItem.id = params['id'];
          if(this.selectedItem){
            this.getFleetList();
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

  /**
   * Map device and driver names with vehicle
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

  /**
   * Get selected vehicle list by fleet id
   */
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
                    this.selectedVehicleList = new MatTableDataSource(resp.body.data);
                    this.setDeviceAndDriverName(this.selectedVehicleList.data);
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting user info');
            })
  }  

  /**
   * Retrieve fleet owner list
   */
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
                //this.toastr.error('Error getting fleet owner info');
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting fleet owner info');
        })
  }  

  /**
   * Retrieve fleet details by fleet id
   */
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
              else if(resp && !(resp.type==0)){
                this.loading = false;
              }
          }, error => {
              this.loading = false;
              this.toastr.error('Error getting fleet info');
          })
  }

/** 
 * get fleet List and extra calls for edit
 * 
*/

 getFleetList=function(){
    this.loading = true;
    let tenantId = "";
    if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
        tenantId = this.currentUserInfo.Tenant.id;
    this.restService.makeCall('Fleets', 'GET', '/' + tenantId +'/Fleets', this.model)
        .subscribe(resp => {

            if (resp.body && resp.body.data) {
                this.loading = false;
                //remove current fleet from list
                this.fleetList = resp.body.data.filter(item=>item.id!=this.selectedItem.id).map(item=>item);
            }
            else if(resp && !(resp.type==0)){
                this.loading = false;
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error fetching fleet List');
        })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.selectedVehicleList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.selectedVehicleList.data.forEach(row => this.selection.select(row));
  }

  /**
   * update fleet: move vehicles from one fleet to other or delete vehicle from current fleet
   */
  updateFleet=function(flag,fleetId){
      this.loading = true;
      if(flag)
        fleetId=this.selectedItem.id
      let tenantId = "";
      let updateVehicleModel:any={};
      updateVehicleModel.vehicleIdList=this.selection.selected.map(opt=>opt.id);
      updateVehicleModel.isVehicleRemove=flag;
      if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
          tenantId = this.currentUserInfo.Tenant.id;
          
      this.restService.makeCall('Fleets', 'PUT', '/' + tenantId +'/fleets/'+fleetId, updateVehicleModel)
          .subscribe(resp => {
              if (resp.body && resp.body.data) {
                  this.loading = false;
                  if(flag)
                    this.toastr.success('Vehicles removed successfully from fleet');
                  else
                    this.toastr.success('Vehicles Moved successfully to another fleet');
                  //this.router.navigate(['/dashboard/fleets']);
                  this.router.navigate(['/dashboard/fleets/details/'+fleetId]);
              }
          }, error => {
              this.loading = false;
              this.toastr.error('Error getting fleet info');
          })
  }

/*Fleet(move vehicles to) select Modal*/
    modalRef: BsModalRef;
    removeVehicleFromFleet=function(){
        this.updateFleet(true,null);
    }

    moveVehiclesToFleet=function(){
        this.updateFleet(false,this.selectedFleet);
       // this.displayedColumns = ['#', 'vehicleModel', 'vehicleRegNo', 'OwnerName','connectedDongle','Action'];
       
    }

    cancelEdit= function () {
        this._location.back();
        //this.router.navigate(['/dashboard/fleets']);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
  /*Fleet(move vehicles to) select Modal*/

}
