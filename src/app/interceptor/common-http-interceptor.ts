import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Globals } from '../shared/globals';
import { ResponseMessagesService } from '../shared/response-status/response-messages.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
    constructor(
        private globals: Globals,
        private toastr: ToastrService,
        private rSM: ResponseMessagesService,
        private router: Router,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Clone the request to add the new header.
        const authReq = req.clone({ headers: req.headers.set('Authorization', this.globals.token) });

        // send the newly created request
        return next.handle(authReq).do((event: HttpEvent<any>) => {

        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.toastr.clear();
                    this.toastr.error(this.rSM.resMsg[err.status][this.globals.lang],
                        this.rSM.genericsMsg.errorTitile[this.globals.lang]);
                    
                    this.router.navigate(['login']);
                    this.toastr.clear();
                    return null;
                }
            }
        });
    }
}


