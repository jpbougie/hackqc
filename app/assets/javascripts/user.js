function getUserByToken(token, callback) {
  $.get('/users/' + token, callback);
}