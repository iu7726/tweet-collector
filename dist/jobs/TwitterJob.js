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
exports.TwitterJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
const Utils_1 = require("../util/Utils");
class TwitterJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.info(this.request);
            const nextInfluencerId = yield this.model.TwitterUser.getNextTwitterUser(this.request.twitterUserId);
            const twitterJobResult = {
                success: false,
                twitterUserId: this.request.twitterUserId,
                jobName: 'main',
                done: this.request.done,
                nextTwitterUserId: nextInfluencerId,
                listCount: 0
            };
            try {
                if (this.request.twitterUserTwitterId) {
                    const lastAccessTime = yield this.model.TwitterUser.getLastAccessTime(this.request.twitterUserId);
                    const tweetList = yield this.getTweetList(this.request.twitterUserTwitterId, lastAccessTime, []);
                    for (let i = 0; i < tweetList.length; i++) {
                        const tweet = tweetList[i];
                        yield this.createTweetInfo(tweet.tweetId);
                    }
                    twitterJobResult.success = true;
                    twitterJobResult.listCount = tweetList.length;
                    if (tweetList.length > 0) {
                        const lastTweetAt = Math.round(new Date(tweetList[0].tweetAt).getTime() / 1000) + 30;
                        yield this.model.TwitterUser.updateLasAccessTime(this.request.twitterUserId, lastTweetAt);
                    }
                }
                return twitterJobResult;
            }
            catch (err) {
                Logger_1.logger.error(err);
                return twitterJobResult;
            }
        });
    }
    getTweetList(twitterUserTwitterId, lastAccessTime, tweetList, nextToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeline = yield this.model.TwitterApi.getTimeLine(twitterUserTwitterId, lastAccessTime, nextToken);
                if (timeline.nextToken !== undefined) {
                    return [...tweetList, ...(yield this.getTweetList(twitterUserTwitterId, lastAccessTime, tweetList, timeline.nextToken))];
                }
                else {
                    return [...tweetList, ...timeline.data];
                }
            }
            catch (e) {
            }
            return tweetList;
        });
    }
    createTweetInfo(twitterTweetTweetId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.model.TwitterTweet.isExistTweet(twitterTweetTweetId, this.request.twitterUserId)) {
                return;
            }
            const tweetInfo = yield this.model.TwitterApi.getTweetInfoFromTweetId(twitterTweetTweetId);
            if (tweetInfo && tweetInfo.data !== undefined && tweetInfo.error == undefined) {
                const includes = tweetInfo.includes;
                const tweetData = tweetInfo.data;
                const mediaList = includes === null || includes === void 0 ? void 0 : includes.media;
                const referenceTweets = includes === null || includes === void 0 ? void 0 : includes.tweets;
                let type, url, variants;
                Logger_1.logger.info("Tweet ID", tweetData.id, "User Id", tweetData.author_id);
                if (tweetData.attachments && ((_a = tweetData.attachments) === null || _a === void 0 ? void 0 : _a.media_keys)) {
                    const media = mediaList === null || mediaList === void 0 ? void 0 : mediaList.filter((m) => { var _a; return m.media_key === ((_a = tweetData.attachments) === null || _a === void 0 ? void 0 : _a.media_keys[0]); });
                    const variant = Utils_1.twitterUtil.getVariants(media);
                    type = variant.type;
                    url = variant.url;
                    variants = variant.variants;
                }
                const referencedTweetMeta = Utils_1.twitterUtil.getReferenceType(tweetData.referenced_tweets);
                const item = {
                    isOrigin: Utils_1.twitterUtil.getRepiledToOriginCheck(this.request.twitterUserTwitterId, tweetData.author_id, referencedTweetMeta.type),
                    isUsed: false,
                    type: referencedTweetMeta.type,
                    parentTweetId: referencedTweetMeta.id,
                    tweetId: tweetData.id,
                    tweetAuthorId: tweetData.author_id,
                    contents: tweetData.text,
                    mediaType: type,
                    imagePath: url,
                    mediaData: variants,
                    raw: tweetInfo,
                    tweetAt: tweetData.created_at,
                };
                yield this.model.TwitterTweet.createTwitterTweet(item, this.request.twitterUserId);
                if (referencedTweetMeta.type != 'tweet') {
                    if (tweetData.author_id != this.request.twitterUserTwitterId) {
                        return;
                    }
                    else {
                        yield this.createTweetInfo(referencedTweetMeta.id);
                    }
                }
            }
        });
    }
}
exports.TwitterJob = TwitterJob;
