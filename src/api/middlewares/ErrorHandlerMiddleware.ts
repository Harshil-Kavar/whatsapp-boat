import * as express from 'express';
import {
    ExpressErrorMiddlewareInterface,
    HttpError,
    Middleware
} from 'routing-controllers';

import { env } from '../../env';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public isProduction = env.isProduction;
    public isTesting = env.isTest;

    public error(
        error: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void {
        if (error.httpCode === 403 && error.name === 'AccessDeniedError') {
            error.httpCode = 401;
        }

        res.status(error.httpCode || 500);
        res.json({
            code: error.httpCode || 500,
            name: error.name,
            message: error.message
        });

        if (this.isProduction || this.isTesting) {
            console.error(error.name, error.message);
        } else {
            console.error(error);
            console.log(error);
        }
    }
}