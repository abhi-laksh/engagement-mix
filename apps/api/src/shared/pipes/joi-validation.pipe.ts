import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(
    private schema: ObjectSchema,
    private target: 'body' | 'query' | 'param' = 'body',
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== this.target) {
      return value;
    }

    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errorMessage}`);
    }

    return validatedValue;
  }
}
