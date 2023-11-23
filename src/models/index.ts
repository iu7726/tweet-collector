import ConnectionPool from "libs-connection-pool";
import AppConfigModel from "./AppConfigModel";
import ChatGPTApiModel from "./ChatGPTApiModel";
import TwitterApiModel from "./TwitterApiModel";
import TwitterPostModel from "./TwitterPostModel";
import TwitterPostTempModel from "./TwitterPostTempModel";
import TwitterTweetModel from "./TwitterTweetModel";
import TwitterUserModel from "./TwitterUserModel";

export class ModelManager {

    AppConfig: AppConfigModel

    TwitterApi: TwitterApiModel
    TwitterTweet: TwitterTweetModel
    TwitterUser: TwitterUserModel
    TwitterPost: TwitterPostModel
    TwitterPostTemp: TwitterPostTempModel

    ChatGPTApi: ChatGPTApiModel

    constructor(connection: ConnectionPool) {
        this.AppConfig = new AppConfigModel(connection);

        this.TwitterApi = new TwitterApiModel(6000);
        this.TwitterTweet = new TwitterTweetModel(connection);
        this.TwitterUser = new TwitterUserModel(connection);
        this.TwitterPost = new TwitterPostModel(connection);
        this.TwitterPostTemp = new TwitterPostTempModel(connection);

        this.ChatGPTApi = new ChatGPTApiModel(0);
    }
}

let modelManager: ModelManager;

export const useModel = (connection: ConnectionPool) => {
    if (modelManager == undefined) {
        modelManager = new ModelManager(connection);
    }
    return modelManager;
};