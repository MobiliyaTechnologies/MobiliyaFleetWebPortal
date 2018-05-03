import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class ShareSocketDataService {
 private messageSource = new BehaviorSubject<string>(JSON.stringify([]));
 notifications = this.messageSource.asObservable();
  
 constructor() { }

  changeData(notifications:string) {
    this.messageSource.next(notifications)
  }
}
