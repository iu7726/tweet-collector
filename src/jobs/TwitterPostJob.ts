import { Job } from "libs-job-manager";
import { PostTwitterContentBlock } from "src/interface/TwitterPostInterface";
import { TwitterTweet } from "../entity/TwitterTweets.entity";
import { TwitterUser } from "../entity/TwitterUser.entity";
import { TwitterPostResult, TwitterRequest } from "../interface/TwitterInterface";
import { ModelManager } from "../models";
import { logger } from "../util/Logger";
import { createTwitterPost, extractTags, getOnlyOriginTweet, makeChildrenThread, makeParentThread } from "../util/TwitterConvertor";
import { LANGUAGES, sortTweet, twitterUtil } from "../util/Utils";

export class TwitterPostJob extends Job<TwitterRequest, TwitterPostResult> {
    constructor(jobRequest: TwitterRequest, private readonly model: ModelManager) {
        super(jobRequest);
    }

    async execute(): Promise<TwitterPostResult> {
        try {
            await twitterUtil.wait(100);
            logger.log("execute start", this.request.twitterUserId);
            const twitterUser = await this.model.TwitterUser.getTwitterUser(this.request.twitterUserId);
            if (twitterUser) {
                const tweets: TwitterTweet[] = await this.model.TwitterPost.getTweetsFromTwitterUserId(this.request.twitterUserId);
                await this.createTwitterPosts(tweets, twitterUser);

                const updateTweetIds = tweets.map((tweet: TwitterTweet) => tweet.id);
                if (updateTweetIds.length > 0) {
                    await this.model.TwitterPost.updateIsUsedFromTweetIds(updateTweetIds);
                }
            }
            logger.log("execute end");
            return {
                jobName: "post",
                success: true,
                done: this.request.done,
            };
        } catch (err) {
            logger.error(err);
        }
        return {
            jobName: "post",
            success: false,
            done: this.request.done,
        };
    }

    async createTwitterPosts(tweets: TwitterTweet[], twitterUser: TwitterUser): Promise<void> {
        let originTweets = getOnlyOriginTweet(tweets);
        originTweets = originTweets.map((tweet: TwitterTweet) => {
            const chidrenTweets = makeChildrenThread(tweets, tweet.tweetId, twitterUser.twitterId);
            const parentTweets = makeParentThread(tweets, tweet.parentTweetId, twitterUser.twitterId);
            tweet.threadTweets = [...chidrenTweets, ...parentTweets];
            if (tweet.threadTweets) {
                tweet.threadTweets.sort(sortTweet);
            }
            return tweet;
        });

        const prompt = await this.model.AppConfig.getValue('PROMPT');

        for (let i = 0; i < originTweets.length; i++) {
            const post = createTwitterPost(originTweets[i], twitterUser);
            // const tags = post.blocks.reduce((tags, cur) => {
            //     return extractTags(cur.data);
            // }, new Array<string>());

            const tags = twitterUser.tags;
            const ids: number[] | undefined = originTweets[i].threadTweets?.map((tweet: TwitterTweet) => tweet.id);

            const text = post.blocks.map((p:PostTwitterContentBlock) => {
                return p.data.text;
            })
            
            // const gptRet = await this.model.ChatGPTApi.getChatGPTSummery(prompt ?? '', twitterUser.name, text.join('\n'));
            const gptRet = {
                text: undefined,
                score: undefined,
                relevance: undefined,
                raw: undefined,
                prompt: undefined,
            }

            await this.model.TwitterPostTemp.createTwitterPostTemp({
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
                summery: gptRet?.text,
                score: gptRet?.score,
                relevance: gptRet?.relevance,
                raw: gptRet?.raw,
                prompt: gptRet?.prompt
            })

            await this.model.TwitterPost.createPostWithTags(
                {
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
                },
                tags,
                ids
            );
        }
    }
}
