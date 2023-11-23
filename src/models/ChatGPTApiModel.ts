import moment from "moment";
import { Configuration, OpenAIApi } from "openai";
import { ChatGPT, ChatGPTApi } from "src/entity/ChatGPTApi.entity";
import { logger } from "../util/Logger";
import DelayApiModel from "./classes/DelayApiModel";

export default class ChatGPTApiModel extends DelayApiModel {

    async getChatGPTSummery(prompt: string, writer: string, targetTxt: string): Promise<ChatGPT | undefined> {
        try {
            const configuration = new Configuration({
                apiKey: process.env.CHATGPT_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            const newPrompt = prompt + `
content: "${targetTxt}"

`

            const response: any = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: newPrompt,
                temperature: 0,
                max_tokens: 2048,      
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })

            const data: ChatGPTApi = response.data;

            const choices = data.choices[0];
            let result: any = {};

            try {
                result = JSON.parse(choices.text);
            } catch (e) {}

            result.raw = JSON.stringify(data);
            result.prompt = newPrompt;
            
            return result;
        } catch (e) {
            logger.error(e);
        }

        return undefined;
    }

}