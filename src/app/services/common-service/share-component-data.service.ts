import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ShareComponentDataService {
  private messageSource = new BehaviorSubject<string>(JSON.stringify([]));
  private selectedItemSource = new BehaviorSubject<string>(JSON.stringify({}));
  
  data = this.messageSource.asObservable();
  selectedItem=this.selectedItemSource.asObservable();
  constructor() { }
 
  changeData(data:string) {
    this.messageSource.next(data)
  }

  setSelectedItem(data:string){
    this.selectedItemSource.next(data);
  }
}
