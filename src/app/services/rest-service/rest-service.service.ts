import { ValdationsService } from './../../shared/valdations.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, map, tap, startWith, switchMap } from 'rxjs/operators';
import * as $ from 'jquery';
import { Globals } from '../../shared/globals';
import { ToastrService } from 'ngx-toastr';
/** SERVICE_URL from environment */
var environment:any={};
var SERVICE_URL:any={};
var API_ENDPOINT:any={};
/** UserManagementService httpOptions */
const httpOptions = {
    headers: new HttpHeaders(
        { 'Content-Type': 'application/json' }
    )
};

@Injectable()
export class RestService {

    constructor(
        private http: HttpClient,
        private globals: Globals,
        private toastr: ToastrService,) { 
            
        }

    /** GET user from the server */

    makeCall(serviceName, method, api, reqObj: any): Observable<any> {
        environment=JSON.parse(sessionStorage.getItem('sessionConfiguration'));
        if(environment){
                SERVICE_URL = environment.SERVICE_URL;
                /** API_ENDPOINT from environment */
                API_ENDPOINT = environment.API_ENDPOINT;
        }
        if (serviceName.toLowerCase() === 'users') {
            api = SERVICE_URL.USER + api;
        }
        else if (serviceName.toLowerCase() === 'fleets') {
            api = SERVICE_URL.FLEET + api;
        }
        else if (serviceName.toLowerCase() === 'trip') {
            api = SERVICE_URL.TRIP + api;
        }
        else{
            api = SERVICE_URL + api;//default
        }
        const req = new HttpRequest(method, api, reqObj);
        /*
        return this.http.request(req).pipe(
          map(event => this.getEventMessage(event, file)),
          tap(message => this.showProgress(message)),
          last(), // return last (completed) message to caller
          catchError(this.handleError(file))
        );
        */
        return this.http.request(req).pipe(
            catchError(this.handleError('api', []))
        );
    }

    /** Log a UserService message with the MessageService */
    private log(message: string) {
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            if (error && error.error && error.error.message) {
                console.log("error", error.error.error.errors[0]);
                this.toastr.error(error.error.error.errors[0].message);
            }
                
            else
                //this.toastr.error('Something went wrong')
                //this.toastr.error('Something went terribly wrong. Please login again.');
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
