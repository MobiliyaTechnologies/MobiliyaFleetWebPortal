import { Injectable } from '@angular/core';

@Injectable()
export class ResponseMessagesService {


  resMsg: any = {

    // Ok
    200: {
      en: 'Success',
      de: ''
    },

    // Created
    201: {
      en: 'Successfully Created',
      de: ''
    },

    // Delete
    204: {
      en: 'Successfully Deleted',
      de: ''
    },

    // not modified
    304: {
      en: 'Not Modified',
      de: ''
    },

    // Unauthorized
    401: {
      en: 'Unauthorized access',
      de: ''
    },

    // Unprocessable Entity
    422: {
      en: 'Unprocessable',
      de: ''
    },

    // Internal Server Error
    500: {
      en: 'Internal Server Error',
      de: ''
    },

  };

  genericsMsg: any = {
    errorTitile: {
      en: 'Failure',
      de: ''
    },
    userCreated: {
      en: 'User Created Successfully',
      de: ''
    },
    userUpdated: {
      en: 'User Updated Successfully',
    },

    errorMessage: {
      en: 'Something went wrong',
      de: ''
    },

    unauthorizedTitile: {
      en: 'Unauthorized',
      de: ''
    },

    unauthorizedErrorMessage: {
      en: 'Access Denied',
      de: ''
    },

    successTitile: {
      en: 'Success',
      de: ''
    },

    successMessage: {
      en: 'success',
      de: ''
    },

    companyCreated: {
      en: 'Company Created Successfully',
      de: '公司创造成功'
    },

    companyUpdated: {
      en: 'Company Updated Successfully',
      de: '公司更新成功'
    },

    deviceUpgradeCreated: {
      en: 'Device Upgrade Created Successfully',
      de: ''
    },

    deviceUpgradeUpdated: {
      en: 'Device Upgrade Updated Successfully',
      de: ''
    },

    emailRequired: {
      en: 'Please enter valid email',
      de: '请输入有效的电子邮件'
    },

    nameRequired: {
      en: 'Please enter valid name',
      de: '请输入有效的名字'
    },

    requiredField: {
      en: 'Please filled required field',
      de: '请填写必填字段'
    }

  };

  constructor() { }
}
