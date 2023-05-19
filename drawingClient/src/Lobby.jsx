import { useState, useEffect, useRef } from 'react'
import { db } from './firebaseConfig'
import {collection,doc,onSnapshot,query,getDoc,setDoc,} from 'firebase/firestore'
import './Lobby.css'
import PlayerList from './PlayerList'
import DrawingBoard from './DrawingBoard'

function Lobby(props) {


    const [gameStarted, setGameStarted] = useState(false)

    const handleStartGame = async ()=>{

        //change the lobby flag for game started, this should make everyone in lobby switch state too
        const roomsCollectionRef = collection(db, "rooms");
        const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
        const roomSnapshot = await getDoc(roomsDocRef)

        if(roomSnapshot.exists()){

            const currentData = roomSnapshot.data()
            await setDoc(roomsDocRef,{
                members: currentData.members,
                gamemaster: currentData.gamemaster,
                round: 1,
                time: 60,
                inprogress: true
            })

        }else{
            alert("ERROR, room somehow doesn't exist...")
            return
        }


        //the above SHOULD trigger a onShapshot listener for all the other people in the lobby, and they change state to the drawingBoard too.

        //change state for our user maybe
        setGameStarted(true)

    }

    async function startGameListener(){
        const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {
          setGameStarted(doc.data().inprogress)
        });
    }

    //useeffect for the startgame listener
    useEffect(()=>{
        startGameListener();
      }, [])

    //useeffect for an unloading listener
    useEffect(() => {
        const handleBeforeUnload = async () => {
        
            //remove name from database
            const roomsCollectionRef = collection(db, "rooms");
            const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
            const roomSnapshot = await getDoc(roomsDocRef)

            if(roomSnapshot.exists()){

                //get index of user to be deleted
                const currentData = roomSnapshot.data()
                var index = currentData.members.indexOf(props.username);

                //the game ticks off of the gamemaster's clock, so we need to see if this person is the gamemaster. if so we need to pick a new one
                let gamemaster = currentData.gamemaster
                

                if (index !== -1) {
                    if(currentData.gamemaster == currentData.members[index]){
                        currentData.members.splice(index, 1);
                        if(currentData.members.length == 0){
                            console.log("No more members left... need to clean up")
                            return
                        }
                        gamemaster = currentData.members[0]
                    }else{
                        currentData.members.splice(index, 1);
                    }
                    
                }else{
                    return
                }
                
                
                
                await setDoc(roomsDocRef,{
                    members: currentData.members,
                    gamemaster: gamemaster,
                    round: currentData.round,
                    time: currentData.time,
                    inprogress: currentData.inprogress
                })

            }
            else{
                alert("ERROR, room somehow doesn't exist...")
                return
            }

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, []);
    

    return (

        gameStarted == false ? 
        
        <>
            <div className="lobby-container">
                <div className='lobby-header'>
                    <h1>Room: {props.roomCode}</h1>
                    <h2>Waiting for players to begin</h2>
                </div>
                <div className='lobby-playerlist'>
                    <PlayerList roomCode={props.roomCode}/>
                </div>
                <div>
                    <button onClick={handleStartGame}>Start Game!</button>
                </div>
            </div>
        </>

        :

        <>
            <PlayerList roomCode={props.roomCode} username={props.username}/>
            <DrawingBoard roomCode={props.roomCode} username={props.username}/>
        </>
        
    )
}

export default Lobby
