import moment from "moment";
import SQL from "sql-template-strings";
import { CreateTweet } from "../interface/TwitterTweetInterface";
import { logger } from "../util/Logger";
import Model from "./classes/Model";

export default class TwitterTweetModel extends Model {

    async createTwitterTweet(tweet: CreateTweet, twitterUserId: number): Promise<void> {

        try {
            await this.connection.writerQuery(SQL`
            INSERT INTO TwitterTweet (
                isOrigin,
                isUsed,
                type,
                parentTweetId,
                tweetId,
                tweetAuthorId,
                twitterUserId,
                contents,
                mediaType,
                imagePath,
                mediaData,
                raw,
                tweetAt
            )
                VALUES
            (
                ${tweet.isOrigin},
                ${tweet.isUsed},
                ${tweet.type},
                ${tweet.parentTweetId},
                ${tweet.tweetId},
                ${tweet.tweetAuthorId},
                ${twitterUserId},
                ${tweet.contents},
                ${tweet.mediaType},
                ${tweet.imagePath},
                ${JSON.stringify(tweet.mediaData)},
                ${JSON.stringify(tweet.raw)},
                ${moment(tweet.tweetAt).utc().toDate()}
            )
            `);
        } catch (e) {
            logger.error(e)
        }
    }

    async isExistTweet(tweetId: string, twitterUserId: number): Promise<boolean> {
        return (await this.connection.readerQuery<any[]>(SQL`SELECT tweetId FROM TwitterTweet WHERE tweetId = ${tweetId} AND twitterUserId=${twitterUserId}`)).length > 0;
    }
}