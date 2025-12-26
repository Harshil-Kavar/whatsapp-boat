import { Action } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import { env } from '../env';

export function authorizationChecker(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    return async function innerAuthorizationChecker(
        action: Action,
        roles: string[]
    ): Promise<boolean> {
        try {
            let token = action.request.headers.authorization;
            if (!token) {
                return false;
            }

            const regex = 'Bearer ';
            token = token.replace(regex, '');

            jwt.verify(token, env.jwt.access_token_secret);
            return true;
        } catch (error) {
            return false;
        }
    };
}
