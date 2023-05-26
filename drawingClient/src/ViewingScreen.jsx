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
        const urls = await fetchPictures();
        setImageUrls(urls)
        console.log(urls)

    }
    
    useEffect(()=>{
        listenForViewingEnd();
        gatherUserPictures();
    }, [])

    return (
        <div className='container-viewing'>
            <h1>Viewing players "artwork"</h1>
                {imageUrls.map((url) => (
                    <div key={url}>
                        <img src={url} />
                    </div>
                ))}
            
        </div>
    )

}

export default ViewingScreen
