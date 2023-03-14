import { useLayoutEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import rough from 'roughjs/bundled/rough.esm'
import { getStroke } from 'perfect-freehand'

import './DrawingBoard.css'

function DrawingBoard() {



    const [points, setPoints] = useState([])

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
        console.log(e);
        const canvas = document.getElementById('canvas');
        const bounds = canvas.getBoundingClientRect();

        e.target.setPointerCapture(e.pointerId)
        setPoints([[e.pageX - bounds.left - window.scrollX, e.pageY - bounds.top - window.scrollY, e.pressure]])
    }

    function handleMouseMove(e) {
        console.log(e)
        const canvas = document.getElementById('canvas');
        const bounds = canvas.getBoundingClientRect();
        if (e.buttons !== 1) return
        setPoints([...points, [e.pageX - bounds.left - window.scrollX, e.pageY - bounds.top - window.scrollY, e.pressure]])
    }

    function handleMouseUp(e){
        console.log("nosue up")
    }

    const stroke = getStroke(points, {
        size: 16,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
    })


    const handleClear = ()=>{
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    useLayoutEffect(()=>{


        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        const options = {
            size: 8
        }
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
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
        </canvas>
        <button onClick={handleClear}>Clear Canvas</button>
    </div>
  )
}

export default DrawingBoard
