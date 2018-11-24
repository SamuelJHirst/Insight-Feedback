var mongodb = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    url = "mongodb://localhost:27017/studentfeedback";

var students = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          resolve(result);
        });
      });
    });
  },
  update: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").update({
          _id: ObjectID(id),
        }, object,
        function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").findOne({
          username: username
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").findOne({
          _id: ObjectID(id)
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("students").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
};

var teachers = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          resolve(result);
        });
      });
    });
  },
  update: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").update({
          _id: ObjectID(id),
        }, object,
        function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").findOne({
          username: username
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").findOne({
          _id: ObjectID(id)
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("teachers").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
};

var admins = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          resolve(result);
        });
      });
    });
  },
  update: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").update({
          _id: ObjectID(id),
        }, object,
        function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").findOne({
          username: username
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").findOne({
          _id: ObjectID(id)
        }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("admins").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
};

module.exports = {
  students: students,
  teachers: teachers,
  admins: admins
};
