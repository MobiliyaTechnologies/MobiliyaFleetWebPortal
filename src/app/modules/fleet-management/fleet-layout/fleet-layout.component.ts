import { Component, OnInit, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';

@Component({
  selector: 'app-fleet-layout',
  templateUrl: './fleet-layout.component.html',
  styleUrls: ['./fleet-layout.component.css']
})
export class FleetLayoutComponent implements OnInit {

  public loading = false;
  fleetList: any=[];
  selectedItem: any = {};
  selectedItemForClass = "";
  model: any = {};
  currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));

  constructor(
      private router: Router,
      private restService: RestService,
      private renderer2: Renderer2,
      private toastr: ToastrService,
      private globals: Globals,
      private vs: ValdationsService,
      private route : ActivatedRoute
  ) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        if (localStorage.getItem('selectedItem')) {
            this.selectedItemForClass = localStorage.getItem('selectedItem');
        }
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
      this.getFleets();
  }

  formObj = function (selectedUser) {
      selectedUser.name = selectedUser.firstName + " " + selectedUser.lastName;
      this.roles.forEach(function (item) {
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
  getFleetDetailsByFleetId=function(filter,tenantId) {
    this.loading = true;

    this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/fleets'+filter , {})
          .subscribe(resp => {
              //
              if (resp.body && resp.body.data) {
                this.loading = false;
                this.fleetList.push(resp.body.data);
                this.selectedItem = this.fleetList[0];
                if (this.selectedItem && this.selectedItem.id) {
                    localStorage.setItem('selectedItem', this.fleetList[0].id);
                    if(!this.router.url.includes('/dashboard/fleets/edit'))
                        this.router.navigate(['/dashboard/fleets/details/' + this.selectedItem.id]);
                }
              }

          }, error => {
              this.loading = false;
              //this.toastr.error('Error getting list');
          });
  }

  /**
   list Fleets
   */
  getFleets(): void {
      this.loading = true;
      let tenantId = "";
      let filter = "";
      if (this.currentUserInfo ){
        if(this.currentUserInfo.Tenant)
          tenantId = this.currentUserInfo.Tenant.id;
        if(this.currentUserInfo.currentRole &&this.currentUserInfo.currentRole.toLowerCase()=='fleet admin' )
            if(this.currentUserInfo.fleetId){
                filter="/"+this.currentUserInfo.fleetId;
                localStorage.setItem('selectedItem', this.currentUserInfo.fleetId);
                this.getFleetDetailsByFleetId(filter,tenantId);
                return;
            }
            else{
                this.loading=false;
                this.toastr.error('No fleet is associated with this user.')
                return;
            }
      }
        
      
      this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/fleets'+filter , {})
          .subscribe(resp => {
              //
              if (resp.body && resp.body.data) {
                  this.loading = false;
                  this.fleetList = resp.body.data;
                    if(!(this.fleetList && this.fleetList[0])){
                        this.toastr.error("No fleet available");
                    }
                    else{
                        if (this.router.url === '/dashboard/fleets') {
                            this.selectedItem = this.fleetList[0];
                            if (this.selectedItem && this.selectedItem.id) {
                                localStorage.setItem('selectedItem', this.fleetList[0].id);
                                this.router.navigate(['/dashboard/fleets/details/' + this.selectedItem.id]);
                            }
                        }
                        else{
                            this.route.params.subscribe(params=> {
                                try{
                                    this.selectedItem = this.fleetList.filter(item=>this.router.url.substring(this.router.url.lastIndexOf('/') + 1)==item.id).map(item=>item)[0];
                                    if(this.selectedItem){
                                        this.selectedItemForClass=this.selectedItem.id;
                                        localStorage.setItem('selectedItem', this.selectedItem.id);
                                    }
                                }
                                catch(e){
                                    this.toastr.error('Error occurred'+e );
                                }
                            });
                        }
                    }
              }

          }, error => {
              this.loading = false;
              //this.toastr.error('Error getting list');
          });
  }

  navigateToDetails = function (id) {
      localStorage.setItem('selectedItem', id);
      this.router.navigate(['/dashboard/fleets/details/' + id]);
  }
  navigateToAdd = function () {
      this.router.navigate(['/dashboard/fleets/add']);
  }


  /**     */
  mouseenter(event, depth) {
      this.renderer2.addClass(event.target, 'mat-elevation-z' + depth);
  }

  mouseleave(event, depth) {
      this.renderer2.removeClass(event.target, 'mat-elevation-z' + depth);
  }

}
