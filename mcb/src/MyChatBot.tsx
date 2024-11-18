import ChatBot, { useChatWindow } from "react-chatbotify";

const MyChatBot = () => {
    const settings = {
        general: {embedded: true},
        chatHistory: {storageKey: "playground"},
        botBubble: {simStream: true},
    }
    const styles = {
    }

    const flow={
        start: {
            message: "Welcome to the playground 🥳! Edit and experiment as you wish!",
            path: "end_loop"
        },
        end_loop: {
            message: (params) => `Received: ${params.userInput}`,
            path: "end_loop"
        }
    }
    return (
        <ChatBot settings={settings} flow={flow} styles={styles} />
    );
};

export default MyChatBot;