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
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const Logger_1 = require("../util/Logger");
const Model_1 = __importDefault(require("./classes/Model"));
class PostInfluencerModel extends Model_1.default {
    createPostInfluencer(tweet) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.writerQuery((0, sql_template_strings_1.default) `
            INSERT INTO PostInfluencer (
                isOrigin,
                influencerId, 
                parentId, 
                parentInfo, 
                type, 
                tweetId, 
                contents, 
                mediaType, 
                imagePath, 
                mediaData, 
                tweetAt, 
                raw
            )
                VALUES
            (
                ${tweet.isOrigin},
                ${tweet.influencerId}, 
                ${tweet.parentId}, 
                ${JSON.stringify(tweet.raw)}, 
                ${(_a = tweet.type) !== null && _a !== void 0 ? _a : 'tweet'}, 
                ${tweet.tweetId}, 
                ${tweet.content}, 
                ${tweet.mediaType}, 
                ${tweet.imagePath}, 
                ${JSON.stringify(tweet.mediaData)}, 
                ${tweet.tweetAt}, 
                ${JSON.stringify(tweet)}
            )
            `);
            }
            catch (e) {
                Logger_1.logger.error(e);
            }
        });
    }
    isExistTweet(tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.readerQuery((0, sql_template_strings_1.default) `SELECT tweetId FROM PostInfluencer WHERE tweetId = ${tweetId}`)).length > 0;
        });
    }
}
exports.default = PostInfluencerModel;
