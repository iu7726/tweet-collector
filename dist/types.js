"use strict";
// export interface TwitterTweet {
//     id: number
//     isOrigin: boolean
//     isUsed: boolean
//     type: 'retweeted' | 'quoted' | 'tweet' | 'replied_to'
//     parentTweetId?: string
//     tweetId: string
//     tweetAuthorId: string
//     twitterUserId: number
//     contents: string
//     mediaType?: string
//     imagePath?: string
//     mediaData?: TwitterTweetMediaData[]
//     raw: ApiTweet
//     tweetAt: Date
//     createdAt: Date
// }
// export interface TwitterTweetMediaData {
//     url: string,
//     type: string
// }
// export interface TwitterUser {
//     id: number
//     name: string
//     username: string
//     twitterId: string
//     profileImagePath: string
//     verified: boolean
//     topicId: number
//     lastAccessTime: number
//     createdAt: Date
//     deletedAt: Date
// }
// PostingData
// export interface Post {
//     userId: number
//     authorId: string
//     authorName: string
//     authorProfilePath: string
//     authorLink: string
//     authorType: string
//     authorReservation1: string
//     authorReservation2: string
//     originLink: string
//     dataType: string
//     topicId: number
//     title: string
//     thumbnail: string
//     contents: string
//     createdAt: Date
// }
// export interface PostTwitterContentData {
//     link: string
//     text: string
//     time: Date
//     user: TwitterUser,
//     media?: Array<TwitterTweetMediaData>,
//     reference?: PostTwitterContentBlock | {},
//     external?: Array<ApiTweetDataEntityUrl>
// }
// export interface PostTwitterContentBlock {
//     data: PostTwitterContentData,
//     type: string
// }
// export interface PostTwitterContent {
//     blocks: Array<PostTwitterContentBlock>
// }
// Api Interfaces
// export interface ApiTimeline {
//     data: Array<ApiTweetData>
//     meta?: ApiTimelineMeta
//     error?: any
// }
// export interface ApiTimelineMeta {
//     result_count: number,
//     newest_id: string,
//     oldest_id: string,
//     next_token: string
// }
// export interface ApiTweet {
//     data: ApiTweetData
//     includes: ApiTweetInclude
//     error?: any
// }
// export interface ApiTweetData {
//     author_id: string,
//     entities: ApiTweetDataEntitiy
//     created_at: Date,
//     id: string, // tweetId
//     text: string,
//     referenced_tweets: Array<ApiTweetDataReferenceTweet>,
//     attachments: ApiTweetDataAttachment
// }
// export interface ApiTweetDataAttachment {
//     media_keys: Array<string>
// }
// export interface ApiTweetDataEntitiy {
//     urls: Array<ApiTweetDataEntityUrl>
// }
// export interface ApiTweetDataReferenceTweet {
//     type: 'retweeted' | 'quoted' | 'replied_to',
//     id: string
// }
// export interface ApiTwitterUser {
//     profile_image_url: string,
//     username: string,
//     verified: boolean,
//     id: string,
//     name: string
// }
// export interface ApiTweetInclude {
//     media: Array<ApiTweetMedia>
//     users: Array<ApiTwitterUser>
//     tweets: Array<ApiTweetData>
// }
// export interface ApiTweetDataEntityUrl {
//     url: string,
//     expanded_url: string,
//     display_url: string,
//     media_key: string
// }
// export interface ApiTweetMedia {
//     media_key: string,
//     url: string,
//     type: "photo" | "video" | "animated_gif",
//     preview_image_url: string,
//     variants: ApiTweetMediaVariant[]
// }
// export interface ApiTweetMediaVariant {
//     bit_rate: number,
//     content_type: string,
//     url: string
// }
// Use Model
// export interface Timeline {
//     nextToken?: string,
//     data: TimelineTweet[]
// }
// export interface TimelineTweet {
//     tweetId: string,
//     tweetAuthorId: string,
//     tweetAt: string,
// }
// export interface TwitterUserDto {
//     username: string;
//     name: string;
//     profileImagePath: string | null;
//     verified: boolean;
// }
// export interface CreateTweet {
//     isOrigin: boolean;
//     isUsed: boolean;
//     type: string;
//     parentTweetId: string | null;
//     tweetId: string;
//     tweetAuthorId: string;
//     contents: string;
//     mediaType: string | null;
//     imagePath: string | null;
//     mediaData: object | null;
//     raw: object;
//     tweetAt: Date
// }
