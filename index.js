const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// global variables for initial coniguration
const controls = {
  up:['w','ArrowUp'],
  down:['s','ArrowDown'],
  right:['d','ArrowRight'],
  left:['a','ArrowLeft'],
}
const colors = {
  dark:'#211e20',
  primary:'#a0a08b',
  secondary:'#555568',
  light:'#e9efec',
}
const width = 500
const height = 500
canvas.width = width
canvas.height = height

const snakePartSize = 40
const TPS = 1 

const directionsToVector = {
  up:{x:0,y:-1},
  down:{x:0,y:1},
  right:{x:1,y:0},
  left:{x:-1,y:0}
}
let currentDirection = directionsToVector.up

// inputs
window.addEventListener('keydown',(event)=>{
  const {key} = event
  Object.entries(controls).forEach(ent=>{
    const direction = ent[0]
    const inputs = ent[1]
    inputs.forEach(input =>{
      if(input === key){
        const newDirection = directionsToVector[direction]
        const xcom = currentDirection.x * newDirection.x 
        const ycom = currentDirection.y * newDirection.y
        // avoid going in reverse
        if(xcom === 0 && ycom === 0){
          currentDirection = newDirection
        }
      }
    })
  })
})

// activation area
const head = {
  x: (width/2)-(snakePartSize/2),
  y: (height/2)-(snakePartSize/2)
}
const snake = [head]
setUpSnake(3)
startTimer(TPS)


function tick(){
  //clean last
  ctx.clearRect(0,0,width,height)

  moveHead() 
  // moveSnakeParts()
  
  snake.forEach(part=>{
    // render
    ctx.fillStyle = colors.primary
    ctx.fillRect(part.x,part.y,snakePartSize,snakePartSize) 
  })  
}

function moveSnakeParts(){
  for (let i = snake.length; i > 0; i--) {    
    console.log(i)
    const part = snake[i] 
    part.x = snake[i-1].x
    part.y = snake[i-1].y
  }
}

function moveHead(){   
  head.x += currentDirection.x * snakePartSize     
  head.y += currentDirection.y * snakePartSize   
}

function setUpSnake(initialSize){
  for (let i = 1; i <= initialSize-1; i++) {
    const posX = head.x + ((currentDirection.x * -1) * (i*snakePartSize))
    const posY = head.y + ((currentDirection.y * -1) * (i*snakePartSize))
    growSnake(posX,posY) 
  }
}

function growSnake(posX,posY){
  const newPart = {x:posX,y:posY}
  const lastPart = snake[snake.length-1]
  if(!posX && !posY){
    newPart.x = lastPart.x 
    newPart.y = lastPart.y
  } 
  snake.push(newPart)
}

// internal clock
function startTimer(ticksPerSecond){
  const delay = 1000/ticksPerSecond 
  timer(delay,delay)
}

function timer(timeDelay, initialDelay){
  tick()
  //precise clock
  const beforeWaiting = Date.now()  
  setTimeout(()=>{
    const realTimeElapsed = Date.now() - beforeWaiting
    const diff = realTimeElapsed - timeDelay 
    const ajustedDelay = initialDelay - diff
    timer(ajustedDelay, initialDelay)
  },timeDelay)
}
