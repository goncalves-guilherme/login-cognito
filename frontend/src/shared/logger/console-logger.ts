import ILogger from './ilogger';

export default class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(`LOG: ${message}`);
    }

    error(error: any): void {
        if (error instanceof Error) {
            console.error(`ERROR: ${error.message}\nSTACK TRACE: ${error.stack}`);
        } else {
            console.error(`ERROR: ${error}`);
        }
    }

    warn(message: string): void {
        console.warn(`WARN: ${message}`);
    }

    info(message: string): void {
        console.info(`INFO: ${message}`);
    }
}