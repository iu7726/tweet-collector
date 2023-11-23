export interface ChatGPTApi {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: ChatGPTApiChoice[],
    usage: ChatGPTApiUsage
}

export interface ChatGPTApiChoice {
    text: string,
    index: number,
    logprobs: any,
    finish_reson: string,
}

export interface ChatGPTApiUsage {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
}

export interface ChatGPT {
    text?: string,
    score?: number,
    relevance?: number,
    raw: string,
    prompt: string,
}