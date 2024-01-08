"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseLogger = void 0;
const logger_1 = require("./logger");
const responseLogger = (_req, res, next) => {
    const { originalUrl: url, method } = res.req;
    const afterResponse = () => {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        let statusCode = res.statusCode.toString();
        let loggerByStatusCode = logger_1.logger.info;
        switch (statusCode.charAt(0)) {
            case '2':
                statusCode = statusCode.green;
                break;
            case '3':
                statusCode = statusCode.yellow;
                break;
            case '4':
            case '5':
                statusCode = statusCode.red;
                loggerByStatusCode = logger_1.logger.error;
                break;
        }
        loggerByStatusCode(`${method} ${statusCode} ${url}`);
    };
    res.on('finish', afterResponse);
    res.on('close', afterResponse);
    next();
};
exports.responseLogger = responseLogger;
