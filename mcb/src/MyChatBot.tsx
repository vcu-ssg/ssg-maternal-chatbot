import ChatBot, { useChatWindow } from "react-chatbotify";
import OpenAI from 'openai';
import {welcomeMessage, systemPrompt,firstTrimesterPrompt,firstTrimesterWelcome,
	generalPregnancyPrompt,generalPregnancyMessage} from './prompts';

const MyChatBot = () => {

    const first : string = "sk";
	const middle: string = "-svcacct-v8nPqm2OvMH8g3cQjEzP_t4GTY3eQ9rOeuhFgvbACa318w2izDsUMXl71qi4c6aC7djxCwIT3BlbkFJT7ol-egsomVZm4MNk5T-2jntv5stmrm820LMbGiAFn3m3W_ZxcP5t_Xg3o54ZS7j7k";
    const Last5 : string = "-OgqgA";
	const modelType : "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo";
	let hasError :boolean = false;

    const settings = {
        general: {
            embedded: true,
            showHeader: true,
            showFooter: false,
        },
		audio: {
			disabled: true,
			defaultToggledOn: true,
			tapToPlay: true,
		},
        chatHistory: {
			disabled: true,
            storageKey: "example_llm_conversation",
        },
		header: {
			title: "Maternal CareBot",
		},
		notification: {
			disabled: true,
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
        { role: 'system', content: firstTrimesterPrompt }
    ];

    const call_openai_stream = async (params) => {
		try {
			const openai = new OpenAI({
				apiKey: first+middle+Last5,
				dangerouslyAllowBrowser: true // required for testing on browser side, not recommended
			});

            conversationHistory.push({ role: 'user', content: params.userInput });

			// for streaming responses in parts (real-time), refer to real-time stream example
			const chatStream = await openai.chat.completions.create({
				messages: conversationHistory,
				model: modelType,
				stream: true,
			});

			let assistantMessage : string = '';
			for await (const part of chatStream){
				const msg : string = part.choices[0].delta.content;
				if (msg){
					assistantMessage += msg;
					await params.streamMessage( assistantMessage );
					await new Promise(resolve => setTimeout(resolve, 80)); // delay after each part
				}
			}
			await params.endStreamMessage();

		    conversationHistory.push({ role: 'assistant', content: assistantMessage });

		} catch (error) {
			await params.injectMessage("Unable to load model, is your API Key valid?");
			hasError = true;
		}
	}

	
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
				stream: false,
			});

			const assistantMessage : string = chatCompletion.choices[0].message.content;
			await params.injectMessage( assistantMessage );
		    conversationHistory.push({ role: 'assistant', content: assistantMessage });

		} catch (error) {
			await params.injectMessage("Unable to load model, is your API Key valid?");
			hasError = true;
		}
	}

	const helpOptions = ["Survey", "First Visit", "First Trimester", "Second Trimester"];

	const flow={
		start: {
			message: welcomeMessage,
			path: "showOptions",
			chatDisabled: true,
			transition: {duration:0},
		},
		showOptions: {
			message: "Select activity below ...",
			options: helpOptions,
			chatDisabled: true,
			path: "processOptions",
		},
		processOptions: {
			transition: {duration:0},
			chatDisabled: true,
			path: async (params) => {
				let link :string = "";
				switch (params.userInput) {
					case "Survey": link = "survey"; break;
					case "First Visit" : link = "firstVisit"; break;
					case "First Trimester" : link = "firstTrimester"; break;
					case "Second Trimester" : link = "secondTrimester"; break;
					default: link = "unknownInput";
				}
				setTimeout(() => { }, 500)
				return link
			}
		},
		survey: {
			message: "Welcome survey",
			path: async(params) => {
				await params.injectMessage("(survey gathering prelim info and store it)");
				setTimeout(() => { }, 500)
				return "showOptions";
			},
			chatDisabled: true,
			transition: {duration: 500},

		},
		firstVisit: {
			message: "First visit survey (empty)",
			path: "showOptions",
			chatDisabled: true,
			transition: {duration: 500},
		},
		firstTrimester: {
			message: firstTrimesterWelcome,
			path: "loop",
		},
		secondTrimester: {
			message: "Second trimester survey",
			path: "showOptions",
			chatDisabled: true,
			transition: {duration: 500},
		},
		loop: {
			message: async (params) => {
				await call_openai_stream(params);
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