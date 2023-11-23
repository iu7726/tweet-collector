import { JobResult, JobRequest } from "libs-job-manager";

export interface TwitterRequest extends JobRequest {
    twitterUserId: number;
    done: Function;
}

export interface TwitterJobRequest extends TwitterRequest {
    lastAccessTime?: number;
    twitterUserTwitterId?: string | undefined;
}

export interface TwitterResult extends JobResult {
    jobName: "user" | "main" | "post";
    done: Function;
}

export interface TwitterPostResult extends TwitterResult { }

export interface TwitterJobResult extends TwitterResult {
    twitterUserId: number;
    nextTwitterUserId: number;
    lastAccessTime?: number;
    twitterUserTwitterId?: string | undefined;
    listCount: number;
}

export interface TwitterUserResult extends TwitterResult {
    twitterUserId: number;
    nextTwitterUserId: number;
    lastAccessTime?: number;
    twitterUserTwitterId?: string | undefined;
}

// export interface TwitterPostingPayload {
//     twitterId: string;
//     startTime: Date;
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

// /**
//  * @dev This is a processed tweet object, and the reference object is the same as the object type.
//  */
// export interface TwitterContentData {
//     link: string;
//     text: string;
//     time: Date;
//     user: TwitterUser,
//     media?: TwitterMedia[],
//     reference?: TwitterContentBlock | {},
//     external?: any;
// }

// export interface TwitterContentBlock {
//     data: TwitterContentData,
//     type: string;
// }

// /**
//  * @dev Tweet content and type objects.ㅁ
//  */
// export interface TwitterContent {
//     blocks: Array<TwitterContentBlock>
// }

// export interface CreatePost {
//     userId: number;
//     authorId: string;
//     authorName: string;
//     authorProfilePath: string;
//     authorLink: string;
//     authorType: string;
//     authorReservation1: string;
//     authorReservation2: string;
//     originLink: string;
//     dataType: string;
//     topicId: number;
//     title: string;
//     thumbnail: string;
//     contents: string;
//     createdAt: Date;
// }