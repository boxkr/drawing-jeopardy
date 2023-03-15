import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import rough from 'roughjs/bundled/rough.esm'
import { getStroke } from 'perfect-freehand'

import './DrawingBoard.css'

function DrawingBoard() {

    const [points, setPoints] = useState([])
    const [prevPoints, setPrevPoints] = useState([])
    const [totalPoints, setTotalPoints] = useState([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [individualStrokes, setIndividualStrokes] = useState([])

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
        }else{
          let test = individualStrokes
          test.push(points)
          setIndividualStrokes(test)
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
        
        ctx.fill(myPath)
      }


      setIndividualStrokes([...individualStrokes.slice(0,-1)])
    }
  
    const handleKeydown=(e)=>{
      e.preventDefault();
      if( e.ctrlKey && e.code === 'KeyZ') {
          console.log("undo fire",e)
          handleUndo();
            
      }
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
      ctx.fill(myPath)

    }, [points])

    return (
        <div className='boardContainer'>
            <canvas
                id='canvas'
                className='canvas'
                width={window.innerWidth / 1.25}
                height={window.innerHeight / 1.5}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}>
            </canvas>
            <button onClick={handleClear}>Clear Canvas</button>
            <button onClick={handleUndo}>Undo</button>
        </div>
    )
}

export default DrawingBoard
