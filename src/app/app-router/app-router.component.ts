import { NotFoundComponent } from './../not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthguardGuard } from '../authguard/authguard.guard';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { LoginComponent } from '../modules/login/login.component';
import { ForgotPasswordComponent } from '../modules/forgot-password/forgot-password.component';
import { SetNewPasswordComponent } from '../modules/set-new-password/set-new-password.component';
import { ListUsersComponent } from '../modules/user-management/list-users/list-users.component';
import { DeviceLayoutComponent } from '../modules/device-management/device-layout/device-layout.component';
import { DeviceDetailsComponent } from '../modules/device-management/device-details/device-details.component';
import { EditDeviceComponent } from '../modules/device-management/edit-device/edit-device.component';
import { AddDeviceComponent } from '../modules/device-management/add-device/add-device.component';
import { VehicleDetailsComponent } from '../modules/vehicle-management/vehicle-details/vehicle-details.component';
import { FleetLayoutComponent } from '../modules/fleet-management/fleet-layout/fleet-layout.component';
import { FleetDetailsComponent } from '../modules/fleet-management/fleet-details/fleet-details.component';
import { EditFleetComponent } from '../modules/fleet-management/edit-fleet/edit-fleet.component';
import { AddFleetComponent } from '../modules/fleet-management/add-fleet/add-fleet.component';
import { AddVehicleComponent } from '../modules/vehicle-management/add-vehicle/add-vehicle.component';
import { VehicleLayoutComponent } from '../modules/vehicle-management/vehicle-layout/vehicle-layout.component';
import { VehicleTripHistoryComponent } from '../modules/vehicle-management/vehicle-trip-history/vehicle-trip-history.component';
import { EditVehicleComponent } from '../modules/vehicle-management/edit-vehicle/edit-vehicle.component';
import { ReportsComponent } from '../modules/reports/reports.component';
import { RulesListComponent } from '../modules/rules/rules-list/rules-list.component';
import { RulesDetailComponent } from '../modules/rules/rules-detail/rules-detail.component';
import { AddRuleComponent } from '../modules/rules/add-rule/add-rule.component';
import { NotificationsComponent } from '../modules/notifications/notifications.component';

const routes: Routes = [
    { path: '', canActivate: [AuthguardGuard], component: LayoutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'home', canActivate: [AuthguardGuard], component: DashboardComponent },
    {
        path: 'dashboard', component: LayoutComponent,
        children: [
            { path: '', canActivate: [AuthguardGuard], component: DashboardComponent },
            {
                path: 'home', canActivate: [AuthguardGuard], component: DashboardComponent

            },
            // User urls
            { path: 'list-users', canActivate: [AuthguardGuard], component: ListUsersComponent },
            {
                path: 'devices', canActivate: [AuthguardGuard], component: DeviceLayoutComponent,
                children: [
                    { path: 'details/:id', canActivate: [AuthguardGuard], component: DeviceDetailsComponent },
                    { path: 'edit/:id', canActivate: [AuthguardGuard], component: EditDeviceComponent },
                    { path: 'add', canActivate: [AuthguardGuard], component: AddDeviceComponent }
                ]
            },

            {
                path: 'vehicle', canActivate: [AuthguardGuard], component: VehicleLayoutComponent,
                children: [
                    { path: 'details/:id', canActivate: [AuthguardGuard], component: VehicleDetailsComponent },
                    { path: 'tripHistory/:id', canActivate: [AuthguardGuard], component: VehicleTripHistoryComponent },
                    { path: 'add', canActivate: [AuthguardGuard], component: AddVehicleComponent },
                    { path: 'editVehicle/:id', canActivate: [AuthguardGuard], component: EditVehicleComponent }
                ]
            },
            {
                path: 'fleets', canActivate: [AuthguardGuard], component: FleetLayoutComponent,
                children: [
                    { path: 'details/:id', canActivate: [AuthguardGuard], component: FleetDetailsComponent },
                    { path: 'edit/:id', canActivate: [AuthguardGuard], component: EditFleetComponent },
                    { path: 'add',  component: AddFleetComponent }
                ]
            },
            {
                path: 'reports', canActivate: [AuthguardGuard], component: ReportsComponent
            },
            {
                path: 'rules', canActivate: [AuthguardGuard], component: RulesListComponent,
                children: [
                    { path: 'details/:id', canActivate: [AuthguardGuard], component: RulesDetailComponent },
                    { path: 'add', component: AddRuleComponent }
                ]
            },
            {
                path: 'notifications', canActivate: [AuthguardGuard], component: NotificationsComponent
            }
        ]
    },
    { path: 'reset-password', component: SetNewPasswordComponent },
    { path: '**', component: NotFoundComponent }

];


@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouterComponent {

}
