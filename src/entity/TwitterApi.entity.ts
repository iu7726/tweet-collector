export interface ApiTimeline {
    data: Array<ApiTweetData>
    meta?: ApiTimelineMeta
    error?: any
}

export interface ApiTimelineMeta {
    result_count: number,
    newest_id: string,
    oldest_id: string,
    next_token: string
}

export interface ApiTweet {
    data: ApiTweetData
    includes: ApiTweetInclude
    error?: any
}

export interface ApiTweetData {
    author_id: string,
    entities: ApiTweetDataEntitiy
    created_at: Date,
    id: string, // tweetId
    text: string,
    referenced_tweets: Array<ApiTweetDataReferenceTweet>,
    attachments: ApiTweetDataAttachment
}

export interface ApiTweetDataAttachment {
    media_keys: Array<string>
}

export interface ApiTweetDataEntitiy {
    urls: Array<ApiTweetDataEntityUrl>
}

export interface ApiTweetDataReferenceTweet {
    type: 'retweeted' | 'quoted' | 'replied_to',
    id: string
}

export interface ApiTwitterUser {
    data: ApiTwitterUserData;
}

export interface ApiTwitterUserData {
    profile_image_url: string,
    username: string,
    verified: boolean,
    id: string,
    name: string
}

export interface ApiTweetInclude {
    media: Array<ApiTweetMedia>
    users: Array<ApiTwitterUserData>
    tweets: Array<ApiTweetData>
}

export interface ApiTweetDataEntityUrl {
    url: string,
    expanded_url: string,
    display_url: string,
    media_key: string
}

export interface ApiTweetMedia {
    media_key: string,
    url: string,
    type: "photo" | "video" | "animated_gif",
    preview_image_url: string,
    variants: ApiTweetMediaVariant[]
}

export interface ApiTweetMediaVariant {
    bit_rate: number,
    content_type: string,
    url: string
}

// timeline
export interface Timeline {
    nextToken?: string,
    data: TimelineTweet[]
}

export interface TimelineTweet {
    tweetId: string,
    tweetAuthorId: string,
    tweetAt: string,
}