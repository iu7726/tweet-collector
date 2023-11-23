import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import { TwitterPostTemp } from "src/interface/TwitterPostTempInterface";
import { logger } from "../util/Logger";
import Model from "./classes/Model";

export default class AppConfigModel extends Model {
    async createTwitterPostTemp(dto: TwitterPostTemp): Promise<void> {
        try {
            const sql = SQL`
            INSERT INTO TwitterPostTemp 
            (
                authorId, 
                authorName, 
                authorLink, 
                authorType, 
                authorProfilePath,
                authorReservation1, 
                authorReservation2, 
                originLink, 
                dataType, 
                topicId, 
                title, 
                thumbnail, 
                contents, 
                tweetAt, 
                tags, 
                summery, 
                score, 
                relevance,
                gptRaw,
                prompt
            )
            VALUES
                (
                    ${dto.authorId},
                    ${dto.authorName},
                    ${dto.authorLink},
                    ${dto.authorType},
                    ${dto.authorProfilePath},
                    ${dto.authorReservation1},
                    ${dto.authorReservation2},
                    ${dto.originLink},
                    ${dto.dataType},
                    ${dto.topicId},
                    ${dto.title},
                    ${dto.thumbnail},
                    ${dto.contents},
                    ${dto.tweetAt},
                    ${dto.tags},
                    ${dto.summery},
                    ${dto.score},
                    ${dto.relevance},
                    ${dto.raw},
                    ${dto.prompt}
                )
            `;

            await this.connection.writerQuery(sql);
        } catch (e) {
            logger.error(e);
        }
    }
    
}