import { format, createLogger, transports, addColors } from 'winston';
const { combine, timestamp, label, printf, json,colorize, splat } = format;
import path from 'path';
import 'winston-daily-rotate-file';
import fs from 'fs';
import 'util';
import dotenv from 'dotenv';
dotenv.config();


export default class Logger {
    constructor() {
        const dir = path.join('./', process.env.LOG_DIRECTORY)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
    customFormat = printf(({ level, message, label, timestamp }) => {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        return `[${timestamp}] [${label}] [${level}] : ${message}`;
    });

    timezoneFormat = () => {
        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
        });
        return date.replaceAll('/', '-')
    }

    createMyLogger(moduleName) {
        let colors = { error: 'red', warn: 'yellow', info: 'cyan', debug: 'green' };
        addColors(colors);

        let logger = createLogger({
            transports: [
                new (transports.Console)({
                    level: 'debug',
                    format: format.combine(
                        timestamp({format : this.timezoneFormat}),
                        label({ label: moduleName }),
                        colorize ({all : true}),
                        splat(),
                        json(),
                        this.customFormat
                    )
                }),
                new (transports.DailyRotateFile)({
                    filename: path.join('./', process.env.LOG_DIRECTORY, 'server.log'),
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '4d',
                    format: combine(
                        label({ label: moduleName }),
                        timestamp({ format: this.timezoneFormat }),
                        splat(),
                        format.json(),
                        this.customFormat
                    )
                })
            ]
        });

        return logger;
    }

}