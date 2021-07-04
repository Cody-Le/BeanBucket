import React, {useState, Component, useEffect}from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native';
import Slider from "react-native-sliders"
import { Roboto_400Regular, useFonts} from '@expo-google-fonts/roboto';
import AppLoading from "expo-app-loading";

import Modal from 'react-native-modal'


function InnerBean(props){
    console.log()
    return(
        <View style={{backgroundColor:"#F2F4F6", width: "100%", padding: 20, marginBottom: 20, borderRadius: 15, justifyContent: "space-between", flexDirection:"row"}}>
            <Text style={{width: "80%"}}>{props.data[Object.keys(props.data)[0]]}</Text>
            <Text style={{fontWeight: "bold"}}>{Math.floor(props.data['score'] * 100)/100}</Text>
        </View>
    )
}


function AnalyzeWindow(props){
    const [loaded, setLoaded] = useState(false)
    const [data, setData] = useState({})
    const [sortedData, setList] = useState([])
    const [error, setError] = useState(false)


    const statStyle = StyleSheet.create({
        wrapper:{
            backgroundColor: "#fff",
            width:"90%",
            height: "95%",
            shadowColor: "#eeeeee",
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 1000,
            shadowOpacity: 10,
            elevation: 4,
            borderRadius:10,
            padding: 30
        }
    })

    const fetchStatistic = () =>{
        let query = props.query.replace(" ", "%20")
        
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
            
            
            try{
                setData(JSON.parse(xhttp.responseText))
            let res = JSON.parse(xhttp.responseText)
            let matchList = res['Match']
            
            for(var i = 0; i<matchList.length; i++){
                if (Object.keys(matchList[i])[0] == props.id){
                    
                    matchList.splice(i, 1)
                    break
                }
              
            }

            matchList.sort((first, second) =>{
                try{
                    if (first['score'] >= second['score']){
                        return 1
                    }else{
                        return -1
                    }
                }catch{
                    return 0
                }
            })

            if (matchList.length > 3){
                setList(matchList.splice(0,3))
            }else{
                setList(matchList)
            }
            
         
            setLoaded(true)
            }catch(e){
                console.log(e, xhttp.responseText)
                setError(true)
                props.offVisible()
                return(
                    <Modal visible={props.visible}>
                        <View style={statStyle.wrapper}>
                            <Text>xhttp.responseText</Text>
                            <TouchableOpacity onPress={props.offVisible} style={[style.circle3,{position:"absolute", right:0, margin: 10}]}><View></View></TouchableOpacity>
        
                        </View>
                    </Modal>
                )
            }
            
        }


        xhttp.open('GET', "https://beanbackend.herokuapp.com/search?query=" + query)
        xhttp.send()
    }
    
    useEffect(()=>{
        fetchStatistic()

    },[])

    if(loaded){
        return(
            <Modal visible={props.visible}>
                <View style={{justifyContent:"center", alignItems:"center", width:"100%", height:"100%", flex:1}}>
                    <View style={statStyle.wrapper}>
                        <View style={{alignItems:"center",height: "42%",justifyContent: "space-between"}} >
                            <Text style={{fontSize: 19, width: "90%", fontWeight: "700", textAlign: "center", paddingTop: 50}}>{props.query}</Text>
                            <View style={{alignItems:"center", paddingBottom: 20}}>
                            <Text style={{fontWeight:"bold", fontSize:25, paddingTop: 20, paddingBottom:20}}>{((Math.floor((5-data['logRM']) * 100))/100)}</Text>
                                <View style={{width: "100%", flexDirection:"row", alignItems:"center", justifyContent: "space-between"}}>
                                    <Text>0.0</Text>
                                    <Slider value={5 - data['logRM']} maximumValue={5} disabled={true} style={{width: "73%"}}/>
                                    <Text>5.0</Text>
                                </View>
                               
                            </View>
                            
                            
                        </View>
                        <View>
                            <Text style={{padding: 20, fontWeight: "bold", textAlign: "center", fontSize: 16}}>Similar Beans</Text>
                            <FlatList
                            data = {sortedData}
                            renderItem={({item}) => <InnerBean data = {item}/>}
                            
                            />
                        </View>
                        <TouchableOpacity onPress={props.offVisible} style={[style.circle3,{position:"absolute", right:0, margin: 10}]}><View></View></TouchableOpacity>
                        <Text style={{padding:10, textAlign: "center", width: "100%",color: "#aaa", fontWeight: "bold"}}>The higher the more unique</Text>
                    </View>
                </View>
            </Modal>
        )
    }else{
        return(
            <Modal visible={props.visible}>
                <Modal visible={props.visible}>
                    <View style={{justifyContent:"center", alignItems:"center", width:"100%", height:"100%", flex:1}}>
                        <View style={statStyle.wrapper}>
                            
                            <View>
                                <Text>Loading</Text>
                                <TouchableOpacity onPress={props.offVisible} style={[style.circle3,{position:"absolute", right:0, margin: 10}]}><View></View></TouchableOpacity>
                            </View>
                            <View>
            
                            </View>
                        </View>
                    </View>
                </Modal>
            </Modal>
        )
    }
}






function Tag(props){

   


    let [analyzing, setAnalyzeState] = useState(false)
    let color = ""
    let text = ""

    if (props.data['type'] == 1){
        text = props.data['value']?"public":"private"
        color = props.data['value']?"#98DDCA":"#FFAAA7"
    }
    else{
        text = "analyze"
        color = "#C7DDFF"
    }
    
    const changeColor = () =>{
        props.handleStateChange()
    }
    
    const setAnalyze = () =>{
        setAnalyzeState(!analyzing)
    }



    const tap = () =>{
        if (props.data["type"] == 0){
                
                setAnalyze()
        }else if(props.data["type"] == 1){
            //private public processing
            
            changeColor()
           
                    
        }else{
                //General functionless tag
        }
    }

    if(props.expand == true){
        return(
            <View>
                <AnalyzeWindow visible={analyzing} offVisible={setAnalyze} query ={props.title} id={props.id}/>
                <TouchableOpacity onPress = {tap}>
                    <View style={[style.tag, {width: 54, height: 22, alignItems: 'center', justifyContent: 'center', backgroundColor:color}]}>
                        <Text style={{fontSize:10, color: "#888"}}>{text}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }else{
        return(
            <View style={[style.tag, {backgroundColor:color}]}></View>
        );
    }

}



export default function Bean(props){
    let [fontLoaded] = useFonts({
        Roboto_400Regular
    })
    let tag =  props.tags
    let value = tag[0]['value']


    const [isEditTitle, setTitleState] = useState(false)
    const [isEditDescription, setEditDescription] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [isOpenDetail, setOpenDetail] = useState (false)
    const [deletePopUp, setPopUp] = useState(false)
    
    
    
    const handleTagStateChange = () =>{
        
      
        props.updateHandler(props.id,title,description, value)
        
        

    }


    const HandleCloseInput = () =>{
        if (isEditTitle){
            props.updateHandler(props.id,title,description,  value)
        }
        setTitleState(!isEditTitle)
    
    }


    const HandleCloseDescription = () =>{
        
        if (isEditDescription){
            props.updateHandler(props.id,title,description,  value)
            setEditDescription(false)
        }else{
            setEditDescription(true)
        }
    }

    const HandleTitleInput = (text) =>{
        
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
                    <View style={style.tagWrapper}>
                        <Tag data = {tag[0]} expand = {true} handleStateChange = {handleTagStateChange} title = {title} id={props.id}/>
                        <Tag data = {tag[1]} expand = {true} handleStateChange = {handleTagStateChange} title = {title} id={props.id}/>
                    </View>
                    <View style={style.descriptionWrapper}>
                        {isEditDescription?<TextInput style={style.description} 
                        autoFocus
                        numberOFLines={5}
                        onBlur={HandleCloseDescription} 
                        onChangeText={(text)=>{HandleDescriptionInput(text)}}
                        multiline = {true}
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
                    <View style={style.tagWrapper}>
                        <Tag data = {tag[0]} expand = {false} handleStateChange = {handleTagStateChange} title = {title}/>
                        <Tag data = {tag[1]} expand = {false} handleStateChange = {handleTagStateChange} title = {title}/>
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
        maxHeight: 400,
        maxWidth: 400
    },
    beanHead:{
        justifyContent: "space-between",
        flexDirection: "row"
    },
    title:{
        paddingLeft: 20,
        fontSize: 15,
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
        maxWidth: "90%",
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
    },

    tagWrapper:{
        margin: 5,
        paddingLeft: 10,
        flexDirection: "row"
    },

    tag: {
        backgroundColor: "#EEE",
        height: 8,
        width: 30,
        borderRadius:6,
        marginRight: 5
    }




})