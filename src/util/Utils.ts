import { TwitterTweet } from "../entity/TwitterTweets.entity";


export const LANGUAGES = [
    "EN", "KO", "ZH"
]

export const sortTweet = (a: TwitterTweet, b: TwitterTweet) => {
    if (a.tweetId < b.tweetId) {
        return -1;
    } else if (a.tweetId > b.tweetId) {
        return 1;
    } else {
        return 0;
    }
}

export const sortTweetByTweetAt = (a: TwitterTweet, b: TwitterTweet) => {
    if (a.type == "replied_to" && b.type !== "replied_to") {
        return 1;
    } else if (a.type !== "replied_to" && b.type == "replied_to") {
        return -1;
    } else if (a.type == "replied_to" && b.type == "replied_to") {
        if (a.tweetAt > b.tweetAt) {
            return 1;
        } else if (a.tweetAt < b.tweetAt) {
            return -1;
        } else {
            return 0;
        }
    } else if (a.tweetAt > b.tweetAt) {
        return -1;
    } else if (a.tweetAt < b.tweetAt) {
        return 1;
    } else {
        return 0;
    }
}

export const deleteAt = <T>(array: Array<T>, index: number) => {
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}


export const EnumKey = <
  T extends string,
  TEnumValue extends string
>(enumVariable: { [key in T]: TEnumValue }) => {
  return (value: string): string | undefined => {
    const indexOf = Object.values(enumVariable).indexOf(value);
    if (indexOf >= 0) {
      return Object.keys(enumVariable)[indexOf];
    }
    return undefined;
  };
};


export const getVideoInfo = (media: any) => {
    return media.variants.map((v: any) => {
        const urlParse = v.url.replace('https://', '').replace('http://', '').split('/');
        let resolution = 'streaming';
        const rex = new RegExp('^[0-9]{0,4}[xX][0-9]{0,4}$', 'g');
        urlParse.map((u: any) => {
            if (rex.test(u.toString())) {
                resolution = u;
            }
        })

        return {
            resolution,
            content_type: v.content_type,
            url: v.url
        }
    })
}

export const getGifInfo = (media: any) => {
    return media.variants.map((v: any) => {
        return {
            type: 'gif',
            url: v.url,
            content_type: v.content_type
        }
    })
}

export const getPhotoInfo = (media: any) => {
    return media.map((m: any) => {
        return {
            url: m.url,
            type: m.type
        }
    });
}

export const getVariants = (media: any) => {
    if (media?.length > 0) {
        const type = media[0]?.type == 'animated_gif' ? 'gif' : media[0].type;
        const url = type == 'video' ? media[0]?.preview_image_url : media[0]?.url;
        let variants = [];
        if (type == 'video') {
            variants = getVideoInfo(media[0]);
        } else if (type == 'gif') {
            variants = getGifInfo(media[0]);
        } else if (type == 'photo') {
            variants = getPhotoInfo(media);
        }

        return {
            type, url, variants
        }
    }
    return {
        type: null,
        url: null,
        variants: null
    }
}

export const getReferenceType = (referTweetData: any) => {
    let result = {
        type: 'tweet',
        id: null
    };

    if (!referTweetData) return result;

    if (referTweetData.length == 1) return referTweetData[0];

    if (referTweetData.length > 1) {
        const repliedFilter = referTweetData.filter((rt: any) => rt.type == 'replied_to');

        return repliedFilter[0];
    }

    return result;
}

const getRepiledToOriginCheck = (
    twitterUserTwitterId: string,
    tweetAuthorId: string,
    tweetType: string
): boolean => {

    if (tweetAuthorId != twitterUserTwitterId) return false;

    if (tweetType == 'tweet' || tweetType == 'quoted' || tweetType == 'retweeted') return true;

    return false;
}

const wait = async (delay:number):Promise<void> => {
    return new Promise<void>((resolve, reject) =>{
      setTimeout(() => {
        resolve();
      }, delay)  
    });
}

export const twitterUtil = {
    LANGUAGES,
    sortTweet,
    sortTweetByTweetAt,
    deleteAt,
    EnumKey,
    getVideoInfo,
    getPhotoInfo,
    getGifInfo,
    getReferenceType,
    getVariants,
    getRepiledToOriginCheck,
    wait
}