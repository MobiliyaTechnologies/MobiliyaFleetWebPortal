import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ruleFilter',
    pure: false
})
export class RuleFilterPipe implements PipeTransform {

    transform(items: any[], filterObj: any = {}): any[] {
        if (!filterObj) return [];
        if (!filterObj.ruleType || filterObj.id == -1) return items;
        return items.filter(it => {
            return (it.ruleType === filterObj.ruleType);
        });
    }

}
