class VtLog {
  error(msg) {
    console.error(msg);
    return true;
  }
  info(msg) {
    console.info(msg);
    return true;
  }
}
let log = new VtLog();
export default log;