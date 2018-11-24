 var express = require('express'),
	  config = require('./config'),
  	helpers = require('./helpers'),
		db = require('./db'),
  	bodyParser = require('body-parser'),
		app = express(),
		session = require('express-session'),
		cookieParser = require('cookie-parser'),
		swig = require('swig'),
		cron = require('node-cron');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use(cookieParser());
app.use(session({secret: 'anything', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view cache', false);
swig.setDefaults({cache: false});

app.listen(config.app.port, function() {
  db.admins.getByUsername("admin").then(function(data) {
    if (!data) {
      var object = {
        username: "admin",
        password: "Password1",
        title: "Mr",
        firstname: "John",
        lastname: "Smith"
      };
      db.admins.add(object);
    }
  });
  console.log('Listing on port: ' + config.app.port);
});

// Run code for all pages
app.get('*', function(req, res, next) {
	res.locals.display = req.session.display;
  res.locals.username = req.session.username;
	res.locals.type = req.session.type;
	res.locals.startyear = req.session.startyear;
	res.locals.user_title = req.session.title;
	res.locals.firstname = req.session.firstname;
	res.locals.lastname = req.session.lastname;
	res.locals.unread = false;
	if (req.session.username) {
		if (res.locals.type == "student") {
			db.students.getByUsername(req.session.username).then(function(data) {
				if (data.messages) {
					for (var i in data.messages) {
						if (data.messages[i].read === false) {
							res.locals.unread = true;
						}
					}
				}
				next();
			});
		}
		else if (res.locals.type == "teacher") {
			db.teachers.getByUsername(req.session.username).then(function(data) {
				if (data.messages) {
					for (var i in data.messages) {
						if (data.messages[i].read === false) {
							res.locals.unread = true;
						}
					}
				}
				next();
			});
		}
		else if (res.locals.type == "admin") {
			db.admins.getByUsername(req.session.username).then(function(data) {
				if (data.messages) {
					for (var i in data.messages) {
						if (data.messages[i].read === false) {
							res.locals.unread = true;
						}
					}
				}
				next();
			});
		}
		else {
			next();
		}
	}
	else {
		next();
	}
});

// Get index page
app.get('/', function(req, res) {
	if (res.locals.username) {
		res.redirect('/redirect/');
	}
	else {
	  res.render('index', { title: "Home", login_state: req.query.error });
	}
});

app.get("/redirect/", function(req, res) {
	if (req.session.type == "student") {
		res.redirect("/student/view/");
	}
	else if (req.session.type == "teacher") {
		res.redirect("/teacher/view/");
	}
	else if (req.session.type == "admin") {
		res.redirect("/admin/");
	}
	else {
		req.session.destroy(function() {
	    res.redirect('/');
	  });
	}
});

// Check if user is logged in
app.get('*', function(req, res, next) {
  if (res.locals.username) {
	  next();
  }
  else {
    res.redirect('/');
  }
});

app.get("/student/view/", function(req, res) {
	db.students.getByUsername(req.session.username).then(function(data) {
		res.render("student_view", { title: "Student Homepage", data: data });
	});
});

app.get("/student/view/all/", function(req, res) {
	db.students.getByUsername(req.session.username).then(function(data) {
    if (data.feedback) {
  		data.feedback.reverse();
    }
		res.render("student_view_all", { title: "Student Homepage", data: data });
	});
});

app.get("/student/view/starred/", function(req, res) {
	db.students.getByUsername(req.session.username).then(function(data) {
    if (data.feedback) {
  		data.feedback.reverse();
    }
		res.render("student_view_all", { title: "Student Homepage", data: data, filter: true });
	});
});

app.get("/teacher/view/", function(req, res) {
	db.teachers.getByUsername(req.session.username).then(function(data) {
		var classes = [];
		for (var i in data.classes) {
			classes.push({ subject: data.classes[i].subject, subject_display: data.classes[i].subject_display, class: data.classes[i].class, data: []});
		}
		for (var i in classes) {
			for (var j in data.reports) {
				if (data.reports[j].class == classes[i].class && data.reports[j].subject == classes[i].subject) {
					classes[i].data.push(data.reports[j]);
				}
			}
		}
		res.render("teacher_view", { title: "Teacher Homepage", data: classes });
	});
});

app.get("/teacher/submit/", function(req, res) {
	res.render("teacher_submit", { title: "Submit Feedback for Student", student: { firstname: req.query.firstname, lastname: req.query.lastname, username: req.query.username, subject: req.query.subject, subject_display: req.query.subject_display, class: req.query.class } });
});

app.get("/admin/", function(req, res) {
	res.render("admin", { title: "Admin Homepage" });
});

app.get("/notifications/", function(req, res) {
	if (req.session.type == "student") {
		db.students.getByUsername(req.session.username).then(function(data) {
			res.render("notifications", { title: "Notifications", messages: data.messages.reverse() });
		});
	}
	else if (req.session.type == "teacher") {
		db.teachers.getByUsername(req.session.username).then(function(data) {
			res.render("notifications", { title: "Notifications", messages: data.messages.reverse() });
		});
	}
	else if (req.session.type == "admin") {
		db.admins.getByUsername(req.session.username).then(function(data) {
			res.render("notifications", { title: "Notifications", messages: data.messages.reverse() });
		});
	}
});

// Log out
app.get('/auth/logout/', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

// Display 404 Error
app.get('*', function(req, res) {
  res.render('error', { title: "404", code: "404",  description: "That page could not be found." });
});

app.post("/auth/login/", function(req, res) {
	Promise.all([db.students.getAll(), db.teachers.getAll(), db.admins.getAll()]).then(function(data) {
		for (var i in data) {
			for (var j in data[i]) {
				if (data[i][j].username == req.body.username) {
					if (data[i][j].password == req.body.password) {
						res.send(["found", i, req.body.display]);
						return;
					}
					else {
						res.send(["not_found"]);
						return;
					}
				}
			}
		}
		res.send(["not_found"]);
		return;
	});
});

app.post("/auth/login/complete/", function(req, res) {
	if (req.body.type === "0") {
		db.students.getByUsername(req.body.username).then(function(data) {
			req.session.type = "student";
			req.session.display = req.body.display;
			req.session.username = data.username;
			req.session.startyear = data.startyear;
			req.session.firstname = data.firstname;
			req.session.lastname = data.lastname;
			res.send("success");
		});
	}
	else if (req.body.type === "1") {
		db.teachers.getByUsername(req.body.username).then(function(data) {
			req.session.type = "teacher";
			req.session.display = req.body.display;
			req.session.username = data.username;
			req.session.title = data.title;
			req.session.firstname = data.firstname;
			req.session.lastname = data.lastname;
			res.send("success");
		});
	}
	else if (req.body.type === "2") {
		db.admins.getByUsername(req.body.username).then(function(data) {
			req.session.type = "admin";
			req.session.display = req.body.display;
			req.session.username = data.username;
			req.session.title = data.title;
			req.session.firstname = data.firstname;
			req.session.lastname = data.lastname;
			res.send("success");
		});
	}
	else {
		res.send("error");
	}
});

app.post("/new/student/", function(req, res) {
	Promise.all([db.students.getByUsername(req.body.username), db.teachers.getByUsername(req.body.username), db.admins.getByUsername(req.body.username)]).then(function(doesExist) {
		if (doesExist[0] || doesExist[1] || doesExist[2]) {
			res.send("already_exists");
		}
		else {
			db.students.add(req.body);
			res.send("success");
		}
	});
});

app.post("/new/teacher/", function(req, res) {
	Promise.all([db.students.getByUsername(req.body.username), db.teachers.getByUsername(req.body.username), db.admins.getByUsername(req.body.username)]).then(function(doesExist) {
		if (doesExist[0] || doesExist[1] || doesExist[2]) {
			res.send("already_exists");
		}
		else {
			db.teachers.add(req.body);
			res.send("success");
		}
	});
});

app.post("/new/admin/", function(req, res) {
	Promise.all([db.students.getByUsername(req.body.username), db.teachers.getByUsername(req.body.username), db.admins.getByUsername(req.body.username)]).then(function(doesExist) {
		if (doesExist[0] || doesExist[1] || doesExist[2]) {
			res.send("already_exists");
		}
		else {
			db.admins.add(req.body);
			res.send("success");
		}
	});
});

app.post("/new/student/nocheck/", function(req, res) {
	db.students.add(req.body);
});

app.post("/new/teacher/nocheck/", function(req, res) {
	db.teachers.add(req.body);
});

app.post("/new/admin/nocheck/", function(req, res) {
	db.admins.add(req.body);
});

app.post("/edit/user/", function(req, res) {
	Promise.all([db.students.getByUsername(req.body.username), db.teachers.getByUsername(req.body.username), db.admins.getByUsername(req.body.username)]).then(function(data) {
		for (var i in data) {
			if (data[i]) {
				res.send({ status: "success", data: data[i], type: i });
			}
		}
		res.send({ status: "not_found" });
	});
});

app.post("/delete/user/", function(req, res) {
	Promise.all([db.students.getById(req.body.id), db.teachers.getById(req.body.id), db.admins.getById(req.body.id)]).then(function(data) {
		for (var i in data) {
			if (data[i]) {
				if (data[i].username == "admin" && req.body.toast === true) {
					res.send("cannot_delete");
				}
				else {
					if (i === "0") {
						db.students.delete(req.body.id).then(function() {
              res.send("success");
            });
					}
					else if (i === "1") {
						db.teachers.delete(req.body.id).then(function() {
              res.send("success");
            });
					}
					else if (i === "2") {
						db.admins.delete(req.body.id).then(function() {
              res.send("success");
            });
					}
					else {
						res.send("unknown_error");
					}
				}
			}
		}
		res.send("not_found");
	});
});

app.post("/get/user/", function(req, res) {
	if (req.body.type == "student") {
		db.students.getByUsername(req.body.username).then(function(data) {
      console.log(data)
			res.send(data);
		});
	}
	else if (req.body.type == "teacher") {
		db.teachers.getByUsername(req.body.username).then(function(data) {
			res.send(data);
		});
	}
	else if (req.body.type == "admin") {
		db.admins.getByUsername(req.body.username).then(function(data) {
			res.send(data);
		});
	}
});

app.post("/get/user/doesExist/", function(req, res) {
	Promise.all([db.students.getByUsername(req.body.username), db.teachers.getByUsername(req.body.username), db.admins.getByUsername(req.body.username)]).then(function(doesExist) {
		for (var i in doesExist) {
			if (doesExist[i]) {
				res.send({ data: doesExist[i], type: i });
			}
		}
		res.send("");
	});
});

app.post("/edit/student/subjects/", function(req, res) {
	var changed = [];
	db.students.getByUsername(req.session.username).then(function(data) {
		for (var i in data.classes) {
			if (req.body[data.classes[i].subject] === undefined) {
				res.send({ status: "not_found" });
			}
			if (data.classes[i].feedback != req.body[data.classes[i].subject]) {
				changed.push({
					class: data.classes[i].class,
          subject: data.classes[i].subject,
          subject_display: data.classes[i].subject_display,
					feedback: req.body[data.classes[i].subject]
				});
			}
			data.classes[i].feedback = req.body[data.classes[i].subject];
		}
		db.students.update(data._id, data).then(function() {
			res.send({ status: "success", changed: changed });
		});
	});
});

app.post("/send/teacher/new_student/", function(req, res) {
	db.teachers.getAll().then(function(teachers) {
		for (var i in req.body.changed) {
			for (var j in teachers) {
				for (var k in teachers[j].classes) {
					if (teachers[j].classes[k].class == req.body.changed[i].class) {
						if (!teachers[j].messages) {
							teachers[j].messages = [];
						}
						if (!teachers[j].reports) {
							teachers[j].reports = [];
						}
						var id = Date.now(),
								d = new Date();
						if (req.body.changed[i].feedback === "true") {
							teachers[j].messages.push({
								id: id,
								read: false,
								date: {
									year: d.getFullYear(),
									month: d.getMonth() + 1,
									day: d.getDate()
								},
								subject: "New Feedback Requested",
								body: req.session.firstname + " " + req.session.lastname + " (" + req.session.username + ") has requested feedback from you after each " + teachers[j].classes[k].subject_display + " (" + teachers[j].classes[k].class + ") lesson."
							});
							teachers[j].reports.push({
								username: req.session.username,
								firstname: req.session.firstname,
								lastname: req.session.lastname,
								subject: teachers[j].classes[k].subject,
                subject_display: teachers[j].classes[k].subject_display,
								class: teachers[j].classes[k].class
							});
						}
						else {
							teachers[j].messages.push({
								id: id,
								read: false,
								date: {
									year: d.getFullYear(),
									month: d.getMonth() + 1,
									day: d.getDate()
								},
								subject: "Feedback Request Deleted",
								body: req.session.firstname + " " + req.session.lastname + " (" + req.session.username + ") has stopped requesting feedback from you after each " + teachers[j].classes[k].subject_display + " (" + teachers[j].classes[k].class + ") lesson."
							});
							for (var h in teachers[j].reports) {
                if (req.session.username == teachers[j].reports[h].username && req.body.changed[i].class == teachers[j].reports[h].class && req.body.changed[i].subject.toLowerCase() == teachers[j].reports[h].subject) {
									teachers[j].reports.splice(h, 1);
								}
							}
						}
						db.teachers.update(teachers[j]._id, teachers[j]);
					}
				}
			}
		}
 	});
});

function changeMessageState(data, object) {
	var newState = (object.state == "unread");
	if (data) {
		if (data.messages) {
			for (var i in data.messages) {
				if (data.messages[i].id.toString() == object.id.toString()) {
					data.messages[i].read = newState;
					if (object.type == "student") {
						db.students.update(data._id, data);
						return "success";
					}
					else if (object.type == "teacher") {
						db.teachers.update(data._id, data);
						return "success";
					}
					else if (object.type == "admin") {
						db.admins.update(data._id, data);
						return "success";
					}
					else {
						return "not_found";
					}
				}
			}
			return "not_found";
		}
		else {
			return "not_found";
		}
	}
	else {
		return "not_found";
	}
}

app.post("/edit/message/state/", function(req, res) {
	if (req.body.type == "student") {
		db.students.getByUsername(req.body.username).then(function(data) {
			res.send(changeMessageState(data, req.body));
		});
	}
	else if (req.body.type == "teacher") {
		db.teachers.getByUsername(req.body.username).then(function(data) {
			res.send(changeMessageState(data, req.body));
		});
	}
	else if (req.body.type == "admin") {
		db.admins.getByUsername(req.body.username).then(function(data) {
			res.send(changeMessageState(data, req.body));
		});
	}
	else {
		res.send("unknown_error");
	}
});

function deleteMessage(data, object) {
	if (data) {
		if (data.messages) {
			for (var i in data.messages) {
				if (data.messages[i].id.toString() == object.id.toString()) {
					data.messages.splice(i);
					if (object.type == "student") {
						db.students.update(data._id, data);
						return "success";
					}
					else if (object.type == "teacher") {
						db.teachers.update(data._id, data);
						return "success";
					}
					else if (object.type == "admin") {
						db.admins.update(data._id, data);
						return "success";
					}
					else {
						return "not_found";
					}
				}
			}
			return "not_found";
		}
		else {
			return "not_found";
		}
	}
	else {
		return "not_found";
	}
}

app.post("/delete/message/", function(req, res) {
	if (req.body.type == "student") {
		db.students.getByUsername(req.body.username).then(function(data) {
			res.send(deleteMessage(data, req.body));
		});
	}
	else if (req.body.type == "teacher") {
		db.teachers.getByUsername(req.body.username).then(function(data) {
			res.send(deleteMessage(data, req.body));
		});
	}
	else if (req.body.type == "admin") {
		db.admins.getByUsername(req.body.username).then(function(data) {
			res.send(deleteMessage(data, req.body));
		});
	}
	else {
		res.send("unknown_error");
	}
});

app.post("/new/feedback/", function(req, res) {
	db.teachers.getByUsername(req.body.sender.username).then(function(teacher) {
		if (!teacher || teacher.title != req.body.sender.title || teacher.firstname != req.body.sender.firstname || teacher.lastname != req.body.sender.lastname || teacher.username != req.body.sender.username) {
			res.send("teacher_invalid");
		}

		var teaches = false;
		for (var i in teacher.classes) {
			if (teacher.classes[i].subject == req.body.subject && teacher.classes[i].class == req.body.class) {
				teaches = true;
			}
		}
		if (teaches === false) {
			res.send("teacher_class_invalid");
		}

		db.students.getByUsername(req.body.username).then(function(student) {
			if (!student || student.username != req.body.username) {
				res.send("student_invalid");
			}

			var inClass = false,
					feedback = false;
			for (var i in student.classes) {
				if (student.classes[i].subject.toLowerCase() == req.body.subject.toLowerCase() && student.classes[i].class == req.body.class) {
					inClass = true;
					if (student.classes[i].feedback == "true") {
						feedback = true;
					}
				}
			}
			if (inClass === false) {
				res.send("student_class_invalid");
			}
			if (feedback === false) {
				res.send("student_no_request");
			}

			var d = new Date();
			req.body.id = Date.now();
			req.body.date = {
				year: d.getFullYear(),
				month: d.getMonth() + 1,
				day: d.getDate()
			};
			req.body.starred = false;

			if (!student.feedback) {
				student.feedback = [];
			}
			student.feedback.push(req.body);

			if (!student.messages) {
				student.messages = [];
			}

			var id = Date.now();
			student.messages.push({
				id: id,
				read: false,
				date: {
					year: d.getFullYear(),
					month: d.getMonth() + 1,
					day: d.getDate()
				},
				subject: "New Feedback",
				body: req.body.sender.title + ". " + req.body.sender.firstname[0] + " " + req.body.sender.lastname + " has submitted feedback to you for " + req.body.subject_display + " (" + req.body.class + ")."
			});

			db.students.update(student._id, student).then(function() {
				res.send("success");
			});
		});
	});
});

app.post("/edit/feedback/starred/", function(req, res) {
	var id = parseInt(req.body.id),
			state = (req.body.state == "unstarred");

	db.students.getByUsername(req.session.username).then(function(data) {
		if (!data) {
			res.send("user_not_found");
		}

		var found = false;
		for (var i in data.feedback) {
			if (data.feedback[i].id == id) {
				data.feedback[i].starred = state;
				found = true;
				db.students.update(data._id, data).then(function() {
					res.send("success");
				});
			}
		}
		if (found === false) {
			res.send("feedback_not_found");
		}
	});
});

app.post("/update/feedback/staff/", function(req, res) {
  db.students.getByUsername(req.body.username).then(function(data) {
    var newStaff = {
      title: req.session.title,
      username: req.session.username,
      firstname: req.session.firstname,
      lastname: req.session.lastname
    }
    var elementPos = data.feedback.map(function(x) { return x.id.toString(); }).indexOf(req.body.id.toString());
    if (!data.feedback[elementPos].staff) {
      data.feedback[elementPos].staff = [];
    }
    data.feedback[elementPos].staff.push(newStaff);
    db.students.update(data._id, data).then(function(data) {
      res.send("success");
    });
  });
});

cron.schedule("* * * * *", function() {
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			d = new Date(),
			students = [];
	db.teachers.getAll().then(function(data) {
		for (var i in data) {
			for (var j in data[i].classes) {
				for (var k in data[i].classes[j].times) {
					if (data[i].classes[j].times[k].day == days[d.getDay()]) {
						var time = data[i].classes[j].times[k].endtime.split(":");
						if (time[0] == d.getHours() && time[1] == d.getMinutes()) {
							for (var h in data[i].reports) {
                if (data[i].classes[j].class == data[i].reports[h].class && data[i].classes[j].subject == data[i].reports[h].subject) {
  								students.push(" " + data[i].reports[h].firstname + " " + data[i].reports[h].lastname)
                }
							}
							if (students[0]) {
								students = students.toString();
								students = students + ".";
								if (!data[i].messages) {
									data[i].messages = [];
								}
								var id = Date.now();
								data[i].messages.push({
									id: id,
									read: false,
									date: {
										year: d.getFullYear(),
										month: d.getMonth() + 1,
										day: d.getDate()
									},
									subject: "Feedback Reminder",
									body: "The following people require feedback from " + data[i].classes[j].subject_display + " (" + data[i].classes[j].class + "):" + students
								});
								db.teachers.update(data[i]._id, data[i])
							}
						}
					}
				}
			}
		}
	});
});
