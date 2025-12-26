import { Response } from 'express';

export class BaseController {
    protected sendSuccess(res: Response, data: any, message: string = 'Success'): Response {
        return res.status(200).json({
            status: 200,
            message,
            data
        });
    }

    protected sendCreated(res: Response, data: any, message: string = 'Created successfully'): Response {
        return res.status(201).json({
            status: 201,
            message,
            data
        });
    }

    protected sendError(res: Response, message: string, statusCode: number = 500): Response {
        return res.status(statusCode).json({
            status: statusCode,
            message,
            error: true
        });
    }

    protected sendNotFound(res: Response, message: string = 'Resource not found'): Response {
        return res.status(404).json({
            status: 404,
            message,
            error: true
        });
    }

    protected sendBadRequest(res: Response, message: string = 'Bad request'): Response {
        return res.status(400).json({
            status: 400,
            message,
            error: true
        });
    }
}
