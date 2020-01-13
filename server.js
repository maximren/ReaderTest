const express = require('express');
const app = express();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const crc = require('crc');

const port = new SerialPort("COM4", {
    baudRate: 19200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    // autoOpen: false
})

const parser = SerialPort.parsers.Readline;
port.pipe(parser);

// SerialPort.list().then(port => console.log(port))

parser.on('data', data => console.log(data));
port.write("kdkdk", null, (err) => console.log('err', err));

const buffer = new Buffer.alloc(11, [11, 4,  1, 0x10, 0]);

port.on("open", () => console.log('port is open', port.baudRate))
port.on('data', (data) => console.log(data))
port.on('readable', () => console.log('Read: ', port.read()));
port.on('error', (err) => {
    console.log(err)
});

const byteArr = Uint8Array.from(buffer);

const getIdBuffer = new Buffer.alloc(5, [5, 4, 1, 0x14, 0])

port.write(getByteFrame(getIdBuffer, 11), async(err, res) => {
    console.log(getIdBuffer)
    console.log(getByteFrame(getIdBuffer, 11))
    console.log('err', await err)
    console.log('res', await res)
})

port.write(getByteFrame(buffer, 11), async(err, bytesWritten) => {
    console.log(buffer)
    console.log("calbackErr", await err);
    console.log("bytesWritten", await bytesWritten);
})

port.write(getByteFrame(buffer, 11), async(err, bytesWritten) => {
    console.log(buffer)
    console.log("calbackErr", await err);
    console.log("bytesWritten", await bytesWritten);
})

function getByteFrame(buff, len){
    const pba = new Buffer.alloc(16);

    for (i = 0; i < len; i++) {
        pba[i] = buff[i]
    }

    pba[0] = pba[0] + 2;

    const crcDec = crc.crc16(pba).toString(len);

    pba[len] = crcDec & 0xFF;
    pba[len + 1] = crcDec >> 8 & 0xFF;

    return pba;
}

port.on('data', (data) => console.log(data))
port.on('close', () => console.log('closed')) 
port.on('err', err => console.log(err))



// app.get('/', (req, res) => {
//     res.send('Hello')
// })

// app.listen(3000, () => console.log(`listening on port 3000`));