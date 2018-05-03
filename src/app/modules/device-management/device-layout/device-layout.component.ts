import { Component, OnInit, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-device-layout',
  templateUrl: './device-layout.component.html',
  styleUrls: ['./device-layout.component.css']
})
export class DeviceLayoutComponent implements OnInit {
    public loading = false;
    model: any = {};
    deviceList: any[];
    hide: any;
    selectedItem: any = {};
    selectedItemForClass = "";
    roles: any = [];
    selectedUserRole: any = {};
    tenantRoleId: any;

    currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));

    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService
    ) {
        // override the route reuse strategy
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
        this.getDevices();
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

    /**
     list Devices
     */
    getDevices(): void {
        this.loading = true;
        let tenantId = "";
        if (this.currentUserInfo && this.currentUserInfo.Tenant)
            tenantId = this.currentUserInfo.Tenant.id;
        this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/devices' , this.model)
            .subscribe(resp => {
                //
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.deviceList = resp.body.data;
                    if(!(this.deviceList && this.deviceList[0])){
                        this.toastr.error("No devices available");
                    }
                    else{
                        if (this.router.url === '/dashboard/devices') {
                            this.selectedItem = this.deviceList[0];
                            if (this.selectedItem && this.selectedItem.id) {
                                localStorage.setItem('selectedItem', this.deviceList[0].id);
                                this.router.navigate(['/dashboard/devices/details/' + this.selectedItem.id]);
                            } 
                        }
                    }
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');
            });
    }
    
    navigateToDetails = function (id) {
        localStorage.setItem('selectedItem', id);
        this.router.navigate(['/dashboard/devices/details/' + id]);
    }

    navigateToAdd = function () {
        this.router.navigate(['/dashboard/devices/add']);
    }
    
    mouseenter(event, depth) {
        this.renderer2.addClass(event.target, 'mat-elevation-z' + depth);
    }

    mouseleave(event, depth) {
        this.renderer2.removeClass(event.target, 'mat-elevation-z' + depth);
    }

}
