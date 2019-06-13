import * as winston from 'winston';

export const logger = winston.createLogger({
    level: 'debug',
    //format: winston.format.json(),
    //defaultMeta: { service: 'user-service' },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(i => `${i.timestamp} | ${i.message}`)
    ),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'logs/syncer.log', options:{
          flags: 'w'
      } })
    ]
});

if (process.env.NODE_ENV !== 'production' /*&& typeof process.env.NODE_ENV !=='undefined'*/ ) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
