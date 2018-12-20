import { Conf } from './util';
import { vtObserverDB as db } from './db';
import Spy from './spy';
import { xpath } from 'vt-dom2tree';


class Mngr {
  constructor() {
    this._spies = {};
    window.addEventListener('keydown', this._watchKeyboard.bind(this));
    window.addEventListener('keyup', this._watchKeyboard.bind(this));
    window.addEventListener('mousedown', this._mouseDown.bind(this));
    this._html = document.getElementsByTagName('html')[0];
    this._control = false;
    this._conf = new Conf();
    window.addEventListener('load', () => {
      db.getKeys().then(this._startSpies.bind(this));
    });
  }
  _startSpies(evt) {
    let xpaths = evt.target.result;
    xpaths.forEach((p) => {
      this._spies[p] = new Spy(xpath.toElement(p));
    });
  }
  _mouseDown(evt) {
    if (this._control === false) {
      return;
    }
    this._conf.show(evt.target, evt.clientX, evt.clientY).then(this._treatConf.bind(this));
  }
  _watchKeyboard(evt) {
    if (evt.ctrlKey) {
      this._html.style.cursor = 'url("image/looking.png") 16 16, auto';
    } else {
      this._html.style.cursor = '';
    }
    this._control = evt.ctrlKey;
  }
  _treatConf(e) {
    let spy = null;
    if (e.result.action === 1) {
      spy = new Spy(e.result.node.el, true);
      spy.save();
      this._spies[e.result.node.x] = spy;
    } else if (e.result.action === -1) {
      spy = this._spies[e.result.node.x];
      if (spy) {
        delete this._spies[e.result.node.x];
        spy.delete();
      }
    }
  }
}
let mngr = new Mngr();