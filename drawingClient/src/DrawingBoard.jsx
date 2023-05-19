import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import rough from 'roughjs/bundled/rough.esm'
import { getStroke } from 'perfect-freehand'
import { AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'react-color';


import './DrawingBoard.css'

function DrawingBoard(props) {

    const [points, setPoints] = useState([])
    const [prevPoints, setPrevPoints] = useState([])
    const [totalPoints, setTotalPoints] = useState([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [individualStrokes, setIndividualStrokes] = useState([])
    const [currentDrawColor, setCurrentDrawColor] = useState("#000000");
    const [colorHistory, setColorHistory] = useState([]);

    const average = (a,b)=>{return (a+b)/2}
    function getSvgPathFromStroke(points, closed = true) {
      const len = points.length
    
      if (len < 4) {
        return ``
      }
    
      let a = points[0]
      let b = points[1]
      const c = points[2]
    
      let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(
        2
      )} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`
    
      for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i]
        b = points[i + 1]
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `
      }
    
      if (closed) {
        result += 'Z'
      }
    
      return result
    }

    function handleMouseDown(e) {
        const canvas = document.getElementById('canvas');
        const bounds = canvas.getBoundingClientRect();
        setIsDrawing(true)
        setPoints([[e.pageX - bounds.left - window.scrollX, e.pageY - bounds.top - window.scrollY, e.pressure]])

    }

    function handleMouseMove(e) {
        const canvas = document.getElementById('canvas');
        const bounds = canvas.getBoundingClientRect();
        if (!isDrawing) return
        setPoints([...points, [e.pageX - bounds.left - window.scrollX, e.pageY - bounds.top - window.scrollY, e.pressure]])

    }

    function handleMouseUp(e) {
        setIsDrawing(false)
        setTotalPoints([...totalPoints, ...points])
        setPrevPoints([...points])
        if(individualStrokes.length == 0){
          setIndividualStrokes(...[],[points])
          //setColorHistory(...[],[currentDrawColor])
          let colors = colorHistory;
          colors.push(currentDrawColor)
          setColorHistory(colors)
        }else{
          let test = individualStrokes
          test.push(points)
          setIndividualStrokes(test)
          let colors = colorHistory;
          colors.push(currentDrawColor)
          setColorHistory(colors)
        }

    }

    function handleClear() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setPoints([]);
        setPrevPoints([]);
        setTotalPoints([]);
        setIndividualStrokes([]);
        setColorHistory([]);

    }

    function handleUndo() {
          
      const newTotalPoints = totalPoints.slice(0, -prevPoints.length);
      const lastPoints = newTotalPoints.slice(-prevPoints.length);

      //dont set these it causes weird 
      //setPoints(lastPoints); //setting this causes useLayoutEffect which causes redraw and everything gets conencted
      //setPrevPoints(lastPoints);
      //setTotalPoints(newTotalPoints);
      
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const options = { size: 8 }
      
      if(individualStrokes.length == 0){
        handleClear();
      }

      for(let i = 0; i < individualStrokes.length-1; i++){
        const stroke = individualStrokes[i];
        const outlinePoints = getStroke(stroke, options)
        const pathData = getSvgPathFromStroke(outlinePoints)
        const myPath = new Path2D(pathData)
        ctx.fillStyle = colorHistory[i];
        ctx.fill(myPath)
      }


      setIndividualStrokes([...individualStrokes.slice(0,-1)])
      setColorHistory([...colorHistory.slice(0,-1)])
    }
  
    const handleKeydown=(e)=>{
      e.preventDefault();
      if( e.ctrlKey && e.code === 'KeyZ') {
          handleUndo();
            
      }
    }

    const handleColorChange=(c)=>{
      setCurrentDrawColor(c.hex);
    }

    useEffect(()=>{

      document.addEventListener("keydown", handleKeydown)

      return () => document.removeEventListener("keydown", handleKeydown);
    },[handleKeydown])

    useLayoutEffect(() => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext("2d");
      const options = { size: 8 }
      const outlinePoints = getStroke(points, options)
      const pathData = getSvgPathFromStroke(outlinePoints)
      const myPath = new Path2D(pathData)
      ctx.fillStyle = currentDrawColor;
      ctx.fill(myPath)

    }, [points])

    useEffect(() => {
      const handleBeforeUnload = async () => {
        
        //remove name from database
        const roomsCollectionRef = collection(db, "rooms");
        const roomsDocRef = doc(roomsCollectionRef, props.roomCode)
        const roomSnapshot = await getDoc(roomsDocRef)

        if(roomSnapshot.exists()){

            const currentData = roomSnapshot.data()
            var index = currentData.members.indexOf(props.username);
            let gamemaster = currentData.gamemaster
                

            if (index !== -1) {
                    
              if(currentData.gamemaster == currentData.members[index]){
                        
                currentData.members.splice(index, 1);
                        
                if(currentData.members.length == 0){
                  //TODO: CLEAN UP THE LOBBY IS IT'S DEAD!
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

        }else{
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
      <div className='container-board'>
        
        <div className='boardContainer'>
            <canvas
                id='canvas'
                className='canvas'
                width={window.innerWidth / 1.75}
                height={window.innerHeight / 1.5}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}>
            </canvas>
        </div>
        <div className='controls'>
            <button onClick={handleClear}>Clear Canvas</button>
            <button onClick={handleUndo}>Undo</button>
            {/*Sliderpicker or CirclePicker are the best */}
            <CirclePicker 
              color={currentDrawColor}
              colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#000000"]}
              onChangeComplete={handleColorChange}
            />
            
        </div>
      </div>
    )
}

export default DrawingBoard
