import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../package.json';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.dev.env') });

function getOsEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}

function getOsEnvOptional(key: string): string | undefined {
    return process.env[key];
}

function normalizePort(port: string | number | boolean): number {
    const parsedPort = parseInt(port as string, 10);
    if (isNaN(parsedPort)) {
        return 5000;
    }
    return parsedPort;
}

function toBool(value: string): boolean {
    return value === 'true';
}

export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER'))
    },
    mongodb: {
        uris: getOsEnv('MONGO_URIS')
    },
    jwt: {
        access_token_expiry: getOsEnv('JWT_ACCESS_EXPIRY'),
        refresh_token_expiry: getOsEnv('JWT_REFRESH_EXPIRY'),
        access_token_secret: getOsEnv('JWT_ACCESS_SECRET'),
        refresh_token_secret: getOsEnv('JWT_REFRESH_SECRET')
    },
    cors: {
        origin: getOsEnv('ORIGIN')
    },
    whatsapp: {
        sessionPath: getOsEnvOptional('WHATSAPP_SESSION_PATH') || './whatsapp-session',
        webhookUrl: getOsEnvOptional('WHATSAPP_WEBHOOK_URL') || 'http://localhost:5000/api/webhook/whatsapp'
    },
    admin: {
        secretKey: getOsEnv('ADMIN_SECRET_KEY')
    }
};
