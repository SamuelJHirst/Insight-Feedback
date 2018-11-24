$(document).delegate("#change-starred", "click", function() {
  var id = $(this).data("id"),
      state = $(this).data("state");

  $.post("/edit/feedback/starred", {
    id: id,
    state: state
  }, function(data) {
    if (data == "success") {
      location.reload();
    }
    else if (data == "user_not_found") {
      Materialize.toast("The user account could not be found in the system. The action could not be completed.");
    }
    else if (data == "feedback_not_found") {
      Materialize.toast("The feedback could not be found in the system. The action could not be completed.");
    }
    else {
      Materialize.toast("An unknown error occurred.");
    }
  });
});
