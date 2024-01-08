"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const colors_1 = __importDefault(require("colors"));
const LEVEL_COLORS = {
    info: colors_1.default.green,
    debug: colors_1.default.blue,
    success: colors_1.default.green,
    warning: colors_1.default.yellow,
    danger: colors_1.default.red,
    error: colors_1.default.red,
    critical: colors_1.default.magenta
};
const getTimestamp = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const MM = date.getMonth().toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    const aaa = date.getMilliseconds().toString().padStart(3, '0');
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}.${aaa}`;
};
const printLog = (level, ...messages) => {
    console.log(`[${getTimestamp()}]`.gray, `${LEVEL_COLORS[level](level.toUpperCase())}`, '-', ...messages);
};
exports.logger = {
    info: (...messages) => printLog('info', ...messages),
    debug: (...messages) => printLog('debug', ...messages),
    success: (...messages) => printLog('success', ...messages),
    warning: (...messages) => printLog('warning', ...messages),
    danger: (...messages) => printLog('danger', ...messages),
    error: (...messages) => printLog('error', ...messages),
    critical: (...messages) => printLog('critical', ...messages),
};
