$(document).delegate("#subjects-save", "click", function() {
  var subjects = $("#subjects").children(),
      feedback,
      data = {};

  for (var i in subjects) {
    if ($("#subjects" + " #" + subjects[i].id + " #subject p").html() === undefined) {
      break;
    }
    if ($("#subjects" + " #" + subjects[i].id + " #feedback input").is(':checked')) {
      feedback = true;
    }
    else {
      feedback = false;
    }
    data[$("#subjects" + " #" + subjects[i].id + " #subject p").html().toLowerCase()] = feedback;
  }

  $.post("/edit/student/subjects/", data, function(data) {
    if (data.status == "success") {
      Materialize.toast('Your settings have been saved.', 4000);
    }
    else  {
      Materialize.toast('An unknown error occurred.', 4000);
    }
    if (data.changed[0]) {
      $.post("/send/teacher/new_student/", data);
    }
  });
});
