"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const web_push_1 = __importDefault(require("web-push"));
const logger_1 = require("./logger");
const middlewares_1 = require("./middlewares");
const constants_1 = require("./constants");
web_push_1.default.setGCMAPIKey(constants_1.GCM_KEY);
web_push_1.default.setVapidDetails(constants_1.SUBJECT, constants_1.VAPID_PUBLIC, constants_1.VAPID_PRIVATE);
const store = { data: [] };
const app = (0, express_1.default)();
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../../'))); // project root
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../web'))); // project root/dist/web
app.use(middlewares_1.responseLogger);
app.use(express_1.default.json());
app.get('/vapid-public-key', (_req, res) => {
    res.send(constants_1.VAPID_PUBLIC);
});
app.post('/subscription', (req, res) => {
    var _a;
    const { userId, subscription } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    // replace to new subscription if userId is already exist
    const index = store.data.findIndex((data) => data.userId === userId);
    if (~index)
        store.data[index].subscription = subscription;
    store.data.push({ userId, subscription });
    const data = JSON.stringify(store.data);
    fs_1.default.writeFile(constants_1.DATA_PATH, data, 'utf-8', (error) => {
        if (error) {
            logger_1.logger.error('POST /subscription', { error });
            res.status(500).end();
        }
        else {
            res.status(201).end();
        }
    });
});
app.delete('/subscription', (req, res) => {
    var _a;
    const { userId } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    // remove target user data
    const index = store.data.findIndex((data) => data.userId === userId);
    if (~index) {
        store.data.splice(index, 1);
    }
    const data = JSON.stringify(store.data);
    fs_1.default.writeFile(constants_1.DATA_PATH, data, 'utf-8', (error) => {
        if (error) {
            logger_1.logger.error('DELETE /subscription', { error });
            res.status(500).end();
        }
        else {
            res.status(200).end();
        }
    });
});
app.post('/send-push-notification', (req, res) => {
    var _a;
    const { targetId: targetUserId, message } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    logger_1.logger.info(`Send push notification to '${targetUserId}' with '${message}'`);
    const targetUser = store
        .data
        .reverse()
        .find(({ userId }) => userId === targetUserId);
    if (targetUser) {
        const messageData = {
            title: 'Web Push',
            body: message || '(Empty message)',
        };
        web_push_1.default
            .sendNotification(targetUser.subscription, JSON.stringify(messageData))
            .then((pushServiceRes) => res.status(pushServiceRes.statusCode).end())
            .catch((error) => {
            var _a;
            logger_1.logger.error('POST /send-push', { error });
            res.status((_a = error === null || error === void 0 ? void 0 : error.statusCode) !== null && _a !== void 0 ? _a : 500).end();
        });
    }
    else {
        res.status(404).end();
    }
});
new Promise((resolve) => {
    fs_1.default.access(constants_1.DATA_PATH, fs_1.default.constants.F_OK, (error) => {
        // create data file if not exist
        error && fs_1.default.writeFileSync(constants_1.DATA_PATH, JSON.stringify([]), 'utf-8');
        resolve();
    });
}).then(() => {
    fs_1.default.readFile(constants_1.DATA_PATH, (error, data) => {
        if (error) {
            logger_1.logger.error('Cannot load data.json', { error });
        }
        else {
            store.data = JSON.parse(data.toString());
        }
        app.listen(8080, () => logger_1.logger.info('Server started'));
    });
});
