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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterPostJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
const TwitterConvertor_1 = require("../util/TwitterConvertor");
const Utils_1 = require("../util/Utils");
class TwitterPostJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Utils_1.twitterUtil.wait(100);
                Logger_1.logger.log("execute start", this.request.twitterUserId);
                const twitterUser = yield this.model.TwitterUser.getTwitterUser(this.request.twitterUserId);
                if (twitterUser) {
                    const tweets = yield this.model.TwitterPost.getTweetsFromTwitterUserId(this.request.twitterUserId);
                    yield this.createTwitterPosts(tweets, twitterUser);
                    const updateTweetIds = tweets.map((tweet) => tweet.id);
                    if (updateTweetIds.length > 0) {
                        yield this.model.TwitterPost.updateIsUsedFromTweetIds(updateTweetIds);
                    }
                }
                Logger_1.logger.log("execute end");
                return {
                    jobName: "post",
                    success: true,
                    done: this.request.done,
                };
            }
            catch (err) {
                Logger_1.logger.error(err);
            }
            return {
                jobName: "post",
                success: false,
                done: this.request.done,
            };
        });
    }
    createTwitterPosts(tweets, twitterUser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let originTweets = (0, TwitterConvertor_1.getOnlyOriginTweet)(tweets);
            originTweets = originTweets.map((tweet) => {
                const chidrenTweets = (0, TwitterConvertor_1.makeChildrenThread)(tweets, tweet.tweetId, twitterUser.twitterId);
                const parentTweets = (0, TwitterConvertor_1.makeParentThread)(tweets, tweet.parentTweetId, twitterUser.twitterId);
                tweet.threadTweets = [...chidrenTweets, ...parentTweets];
                if (tweet.threadTweets) {
                    tweet.threadTweets.sort(Utils_1.sortTweet);
                }
                return tweet;
            });
            const prompt = yield this.model.AppConfig.getValue('PROMPT');
            for (let i = 0; i < originTweets.length; i++) {
                const post = (0, TwitterConvertor_1.createTwitterPost)(originTweets[i], twitterUser);
                // const tags = post.blocks.reduce((tags, cur) => {
                //     return extractTags(cur.data);
                // }, new Array<string>());
                const tags = twitterUser.tags;
                const ids = (_a = originTweets[i].threadTweets) === null || _a === void 0 ? void 0 : _a.map((tweet) => tweet.id);
                const text = post.blocks.map((p) => {
                    return p.data.text;
                });
                // const gptRet = await this.model.ChatGPTApi.getChatGPTSummery(prompt ?? '', twitterUser.name, text.join('\n'));
                const gptRet = {
                    text: undefined,
                    score: undefined,
                    relevance: undefined,
                    raw: undefined,
                    prompt: undefined,
                };
                yield this.model.TwitterPostTemp.createTwitterPostTemp({
                    authorId: twitterUser.id,
                    authorName: twitterUser.name,
                    authorProfilePath: twitterUser.profileImagePath,
                    authorLink: `https://twitter.com/${twitterUser.username}`,
                    authorType: "twitter",
                    authorReservation1: twitterUser.username,
                    authorReservation2: originTweets[i].tweetId,
                    originLink: `https://twitter.com/${twitterUser.username}/status/${originTweets[i].tweetId}`,
                    dataType: originTweets[i].type,
                    topicId: twitterUser.topicId,
                    title: originTweets[i].contents.substring(0, 145),
                    thumbnail: originTweets[i].imagePath,
                    contents: JSON.stringify(post),
                    tweetAt: originTweets[i].tweetAt,
                    tags: JSON.stringify(tags),
                    summery: gptRet === null || gptRet === void 0 ? void 0 : gptRet.text,
                    score: gptRet === null || gptRet === void 0 ? void 0 : gptRet.score,
                    relevance: gptRet === null || gptRet === void 0 ? void 0 : gptRet.relevance,
                    raw: gptRet === null || gptRet === void 0 ? void 0 : gptRet.raw,
                    prompt: gptRet === null || gptRet === void 0 ? void 0 : gptRet.prompt
                });
                yield this.model.TwitterPost.createPostWithTags({
                    userId: 0,
                    authorId: twitterUser.id,
                    authorName: twitterUser.name,
                    authorProfilePath: twitterUser.profileImagePath,
                    authorLink: `https://twitter.com/${twitterUser.username}`,
                    authorType: "twitter",
                    authorReservation1: twitterUser.username,
                    authorReservation2: originTweets[i].tweetId,
                    originLink: `https://twitter.com/${twitterUser.username}/status/${originTweets[i].tweetId}`,
                    dataType: originTweets[i].type,
                    topicId: 0,
                    title: originTweets[i].contents.substring(0, 145),
                    thumbnail: originTweets[i].imagePath,
                    contents: JSON.stringify(post),
                    createdAt: originTweets[i].tweetAt,
                }, tags, ids);
            }
        });
    }
}
exports.TwitterPostJob = TwitterPostJob;
