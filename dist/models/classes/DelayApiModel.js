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
const axios_1 = __importDefault(require("axios"));
const Logger_1 = require("../../util/Logger");
const Utils_1 = require("../../util/Utils");
class DelayApiModel {
    constructor(delayTime = 3000) {
        this.delayTime = delayTime;
    }
    getHeaders() {
        return { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` };
    }
    GET(requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const st = new Date().getTime();
            let result;
            try {
                const axiosResult = yield axios_1.default.get(requestUrl, {
                    headers: this.getHeaders()
                });
                result = axiosResult.data;
            }
            catch (e) {
                Logger_1.logger.error(e);
            }
            const dt = new Date().getTime() - st;
            if (this.delayTime > dt) {
                yield Utils_1.twitterUtil.wait(this.delayTime - dt);
            }
            return result !== undefined ? result : undefined;
        });
    }
}
exports.default = DelayApiModel;
