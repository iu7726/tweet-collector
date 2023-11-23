"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqmodule_1 = require("amqmodule");
const dotenv_1 = __importDefault(require("dotenv"));
const libs_connection_pool_1 = __importDefault(require("libs-connection-pool"));
const libs_job_manager_1 = require("libs-job-manager");
const TwitterJob_1 = require("./jobs/TwitterJob");
const TwitterPostJob_1 = require("./jobs/TwitterPostJob");
const TwitterUserJob_1 = require("./jobs/TwitterUserJob");
const PostingJobManager_1 = require("./managers/PostingJobManager");
const TwitterJobManager_1 = require("./managers/TwitterJobManager");
const models_1 = require("./models");
const Constants_1 = require("./util/Constants");
const Logger_1 = require("./util/Logger");
const Utils_1 = require("./util/Utils");
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, Logger_1.initLogger)('OG-worker');
    Logger_1.logger.load("og community worker starting...");
    Logger_1.logger.log("NODE_ENV :", process.env.NODE_ENV);
    const cp = new libs_connection_pool_1.default({
        host: String(process.env.TEST_MYSQL_HOST),
        writerHost: String(process.env.TEST_MYSQL_HOST),
        readerHost: String(process.env.TEST_MYSQL_RO_HOST),
        user: String(process.env.TEST_MYSQL_USER),
        password: String(process.env.TEST_MYSQL_PASSWORD),
        database: String(process.env.TEST_MYSQL_DATABASE),
    });
    Logger_1.logger.log("cp connect complete...");
    const mqInstance = yield (0, amqmodule_1.createJsonTypeInstance)({
        host: String(process.env.MQ_HOST),
        id: String(process.env.MQ_ID),
        pw: String(process.env.MQ_PW),
        port: parseInt(String(process.env.MQ_PORT))
    });
    mqInstance.setExchange(String(process.env.MQ_EXCHANGE_ALPHA));
    Logger_1.logger.log("mq connect complete...");
    Logger_1.logger.log("Tweet Consumer Setting...");
    const twitterJobManager = new TwitterJobManager_1.TwitterJobManager(cp, mqInstance).setMode(libs_job_manager_1.Mode.Sync);
    const postingJobManager = new PostingJobManager_1.PostingJobManager().setMode(libs_job_manager_1.Mode.Async);
    const model = (0, models_1.useModel)(cp);
    let isConsumed = false;
    mqInstance.consume(Constants_1.RoutingKey.POSTING, (payload, done) => {
        Logger_1.logger.log("Event", (0, Utils_1.EnumKey)(Constants_1.RoutingKey)(Constants_1.RoutingKey.POSTING), payload);
        postingJobManager.addJob(new TwitterPostJob_1.TwitterPostJob({
            twitterUserId: payload.twitterUserId,
            done: done,
        }, model));
    }, 10);
    mqInstance.consume(Constants_1.RoutingKey.PROFILE, (payload, done) => {
        Logger_1.logger.log("Event", (0, Utils_1.EnumKey)(Constants_1.RoutingKey)(Constants_1.RoutingKey.PROFILE), payload);
        isConsumed = true;
        twitterJobManager.addJob(new TwitterUserJob_1.TwitterUserJob({
            twitterUserId: payload.twitterUserId,
            done: done,
        }, model));
    }, 1);
    mqInstance.consume(Constants_1.RoutingKey.TWEET, (payload, done) => {
        Logger_1.logger.log("Event", (0, Utils_1.EnumKey)(Constants_1.RoutingKey)(Constants_1.RoutingKey.TWEET), payload);
        isConsumed = true;
        twitterJobManager.addJob(new TwitterJob_1.TwitterJob({
            twitterUserId: payload.twitterUserId,
            twitterUserTwitterId: payload.twitterUserTwitterId,
            lastAccessTime: payload.lastAccessTime,
            done: done,
        }, model));
    }, 1);
    Logger_1.logger.log("Tweet Consumer Complete...");
    Logger_1.logger.log("og community started...");
    setTimeout(() => {
        if (!isConsumed) {
            Logger_1.logger.info("Start Getting Twitter");
            mqInstance.publish(String(process.env.MQ_QUEUE_TWITTER_PROFILE), {
                twitterUserId: 1
            });
        }
    }, 1000);
}))();
