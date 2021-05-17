import gql from 'graphql-tag'
 
export const GET_LOGIN = gql`query login($username: String!, $password: String!){
    login(username: $username, password: $password)}`;

export const GET_REGISTER =gql`query register($username: String!, $password: String!){
    register(username: $username, password: $password){
    username}}`;

export const GET_ROOMS=gql`query rooms {
    rooms {id name owner {username}}
    }`;

export const CREATE_ROOM=gql`mutation createRoom ($name: String!){
    createRoom(name: $name) {
        id
        name
        timestamp
    }
    }`;

export const ROOM_SUB_CREATE = gql`subscription roomCreated {
    roomCreated {
    id name owner {username}
        }
    }`;


export const ROOM_SUB_UPDATE =gql`subscription roomUpdated {
    roomUpdated {
    id name owner {username}
        }
    }`;

export const ROOM_SUB_DELETE=gql`subscription roomDeleted {
    roomDeleted{
    id 
        }
    }`;

export const CURRENT_ROOM_UPDATE=gql`subscription currentRoomChanged {
    currentRoomChanged {
        id
      currentRoom { id 
        name 
        owner{username}
        members{id username}
        lastMessages{id timestamp author{username} text}
    }
    }
  }
  `;

  export const MESSAGE_SUB_CREATE = gql`subscription messageCreated {
    messageCreated {
      id
      timestamp
      author { id username }
      text
    }
  }`;

export const MEMBER_JOIN = gql`subscription memberJoined {
    memberJoined { id username }
  }`;

export const MEMBER_LEFT = gql`subscription memberLeft {
    memberLeft { id username }
  }`;

export const GET_ME_ROOM=gql`query me {
    me {
      id
      username
      currentRoom {
        id
        name
        owner{username}
        members{id username}
        lastMessages{id timestamp author{username} text}
      }
    }
  }`;

export const JOIN_ROOM=gql`mutation join($roomId: ID!) {
    joinRoom(roomId: $roomId) {
      id
      name
    }
  }`;

export const LEAVE_ROOM=gql`mutation leave {
    leaveCurrentRoom {
      id 
      name
    }
  }`;

  export const UPDATE_ROOM=gql`mutation updateRoom ($id: ID!,$name: String!){
    updateRoom(id: $id, name: $name) {
      id 
    }
  }`;

  export const DELETE_ROOM=gql`mutation deleteRoom ($id: ID!){
    deleteRoom (id: $id) {
      id 
    }
  }`;
  export const MESSAGE_CREATE=gql`mutation createMessage ($text: String!) {
    createMessage(text: $text) {
      id
      timestamp
      author { username }
      text
    }
  }`;