export interface TwitterUserDto {
    username: string;
    name: string;
    profileImagePath: string | null;
    verified: boolean;
}

export interface PostContentTweetUser{
    id: string;
    username: string;
    name: string;
    profile_image_url: string | null;
    verified: boolean;
}