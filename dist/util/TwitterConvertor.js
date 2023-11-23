"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalLink = exports.getTweetUser = exports.getTwitterLink = exports.getMediaData = exports.getContentText = exports.tweetConvertToTwitterContentsBlock = exports.createTwitterPost = exports.addTags = exports.isExistTags = exports.extractTags = exports.getParent = exports.makeParentThread = exports.getChildren = exports.makeChildrenThread = exports.getOnlyOriginTweet = void 0;
const Utils_1 = require("./Utils");
function getOnlyOriginTweet(tweets) {
    return tweets.filter((tweet) => Boolean(tweet.isOrigin));
}
exports.getOnlyOriginTweet = getOnlyOriginTweet;
function makeChildrenThread(tweets, tweetId, twitterUserId, thread = []) {
    const chidrenTweet = getChildren(tweets, tweetId, twitterUserId);
    if (chidrenTweet !== undefined) {
        thread.push(chidrenTweet);
        return makeChildrenThread(tweets, chidrenTweet.tweetId, twitterUserId, thread);
    }
    return thread;
}
exports.makeChildrenThread = makeChildrenThread;
function getChildren(tweets, tweetId, twitterUserId) {
    return tweets.filter((tweet) => tweet.parentTweetId == tweetId && tweet.type == "replied_to" && tweet.tweetAuthorId == twitterUserId)[0];
}
exports.getChildren = getChildren;
function makeParentThread(tweets, tweetId, twitterUserId, thread = []) {
    if (tweetId == undefined) {
        return thread;
    }
    const parentTweet = getParent(tweets, tweetId);
    if (parentTweet !== undefined) {
        thread.push(parentTweet);
    }
    return thread;
}
exports.makeParentThread = makeParentThread;
function getParent(tweets, parentId) {
    if (parentId) {
        return tweets.filter((tweet) => tweet.tweetId == parentId)[0];
    }
}
exports.getParent = getParent;
function extractTags(twitterContentData) {
    let tags = [];
    const regex = /#\w+/gi;
    const tagMatch = twitterContentData.text.match(regex);
    let referenceTagMatch = null;
    tags = addTags(twitterContentData.user.name, tags);
    tags = addTags(twitterContentData.user.username, tags);
    if (twitterContentData.reference && twitterContentData.reference.data) {
        referenceTagMatch = twitterContentData.reference.data.text.match(regex);
        tags = addTags(twitterContentData.reference.data.user.name, tags);
        tags = addTags(twitterContentData.reference.data.user.username, tags);
    }
    if (tagMatch) {
        tagMatch.map(tm => {
            tags = addTags(tm, tags);
        });
    }
    if (referenceTagMatch) {
        referenceTagMatch.map(rt => {
            tags = addTags(rt === null || rt === void 0 ? void 0 : rt.replace('#', ''), tags);
        });
    }
    tags = tags.map(tag => tag.replace(/ /g, '_'));
    return tags;
}
exports.extractTags = extractTags;
function isExistTags(newTag, tags) {
    if (!newTag)
        return true;
    const lowerTags = tags.map((tag) => tag === null || tag === void 0 ? void 0 : tag.toLowerCase());
    return lowerTags.includes(newTag === null || newTag === void 0 ? void 0 : newTag.toLowerCase());
}
exports.isExistTags = isExistTags;
function addTags(newTag, tags) {
    if (!isExistTags(newTag, tags)) {
        tags.push(newTag);
    }
    return tags;
}
exports.addTags = addTags;
function createTwitterPost(tweet, twitterUser) {
    const blocks = [];
    let threads = [];
    if (tweet.threadTweets) {
        threads = [tweet, ...tweet.threadTweets].sort(Utils_1.sortTweetByTweetAt);
        if (threads.length > 1) {
            if (threads[1] && (threads[0].type == "retweeted" || threads[0].type == "quoted")) {
                threads[0].parent = threads[1];
                threads = (0, Utils_1.deleteAt)(threads, 1);
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
exports.createTwitterPost = createTwitterPost;
function tweetConvertToTwitterContentsBlock(tweet, twitterUser) {
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
exports.tweetConvertToTwitterContentsBlock = tweetConvertToTwitterContentsBlock;
function getContentText(tweet) {
    var _a;
    let entities;
    if ((_a = tweet.raw.data.entities) === null || _a === void 0 ? void 0 : _a.urls) {
        entities = tweet.raw.data.entities;
    }
    else {
        return tweet.contents;
    }
    let text = tweet.contents;
    entities.urls.map((url) => {
        let replaceTxt = "";
        if (!url.media_key && (tweet.type == "tweet" || tweet.type == "replied_to")) {
            replaceTxt = url.display_url;
        }
        text = text.replace(url.url, replaceTxt);
    });
    return text;
}
exports.getContentText = getContentText;
function getMediaData(tweet) {
    var _a;
    if (!tweet.mediaType)
        return [];
    let media = [];
    let mediaData = {
        type: "",
        url: "",
    };
    if (!tweet.mediaData)
        return media;
    switch (tweet.mediaType) {
        case "video":
            mediaData.url = tweet.mediaData.filter((v) => v.resolution == "streaming")[0].url;
            mediaData.type = "video";
            media.push(mediaData);
            break;
        case "gif":
            mediaData.url = (_a = tweet.mediaData[0]) === null || _a === void 0 ? void 0 : _a.url;
            mediaData.type = "gif";
            media.push(mediaData);
            break;
        case "photo":
            tweet.mediaData.map((m) => {
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
exports.getMediaData = getMediaData;
function getTwitterLink(tweetId) {
    return `https://twitter.com/influencer/status/${tweetId}`;
}
exports.getTwitterLink = getTwitterLink;
function getTweetUser(tweet, twitterUser) {
    var _a;
    let user = {
        id: tweet.tweetAuthorId,
        name: "undefined",
        profile_image_url: "undefined",
        username: "undefined",
        verified: false,
    };
    const data = (_a = tweet.raw.includes) === null || _a === void 0 ? void 0 : _a.users;
    if (twitterUser) {
        user = {
            id: tweet.tweetAuthorId,
            name: twitterUser.name,
            username: twitterUser.username,
            verified: Boolean(twitterUser.verified),
            profile_image_url: twitterUser.profileImagePath,
        };
    }
    else if (data) {
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
exports.getTweetUser = getTweetUser;
function getExternalLink(tweet) {
    var _a;
    let entities;
    if ((_a = tweet.raw.data.entities) === null || _a === void 0 ? void 0 : _a.urls) {
        entities = tweet.raw.data.entities;
    }
    else {
        return [];
    }
    let external = [];
    entities.urls.map((url) => {
        external.push({
            key: url.display_url,
            link: url.expanded_url,
        });
    });
    return external;
}
exports.getExternalLink = getExternalLink;
