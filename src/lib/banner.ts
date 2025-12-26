import { env } from '../env';

export function banner(log: any): void {
    if (env.app.banner) {
        const route = () =>
            `${env.app.schema}://${env.app.host}:${env.app.port}`;
        console.log(``);
        console.log(
            `🤖 WhatsApp Bot Backend is ready on ${route()}${
                env.app.routePrefix
            }`
        );
        console.log(`To shut it down, press <CTRL> + C at any time.`);
        console.log(``);
        console.log('-------------------------------------------------------');
        console.log(`Environment  : ${env.node}`);
        console.log(`Version      : ${env.app.version}`);
        console.log(``);
        console.log(`API Info     : ${route()}${env.app.routePrefix}`);
        console.log('-------------------------------------------------------');
        console.log('');
    } else {
        console.log(`Application is up and running.`);
    }
}
