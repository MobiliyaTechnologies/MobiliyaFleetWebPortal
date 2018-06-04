import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    translate: TranslateService; // <-- defining translate as a private property

    switchLanguage = (lang: string) => {  // <-- creating a new method
        this.translate.use(lang); // <-- invoking `use()`
    }

    constructor(translate: TranslateService,private http: HttpClient) {
        this.translate = translate;  // <-- binding the injected `TranslatedService` to the local `translate` property
        translate.setDefaultLang('en');

        this.http.get('assets/configs.json',    {
            headers: new HttpHeaders().set('Content-Type','application/json'),
        }).subscribe((data: any) => {
            console.log('[Info] :: Config Loaded', JSON.parse(JSON.stringify(data)));
            sessionStorage.setItem('sessionConfiguration',JSON.stringify(data));
            //adalService.init(JSON.parse(JSON.stringify(data)).config);
            //this.navchange.emit(1);
        },err => this.logError(err)
        );
    }
    logError(err: any) {
        sessionStorage.setItem("HELLO","HEY ITS AN URL");
        console.log("[Error]", err);
    }
    title = 'app';
}
