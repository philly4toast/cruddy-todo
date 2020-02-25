const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
//const JSON = require('')

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  items[id] = text;
  callback(null, { id, text });
};

// writeCounter inside the callback function, and create a new file path
// pass in new file path & text that we are given

// exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//   var newPath =
//   writeCounter()
// }

exports.create = (text, callback) => {
  counter.getNextUniqueId(
    (err, id) => {
      var filepath = path.join(exports.dataDir, id + ".txt"); // `${id}.txt`
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});

          // console.log('Has successfully written data');
        }
      });
    }
  );
};



exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `/${id}.txt`);
  // console.log(filePath);
  fs.readFile(filePath, (err, text) => {
    // 'utf8',
   // console.log(text)
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      callback(null, { id, text: String(text) })
    }
  })
}

exports.readAll = (callback) => {
  var filePath = path.join(exports.dataDir);
  // console.log(filePath)
  var resultArr = [];
  fs.readdir(filePath, function (err, files) {
    if (err || files.length === 0 ) {
      callback(null, [])
    } else {
      files.forEach(function(file) {
        console.log(file)
        var id = file.slice(0, file.length-4);
        resultArr.push({id, text:id})
      })
      // console.log(resultArr)
      callback(null, resultArr);

    }
  })
}

// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };


// exports.readAll = (callback) => {
//   var filePath = path.join(exports.dataDir);
//   var data = _.map( {filePath}, (file) => {
//     console.log(file);
//   });
//   console.log(filePath);


// };



exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `/${id}.txt`);

  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (!items[id]) {
          callback(new Error(`No item with id: ${id}`));

        } else {
          callback(null, {id, text: String(text) });
        }
      });
    }

  });

};

// exports.update = (id, text, callback) => {
//   var item = items[id];
//   if (!item) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     items[id] = text;
//     callback(null, { id, text });
//   }
// };

// exports.delete = (id, callback) => {
//   var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }
// };

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `/${id}.txt`);

  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        } else {
          callback()
        }
      })
    }

  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
