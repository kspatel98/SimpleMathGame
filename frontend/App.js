// StAuth10244: I Kartik Patel, 000839320 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
import { Button, Linking, StyleSheet, Text, TextInput, View } from 'react-native';
import React,{useState} from 'react';
import axios, * as others from 'axios';
export default function App() {
  const[username,setUsername]=useState("");
  const[password,setPassword]=useState("");
  const[cPassword,setCPassword]=useState("");
  const[component,setComponent]=useState("Login");
  const[alert,setAlert]=useState("");
  const[colour,setColour]=useState("");
  const[islogged,setIsLogged]=useState(false);
  const[numbers,setNumbers]=useState("");
  const[ans,setAns]=useState(0);
  const[userans,setUserAns]=useState(0);
  const[status,setStatus]=useState("");
  const[score,setScore]=useState(0);
  let num1=0,num2=0;

function random()
{
  num1=Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  num2=Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  setNumbers(num1+" + "+num2);
  setStatus("");
  setAns(num1+num2);
}
  const register=()=>{
    axios.post("http://localhost:3000/register",{'username':username,'password':password,'cpassword':cPassword})
    .then((response)=>{
      console.log(response);
      if(response.data=="error:null")
      {
        setAlert("User has been registered successfully.");
        setColour("green");
      }
      else if(response.data=="registered")
      {
        setAlert("This account has already been registered!");
        setColour("red");
      }
      else if(response.data=="username taken")
      {
        setAlert("This username is already taken! Try other username");
        setColour("red");
      }
      else if(response.data=="does not match")
      {
        setAlert("Password and Confirm Password does not match..");
        setColour("red");
      }
      else if(response.data=="null input")
      {
        setAlert("Input fields can not be null. All fields are required..");
        setColour("red");
      }
      else
      {
        setAlert(response);
        setColour("red");
      }
    });
  };

  const validate=()=>{
    axios.post("http://localhost:3000/login",{'username':username,'password':password})
     .then((response)=>{
       console.log(response.data[0]);
       if(response.data[0]=="Incorrect username and/or password!")
       {
         setAlert(response.data[0]);
         setColour("red");
       }
       else if(response.data=="null input")
      {
        setAlert("Input fields can not be null. All fields are required..");
        setColour("red");
      }
       else{
         setAlert("User has been logged in successfully.");
         setColour("green");
         setIsLogged(true);
         setScore(response.data[1]);
       }
     });
 };
 function check()
 {
  if(userans==ans)
  {
    if(status=="" || status=="Wrong!")
    {
    setStatus("Correct");
    axios.post("http://localhost:3000/score",{'score':10})
     .then((response)=>{
       console.log(response.data.num);
       setScore(parseInt(response.data.num));
     });
    }
  }
  else{
    setStatus("Wrong!");
  }
 }

  return (
    
    (islogged==false) ?
    (
     (component=="Login")?( 
    <View style={styles.container}>
    <View style={styles.login}>
      <Text style={styles.heading}>Log-In</Text>
      <View style={{display:'inline',padding:10}}>
    <label>Username:</label><TextInput placeholder='Username' onChangeText={userName=>setUsername(userName)} style={{border:'2px solid black',borderRadius:15,paddingLeft:5,marginLeft:5}} />
    </View>
    <View style={{display:'inline',padding:10}}>
    <label>Password:</label><TextInput secureTextEntry='true' onChangeText={passWord=>setPassword(passWord)} placeholder='Password' style={{border:'2px solid black',borderRadius:15,paddingLeft:5,marginLeft:5}}  />
    </View>
    <Text style={{color:colour}}>{alert}</Text>
    <Button title='Log-In' onPress={validate} style={{padding:5}} />
    <Text style={{textAlign:'center'}}>OR</Text>
    <Button title='Sign-Up' onPress={()=>{setAlert("");setUsername("");setPassword("");setComponent("Signup")}} style={{padding:5}}/>
    </View>
  </View>
     ):(
      <View style={styles.container}>
    <View style={styles.login}>
      <Text style={styles.heading}>Sign-Up</Text>
      <View style={{display:'inline',padding:10}}>
    <label>Username:</label><TextInput placeholder='Username' onChangeText={userName=>setUsername(userName)} style={{border:'2px solid black',borderRadius:15,paddingLeft:5,marginLeft:5}} />
    </View>
    <View style={{display:'inline',padding:10}}>
    <label>Password:</label><TextInput secureTextEntry='true' onChangeText={passWord=>setPassword(passWord)} placeholder='Password' style={{border:'2px solid black',borderRadius:15,paddingLeft:5,marginLeft:5}}  />
    </View>
    <View style={{display:'inline',padding:10}}>
    <label>Confirm Password:</label><TextInput secureTextEntry='true' onChangeText={cPassWord=>setCPassword(cPassWord)} placeholder='Confirm Password' style={{border:'2px solid black',borderRadius:15,paddingLeft:5,marginLeft:5}}  />
    </View>
    <Text style={{color:colour}}>{alert}</Text>
    <Button title='Sign-Up' onPress={register} style={{padding:5}}/>
    <Text style={{textAlign:'center'}}>OR</Text>
    <Button title='Log-In' onPress={()=>{setAlert("");setUsername("");setPassword("");setComponent("Login");}} style={{padding:5}} />
    </View>
  </View>
     )
    ):(<View style={[styles.container,{border:'2px solid black',margin:50}]}>
      <Text style={styles.heading}>Welcome {username}</Text>
      <Text style={styles.heading}>{score}</Text>
    
      <View>
        <Button title='Start the game' onPress={random}></Button>
        <Text>{numbers}</Text> 
        <TextInput style={{border:"2px solid black",margin:5}} onChangeText={text=>setUserAns(parseInt(text))}/>
        <Text>{status}</Text>
        <Button title='Check the answer' onPress={check} ></Button>

        <Text>Press Start the game button for next question or start the game.</Text>
      </View>
    </View>)

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login:{
    backgroundColor: 'lightgreen',
    alignItems: 'left',
    justifyContent: 'center',
    border:'2px solid black',
    padding:100
  },
  heading:{
    fontSize:'40px',
    fontWeight:'bold',
    marginBottom:40,
    textAlign:'center'
  },

});