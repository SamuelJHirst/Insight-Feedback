$(document).delegate("#feedback-submit", "click", function() {
  var username = $(this).data("username"),
      sender = {
        title: $(this).data("sender-title"),
        firstname: $(this).data("sender-firstname"),
        lastname: $(this).data("sender-lastname"),
        username: $(this).data("sender-username")
      },
      subject = $(this).data("subject"),
      subject_display = $(this).data("subject-display"),
      subject_class = $(this).data("class"),
      attainment = $("#attainment").val(),
      behaviour = $("#behaviour").val(),
      contributions = $("#contributions").val(),
      effort = $("#effort").val(),
      comment = $("#comment").val();

  $.post("/new/feedback/", {
    username: username,
    sender: sender,
    subject: subject,
    subject_display: subject_display,
    class: subject_class,
    attainment: attainment,
    behaviour: behaviour,
    contributions, contributions,
    effort: effort,
    comment: comment
  }, function(data) {
    if (data == "teacher_invalid") {
      Materialize.toast("The system did not recognise your details and could not submit feedback.");
    }
    else if (data == "teacher_class_invalid") {
      Materialize.toast("You do not teach the class " + subject_class + " and therefore cannot submit feedback.");
    }
    else if (data == "student_invalid") {
      Materialize.toast("The system did not recognise the student's details and could not submit feedback.");
    }
    else if (data == "student_class_invalid") {
      Materialize.toast("The student is not in the class " + subject_class + " for " + subject + ". The feedback could not be submitted.");
    }
    else if (data == "student_no_request") {
      Materialize.toast("The student has not requested feedback for " + subject + ".");
    }
    else if (data == "success") {
      Materialize.toast("The feedback was submitted successfully.");
    }
    else {
      Materialize.toast("An unknown error occurred.");
    }
  });
});
