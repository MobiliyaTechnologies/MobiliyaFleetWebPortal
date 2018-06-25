import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-fleet',
  templateUrl: './add-fleet.component.html',
  styleUrls: ['./add-fleet.component.css']
})
export class AddFleetComponent implements OnInit {

  public loading = false;
    selectedItem: any = {};
    roles: any = [];
    currentUserInfo: any = {};
    currentRole = "";
    addFleetModel: any = {};
    fleetOwnerRoleId="";
    userList : any=[];
    //Default vehicle list
    vehicleList=[{"id":"25a50932-0bb4-41d5-87b8-7e394b78ed15","brandName":"Audi","model":"S7","fuelType":"Petrol","registrationNumber":"MH12MG9845","geoFencing":null,"yearOfManufacture":"2018","color":"White","userId":"8c4a9dda-4f19-4c7c-9609-9b7e6c72cc15","deviceId":null,"fleetId":null,
    "isDeleted":0,"status":"Active","createdAt":"2018-03-27T03:22:51.129Z","updatedAt":"2018-03-27T03:22:51.129Z","checked":false},{"id":"5cc3705d-1692-4739-9b4a-c0d515c798a6","brandName":"Audi","model":"X10","fuelType":"Diesel","registrationNumber":"MH12MG8864","geoFencing":"GeoFence 02","yearOfManufacture":"2018","color":null,"userId":null,"deviceId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4","fleetId":null,"isDeleted":0,"status":"Active","createdAt":"2018-04-03T11:24:37.169Z","updatedAt":"2018-04-03T11:24:37.169Z","checked":false},{"id":"879729fb-ff84-4db8-8115-84f492b06f33","brandName":"Audi","model":"X10","fuelType":"Diesel","registrationNumber":"MH12MG8832","geoFencing":"GeoFence 02","yearOfManufacture":"2018","color":null,"userId":null,"deviceId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4","fleetId":null,"isDeleted":0,"status":"Active","createdAt":"2018-04-03T10:04:52.328Z","updatedAt":"2018-04-03T10:04:52.328Z","checked":false}];

    selectedVehicleList=new MatTableDataSource();
    displayedColumns=[];
    private paginator: MatPaginator;
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }
    setDataSourceAttributes() {
        this.selectedVehicleList.paginator = this.paginator;
    }
    //name = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z_.-]{2,50}$')]));
    name = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z ]+$'), Validators.minLength(3), Validators.maxLength(30)]));
    owner = new FormControl('', [Validators.required]);

    modalRef: BsModalRef;
    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'name') {
            if(this.name.hasError('required'))
                return 'You must enter a valid fleet name';
            if(this.name.hasError('pattern'))
                return 'Fleet Name must contain only alphabets, numbers and space';
            if (this.name.hasError('minlength'))
                return 'Fleet Name should be at least 3 characters';
            if (this.name.hasError('maxlength'))
                return 'Fleet Name should be at most 30 characters';
        }
        if (field.toLowerCase() === 'owner') {
            return this.owner.hasError('required') ? 'You must select owner' : '';
        }
    }

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private modalService: BsModalService,
        private _location: Location
    ) { 
        
    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.currentRole = this.currentUserInfo.currentRole;
        this.getUnassignedVehicles()
        this.getRoles();
    }
    ngAfterViewInit() {
        this.selectedVehicleList.paginator = this.paginator;
    }

    /**
     * Retrieve all roles to filter out fleet admins
     */
    getRoles=function(){
        let self=this;
        this.loading = true;
        this.restService.makeCall('Users', 'GET', '/roles',{} )
            .subscribe(resp => {
                //this.loading = false;
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.roles = resp.body.data;
                    //find fleet owner role id .. and fetch fleet owners
                    this.roles.forEach(function(item){
                        if(item.roleName.toLowerCase()=='fleet admin'){
                            self.fleetOwnerRoleId=item.id;
                            self.getTenantUsers();
                        }
                    })
                }
                else if(resp && !(resp.type==0)){
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                //this.toastr.error('Error getting list');
            });
    }
    
    /**
     * Store metadata of fleet before start fleet add
     */
    addFleetStart = function () {
        this.addFleetModel = {};
        this.name.reset();
        this.owner.reset();
    }

    /**
     * Check button click validations for add fleet
     */
    checkValidations() {
        return new Promise((resolve, reject) => {
            if (this.name.invalid || this.owner.invalid) {
                if (this.name.invalid) {
                    this.name.markAsTouched();
                }
                if (this.owner.invalid) {
                    this.owner.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /**
     * Form object to display in fleet owner dropdown
     */
    formObj=function(userList){
        userList.forEach(function(item){
            if(item.firstName)
                item.name=item.firstName+ ' '+item.lastName;
            if(item.lastName)
                item.name=item.name+ ' '+item.lastName; 
        });
        this.userList=this.userList.filter(opt => (!opt.fleetId || opt.fleetId==null || opt.fleetId==""))
        .map(opt => opt);
    }

    /**
     * retrieve fleet owners of current tenant
     */
    getTenantUsers=function(){
        this.loading = true;
        let filter="";
        if(this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id){
            if(this.fleetOwnerRoleId && this.fleetOwnerRoleId!=""){
                filter=filter+"?roleId="+this.fleetOwnerRoleId;
            }
        }
        this.restService.makeCall('Users','GET','/users'+filter, this.model)
            .subscribe(resp => {
                //
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.userList = resp.body.data;
                    this.formObj(this.userList); 
                }
                else if(resp && !(resp.type==0)){
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * Retrieve list of vehicles which are not assigned to any fleet
     */
    getUnassignedVehicles=function(){
        this.loading = true;
        let filter="";
        let tenantFilter="";
        filter='?isFleetUnassigned=true';
        if(this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantFilter='/'+this.currentUserInfo.Tenant.id;
        this.restService.makeCall('Fleets','GET',tenantFilter+'/vehicles'+filter, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.vehicleList = resp.body.data;  
                }   
                else if(resp && !(resp.type==0)){
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * Add fleet API call
     */
    addFleet= function () {
        this.checkValidations()
            .then(() => {
                let addModel: any = {};
                addModel.fleetName = this.addFleetModel.name;
                addModel.fleetAdminId = this.addFleetModel.userId;
                addModel.vehicleIdList=this.selectedOptions;
                let api = '/'+this.currentUserInfo.Tenant.id+'/fleets';
                this.loading = true;
                this.restService.makeCall('Fleets', 'POST', api, addModel)
                    .subscribe(resp => {
                        if (resp && resp.body && resp.body.data) {
                            this.loading = false;
                            this.toastr.success('Fleet Information added successfully.');
                            if(resp.body.data.id)
                            this.router.navigate(['/dashboard/fleets/details/'+resp.body.data.id]);
                        }
                        else if (resp && resp.length == 0) {
                            this.loading = false;
                            //this.toastr.error('Fleet Name already exists');
                            this.addFleetStart();
                        }
                    }, error => {
                        this.loading = false;
                    });
            }).catch(() => {
                this.loading = false;
                //this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });


    }

    /**
     * Assign vehicles to fleet
     */
    assignVehicle=function(){
        this.selectedOptions=this.getSelectedOptions();
        this.selectedVehicleList=new MatTableDataSource(this.vehicleList
                .filter(opt => opt.checked==true)
                .map(opt => opt));
        this.selectedVehicleList.paginator = this.paginator;
        this.displayedColumns = ['#', 'vehicleModel', 'vehicleRegNo', 'Action'];
        if(this.selectedVehicleList.data.length<=0){
            this.toastr.error('Please select vehicle to assign');
            return;
        }
        else 
        this.modalRef.hide();
    }

    handleChange =function(){
        
    }

    /**
     * Get selected vehicles from list of unassigned vehicles
     */
    getSelectedOptions() { // right now: ['1','3']
        return this.vehicleList
                .filter(opt => opt.checked==true)
                .map(opt => opt.id)
    }

    cancelAdd= function () {
        this._location.back();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    removeFromTable=function(id){
         this.selectedVehicleList=new MatTableDataSource(this.selectedVehicleList.data
                .filter(opt => opt.id!=id)
                .map(opt => opt));
         this.selectedOptions=this.selectedOptions
                .filter(opt => opt!=id)
                .map(opt => opt);
        let itemIndex = this.vehicleList.findIndex(item => item.id == id);
         this.vehicleList[itemIndex].checked=!this.vehicleList[itemIndex].checked;

    }

}
