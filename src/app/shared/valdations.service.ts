import {Injectable} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
@Injectable()
export class ValdationsService {


    /**
      * required Validator
      */
    public requiredValidator = new FormControl('',
        [Validators.required]);

    /**
     * name Validator
     */
    public nameValidator = new FormControl('',
        [Validators.required]);

    /**
     * password Validator
     */
    public passwordValidator = new FormControl('',
        [Validators.required, Validators.minLength(8),
        Validators.maxLength(16), Validators.pattern('/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/')]);

    /**
   * email Validator
   */
    public emailValidator = new FormControl('',
        [Validators.required,
        Validators.email
        ]);

    /**
   * password Validator
   */
    public mobileValidator: any = new FormControl('',
        [Validators.required, Validators.minLength(10),
        Validators.maxLength(10)]);


    /**
      * validation Responses
      */
    public validationResponses: any = function (myValida) {
        return myValida.hasError('required') ? 'You must enter a value' : '';
    };

    /**
     * required Validation Responses
     */
    public requiredValidationResponses: any = function () {
        return this.requiredValidator.hasError('required') ? 'You must enter a value' : '';
    };


    /**
     *  name Validation Responses
     */
    public nameValidationResponses: any = function () {
        return this.nameValidator.hasError('required') ? 'You must enter a value' : '';
    };

    /**
     * password Validation Responses
     */
    public passwordValidationResponses: any = function () {
        return this.passwordValidator.hasError('required') ? 'You must enter value' :
            this.passwordValidator.hasError('pattern') ? 'Must contain uppercase letters, lowercase letters and special characters' :
                this.passwordValidator.hasError('minLength') ? 'passwords length must be 8 to 16 character long' : '';
    };

    /**
     * email Validation Responses
     */
    public emailValidationResponses: any = function () {
        return this.emailValidator.hasError('required') ? 'You must enter value' :
            this.emailValidator.hasError('pattern') ? 'You must enter valid email' : '';
    };

    /**
       * mobile Validation Responses
       */
    public mobileValidationResponses: any = function () {
        return this.mobileValidator.hasError('required') ? 'You must enter value' :
            this.mobileValidator.hasError('maxLength') ? 'Must be 10 digit' :
                this.mobileValidator.hasError('minLength') ? 'Must be 10 digit' : '';
    };






    // public authNoValidator:any=function (authno)
    constructor() {}

}
