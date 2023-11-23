import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import { AppConfig } from "src/entity/AppConfig.entity";
import { logger } from "../util/Logger";
import Model from "./classes/Model";

export default class AppConfigModel extends Model {
    async getValue(key: string): Promise<string | undefined> {
        try {
            const sql = SQL`
            SELECT
                AC.value
            FROM
                AppConfig AS AC
            WHERE 
                AC.key = ${key}
            `;

            const result = await this.connection.readerQuerySingle<AppConfig>(sql);

            return result?.value;
        } catch (e) {
            logger.error(e);
        }
    }
    
}