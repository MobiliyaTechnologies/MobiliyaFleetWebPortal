import { ValdationsService } from './../../shared/valdations.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { Globals } from '../../shared/globals';

/** SERVICE_URL from environment */
var SERVICE_URL:any = {};

/** API_ENDPOINT from environment */
var API_ENDPOINT:any = {};

/** UserManagementService httpOptions */
const httpOptions = {
    headers: new HttpHeaders(
        { 'Content-Type': 'application/json' }
    )
};

@Injectable()
export class ForgotPasswordService {

    constructor(
        private http: HttpClient,
        private globals: Globals) { 
            var environment=JSON.parse(sessionStorage.getItem('sessionConfiguration'));
            if(environment){
                SERVICE_URL = environment.SERVICE_URL;
                /** API_ENDPOINT from environment */
                API_ENDPOINT = environment.API_ENDPOINT;
            }
        }

    /** GET user from the server */

    forgotPassword(model: any): Observable<any> {
        return this.http.post<any>(SERVICE_URL.USER + API_ENDPOINT.forgotPassword, model).pipe(
            map(temsResponse => {
                this.log(`forgot password`);
                this.globals.isLoggedIn = true;
                return (temsResponse.data ? temsResponse.data : null);
            }),
            catchError(this.handleError('ForgotPassword', []))
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

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}