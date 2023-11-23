import moment from "moment";
import { ApiTimeline, ApiTweet, ApiTwitterUserData, ApiTwitterUser, Timeline } from "../entity/TwitterApi.entity";
import DelayApiModel from "./classes/DelayApiModel";

export default class TwitterApiModel extends DelayApiModel {

    async getUserInfo(twitterUserTwitterId: string):Promise<ApiTwitterUserData|undefined> {
        //&expansions=pinned_tweet_id&tweet.fields=created_at
        const user = await this.GET<ApiTwitterUser>(`https://api.twitter.com/2/users/${twitterUserTwitterId}?user.fields=profile_image_url,verified,verified_type`);

        if (user && user.data) {
            return user.data;
        }
        
        return undefined;
    }

    async getTimeLine(twitterUserTwitterId: string, lastAccessTime: number, nextToken?: string): Promise<Timeline> {
        const exclude = ['replies']
        const expansions = ['referenced_tweets.id.author_id', 'attachments.media_keys', 'referenced_tweets.id']
        const mediaFields = ['preview_image_url', 'url', 'type', 'variants']
        const tweetFields = ['source', 'created_at', 'attachments', 'referenced_tweets', 'entities']
        const userFields = ['profile_image_url', 'id', 'username', 'verified']
        const maxResults = 100;
        const startTime = [moment.unix(lastAccessTime).utc().format()]

        const url = `https://api.twitter.com/2/users/${twitterUserTwitterId}/tweets?exclude=${exclude.join(',')}&expansions=${expansions.join(',')}&media.fields=${mediaFields.join(',')}&tweet.fields=${tweetFields.join(',')}&start_time=${startTime.join(',')}&user.fields=${userFields.join(',')}&max_results=${maxResults}${nextToken ? `&pagination_token=${nextToken}` : ''}`

        const response = await this.GET<ApiTimeline | undefined>(url);
        if (response !== undefined && response.data !== undefined && response.error == undefined && response.data instanceof Array) {
            return {
                nextToken: response.meta?.next_token,
                data: response.data.map((tweet: any) => ({
                    tweetId: tweet.id,
                    tweetAuthorId: tweet.author_id,
                    tweetAt: tweet.created_at
                }))
            }
        }
        return {
            data:[],
        };
    }

    async getTweetInfoFromTweetId(tweetId: string): Promise<ApiTweet|undefined> {
        const expansions = ['attachments.media_keys', 'author_id', 'referenced_tweets.id']
        const mediaFields = ['preview_image_url', 'url', 'type', 'variants']
        const tweetFields = ['source', 'created_at', 'attachments', 'referenced_tweets', 'context_annotations', 'entities']
        const userFields = ['profile_image_url', 'id', 'username', 'verified']
        return await this.GET<ApiTweet>(`https://api.twitter.com/2/tweets/${tweetId}?expansions=${expansions.join(',')}&media.fields=${mediaFields.join(',')}&tweet.fields=${tweetFields.join(',')}&user.fields=${userFields.join(',')}`)
    }

}