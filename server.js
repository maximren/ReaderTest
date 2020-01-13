const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const crc = require('crc');


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
port.write("kdkdk", null, (err) => console.log('err', err));

const buffer = new Buffer.alloc(11, [11, 4,  1, 0x10, 0]);

port.on("open", () => console.log('port is open', port.baudRate))
port.on('data', (data) => console.log(data))
port.on('readable', () => console.log('Read: ', port.read()));
port.on('error', (err) => {
    console.log(err)
});

let w = 24;

const res = new Buffer.alloc(4);
res[0] = w;
res[1] = w >> 8
w = Math.round(91.4285714);
res[2] = w;
res[3] = w >> 8;

let connector;


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

port.write(GetReqToSendData(connector, 0x25, 1, res, 4), async(err, res) => {
    console.log('lol', GetReqToSendData(connector, 0x25, 1, res, 4))
    console.log(await err);
    console.log(await res);
})

function GetReqToSendData(conn, tag, param, buf, len) {
    const dfBuf = new Buffer.alloc(11);
    dfBuf[0] = 1 + 1 + 1 + 2 + 1 + 1 + len;
    dfBuf[1] = 4;
    dfBuf[2] = 0;
    dfBuf[3] = conn;
    dfBuf[4] = conn >> 8;
    dfBuf[5] = tag;
    dfBuf[6] = param;

    if (buf != null)
        {
            for (let i = 0; i < len; i++)
            {
                dfBuf[i + 7] = buf[i];
            }
        }


    return getByteFrame(dfBuf, dfBuf[0]);
}

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
