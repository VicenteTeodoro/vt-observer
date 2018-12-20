import { vtObserverDB as db } from '../db';
import { Tree, xpath } from 'vt-dom2tree';
export default class Conf {
  constructor() {
    this._parent = document.createElement('div');
    this._parent.setAttribute('class', 'change-spy-conf');
    this._parent.innerHTML = '\
    <img src="../../image/cross.png"/>\
    <hr>\
    <input type="checkbox"/><span class="children">Watch Children</span>\
    <button class="start-stop">Start Watching</button>\
    <canvas id="vt-canvas" width="750" height="500"></canvas>\
    ';
    this._parent.getElementsByTagName('img')[0].addEventListener('click', this._hide.bind(this));
    setTimeout(() => {
      document.body.appendChild(this._parent);
      this._tree = new Tree();
    }, 0);
  }
  show(n, x, y) {
    let btn = this._parent.getElementsByTagName('button')[0];
    let action = 1;
    this._tree.setRoot(n);

    return new Promise((resolve, reject) => {
      this._parent.style.visibility = 'visible';
      db.get(xpath.create(n)).then((e) => {
        if (!e.target.result) {
          btn.innerHTML = "Start Watching";
          return;
        }
        action = -1;
        btn.innerHTML = "Stop Watching";
      });
      btn.onclick = (e) => {
        resolve({ result: { action: action, addChildren: true, node: this._tree.selectedNode } });
        this._hide();
        e.stopPropagation();
      }
    });
  }
  _hide() {
    this._parent.style.visibility = 'hidden';
  }
}
