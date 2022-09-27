import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { FieldQueryValidation } from '../interfaces/field-validation.interface';

const ValidateObjectProperties = ( props: FieldQueryValidation[] ) => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    }
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return validateProperties( obj[key], props, key );
      },
      {
        toClassOnly: true,
      }
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const validateProperties = ( obj: any, props: FieldQueryValidation[], key: string ) => {
  let objFormatted = {};
  for ( let p in obj ) {
    props.map(( prop: FieldQueryValidation ) => {

      if ( p === prop.field && prop.type === 'number' ) {
        obj[p] = +obj[p];
        if ( isNaN( obj[p] ) || obj[p] < 1 )
          throw new BadRequestException(`${ key }[${ p }] must be a positive number`);
        
      }

      if ( p === prop.field && prop.type === 'boolean' ) {
        if ( ['true', 'on', 'yes', '1'].includes( obj[p] )) {
          obj[p] = true;
        }

        if ( ['false', 'off', 'no', '0'].includes( obj[p] )) {
          obj[p] = false;
        }

        if ( typeof obj[p] !== 'boolean' )
          throw new BadRequestException(`${ key }[${ p }] must be: ['true', 'on', 'yes', '1'] or ['false', 'off', 'no', '0']`);
      }


      if ( p === prop.field && prop.type === 'mongo-regex-exact' ) {
        if ( obj[p].trim() === '' )
          throw new BadRequestException(`${ key }[${ p }] must be longer than or equal to 1 characters`);
        
        obj[p] = new RegExp(["^", obj[p].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "$"].join(""), "i");
      }

      if ( p === prop.field && prop.type === 'mongo-regex-contains' ) {
        if ( obj[p].trim() === '' )
          throw new BadRequestException(`${ key }[${ p }] must be longer than or equal to 1 characters`);
        
        obj[p] = new RegExp( obj[p].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
      }

      if ( p === prop.field && prop.type === 'string' ) {
        if ( obj[p].trim() === '' )
          throw new BadRequestException(`${ key }[${ p }] must be longer than or equal to 1 characters`);
      }

    })  
    objFormatted[p] = obj[p];
  }
  return objFormatted;
};

export { ValidateObjectProperties };