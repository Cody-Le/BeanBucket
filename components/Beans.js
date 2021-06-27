import React, {useState, Component}from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Roboto_400Regular, useFonts} from '@expo-google-fonts/roboto';
import AppLoading from "expo-app-loading";

import Modal from 'react-native-modal'

export default function Bean(props){
    let [fontLoaded] = useFonts({
        Roboto_400Regular
    })


    const [isEditTitle, setTitleState] = useState(false)
    const [isEditDescription, setEditDescription] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [isOpenDetail, setOpenDetail] = useState (false)
    const [deletePopUp, setPopUp] = useState(false)



    const HandleCloseInput = () =>{
        console.log(isEditTitle)
        if (isEditTitle){
            props.updateHandler(props.id,title,description)
        }
        setTitleState(!isEditTitle)
    
    }


    const HandleCloseDescription = () =>{
        setEditDescription(!isEditDescription)
        if (isEditDescription){
            props.updateHandler(props.id,title,description)
        }
        props.updateHandler(props.id,title,description)
    }

    const HandleTitleInput = (text) =>{
        console.log(text)
        setTitle(text)
    }

    const HandleDescriptionInput = (text) =>{
        setDescription(text)
    }

    const HandleOpenDetail = () =>{
        setOpenDetail(!isOpenDetail)
    }

    const HandleCancel = () =>{
        setPopUp(!deletePopUp)
    }

    const HandleDelete = () =>{
        props.deleteHandler(props.id)
    }



    if (!fontLoaded){
        return <View style={style.beanWrapper}></View>
    }else{
        if (isOpenDetail){
            return(
                <View style={style.beanWrapper}>
                    <Modal isVisible={deletePopUp}>
                        <View style={style.beanWrapper}>
                        <Text>Are you sure?</Text>
                        <View style={{flexDirection:"row", justifyContent: "center"}}>
                            <TouchableOpacity onPress={HandleDelete}><View style={[style.button,{backgroundColor: "#FFAAA7"}]}><Text>Yes</Text></View></TouchableOpacity>
                            <TouchableOpacity onPress={HandleCancel}><View style={style.button}><Text>No</Text></View></TouchableOpacity>
                        </View>
                        </View>
                    </Modal>
                    <View style={style.beanHead}>
                        {isEditTitle?<TextInput style={style.title} 
                        autoFocus
                        onBlur={HandleCloseInput} 
                        onChangeText={(text)=>{HandleTitleInput(text)}}
                        value = {title}
                        />
                        :<Text style={style.title} onPress={HandleCloseInput}>{title} </Text>}
                        <TouchableOpacity onPress = {HandleOpenDetail}><View style={style.circle} ></View></TouchableOpacity>  
                    </View>
                    <View style={style.descriptionWrapper}>
                        {isEditDescription?<TextInput style={style.description} 
                        autoFocus
                        numberOFLines={5}
                        onBlur={HandleCloseDescription} 
                        onChangeText={(text)=>{HandleDescriptionInput(text)}}
                        value = {description}
                        />
                        :<Text style={style.description} onPress={HandleCloseDescription} numberOFLines={10}>{description} </Text>}
                        <TouchableOpacity onPress = {HandleCancel}><View style={style.deleteWrapper}><View style={ style.circle3}/></View></TouchableOpacity>   
                    </View>
                </View>
                
            );
        }else{
            return(
                <View style={style.beanWrapper}>
                    <View style={style.beanHead}>
                        {isEditTitle?<TextInput style={style.title} 
                        autoFocus
                        onBlur={HandleCloseInput} 
                        onChangeText={(text)=>{HandleTitleInput(text)}}
                        value = {title}
                        />
                        :<Text style={style.title} onPress={HandleCloseInput}>{title} </Text>}
                        <TouchableOpacity onPress = {HandleOpenDetail}><View style={[style.circle, style.circle2]} ></View></TouchableOpacity>  
                    </View>
                </View>
            );
        }
    }
    
}


const style = StyleSheet.create({
    beanWrapper:{
        backgroundColor: "#FFFFFF",
        width: "100%",
        padding: 20,
        borderRadius:22,
        marginTop: 20,
        maxHeight: 400
    },
    beanHead:{
        justifyContent: "space-between",
        flexDirection: "row"
    },
    title:{
        paddingLeft: 20,
        fontSize: 20,
        width: "80%",
        fontWeight: "bold"
        
    },
    circle:{
        backgroundColor: "#C4E1D9",
        width: 30,
        height: 30,
        borderRadius: 30
    },
    circle2:{
        backgroundColor: "#98DDCA"
    },

    circle3:{
        backgroundColor: "#FFAAA7",
        width: 20,
        height: 20,
        borderRadius: 30
    },

    button:{
        marginTop: 10,
        borderRadius: 10,
        width: 100,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },


    descriptionWrapper:{
        marginTop: 15,
        backgroundColor: "#F2F4F6",
        height: "80%",
        borderRadius: 22,
        padding: 20,
        justifyContent: "space-between"
    },
    description:{
        width: "80%",
        color: "#747474"
    },


    deleteWrapper:{
        width: "100%",
        height: "10%",
        alignItems: "flex-end"
    }




})