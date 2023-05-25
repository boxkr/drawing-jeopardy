import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'
import {db} from './firebaseConfig'
import { collection, doc, onSnapshot, deleteDoc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import Lobby from './Lobby'

function ViewingScreen(props) {

    const [roundChange, setRoundChange] = useState(0)

    async function listenForViewingEnd(){
        const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {

            //listening for viewing over
            setRoundChange(doc.data().inprogress);

            //go to hostscreen if host, go to drawingboard if not host
            

        });
    }


    
    
    useEffect(()=>{
        listenForViewingEnd();
    }, [])

    return (
        <div>
            <h1>Viewing players "artwork"</h1>
            
        </div>
    )

}

export default ViewingScreen
