import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFleetFilter',
  pure: false
})
export class SearchFleetFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
      if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
        return (it.fleetName.toLowerCase().includes(searchText));
    });
  }

}
