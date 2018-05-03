import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../shared/globals';
import { ValdationsService } from '../../../shared/valdations.service';
import { google } from '@agm/core/services/google-maps-types';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SearchFleetDialogComponent } from '../../../shared/search-fleet-dialog/search-fleet-dialog.component';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit {
    dialog: any;
    public loading = false;
    model: any = {};
    vehicleList: any = [];
    rulesList: any = [];
    selectedFilter: any = { 'ruleType': 'All rules', 'id': -1 };
    selectedFilterList: any = [{ 'ruleType': 'Speed'},
    { 'ruleType': 'Location'}];
    vehicleListBeforeFleetSelection: any = [];
    selectedItem: any = {};
    latitude: number;
    longitude: number;
    k = 0;
    selectedItemForClass: any = {};
    currentUserInfo: any = {};
    tenantId = "";
    constructor(
        private router: Router,
        private restService: RestService,
        private renderer2: Renderer2,
        private toastr: ToastrService,
        private globals: Globals,
        private vs: ValdationsService,
        private dialogFilter: MatDialog, ) {

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

        if (localStorage.getItem('selectedItem')) {
            this.selectedItemForClass = localStorage.getItem('selectedItem');
        }
    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.getRules();
    }

    /*Function to get the list of Rules*/
    getRules = function () {
        this.loading = true;
        this.tenantId = this.currentUserInfo.Tenant.id;
        var URL = '/' + this.tenantId + '/rules';
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.rulesList = resp.body.data;                
                    if (this.router.url === '/dashboard/rules') {
                        this.selectedItem = this.rulesList[0];
                        if (this.selectedItem && this.selectedItem._id) {
                            this.navigateToDetails(this.selectedItem._id);
                        }
                    }
                } else {
                    this.loading = true;

                }

            }, error => {
                this.loading = false;
                this.toastr.error('Error getting list');

            });
    }

    /*Function to navigate to the Add Rules page*/
    navigateToAdd = function () {
        this.router.navigate(['/dashboard/rules/add/']);
    }

     /*Function to filter the rules according to rule Type*/
    filterRule = function (rule) {
        this.selectedFilter.ruleType = rule.ruleType;
        if (rule.ruleType == "All rules") {
            this.selectedFilter.id = -1;
        }
        else {
            this.selectedFilter.id = 1;
        }
    }

    /*Function to navigate to the Details of a particular Rule*/
    navigateToDetails = function (id) {
        localStorage.setItem('selectedItem', id);       
        this.router.navigate(['/dashboard/rules/details/'+ id]);
    }

}
