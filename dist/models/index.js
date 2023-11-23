"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModel = exports.ModelManager = void 0;
const AppConfigModel_1 = __importDefault(require("./AppConfigModel"));
const ChatGPTApiModel_1 = __importDefault(require("./ChatGPTApiModel"));
const TwitterApiModel_1 = __importDefault(require("./TwitterApiModel"));
const TwitterPostModel_1 = __importDefault(require("./TwitterPostModel"));
const TwitterPostTempModel_1 = __importDefault(require("./TwitterPostTempModel"));
const TwitterTweetModel_1 = __importDefault(require("./TwitterTweetModel"));
const TwitterUserModel_1 = __importDefault(require("./TwitterUserModel"));
class ModelManager {
    constructor(connection) {
        this.AppConfig = new AppConfigModel_1.default(connection);
        this.TwitterApi = new TwitterApiModel_1.default(6000);
        this.TwitterTweet = new TwitterTweetModel_1.default(connection);
        this.TwitterUser = new TwitterUserModel_1.default(connection);
        this.TwitterPost = new TwitterPostModel_1.default(connection);
        this.TwitterPostTemp = new TwitterPostTempModel_1.default(connection);
        this.ChatGPTApi = new ChatGPTApiModel_1.default(0);
    }
}
exports.ModelManager = ModelManager;
let modelManager;
const useModel = (connection) => {
    if (modelManager == undefined) {
        modelManager = new ModelManager(connection);
    }
    return modelManager;
};
exports.useModel = useModel;
