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
const moment_1 = __importDefault(require("moment"));
const DelayApiModel_1 = __importDefault(require("./classes/DelayApiModel"));
class TwitterApiModel extends DelayApiModel_1.default {
    getUserInfo(twitterUserTwitterId) {
        return __awaiter(this, void 0, void 0, function* () {
            //&expansions=pinned_tweet_id&tweet.fields=created_at
            const user = yield this.GET(`https://api.twitter.com/2/users/${twitterUserTwitterId}?user.fields=profile_image_url,verified,verified_type`);
            if (user && user.data) {
                return user.data;
            }
            return undefined;
        });
    }
    getTimeLine(twitterUserTwitterId, lastAccessTime, nextToken) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const exclude = ['replies'];
            const expansions = ['referenced_tweets.id.author_id', 'attachments.media_keys', 'referenced_tweets.id'];
            const mediaFields = ['preview_image_url', 'url', 'type', 'variants'];
            const tweetFields = ['source', 'created_at', 'attachments', 'referenced_tweets', 'entities'];
            const userFields = ['profile_image_url', 'id', 'username', 'verified'];
            const maxResults = 100;
            const startTime = [moment_1.default.unix(lastAccessTime).utc().format()];
            const url = `https://api.twitter.com/2/users/${twitterUserTwitterId}/tweets?exclude=${exclude.join(',')}&expansions=${expansions.join(',')}&media.fields=${mediaFields.join(',')}&tweet.fields=${tweetFields.join(',')}&start_time=${startTime.join(',')}&user.fields=${userFields.join(',')}&max_results=${maxResults}${nextToken ? `&pagination_token=${nextToken}` : ''}`;
            const response = yield this.GET(url);
            if (response !== undefined && response.data !== undefined && response.error == undefined && response.data instanceof Array) {
                return {
                    nextToken: (_a = response.meta) === null || _a === void 0 ? void 0 : _a.next_token,
                    data: response.data.map((tweet) => ({
                        tweetId: tweet.id,
                        tweetAuthorId: tweet.author_id,
                        tweetAt: tweet.created_at
                    }))
                };
            }
            return {
                data: [],
            };
        });
    }
    getTweetInfoFromTweetId(tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expansions = ['attachments.media_keys', 'author_id', 'referenced_tweets.id'];
            const mediaFields = ['preview_image_url', 'url', 'type', 'variants'];
            const tweetFields = ['source', 'created_at', 'attachments', 'referenced_tweets', 'context_annotations', 'entities'];
            const userFields = ['profile_image_url', 'id', 'username', 'verified'];
            return yield this.GET(`https://api.twitter.com/2/tweets/${tweetId}?expansions=${expansions.join(',')}&media.fields=${mediaFields.join(',')}&tweet.fields=${tweetFields.join(',')}&user.fields=${userFields.join(',')}`);
        });
    }
}
exports.default = TwitterApiModel;
