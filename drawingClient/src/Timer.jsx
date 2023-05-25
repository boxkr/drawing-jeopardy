import { useState, useEffect, useRef } from 'react';
import { db } from './firebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import './Timer.css';

function Timer(props) {
  const [time, setTime] = useState(60.0);
  const isGameMasterRef = useRef(props.isGameMaster);

  async function timerFunction() {
    const isgm = isGameMasterRef.current;
    const roomsCollectionRef = collection(db, 'rooms');
    const roomsDocRef = doc(roomsCollectionRef, props.roomCode);
    const roomSnapshot = await getDoc(roomsDocRef);

    console.log(isgm, props.isGameMaster);

    if (roomSnapshot.exists()) {
      const currentData = roomSnapshot.data();

      if(currentData.time == 0){
        //it's the end of the round, reset the round and change inprogress to VIEWING
        await setDoc(roomsDocRef, {
          members: currentData.members,
          gamemaster: currentData.gamemaster,
          round: currentData.round,
          time: currentData.time - 1,
          inprogress: "viewing"
        });
        return;
      }
      if (isgm) {
        await setDoc(roomsDocRef, {
          members: currentData.members,
          gamemaster: currentData.gamemaster,
          round: currentData.round,
          time: currentData.time - 1,
          inprogress: currentData.inprogress
        });
        setTime(currentData.time - 1);
      }else{
        setTime(currentData.time);
      }
    }else {
      alert('Room somehow doesn\'t exist');
      return;
    }
  }

  useEffect(() => {
    isGameMasterRef.current = props.isGameMaster;
  }, [props.isGameMaster]);

  useEffect(() => {
    const interval = setInterval(timerFunction, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-timer">
      <h4>{props.isGameMaster ? 't' : 'f'}</h4>
      <h3>{time}</h3>
    </div>
  );
}

export default Timer;
