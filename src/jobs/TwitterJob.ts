import { Job } from "libs-job-manager";
import { CreateTweet } from "../interface/TwitterTweetInterface";
import { TimelineTweet } from "../entity/TwitterApi.entity";
import { TwitterJobRequest, TwitterJobResult } from "../interface/TwitterInterface";
import { ModelManager } from "../models";
import { logger } from "../util/Logger";
import { twitterUtil } from "../util/Utils";

export class TwitterJob extends Job<TwitterJobRequest, TwitterJobResult> {

    constructor(jobRequest: TwitterJobRequest, private readonly model: ModelManager) {
        super(jobRequest);
    }

    async execute(): Promise<TwitterJobResult> {
        logger.info(this.request)
        const nextInfluencerId = await this.model.TwitterUser.getNextTwitterUser(this.request.twitterUserId);

        const twitterJobResult: TwitterJobResult = {
            success: false,
            twitterUserId: this.request.twitterUserId,
            jobName: 'main',
            done: this.request.done,
            nextTwitterUserId: nextInfluencerId,
            listCount: 0
        }

        try {
            if (this.request.twitterUserTwitterId) {
                const lastAccessTime = await this.model.TwitterUser.getLastAccessTime(this.request.twitterUserId);

                const tweetList = await this.getTweetList(this.request.twitterUserTwitterId, lastAccessTime, []);

                for (let i = 0; i < tweetList.length; i++) {
                    const tweet = tweetList[i];
                    await this.createTweetInfo(tweet.tweetId);
                }

                twitterJobResult.success = true;
                twitterJobResult.listCount = tweetList.length;

                if (tweetList.length > 0) {
                    const lastTweetAt = Math.round(new Date(tweetList[0].tweetAt).getTime() / 1000) + 30;
                    await this.model.TwitterUser.updateLasAccessTime(this.request.twitterUserId, lastTweetAt);
                }

            }

            return twitterJobResult;
        } catch (err) {
            logger.error(err);

            return twitterJobResult;
        }
    }

    async getTweetList(twitterUserTwitterId: string, lastAccessTime: number, tweetList: TimelineTweet[], nextToken?: string): Promise<TimelineTweet[]> {
        try {
            const timeline = await this.model.TwitterApi.getTimeLine(twitterUserTwitterId, lastAccessTime, nextToken);
            if (timeline.nextToken !== undefined) {
                return [...tweetList, ...(await this.getTweetList(twitterUserTwitterId, lastAccessTime, tweetList, timeline.nextToken))];
            } else {
                return [...tweetList, ...timeline.data];
            }
        } catch (e) {

        }
        return tweetList;
    }


    async createTweetInfo(twitterTweetTweetId: string) {
        if (await this.model.TwitterTweet.isExistTweet(twitterTweetTweetId, this.request.twitterUserId)) {
            return;
        }
        const tweetInfo = await this.model.TwitterApi.getTweetInfoFromTweetId(twitterTweetTweetId)
        if (tweetInfo && tweetInfo.data !== undefined && tweetInfo.error == undefined) {
            const includes = tweetInfo.includes;
            const tweetData = tweetInfo.data;
            const mediaList = includes?.media;
            const referenceTweets = includes?.tweets;
            let type, url, variants;

            logger.info("Tweet ID", tweetData.id, "User Id", tweetData.author_id);

            if (tweetData.attachments && tweetData.attachments?.media_keys) {
                const media = mediaList?.filter((m: any) => m.media_key === tweetData.attachments?.media_keys[0]);
                const variant = twitterUtil.getVariants(media);
                type = variant.type
                url = variant.url
                variants = variant.variants
            }

            const referencedTweetMeta = twitterUtil.getReferenceType(tweetData.referenced_tweets);

            const item: CreateTweet = {
                isOrigin: twitterUtil.getRepiledToOriginCheck(this.request.twitterUserTwitterId!, tweetData.author_id, referencedTweetMeta.type),
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
            }

            await this.model.TwitterTweet.createTwitterTweet(item, this.request.twitterUserId);
            if (referencedTweetMeta.type != 'tweet') {
                if (tweetData.author_id != this.request.twitterUserTwitterId) {
                    return;
                } else {
                    await this.createTweetInfo(referencedTweetMeta.id);
                }
            }
        }
    }

}