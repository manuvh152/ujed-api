import { ValidationOptions, registerDecorator } from "class-validator";

export function IsOnlyDate(validOptions?: ValidationOptions){
  return function(object: Object, propertyName: string){
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be formatted as yyyy-mm-dd`
      },
      validator: {
        validate(value: any){
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === 'string' && regex.test(value);
        }
      }
    });
  }
}