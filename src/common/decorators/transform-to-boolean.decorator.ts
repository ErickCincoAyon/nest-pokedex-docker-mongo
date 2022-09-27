import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

const TransformToBoolean = () => {
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
        return valueToBoolean(obj[key], key);
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

const valueToBoolean = (value: any, key: string) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  throw new BadRequestException(`${ key } must be: ['true', 'on', 'yes', '1'] or ['false', 'off', 'no', '0']`);
};

export { TransformToBoolean };