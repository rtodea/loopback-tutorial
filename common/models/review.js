module.exports = function(Review) {
  Review.beforeRemote('create', beforeRemoteCreateHook);
};

function beforeRemoteCreateHook(context, user, next) {
  var req = context.req;
  console.log(user);
  req.body.date = Date.now();
  req.body.publisherId = req.accessToken.userId;
  next();
}
