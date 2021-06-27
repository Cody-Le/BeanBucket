import React, {useState} from "react"
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal"


export default function AuthPage(props){
    let [isSigningUp, setSignUp] = useState(false)


    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [reConfirmPassWord, setConfirmPassword] = useState("")

    const HandleSignUp = () =>{
        setSignUp(!isSigningUp)
      }

    //Event handlers 


    const validateEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const SignUp = () =>{
        if (validateEmail(email)){
            if (password == reConfirmPassWord){
                props.singUpHandler(email, password)
            }
        }
    }

    
    if (!isSigningUp){

        return(
          <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize:20, fontWeight:"bold"}}>Login</Text>
            <TextInput placeholder={"Email"} style={styles.input} onChangeText={text=>setEmail(text)} value = {email}/>
            <TextInput placeholder={"Password"} style={styles.input}  onChangeText={text=>setPassword(text)} value = {password } secureTextEntry={true}/>
            <View style={{flexDirection:"row", justifyContent:"space-between", width: "80%"}}>
              <Text style={styles.signUpText} onPress={HandleSignUp}>Sign up</Text>
              <TouchableOpacity style={[styles.submitButton]}><View><Text>Login</Text></View></TouchableOpacity> 
               
            </View>
          </View>
        );
      }else{
        return(
          <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize:20, fontWeight:"bold"}}>Sign Up</Text>
            <TextInput placeholder={"User Name"} style={styles.input} value={userName} onChangeText = {(text) => setUserName(text)}/>
            <TextInput placeholder={"Email"} style={styles.input} onChangeText={text=>setEmail(text)} value = {email}/>
            <TextInput placeholder={"Password"} style={styles.input}  onChangeText={text=>setPassword(text)} value = {password } secureTextEntry={true}/>
            <TextInput placeholder={"Confirm password"} style={styles.input} onChangeText={text=>setConfirmPassword(text)} value = {reConfirmPassWord } secureTextEntry={true}/>
            <View style={{flexDirection:"row", justifyContent:"space-between", width: "80%"}}>
              <Text style={styles.signUpText} onPress={HandleSignUp}>Login In</Text>
              <TouchableOpacity style={[styles.submitButton]}><View><Text>Sign Up</Text></View></TouchableOpacity> 
               
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
      paddingTop: 30,
      backgroundColor: "#F2F4F6",
      height: "100%",
    },

 
    input:{
      backgroundColor: "#FFF",
      width: "80%",
      height: 50,
      padding: 10,
      borderRadius: 10,
      marginTop: 15
      
    },
    submitButton:{
        backgroundColor: "#D5ECC2",
        padding: 10,
        marginTop: 15,
        borderRadius:5,
      
    },

    signUpText:{
      marginTop: 22,
      marginLeft: 5

    }

});


