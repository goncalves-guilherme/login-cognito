import ILogger from './ilogger';

export default class ProductionLogger implements ILogger {
    log(message: string): void {
    }

    error(error: any): void {
    }

    warn(message: string): void {
    }

    info(message: string): void {
    }
}