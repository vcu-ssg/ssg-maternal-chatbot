import ChatBot, { useChatWindow } from "react-chatbotify";

const MyChatBot = () => {
    const settings = {
        general: {
            embedded: true,
            showHeader: false,
            showFooter: false,
            secondaryColor: "red",
        },
        //device: {desktopEnabled: true},
        //chatHistory: {storageKey: "playground"},
        //botBubble: {simStream: true},
        //chatWindow: {defaultOpen:true},
    }
    const styles = {
        chatWindowStyle: {
            width:"100%",
            height:"100%",
            overflow: "hidden",
        },
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