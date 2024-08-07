import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/More";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";

function Sidebar() {
    const [user] = useAuthState(auth);

    // reference to the db
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);

    // snapshot of the db - manages an array of unique items (all chats of the user) - real time listener
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt('Please enter an email address for the user you want to chat with.');

        if(!input) return null;

        // email has correct form, the chat doesn't already exists, the input is not the user email(you can't message yourself)
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email ){{
            db.collection('chats').add({
                users: [user.email, input]
            });
        }}
    };

    const chatAlreadyExists = (recipientEmail) => 
        // "!!" converts it to a boolean value
        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in chats" />
            </Search>

            <SidebarButton onClick={createChat}> Start a new chat </SidebarButton>

            {/* List of chats */}
            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;