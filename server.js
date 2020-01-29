const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
export { TDataFrame } from './types';

//COM4 for Windows
///dev/tty.usbserial-DABIOSAN for macOS

const port = new SerialPort('/dev/tty.usbserial-DABIOSAN', {
  baudRate: 19200,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
});

const fdf = new TDataFrame();

let fReaderRow = 0;
let fCurrRow = 0;
let fReaderCol = 0;

const parser = new Readline();
port.pipe(parser);

SerialPort.list().then(port => console.log(port));

parser.on('data', data => console.log(data));

port.on('open', () => console.log('port is open', port.baudRate));
port.on('data', data => console.log('Data:', data.getUint32(0, 3)));
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

let param = (fReaderCol << 4) + fReaderRow

const getReaderData = new Buffer.alloc(
  16,
  new Buffer([9, 4, 0, 216, 8, 68, param, 11, 230, 0, 0, 0, 0, 0, 0, 0])
);

const onNodeData = () => {
  let df = fdf;
  switch(df.tag) {
    case 0x41:
      if(df.param = 2) {
        fCurrRow = -1;
        fReaderCol = 0;
        fReaderRow = 0;
      }
      break;
    case 0x43:
      fCurrRow = df.param;
      if (fCurrRow == fReaderRow)
      {
          port.write(getReaderData);
      }
      break;
    case 0x45:
      fReaderData.col = df.param >> 4;
      fReaderData.row = df.param & 0x0F;

      const vIn = new Buffer.alloc(4);
      vIn[0] = df.result[0];
      vIn[1] = df.result[1];
      vIn[2] = df.result[2];
      vIn[3] = df.result[3];

      // const vOut = 

      fReaderCol++;
  }
}

port.write(rqXID, function(err, res) {
  if (err) {
    console.log(err)
  } else {
    port.write(rqConnect, function(err, bytesWritten) {
      if (err) {
        console.log(err)
      } else {
        port.write(runMeasure);
        // port.write(getReaderData, function(err, res) {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     port.on('data', data => console.log('ReaderData:', data.readUIntBE(0, 3)));
        //   }
        // });
      }
    });
  }
});

function OnReaderData()
        {
            let col;
            let row;
            let value;

            const Tfi0 = {};
            Tfi0.fi0 = glfi0
            // {
            //     if ((col < 0) || (row < 0)) { return; }

            //     if (row == 0)
            //     {
            //         fi0->value[col] = value;
            //         return;
            //     }

            //     let ResultValue = -fi0->value[col] + value;
            //     if (95 == lbOD.Items.Add((lbOD.Items.Count + 1).ToString() + ") " + ResultValue.ToString("F3"))) { fBusy = false; };
            // }
        }

port.on('close', () => console.log('closed'));
