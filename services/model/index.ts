import { getLlama, LlamaChatSession, defineChatSessionFunction } from 'node-llama-cpp';

const llama = await getLlama();

const model = await llama.loadModel({
    modelPath: "/path/to/model"
})


const functions = {
    getDetails: defineChatSessionFunction({
        description: "Get the all the relevant and important details based on the user's requirement",
        params: {
            type: 'object',
            properties: {
                relevantDetails: { type: "string" }
            }
        },
        async handler(params) {
            return `I got the most important and relevant details from the user's request: ${params.relevantDetails}`
        }
    })
}

export async function initializeChatSession(question: string, file: File | null = null) {
    const context = await model.createContext();
    const session = new LlamaChatSession({ contextSequence: context.getSequence() });
    const response = await session.prompt(question, { functions });
    return response;
    // Setup a question response type convo until all ai questions are asked
}