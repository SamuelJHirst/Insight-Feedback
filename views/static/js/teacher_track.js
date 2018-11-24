$(document).ready(function() {
  if (!$("#reports").html().trim()) {
    $("#reports").html('<p class="center">You have no reports to submit.</p>');
  }
});

$(document).delegate("#track-user", "click", function() {
  var username = $("#track-student-user").val();

  $.post("/get/user/", {
    username: username,
    type: "student"
  }, function(data) {
    var today = new Date();

    $("#track-student-firstname").html(data.firstname);
    $("#track-student-lastname").html(data.lastname);

    if (today.getMonth() <= 8) {
      $("#track-student-year").html(parseInt(today.getFullYear()) - parseInt(data.startyear) + 6);
    }
    else {
      $("#track-student-year").html(parseInt(today.getFullYear()) - parseInt(data.startyear) + 7);
    }

    $("#track-student-username").html(data.username);

    $("#feedback").html("");

    data.feedback = data.feedback.reverse();
    var names = {};
    for (var i in data.feedback) {
      $("#feedback").append('<tr class="row"><td class="col s2 center" style="margin: 15px 0;">' + data.feedback[i].subject_display + '</td><td class="col s2 center" style="margin: 15px 0;">' + data.feedback[i].class + '</td><td class="col s2 center" style="margin: 15px 0;">' + data.feedback[i].sender.title + '. ' + data.feedback[i].sender.firstname[0] + ' ' + data.feedback[i].sender.lastname + '</td><td class="col s2 center" style="margin: 15px 0;">' + data.feedback[i].date.day + '/' + data.feedback[i].date.month + '/' + data.feedback[i].date.year + '</td><td class="col s2 center" style="margin: 15px 0;" id="staff-' + data.feedback[i].id + '"></td><td class="col s2 center" id="view-' + data.feedback[i].id + '"></td></tr>');

      names[data.feedback[i].id] = [];

      if (data.feedback[i].staff) {
        var staff = [];

        for (var j in data.feedback[i].staff) {
          staff.push(" " + data.feedback[i].staff[j].title + ". " + data.feedback[i].staff[j].firstname[0] + " " + data.feedback[i].staff[j].lastname);
          names[data.feedback[i].id].push(data.feedback[i].staff[j].username);
        }
        staff = staff.toString();
        $("#staff-" + data.feedback[i].id).html(staff);
      }
      else {
        $("#staff-" + data.feedback[i].id).html("None");
        names[data.feedback[i].id] = [];
      }

      if ($("#track-user").data("username") == data.feedback[i].sender.username || names[data.feedback[i].id].indexOf($("#track-user").data("username")) > -1) {
        $("#view-" + data.feedback[i].id).html('<a href="#" id="open-feedback" class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%; margin-top: 7px" data-id="' + data.feedback[i].id + '" data-user="' + username + '"><i class="material-icons left">visibility</i>View</a>');
      }
      else {
        $("#view-" + data.feedback[i].id).html('<a href="#" id="unlock-feedback" class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%; margin-top: 7px" data-id="' + data.feedback[i].id + '" data-user="' + username + '"><i class="fa fa-unlock-alt left" aria-hidden="true"></i>Open</a>');
      }
    }
  });
});

$(document).delegate("#open-feedback", "click", function() {
  var id = $(this).data("id"),
      user = $(this).data("user");

  $.post("/get/user/", {
    username: user,
    type: "student"
  }, function(data) {
    for (var i in data.feedback) {
      if (data.feedback[i].id.toString() == id.toString()) {
        $("#view-report-subject").html(data.feedback[i].subject_display);
        $("#view-report-class").html(data.feedback[i].class);
        $("#view-report-date").html(data.feedback[i].date.day + "/" + data.feedback[i].date.month + "/" + data.feedback[i].date.year);
        $("#view-report-teacher").html(data.feedback[i].sender.title + ". " + data.feedback[i].sender.firstname[0] + " " + data.feedback[i].sender.lastname);
        $("#view-report-attainment").html(data.feedback[i].attainment + "/5");
        $("#view-report-behaviour").html(data.feedback[i].behaviour + "/5");
        $("#view-report-contributions").html(data.feedback[i].contributions + "/5");
        $("#view-report-effort").html(data.feedback[i].effort + "/5");
        $("#view-report-comment").html(data.feedback[i].comment);
        $("#modal-track-user").closeModal();
        $("#modal-view-report").openModal();
      }
    }
  });
});

$(document).delegate("#unlock-feedback", "click", function() {
  var id = $(this).data("id"),
      user = $(this).data("user");

  $("#view-" + id).html('<a href="#" id="open-feedback" class="waves-effect waves-light btn deep-purple darken-4 white-text" style="width: 100%; margin-top: 7px" data-id="' + id + '" data-user="' + user + '"><i class="material-icons left">visibility</i>View</a>');

  $.post("/update/feedback/staff/", {
    id: id,
    username: user
  }, function(data) {
    if (data == "success") {
      Materialize.toast("The report has been unlocked.");
    }
    else {
      Materialize.toast("An unknown error occurred.");
    }
  });
});
