import { Component, OnInit } from '@angular/core';
import { ShareSocketDataService } from "../../services/share-socket-data.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications:any=[];

  constructor(private socketDataService: ShareSocketDataService) { }

  ngOnInit() {
    //this.notifications=this.socketDataService.notifications;
    this.socketDataService.notifications.subscribe(notifications=>this.notifications=JSON.parse(notifications));
  }

}
