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
class TwitterPostModel extends Model_1.default {
    getTweetsFromTwitterUserId(twitterUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.connection.readerQuery((0, sql_template_strings_1.default) `
            SELECT
                PI.id, 
                isOrigin, 
                isUsed, 
                parentTweetId, 
                PI.contents, 
                tweetId, 
                PI.type, 
                tweetAuthorId, 
                raw, 
                mediaType, 
                imagePath, 
                mediaData, 
                tweetAt, 
                PI.createdAt
            FROM 
                TwitterTweet AS PI 
            LEFT JOIN 
                TwitterUser AS UI ON UI.twitterId = PI.tweetAuthorId 
            WHERE 
                tweetId IN (
                    SELECT 
                        tweetId 
                    FROM (
                        SELECT 
                            tweetId
                        FROM 
                            TwitterTweet 
                        WHERE 
                            isUsed = FALSE AND 
                            tweetAuthorId = (
                                SELECT 
                                    twitterId 
                                FROM 
                                    TwitterUser 
                                WHERE 
                                    id = ${twitterUserId} 
                                LIMIT 1
                            )

                        UNION

                        SELECT 
                            tweetId
                        FROM 
                            TwitterTweet 
                        WHERE 
                            tweetId IN (
                                SELECT 
                                    parentTweetId
                                FROM 
                                    TwitterTweet 
                                WHERE 
                                    isUsed = FALSE AND 
                                    tweetAuthorId = (
                                        SELECT 
                                            twitterId 
                                        FROM 
                                            TwitterUser 
                                        WHERE 
                                            id = ${twitterUserId} 
                                        LIMIT 1
                                    ) 
                            )
                        ) AS T GROUP BY T.tweetId
                ) AND
            twitterUserId = ${twitterUserId};
        `);
            }
            catch (e) {
                console.log(e);
            }
            return [];
        });
    }
    getTwitterUser(twitterUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection.readerQuerySingle((0, sql_template_strings_1.default) `
            SELECT 
                id,
                twitterId,
                verified,
                topicId,
                name,
                username,
                profileImagePath
            FROM 
                TwitterUser
            WHERE id = ${twitterUserId}
            ORDER BY id ASC LIMIT 1;
        `);
        });
    }
    createPostWithTags(post, tags, usedIds, lang = "EN") {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.connection.beginTransaction();
            try {
                const isExistResult = yield this.connection.query(tx, `SELECT COUNT(*) as count FROM Post WHERE authorReservation2 = ? AND authorId = ?`, [post.authorReservation2, post.authorId]);
                if (isExistResult && isExistResult[0] && isExistResult[0].count == 0) {
                    const postResult = yield this.connection.query(tx, `
            INSERT INTO Post
                (
                    userId, 
                    authorId, 
                    authorName, 
                    authorProfilePath, 
                    authorLink, 
                    authorType, 
                    authorReservation1, 
                    authorReservation2,
                    originLink,
                    dataType, 
                    topicId, 
                    title, 
                    thumbnail, 
                    contents,
                    createdAt
                )
            VALUES
                (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )
        `, [
                        post.userId,
                        post.authorId,
                        post.authorName,
                        post.authorProfilePath,
                        post.authorLink,
                        post.authorType,
                        post.authorReservation1,
                        post.authorReservation2,
                        post.originLink,
                        post.dataType,
                        post.topicId,
                        post.title,
                        post.thumbnail,
                        post.contents,
                        post.createdAt,
                    ]);
                    if (postResult.insertId && tags.length > 0) {
                        let sql = `INSERT INTO Tag (postId, userId, topicId, name) VALUES`;
                        let param = [];
                        tags.map((tag, idx) => {
                            sql += `(?, ?, ?, ?)`;
                            param.push(postResult.insertId);
                            param.push(0);
                            param.push(0);
                            param.push(tag);
                            if (idx != tags.length - 1) {
                                sql += `,`;
                            }
                        });
                        sql += `
          ON DUPLICATE KEY UPDATE
            name = VALUES(name)
          `;
                        yield this.connection.query(tx, sql, param);
                    }
                    //
                    if (usedIds && usedIds.length > 0) {
                        const updateIsUsedSql = (0, sql_template_strings_1.default) `
                    UPDATE 
                        TwitterTweet
                    SET 
                        isUsed = true
                    WHERE 
                        id IN (${usedIds});
                    `;
                        yield this.connection.query(tx, updateIsUsedSql);
                    }
                }
                tx.commit();
                tx.release();
            }
            catch (e) {
                console.log(e);
                tx.rollback(() => {
                    tx.release();
                });
            }
        });
    }
    updateIsUsedFromTweetIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = (0, sql_template_strings_1.default) `
        UPDATE 
            TwitterTweet
        SET 
            isUsed = true
        WHERE 
            id IN (${ids});
        `;
            yield this.connection.writerQuery(sql);
        });
    }
}
exports.default = TwitterPostModel;
