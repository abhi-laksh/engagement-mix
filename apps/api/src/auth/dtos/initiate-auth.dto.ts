import { ApiProperty } from '@nestjs/swagger';

export class InitiateAuthDto {
  @ApiProperty({
    description: 'Email address for authentication',
    example: 'user@example.com',
  })
  email: string;
}
