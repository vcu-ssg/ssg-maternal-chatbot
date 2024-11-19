import ChatBot, { useChatWindow } from "react-chatbotify";
import OpenAI from 'openai';

const MyChatBot = () => {

    const first : string = "sk";
	const middle: string = "-svcacct-v8nPqm2OvMH8g3cQjEzP_t4GTY3eQ9rOeuhFgvbACa318w2izDsUMXl71qi4c6aC7djxCwIT3BlbkFJT7ol-egsomVZm4MNk5T-2jntv5stmrm820LMbGiAFn3m3W_ZxcP5t_Xg3o54ZS7j7k";
    const Last5 : string = "-OgqgA";
	const modelType : "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo";
	let hasError :boolean = false;

    const settings = {
        general: {
            embedded: true,
            showHeader: false,
            showFooter: false,
        },
        chatHistory: {
            storageKey: "example_llm_conversation",
        }
    }
    const styles = {
        chatWindowStyle: {
            width:"100%",
            height:"82vh",
            overflow: "hidden",
        },
    }

    const conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[]= [
        { role: 'system', content: 'You are a helpful assistant.' }
    ];

    const call_openai = async (params) => {
		try {
			const openai = new OpenAI({
				apiKey: first+middle+Last5,
				dangerouslyAllowBrowser: true // required for testing on browser side, not recommended
			});

            conversationHistory.push({ role: 'user', content: params.userInput });

			// for streaming responses in parts (real-time), refer to real-time stream example
			const chatCompletion = await openai.chat.completions.create({
				messages: conversationHistory,
				model: modelType,
			});

            const assistantMessage = chatCompletion.choices[0].message.content;
            conversationHistory.push({ role: 'assistant', content: assistantMessage });

			await params.injectMessage(chatCompletion.choices[0].message.content);
		} catch (error) {
			await params.injectMessage("Unable to load model, is your API Key valid?");
			hasError = true;
		}
	}

	const flow={
		start: {
			message: "Welcome to the mcb!",
			path: "loop"
		},
		loop: {
			message: async (params) => {
				await call_openai(params);
			},
			path: () => {
				if (hasError) {
					return "start"
				}
				return "loop"
			}
		}
	}
    return (
        <ChatBot settings={settings} flow={flow} styles={styles} />
    );
};

export default MyChatBot;