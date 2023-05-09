import { useState, useEffect, useRef } from 'react'
import { db } from './firebaseConfig'
import {collection,doc,onSnapshot,query,getDoc,setDoc,} from 'firebase/firestore'
import './PlayerList.css'

function PlayerList(props) {

  const [members, setMembers] = useState([])
  const [loading, setloading] = useState(false);

  async function getMembers(){
    const unsub = onSnapshot(doc(db, 'rooms', props.roomCode), (doc) => {
      setMembers(doc.data().members);
    });
  }


  useEffect(()=>{
    getMembers();
  }, [])


  return (
    <div className="container-playerlist">
      <ul>
        {members.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default PlayerList
