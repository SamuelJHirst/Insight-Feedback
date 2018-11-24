$(document).delegate("#message-state", "click", function() {
  var id = $(this).data("id"),
      state = $(this).data("state"),
      username = $(this).data("username"),
      type = $(this).data("type");

  $.post("/edit/message/state/", {
    id: id,
    state: state,
    username: username,
    type: type
  }, function(data) {
    if (data == "success") {
      location.reload();
    }
    else if (data == "not_found") {
      Materialize.toast("The message could not be found in the database.", 4000);
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000);
    }
  });
});

$(document).delegate("#message-delete", "click", function() {
  var id = $(this).data("id"),
      username = $(this).data("username"),
      type = $(this).data("type");

  $.post("/delete/message/", {
    id: id,
    username: username,
    type: type
  }, function(data) {
    if (data == "success") {
      location.reload();
    }
    else if (data == "not_found") {
      Materialize.toast("The message could not be found in the database.", 4000);
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000);
    }
  });
});
