export interface TwitterPostTemp {
    authorId: number,
    authorName: string,
    authorLink: string,
    authorType: string,
    authorProfilePath: string | undefined,
    authorReservation1: string,
    authorReservation2: string,
    originLink: string,
    dataType: string,
    topicId: number,
    title: string,
    thumbnail: string | undefined,
    contents: string,
    tweetAt: Date,
    tags: string,
    summery: string | undefined,
    score: number | undefined,
    relevance: number | undefined,
    raw: string| undefined,
    prompt: string | undefined,
}