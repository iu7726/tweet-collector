import { PostContentTweetUser } from "../interface/TwitterUserInterface";
import { PostTwitterContent, PostTwitterContentBlock, PostTwitterContentData } from "../interface/TwitterPostInterface";
import { TwitterTweet, TwitterTweetMediaData } from "../entity/TwitterTweets.entity";
import { TwitterUser } from "../entity/TwitterUser.entity";
import { deleteAt, sortTweetByTweetAt } from "./Utils";

export function getOnlyOriginTweet(tweets: TwitterTweet[]): TwitterTweet[] {
  return tweets.filter((tweet: TwitterTweet) => Boolean(tweet.isOrigin));
}

export function makeChildrenThread(tweets: TwitterTweet[], tweetId: string, twitterUserId: string, thread: TwitterTweet[] = []): TwitterTweet[] {
  const chidrenTweet = getChildren(tweets, tweetId, twitterUserId);
  if (chidrenTweet !== undefined) {
    thread.push(chidrenTweet);
    return makeChildrenThread(tweets, chidrenTweet.tweetId, twitterUserId, thread);
  }
  return thread;
}

export function getChildren(tweets: TwitterTweet[], tweetId: string, twitterUserId: string): TwitterTweet | undefined {
  return tweets.filter((tweet) => tweet.parentTweetId == tweetId && tweet.type == "replied_to" && tweet.tweetAuthorId == twitterUserId)[0];
}

export function makeParentThread(tweets: TwitterTweet[], tweetId: string | undefined, twitterUserId: string, thread: TwitterTweet[] = []): TwitterTweet[] {
  if (tweetId == undefined) {
    return thread;
  }
  const parentTweet = getParent(tweets, tweetId);
  if (parentTweet !== undefined) {
    thread.push(parentTweet);
  }
  return thread;
}

export function getParent(tweets: TwitterTweet[], parentId: string | undefined): TwitterTweet | undefined {
  if (parentId) {
    return tweets.filter((tweet) => tweet.tweetId == parentId)[0];
  }
}

export function extractTags(twitterContentData: PostTwitterContentData): Array<string> {
  let tags: string[] = [];
  const regex = /#\w+/gi;
  const tagMatch = twitterContentData.text.match(regex);
  let referenceTagMatch: RegExpMatchArray | null = null;

  tags = addTags(twitterContentData.user.name, tags);
  tags = addTags(twitterContentData.user.username, tags);
  
  if (twitterContentData.reference && (twitterContentData.reference as PostTwitterContentBlock).data) {
    referenceTagMatch = (twitterContentData.reference as PostTwitterContentBlock).data.text.match(regex);
    tags = addTags((twitterContentData.reference as PostTwitterContentBlock).data.user.name, tags);
    tags = addTags((twitterContentData.reference as PostTwitterContentBlock).data.user.username, tags);
  }

  if (tagMatch) {
    tagMatch.map(tm => {
      tags = addTags(tm, tags);
    })
  }
  
  if (referenceTagMatch) {
    referenceTagMatch.map(rt => {
      tags = addTags(rt?.replace('#', ''), tags);
    })
  }

  tags = tags.map(tag => tag.replace(/ /g, '_'));

  return tags;
}

export function isExistTags(newTag: string, tags: string[]): boolean {
  if ( ! newTag) return true;

  const lowerTags = tags.map((tag:string) => tag?.toLowerCase());

  return lowerTags.includes(newTag?.toLowerCase());
}

export function addTags(newTag: string, tags: string[]): string[] {
  if ( ! isExistTags(newTag, tags)) {
    tags.push(newTag);
  }

  return tags;
}

export function createTwitterPost(tweet: TwitterTweet, twitterUser: TwitterUser): PostTwitterContent {
  const blocks: PostTwitterContentBlock[] = [];
  let threads: TwitterTweet[] = [];
  if (tweet.threadTweets) {
    threads = [tweet, ...tweet.threadTweets].sort(sortTweetByTweetAt);
    if (threads.length > 1) {
      if (threads[1] && (threads[0].type == "retweeted"  || threads[0].type == "quoted")) {
        threads[0].parent = threads[1];
        threads = deleteAt(threads, 1);
      }
    }

    threads.forEach((threadItem) => {
      blocks.push(tweetConvertToTwitterContentsBlock(threadItem, twitterUser));
    });

    return {
      blocks: blocks,
    };
  }

  return {
    blocks: [],
  };
}

export function tweetConvertToTwitterContentsBlock(tweet: TwitterTweet, twitterUser?: TwitterUser): PostTwitterContentBlock {
  return {
    data: {
      time: tweet.tweetAt,
      text: getContentText(tweet),
      media: getMediaData(tweet),
      link: getTwitterLink(tweet.tweetId),
      user: getTweetUser(tweet, twitterUser),
      reference: tweet.parent && twitterUser ? tweetConvertToTwitterContentsBlock(tweet.parent) : {},
      external: getExternalLink(tweet),
    },
    type: tweet.type,
  };
}

export function getContentText(tweet: TwitterTweet) {
  let entities;

  if (tweet.raw.data.entities?.urls) {
    entities = tweet.raw.data.entities;
  } else {
    return tweet.contents;
  }

  let text = tweet.contents;

  entities.urls.map((url: any) => {
    let replaceTxt = "";

    if (!url.media_key && (tweet.type == "tweet" || tweet.type == "replied_to")) {
      replaceTxt = url.display_url;
    }

    text = text.replace(url.url, replaceTxt);
  });

  return text;
}

export function getMediaData(tweet: TwitterTweet): TwitterTweetMediaData[] {
  if (!tweet.mediaType) return [];

  let media: TwitterTweetMediaData[] = [];
  let mediaData: TwitterTweetMediaData = {
    type: "",
    url: "",
  };

  if (!tweet.mediaData) return media;

  switch (tweet.mediaType) {
    case "video":
      mediaData.url = tweet.mediaData.filter((v: any) => v.resolution == "streaming")[0].url;
      mediaData.type = "video";
      media.push(mediaData);
      break;
    case "gif":
      mediaData.url = tweet.mediaData[0]?.url;
      mediaData.type = "gif";
      media.push(mediaData);
      break;
    case "photo":
      tweet.mediaData.map((m: any) => {
        media.push({
          url: m.url,
          type: "image",
        });
      });
      break;
    default:
      break;
  }

  return media;
}

export function getTwitterLink(tweetId: string): string {
  return `https://twitter.com/influencer/status/${tweetId}`;
}

export function getTweetUser(tweet: TwitterTweet, twitterUser?: TwitterUser): PostContentTweetUser {
  let user: PostContentTweetUser = {
    id: tweet.tweetAuthorId,
    name: "undefined",
    profile_image_url: "undefined",
    username: "undefined",
    verified: false,
  };

  const data = tweet.raw.includes?.users;

  if (twitterUser) {
    user = {
      id: tweet.tweetAuthorId,
      name: twitterUser.name,
      username: twitterUser.username,
      verified: Boolean(twitterUser.verified),
      profile_image_url: twitterUser.profileImagePath,
    };
  } else if (data) {
    const rawUser = tweet.raw.includes.users[0];
    user = {
      id: rawUser.id,
      name: rawUser.name,
      username: rawUser.username,
      verified: rawUser.verified,
      profile_image_url: rawUser.profile_image_url,
    };
  }

  return user;
}

export function getExternalLink(tweet: TwitterTweet) {
  let entities;

  if (tweet.raw.data.entities?.urls) {
    entities = tweet.raw.data.entities;
  } else {
    return [];
  }

  let external: any = [];

  entities.urls.map((url: any) => {
    external.push({
      key: url.display_url,
      link: url.expanded_url,
    });
  });

  return external;
}
