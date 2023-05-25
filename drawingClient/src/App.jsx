import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'
import {db} from './firebaseConfig'
import { collection, doc, onSnapshot, deleteDoc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import Lobby from './Lobby'

function App() {

  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [roomCode, setRoomCode] = useState("")
  const [codeLength, setCodeLength] = useState(0);
  const [username, setUsername] = useState("");

  const handleCodeChange = (e)=>{
      setRoomCode(e.target.value)
      setCodeLength(e.target.value.length)
  }
  const handleUsernameChange = (e)=>{
    setUsername(e.target.value)
  }

  const handleRoomCodeSubmit = async ()=>{
    //check if room code exists, if yes then join it, if no then create a room with this code
    console.log("Room code is: " + roomCode)
    if(username.length < 1){
      alert("Enter a username!");
      return
    }

    //roomsRef grabs the collection rooms and looks for the document with roomCode
    const roomsCollectionRef = collection(db, "rooms");
    const roomsDocRef = doc(roomsCollectionRef, roomCode)

    //roomSnapshot looks at a snapshot of roomsRef.
    const roomSnapshot = await getDoc(roomsDocRef)
    
    if(roomSnapshot.exists()){
      /*if it exists, add this member to the room list*/
     
      console.log("room exists already")
      
      //grab current data from this room
      const currentData = roomSnapshot.data();
      if(currentData.inprogress != false){
        alert("Game already in progress!")
        return
      }

      //set it to a copy of itself, just with the new member added
      await setDoc(roomsDocRef,{
        members: [...currentData.members, username],
        gamemaster: currentData.gamemaster,
        round: currentData.round,
        time: currentData.time,
        inprogress: currentData.inprogress
      })


    }else{

      /*if it doesn't exist, lets create it with the current player as it's only member*/
      console.log("room does not exist, creating it")
      await setDoc(roomsDocRef,{
        members: [username],
        gamemaster: username,
        round: 0,
        time: 60,
        inprogress: false

      })

    }
  setCodeSubmitted(true)
      
  }

  return (

    

    codeSubmitted==false ? 
    <>
      <div className='container'>
        <div className='title-container'>
          <h2>Enter a username and room code!</h2>
        </div>
      <div className='submission-container'>

        <input
        type="text"
        placeholder='USERNAME'
        value={username}
        onChange={handleUsernameChange}
        />
        <br></br>
        <input
        type="text"
        value={roomCode}
        placeholder='ROOMCODE'
        onChange={handleCodeChange}
        />
        <div className='submission-button'>
          {codeLength >= 6 ? <button onClick={handleRoomCodeSubmit}>Join Room</button> : <></>}
        </div>
        
        
      </div>
    </div>
  </> 
  :   
  <><div className="container-board">
    <Lobby roomCode={roomCode} username={username}/>
  </div></>

    
  )
}

export default App
