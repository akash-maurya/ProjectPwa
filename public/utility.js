
var dbPromise = idb.open("profile-store", 1, function (db) {
if(!db.objectStoreNames.contains('profile')){
     db.createObjectStore("profile", { keyPath: "authToken" });
}
 
});


function writedata(st ,data){
return  dbPromise.
    then(function(db){
        var tx = db.transaction(st ,'readwrite');
        var store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    })
}

function readallData(st){
 return   dbPromise.
    then(function(db){
        var tx = db.transaction(st,'readonly');
        var store = tx.objectStore(st);
        return store.getAll();

    })
}

function clearAll(st){
   return dbPromise
   .then(function(db){
       var tx = db.transaction(st , 'readwrite');
       var store = tx.objectStore(st);
       store.clear();
       return tx.complete ;
   })
}

function deleteItem(st,id){
  return dbPromise.
  then(function(db){
      var tx = db.transaction(st, "readwrite");
      var store = tx.objectStore(st);
      store.delete(id);
      return tx.complete ;
      
  })
}