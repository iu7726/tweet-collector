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
const Model_1 = __importDefault(require("./classes/Model"));
class TwitterRelationCode extends Model_1.default {
    getTweets(typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = (0, sql_template_strings_1.default) `
        SELECT
            PI.tweetId,
            PI.parentId,
            PI.influencerId
        FROM
            PostInfluencer AS PI
        LEFT JOIN 
            TwitterRelationCode AS TRC ON PI.tweetId = TRC.tweetId
        WHERE 
            PI.isOrigin = 1 AND 
            PI.isUsed = 0 AND
            TRC.tweetId IS NULL AND 
            PI.influencerId = ${typeId};
        `;
            return yield this.connection.readerQuery(sql);
        });
    }
}
exports.default = TwitterRelationCode;
