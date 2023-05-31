import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'
import {db} from './firebaseConfig'
import {storage} from './firebaseConfig'
import { collection, doc, onSnapshot, deleteDoc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import Lobby from './Lobby'
import { ref, list, listAll, getDownloadURL } from "firebase/storage"
import {Carousel} from 'react-responsive-carousel'
import HostScreen from './HostScreen'


function ViewingScreen(props) {

    const [roundChange, setRoundChange] = useState(0);
    const [imageUrls, setImageUrls] = useState([]);

    async function listenForViewingEnd(){
        const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {

            //listening for viewing over
            setRoundChange(doc.data().inprogress);

            //go to hostscreen if host, go to drawingboard if not host
            

        });
    }


    //on loading, get all of the images starting with the roomCode, and display them on screen
    //the jeopardy host can choose a winner and a score will be plussed for that person. This sets the viewing state and it goes back to the next topic
    
    async function tellUsersToView(){
        const roomsCollectionRef = collection(db, "rooms");
        const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
        const roomSnapshot = await getDoc(roomsDocRef)
        const currentData = roomSnapshot.data()
        await setDoc(roomsDocRef,{
            members: currentData.members,
            gamemaster: currentData.gamemaster,
            round: currentData.round,
            time: -100,
            inprogress: "viewing",
            points: currentData.points,
            gameboard: currentData.gameboard
        })



    }

    async function fetchPictures(){
        console.log(props.roomCode)
        
        const storageRef = ref(storage, `${props.roomCode}/`);
        const result = await listAll(storageRef);
        console.log(result)
        const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
        return Promise.all(urlPromises);
    }

    async function gatherUserPictures(){
        await setTimeout(null,3000); //need to wait for everything to upload, think that's causing an issue where we only get one
        let depth = 1
        let urls = await fetchPictures();
        if(urls.length == 0){

            while(urls.length == 0 || depth > 10){
                depth+=1
                await setTimeout(null,3000);
                urls = await fetchPictures();
                console.log("AHHHH")
            }
            
        }

        tellUsersToView();
        setImageUrls(urls)
        console.log(urls)

    }

    async function handlePictureClick(e){

        //check to make sure we are game master, if not do nothing
        console.log("PROPS:",props)
        if(!props.isGameMaster){
            return
        }
        
        //are you sure you want to choose this one?
            //yes --> add a point to the player who's drawing it is
            //no --> do nothing
        if(window.confirm("Are you sure you want to choose this picture as the winner?")){

            //get drawing URL, extract the player's name
            const storageRef = ref(storage, e.target.src);
            const winnerName = storageRef.name;
            alert(`You have chosen ${winnerName} to be the winner !`)


            //add a point to this player
            const roomsCollectionRef = collection(db, "rooms");
            const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
            const roomSnapshot = await getDoc(roomsDocRef)

            const currentData = roomSnapshot.data()
            alert(currentData.points[winnerName])
            currentData.points[winnerName]+=1
            

            //if last round, show ending screen,else start a new round
            if(currentData.round == 3){
                //render ending screen with total points

            }else{

                //update new points object and new round in db
                await setDoc(roomsDocRef,{
                    members: currentData.members,
                    gamemaster: currentData.gamemaster,
                    round: currentData.round + 1,
                    time: 60,
                    inprogress: true,
                    points: currentData.points,
                    gameboard: currentData.gameboard
                })
            }

        }else{
            return
        }
        
    }
    
    useEffect(()=>{
        listenForViewingEnd();
        gatherUserPictures();
    }, [])

    return (

        (roundChange == "viewing") ? 
        <div className='container-viewing'>
            {(props.isGameMaster) ? <p>t</p> : <>f</>}
            <h1>Viewing players "artwork"</h1>
                <div>
                    {imageUrls.map((url) => (
                        <div key={url}>
                            <img onClick={handlePictureClick} src={url} />
                        </div>
                    ))}
                </div>
        </div>
        :

        
        <>
            { (props.isGameMaster == true) ? 
            
                <HostScreen roomCode={props.roomCode} username={props.username} isGameMaster={props.isGameMaster}/>
                :
                <DrawingBoard roomCode={props.roomCode} username={props.username} isGameMaster={props.isGameMaster}/>
            }
            
        </>
    )

}

export default ViewingScreen
