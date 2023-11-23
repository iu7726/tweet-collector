import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import { TwitterUser } from "../entity/TwitterUser.entity";
import { TwitterUserDto } from "../interface/TwitterUserInterface";
import Model from "./classes/Model";

export default class TwitterUserModel extends Model {
    
    async getNextTwitterUser(twitterUserId: number): Promise<number> {
        const result: TwitterUser[] = await this.connection.readerQuery<TwitterUser[]>(SQL`
        SELECT 
            id 
        FROM 
            TwitterUser 
        WHERE 
            id >= ${twitterUserId} AND
            deletedAt IS NULL
        LIMIT 2
        `);
        return result.length == 2 ? result[1].id : 1;
    }

    async getTwitterUser(twitterUserId: number): Promise<TwitterUser | undefined> {
        const sql = SQL`
        SELECT 
            id,
            twitterId,
            verified,
            topicId,
            name,
            username,
            profileImagePath,
            tags
        FROM
            TwitterUser
        WHERE 
            id = ${twitterUserId} AND
            deletedAt IS NULL;
        `;

        return await this.connection.readerQuerySingle<TwitterUser>(sql);
    }

    async updateTwitterUser(twitterUserTwitterId: string, updateDto: TwitterUserDto): Promise<boolean> {
        console.log(updateDto);
        const sql = SQL`
        UPDATE 
            TwitterUser
        SET
            username = ${updateDto.username},
            name = ${updateDto.name},
            profileImagePath = ${updateDto.profileImagePath},
            verified = ${updateDto.verified}
        WHERE
            twitterId = ${twitterUserTwitterId};
        `;
        const result: OkPacket = await this.connection.writerQuery(sql);

        return result.affectedRows > 0;
    }

    async getLastAccessTime(twitterUserId: number): Promise<number> {
        const user = await this.connection.readerQuerySingle<TwitterUser>(SQL`SELECT lastAccessTime FROM TwitterUser WHERE id = ${twitterUserId}`)
        return user ? user.lastAccessTime ?? Math.round(new Date().getTime() / 1000 - 86400) : Math.round(new Date().getTime() / 1000 - 86400);
    }

    async updateLasAccessTime(twitterUserId: number, lastTweetAt: number): Promise<void> {
        const sql = SQL`
        UPDATE
            TwitterUser
        SET
            lastAccessTime = ${lastTweetAt}
        WHERE
            id = ${twitterUserId};
        `;
        await this.connection.writerQuery(sql);
    }
}