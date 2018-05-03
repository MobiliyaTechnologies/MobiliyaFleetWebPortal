import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fleetSearchFilter',
    pure: false//Required so that deep checking happens over search field
})
export class FleetSearchFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return (it.fleetName.toLowerCase().includes(searchText));
        });
    }

}
