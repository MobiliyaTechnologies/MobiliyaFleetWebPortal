import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, Input, Output, EventEmitter ,TemplateRef } from '@angular/core';
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
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
    public loading = false;
    selectedItem: any = {};
    currentUserInfo: any = {};
    currentRole = "";
    modalRef: BsModalRef;

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
            this.getDeviceDetails(this.selectedItem.id);
        });
    }

    ngOnInit() { 
    }
    ngAfterViewInit() {
    }

    navigateToEdit = function () {
        let route="/dashboard/devices/edit/"+this.selectedItem.id;
        this.router.navigate([route]);
    }

    /**
    Device Details
    */

    getDeviceDetails = function (id) {
        this.addForm = false;
        this.editForm = false;
        this.loading = true;
        this.model = {};
        let tenantId = "";
        if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantId = this.currentUserInfo.Tenant.id;
        this.restService.makeCall('Fleets', 'GET', '/' + tenantId +'/devices/' + id, this.model)
            .subscribe(resp => {

                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting dongle info');
            })
    }

    /*Device details ends */

    /* delete Device */
    deleteDevice = function (id) {
        this.loading = true;
        let tenantId = "";
        if (this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id)
            tenantId = this.currentUserInfo.Tenant.id;
        
        this.restService.makeCall('Fleets', 'DELETE', '/' + tenantId+ '/devices/' + id, this.model)
            .subscribe(resp => {
                if (resp && resp.body) {
                    this.loading = false;
                    this.toastr.success('Dongle Information deleted successfully.');
                    this.router.navigate(['/dashboard/devices'])
                }
                else if(resp && resp.length == 0){
                    this.loading=false;
                   // this.toastr.error("Unable to delete device. Please try again later.");
                }
                
            }, error => {
                this.loading = false;
                this.toastr.error('Error deleting dongle information');
            });
    }
    //delete device Model
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }   
    /*delete device ends*/
}
