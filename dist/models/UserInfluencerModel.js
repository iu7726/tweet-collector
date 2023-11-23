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
class UserInfluencerModel extends Model_1.default {
    getNextInfluencerId(influencerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.connection.readerQuery((0, sql_template_strings_1.default) `SELECT id FROM UserInfluencer WHERE id >= ${influencerId} LIMIT 2`);
            return result.length == 2 ? result[1].id : 1;
        });
    }
    getInfluencerUser(influencerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = (0, sql_template_strings_1.default) `
        SELECT 
            id,
            typeId,
            lastAccessTime
        FROM
            UserInfluencer
        WHERE 
            id = ${influencerId} AND
            deletedAt IS NULL;
        `;
            return yield this.connection.readerQuerySingle(sql);
        });
    }
    updateInfluencer(typeId, updateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = (0, sql_template_strings_1.default) `
        UPDATE UserInfluencer
        SET
            username = ${updateDto.username},
            name = ${updateDto.name},
            profileImagePath = ${updateDto.profileImagePath},
            verified = ${updateDto.verified}
        WHERE
            typeId = ${typeId};
        `;
            const result = yield this.connection.writerQuery(sql);
            return result.affectedRows > 0;
        });
    }
    getLastAccessTime(influencerId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.connection.readerQuerySingle((0, sql_template_strings_1.default) `SELECT lastAccessTime FROM UserInfluencer WHERE id = ${influencerId}`);
            return user ? (_a = user.lastAccessTime) !== null && _a !== void 0 ? _a : Math.round(new Date().getTime() / 1000 - 86400) : undefined;
        });
    }
}
exports.default = UserInfluencerModel;
