import React, {useState} from "react"
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal"


export default function AuthPage(props){
    let [isSigningUp, setSignUp] = useState(false)


    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [reConfirmPassWord, setConfirmPassword] = useState("")
    let [errorAlert, setErrorAlert] = useState(false)


    const HandleSignUp = () =>{
        setSignUp(!isSigningUp)
      }

    //Event handlers 


    const validateEmail = (email) =>{
        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return re.test(email);
    }

    const SignUp = () =>{
        if (validateEmail(email) && (password == reConfirmPassWord)){
            console.log()
            props.signUpHandler(email.replace(" ",""), password)
            props.escapeHandler()
        }else{
            setErrorAlert(true)
            console.log(validateEmail(email))
        }
    }



    const SignIn = () =>{
      props.signInHandler(email.replace(" ", ""),password)
      props.escapeHandler()
    }

    const HandeCloseAlert = () =>{
        setErrorAlert(!errorAlert)
    }

    
    if (!isSigningUp){

        return(
          <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            
            <Text style={{fontSize:20, fontWeight:"bold"}}>Login</Text>
            <TextInput placeholder={"Email"} style={styles.input} onChangeText={text=>setEmail(text)} value = {email}/>
            <TextInput placeholder={"Password"} style={styles.input}  onChangeText={text=>setPassword(text)} value = {password } secureTextEntry={true}/>
            <View style={{flexDirection:"row", justifyContent:"space-between", width: "80%"}}>
              <Text style={styles.signUpText} onPress={HandleSignUp}>Sign up</Text>
              <TouchableOpacity style={[styles.submitButton]} onPress={SignIn}><View><Text>Login</Text></View></TouchableOpacity> 
               
            </View>
          </View>
        );
      }else{
        return(
          <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
              <Modal isVisible={errorAlert} style={styles.alertWrapper}>
                <Text>Something is wrong, check the format of email or reconfirm password</Text>
                <TouchableOpacity style={[styles.alertButton]} onPress={HandeCloseAlert}><View><Text>Ok</Text></View></TouchableOpacity>

            </Modal>
            <Text style={{fontSize:20, fontWeight:"bold"}}>Sign Up</Text>
            <TextInput placeholder={"User Name"} style={styles.input} value={userName} onChangeText = {(text) => setUserName(text)}/>
            <TextInput placeholder={"Email"} style={styles.input} onChangeText={text=>setEmail(text)} value = {email}/>
            <TextInput placeholder={"Password"} style={styles.input}  onChangeText={text=>setPassword(text)} value = {password } secureTextEntry={true}/>
            <TextInput placeholder={"Confirm password"} style={styles.input} onChangeText={text=>setConfirmPassword(text)} value = {reConfirmPassWord } secureTextEntry={true}/>
            <View style={{flexDirection:"row", justifyContent:"space-between", width: "80%"}}>
              <Text style={styles.signUpText} onPress={HandleSignUp}>Login In</Text>
              <TouchableOpacity style={[styles.submitButton]} onPress = {Sign}><View><Text>Sign Up</Text></View></TouchableOpacity> 
               
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

    },
    alertWrapper:{
        backgroundColor: "#FFF",
        height: 30,
        padding: 20, 
        borderRadius:10
    }

});


