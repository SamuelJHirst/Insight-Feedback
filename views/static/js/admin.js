$(document).ready(function() {
  var today = new Date(),
      min,
      max;

  if (today.getMonth() <= 8) {
    min = today.getFullYear() - 5;
    max = today.getFullYear() - 1;
  }
  else {
    min = today.getFullYear() - 4;
    max = today.getFullYear();
  }

  $("#startyear").attr("min", min);
  $("#startyear").attr("max", max);
});

$(document).delegate("#modal-new-student #classes-generate", "click", function(e) {
  var subjects = $("#modal-new-student #subjects").val().split(/\n/);

  $("#modal-new-student #classes").html("");

  for (var i in subjects) {
    if (subjects[i] === "") {
      continue;
    }
    else {
      $("#modal-new-student #classes").append('<div class="row"><div class="input-field col s12"><input class="class-input" id="' + subjects[i].trim().toLowerCase() + '-class" type="text" data-subject="' + subjects[i].trim() + '"><label for="' + subjects[i].trim().toLowerCase() + '-class">' + subjects[i].trim() + ' Class</label></div></div>');
    }
  }
});

$(document).delegate("#add-student", "click", function() {
  var username = $("#modal-new-student #username").val(),
      password = $("#modal-new-student #password").val(),
      startyear = $("#modal-new-student #startyear").val(),
      firstname = $("#modal-new-student #firstname").val(),
      lastname = $("#modal-new-student #lastname").val(),
      j = 0,
      classes = [],
      data = $("#modal-new-student #classes").children();

  if (!username || !password || !startyear || !firstname || !lastname) {
    Materialize.toast('A field has not been completed. Please provide all information.', 4000);
  }

  for (var i in data) {
    if (j >= data.length) {
      break;
    }
    j++;

    if (!$(data[i]).find(".class-input").val()) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
      return;
    }

    classes.push({
      subject: $(data[i]).find(".class-input").data("subject").toLowerCase(),
      subject_display: $(data[i]).find(".class-input").data("subject"),
      class: $(data[i]).find(".class-input").val(),
      staff: [],
      feedback: false
    });
  }

  $.post("/new/student/", {
    username: username.toLowerCase(),
    password: password,
    startyear: startyear,
    firstname: firstname,
    lastname: lastname,
    classes: classes,
    feedback: [],
    messages: []
  }, function(data) {
    if (data == "already_exists") {
      Materialize.toast('An account with that username already exists. Please choose a different username.', 4000);
    }
    else if (data == "success") {
      Materialize.toast('The student account has been added.', 4000);
      $('#modal-new-student').closeModal();
      $("#modal-new-student #username").val("");
      $("#modal-new-student #password").val("");
      $("#modal-new-student #startyear").val("");
      $("#modal-new-student #firstname").val("");
      $("#modal-new-student #lastname").val("");
      $("#modal-new-student #subjects").html("");
      $("#modal-new-student #classes").html("");
    }
  });
});

$(document).delegate("#modal-new-teacher #subjects-generate", "click", function() {
  var classes = $("#modal-new-teacher #classes").val().split(/\n/);

  $("#modal-new-teacher #subjects").html("");

  for (var i in classes) {
    if (classes[i] === "") {
      continue;
    }
    else {
      $("#modal-new-teacher #subjects").append('<div class="row"><div class="input-field col s12"><input class="class-input-subject" id="' + classes[i].trim() + '-class" type="text" data-class="' + classes[i].trim() + '"><label for="' + classes[i].trim() + '-class">' + classes[i].trim() + ' Subject</label></div><div class="input-field col s12"><textarea id="' + classes[i].trim() + '-class" class="materialize-textarea class-input-times" data-class="' + classes[i].trim() + '"></textarea><label for="' + classes[i].trim() + '-class">' + classes[i].trim() + ' Lesson Times (One Per Line, Example: Monday|08:45|09:45)</label></div></div>');
    }
  }
});

$(document).delegate("#add-teacher", "click", function(e) {
  var username = $("#modal-new-teacher #username").val(),
      password = $("#modal-new-teacher #password").val(),
      title = $("#modal-new-teacher #title").val(),
      firstname = $("#modal-new-teacher #firstname").val(),
      lastname = $("#modal-new-teacher #lastname").val(),
      j = 0,
      classes = [],
      data = $("#modal-new-teacher #subjects").children();

  if (!username || !password || !title || !firstname || !lastname) {
    Materialize.toast('A field has not been completed. Please provide all information.', 4000);
    return;
  }

  for (var i in data) {
    if (j >= data.length) {
      break;
    }
    j++;

    if (!$(data[i]).find(".class-input-subject").val()) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
      return;
    }

    var times = [];
    var lessons = $(data[i]).find(".class-input-times").val().split(/\n/);
    if ($(data[i]).find(".class-input-times").data("class") == $(data[i]).find(".class-input-subject").data("class")) {
      for (var k in lessons) {
        var lesson = lessons[k].split("|");
        if (!lesson[0]) {
          continue;
        }
        var lesson = lessons[k].split("|");
        if (!lesson[0] || !lesson[1] || !lesson[2]) {
          Materialize.toast('A field has not been completed. Please provide all information.', 4000);
          return;
        }
        times.push({
          day: lesson[0],
          starttime: lesson[1],
          endtime: lesson[2]
        });
      }
    }

    classes.push({
      class: $(data[i]).find(".class-input-subject").data("class"),
      subject: $(data[i]).find(".class-input-subject").val().toLowerCase(),
      subject_display: $(data[i]).find(".class-input-subject").val(),
      times: times
    });
  }

  $.post("/new/teacher/", {
    username: username.toLowerCase(),
    password: password,
    title: title,
    firstname: firstname,
    lastname: lastname,
    classes: classes,
    reports: [],
    messages: []
  }, function(data) {
    if (data == "already_exists") {
      Materialize.toast('An account with that username already exists. Please choose a different username.', 4000);
    }
    else if (data == "success") {
      Materialize.toast('The teacher account has been added.', 4000);
      $('#modal-new-teacher').closeModal();
      $("#modal-new-teacher #username").val("");
      $("#modal-new-teacher #password").val("");
      $("#modal-new-teacher #title").val("");
      $("#modal-new-teacher #firstname").val("");
      $("#modal-new-teacher #lastname").val("");
      $("#modal-new-teacher #classes").html("");
      $("#modal-new-teacher #classes").subjects("");
    }
  });
});

$(document).delegate("#add-admin", "click", function(e) {
  var username = $("#modal-new-admin #username").val(),
      password = $("#modal-new-admin #password").val(),
      title = $("#modal-new-admin #title").val(),
      firstname = $("#modal-new-admin #firstname").val(),
      lastname = $("#modal-new-admin #lastname").val();

  if (!username || !password || !title || !firstname || !lastname) {
    Materialize.toast('A field has not been completed. Please provide all information.', 4000);
    return;
  }

  $.post("/new/admin/", {
    username: username.toLowerCase(),
    password: password,
    title: title,
    firstname: firstname,
    lastname: lastname,
    messages: []
  }, function(data) {
    if (data == "already_exists") {
      Materialize.toast('An account with that username already exists. Please choose a different username.', 4000);
    }
    else if (data == "success") {
      Materialize.toast('The admin account has been added.', 4000);
      $('#modal-new-admin').closeModal();
      $("#modal-new-admin #username").val("");
      $("#modal-new-admin #password").val("");
      $("#modal-new-admin #title").val("");
      $("#modal-new-admin #firstname").val("");
      $("#modal-new-admin #lastname").val("");
    }
  });
});

$(document).delegate("#edit-user-modal", "click", function(e) {
  var username = $("#edit-user-username").val();

  $("#edit-user-data").html("");
  $("#delete-user").show();

  $.post("/edit/user/", {
    username: username.toLowerCase()
  }, function(data) {
    if (data.status == "not_found") {
      $("#modal-edit-user").closeModal();
      Materialize.toast('An account with that username does not exist.', 4000);
    }
    else if (data.status == "success") {
      var user = data.data;
      $("#edit-user-data").data("username", user.username);
      $("#edit-user-data").data("id", user._id);
      if (data.type === "0") {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" checked /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" selected /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" selected /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="startyear" type="number" placeholder=' + parseInt(user.startyear) + ' value=' + parseInt(user.startyear) + '> <label for="startyear">Start Year</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"> <div class="input-field col s8"> <textarea id="subjects" class="materialize-textarea"></textarea> <label for="subjects">Subjects (One Per Line)</label> </div> <div class="input-field col s4" style="margin-top: 45px;"> <a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="classes-generate"><i class="material-icons left">done</i>Update</a> </div> </div> <div id="classes"></div>');
        for (var i in user.classes) {
          $("#modal-edit-user #subjects").val($("#modal-edit-user #subjects").val() + user.classes[i].subject_display + "\n");
          $("#modal-edit-user #classes").append('<div class="row"><div class="input-field col s12"><input class="class-input" id="' + user.classes[i].subject.trim() + '-class" type="text" data-subject="' + user.classes[i].subject.trim() + '" placeholder=' + user.classes[i].class + ' value=' + user.classes[i].class + '><label for="' + user.classes[i].subject.trim() + '-class">' + user.classes[i].subject.substr(0,1).toUpperCase() + user.classes[i].subject.substr(1).trim() + ' Class</label></div></div>');
        }
        $("#edit-user-data").data("type", "student");
        Materialize.updateTextFields();
      }
      else if (data.type === "1") {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" checked /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"><div class="input-field col s8"><textarea id="classes" class="materialize-textarea"></textarea><label for="classes">Classes (One Per Line)</label></div><div class="input-field col s4" style="margin-top: 45px;"><a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="subjects-generate"><i class="material-icons left">done</i>Update</a></div></div><div id="subjects"></div>');
        for (var i in user.classes) {
          $("#modal-edit-user #classes").val($("#modal-edit-user #classes").val() + user.classes[i].class.trim() + "\n");
          $("#modal-edit-user #subjects").append('<div class="row"><div class="input-field col s12"><input class="class-input-subject" id="' + user.classes[i].class.trim().replace("/","-") + '-class" type="text" value="' + user.classes[i].subject + '" data-class="' + user.classes[i].class.trim() + '"><label for="' + user.classes[i].class.trim().replace("/","-") + '-class">' + user.classes[i].class.trim() + ' Subject</label></div><div class="input-field col s12"><textarea id="' + user.classes[i].class.trim().replace("/","-") + '-class-times" class="materialize-textarea class-input-times" data-class="' + user.classes[i].class.trim() + '"></textarea><label for="' + user.classes[i].class.trim().replace("/","-") + '-class-times">' + user.classes[i].class.trim() + ' Lesson Times (One Per Line, Example: Monday|08:45|09:45)</label></div></div>');
          for (var j in user.classes[i].times) {
            $("#modal-edit-user #" + user.classes[i].class.trim().replace("/","-") + "-class-times").html($("#modal-edit-user #" + user.classes[i].class.trim().replace("/","-") + "-class-times").html() + user.classes[i].times[j].day + "|" + user.classes[i].times[j].starttime + "|" + user.classes[i].times[j].endtime + "\n");
          }
        }
        $("#edit-user-data").data("type", "teacher");
        Materialize.updateTextFields();
      }
      else if (data.type === "2") {
        if (user.username != "admin") {
          $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" checked /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div>');
        }
        else {
          $("#edit-user-data").append('<div class="row"><div class="input-field col s8"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div>');
          $("#delete-user").hide();
        }
        $("#edit-user-data").data("type", "admin");
        Materialize.updateTextFields();
      }
      else {
        Materialize.toast('An unknown error occurred.', 4000);
      }
    }
  });
});

function typeChanged(oldType, newType) {
  $.post("/get/user/", {
    type: oldType,
    username: $("#modal-edit-user #username").val()
  }, function(user) {
    $("#edit-user-data").html("");
    if (newType == "student") {
      if (oldType == "student") {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" checked /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" selected /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" selected /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="startyear" type="number" placeholder=' + parseInt(user.startyear) + ' value=' + parseInt(user.startyear) + '> <label for="startyear">Start Year</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"> <div class="input-field col s8"> <textarea id="subjects" class="materialize-textarea"></textarea> <label for="subjects">Subjects (One Per Line)</label> </div> <div class="input-field col s4" style="margin-top: 45px;"> <a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="classes-generate"><i class="material-icons left">done</i>Update</a> </div> </div> <div id="classes"></div>');
        for (var i in user.classes) {
          $("#modal-edit-user #subjects").val($("#modal-edit-user #subjects").val() + user.classes[i].subject_display + "\n");
          $("#modal-edit-user #classes").append('<div class="row"><div class="input-field col s12"><input class="class-input" id="' + user.classes[i].subject.trim() + '-class" type="text" data-subject="' + user.classes[i].subject.trim() + '" placeholder=' + user.classes[i].class + ' value=' + user.classes[i].class + '><label for="' + user.classes[i].subject.trim() + '-class">' + user.classes[i].subject.substr(0,1).toUpperCase() + user.classes[i].subject.substr(1).trim() + ' Class</label></div></div>');
        }
      }
      else {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" checked /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" selected /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" selected /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="startyear" type="number"> <label for="startyear">Start Year</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"> <div class="input-field col s8"> <textarea id="subjects" class="materialize-textarea"></textarea> <label for="subjects">Subjects (One Per Line)</label> </div> <div class="input-field col s4" style="margin-top: 45px;"> <a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="classes-generate"><i class="material-icons left">done</i>Update</a> </div> </div> <div id="classes"></div>');
      }
    }
    else if (newType == "teacher") {
      if (oldType == "teacher") {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" checked /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"><div class="input-field col s8"><textarea id="classes" class="materialize-textarea"></textarea><label for="classes">Classes (One Per Line)</label></div><div class="input-field col s4" style="margin-top: 45px;"><a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="subjects-generate"><i class="material-icons left">done</i>Update</a></div></div><div id="subjects"></div>');
        for (var i in user.classes) {
          $("#modal-edit-user #classes").val($("#modal-edit-user #classes").val() + user.classes[i].class.trim() + "\n");
          $("#modal-edit-user #subjects").append('<div class="row"><div class="input-field col s12"><input class="class-input-subject" id="' + user.classes[i].class.trim().replace("/","-") + '-class" type="text" value="' + user.classes[i].subject + '" data-class="' + user.classes[i].class.trim() + '"><label for="' + user.classes[i].class.trim().replace("/","-") + '-class">' + user.classes[i].class.trim() + ' Subject</label></div><div class="input-field col s12"><textarea id="' + user.classes[i].class.trim().replace("/","-") + '-class-times" class="materialize-textarea class-input-times" data-class="' + user.classes[i].class.trim() + '"></textarea><label for="' + user.classes[i].class.trim().replace("/","-") + '-class-times">' + user.classes[i].class.trim() + ' Lesson Times (One Per Line, Example: Monday|08:45|09:45)</label></div></div>');
          for (var j in user.classes[i].times) {
            $("#modal-edit-user #" + user.classes[i].class.trim().replace("/","-") + "-class-times").html($("#modal-edit-user #" + user.classes[i].class.trim().replace("/","-") + "-class").html() + user.classes[i].times[j].day + "|" + user.classes[i].times[j].starttime + "|" + user.classes[i].times[j].endtime + "\n");
          }
        }
      }
      else {
        if (oldType == "admin") {
          $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" checked /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"><div class="input-field col s8"><textarea id="classes" class="materialize-textarea"></textarea><label for="classes">Classes (One Per Line)</label></div><div class="input-field col s4" style="margin-top: 45px;"><a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="subjects-generate"><i class="material-icons left">done</i>Update</a></div></div><div id="subjects"></div>');
        }
        else {
          $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" checked /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text"> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div> <div class="row"><div class="input-field col s8"><textarea id="classes" class="materialize-textarea"></textarea><label for="classes">Classes (One Per Line)</label></div><div class="input-field col s4" style="margin-top: 45px;"><a class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%" id="subjects-generate"><i class="material-icons left">done</i>Update</a></div></div><div id="subjects"></div>');
        }
      }
    }
    else if (newType == "admin") {
      if (oldType == "teacher") {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" checked /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text" placeholder=' + user.title + ' value=' + user.title + '> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div>');
      }
      else {
        $("#edit-user-data").append('<div class="row"><div class="col s4 center"><input name="type" type="radio" id="type-student" /><label for="type-student">Student</label></div><div class="col s4 center"><input name="type" type="radio" id="type-teacher" /><label for="type-teacher">Teacher</label></div><div class="col s4 center"><input name="type" type="radio" id="type-admin" checked /><label for="type-admin">Admin</label></div></div> <div class="row"> <div class="input-field col s4"> <input id="username" type="text" placeholder=' + user.username + ' value=' + user.username + '> <label for="username">Username</label> </div> <div class="input-field col s4"> <input id="password" type="password" value=' + user.password + '> <label for="password">Password</label> </div> <div class="input-field col s4"> <input id="title" type="text"> <label for="title">Title</label> </div> </div> <div class="row"> <div class="input-field col s6"> <input id="firstname" type="text" placeholder=' + user.firstname + ' value=' + user.firstname + '> <label for="firstname">Forename</label> </div> <div class="input-field col s6"> <input id="lastname" type="text" placeholder=' + user.lastname + ' value=' + user.lastname + '> <label for="lastname">Surname</label> </div> </div>');
      }
    }
    Materialize.updateTextFields();
  });
}

$(document).delegate("#type-student", "change", function(e) {
  if (this.checked) {
    var oldType = $("#edit-user-data").data("type");
    typeChanged(oldType, "student");
  }
});

$(document).delegate("#type-teacher", "change", function(e) {
  if (this.checked) {
    var oldType = $("#edit-user-data").data("type");
    typeChanged(oldType, "teacher");
  }
});

$(document).delegate("#type-admin", "change", function(e) {
  if (this.checked) {
    var oldType = $("#edit-user-data").data("type");
    typeChanged(oldType, "admin");
  }
});

function deleteUser(id, toast) {
  $.post("/delete/user/", {
    id: id,
    toast: toast
  }, function(data) {
    $("#modal-edit-user").closeModal();
    if (toast === true) {
      if (data == "success") {
        Materialize.toast('The account has been deleted.', 4000);
      }
      else if (data == "cannot_delete") {
        Materialize.toast('You cannot delete that account.', 4000);
      }
      else if (data == "not_found") {
        Materialize.toast('The account could not be found.', 4000);
      }
      else {
        Materialize.toast('An unknown error occurred.', 4000);
      }
    }
  });
}

$(document).delegate("#delete-user", "click", function(e) {
  var id = $("#edit-user-data").data("id");

  deleteUser(id, true);
});

$(document).delegate("#modal-edit-user #classes-generate", "click", function(e) {
  var subjects = $("#modal-edit-user #subjects").val().split(/\n/);

  $("#modal-edit-user #classes").html("");

  for (var i in subjects) {
    if (subjects[i] === "") {
      continue;
    }
    else {
      $("#modal-edit-user #classes").append('<div class="row"><div class="input-field col s12"><input class="class-input" id="' + subjects[i].trim().toLowerCase() + '-class" type="text" data-subject="' + subjects[i].trim() + '"><label for="' + subjects[i].trim().toLowerCase() + '-class">' + subjects[i].trim() + ' Class</label></div></div>');
    }
  }
});

$(document).delegate("#modal-edit-user #subjects-generate", "click", function() {
  var classes = $("#modal-edit-user #classes").val().split(/\n/);

  $("#modal-edit-user #subjects").html("");

  for (var i in classes) {
    if (classes[i] === "") {
      continue;
    }
    else {
      $("#modal-edit-user #subjects").append('<div class="row"><div class="input-field col s12"><input class="class-input-subject" id="' + classes[i].trim() + '-class" type="text" data-class="' + classes[i].trim() + '"><label for="' + classes[i].trim() + '-class">' + classes[i].trim() + ' Subject</label></div><div class="input-field col s12"><textarea id="' + classes[i].trim() + '-class" class="materialize-textarea class-input-times" data-class="' + classes[i].trim() + '"></textarea><label for="' + classes[i].trim() + '-class">' + classes[i].trim() + ' Lesson Times (One Per Line, Example: Monday|08:45|09:45)</label></div></div>');
    }
  }
});

$(document).delegate("#edit-user", "click", function(e) {
  if ($("#type-student").is(':checked')) {
    var username = $("#modal-edit-user #username").val(),
        password = $("#modal-edit-user #password").val(),
        startyear = $("#modal-edit-user #startyear").val(),
        firstname = $("#modal-edit-user #firstname").val(),
        lastname = $("#modal-edit-user #lastname").val(),
        j = 0,
        classes = [],
        data = $("#modal-edit-user #classes").children();

    if (!username || !password || !startyear || !firstname || !lastname) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
    }

    for (var i in data) {
      if (j >= data.length) {
        break;
      }
      j++;

      if (!$(data[i]).find(".class-input").val()) {
        Materialize.toast('A field has not been completed. Please provide all information.', 4000);
        return;
      }

      classes.push({
        subject: $(data[i]).find(".class-input").data("subject").toLowerCase(),
        subject_display: $(data[i]).find(".class-input").data("subject"),
        class: $(data[i]).find(".class-input").val(),
        staff: [],
        feedback: false
      });
    }

    $.post("/get/user/doesExist/", {
      username: username.toLowerCase()
    }, function(data) {
      if (data.data._id == $("#edit-user-data").data("id")) {
        if (data.type === "0") {
          var feedback,
              messages;
          if (data.data.feedback) {
            feedback = data.data.feedback;
          }
          else {
            feedback = [];
          }
          if (data.data.messages) {
            messages = data.data.messages;
          }
          else {
            messages = [];
          }
        }
        deleteUser($("#edit-user-data").data("id"), false);
        $.post("/new/student/nocheck/", {
          username: username.toLowerCase(),
          password: password,
          startyear: startyear,
          firstname: firstname,
          lastname: lastname,
          classes: classes,
          feedback: feedback,
          messages: messages
        }, function(data) {
          Materialize.toast('The account has been edited.', 4000);
          $('#modal-edit-user').closeModal();
          $("#modal-edit-user #username").val("");
          $("#modal-edit-user #password").val("");
          $("#modal-edit-user #startyear").val("");
          $("#modal-edit-user #firstname").val("");
          $("#modal-edit-user #lastname").val("");
          $("#modal-edit-user #classes").html("");
        });
      }
    });
  }
  else if ($("#type-teacher").is(':checked')) {
    var username = $("#modal-edit-user #username").val(),
        password = $("#modal-edit-user #password").val(),
        title = $("#modal-edit-user #title").val(),
        firstname = $("#modal-edit-user #firstname").val(),
        lastname = $("#modal-edit-user #lastname").val(),
        j = 0,
        classes = [],
        data = $("#modal-edit-user #subjects").children();

    if (!username || !password || !title || !firstname || !lastname) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
      return;
    }

    for (var i in data) {
      if (j >= data.length) {
        break;
      }
      j++;

      if (!$(data[i]).find(".class-input-subject").val()) {
        Materialize.toast('A field has not been completed. Please provide all information.', 4000);
        return;
      }

      var times = [];
      var lessons = $(data[i]).find(".class-input-times").val().split(/\n/);
      if ($(data[i]).find(".class-input-times").data("class") == $(data[i]).find(".class-input-subject").data("class")) {
        for (var k in lessons) {
          var lesson = lessons[k].split("|");
          if (!lesson[0]) {
            continue;
          }
          if (!lesson[0] || !lesson[1] || !lesson[2]) {
            Materialize.toast('A field has not been completed. Please provide all information.', 4000);
            return;
          }
          times.push({
            day: lesson[0],
            starttime: lesson[1],
            endtime: lesson[2]
          });
        }
      }

      classes.push({
        class: $(data[i]).find(".class-input-subject").data("class"),
        subject: $(data[i]).find(".class-input-subject").val(),
        times: times
      });
    }

    $.post("/get/user/doesExist/", {
      username: username.toLowerCase()
    }, function(data) {
      if (data.data._id == $("#edit-user-data").data("id")) {
        if (data.type === "1") {
          var reports,
              messages;
          if (data.data.reports) {
            reports = data.data.reports;
          }
          else {
            reports = [];
          }
          if (data.data.messages) {
            messages = data.data.messages;
          }
          else {
            messages = [];
          }
        }
        else {
          var reports = [],
              messages = [];
        }
        deleteUser($("#edit-user-data").data("id"), false);
        $.post("/new/teacher/nocheck/", {
          username: username.toLowerCase(),
          password: password,
          title: title,
          firstname: firstname,
          lastname: lastname,
          classes: classes,
          reports: reports,
          messages: messages
        }, function(data) {
          $('#modal-edit-user').closeModal();
          $("#modal-edit-user #username").val("");
          $("#modal-edit-user #password").val("");
          $("#modal-edit-user #title").val("");
          $("#modal-edit-user #firstname").val("");
          $("#modal-edit-user #lastname").val("");
          $("#modal-edit-user #classes").html("");
          Materialize.toast('The account has been edited.', 4000);
        });
      }
    });
  }
  else if ($("#type-admin").is(':checked')) {
    var username = $("#modal-edit-user #username").val(),
        password = $("#modal-edit-user #password").val(),
        title = $("#modal-edit-user #title").val(),
        firstname = $("#modal-edit-user #firstname").val(),
        lastname = $("#modal-edit-user #lastname").val();

    if (!username || !password || !title || !firstname || !lastname) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
      return;
    }

    $.post("/get/user/doesExist/", {
      username: username.toLowerCase()
    }, function(data) {
      if (data.data._id == $("#edit-user-data").data("id")) {
        if (data.type === 0) {
          var messages;
          if (data.data.messages) {
            messages = data.data.messages;
          }
          else {
            messages = [];
          }
        }
        deleteUser($("#edit-user-data").data("id"), false);
        $.post("/new/admin/nocheck/", {
          username: username.toLowerCase(),
          password: password,
          title: title,
          firstname: firstname,
          lastname: lastname,
          messages: messages
        }, function(data) {
          $('#modal-edit-user').closeModal();
          $("#modal-edit-user #username").val("");
          $("#modal-edit-user #password").val("");
          $("#modal-edit-user #title").val("");
          $("#modal-edit-user #firstname").val("");
          $("#modal-edit-user #lastname").val("");
          Materialize.toast('The account has been edited.', 4000);
        });
      }
    });
  }
  else if ($("#edit-user-data").data("username") == "admin") {
    var password = $("#modal-edit-user #password").val(),
        title = $("#modal-edit-user #title").val(),
        firstname = $("#modal-edit-user #firstname").val(),
        lastname = $("#modal-edit-user #lastname").val();

    if (!password || !title || !firstname || !lastname) {
      Materialize.toast('A field has not been completed. Please provide all information.', 4000);
      return;
    }

    $.post("/get/user/doesExist/", {
      username: "admin"
    }, function(data) {
      if (data.data._id == $("#edit-user-data").data("id")) {
        if (data.type === "2") {
          var messages;
          if (data.data.messages) {
            messages = data.data.messages;
          }
          else {
            messages = [];
          }
        }
        deleteUser($("#edit-user-data").data("id"), false);
        $.post("/new/admin/nocheck/", {
          username: "admin",
          password: password,
          title: title,
          firstname: firstname,
          lastname: lastname,
          messages: messages
        }, function(data) {
          $('#modal-edit-user').closeModal();
          $("#modal-edit-user #username").val("");
          $("#modal-edit-user #password").val("");
          $("#modal-edit-user #title").val("");
          $("#modal-edit-user #firstname").val("");
          $("#modal-edit-user #lastname").val("");
          Materialize.toast('The account has been edited.', 4000);
        });
      }
    });
  }
  else {
    Materialize.toast('An unknown error occurred.', 4000);
  }
});
