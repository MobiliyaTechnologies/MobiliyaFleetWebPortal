import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleFilter',
    pure: false
})
export class RoleFilterPipe implements PipeTransform {

    transform(items: any[], filterObj: any={}): any[] {
        if (!filterObj) return [];
        if (!filterObj.roleId || filterObj.roleId==-1 ) return items;
      return items.filter(it => {
          return (it.roleId === filterObj.roleId);
      });
  }

}
