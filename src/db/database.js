import { log } from '../util';
export default class VTDatabase {
  constructor(dbName, storeNames, defaultStoreName) {
    let request = null;
    this._dbName = dbName;
    this._storeNames = storeNames;
    this._defaultStoreName = defaultStoreName;

    this._db = null;

    !indexedDB && (indexedDB = indexedDB = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB);
    !IDBTransaction && (IDBTransaction = IDBTransaction || webkitIDBTransaction || msIDBTransaction);
    !IDBKeyRange && (IDBKeyRange = IDBKeyRange || webkitIDBKeyRange || msIDBKeyRange);

    if (!indexedDB) {
      log.error('Support for indexed dabase not found.');
      return;
    }

    request = indexedDB.open(this._dbName, 4);
    request.onerror = () => log.error('Unable to create database');
    request.onsuccess = () => this._db = request.result;
    request.onupgradeneeded = () => {
      this._db = request.result;
      this._storeNames.forEach(sn => {
        this._db.createObjectStore(sn);
      });
    }
  }
  add(data, key, storeName) {
    let request = null;
    let os = this._getObjectStore(storeName || this._defaultStoreName);
    request = os.put(JSON.stringify(data), key);
    request.onerror = () => log.error('Unable to add item into the database.');
  }
  remove(key, storeName) {
    let request = null;
    let os = this._getObjectStore(storeName || this._defaultStoreName);
    request = os.delete(key);
    request.onerror = () => log.error('Unable to add item into the database.');
  }
  get(key, storeName) {
    return new Promise((resolve, reject) => {
      let request = null;
      let os = this._getObjectStore(storeName || this._defaultStoreName);
      request = os.get(key);
      request.onerror = reject;
      request.onsuccess = resolve;
    });
  }
  _getObjectStore(storeName) {
    let transaction = null;
    let objectStore = null;

    if (!this._db) {
      log.error('Database is not ready yet, please try again.');
      return;
    }

    transaction = this._db.transaction([storeName], 'readwrite');
    objectStore = transaction.objectStore(storeName);
    return objectStore;
  }
  getKeys(storeName) {
    return new Promise((resolve, reject) => {
      let request = null;
      let os = this._getObjectStore(storeName || this._defaultStoreName);
      request = os.getAllKeys();
      request.onerror = reject;
      request.onsuccess = resolve;
    });
  }
}