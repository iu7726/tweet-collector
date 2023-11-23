import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import { CryptoDictionary } from "src/entity/CryptoDictionary";
import { logger } from "../util/Logger";
import Model from "./classes/Model";

export default class CryptoDictionaryModel extends Model {
    async getDictionary(): Promise<string[]> {
        try {
            const sql = SQL`
            SELECT
                word
            FROM
                CryptoDictionary;
            `;

            const result: CryptoDictionary[] = await this.connection.readerQuery<CryptoDictionary[]>(sql);

            return result.map(item => item.word);
        } catch (e) {
            logger.error(e);
        }

        return [];
    }
    
}