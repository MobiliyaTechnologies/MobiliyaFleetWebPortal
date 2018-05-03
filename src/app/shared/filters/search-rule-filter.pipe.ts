import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchRuleFilter'
})
export class SearchRuleFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return (it.ruleName.toLowerCase().includes(searchText));
        });
    }
}
