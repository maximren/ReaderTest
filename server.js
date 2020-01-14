const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
// const crc = require('crc');


const port = new SerialPort("/dev/tty.usbserial-DABIOSAN", {
    baudRate: 19200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
})

const parser = new Readline();
port.pipe(parser);

SerialPort.list().then(port => console.log(port))

parser.on('data', data => console.log(data));

const buffer = new Buffer(11);
buffer[0] = 11;
buffer[1] = 4;
buffer[2] = 1;
buffer[3] = 0x10;
buffer[4] = 0;

const byteBuffer = new Uint8Array(buffer)

port.on("open", () => console.log('port is open', port.baudRate))
port.on('data', (data) => console.log(data))
port.on('readable', () => console.log('Read: ', port.read()));
port.on('error', (err) => {
    console.log(err)
});

let w = 24;

const res = new Buffer(4);
res[0] = w;
res[1] = w >> 8
w = Math.round(91.4285714);
res[2] = w;
res[3] = w >> 8;

const resByte = new Uint8Array(res);

let connector;

const getIdBuffer = new Buffer(5);
getIdBuffer[0] = 5;
getIdBuffer[1] = 4;
getIdBuffer[2] = 1;
getIdBuffer[3] = 0x14;
getIdBuffer[4] = 0;

const idByteArray = new Uint8Array(getIdBuffer)

port.write(getByteFrame(getIdBuffer, 11), function(err, res) {
    if (err) {
        console.log('write1 err =', err);
    } else {
        console.log('write1 res =', res);
        port.write(getByteFrame(buffer, 11), function(err, bytesWritten) {
            if (err) {
                console.log('write2 err =', err)
            } else {
                console.log('write2 res =', bytesWritten);
                port.write(getByteFrame(buffer, 11), function(err, bytesWritten) {
                    if (err) {
                        console.log('write3 err =', err)
                    } else {
                        console.log('write3 res =', bytesWritten);
                    }
                })
            }
        })
    }
})

// port.write(GetReqToSendData(), async(err, res) => {
//     console.log(await err)
//     console.log(await res)
// })

function GetReqToSendData(conn, tag, param, buf, len) {
    const dfBuf = new ArrayBuffer(11);
    dfBuf[0] = 1 + 1 + 1 + 2 + 1 + 1 + len;
    dfBuf[1] = 4;
    dfBuf[2] = 0;
    dfBuf[3] = conn;
    dfBuf[4] = conn >> 8;
    dfBuf[5] = tag;
    dfBuf[6] = param;

    const dfByteBuff = new Uint8Array(dfBuf)

    if (buf != null)
    {
        for (let i = 0; i < len; i++)
        {
            dfByteBuff[i + 7] = buf[i];
        }
    }

    return getByteFrame(dfByteBuff, dfByteBuff[0]);
}

function getByteFrame(buff, len){
    const pba = new ArrayBuffer(16);

    const bytePba = new Uint8Array(pba)

    for (i = 0; i < len; i++) {
        bytePba[i] = buff[i]
    }

    bytePba[0] = bytePba[0] + 2;

    const crcDec = crc16(bytePba, len);

    bytePba[len] = crcDec & 0xFF;
    bytePba[len + 1] = crcDec >> 8 & 0xFF;

    return bytePba;
}

function crc16(buf, BufferLength)
        {
            const CRC_CONST = 0xA001;
            let pba = buf;
            let crc = 0xFFFF;

            for (let i = 0; i < BufferLength; i++)
            {
                crc = crc ^ pba[i];
                for (let j = 0; j <= 7; j++)
                {
                    if ((crc & 1) != 0)
                    {
                        crc = crc >> 1;
                        crc = crc ^ CRC_CONST;
                    }
                    else
                    {
                        crc = crc >> 1;
                    }
                }
            }
           
            return crc;
        }

port.on('data', (data) => console.log(data))
port.on('close', () => console.log('closed')) 
port.on('err', err => console.log(err))
