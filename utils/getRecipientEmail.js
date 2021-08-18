
//goes through the list of users and finds the other user (not the logged one)
const getRecipientEmail = (users, userLoggedIn) => 
    users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;