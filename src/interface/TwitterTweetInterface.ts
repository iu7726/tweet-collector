export interface CreateTweet {
    isOrigin: boolean;
    isUsed: boolean;
    type: string;
    parentTweetId: string | null;
    tweetId: string;
    tweetAuthorId: string;
    contents: string;
    mediaType: string | null;
    imagePath: string | null;
    mediaData: object | null;
    raw: object;
    tweetAt: Date
}