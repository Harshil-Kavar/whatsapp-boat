import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches, Length } from 'class-validator';

export class CreateFirstUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid phone number' })
    phone!: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username!: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' })
    password!: string;

    @IsNotEmpty()
    @IsString()
    secretKey!: string;
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid phone number' })
    phone!: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username!: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' })
    password!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid phone number' })
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(3, 20)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username?: string;

    @IsOptional()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' })
    password?: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    username!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string;
}