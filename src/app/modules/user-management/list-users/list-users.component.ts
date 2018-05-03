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
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})

export class ListUsersComponent implements OnInit, AfterViewInit {
    @ViewChild('addFormComp') addFormComp: any;
    public loading = false;
    model: any = {};
    userList: any = [];
    tenantList: any[];
    selectedItem: any = {};
    selectedItemForClass = {};
    addUserModel: any = {};
    selectedFilter: any = { 'roleName': 'All users', 'id': -1 };
    temp: any = {};
    roles :any = [];    
    selectedUserRole: any = {};
    tenantRoleId: any;
    driverRoleId: any;
    fleetRoleId:any;
    currentUserInfo: any = {};
    currentRole = "";
    fleetList:any=[];

    email = new FormControl('', [Validators.required, Validators.email]);
    name = new FormControl('', [Validators.required]);
    mobileNumber = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.minLength(10),Validators.maxLength(13)]));
    tenantCompanyName = new FormControl('', [Validators.required]);
    roleName = new FormControl('', [Validators.required]);
    licenseNumber = new FormControl('',  Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z]{4,20}$')]));
    tenantFleetName= new FormControl('', [Validators.required]);

    modalRef: BsModalRef;

    /**
     * Returns field specific error messages 
     */
    getErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'email') {
            return this.email.hasError('required') ? 'You must enter a value' :
                this.email.hasError('email') ? 'Not a valid email' : '';
        }
        else if (field.toLowerCase()==='name') {
            return this.name.hasError('required') ? 'You must enter a value' :
                this.name.hasError('name') ? 'Not a valid name' : '';
        }
        else if (field.toLowerCase() === 'mobilenumber'){
            if(this.mobileNumber.hasError('required'))
                return 'You must enter a value';
            if(this.mobileNumber.hasError('minlength'))
                return 'Mobile Number should be at least 10 digits';
            if(this.mobileNumber.hasError('pattern'))
                return 'Please enter valid Mobile Number'
            if(this.mobileNumber.hasError('maxlength'))
                return 'Mobile Number should be at most 13 digits';
        }
        else if (field.toLowerCase() === 'tenantcompanyname') {
            return this.tenantCompanyName.hasError('required') ? 'You must select a value' : '';
        }
        else if (field.toLowerCase() === 'rolename') {
            return this.roleName.hasError('required') ? 'You must select a value' : '';
        }
        else if (field.toLowerCase() === 'tenantfleetname') {
            return this.tenantFleetName.hasError('required') ? 'You must select a value' : '';
        }
        else if (field.toLowerCase() === 'licensenumber') {
            if(this.licenseNumber.hasError('required'))
                return 'You must enter a value';
            if(this.licenseNumber.hasError('pattern'))
                return 'Please enter valid License Number';
        }
    }

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private modalService: BsModalService
    ) { 
        
    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.getAllUnassignedVehicleList();
        this.currentRole = this.currentUserInfo.currentRole;
    }
    ngAfterViewInit() {
        this.getRoles();
    }

    formObj = function (selectedUser) {
        let self = this;
        selectedUser.name = selectedUser.firstName + " " + selectedUser.lastName; 
        this.roles.forEach(function (item) {
            if (self.tenantRoleId === selectedUser.roleId) {
                selectedUser.roleName = 'Tenant Admin';
            }
            else
            if (item.id === selectedUser.roleId) {
                selectedUser.roleName = item.roleName;
            }
        })
    }

    formObjList = function (users) {
        let self = this;
        users.forEach(function (item) {
            self.formObj(item);
        });
        
    }

    /**
     list Users Functions
     */
    /**
     * Retrieves list of users based on role filter
     */
    getUsers(): void {
        this.loading = true;
        let filter = "";

        /*Role based filter*/
        if (this.currentRole && (this.currentRole.toLowerCase() === 'fleet admin') ){
            if(this.currentUserInfo.fleetId){
                filter = '?fleetId=' + this.currentUserInfo.fleetId;
            }
            else{
                this.loading = false;
                this.toastr.error('No Users available.')
                return;
            }
        }
        else if (this.currentRole && this.currentUserInfo.Tenant && (this.currentRole.toLowerCase() === 'tenant admin') ){
            filter = '?tenantId=' + this.currentUserInfo.Tenant.id;
        }
        this.restService.makeCall('Users','GET','/users'+filter,this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.userList = resp.body.data;
                    if(this.userList && this.userList.length>0){
                        this.selectedItemForClass = this.userList[0];
                        this.selectedItem = this.userList[0];
                        this.getUserDetails(this.selectedItem.id);
                        this.formObjList(this.userList);
                        this.mapTenant();
                    }
                    else{
                        this.toastr.error("No Users available");
                    }
                }
                
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * Sets filter to selected role, which is used in angular filter
     */
    filterUser = function (role) {
        this.selectedFilter.roleName = role.roleName;
        this.selectedFilter.roleId = role.id;
    }
    /* list users ends */

    /**
    User Details
    */
    getUserDetails = function (id) {
        this.addForm = false;
        this.editForm = false; 
        this.loading = true;
        this.model = {};
        this.restService.makeCall('Users','GET','/users/'+id,this.model)
            .subscribe(resp => {
                
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data;
                    this.formObj(this.selectedItem);
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting user info');
            })    
    }

    /*User details ends */

    /*Edit User*/
    /**
     * Remove super admin role from roles list
     */
    removeSuperAdminRole = function () {
        for (var i = this.roles.length - 1; i >= 0; --i) {
            this.roles[i].roleName=this.roles[i].roleName.charAt(0).toUpperCase()+this.roles[i].roleName.slice(1);
            if (this.roles[i].roleName.toLowerCase() == "super admin") {
                this.roles.splice(i, 1);
            }
        }
    }

    /**
     * Remove tenant admin role from roles list
     */
    removeTARole = function () {
        for (var i = this.roles.length - 1; i >= 0; --i) {
            if (this.roles[i].roleName.toLowerCase() == "tenant admin") {
                this.tenantRoleId = this.roles[i].id;
                this.roles.splice(i, 1);
            }
        }
    }

    /**
     * Remove fleet admin role from role list
     */
    removeRolesForFleetAdmin= function () {
        for (var i = this.roles.length - 1; i >= 0; --i) {
            if (this.roles[i].roleName.toLowerCase() == "tenant admin"  ) {
                this.tenantRoleId = this.roles[i].id;
                this.roles.splice(i, 1);
            }
            else if( this.roles[i].roleName.toLowerCase() == "fleet admin"){
                this.roles.splice(i, 1);
            }
        }
    }

    /**
     * retrieves roles list and added role based masking
     */
    getRoles = function () {
        this.loading = true;
        this.restService.makeCall('Users', 'GET', '/roles', this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.roles = resp.body.data;
                    this.removeSuperAdminRole();
                    if (this.currentRole.toLowerCase() === 'tenant admin') {
                        this.removeTARole();
                        //get fleets of current tenant
                        if(this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
                            this.getFleetList(this.currentUserInfo.Tenant.id);
                    }
                    else if (this.currentRole.toLowerCase() === 'fleet admin') {
                        this.removeRolesForFleetAdmin();
                    }
                    this.getUsers();
                    this.mapRoleNames();
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * Stores metadata before edit
     */
    startEdit = function () {
        this.temp = JSON.parse(JSON.stringify(this.selectedItem))
    }
    cancelEdit = function () {
        this.editForm = false;
        this.selectedItem = JSON.parse(JSON.stringify(this.temp))
    }

    /**
     * Updates userList locally after successful update API call
     */
    updateUserInfoLocally=function(user){
        let self=this;
        this.userList.forEach(function(item){
            if(item.id==user.id){
                //copying only updated fields
                for (var key in user) {
                    if (user.hasOwnProperty(key)) {
                        item[key]=user[key];
                    }
                }
                self.selectedItem=item;
            }
        })
    }

    /**
     *  Updates user information
     */
    saveUser = function () {
        this.checkValidations("edit")
            .then(() => {
                this.model = {};
                let nameArray = this.selectedItem.name.split(' ');
                this.model.firstName = nameArray[0].trim();
                this.model.lastName = nameArray[1].trim();
                this.model.mobileNumber = this.selectedItem.mobileNumber.trim();   
                this.restService.makeCall('Users', 'PUT', '/users/'+this.selectedItem.id, this.model)
                    .subscribe(resp => {
                        if (resp.body && resp.body.data) {
                            this.loading = false;
                            this.toastr.success('User Information updated successfully.');
                            //this.getUsers();
                            this.updateUserInfoLocally(resp.body.data);
                            this.addForm = false;
                            this.editForm = false; 
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error saving data');
                    });
            }).catch(() => {
                this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });
    }

    /* Edit User Ends here*/

    /* delete user */
    deleteUser = function (id) {
        this.restService.makeCall('Users', 'DELETE', '/users/' + id, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.toastr.success('User Information deleted successfully.');
                    this.getUsers();
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting data');
            });
    }

    //delete device Model
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }   
    
    /*delete user ends*/

    /**    add user     */
    getFleetList=function(tenantId){
        this.loading = true;
        this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/fleets', this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.fleetList = resp.body.data;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * retrieves all tenant list
     */
    getAllTenants = function () {
        this.loading = true;

        this.restService.makeCall('Users', 'GET', '/tenants', this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.tenantList = resp.body.data;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    /**
     * Filter out userlist based on tenant list
     */
     mapTenant=function(){
         this.tenantUserList=this.userList.filter(item=>item.roleId==this.tenantRoleId).map(item=>item);
     }

     /**
      * Map role names with role Ids
      */
     mapRoleNames = function () {
        let self = this;
        this.roles.forEach(function (item) {
            if (item.roleName.toLowerCase()=== 'tenant admin') {
                self.tenantRoleId = item.id;
                self.getAllTenants();
            }
            else if (item.roleName.toLowerCase() === 'driver') {
                self.driverRoleId = item.id;
            }
            else if(item.roleName.toLowerCase() === 'fleet admin'){
                self.fleetRoleId = item.id;
            }
        })
    }


    /**
     * Filter vehicles By fleetId
     */
    filterVehicles=function(id){
        this.vehicleList=this.vehicleList.filter(opt=> opt.fleetId==id).map(opt=>opt);
    }
    /**
     * Stores metadata and sets initial values before add User action
     */
    addUserStart = function () {
        //Restrict fleet admin from adding users if no fleet is assigned to it
        if(this.currentRole.toLowerCase()=='fleet admin' && !(this.currentUserInfo && this.currentUserInfo.fleetId)){
            this.toastr.error('Cannot add user, as no fleet is assigned');
            return;
        }

        this.addUserModel = {};
        this.email.reset();
        this.mobileNumber.reset();
        this.roleName.reset();
        this.tenantCompanyName.reset();
        this.name.reset();
        if (this.addFormComp && this.addFormComp.form) {
            this.addFormComp.form.markAsPristine();
            this.addFormComp['form']._pristine = true;
        }
            
        this.addForm = true;
    }

    /**
     * Check button click validations for add user
     */
    checkValidations(operation) {
        return new Promise((resolve, reject) => {
            if (this.email.invalid || this.name.invalid
                || this.mobileNumber.invalid || (operation.name === "add" && (this.tenantCompanyName.invalid || this.roleName.invalid)) 
                || (this.driverRoleId==this.addUserModel.roleId && this.licenseNumber.invalid)
                ) {

                if (this.email.invalid) {
                    this.email.markAsTouched();
                }
                if (this.name.invalid) {
                    this.name.markAsTouched();
                }
                if (this.mobileNumber.invalid) {
                    this.mobileNumber.markAsTouched();
                }
                if (this.tenantCompanyName.invalid && operation.name === "add") {
                    this.tenantCompanyName.markAsTouched();
                }
                if (this.roleName.invalid && operation.name === "add") {
                    this.roleName.markAsTouched();
                }
                if (this.licenseNumber.invalid && operation.name === "add") {
                    this.licenseNumber.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }
        });
    }

    /**
     * Add User  
     */
    addUser = function () {
        this.checkValidations("add")
            .then(() => {
                let addModel: any = {};
                let tempNameArray = this.addUserModel.name.split(' ');
                addModel.firstName = tempNameArray[0];
                addModel.lastName = tempNameArray[1];
                addModel.email = this.addUserModel.email;
                addModel.mobileNumber = this.addUserModel.mobileNumber;
                addModel.roleId = this.addUserModel.roleId;
                addModel.licenseNumber = this.addUserModel.licenseNumber;
                
                let api = '/users';
                if (this.currentRole.toLowerCase() === 'super admin') {
                    //If we are adding tenant
                    if (this.tenantRoleId === addModel.roleId) {
                        api = '/tenants';
                        addModel.tenantCompanyName = this.addUserModel.tenantCompanyName;
                    }
                    //for others: fleet admins/drivers
                    else {
                        addModel.tenantId = this.addUserModel.tenantId;
                    }
                }
                //If fleet admin tries to add driver with having own fleet
                else if(this.currentRole.toLowerCase() === 'fleet admin' && addModel.roleId == this.driverRoleId && this.currentUserInfo && this.currentUserInfo.fleetId){
                    addModel.fleetId=this.currentUserInfo.fleetId;
                    addModel.tenantId = this.currentUserInfo.Tenant.id;
                }
                else{
                    if (this.currentRole && this.currentUserInfo.Tenant)
                        addModel.tenantId = this.currentUserInfo.Tenant.id;
                    else {
                        this.toastr.error("No associated tenant found");
                        return;
                    }
                }

                if(this.addUserModel.fleetId){
                    addModel.fleetId=this.addUserModel.fleetId;
                }

                this.restService.makeCall('Users', 'POST', api, addModel)
                    .subscribe(resp => {
                        if (resp && resp.body && resp.body.data) {
                            this.loading = false;
                            //this.addUserModel = {};
                            this.toastr.success('User Information added successfully.');
                            //this.getUsers();
                            this.userList.push(resp.body.data);
                            if(resp.body.data.id)
                                this.userList[this.userList.length-1].userId=resp.body.data.id;
                            this.formObj(this.userList[this.userList.length-1]);
                            this.addUserStart()
                        }
                        else if(resp && resp.length==0) {
                            this.addUserStart();
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error deleting data');
                    });
            }).catch(() => {
                this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });
    }

    /**
     * Retrieves list of vehicles which are not assigned any driver
     */
    getAllUnassignedVehicleList = function () {
        this.loading = true;
        let filter ="";
        if(this.currentUserInfo && this.currentUserInfo.fleetId)
            filter="&fleetId="+this.currentUserInfo.fleetId;
        this.restService.makeCall('Fleets', 'GET', '/' + this.currentUserInfo.Tenant.id + '/vehicles' +'?isDriverUnassigned=true'+filter, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.vehicleList = resp.body.data;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }

    cancelAdd = function () {
        this.addForm = false;
    }
    
}
