import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
declare var Microsoft: any;

@Component({
  selector: 'app-rules-detail',
  templateUrl: './rules-detail.component.html',
  styleUrls: ['./rules-detail.component.css']
})
export class RulesDetailComponent implements OnInit {
    @ViewChild('myMap') myMap;
    map: any;
    tenantId: any;
    lat: any;
    lng: any;
    rad: any;
    selectedItemForClass: any = {};
    displaySpeedDetails = false;
    displayGeofenceDetails = true;
    selectedItem: any = {};
    currentRole: any;
    model: any;
    currentUserInfo: any;
    public loading = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private restService: RestService,
        private toastr: ToastrService

    ) {
        this.route.params.subscribe(params => {
            this.selectedItem._id = params['id'];  
        });

        if (localStorage.getItem('selectedItem')) {
            this.selectedItemForClass = localStorage.getItem('selectedItem');
        }
    }

    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.tenantId = this.currentUserInfo.Tenant.id;
        this.getRuleInformation(this.selectedItem._id);
    }



    /*Function to get details of a particular rule by id*/
    getRuleInformation = function (id) {
        this.loading = true;
        this.model = {};
        var URL = '/' + this.tenantId + '/rules/' + id;
        this.restService.makeCall('trip', 'GET', URL, this.model)
            .subscribe(resp => {
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.selectedItem = resp.body.data;
                    if (this.selectedItem.ruleType == "Speed") {
                        this.displaySpeedDetails = true;
                        this.displayGeofenceDetails = false;
                    }
                    else {
                        this.displaySpeedDetails = false;
                        this.displayGeofenceDetails = true;
                        this.lat = parseFloat(this.selectedItem.latitude);
                        this.lng = parseFloat(this.selectedItem.longitude);
                        var pushPin = { 'latitude': this.lat, 'longitude': this.lng };
                        this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
                            credentials: 'AiEsUmLefI71UtYUSlMa1svuDHQbAWnWi-nqwzvhpZmqUI1YN6651ntoRQWEsZCc'
                        });
                        
                        var pin = new Microsoft.Maps.Pushpin(pushPin);
                      
                        this.map.entities.push(pin);
                        this.map.setView({ center: pushPin });
                        this.rad = parseFloat(this.selectedItem.radius); 
                    }
                
                } else {
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.toastr.error('Error getting Rule information');
            })
    }

}
