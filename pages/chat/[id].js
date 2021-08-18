import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar"
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)} </title>
            </Head>
            <Sidebar />
            <ChatContainer>
                {/* the component will show the specific chat and messages given by the server side rendering */}
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;

//before the user sees the page, props will be fetched on the server (pre-fetch the data)
//context gives access to the params of the url
export async function getServerSideProps(context) {
    //reference to the specific chat
    const ref = db.collection("chats").doc(context.query.id);

    //Prep the messages
    const messagesRef = await ref
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

    //get the message response
    const messages = messagesRef.docs.map((doc) => ({   //create an object with an id and data
        id: doc.id,
        ...doc.data()
    })).map(messages => ({   //for each of the messages
        ...messages,    //get all the properties of the message
        timestamp: messages.timestamp.toDate().getTime(),   //change the timestamp
    }));

    //Prep the chats
    const chatRef = await ref.get();
    const chat = {  
        id: chatRef.id,
        ...chatRef.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),  
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

