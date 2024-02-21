import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty({
    type: String,
    format: 'string',
    description: 'Authorization token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcwODQ4MTQwM30.dQC7DscHRSr3S4cTea-PhVFWdlwvWeYKLfyQz7tZBH4',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    format: 'string',
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcwODQ4MTQwMywiZXhwIjoxNzA5MDg2MjAzfQ.sKAY3zRPuo_AuezZsymnZllpJXFmnFgb1DTBUePh46s',
  })
  refreshToken: string;
}
