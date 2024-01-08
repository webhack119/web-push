"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAPID_PRIVATE = exports.VAPID_PUBLIC = exports.SUBJECT = exports.GCM_KEY = exports.DATA_PATH = void 0;
const config_1 = __importDefault(require("config"));
exports.DATA_PATH = 'data.json';
exports.GCM_KEY = config_1.default.get('gcmKey');
exports.SUBJECT = config_1.default.get('subject');
exports.VAPID_PUBLIC = config_1.default.get('vapid.public');
exports.VAPID_PRIVATE = config_1.default.get('vapid.private');
