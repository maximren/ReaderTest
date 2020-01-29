export class TDataFrame {
  constructor(len, net_id, sid, conn, tag, param, result) {
    this.len = len;
    this.net_id = net_id;
    this.sid = sid;
    this.conn = conn;
    this.tag = tag;
    this.param = param;
    this.result = result;
  }
}