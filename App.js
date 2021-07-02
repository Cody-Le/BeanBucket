import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from "expo-app-loading";
import Bean from "./components/Beans.js"
import firebase from "firebase/app"
import AuthPage from './components/AuthPage.js'
import 'firebase/auth'
import "firebase/database"
import Modal from "react-native-modal"



function ErrorWindow(props){

  return(
    <Modal isVisible = {props.visible}>
      <View style = {styles.AlertWrapper}>
        <Text style = {styles.AlertText}>{props.error}</Text>
        <TouchableOpacity onPress={props.HandleOK} style={styles.AlertOK}>
          <View>OK</View>
        </TouchableOpacity>
        </View>
    </Modal>
  );
}




export default function App() {
  let[isFontLoaded] = useFonts({
    Roboto_400Regular
  })



  
//tag system: public, scientific, video and  non-evaluated




  const config = {
    apiKey: "AIzaSyDwkpXpQgNmuV15udAS1jvfbZvNDLsRv7g",
    authDomain: "beanbucket-d31ca.firebaseapp.com",
    projectId: "beanbucket-d31ca",
    storageBucket: "beanbucket-d31ca.appspot.com",
    messagingSenderId: "47776766169",
    appId: "1:47776766169:web:7901cb7df53efc953206c8",
    measurementId: "G-3F5B5BS2HR"
  };


  var bin = []

  //State
  let [bins, editBin] = useState(bin)
  let [needRefresh, setRefreshNeed] = useState(false)
  let [isBurgered, setBurger] = useState(false)
  let [isAuthUi, setAuthUi] = useState(false)
  let [currentUser, setCurrentUser] = useState(null)
  let [showAlert, setAlertState] = useState(false)
  let [message, setAlertMessage] = useState("")


  const HandleAlert = () =>{
    setAlertState(!showAlert)
  }

  const getBeans = (uid) =>{

    let db = firebase.database()
    db.ref().child("users/bucket").child(uid).get().then((snap)=>{
      if(snap.exists()){
        var updateBin = []
        for (var bean in snap.val()){
          updateBin.push({key:bean, title: snap.val()[bean]['title'], description: snap.val()[bean]['description'], tag: snap.val()[bean]['tag']})
        }
        editBin(updateBin)
      }
    }).catch((e)=>{
      setAlertMessage(e.toString())
      HandleAlert()
    })

  


    
  }


  useEffect(() =>{
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }else {
      firebase.app(); // if already initialized, use that one
    }
  
    let db = firebase.database()

    firebase.auth().onAuthStateChanged((user)=>{
      if(user != null){
        setCurrentUser(user)
        setAuthUi(false)
        getBeans(user.uid)
      }
     
    })

  },[])



  const addBean = () => {
    let db = firebase.database()

    //Communication with backend,
    //Append a new key
    let newKey = db.ref().child('public/').push().key

    //Add a new bean with the same template
    //Tag: true means public and false means private
    const postData = {
      title: "A new Bean",
      description: "Add a new description",
      tag: [{value: true, type : 1},{type: 0}]
    }
    var updates = {}
    updates["users/bucket/" + currentUser.uid + "/" + newKey] = postData
    updates["public/" + newKey]  = "A new Bean"

    db.ref().update(updates).catch((e)=>{
      setAlertMessage(e.toString())
      HandleAlert()
    })
    //Handle UI part
  
    let bin2 = bins
    
    bin2.push({key: newKey, title: "bean", description: "Add a description",tag: [{value: true, type : 1},{type: 0}]})
    editBin(bin2)
    setRefreshNeed(!needRefresh)
  
  }

  //Pass on Functions
  const DeleteBean = (key) =>{
    let db = firebase.database()
    db.ref().child("users/bucket/").child(currentUser.uid).child(key).remove()

    db.ref().child("public/").child(key).remove()

    let index = bins.findIndex((item) => {return item.key == key})
    let bin2 = bins
    bin2.splice(index, 1)
    editBin(bin2)
    setRefreshNeed(!needRefresh)



  }



  

  const UpdateBean = (key, title, description, value) =>{
    let db = firebase.database()
    const postData = {
      title: title,
      description: description,
      tag:  [{value:!value, type:1},{type:0}]
    }


    var updates = {}
    updates["users/bucket/" + currentUser.uid + "/" + key] = postData

    if (value){
      updates["public/" + key]  = title
    }

    db.ref().update(updates).catch((e)=>{
      setAlertMessage(e.toString())
      HandleAlert()
    })

    //Add the value to the global share of beans or to remove item from it
    updates = {}
    if(!value){
      db.ref().child("public/").child(key).remove()
    }


    let index = bins.findIndex((item)=>{return item.key == key;})
    let bin2 = bins
    bin2[index] = {key:key, title: title, description: description, tag: [{value:!value, type:1},{type:0}]}
    console.log(index,key, title, description)
    editBin(bin2)
    setRefreshNeed(!needRefresh)
  }

  //Event handler

  const HandleBurgerPressed = () =>{
    setBurger(!isBurgered)
  }

  const HandleLAuthUI = () =>{
    setAuthUi(!isAuthUi)
  }

  //Action eg. Data fetching, authentication functions


  const signIn = (email, password)=>{

    console.log(email, password)
    firebase.auth().signInWithEmailAndPassword(email, password).catch((e)=>{
      setAlertMessage(e.toString())
      HandleAlert().catch((e)=>{
        setAlertMessage(e.toString())
        HandleAlert()
      })
    })
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        console.log(user.uid)
        setCurrentUser(user)
        getBeans(user.uid)
      }
    })
  }

  const signUp = (userName, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch((e)=>{
      setAlertMessage(e.toString())
      HandleAlert()
    })
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        console.log(user.uiid)
        getBeans(user.uid)
        user.updateProfile({displayName: userName}).then(()=>{
          setCurrentUser(user)
        })
      }
    })
  }

  const signOut = () => {

    editBin([])
    firebase.auth().signOut()
    setCurrentUser(null)
  }


  if (!isFontLoaded){
    return <AppLoading/>
  }else{
    //Main UI
    if (!isAuthUi){
      if(currentUser != null){
        //Logged in UI
        return(
          <View style={styles.container}>  
           {isBurgered?<View style={styles.menu}>
            <View style={[styles.profileCircle,{backgroundColor: "#D5ECC2"}]}/>
            <Text style={styles.profileName}>User: {currentUser.displayName}</Text>
            <Text style={styles.menuText} onPress={signOut}>Logout</Text>
            </View>:
            <View></View>}
            <View style={{flexDirection: "row",justifyContent:"space-between"}}>
              <View style={styles.head}><TouchableOpacity onPress={addBean}><View style={styles.circle}></View></TouchableOpacity>
                <Text style={styles.headText}>Add a bean</Text>
              </View>
              <TouchableOpacity onPress={HandleBurgerPressed}style={styles.burger}><View></View></TouchableOpacity> 
            </View>
            <FlatList contentContainerStyle={styles.beansContainer}
            data = {bins}
            renderItem = {({item})=><Bean title = {item.title} 
            id = {item.key} 
            description = {item.description} 
            updateHandler={UpdateBean} 
            deleteHandler = {DeleteBean} key = {item.key}
            tags = {item['tag']}
            />}
            extraData = {needRefresh}
            
            />
          </View>
        );
      }else{
        HandleLAuthUI()
      }
    }else{
      //Login UI
        return (
          <View>
            
            <AuthPage signInHandler={signIn} signUpHandler={signUp} escapeHandler = {HandleLAuthUI}/>
          </View>
        );
      
    }
    
  }
  
}


const styles = StyleSheet.create({
    container:{
      paddingTop: 30,
      backgroundColor: "#F2F4F6",
      height: "100%",
    },

    head:{
      flexDirection: "row",
      paddingTop: 42
    },

    burger:{
      backgroundColor: "#FFD3B4",
      width: 20,
      height: 20,
      position: "absolute",
      top: 47,
      right: 30,
      borderRadius: 30,
      zIndex: 5
    },


    circle:{
      width: 35,
      height: 35,
      borderRadius: 30,
      backgroundColor: "#FFAAA7",
      marginLeft: 30,
      marginRight: 18

    },
    headText:{
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center"
    },
    beansContainer:{
      alignItems: "center",
      width: "100%",
      paddingBottom: 400
    },

    menu:{
      backgroundColor:"#fff",
      position: "absolute",
      height: "25%",
      width: "100%",
      padding: 20,
      
      bottom: 0,
      alignItems: "center",
      justifyContent: "flex-start",
      zIndex:2,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 100},
      shadowRadius: 100,
      shadowOpacity: 10,
      elevation: 10
    },

    menuText:{
      fontWeight: "100",
      fontSize: 12,
    },

    profileName:{
      fontWeight: "bold",

    },

    profileCircle:{
      width: 50,
      height: 50,
      backgroundColor: "#F2F4F6",
      borderRadius: 30,
      margin: 20
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


    AlertWrapper:{
      backgroundColor: "#FFF",
      height: 200,

    },


    AlertText:{
      color: "#c30101"
    },

    AlertOK:{
      backgroundColor: "#FFAAA7"
    }

});
