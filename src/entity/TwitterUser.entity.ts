export interface TwitterUser {
    id: number
    name: string
    username: string
    twitterId: string
    profileImagePath: string
    verified: boolean
    topicId: number
    lastAccessTime: number
    tags: string[]
    createdAt?: Date
    deletedAt?: Date   
}
