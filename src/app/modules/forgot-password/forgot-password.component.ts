import { Component, OnInit, Renderer2} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Globals } from '../../shared/globals';
import { ValdationsService } from '../../shared/valdations.service';
import { RestService } from '../../services/rest-service/rest-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public loading = false;
  model: any = {};
  user: any;
  hide: any;

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' : '';
  }
  constructor(
      private router: Router,
      private restService: RestService,
      private http: HttpClient,
      private renderer2: Renderer2,
      private toastr: ToastrService,
      private globals: Globals,
      private vs: ValdationsService
  ) { }

  ngOnInit() {

  }
  setData(data: string) {
      this.model.username = data;
  }

  checkValidations() {
      return new Promise((resolve, reject) => {
          if (this.email.invalid) {

              if (this.email.invalid) {
                  this.email.markAsTouched();
              }
              reject('failure');
          } else {
              resolve('success');
          }


      });
  }

/**
 * Forgot password API call
 */
  forgotPassword(): void {
      this.checkValidations()
          .then(() => {
              this.loading = true;
              try {
                  this.model.email = this.model.username.toLowerCase();
              } catch (err) {
              }
              this.restService.makeCall('Users', 'POST', '/forgot-password', this.model)
                  .subscribe(resp => {
                      if (resp&& resp.body) {
                          this.loading = false;
                          this.toastr.success('Request to set new password has been sent to your registered email id - ' + this.model.email);
                          this.router.navigate(['/login']);
                      }
                      else if(resp && resp.length == 0){
                          this.loading=false;
                          this.toastr.error("Email not found. Please try again.")
                      }
                  }, error => {
                      this.loading = false;
                      this.toastr.error('Error deleting data');
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
