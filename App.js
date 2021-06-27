import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from "expo-app-loading";
import Bean from "./components/Beans.js"


export default function App() {
  let[isFontLoaded] = useFonts({
    Roboto_400Regular
  })


  var bin = []


  let [bins, editBin] = useState(bin)
  let [needRefresh, setRefreshNeed] = useState(false)

  

  const addBean = () => {
    console.log( Math.random() * 1000)
    let bin2 = bins
    
    bin2.push({key: Math.floor(Math.random() * 1000).toString(), title: "bean", description: "Add a description"})
    editBin(bin2)
    bin = bins
    setRefreshNeed(!needRefresh)
  
  }

  const UpdateBean = (key, title, description) =>{
    let index = bins.findIndex((item)=>{return item.key == key;})
    bin[index] = {key:key, title: title, description: description}
    console.log(bin[index])
    editBin(bin)
    setRefreshNeed(!needRefresh)
  }

  if (!isFontLoaded){
    return <AppLoading/>
  }else{
    
    return (
      <View style={styles.container}>  
        <View style={styles.head}>
          <TouchableOpacity onPress={addBean}><View style={styles.circle}></View></TouchableOpacity>
          <Text style={styles.headText}>Add a bean</Text>
        </View>
        <FlatList contentContainerStyle={styles.beansContainer}
        data = {bins}
        renderItem = {({item})=><Bean title = {item.title} key = {item.key} description = {item.description} updateHandler={UpdateBean} key = {item.key}/>}
        extraData = {needRefresh}
        
        />
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

    head:{
      flexDirection: "row",
      paddingTop: 42
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

});
