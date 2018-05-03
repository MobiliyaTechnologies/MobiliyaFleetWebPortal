import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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

    constructor(translate: TranslateService) {
        this.translate = translate;  // <-- binding the injected `TranslatedService` to the local `translate` property
        translate.setDefaultLang('en');
    }
    title = 'app';
}
