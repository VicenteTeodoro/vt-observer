import { vtObserverDB as db } from '../db';
import { log } from '../util';


class Validator {
  constructor() {
    this._info = null;
    this._validation = [];
    self.onmessage = this.onmessage.bind(this);
  }
  onmessage(msg) {
    debugger;
    this._info = JSON.parse(msg.data);
    this._validation.length = 0;
    db.get(this._info.p).then(this._validate.bind(this), (evt) => log.error('Validator could not get data for: ' + this._info.p));
  }
  _validate(evt) {
    let info = null;
    if (!evt.target || !evt.target.result) {
      return;
    }
    info = JSON.parse(evt.target.result);
    this._helper(info, this._info);
    postMessage(this._validation);
  }
  _helper(before, current) {
    let k = null;
    for (k in current.s) {
      if (before.s[k] !== current.s[k]) {
        this._validation.push(current.p);
        break;
      }
    }
    if (before.c === null && current.c !== null) {
      this._validation.push(current.p);
      return;
    }
    if (before.c !== null && current.c === null) {
      this._validation.push(current.p);
      return;
    }
    if (before.c === null && current.c === null) {
      return;
    }
    if (before.c.length !== current.c.length) {
      this._validation.push(current.p);
      return;
    }
    for (let i = 0; i < current.c.length; i++) {
      this._helper(before.c[i], current.c[i]);
    }
  }
}
let validator = new Validator();