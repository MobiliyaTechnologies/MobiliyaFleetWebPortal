import {ValdationsService} from './shared/valdations.service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LoginService} from './services/login/login.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AppRouterComponent} from './app-router/app-router.component';
import {LoadingModule, ANIMATION_TYPES} from 'ngx-loading';
import {LoginComponent} from './modules/login/login.component';
import {ToastrModule} from 'ngx-toastr';
import {AgmCoreModule} from '@agm/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { ShareSocketDataService } from "./services/share-socket-data.service";
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
} from '@angular/material';
import {ResponseMessagesService} from './shared/response-status/response-messages.service';
import {AuthguardGuard} from './authguard/authguard.guard';
import {CommonHttpInterceptor} from './interceptor/common-http-interceptor';
import {Globals} from './shared/globals';
import {DeleteConfirmDialogComponent} from './shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { ForgotPasswordService } from './services/forgot-password/forgot-password.service';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { SetNewPasswordService } from './services/set-new-password/set-new-password.service';

import { SetNewPasswordComponent } from './modules/set-new-password/set-new-password.component';
import { ListUsersComponent } from './modules/user-management/list-users/list-users.component';
import { RestService } from './services/rest-service/rest-service.service';
import { SearchUserFilterPipe } from './shared/filters/search-user-filter.pipe';
import { RoleFilterPipe } from './shared/filters/role-filter.pipe';
import { VehicleManagementComponent } from './modules/vehicle-management/vehicle-management.component';
import { AddVehicleComponent } from './modules/vehicle-management/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './modules/vehicle-management/edit-vehicle/edit-vehicle.component';
import { VehicleDetailsComponent } from './modules/vehicle-management/vehicle-details/vehicle-details.component';
import { VehicleLayoutComponent } from './modules/vehicle-management/vehicle-layout/vehicle-layout.component';
import { DeviceLayoutComponent } from './modules/device-management/device-layout/device-layout.component';
import { DeviceDetailsComponent } from './modules/device-management/device-details/device-details.component';
import { AddDeviceComponent } from './modules/device-management/add-device/add-device.component';
import { EditDeviceComponent } from './modules/device-management/edit-device/edit-device.component';
import { SearchDeviceFilterPipe } from './shared/filters/search-device-filter.pipe';
import { VehicleSearchFilterPipe } from './shared/filters/vehicle-search-filter.pipe';
import { SearchFleetDialogComponent } from './shared/search-fleet-dialog/search-fleet-dialog.component';
import { FleetSearchFilterPipe } from './shared/filters/fleet-search-filter.pipe';
import { FleetLayoutComponent } from './modules/fleet-management/fleet-layout/fleet-layout.component';
import { FleetDetailsComponent } from './modules/fleet-management/fleet-details/fleet-details.component';
import { AddFleetComponent } from './modules/fleet-management/add-fleet/add-fleet.component';
import { VehicleTripHistoryComponent } from './modules/vehicle-management/vehicle-trip-history/vehicle-trip-history.component';
import { VehicleTripHistoryDetailsComponent } from './modules/vehicle-management/vehicle-trip-history-details/vehicle-trip-history-details.component';
import { SearchFleetFilterPipe } from './shared/filters/search-fleet-filter.pipe';
import { EditFleetComponent } from './modules/fleet-management/edit-fleet/edit-fleet.component';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { RulesListComponent } from './modules/rules/rules-list/rules-list.component';
import { RulesDetailComponent } from './modules/rules/rules-detail/rules-detail.component';
import { AddRuleComponent } from './modules/rules/add-rule/add-rule.component';
import { SearchRuleFilterPipe } from './shared/filters/search-rule-filter.pipe';
import { FilterRuleDialogComponent } from './shared/filter-rule-dialog/filter-rule-dialog.component';
import { NotificationsComponent } from './modules/notifications/notifications.component';
import { VehicleFleetSearchPipe } from './shared/filters/vehicle-fleet-search.pipe';
import { SafePipe } from './shared/safe.pipe';
import { RuleFilterPipe } from './shared/filters/rule-filter.pipe';

// import {NgxChartsModule} from '@swimlane/ngx-charts';
export const createTranslateLoader = (http: HttpClient) => {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        NotFoundComponent,
        DeleteConfirmDialogComponent,
        LoginComponent,
        ForgotPasswordComponent,
        SetNewPasswordComponent,
        ListUsersComponent,
        SearchUserFilterPipe,
        RoleFilterPipe,
        VehicleManagementComponent,
        AddVehicleComponent,
        EditVehicleComponent,
        VehicleDetailsComponent,
        VehicleLayoutComponent,
        DeviceLayoutComponent,
        DeviceDetailsComponent,
        AddDeviceComponent,
        EditDeviceComponent,
        SearchDeviceFilterPipe,
        VehicleSearchFilterPipe,
        SearchFleetDialogComponent,
        FleetSearchFilterPipe,
        FleetLayoutComponent,
        FleetDetailsComponent,
        AddFleetComponent,
        VehicleTripHistoryComponent,
        VehicleTripHistoryDetailsComponent,
        SearchFleetFilterPipe,
        EditFleetComponent,

        DashboardComponent,
        ReportsComponent,
        RulesListComponent,
        RulesDetailComponent,
        AddRuleComponent,
        SearchRuleFilterPipe,
        FilterRuleDialogComponent,
        NotificationsComponent,
        VehicleFleetSearchPipe,
        SafePipe,
        RuleFilterPipe
    ],
    imports: [
        NgxChartsModule,
        NgxGaugeModule,  
        AppRouterComponent,
        BrowserAnimationsModule,
        CdkTableModule,
        MatTableModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        ToastrModule.forRoot(), // ToastrModule added,

        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.circleSwish,
            backdropBackgroundColour: 'rgba(0,0,0,0.2)',
            fullScreenBackdrop: true,
            backdropBorderRadius: '20px',
            primaryColour: 'blue',
            secondaryColour: 'green',
            tertiaryColour: 'red'
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBCIl9BPVlopR8D67dGCZsjCI4ajPeaT_4'
        }),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    entryComponents: [
        DeleteConfirmDialogComponent,
        SearchFleetDialogComponent,
        VehicleTripHistoryDetailsComponent,
    ],
    providers: [
        Globals,
        ResponseMessagesService,
        ValdationsService,
        AuthguardGuard,
        LoginService,
        ForgotPasswordService,
        SetNewPasswordService,
        RestService,
        ShareSocketDataService,
       {
            provide: HTTP_INTERCEPTORS,
            useClass: CommonHttpInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
