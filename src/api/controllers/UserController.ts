import {
    JsonController,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Res,
    HttpCode,
    Authorized
} from 'routing-controllers';
import { Response } from 'express';
import { Service } from 'typedi';
import { BaseController } from './BaseController';
import { CreateUserDto, UpdateUserDto, CreateFirstUserDto } from '../validators/UserDto';
import { User } from '../models/User';
import { env } from '../../env';
import * as bcrypt from 'bcrypt';

@JsonController('/users')
@Service()
export class UserController extends BaseController {
    constructor() {
        super();
    }

    @Post('/first')
    @HttpCode(201)
    public async createFirstUser(@Body() userData: CreateFirstUserDto, @Res() res: Response): Promise<Response> {
        try {
            if (userData.secretKey !== env.admin.secretKey) {
                return this.sendBadRequest(res, 'Invalid secret key');
            }

            const userCount = await User.countDocuments({ isActive: true });
            if (userCount > 0) {
                return this.sendBadRequest(res, 'First user already exists');
            }

            const existingUser = await User.findOne({ email: userData.email, isActive: true });
            if (existingUser) {
                return this.sendBadRequest(res, 'Email already exists');
            }

            const existingUsername = await User.findOne({ username: userData.username, isActive: true });
            if (existingUsername) {
                return this.sendBadRequest(res, 'Username already exists');
            }

            const existingName = await User.findOne({ name: userData.name, isActive: true });
            if (existingName) {
                return this.sendBadRequest(res, 'Name already exists');
            }

            const existingPhone = await User.findOne({ phone: userData.phone, isActive: true });
            if (existingPhone) {
                return this.sendBadRequest(res, 'Phone number already exists');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                username: userData.username,
                password: hashedPassword
            });
            
            const savedUser = await user.save();
            const userResponse = await User.findById(savedUser._id).select('-password');
            
            return this.sendCreated(res, userResponse, 'First user created successfully');
        } catch (error: any) {
            console.error('Error creating first user:', error);
            
            if (error.code === 11000) {
                if (error.keyPattern?.email) return this.sendBadRequest(res, 'Email already exists');
                if (error.keyPattern?.username) return this.sendBadRequest(res, 'Username already exists');
                if (error.keyPattern?.name) return this.sendBadRequest(res, 'Name already exists');
                if (error.keyPattern?.phone) return this.sendBadRequest(res, 'Phone number already exists');
                return this.sendBadRequest(res, 'Duplicate entry found');
            }
            
            return this.sendError(res, 'Failed to create first user');
        }
    }

    @Get()
    @Authorized()
    public async getUsers(@Res() res: Response): Promise<Response> {
        try {
            const users = await User.find({ isActive: true }).select('-password');
            return this.sendSuccess(res, users, 'Users retrieved successfully');
        } catch (error) {
            console.error('Error getting users:', error);
            return this.sendError(res, 'Failed to retrieve users');
        }
    }

    @Get('/:id')
    @Authorized()
    public async getUser(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                return this.sendNotFound(res, 'User not found');
            }
            return this.sendSuccess(res, user, 'User retrieved successfully');
        } catch (error) {
            console.error('Error getting user:', error);
            return this.sendError(res, 'Failed to retrieve user');
        }
    }

    @Post()
    @HttpCode(201)
    @Authorized()
    public async createUser(@Body() userData: CreateUserDto, @Res() res: Response): Promise<Response> {
        try {
            const existingUser = await User.findOne({ email: userData.email, isActive: true });
            if (existingUser) {
                return this.sendBadRequest(res, 'Email already exists');
            }

            const existingUsername = await User.findOne({ username: userData.username, isActive: true });
            if (existingUsername) {
                return this.sendBadRequest(res, 'Username already exists');
            }

            const existingName = await User.findOne({ name: userData.name, isActive: true });
            if (existingName) {
                return this.sendBadRequest(res, 'Name already exists');
            }

            const existingPhone = await User.findOne({ phone: userData.phone, isActive: true });
            if (existingPhone) {
                return this.sendBadRequest(res, 'Phone number already exists');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                username: userData.username,
                password: hashedPassword
            });
            
            const savedUser = await user.save();
            const userResponse = await User.findById(savedUser._id).select('-password');
            
            return this.sendCreated(res, userResponse, 'User created successfully');
        } catch (error: any) {
            console.error('Error creating user:', error);
            
            if (error.code === 11000) {
                if (error.keyPattern?.email) return this.sendBadRequest(res, 'Email already exists');
                if (error.keyPattern?.username) return this.sendBadRequest(res, 'Username already exists');
                if (error.keyPattern?.name) return this.sendBadRequest(res, 'Name already exists');
                if (error.keyPattern?.phone) return this.sendBadRequest(res, 'Phone number already exists');
                return this.sendBadRequest(res, 'Duplicate entry found');
            }
            
            return this.sendError(res, 'Failed to create user');
        }
    }

    @Put('/:id')
    @Authorized()
    public async updateUser(
        @Param('id') id: string,
        @Body() userData: UpdateUserDto,
        @Res() res: Response
    ): Promise<Response> {
        try {
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const user = await User.findByIdAndUpdate(
                id,
                userData,
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) {
                return this.sendNotFound(res, 'User not found');
            }
            return this.sendSuccess(res, user, 'User updated successfully');
        } catch (error: any) {
            console.error('Error updating user:', error);
            
            if (error.code === 11000) {
                if (error.keyPattern?.email) return this.sendBadRequest(res, 'Email already exists');
                if (error.keyPattern?.username) return this.sendBadRequest(res, 'Username already exists');
                if (error.keyPattern?.name) return this.sendBadRequest(res, 'Name already exists');
                if (error.keyPattern?.phone) return this.sendBadRequest(res, 'Phone number already exists');
                return this.sendBadRequest(res, 'Duplicate entry found');
            }
            
            return this.sendError(res, 'Failed to update user');
        }
    }

    @Delete('/:id')
    @Authorized()
    public async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            const result = await User.findByIdAndUpdate(id, { isActive: false });
            if (!result) {
                return this.sendNotFound(res, 'User not found');
            }
            return this.sendSuccess(res, undefined, 'User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            return this.sendError(res, 'Failed to delete user');
        }
    }
}