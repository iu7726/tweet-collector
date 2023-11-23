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
exports.PointJob01 = void 0;
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const libs_job_manager_1 = require("libs-job-manager");
class PointJob01 extends libs_job_manager_1.Job {
    constructor(jobRequest, cp) {
        super(jobRequest);
        this.cp = cp;
    }
    failResult(msg) {
        return {
            success: false,
            msg: msg
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // event exist check
                const eventSql = (0, sql_template_strings_1.default) `
            SELECT * FROM PointEvent WHERE id = ${this.request.eventId};
            `;
                const eventSqlResult = yield this.cp.readerQuery(eventSql);
                if (eventSqlResult.length === 0)
                    return this.failResult('Not Found Event');
                const event = eventSqlResult[0];
                // user event history check
                // case by event
                const eventHistorySql = (0, sql_template_strings_1.default) `
            SELECT * FROM PointUserHistory WHERE userId = ${this.request.userId} AND eventId = ${this.request.eventId};
            `;
                const eventHistorySqlResult = yield this.cp.readerQuery(eventHistorySql);
                if (eventHistorySqlResult.length > 0)
                    return this.failResult('Already Complete Event');
                // user active check
                // case by event
                const userHistorySql = (0, sql_template_strings_1.default) `
            SELECT * FROM Post_EN WHERE userId = ${this.request.userId};
            `;
                const userHistorySqlResult = yield this.cp.readerQuery(userHistorySql);
                if (userHistorySqlResult.length === 0) {
                    const krUserHistorySql = (0, sql_template_strings_1.default) `
                SELECT * FROM Post_KR WHERE userId = ${this.request.userId};
                `;
                    const krUserHistorySqlResult = yield this.cp.readerQuery(krUserHistorySql);
                    if (krUserHistorySqlResult.length === 0)
                        return this.failResult('Not Found User Active');
                    if (krUserHistorySqlResult.length > 1)
                        return this.failResult('Not Matched User History for Event');
                }
                if (userHistorySqlResult.length > 1)
                    return this.failResult('Not Matched User History for Event');
                // event complete point deposit
                // TODO: Now User Point Update
                // const depositSql = SQL`
                // INSERT INTO PointUserHistory 
                //     (userId, eventId, amount)
                // VALUES 
                //     (${this.request.userId}, ${this.request.eventId}, ${event.amount}});
                // `;
                // const depositSqlResult = await this.cp.writerQuery(depositSql);
                const depositHistorySql = (0, sql_template_strings_1.default) `
            INSERT INTO PointUserHistory 
                (userId, eventId, amount)
            VALUES 
                (${this.request.userId}, ${this.request.eventId}, ${event.amount});
            `;
                const depositHistorySqlResult = yield this.cp.writerQuery(depositHistorySql);
                logger.log("success");
                return {
                    success: true
                };
            }
            catch (err) {
                logger.log(err);
                const errSql = (0, sql_template_strings_1.default) `
            INSERT INTO PointEventError
                (userId, eventId)
            VALUES
                (${this.request.userId}, ${this.request.eventId});
            `;
                yield this.cp.writerQuery(errSql);
                return this.failResult(`userId: ${this.request.userId}, eventId: ${this.request.eventId} Error`);
            }
        });
    }
}
exports.PointJob01 = PointJob01;
