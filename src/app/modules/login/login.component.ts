import {Component, OnInit, Renderer2} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ToastrService} from 'ngx-toastr';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Globals} from '../../shared/globals';
import { ValdationsService } from '../../shared/valdations.service';

import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { RestService } from '../../services/rest-service/rest-service.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    
    public loading = false;
    model: any = {};
    user: any;
    hide: any;

    jwtHelper: JwtHelper = new JwtHelper();
    name = 'user';
    userInfo: any = {};
    roles: any = [];
    userid = '0';

    email = new FormControl('', [Validators.required, Validators.email]);
    //password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$')]));
    password = new FormControl('',  [Validators.required]);
    getErrorMessage() {
        return this.email.hasError('required') ? 'Enter your email address' :
            this.email.hasError('email') ? 'Please enter a valid email address' : '';
    }
    passwordErrorMessage() {
        if(this.password.hasError('required'))
            return 'Password cannot be empty';
        if(this.password.hasError('pattern'))
            return 'Password should be minimum 8 character long and should contain any 3 of A-Z/a-z/0-9/Symbols.';
    }
    constructor(
        private restService: RestService,
        private router: Router,
        private loginFormService: LoginService,
        private http: HttpClient,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService
    ) {}

    ngOnInit() {
        localStorage.clear();
    }
    setData(data: string) {
        this.model.username = data;
    }

    checkValidations() {
        return new Promise((resolve, reject) => {
            // this.inputPlate.click();
            if (this.email.invalid || this.password.invalid ) {

                if (this.email.invalid) {
                    this.email.markAsTouched();
                }
                if (this.password.invalid) {
                    this.password.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }


        });
    }


    getRoles = function () {
        return new Promise((resolve, reject) => {
            this.restService.makeCall('Users', 'GET', '/roles', this.model)
                .subscribe(resp => {
                    //this.loading = false;
                    if (resp.body && resp.body.data) {
                        this.roles = resp.body.data;
                        resolve(this.roles);
                    }
                }, error => {
                    this.toastr.error('Error getting list of roles');
                });
        });
    }

    setLocalStorage = function (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    getCurrentUserRole = function (userInfo) {
        let self = this;
        self.loading = true;
        this.getRoles().then(function (result) {
            self.loading = false;
            result.forEach(function (item) {

                if (item.id === userInfo.roleId) {
                    if(item.roleName.toLowerCase()==='driver'){
                        self.toastr.error("Unauthorized access");
                        self.globals.token = '';
                        localStorage.clear();
                        return;
                    }
                    //fleet admin naviagtion on login
                    else {
                        userInfo.currentRole = item.roleName;
                        self.setLocalStorage(userInfo);
                        if(item.roleName.toLowerCase()==='fleet admin'){
                            if(self.userInfo.fleetId){
                                localStorage.setItem('selectedMenu','users');
                                self.router.navigate(['dashboard/list-users']);
                            }
                            else{
                                self.loading=false;
                                self.globals.token = '';
                                localStorage.clear();
                                self.toastr.error('No fleet is associated with this user. Please contact your tenant admin.')
                                return;
                            }
                        }
                        //tenant admin naviagation on login
                        else if(item.roleName.toLowerCase()==='tenant admin'){
                            localStorage.setItem('selectedMenu','home');
                            userInfo.currentRole = item.roleName;
                            self.setLocalStorage(userInfo);
                            self.router.navigate(['dashboard/home']);
                        }
                        //superadmin navigation on login
                        else{
                            localStorage.setItem('selectedMenu','users');
                            self.router.navigate(['dashboard/list-users']);
                        }
                    }
                }
            });
        })

    }

    getUserDetails(id) {
        this.loading = true;
        return new Promise((resolve, reject) => {
            try {
                this.restService.makeCall('Users', 'GET', '/users/' + id, {})
                    .subscribe(resp => {
                        //
                        if (resp.body && resp.body.data) {
                            this.loading = false;
                            this.userInfo = resp.body.data;
                            // fetching all reports URI
                            if(this.userInfo.Tenant && this.userInfo.Tenant.id){
                                this.getReportsOfTenant(this.userInfo.Tenant.id);
                            }
                            this.getCurrentUserRole(this.userInfo);

                            this.name = this.userInfo.firstName + ' ' + this.userInfo.lastName;
                            resolve('success');
                        }
                    }, error => {
                        this.loading = false;
                        this.toastr.error('Error getting User details');
                        reject(error);
                    });

            } catch (err) {
                this.loading = false;
                return reject('failure');
            }
        });
    }

    /**
     * Fetching report APIs of tenant
     */
    getReportsOfTenant=function(tenantId){
        this.restService.makeCall('Users', 'GET', '/reports/' + tenantId, {})
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.reportUrls = resp.body.data;
                    localStorage.setItem('reportUrls',JSON.stringify(this.reportUrls));
                }
            }, error => {
                this.toastr.error('Error getting Report Urls');
            });
    }

    loginUser(): void {
        let loginModel:any={};
        this.checkValidations()
            .then(() => {
                this.loading = true;
                
                try {
                     loginModel={
                        'email':this.model.username.toLowerCase(),
                        'password':this.model.password
                    }
                } catch (err) {
                }
                this.restService.makeCall('Users','POST','/login',loginModel)
                .subscribe(resp => {
                    if (resp.body && resp.body.data) {
                        this.user = resp.body.data;
                        this.loading = false;
                        if (this.user && this.user.access_token) {
                            this.globals.token = this.user.access_token || '';
                            localStorage.setItem('access_token', this.user.access_token || '');
                            localStorage.setItem('expires', this.user.expires || '');
                            var tokenObject = this.jwtHelper.decodeToken(this.globals.token);
                            this.userid = tokenObject.user.id;
                            this.getUserDetails(this.userid).then().catch((err) => { })
                            
                        } else {
                            this.toastr.error('The username and password you entered did not match our records. Please verify and try again.', 'Failure');
                            // alert('Invalid credentials');
                            this.router.navigate(['']);
                        }
                    }
                    else if(resp && !(resp.type==0)){
                        this.loading = false;
                    }
                }, error => {
                    this.loading = false;
                    this.toastr.error('The username and password you entered did not match our records. Please verify and try again.', 'Failure');
                });
            }).catch(() => {
                this.toastr.error('Mandatory field are not filled', 'Validation Error');
            });
    }


    mouseenter(event, depth) {
        this.renderer2.addClass(event.target, 'mat-elevation-z' + depth);
    }

    mouseleave(event, depth) {
        this.renderer2.removeClass(event.target, 'mat-elevation-z' + depth);
    }

}
