"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterUtil = exports.getReferenceType = exports.getVariants = exports.getPhotoInfo = exports.getGifInfo = exports.getVideoInfo = exports.EnumKey = exports.deleteAt = exports.sortTweetByTweetAt = exports.sortTweet = exports.LANGUAGES = void 0;
exports.LANGUAGES = [
    "EN", "KO", "ZH"
];
const sortTweet = (a, b) => {
    if (a.tweetId < b.tweetId) {
        return -1;
    }
    else if (a.tweetId > b.tweetId) {
        return 1;
    }
    else {
        return 0;
    }
};
exports.sortTweet = sortTweet;
const sortTweetByTweetAt = (a, b) => {
    if (a.type == "replied_to" && b.type !== "replied_to") {
        return 1;
    }
    else if (a.type !== "replied_to" && b.type == "replied_to") {
        return -1;
    }
    else if (a.type == "replied_to" && b.type == "replied_to") {
        if (a.tweetAt > b.tweetAt) {
            return 1;
        }
        else if (a.tweetAt < b.tweetAt) {
            return -1;
        }
        else {
            return 0;
        }
    }
    else if (a.tweetAt > b.tweetAt) {
        return -1;
    }
    else if (a.tweetAt < b.tweetAt) {
        return 1;
    }
    else {
        return 0;
    }
};
exports.sortTweetByTweetAt = sortTweetByTweetAt;
const deleteAt = (array, index) => {
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
};
exports.deleteAt = deleteAt;
const EnumKey = (enumVariable) => {
    return (value) => {
        const indexOf = Object.values(enumVariable).indexOf(value);
        if (indexOf >= 0) {
            return Object.keys(enumVariable)[indexOf];
        }
        return undefined;
    };
};
exports.EnumKey = EnumKey;
const getVideoInfo = (media) => {
    return media.variants.map((v) => {
        const urlParse = v.url.replace('https://', '').replace('http://', '').split('/');
        let resolution = 'streaming';
        const rex = new RegExp('^[0-9]{0,4}[xX][0-9]{0,4}$', 'g');
        urlParse.map((u) => {
            if (rex.test(u.toString())) {
                resolution = u;
            }
        });
        return {
            resolution,
            content_type: v.content_type,
            url: v.url
        };
    });
};
exports.getVideoInfo = getVideoInfo;
const getGifInfo = (media) => {
    return media.variants.map((v) => {
        return {
            type: 'gif',
            url: v.url,
            content_type: v.content_type
        };
    });
};
exports.getGifInfo = getGifInfo;
const getPhotoInfo = (media) => {
    return media.map((m) => {
        return {
            url: m.url,
            type: m.type
        };
    });
};
exports.getPhotoInfo = getPhotoInfo;
const getVariants = (media) => {
    var _a, _b, _c;
    if ((media === null || media === void 0 ? void 0 : media.length) > 0) {
        const type = ((_a = media[0]) === null || _a === void 0 ? void 0 : _a.type) == 'animated_gif' ? 'gif' : media[0].type;
        const url = type == 'video' ? (_b = media[0]) === null || _b === void 0 ? void 0 : _b.preview_image_url : (_c = media[0]) === null || _c === void 0 ? void 0 : _c.url;
        let variants = [];
        if (type == 'video') {
            variants = (0, exports.getVideoInfo)(media[0]);
        }
        else if (type == 'gif') {
            variants = (0, exports.getGifInfo)(media[0]);
        }
        else if (type == 'photo') {
            variants = (0, exports.getPhotoInfo)(media);
        }
        return {
            type, url, variants
        };
    }
    return {
        type: null,
        url: null,
        variants: null
    };
};
exports.getVariants = getVariants;
const getReferenceType = (referTweetData) => {
    let result = {
        type: 'tweet',
        id: null
    };
    if (!referTweetData)
        return result;
    if (referTweetData.length == 1)
        return referTweetData[0];
    if (referTweetData.length > 1) {
        const repliedFilter = referTweetData.filter((rt) => rt.type == 'replied_to');
        return repliedFilter[0];
    }
    return result;
};
exports.getReferenceType = getReferenceType;
const getRepiledToOriginCheck = (twitterUserTwitterId, tweetAuthorId, tweetType) => {
    if (tweetAuthorId != twitterUserTwitterId)
        return false;
    if (tweetType == 'tweet' || tweetType == 'quoted' || tweetType == 'retweeted')
        return true;
    return false;
};
const wait = (delay) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
});
exports.twitterUtil = {
    LANGUAGES: exports.LANGUAGES,
    sortTweet: exports.sortTweet,
    sortTweetByTweetAt: exports.sortTweetByTweetAt,
    deleteAt: exports.deleteAt,
    EnumKey: exports.EnumKey,
    getVideoInfo: exports.getVideoInfo,
    getPhotoInfo: exports.getPhotoInfo,
    getGifInfo: exports.getGifInfo,
    getReferenceType: exports.getReferenceType,
    getVariants: exports.getVariants,
    getRepiledToOriginCheck,
    wait
};
