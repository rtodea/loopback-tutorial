module.exports = function(CoffeeShop) {
  registerStatus();
  registerGetName();

  function registerMethod(methodName, methodFunction, remoteSpec) {
    CoffeeShop[methodName] = methodFunction;
    CoffeeShop.remoteMethod(methodName, remoteSpec);
  }

  function registerStatus() {
    var methodName = 'status';
    registerMethod(methodName, getStatus, {
      http: {path: '/' + methodName, verb: 'get'},
      returns: {arg: methodName, type: 'string'}});
  }

  var OPEN_HOUR = 6;
  var OPEN_MESSAGE = 'We are open for business';
  var CLOSE_HOUR = 20;
  var CLOSE_MESSAGE = 'Sorry, we are closed. We are open daily from: ' + OPEN_HOUR + ' to ' + CLOSE_HOUR;

  function createStatusMessage() {
    var currentHour = (new Date()).getHours();
    if (OPEN_HOUR < currentHour < CLOSE_HOUR) {
      return OPEN_MESSAGE;
    }
    return CLOSE_MESSAGE;
  }

  function getStatus(callback) {
    var statusMessage = createStatusMessage();
    callback(null, statusMessage);
  }

  function findName(shopId, callback) {
    CoffeeShop.findById(shopId, function(err, instance) {
      var name = 'Name of CoffeeShop is: ' + instance.name;
      callback(null, name);
      console.log(name);
    });
  }

  function registerGetName() {
    var methodName = 'getname';
    registerMethod(methodName, findName, {
      http: {path: '/' + methodName, verb: 'get'},
      accepts: {arg: 'id', type: 'number', http: { source: 'query'}},
      returns: {arg: 'name', type: 'string'}});
  }
};
