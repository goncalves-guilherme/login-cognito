import ILogger from './ilogger';
import ConsoleLogger from './console-logger';
import ProductionLogger from './production-logger';

let logger: ILogger;

if (process.env.NODE_ENV === 'production') {
    logger = new ProductionLogger();
} else {
    logger = new ConsoleLogger();
}

export const Logger: ILogger = logger;