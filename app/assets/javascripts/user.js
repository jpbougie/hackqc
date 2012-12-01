function getUserByToken(token, callback) {
  $.getJSON('/users/' + token, callback);
}
