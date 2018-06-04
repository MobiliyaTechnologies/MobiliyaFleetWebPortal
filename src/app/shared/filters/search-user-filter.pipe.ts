import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchUserFilter',
    pure:false
})
export class SearchUserFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
            if (!items) return [];
            if (!searchText) return items;
            searchText = searchText.toLowerCase();
            
            return items.filter(it => {
                    return (it.firstName.toLowerCase().includes(searchText));
            });
    }

}
