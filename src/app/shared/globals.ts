import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    role: string = 'test';
    isLoggedIn: boolean = false;
    token: string = '';
    selectedTab: string = localStorage.getItem('selectedTab') || 'device';
    lang: string = localStorage.getItem('lang') || 'en';
    pattern={
        "licenseNumber":'^[0-9a-zA-Z]{4,9}$'
    };

}
