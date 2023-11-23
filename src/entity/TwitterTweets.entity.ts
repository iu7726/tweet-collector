import { ApiTweet } from "./TwitterApi.entity"

export interface TwitterTweet {
    id: number
    isOrigin: boolean
    isUsed: boolean
    type: 'retweeted' | 'quoted' | 'tweet' | 'replied_to'
    parentTweetId?: string
    tweetId: string
    tweetAuthorId: string
    twitterUserId: number
    contents: string
    mediaType?: string
    imagePath?: string
    mediaData?: TwitterTweetMediaData[]
    raw: ApiTweet
    tweetAt: Date
    createdAt: Date

    threadTweets?: TwitterTweet[]
    parent?: TwitterTweet
}


export interface TwitterTweetMediaData {
    url: string,
    type: string
}

export interface NotUsedTweet extends TwitterTweet{
    name: string;
    username: string;
    profileImagePath: string;

    threadTweets?: NotUsedTweet[];
    parent?: NotUsedTweet;
}



// old interface
// export interface TwitterRaw{
//     raw:any;
// }

// export interface Influencer {
//     id: number;
//     typeId: string;
//     verified: boolean;
//     topicId: number;
//     name: string;
//     username: string;
//     profileImagePath: string;
// }

// export interface Tweet {
//     id: number
//     isOrigin: boolean
//     isUsed: boolean
//     parentId: string
//     tweetId: string
//     contents:string,
//     type: 'retweeted' | 'quoted' | 'tweet' | 'replied_to'
//     influencerId: string,
//     raw: TwitterRaw
//     mediaType: 'photo' | 'gif' | 'video'
//     imagePath: string
//     mediaData: any[]
//     tweetAt: Date
//     createdAt: Date

//     threadTweets?:Tweet[]
//     parent?: Tweet
// }


// /**
//  * @dev The id and reference id objects of Twitter tweets that are first viewed to write the mapping code for Twitter.
//  */
// export interface TweetRelationCode {
//     tweetId: string;
//     parentId: string;
//     influencerId: string;
// }

// /**
//  * @dev An object that processed media information on Twitter
//  * @property {string} type - Use if the media type is gif.
//  * @property {string} resolution - Use if the media type is video.
//  */
// export interface TweetMedia {
//     url: string;
//     type?: string;
//     resolution?: string;
//     content_type?: string;
// }

// /**
//  * @dev Objects containing user-generated tweets and user information
//  */
// export interface TwitterTweetUser {
//     id: number;
//     tweetId: string;
//     parentId: string;
//     isOrigin: boolean;
//     influencerId: string;
//     contents: string;
//     type: string;
//     mediaType: string;
//     imagePath: string;
//     mediaData: TweetMedia[];
//     raw: any;
//     tweetAt: Date;

//     name: string;
//     username: string;
//     profileImagePath: string;
// }

// /**
//  * @dev Object containing the type of Twitter media and url.
//  */
// export interface TwitterMedia {
//     type: string;
//     url: string;
// }

// /**
//  * @dev Twitter User Object
//  */
// export interface TwitterUser {
//     id: string;
//     name: string;
//     username: string;
//     verified: boolean;
//     profile_image_url: string;
// }