import { Action } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import { env } from '../env';

export function currentUserChecker(): (action: Action) => Promise<any | undefined> {
    return async function innerCurrentUserChecker(
        action: Action
    ): Promise<any | undefined> {
        try {
            let token = action.request.headers.authorization;
            if (!token) {
                return undefined;
            }
            
            const regex = 'Bearer ';
            token = token.replace(regex, '');
            
            const payload = jwt.verify(token, env.jwt.access_token_secret);
            return payload;
        } catch {
            return undefined;
        }
    };
}
