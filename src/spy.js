import { Info, log } from './util';
import { vtObserverDB as db } from './db';
import Worker from './worker/validator.worker.js';
import { xpath } from 'vt-dom2tree';

export default class Spy {
  constructor(el) {
    if (!el) {
      log.error('Node not specified');
      return;
    }
    this._el = el;
    this._info = new Info();
    this._info.p = xpath.create(this._el);
    this._validator = new Worker();
    this._validator.addEventListener('message', () => {
    });
    this._check();
  }
  _run() {
    this._extractInfo(this._el, this._info);
  }
  _extractInfo(n, info) {
    let map = {};
    if (!n && log.error('Node not specified')) { return; }

    switch (n.nodeType) {
      case 1: {
        info.s = window.getComputedStyle(n);
        break;
      }
    }

    n.childNodes.forEach(el => {
      let inf = null;
      if (el.nodeType !== 1) { return; }
      inf = new Info();
      if (map[el.elName] === undefined) {
        map[el.elName] = 0;
      } else {
        map[el.elName]++;
      }
      inf.p = xpath.create(el);
      info.addChild(inf);
      this._extractInfo(el, inf);
    });
  }
  save() {
    this._run();
    db.add(this._info, this._info.p);
  }
  _check() {
    setTimeout(() => {
      this._run();
      this._validator.postMessage(JSON.stringify(this._info));
    }, 1000);
  }
  delete() {
    db.remove(this._info.p);
  }
} 
