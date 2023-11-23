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
const openai_1 = require("openai");
const Logger_1 = require("../util/Logger");
const DelayApiModel_1 = __importDefault(require("./classes/DelayApiModel"));
class ChatGPTApiModel extends DelayApiModel_1.default {
    getChatGPTSummery(prompt, writer, targetTxt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configuration = new openai_1.Configuration({
                    apiKey: process.env.CHATGPT_API_KEY,
                });
                const openai = new openai_1.OpenAIApi(configuration);
                const newPrompt = prompt + `
content: "${targetTxt}"

`;
                const response = yield openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: newPrompt,
                    temperature: 0,
                    max_tokens: 2048,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
                });
                const data = response.data;
                const choices = data.choices[0];
                let result = {};
                try {
                    result = JSON.parse(choices.text);
                }
                catch (e) { }
                result.raw = JSON.stringify(data);
                result.prompt = newPrompt;
                return result;
            }
            catch (e) {
                Logger_1.logger.error(e);
            }
            return undefined;
        });
    }
}
exports.default = ChatGPTApiModel;
