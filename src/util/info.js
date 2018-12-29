export default class Info {
  constructor() {
    this.s = null;
    this.c = null;
    this.p = '';
  }
  addChild(c) {
    !this.c && (this.c = []);
    this.c.push(c);
  }
} 
