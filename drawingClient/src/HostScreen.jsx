import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'
import {db} from './firebaseConfig'
import { collection, doc, onSnapshot, deleteDoc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import Lobby from './Lobby'

function HostScreen(props) {

    const [roundChange, setRoundChange] = useState(0)

    async function listenForRoundEnd(){
        const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {

            //listening for round change
            setRoundChange(doc.data().round);

            //go to viewing screen


        });
      }
    
    
    useEffect(()=>{
        listenForRoundEnd();
    }, [])

    return (
        <div>
            <h1>You are the host!</h1>
            <h2>Waiting for this round to end...</h2>
        </div>
    )

}

export default HostScreen
