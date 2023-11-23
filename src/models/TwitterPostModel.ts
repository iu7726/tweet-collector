import SQL from "sql-template-strings";
import Model from "./classes/Model";
import { OkPacket, RowDataPacket } from "mysql2";
import { TwitterUser } from "src/entity/TwitterUser.entity";
import { TwitterTweet } from "src/entity/TwitterTweets.entity";
import { CreatePost } from "src/interface/TwitterPostInterface";
import { logger } from "src/util/Logger";

export default class TwitterPostModel extends Model {
  async getTweetsFromTwitterUserId(twitterUserId: number): Promise<TwitterTweet[]> {
    try {
      return await this.connection.readerQuery<TwitterTweet[]>(SQL`
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
    } catch (e) {
      console.log(e);
    }
    return [];
  }

  async getTwitterUser(twitterUserId: number): Promise<TwitterUser | undefined> {
    return await this.connection.readerQuerySingle<TwitterUser>(SQL`
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
  }

  async createPostWithTags(post: CreatePost, tags: string[], usedIds: number[] | undefined, lang: string = "EN") {
    const tx = await this.connection.beginTransaction();
    try {
      const isExistResult: RowDataPacket[] = await this.connection.query(
        tx,
        `SELECT COUNT(*) as count FROM Post WHERE authorReservation2 = ? AND authorId = ?`,
        [post.authorReservation2, post.authorId]
      );

      if (isExistResult && isExistResult[0] && isExistResult[0].count == 0) {
        const postResult: OkPacket = await this.connection.query(
          tx,
          `
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
        `,
          [
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
          ]
        );

        if (postResult.insertId && tags.length > 0) {
          let sql = `INSERT INTO Tag (postId, userId, topicId, name) VALUES`;
          let param: any = [];

          tags.map((tag: string, idx: number) => {
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
          `

          await this.connection.query(tx, sql, param);
        }

        //
        if (usedIds && usedIds.length > 0) {
          const updateIsUsedSql = SQL`
                    UPDATE 
                        TwitterTweet
                    SET 
                        isUsed = true
                    WHERE 
                        id IN (${usedIds});
                    `;

          await this.connection.query(tx, updateIsUsedSql);
        }
      }

      tx.commit();
      tx.release();
    } catch (e) {
      console.log(e);
      tx.rollback(() => {
        tx.release();
      });
    }
  }

  async updateIsUsedFromTweetIds(ids: number[]): Promise<void> {
    const sql = SQL`
        UPDATE 
            TwitterTweet
        SET 
            isUsed = true
        WHERE 
            id IN (${ids});
        `;

    await this.connection.writerQuery(sql);
  }
}
