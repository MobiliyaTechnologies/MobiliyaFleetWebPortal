import {Router} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Renderer2, ViewChild} from '@angular/core';
import {Globals} from '../shared/globals';
import {TranslateService} from '@ngx-translate/core';
import * as $ from 'jquery';
import { RestService } from '../services/rest-service/rest-service.service';
import {NotificationsComponent} from '../modules/notifications/notifications.component';
import * as io from 'socket.io-client';
import { ShareSocketDataService } from "../services/share-socket-data.service";
import { environment } from '../../environments/environment';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

    selectedMenu = 'users';
    selectedRoute = '';
    options: FormGroup;
    mobileQuery: MediaQueryList;
    translate: TranslateService; // <-- defining translate as a private property
    private _mobileQueryListener: () => void;
    sidenavWidth = 15;
    name = 'user';
    userInfo: any = {};
    notifications:any=[];
    socket: SocketIOClient.Socket;
    switchLanguage = (lang: string) => {
        localStorage.setItem('lang', lang);
        this.translate.use(lang); // <-- invoking `use()`
        this.globals.lang = lang;
    }

    constructor(
        private restService: RestService,
        fb: FormBuilder,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private toastr: ToastrService,
        private router: Router,
        private globals: Globals,
        translate: TranslateService,
        private renderer2: Renderer2,
        private socketDataService: ShareSocketDataService) {
        this.translate = translate;  // <-- binding the injected `TranslatedService` to the local `translate` property
        translate.setDefaultLang(this.globals.lang);
        this.options = fb.group({
            'fixed': false,
            'top': 0,
            'bottom': 0,
        });
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        //this.socket = io.connect("https://trip-service.azurewebsites.net/");
        this.socket = io.connect(environment.SERVICE_URL.TRIP);
    }

    ngOnInit() {
        try {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (this.userInfo.firstName && this.userInfo.lastName)
                this.name = this.userInfo.firstName + ' ' + this.userInfo.lastName;
            if (localStorage.getItem('selectedMenu')){
               this.selectedMenu=localStorage.getItem('selectedMenu');
            }

            /**
             * Notifications handling
             */
            let notificationVehcileArray:any=[];
            let counter=0;
            this.socket.on(this.userInfo.id, (msg: any) => {
                if(notificationVehcileArray.length==0){
                    notificationVehcileArray.push(msg);
                    this.socketDataService.changeData(JSON.stringify(notificationVehcileArray));
                }
                else{
                    for(var i=0;i<notificationVehcileArray.length;i++){
                        if(notificationVehcileArray[i].vehicleId!=msg.vehicleId){
                            counter=counter+1;
                        }
                        //check if notification types are different
                        else if(notificationVehcileArray[i].Type!=msg.Type){
                            counter++;
                        }
                    }
                    //no duplicate notification is available
                    if(counter==notificationVehcileArray.length){
                        notificationVehcileArray.push(msg);
                        counter=0;
                        this.socketDataService.changeData(JSON.stringify(notificationVehcileArray));
                    }
                }
                this.notifications=notificationVehcileArray;
            });
            /**
             * Notifications handling ends
             */
        } catch (err) {
        }
    }

    /**Called on page destroy */
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    showInfo(str) {
        this.router.navigate(str);
    }

    /**
     * On logout clear localstorage, disconnect socket and navigate to login page
     */
    logout(): void {
            this.socket.disconnect();
            this.globals.token = '';
            this.globals.isLoggedIn = false;
            localStorage.clear();
            this.toastr.success('Logout SuccessFully', 'Success');
            this.router.navigate(['login']);
    }
    menuPanelClick(menuPanel) {
        this.selectedMenu = menuPanel;
        try {
            localStorage.setItem('selectedMenu', this.selectedMenu);
            localStorage.setItem('selectedRoute', this.selectedRoute);
        } catch (err) {}
    }

    mouseenter(event, depth) {
        this.renderer2.addClass(event.target, 'mat-elevation-z' + depth);
    }

    mouseleave(event, depth) {
        this.renderer2.removeClass(event.target, 'mat-elevation-z' + depth);
    }

    setSelected(selectedItem){
       
    }

    sideNavIcon(link,selectedItem): void {
        this.selectedMenu=selectedItem;
        try {
            localStorage.setItem('selectedRoute', this.selectedRoute);
            localStorage.setItem('selectedMenu', this.selectedMenu);
        } catch (err) {}
        this.router.navigate([link]);
        this.selectedRoute = link;
    }
    
    /**Redirect to notifications page */
    redirectToNotifications=function(){
        this.router.navigate(['/dashboard/notifications']);
    }

}

$(window).resize(function () {
    $('#containerWindow').css({'min-height': $(window).height()});
});

