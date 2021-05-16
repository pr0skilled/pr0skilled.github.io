<template>
<div>
<div v-if="error">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Authentification failed!</strong> {{error}}
            <button @click="noerr" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
</div>

<form @submit="sendForm">
  <label>
    <p class="label-txt">ENTER YOUR NAME</p>
    <input type="text" class="input"  v-model="username" required>
    <div class="line-box">
      <div class="line"></div>
    </div>
  </label>
  <label>
    <p class="label-txt">ENTER YOUR PASSWORD</p>
    <input  type="password" class="input"  v-model="password" required>
    <div class="line-box">
      <div class="line"></div>
    </div>
  </label>
  <button type="submit" id="myBt">submit</button>
  <div id="some">Already have an account? <router-link to="/sign">Log in  now</router-link></div>
</form>
</div>
</template>
<script>
import {onLogin} from '../vue-apollo'
import { GET_LOGIN, GET_REGISTER} from '../constants/graphql.js'
export default {
    name: 'register',
    data(){
        return{
            id: null,
            errors: null,
            username: null,
            password: null,
            error:null,
            er_mes:""
        };
    },
    methods:{
         async sendForm(e){
             e.preventDefault()
             let res=null
             let res2=null
             try{
             res= await this.$apollo.query({
             query: GET_REGISTER,
                variables: { username: this.username,
                        password: this.password}
            })
            console.log(res.data)
            res2= await this.$apollo.query({
             query: GET_LOGIN,
                variables: { username: this.username,
                        password: this.password}
            })
            console.log(res2.data.login)
            localStorage.setItem('username',this.username)
            await onLogin(this.$apollo.provider.defaultClient,res2.data.login)
            this.$router.push('/chats')
            }
            catch({ graphQLErrors, networkError }){
                if (graphQLErrors)
                graphQLErrors.map(({ message}) =>
                this.error=message,)
                if (networkError) this.error=networkError
            }

        },
        noerr(){
            this.error=""
        }
    }
};
</script>
<style scoped>


body {
  background: #C5E1A5;
}
form {
  width: 55%;
  margin: 60px auto;
  background: #efefef;
  padding: 60px 120px 80px 120px;
  text-align: center;
  -webkit-box-shadow: 2px 2px 3px rgba(0,0,0,0.1);
  box-shadow: 2px 2px 3px rgba(0,0,0,0.1);
}
label {
  display: block;
  position: relative;
  margin: 40px 0px;
}
.label-txt {
  position: absolute;
  top: -1.6em;
  padding: 10px;
  font-family: sans-serif;
  font-size: .8em;
  letter-spacing: 1px;
  color: rgb(120,120,120);
  transition: ease .3s;
}
.input {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  outline: none;
}

.line-box {
  position: relative;
  width: 100%;
  height: 2px;
  background: #BCBCBC;
}

.line {
  position: absolute;
  width: 0%;
  height: 2px;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: #8BC34A;
  transition: ease .6s;
}

.input:focus + .line-box .line {
  width: 100%;
}

.label-active {
  top: -3em;
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
a:link{
  color: #8BC34A;
}
#some{
  padding: 10px;
  font-family: sans-serif;
  font-size: .8em;
  letter-spacing: 1px;
  color: rgb(120,120,120);
  transition: ease .3s;
}

</style>