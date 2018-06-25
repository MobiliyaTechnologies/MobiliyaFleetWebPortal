import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {environment} from '../../../environments/environment';
let iframe;
let Token = {"token_type": "Bearer", "scope": "Capacity.Read.All Capacity.ReadWrite.All Content.Create Dashboard.Read.All Dashboard.ReadWrite.All Data.Alter_Any Dataset.Read.All Dataset.ReadWrite.All Group.Read Group.Read.All Metadata.View_Any Report.Read.All Report.ReadWrite.All Tenant.Read.All Workspace.Read.All Workspace.ReadWrite.All", "expires_in": "3599", "ext_expires_in": "0", "expires_on": "1517927289", "not_before": "1517923389", "resource": "https://analysis.windows.net/powerbi/api", "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ino0NHdNZEh1OHdLc3VtcmJmYUs5OHF4czVZSSIsImtpZCI6Ino0NHdNZEh1OHdLc3VtcmJmYUs5OHF4czVZSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjMyMmQ4NDQtMzg3NC00MWM3LTkyYWEtZDM1NTAxODBlNmYyLyIsImlhdCI6MTUxNzkyMzM4OSwibmJmIjoxNTE3OTIzMzg5LCJleHAiOjE1MTc5MjcyODksImFjciI6IjEiLCJhaW8iOiJZMk5nWU5nN1k5RWZSWmFVTlNmS3RsUzQyazFRNzc5K3h1VWhpN1RjQjVhK2RiWjhmTnNCIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjEwNmNjZTg2LWQ0NjktNDRlYS04ZTMwLTJjMGMxZWYxYjc0OSIsImFwcGlkYWNyIjoiMSIsImlwYWRkciI6IjExNC4xNDMuNi45OCIsIm5hbWUiOiJRaW5ncXVhbiBGYW4iLCJvaWQiOiJmZDJhMTQ5My1lMDljLTQyNWMtYmMyNC1mY2U4YzRkZGZkYTMiLCJwdWlkIjoiMTAwMzNGRkZBN0NCMzYxMSIsInNjcCI6IkNhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGEuQWx0ZXJfQW55IERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQgR3JvdXAuUmVhZC5BbGwgTWV0YWRhdGEuVmlld19BbnkgUmVwb3J0LlJlYWQuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFRlbmFudC5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzdWIiOiJ3WjFVNmlvcUhDMnVjSktFeXRMQ3daOG4yNEZsWl9ZY01NOXNKMUxMZXdJIiwidGlkIjoiMjMyMmQ4NDQtMzg3NC00MWM3LTkyYWEtZDM1NTAxODBlNmYyIiwidW5pcXVlX25hbWUiOiJxcS5mYW5AdGltemhhbmhvdG1haWwub25taWNyb3NvZnQuY29tIiwidXBuIjoicXEuZmFuQHRpbXpoYW5ob3RtYWlsLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InpUUFdvU2RHYVUyd1B5d3k5Vm9tQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdfQ.Vfg2pFWxNSlgNE5r64kUPJ4fsYaKTj36R765di14TiPEFDQ08vRccKkk-FUKCF3av_q3NoUxGFexiTdYa7Ex6IFejWOQOOUU_i7oz2PpVXIseKRavZ2PPpRHPg9bIeTC_x3-gUbUhGx2DWw3XXnTcsypqc7Vd1-bZY_bzJ-aZgJuGSm1749Dm9YrmEsZc2pMA5UvTP5Dh_TWwGw__QVTWNDMAdQ67xV-rVdOfdufiE5_c5aVatePxdEFZSkv2gYpSzU4m2j_aEOZURJfGo0Y96y8oUszoI8gItPkoGygzz-2V_FyrBVRi5puorj6PQINVxml-AF89_adenFTl3nq7w", "refresh_token": "AQABAAAAAABHh4kmS_aKT5XrjzxRAtHzLUNJ02XNHigKGl6dAlsIJq6D2Sz0Nl8Cv2TtPgxqCiwXGvZfhszRC6xuTlPTRA8LQWaE1SqbEieca2rGrGbiYIM9i7gJX3vV60pICUcyIWXlZUltrUqS1G9a3aJye3Ri1AmyqWFXUm958vSECvTuSst_geMdwaE75m-KUYCsvTuByIGSPkawXtXwW1fUwcJAb-a09wUoPlRENVhVQrO_K5so4Y3HD0Z1RUEQIEuf_PzPxxJpmcCX65Qh93gTiIhWrfwDpiTvxJDNeNHNGdSgRuoloGkp3zy63-Y_Oj132gTpytEaNUpwLEY2s0v8M4dh-S7S89f7ybIya_fuGPixKN10aLsCKTeTiU_oNV23ztMt9efCRHbESvUt-g39VIg2rxiBuuc39ehikoKCDmpwPI0c2L4HJt6W4XOSL8QU490Ei7N1NaiX5yRYnafP1YcTGm2myZC7XWaWGH584pKNWPBXopuxgIk4JMCohLxyuYuwf56ag4lgq_fVcaOah2Foser0WW7UecNH_IwCFSVI_DlRKJlHjPsKUW5cY0nWZAPLgwwDic3eu6XaYu6mPvCpHBYLMkLfQNVxHF2rW_4PJnBr_LSyAWBvFd3MintZCuGr13B2FMeV_OREXaR0816fqXeLtJ5Bh29agwqUq_HBesfnooRn6QWM7yw9ll63AqnOeTJDWfG9coIRAUGAsYVhIAA"}
/** REPORTS_ENDPOINTS from environment */
var REPORTS_ENDPOINTS :any={};
var SERVICE_URL:any={} ;
var API_ENDPOINT:any={};
let reportURL:any;

import { RestService } from '../../services/rest-service/rest-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  selectedSpanForFuel="";
  currentUserInfo:any={};

  count:any={};
  /** Default vehicle status count
   */
  single= [
    {
      "name": "Online",
      "value": 21
    },
    {
      "name": "Offline",
      "value": 9
    }
  ];

  //options
   gradient = true;
   showLegend = false;
   doughnut=true;
   explodeSlices=true;
   reportUrlArray:any=[];
   mileageReportId="";
   faultReportId="";
   colorScheme = {
     domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
   };

  constructor(
    private restService: RestService
  ) { 
    if(environment){
        REPORTS_ENDPOINTS=environment.REPORTS_ENDPOINTS;
        if(sessionStorage.getItem('sessionConfiguration'))
        SERVICE_URL = JSON.parse(sessionStorage.getItem('sessionConfiguration')).SERVICE_URL;
        else
        SERVICE_URL=environment.SERVICE_URL;
        /** API_ENDPOINT from environment */
        API_ENDPOINT = environment.API_ENDPOINT;
        reportURL = REPORTS_ENDPOINTS.reportInitialURL+REPORTS_ENDPOINTS.reportIds.mileage+"&navContentPaneEnabled=false&filterPaneEnabled=false";
    } 
    this.reportUrlArray=JSON.parse(localStorage.getItem('reportUrls'))
    let self=this;

    if(this.reportUrlArray){
        this.reportUrlArray.forEach(function(item){
            if(item.reportName.toLowerCase()=='average_mileage' || item.reportName.toLowerCase()=='average_mileage_qa')
            {
                self.mileageReportId=item.reportId;
                reportURL = REPORTS_ENDPOINTS.reportInitialURL+self.mileageReportId +"&navContentPaneEnabled=false&filterPaneEnabled=false";
                self.reportFunction(reportURL,"iframeId1");
            }
            if(item.reportName.toLowerCase()=='fault_codes' || item.reportName.toLowerCase()=='fault_codes_qa')
            {
                self.faultReportId=item.reportId;
                reportURL = REPORTS_ENDPOINTS.reportInitialURL+self.faultReportId+"&navContentPaneEnabled=false&filterPaneEnabled=false";
                self.reportFunction(reportURL,"iframeId2");
            }
        })
    }
    
  }


  ngOnInit() {
      this.currentUserInfo=JSON.parse(localStorage.getItem('userInfo'));
      if(this.currentUserInfo && this.currentUserInfo.Tenant && this.currentUserInfo.Tenant.id){
        this.getRoles();
        this.getAllFleets(this.currentUserInfo.Tenant.id);
        this.getAllVehicles(this.currentUserInfo.Tenant.id);
      }   
      
  }
/**Count APIS */
getRoles = function () {
    this.loading = true;
    this.restService.makeCall('Users', 'GET', '/roles', this.model)
        .subscribe(resp => {
            //this.loading = false;
            if (resp.body && resp.body.data) {
                this.loading = false;
                this.roles = resp.body.data;
                this.getAllUsers(this.currentUserInfo.Tenant.id);
            }
        }, error => {
            this.loading = false;
            //this.toastr.error('Error getting list');
        });
}
/**
 * Count users by roleIds
 */
    countByRoles=function(){
        let driverCount=0;
        for(var i=0;i<this.roles.length;i++){
            if(this.roles[i].roleName.toLowerCase()=='driver')
            for(var j=0; j<this.userList.length;j++){
                if(this.userList[j].roleId==this.roles[i].id && this.userList[j]){
                    driverCount++;
                }
            }
            this.count.drivers=driverCount;
        }

    }
/**
 * retrieves list of all users
 */
  getAllUsers=function(tenantId){
    this.loading=true;
    let filter="";
    filter = '?tenantId=' + tenantId;
    this.restService.makeCall('Users','GET','/users'+filter,this.model)
        .subscribe(resp => {
            //
            if (resp.body && resp.body.data) {
                this.loading = false;
                this.userList = resp.body.data;
                this.count.users=this.userList.length;
                this.countByRoles();
            }
        }, error => {
            this.loading = false;
            //this.toastr.error('Error getting list');
        });
  }

  getVehicleStatus=function(){
      this.vehicleList.forEach(function(item){
          if(item.status=='online')
            this.single[0].value++;
          else if(item.status=='offline')
          this.single[1].value++;
      })
  }

  /**
   * Retrieves list of all vehicles
   */
  getAllVehicles=function(tenantId){
    this.loading=true;    
    var URL = '/' + tenantId + '/vehicles';
    this.restService.makeCall('fleets', 'GET', URL, this.model)
        .subscribe(resp => {

            if (resp.body && resp.body.data) {
                this.loading = false;
                this.vehicleList = resp.body.data;
                this.count.vehicles=this.vehicleList.length;
                this.getVehicleStatus();
            } else {
               
            }
        }, error => {
            this.loading = false;
            //this.toastr.error('Error getting list');
        });
  }

  /**
   * Retrieves list of all fleets
   */
  getAllFleets=function(tenantId){
    this.loading=true;
    this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/fleets' , {})
          .subscribe(resp => {
              //
                if (resp.body && resp.body.data) {
                    this.loading = false;
                    this.fleetList = resp.body.data;
                    this.count.fleets=this.fleetList.length;
                }
          }, error => {
              this.loading = false;
              //this.toastr.error('Error getting list');
          });
  }

  /**
   * Call server side authentication API of powerbi. Sets powerbi iframes source urls 
   */
reportFunction(reportURL,iframeId) {

    return new Promise((resolve, reject) =>  {

    $.post(SERVICE_URL.FLEET + '/powerbi/auth',
        { },
        function (data, status) {
            try {
                let data1 = JSON.parse(data);
                var embedUrl = reportURL;
                if ("" === embedUrl) {
                    return;
                }
                this.iframe = document.getElementById(iframeId);
                this.iframe.src = embedUrl;
                this.iframe.onload = function () {
                    postActionLoadReport(iframeId)
                };
                Token = data1;
                var accessToken = Token.access_token;
                if ("" === accessToken) {
                    return;
                }
                var m = {action: "loadReport", accessToken: accessToken};
                var message = JSON.stringify(m);
                this.iframe = document.getElementById(iframeId);
                this.iframe.contentWindow.postMessage(message, "*");;
                return resolve("success");
            } catch (err) {
                return reject ("failure");
            }
        });
    });
    }
}
function postActionLoadReport(iframeId) {
  var accessToken = Token.access_token;
  if ("" === accessToken) {
      return;
  }
  var m = {action: "loadReport", accessToken: accessToken};
  var message = JSON.stringify(m);
  iframe = document.getElementById(iframeId);
  iframe.contentWindow.postMessage(message, "*");
}