import { NovaEngine } from "./engine/nova-engine"
import { WebSocket } from 'ws'

console.log(`Welcome to`)
console.log(` _   _  ______      __     
| \\ | |/ __ \\ \\    / /      
|  \\| | |  | \\ \\  / /  \\   
| . \` | |  | |\\ \\/ / _\\ \\  
| |\\  | |__| | \\  / ____ \\     
|_| \\_|\\____/   \\/ /    \\_\\  - Dedicated Game Server               
`)

console.log('Using Node.js version 20 (Bullseye)')

NovaEngine.start()

const wss = new WebSocket.Server({ port: 80 })

wss.on('connection', (ws) => {
    console.log('New client connected')

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`)
        if (message.toString() == 'Hello, there!') {
            ws.send('General Kenobi...')
        }
    })
})