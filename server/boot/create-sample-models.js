module.exports = function (app) {
  app.dataSources.mysql.automigrate('CoffeeShop', function (err) {
    if (err) { throw  err; }
    automigrateCoffeeShop(app);
  });
};

function automigrateCoffeeShop(app) {
  var models = createModels();
  app.models.CoffeeShop.create(models, function (err, createdModels) {
    if (err) { throw err; }
    console.log('Models created: \n', createdModels)
  })
}

function createModels() {
  var city = 'Timișoara';

  var coffeeShopNames = [
    'Cafe Papillon',
    'Zai Après Café',
    'Emotion Cafe'
  ];

  var coffeeShops = [];

  coffeeShopNames.forEach(function (name) {
    coffeeShops.push({'name': name, 'city': city})
  });

  return coffeeShops;
}
