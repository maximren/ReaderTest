const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

//COM4 for Windows
///dev/tty.usbserial-DABIOSAN for macOS

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

port.on("open", () => console.log('port is open', port.baudRate))
port.on('data', (data) => console.log('Data:', data))
port.on('readable', () => console.log('Read: ', port.read()));
port.on('error', (err) => {
    console.log(err)
});

const getIdBuffer = new Buffer(5);
getIdBuffer[0] = 5;
getIdBuffer[1] = 4;
getIdBuffer[2] = 1;
getIdBuffer[3] = 0x14;
getIdBuffer[4] = 0;

port.write(getByteFrame(getIdBuffer, 11), function(err, res) {
    if (err) {
        console.log('write1 err =', err);
    } else {
        console.log('write1 res =', res);
        const buffer = new Buffer(11);
        buffer[0] = 11;
        buffer[1] = 4;
        buffer[2] = 1;
        buffer[3] = 0x10;
        buffer[4] = 0;

        port.write(getByteFrame(buffer, 11), function(err, bytesWritten) {
            if (err) {
                console.log('write2 err =', err)
            } else {
                console.log('write2 res =', bytesWritten);
                const buffer = new Buffer(11);
                buffer[0] = 11;
                buffer[1] = 4;
                buffer[2] = 1;
                buffer[3] = 0x10;
                buffer[4] = 0;

                port.write(getByteFrame(buffer, 11), function(err, bytesWritten) {
                    if (err) {
                        console.log('write3 err =', err)
                    } else {
                        console.log('write3 res =', bytesWritten);
                        port.write(GetReqToSendData(0, 0x40, 1, 60, 1), function(err, resp) {
                            if (err) {
                                console.log('write4 err=', err);
                            } else {
                                console.log('write4 res =', resp);
                            }
                        })
                    }
                })
            }
        })
    }
})

function GetReqToSendData(conn, tag, param, buf, len) {
    const dfBuf = new Buffer(11);
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
    const pba = new Buffer(16);

    for (i = 0; i < len; i++) {
        pba[i] = buff[i]
    }

    pba[0] = pba[0] + 2;

    const crcDec = crc16(pba, len);

    pba[len] = crcDec & 0xFF;
    pba[len + 1] = crcDec >> 8 & 0xFF;

    return pba;
}

function crc16(buf, BufferLength)
        {
            const CRC_CONST = 0xA001;
            const pba = buf;
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

port.on('close', () => console.log('closed')) 
