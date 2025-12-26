import 'reflect-metadata';
import express from 'express';
import { createExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import mongoose from 'mongoose';
import { env } from './env';
import { banner } from './lib/banner';
import { authorizationChecker } from './auth/authorizationChecker';
import { currentUserChecker } from './auth/currentUserChecker';

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(env.mongodb.uris);
        console.log('MongoDB connected successfully');

        // Create Express server with routing-controllers
        const app = createExpressServer({
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            validation: true,
            controllers: [__dirname + '/api/controllers/**/*Controller.ts'],
            middlewares: [__dirname + '/api/middlewares/**/*Middleware.ts'],
            authorizationChecker: authorizationChecker(),
            currentUserChecker: currentUserChecker(),
        });

        // Start server
        const server = app.listen(env.app.port, () => {
            banner(console);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                mongoose.connection.close();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
