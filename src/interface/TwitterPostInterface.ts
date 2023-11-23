import { ApiTweetDataEntityUrl } from "src/entity/TwitterApi.entity"
import { TwitterTweetMediaData } from "src/entity/TwitterTweets.entity"
import { PostContentTweetUser } from "./TwitterUserInterface"

export interface CreatePost {
    userId: number
    authorId: number
    authorName: string
    authorProfilePath: string
    authorLink: string
    authorType: string
    authorReservation1: string
    authorReservation2: string
    originLink: string
    dataType: string
    topicId: number
    title: string
    thumbnail: string | undefined;
    contents: string
    createdAt: Date
}

export interface PostTwitterContentData {
    link: string
    text: string
    time: Date
    user: PostContentTweetUser,
    media?: Array<TwitterTweetMediaData>,
    reference?: PostTwitterContentBlock | {},
    external?: Array<ApiTweetDataEntityUrl>
}

export interface PostTwitterContentBlock {
    data: PostTwitterContentData,
    type: string
}

export interface PostTwitterContent {
    blocks: Array<PostTwitterContentBlock>
}