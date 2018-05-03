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
                    it.name=it.firstName+" "+it.lastName;
                    return (it.firstName.toLowerCase().includes(searchText) || it.lastName.toLowerCase().includes(searchText) ||it.name.toLowerCase().includes(searchText));
            });
    }

}
