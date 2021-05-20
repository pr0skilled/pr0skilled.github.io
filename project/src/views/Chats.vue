<template>
    <div class="sign">
        <div class="block-left">
            <div class="container scrollStatus" id="container" >
                <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>{{username}}`s rooms</h4>
            </div>
            <div class="srch_bar">
                <form @submit="sendForm">
              <div class="stylish-input-group">
                <input type="text" class="search-bar"  placeholder="Create new"  v-model="room_name" required>
                <span class="input-group-addon">
                <button type="submit" value="create"> </button>
                </span> </div>
                </form>
            </div>
          </div>
          <div class="inbox_chat">
               <div v-for="room in rooms" v-bind:key="room.id">
            <div class="chat_list active_chat"  v-if="room.owner.username==username" aria-current="true">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://pics.freeicons.io/uploads/icons/png/2220490481555590627-512.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <span id="text">{{room.name}}</span><input @click="enterRoom(room)" class="btn btn-outline-secondary" type="submit" value="connect" id="myBt">
                </div>
              </div>
            </div>
            <div v-else class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://pics.freeicons.io/uploads/icons/png/2220490481555590627-512.png" alt="sunil"> </div>
                <div class="chat_ib">
                 <span id="text"> {{room.name}}</span><input @click="enterRoom(room)" class="btn btn-outline-secondary" type="submit" value="connect" id="myBt">
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
            </div>
        </div>
        <div v-if="!$apollo.loading">
        <div v-if="deleted">
            <img src="https://icons-for-free.com/iconfiles/png/512/delete+remove+trash+trash+bin+trash+can+icon-1320073117929397588.png" alt="sunil">
        </div>
        <div  v-else-if="me.currentRoom" class="block-right">
            <div class="block-left2">
                <div class="headind_srch">
            <div class="recent_heading">
                <h4>{{me.currentRoom.name}}</h4>
                </div>
                <div class="srch_bar" v-if="username==me.currentRoom.owner.username">
              <div class="stylish-input-group">
                  <form @submit.prevent="updateRoom(me.currentRoom)">
                <input type="text" class="search-bar"  placeholder="New name"  v-model="Update" required>
                <span class="input-group-addon">
                <button type="submit" value="create">Update</button>
                
                </span> </form></div>
            </div>
                </div>
                
                <div class="mesgs">
          <div class="msg_history">
              <div v-for="message in me.currentRoom.lastMessages" v-bind:key="message.id">
            <div class="incoming_msg" v-if="message.author.username!=username">
              <div class="incoming_msg_img"> <img src="https://loremflickr.com/520/520/cat" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>{{message.text}}</p>
                  <span class="time_date"> {{message.timestamp}}    |    [{{message.author.username}}]</span></div>
              </div>
            </div>
            <div class="outgoing_msg " v-else>
              <div class="sent_msg">
                <p>{{message.text}}</p>
                <span class="time_date"> {{message.timestamp}}    |    [you]</span> </div>
            </div>
            </div>
          </div>
          <form @submit.prevent="createMessage">
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" placeholder="Type a message" v-model="message" required/>
              <button class="msg_send_btn" type="submit"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
          </form>
        </div>
            
            </div>
            <div class="block-right2">
                 
                <div class="container scrollStatus" id="container" >
                     <div class="headind_srch">
            <div class="recent_heading">
               <div class="srch_bar">
              <div class="stylish-input-group">
                  <span class="input-group-addon">
                <button type="submit" value="create" @click="deleteRoom(me.currentRoom)" v-if="username==me.currentRoom.owner.username" class="btn btn-primary">Delete</button></span></div>
              </div>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <span class="input-group-addon">
                <button type="submit" value="create" @click="leaveRoom">Leave</button>
                </span> </div>
            </div>
          </div>
                <div class="inbox_people">
          <div class="inbox_chat">
              <ul class="list-group">
               <div v-for="member in this.me.currentRoom.members" v-bind:key="member.id">
            <div class="chat_list active_chat"   v-if="member.username==username" aria-current="true">
              <div class="chat_people">
                <div class="chat_ib">
                  <span id="text">{{member.username}}</span>
                </div>
              </div>
            </div>
            <div v-else class="chat_list">
              <div class="chat_people">
                <div class="chat_ib">
                 <span id="text">{{member.username}}</span>
                </div>
              </div>
            </div>
          </div>
              </ul>
          </div>
        </div>
            </div>
                </div>
        </div>
        </div>
    </div>
</template>

<script>
import {GET_ROOMS,CREATE_ROOM,ROOM_SUB_CREATE,ROOM_SUB_UPDATE,ROOM_SUB_DELETE, GET_ME_ROOM, CURRENT_ROOM_UPDATE,JOIN_ROOM,LEAVE_ROOM,UPDATE_ROOM,DELETE_ROOM,MEMBER_JOIN,MEMBER_LEFT,MESSAGE_SUB_CREATE,MESSAGE_CREATE} from '../constants/graphql.js'

export default {
  name: 'Home',
  data(){
        return{
           rooms:[],
           room_name:null,
           username:localStorage.getItem('username'),
           message:null,
           me:null,
           update:null,
           deleted:false,
           id:1,
        };
  },
    apollo:{
        rooms:{ query: GET_ROOMS},
        me:{query:GET_ME_ROOM},
    $subscribe: {
     roomCreated: {
       query: ROOM_SUB_CREATE,
       // Result hook
       result ({ data }) {
         const {roomCreated} = data;
         console.log('SUB CREATE ROOM', roomCreated);
         this.rooms.push(roomCreated);
       },
     },
     roomDeleted:{
         query: ROOM_SUB_DELETE,
        result ({ data }) {
            for (let index = 0; index < this.rooms.length; index++){
                if(this.rooms[index].id==data.roomDeleted.id){
                    this.rooms.splice(index, 1)
                }
            }
            if(this.me.currentRoom.id==data.roomDeleted.id) {
                this.deleted=true;
                this.me.currentRoom=null;
            }
            
         console.log('SUB ROOM DELETE', data.roomDeleted);
       },
     },
    roomUpdated: {
       query: ROOM_SUB_UPDATE,
       // Result hook
       result ({ data }) {
         for (let index = 0; index < this.rooms.length; index++){
                if(this.rooms[index].id==data.roomUpdated.id){
                    console.log(this.rooms[index])
                    this.$set(this.rooms,index,data.roomUpdated)
                    console.log(this.rooms[index])
                }
            }
         console.log('SUB ROOM UPDATE', data.roomUpdated);
       },
     },
     currentRoomChanged: {
         query: CURRENT_ROOM_UPDATE,
         result ({ data }) {
         if(data.currentRoomChanged.currentRoom) this.$set(this.me.currentRoom,'currentRoom',data.currentRoomChanged.currentRoom);
         else this.me.currentRoom=null;
         console.log('SUB ROOM CHANGE', data.currentRoomChanged.currentRoom);
       },
     },
     memberJoin:{
         query: MEMBER_JOIN,
         result ({ data }) {
        this.me.currentRoom.members.push(data.memberJoined)
        const mes={
            id:this.id,
            author:{ username:"system"},
            text:data.memberJoined.username+ " entered"
        }
        this.id++;
        this.me.currentRoom.lastMessages.push(mes)
    console.log('SUB MEMBER JOIN', data.memberJoined);
     },
     },
    memberLeft:{
         query: MEMBER_LEFT,
         result ({ data }) {
        for (let i = 0; i< this.me.currentRoom.members.length; i++){
                if(this.me.currentRoom.members[i].id==data.memberLeft.id){
                   this.me.currentRoom.members.splice(i,1) 
                }
            }
        const mes={
            id:this.id,
            author:{ username:"system"},
            text:data.memberLeft.username+ " leaved"
        }
        this.me.currentRoom.lastMessages.push(mes)
        this.id++;
         console.log('SUB MEMBER LEFT', data.memberLeft);
     }
    },
    messageSubCreate: {
        query: MESSAGE_SUB_CREATE,
         result ({ data }) {
        this.me.currentRoom.lastMessages.push(data.messageCreated)
         console.log('SUB MESSAGE CREATE', data.messageCreated);
     }

    }
},
    },
     methods:{
        async sendForm(e){
             e.preventDefault()
             try{
                    console.log('create post');
                    const result = await this.$apollo.mutate({
                    mutation: CREATE_ROOM,
                    variables: { name: this.room_name}
                    });
                    console.log(result);

            }
            catch(error){
                console.log(error)
            }

        },
    async enterRoom(room){
    try{
        this.deleted=false;
        console.log("Hello")
        console.log(room)
        if(!this.me.currentRoom){
                console.log('enter room');
                const result = await this.$apollo.mutate({
                mutation: JOIN_ROOM,
                variables: { roomId: room.id}
                });
                console.log(result);
        }
        else{
            console.log("leave room")
            const result = await this.$apollo.mutate({
                mutation: LEAVE_ROOM});
                console.log(result);
            console.log('enter room');
            const result2 = await this.$apollo.mutate({
                mutation: JOIN_ROOM,
                variables: { roomId: room.id}
                });
                console.log(result2);
        }

    }
    catch(error){
                console.log(error)
            }
    },
    async leaveRoom(){
        try{
                console.log("leave room")
                const result = await this.$apollo.mutate({
                mutation: LEAVE_ROOM});
                console.log(result);

            }
            catch(error){
                console.log(error)
            }
    },
    async updateRoom(room){
        try{
            console.log(room)
            console.log('update room');
            const result = await this.$apollo.mutate({
            mutation: UPDATE_ROOM,
            variables: { id: room.id,name: this.update}
            });
            console.log(result);

        }
        catch(error){
                console.log(error)
        }
        this.update=null
    },
    async deleteRoom(room){
        try{
            console.log(room)
            console.log('delete room');
            const result = await this.$apollo.mutate({
            mutation: DELETE_ROOM,
            variables: { id: room.id}
            });
            console.log(result);
            for(let i=0;i<this.me.currentRoom.members.length;i++)
                this.me.currentRoom.members.currentRoom=null;

        }
        catch(error){
                console.log(error)
        }
    },
    async createMessage(){
            try{
            console.log('create message');
            const result = await this.$apollo.mutate({
            mutation: MESSAGE_CREATE,
            variables: { text: this.message}
            });
            console.log(result);

        }
        catch(error){
                console.log(error)
        }
        this.message=null
    }
}
}


</script>
<style scoped>
.container{max-width:1170px; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  height: 87vh;
  float: left;
  overflow: hidden;
  width: 100%; border-right:1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}


.recent_heading {float: left; width:40%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: rgb(120,120,120);
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  text-align:left;
  font-size: 12pt;

}
#wer{
    text-align:right;
}
.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { 
    height: 92%;
    overflow-y: scroll;
}

.active_chat{ background:#ebebeb;}

.incoming_msg_img {
  display: inline-block;
  width: 7%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 100%;
}

 .sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}
    .msg_send_btn {
        background: url(https://res.cloudinary.com/karmaindusa/image/upload/v1621184718/n1hcepfcxwkimt2xm114.png);
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 33px;
    }
.messaging { padding: 0 0 50px 0;}
.msg_history {
  height: 670px;
  overflow-y: auto;
}
#myBt {
  display: inline-block;
  padding: 12px 24px;
  background: rgb(220,220,220);
  font-weight: bold;
  color: rgb(120,120,120);
  border: none;
  outline: none;
  border-radius: 3px;
  cursor: pointer;
  transition: ease .3s;
}

#myBt:hover {
  background: #8BC34A;
  color: #ffffff;
}
.block-left{
    width:30%;
    height:800px;
    float:left;
}
.block-left2{
    width:57%;
    height:800px;
    float:left;
}
#text{
    font-size:20px; color:#464646;
    text-align: center;
    margin: 1pc;
}
.block-right{
    width:70%;
    height:800px;
    overflow:hidden;
}
.block-right2{
    width:43%;
    height:800px;
    overflow:hidden;
}
</style>