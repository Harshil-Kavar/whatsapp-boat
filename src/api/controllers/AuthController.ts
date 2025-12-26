import {
    JsonController,
    Post,
    Body,
    Res
} from 'routing-controllers';
import { Response } from 'express';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { BaseController } from './BaseController';
import { LoginDto } from '../validators/UserDto';
import { User } from '../models/User';
import { env } from '../../env';
import * as bcrypt from 'bcrypt';

@JsonController('/auth')
@Service()
export class AuthController extends BaseController {
    constructor() {
        super();
    }

    @Post('/login')
    public async login(@Body() loginData: LoginDto, @Res() res: Response): Promise<Response> {
        try {
            const user = await User.findOne({ username: loginData.username, isActive: true });
            
            if (!user || !await bcrypt.compare(loginData.password, user.password)) {
                return this.sendBadRequest(res, 'Invalid username or password');
            }

            const userResponse = await User.findById(user._id).select('-password');

            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    email: user.email
                },
                env.jwt.access_token_secret
            );

            const refreshToken = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    email: user.email
                },
                env.jwt.refresh_token_secret
            );

            return this.sendSuccess(res, {
                user: userResponse,
                accessToken,
                refreshToken
            }, 'Login successful');

        } catch (error) {
            console.error('Error during login:', error);
            return this.sendError(res, 'Login failed');
        }
    }

    @Post('/refresh')
    public async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response): Promise<Response> {
        try {
            const { refreshToken } = body;

            if (!refreshToken) {
                return this.sendBadRequest(res, 'Refresh token is required');
            }

            const decoded = jwt.verify(refreshToken, env.jwt.refresh_token_secret) as any;

            const newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    username: decoded.username,
                    email: decoded.email
                },
                env.jwt.access_token_secret
            );

            return this.sendSuccess(res, {
                accessToken: newAccessToken
            }, 'Token refreshed successfully');

        } catch (error) {
            console.error('Error refreshing token:', error);
            return this.sendBadRequest(res, 'Invalid refresh token');
        }
    }

    @Post('/logout')
    public async logout(@Res() res: Response): Promise<Response> {
        return this.sendSuccess(res, undefined, 'Logout successful');
    }
}