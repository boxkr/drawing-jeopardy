import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'
import {db} from './firebaseConfig'
import { collection, doc, onSnapshot, deleteDoc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import Lobby from './Lobby'
import Timer from './Timer'
import ViewingScreen from './ViewingScreen'

function HostScreen(props) {

    const [roundChange, setRoundChange] = useState(true)
    const [gameBoard, setGameBoard] = useState([])

    async function listenForRoundEnd(){
        const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {

            const currentData = doc.data()
            //listening for round change
            if(currentData.inprogress != "viewing"){
                return;
            }else{
                setRoundChange(currentData.inprogress)
            }

            //go to viewing screen


        });
      }
    
    async function getGameBoard(){

        const roomsCollectionRef = collection(db, "rooms");
        const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
        const roomSnapshot = await getDoc(roomsDocRef)
        
        if(roomSnapshot.exists()){
            const currentData = roomSnapshot.data()
            console.log(currentData.gameboard)
            setGameBoard(currentData.gameboard)

        }else{
            alert("Room somehow doesn't exist")
        }
    }
    useEffect(()=>{
        console.log("heya")
        getGameBoard();
        listenForRoundEnd();

    }, [])

    return (
        
        (roundChange == true) ?
        <div>
            <h1>You are the host!</h1>
            <h2>Waiting for this round to end...</h2>
            <Timer isGameMaster={true} roomCode={props.roomCode} username={props.username}/>
            <div>
                <table>
                    <thead>
                    <tr>
                        {/*gameBoard.headers.map((item, index) => {
                        return <th>{item}</th>;
                        })*/}
                    </tr>
                    </thead>
                    <tbody>
                    {/*gameBoard.map((item, index) => {
                        return (
                            <tr>
                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                                <td>{item[2]}</td>
                                <td>{item[3]}</td>
                                <td>{item[4]}</td>
                                <td>{item[5]}</td>
                            </tr>
                        );
                    })*/}
                    </tbody>
                </table>
            </div>
        </div> 
        :
        <>
            <ViewingScreen roomCode={props.roomCode} username={props.username} isGameMaster={props.isGameMaster}/>
        </>
        
    )

}

export default HostScreen
