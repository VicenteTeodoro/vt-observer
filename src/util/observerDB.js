import VTDatabase from './database';
var vtObserverDB = new VTDatabase('change-spy-db', ['el-snapshot'], 'el-snapshot');
export default vtObserverDB;
