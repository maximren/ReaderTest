const express = require('express');
const app = express();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort("COM4", {
    baudRate: 19200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    // autoOpen: false
})

const parser = new Readline();
port.pipe(parser);

SerialPort.list().then(port => console.log(port))

parser.on('data', data => console.log(data));

const buffer = new Buffer.alloc(11, [11, 4,  1, 0x10, 0], 'hex');

port.on("open", () => console.log('port is open', port.baudRate))
port.on('data', (data) => console.log(data))
port.on('readable', () => console.log('Read: ', port.read()));
port.on('error', (err) => {
    console.log(err)
});

const frame = new Uint8Array(Buffer.from(buffer), 0, 13);

port.write(frame, async(err, bytesWritten) => {
    console.log(frame)
    console.log(err, bytesWritten);
    console.log("calbackErr", err);
    console.log("bytesWritten", bytesWritten);
})

port.on('data', (data) => console.log(data))
port.on('close', () => console.log('closed')) 
port.on('err', err => console.log(err))



// app.get('/', (req, res) => {
//     res.send('Hello')
// })

// app.listen(3000, () => console.log(`listening on port 3000`));