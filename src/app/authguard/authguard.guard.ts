import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {Globals} from '../shared/globals';
import {ResponseMessagesService} from '../shared/response-status/response-messages.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AuthguardGuard implements CanActivate {

    constructor(
        private router: Router,
        private globals: Globals,
        private toastr: ToastrService,
        private rSM: ResponseMessagesService
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        try {
            const token = localStorage.getItem('access_token');
            if (token && token !== '' && token !== null && token !== 'null') {
                this.globals.isLoggedIn = true;
                this.globals.token = localStorage.getItem('access_token');
                return this.globals.isLoggedIn;
            } else {

                if (state.url !== "/") {
                    this.toastr.error(this.rSM.genericsMsg.unauthorizedErrorMessage[this.globals.lang],
                        this.rSM.genericsMsg.unauthorizedTitile[this.globals.lang]);
                }
                localStorage.clear();
                this.router.navigate(['/login']);
                return false;
            }
        } catch (err) {
            return false;
        }


    }


}
