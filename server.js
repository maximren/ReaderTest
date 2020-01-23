const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

//COM4 for Windows
///dev/tty.usbserial-DABIOSAN for macOS

const port = new SerialPort('/dev/tty.usbserial-DABIOSAN', {
  baudRate: 19200,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
});

const parser = new Readline();
port.pipe(parser);

SerialPort.list().then(port => console.log(port));

parser.on('data', data => console.log(data));

port.on('open', () => console.log('port is open', port.baudRate));
port.on('data', data => console.log('Data:', data));
port.on('error', err => {
  console.log(err);
});

const rqXID = new Buffer.alloc(
  16,
  new Buffer([7, 4, 1, 20, 0, 206, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
);

const rqConnect = new Buffer.alloc(
  16,
  new Buffer([13, 4, 1, 16, 0, 82, 48, 48, 48, 55, 54, 164, 158, 0, 0, 0])
);

const runMeasure = new Buffer.alloc(
  16,
  new Buffer([10, 4, 0, 216, 8, 64, 1, 60, 167, 146, 0, 0, 0, 0, 0, 0])
);

port.write(rqXID, function(err, res = 13) {
  if (err) {
    console.log(err)
  } else {
    port.write(rqConnect, function(err, bytesWritten) {
      if (err) {
        console.log(err)
      } else {
        port.write(runMeasure);
      }
    });
  }
});

port.on('close', () => console.log('closed'));
