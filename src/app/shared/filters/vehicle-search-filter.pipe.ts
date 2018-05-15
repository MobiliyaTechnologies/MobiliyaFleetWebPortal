import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'vehicleSearchFilter',
    pure: false
})
export class VehicleSearchFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        if(items){
            if(items['data'])
                return items['data'].filter(it => {
                    return (it.registrationNumber.toLowerCase().includes(searchText));
                });
            else
                return items.filter(it => {
                    return (it.registrationNumber.toLowerCase().includes(searchText));
                });
        }
    }


}
