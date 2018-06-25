import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleFleetSearch',
  pure: false
})
export class VehicleFleetSearchPipe implements PipeTransform {

  transform(items:any= {}, searchText: string): any[] {
    if (!(items && items.data)) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.data.filter(it => {
        if(it.ownerName)
          return (it.registrationNumber.toLowerCase().includes(searchText)|| it.model.toLowerCase().includes(searchText) || it.ownerName.toLowerCase().includes(searchText) ||it.deviceName.toLowerCase().includes(searchText));
        else
          return (it.registrationNumber.toLowerCase().includes(searchText)|| it.model.toLowerCase().includes(searchText) ||it.deviceName.toLowerCase().includes(searchText));
    });
}
}
