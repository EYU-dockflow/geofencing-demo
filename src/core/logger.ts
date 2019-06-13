import * as winston from 'winston';

export const loggerA = winston.createLogger({
    level: 'debug',
    //format: winston.format.json(),
    //defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'logs/a-warning.log', level: 'warning' }),
      new winston.transports.File({ filename: 'logs/a-syncer.log' })
    ]
});
export const loggerB = winston.createLogger({
    level: 'debug',
    //format: winston.format.json(),
    //defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'logs/b-warning.log', level: 'warning' }),
      new winston.transports.File({ filename: 'logs/b-syncer.log' })
    ]
});
export const loggerC = winston.createLogger({
    level: 'debug',
    //format: winston.format.json(),
    //defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'logs/c-warning.log', level: 'warning' }),
      new winston.transports.File({ filename: 'logs/c-syncer.log' })
    ]
});

if (process.env.NODE_ENV !== 'production' /*&& typeof process.env.NODE_ENV !=='undefined'*/ ) {
    loggerA.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    loggerB.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    loggerC.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
