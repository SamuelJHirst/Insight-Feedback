$(document).delegate("#login", "click", function() {
  var username = $("#username").val(),
      password = $("#password").val();

  $.post('/auth/login/', {
    username: username.toLowerCase(),
    display: username,
    password: password
  }, function(data) {
    if (data[0] == "found") {
      $.post('/auth/login/complete/', {
        username: username.toLowerCase(),
        display: data[2],
        type: data[1]
      }, function(data) {
        if (data == "success") {
          window.location.replace("/redirect/");
        }
        else if (data == "error") {
          window.location.replace("/?error=invalid_login");
        }
      });
    }
    else if (data[0] == "not_found") {
      window.location.replace("/?error=invalid_login");
    }
    else {
      window.location.replace("/?error=unknown");
    }
  });
});
