import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export function throwIfInvalidObjectId(id: string, fieldName = 'id'): void {
  if (!validateObjectId(id)) {
    throw new BadRequestException(`Invalid ${fieldName} format`);
  }
}

export function parseToObjectId(id: string): Types.ObjectId {
  throwIfInvalidObjectId(id);
  return new Types.ObjectId(id);
}