import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { SetNewPasswordService } from '../../services/set-new-password/set-new-password.service';//needs to be changed
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Globals } from '../../shared/globals';
import { ValdationsService } from '../../shared/valdations.service';

import { RestService } from '../../services/rest-service/rest-service.service';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';
@Component({
    selector: 'app-set-new-password',
    templateUrl: './set-new-password.component.html',
    styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

    public loading = false;
    model: any = {};
    user: any;
    hide: any;
    hideConfirm: any;

    email = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$')]));
    confirmPassword = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$')]));

    getErrorMessage() {
        return this.email.hasError('required') ? 'Enter your email address' :
            this.email.hasError('email') ? 'Please enter a valid email address' : '';
    }
    /**
     * Returns field specific error messages 
     */
    getFieldErrorMessage(field, fieldValue) {
        if (field.toLowerCase() === 'password') {
            if(this.password.hasError('required'))
                return 'Password cannot be empty';
            if(this.password.hasError('pattern'))
                return 'Password should be minimum 8 character long and should contain any 3 of A-Z/a-z/0-9/Symbols.';
        }
        if (field.toLowerCase() === 'confirmpassword') {
            if(this.confirmPassword.hasError('required'))
                return 'Confirm Password cannot be empty';
            if(this.confirmPassword.hasError('pattern'))
                return 'Password should be minimum 8 character long and should contain any 3 of A-Z/a-z/0-9/Symbols.';
        }
    }
    constructor(
        private router: Router,
        private setNewPasswordFormService: SetNewPasswordService,
        private http: HttpClient,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private route: ActivatedRoute,
        private restService: RestService
    ) { 
        this.route.queryParams.subscribe(params => {
            this.model.username = params['email'];
            this.model.oldPassword = params['token'];
        });
    }

    ngOnInit() {

    }
    setData(data: string) {
        this.model.username = data;
    }

    /**
     * Check button click validations for set new password form
     */
    checkValidations() {
        
        return new Promise((resolve, reject) => {
            if (this.email.invalid || this.password.value != this.confirmPassword.value || this.password.invalid || this.confirmPassword.invalid) {

                if (this.email.invalid) {
                    this.email.markAsTouched();
                }
                if (this.password.invalid) {
                    this.password.markAsTouched();
                }
                if (this.confirmPassword.invalid) {
                    this.confirmPassword.markAsTouched();
                }
                reject('failure');
            } else {
                resolve('success');
            }


        });
    }

    /**
     *  Sets new password of user 
     */
    setNewPassword(): void {
        this.checkValidations()
            .then(() => {
        this.loading = true;
        try {
            this.model.email = this.model.username.toLowerCase();
            
        } catch (err) {
        }
        this.restService.makeCall('Users', 'PUT', '/reset-password', this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.toastr.success('Hi, your new Password has been set successfully');
                    this.router.navigate(['/login']);
                }
            }, error => {
                this.loading = false;
            });
            }).catch(() => {
                if (this.password.value != this.confirmPassword.value) 
                    this.toastr.error('Your confirm password did not match with the password', 'Validation Error');
                else
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
