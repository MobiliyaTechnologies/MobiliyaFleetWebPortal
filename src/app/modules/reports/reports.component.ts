import { Component, OnInit, TemplateRef } from '@angular/core';
import { RestService } from '../../services/rest-service/rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import {environment} from '../../../environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
let iframe;
let Token = {"token_type": "Bearer", "scope": "Capacity.Read.All Capacity.ReadWrite.All Content.Create Dashboard.Read.All Dashboard.ReadWrite.All Data.Alter_Any Dataset.Read.All Dataset.ReadWrite.All Group.Read Group.Read.All Metadata.View_Any Report.Read.All Report.ReadWrite.All Tenant.Read.All Workspace.Read.All Workspace.ReadWrite.All", "expires_in": "3599", "ext_expires_in": "0", "expires_on": "1517927289", "not_before": "1517923389", "resource": "https://analysis.windows.net/powerbi/api", "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ino0NHdNZEh1OHdLc3VtcmJmYUs5OHF4czVZSSIsImtpZCI6Ino0NHdNZEh1OHdLc3VtcmJmYUs5OHF4czVZSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjMyMmQ4NDQtMzg3NC00MWM3LTkyYWEtZDM1NTAxODBlNmYyLyIsImlhdCI6MTUxNzkyMzM4OSwibmJmIjoxNTE3OTIzMzg5LCJleHAiOjE1MTc5MjcyODksImFjciI6IjEiLCJhaW8iOiJZMk5nWU5nN1k5RWZSWmFVTlNmS3RsUzQyazFRNzc5K3h1VWhpN1RjQjVhK2RiWjhmTnNCIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjEwNmNjZTg2LWQ0NjktNDRlYS04ZTMwLTJjMGMxZWYxYjc0OSIsImFwcGlkYWNyIjoiMSIsImlwYWRkciI6IjExNC4xNDMuNi45OCIsIm5hbWUiOiJRaW5ncXVhbiBGYW4iLCJvaWQiOiJmZDJhMTQ5My1lMDljLTQyNWMtYmMyNC1mY2U4YzRkZGZkYTMiLCJwdWlkIjoiMTAwMzNGRkZBN0NCMzYxMSIsInNjcCI6IkNhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGEuQWx0ZXJfQW55IERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQgR3JvdXAuUmVhZC5BbGwgTWV0YWRhdGEuVmlld19BbnkgUmVwb3J0LlJlYWQuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFRlbmFudC5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzdWIiOiJ3WjFVNmlvcUhDMnVjSktFeXRMQ3daOG4yNEZsWl9ZY01NOXNKMUxMZXdJIiwidGlkIjoiMjMyMmQ4NDQtMzg3NC00MWM3LTkyYWEtZDM1NTAxODBlNmYyIiwidW5pcXVlX25hbWUiOiJxcS5mYW5AdGltemhhbmhvdG1haWwub25taWNyb3NvZnQuY29tIiwidXBuIjoicXEuZmFuQHRpbXpoYW5ob3RtYWlsLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InpUUFdvU2RHYVUyd1B5d3k5Vm9tQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdfQ.Vfg2pFWxNSlgNE5r64kUPJ4fsYaKTj36R765di14TiPEFDQ08vRccKkk-FUKCF3av_q3NoUxGFexiTdYa7Ex6IFejWOQOOUU_i7oz2PpVXIseKRavZ2PPpRHPg9bIeTC_x3-gUbUhGx2DWw3XXnTcsypqc7Vd1-bZY_bzJ-aZgJuGSm1749Dm9YrmEsZc2pMA5UvTP5Dh_TWwGw__QVTWNDMAdQ67xV-rVdOfdufiE5_c5aVatePxdEFZSkv2gYpSzU4m2j_aEOZURJfGo0Y96y8oUszoI8gItPkoGygzz-2V_FyrBVRi5puorj6PQINVxml-AF89_adenFTl3nq7w", "refresh_token": "AQABAAAAAABHh4kmS_aKT5XrjzxRAtHzLUNJ02XNHigKGl6dAlsIJq6D2Sz0Nl8Cv2TtPgxqCiwXGvZfhszRC6xuTlPTRA8LQWaE1SqbEieca2rGrGbiYIM9i7gJX3vV60pICUcyIWXlZUltrUqS1G9a3aJye3Ri1AmyqWFXUm958vSECvTuSst_geMdwaE75m-KUYCsvTuByIGSPkawXtXwW1fUwcJAb-a09wUoPlRENVhVQrO_K5so4Y3HD0Z1RUEQIEuf_PzPxxJpmcCX65Qh93gTiIhWrfwDpiTvxJDNeNHNGdSgRuoloGkp3zy63-Y_Oj132gTpytEaNUpwLEY2s0v8M4dh-S7S89f7ybIya_fuGPixKN10aLsCKTeTiU_oNV23ztMt9efCRHbESvUt-g39VIg2rxiBuuc39ehikoKCDmpwPI0c2L4HJt6W4XOSL8QU490Ei7N1NaiX5yRYnafP1YcTGm2myZC7XWaWGH584pKNWPBXopuxgIk4JMCohLxyuYuwf56ag4lgq_fVcaOah2Foser0WW7UecNH_IwCFSVI_DlRKJlHjPsKUW5cY0nWZAPLgwwDic3eu6XaYu6mPvCpHBYLMkLfQNVxHF2rW_4PJnBr_LSyAWBvFd3MintZCuGr13B2FMeV_OREXaR0816fqXeLtJ5Bh29agwqUq_HBesfnooRn6QWM7yw9ll63AqnOeTJDWfG9coIRAUGAsYVhIAA"}

var REPORTS_ENDPOINTS :any={};
var SERVICE_URL:any={} ;
var API_ENDPOINT:any={};
let reportURL:any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  tenantList:any=[];
  fleetList:any=[];
  vehicleList:any=[];
  currentUserInfo:any={};
  selectReportModel:any={};
  roleList:any=[];
  loading = false;
  minDate: Date;
  maxDate: Date;
  bsValue = new Date();
  bsRangeValue: Date[];
  displayedColumns:any=[];
  selectedParamGraph:any;
  modalRef: BsModalRef;
  reportIdArray:any=[];
  dayCount=7;
  reportData:any=[];

  constructor(
    private restService: RestService,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) { 
    if(environment){
        REPORTS_ENDPOINTS=environment.REPORTS_ENDPOINTS;
        if(sessionStorage.getItem('sessionConfiguration'))
        SERVICE_URL = JSON.parse(sessionStorage.getItem('sessionConfiguration')).SERVICE_URL;
        else
        SERVICE_URL=environment.SERVICE_URL;
        /** API_ENDPOINT from environment */
        API_ENDPOINT = environment.API_ENDPOINT;
        reportURL = REPORTS_ENDPOINTS.reportInitialURL+REPORTS_ENDPOINTS.reportIds.mileageReportUrl+"&navContentPaneEnabled=false&filterPaneEnabled=false";
    } 
    this.initReports()
    this.currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.minDate.getDate() - 1);
    this.minDate.setDate(this.maxDate.getDate() - 365);
    let firstDate=new Date();
    firstDate.setDate(this.bsValue.getDate() - 6)
    this.bsRangeValue = [firstDate, this.bsValue];
    this.reportIdArray=JSON.parse(localStorage.getItem('reportUrls'))
  }
/**
 * Initialize reports data array
 */
  initReports=function(){
    for(var i=0;i<7;i++){
        if(this.reportData[i]&&this.reportData[i].maxDistance)
            this.reportData[i].maxDistance="NA";
        if(this.reportData[i]&&this.reportData[i].speedAvg)
            this.reportData[i].speedAvg="NA";
        if(this.reportData[i]&&this.reportData[i].rpmAvg)
            this.reportData[i].rpmAvg="NA";
        if(this.reportData[i]&&this.reportData[i].airIntakeTempratureAvg)
            this.reportData[i].airIntakeTempratureAvg="NA";
        if(this.reportData[i]&&this.reportData[i].airIntakePressureAvg)
            this.reportData[i].airIntakePressureAvg="NA";
    }
  }

  buildReportDataObj=function(result){
      let self=this;
      this.reportData=[];
      let tempDate=this.bsRangeValue[0].toISOString();
    for(var i=0;i<7;i++){
        result.forEach(function(item){
            if(item.createdAt.split("T")[0] == tempDate.split("T")[0]){
                self.reportData.push(item);
            }
        })
        tempDate=new Date(tempDate)
        tempDate.setDate( tempDate.getDate()+ 1 );
        tempDate=tempDate.toISOString();
    }
    for(var i=0;i<7;i++){
    if(!(this.reportData[i]&&this.reportData[i].maxDistance))
            this.reportData[i].maxDistance="NA";
        if(!(this.reportData[i]&&this.reportData[i].speedAvg))
            this.reportData[i].speedAvg="NA";
        if(!(this.reportData[i]&&this.reportData[i].rpmAvg))
            this.reportData[i].rpmAvg="NA";
        if(!(this.reportData[i]&&this.reportData[i].airIntakeTempratureAvg))
            this.reportData[i].airIntakeTempratureAvg="NA";
        if(!(this.reportData[i]&&this.reportData[i].airIntakePressureAvg))
            this.reportData[i].airIntakePressureAvg="NA";
    }
  }

  getReportData=function(){
    this.loading = true;
    let reqObj:any={};
    reqObj.startDate=this.bsRangeValue[0].toISOString();
    reqObj.no_of_days=this.dayCount;
    reqObj.vehicleId=this.selectReportModel.vehicleId;
    let filter="";
    let newStartDate=reqObj.startDate.split('T');
    reqObj.startDate=newStartDate[0]+"T00:00:00.00Z";
    filter="?startDate="+reqObj.startDate+"&no_of_days="+reqObj.no_of_days+"&vehicleId="+reqObj.vehicleId;
    this.restService.makeCall('trip', 'GET', '/' +this.selectReportModel.tenantId + '/reports'+filter, reqObj)
        .subscribe(resp => {
            if (resp.body && resp.body.data) {
                this.loading = false;
                let result=resp.body.data;
                this.buildReportDataObj(result);
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting list');
        });
  }

  //for superadmin only
  getTenantList=function(role){
    this.loading = true;
    this.restService.makeCall('Users','GET','/users?roleId=' + role,{})
        .subscribe(resp => {
            //
            if (resp.body && resp.body.data) {
                this.loading = false;
                this.tenantList = resp.body.data;
                if(this.tenantList[0]){
                  //get fleet list for default initial tenant
                  if(this.tenantList[0].Tenant && this.tenantList[0].Tenant.id)
                    this.selectReportModel.tenantId=this.tenantList[0].Tenant.id
                  else if(this.tenantList[0].tenantId)
                    this.selectReportModel.tenantId=this.tenantList[0].tenantId
                  this.getFleetListByTenantId(this.selectReportModel.tenantId);
                }
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting list');
        });
  }

  getFleetListByTenantId=function(tenantId){
    this.loading = true;
    this.restService.makeCall('Fleets', 'GET', '/'+tenantId+'/fleets', {})
        .subscribe(resp => {
            if (resp.body && resp.body.data) {
                this.loading = false;
                this.fleetList = resp.body.data;
                this.onFleetChange(this.fleetList[0].id);
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting list');
        });
  }

  getVehicleList=function(fleetId){
    this.loading = true;
    let tenantId="";
    this.restService.makeCall('Fleets', 'GET', '/' +this.selectReportModel.tenantId + '/vehicles?fleetId='+fleetId, {})
        .subscribe(resp => {
            if (resp.body && resp.body.data) {
                this.loading = false;
                this.vehicleList = resp.body.data;
                if(this.vehicleList && this.vehicleList.length>0)
                  this.onVehicleChange(this.vehicleList[0].id);
            }
        }, error => {
            this.loading = false;
            this.toastr.error('Error getting list');
        });
  }

  getRoles(){
    let self=this;
    return new Promise(function(resolve, reject){
      self.loading = true;
      self.restService.makeCall('Users', 'GET', '/roles', {})
          .subscribe(resp => {
              //this.loading = false;
              if (resp.body && resp.body.data) {
                  self.loading = false;
                  self.roleList = resp.body.data;
                  resolve(self.roleList);
              }
          }, error => {
              self.loading = false;
              self.toastr.error('Error getting list');
              reject(error);
          });
    });
  }

  getReportUrls=function(tenantId){
    this.restService.makeCall('Users', 'GET', '/reports/' + tenantId, {})
        .subscribe(resp => {
            if (resp.body && resp.body.data) {
                this.reportIdArray = resp.body.data;
                localStorage.setItem('reportUrls',JSON.stringify(this.reportIdArray));
                this.getFleetListByTenantId(this.selectReportModel.tenantId);
            }
        }, error => {
            this.toastr.error('Error getting Report Urls');
        });
  }

  onTenantChange=function(){
    //getReportUrls for this tenant
    this.getReportUrls(this.selectReportModel.tenantId);
  }

  onFleetChange=function(fleetId){
    this.selectReportModel.fleetId=fleetId;
    this.getVehicleList(this.selectReportModel.fleetId);
  }

  onVehicleChange=function(vehicleId){
    this.selectReportModel.vehicleId=vehicleId;
    this.getReportData();
  }

  ngOnInit() {
    let self=this;
    this.getRoles().then(function(roles){
      if(self.currentUserInfo && self.currentUserInfo.currentRole){
        //Super admin call
        if(self.currentUserInfo.currentRole.toLowerCase()=='super admin'){  
            for (var i = self.roleList.length - 1; i >= 0; --i) {
              if (self.roleList[i].roleName.toLowerCase() == "tenant admin") {
                self.getTenantList(self.roleList[i].id);
              }
            }
        }
        //tenant admin call
        else if(self.currentUserInfo.currentRole.toLowerCase()=='tenant admin'){
            if(self.currentUserInfo.Tenant && self.currentUserInfo.Tenant.id)
              self.selectReportModel.tenantId=self.currentUserInfo.Tenant.id
            else if(self.currentUserInfo.tenantId)
              self.selectReportModel.tenantId=self.currentUserInfo.tenantId
            self.getFleetListByTenantId(self.selectReportModel.tenantId);
        }
      }
    }
    ,function(err){

    })
  }

 

  getMonthString=function(monthNumber){
    switch(monthNumber){
      case 1:
          return "Jan";
      case 2:
          return "Feb";
      case 3:
          return "Mar";
      case 4:
          return "Apr";
      case 5:
          return "May";
      case 6:
          return "Jun";
      case 7:
          return "Jul";
      case 8:
          return "Aug";
      case 9:
          return "Sep";
      case 10:
          return "Oct";
      case 11:
          return "Nov";
      case 12:
          return "Dec";
      default:
          return "Invalid month";
  } 
  }
  generateColumns=function(firstValue){
    let tempDate=new Date(firstValue);
    for(var i=0;i<7;i++){
      this.displayedColumns[i]=this.getMonthString(tempDate.getMonth()+1)+" "+tempDate.getDate();
      tempDate.setDate(tempDate.getDate()+1);
    }
  }
  onValueChange(value:Date):void{
    if(value && value[0] && value[1]){
      var timeDiff = Math.abs(value[0].getTime() - value[1].getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      if(diffDays>6){
        this.toastr.error("Please select date range less than 7 days");
        return;
      }
      else{
        this.dayCount=diffDays+1;
        let firstValue=value[0];
        this.generateColumns(firstValue);
        if(this.selectReportModel.vehicleId)
            this.getReportData();   
      }
    }
    
  }

  openModal(template: TemplateRef<any>,paramName) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    this.selectedParamGraph=paramName;
    if(paramName=='mileage')
        this.graphChange('Average_Mileage_Date_Slicer');
    if(paramName=='speed')
        this.graphChange('Average_Speed_Date_Slicer');
    if(paramName=="rpm")
        this.graphChange('Average_RPM_Date_Slicer');
  }   

  getGraphData=function(paramName,calcReq){ 
    
  }

  graphChange(param){
    let reportId='';
    for(var i=0;i<this.reportIdArray.length;i++){
        if(this.reportIdArray[i].reportName.toLowerCase()==param.toLowerCase() || this.reportIdArray[i].reportName.toLowerCase()==(param.toLowerCase()+'_qa')){
            reportId=this.reportIdArray[i].reportId;
            break;
        }
    }
    return new Promise((resolve, reject) =>  {
    //REPORTS_ENDPOINTS.reportIds[this.selectedParamGraph+'ReportUrl'] should be taken from rest API call
    reportURL = REPORTS_ENDPOINTS.reportInitialURL +reportId  + REPORTS_ENDPOINTS.reportQueryParams+"&$filter=vehiclehistories/VehicleId eq '"+this.selectReportModel.vehicleId+"'";// and vehiclehistories/plate_no eq '"+''+"'";
    
    this.reportFunction(reportURL)
  })
}
reportFunction(reportURL) {
    return new Promise((resolve, reject) =>  {

    $.post(SERVICE_URL.FLEET + '/powerbi/auth',
        { },
        function (data, status) {
            try {
                let data1 = JSON.parse(data);
                //reportURL = REPORTS_ENDPOINTS.reportInitialURL + REPORTS_ENDPOINTS.reportIds.mileage.daily + REPORTS_ENDPOINTS.reportQueryParams+"&$filter=vehiclehistories/company_name eq '"+company_name+"' and vehiclehistories/plate_no eq '"+plate_no+"'";
                var embedUrl = reportURL;
                if ("" === embedUrl) {
                    return;
                }
                this.iframe = document.getElementById('iframeId');
                this.iframe.src = embedUrl;
                this.iframe.onload = function () {
                    postActionLoadReport('iframeId')
                };
                Token = data1;
                var accessToken = Token.access_token;
                if ("" === accessToken) {
                    return;
                }
                var m = {action: "loadReport", accessToken: accessToken};
                var message = JSON.stringify(m);
                this.iframe = document.getElementById("iframeId");
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