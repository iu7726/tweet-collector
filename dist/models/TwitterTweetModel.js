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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const Logger_1 = require("../util/Logger");
const Model_1 = __importDefault(require("./classes/Model"));
class TwitterTweetModel extends Model_1.default {
    createTwitterTweet(tweet, twitterUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.writerQuery((0, sql_template_strings_1.default) `
            INSERT INTO TwitterTweet (
                isOrigin,
                isUsed,
                type,
                parentTweetId,
                tweetId,
                tweetAuthorId,
                twitterUserId,
                contents,
                mediaType,
                imagePath,
                mediaData,
                raw,
                tweetAt
            )
                VALUES
            (
                ${tweet.isOrigin},
                ${tweet.isUsed},
                ${tweet.type},
                ${tweet.parentTweetId},
                ${tweet.tweetId},
                ${tweet.tweetAuthorId},
                ${twitterUserId},
                ${tweet.contents},
                ${tweet.mediaType},
                ${tweet.imagePath},
                ${JSON.stringify(tweet.mediaData)},
                ${JSON.stringify(tweet.raw)},
                ${(0, moment_1.default)(tweet.tweetAt).utc().toDate()}
            )
            `);
            }
            catch (e) {
                Logger_1.logger.error(e);
            }
        });
    }
    isExistTweet(tweetId, twitterUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.readerQuery((0, sql_template_strings_1.default) `SELECT tweetId FROM TwitterTweet WHERE tweetId = ${tweetId} AND twitterUserId=${twitterUserId}`)).length > 0;
        });
    }
}
exports.default = TwitterTweetModel;
