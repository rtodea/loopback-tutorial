var async = require('async');

module.exports = function (app) {
  var mongodb = app.dataSources.mongodb;
  var mysql = app.dataSources.mysql;
  async.parallel({
    reviewers: async.apply(createReviewerModels),
    coffeeShops: async.apply(createCoffeeShopModels)
  }, function(err, results) {
    if (err) { throw err; }
    var reviewerIds = results.reviewers.map(function (reviewer) {return reviewer.id});
    var coffeeShopIds = results.coffeeShops.map(function (coffeeShop) {return coffeeShop.id});
    var reviews = createReviews(reviewerIds, coffeeShopIds);

    createReviewModels(reviews, function() {
      console.log('> models have been created');
    });
  });

  function createReviewerModels(cb) {
    mongodb.automigrate('Reviewer', function(err) {
      if (err) {return cb(err);}
      app.models.Reviewer.create(createReviewers(), cb);
    });
  }

  function createCoffeeShopModels(cb) {
    mysql.automigrate('CoffeeShop', function(err) {
      if (err) {return cb(err);}
      app.models.CoffeeShop.create(createCoffeeShops(), cb);
    });
  }
  function createReviewModels(reviews, cb) {
    mongodb.automigrate('Review', function(err) {
      if (err) {return cb(err);}
      app.models.Review.create(reviews, cb);
    })
  }
};

function createCoffeeShops() {
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

function createReviewers() {
  var fragments = ['robert', 'adrian', 'thomas'];

  var reviewers = [];
  fragments.forEach(function(fragment) {
    reviewers.push({email: fragment + '@e-spres-oh.com', password: fragment})
  });

  return reviewers;
}

function createReviews(reviewerIds, coffeeShopsIds) {
  var commentsAndRating = [
    {comments: 'It was very good', rating: 3},
    {comments: 'It was awful', rating: 1},
    {comments: 'I would go there again', rating: 5},
    {comments: 'I would recommend it to my friends', rating: 2},
    {comments: 'Never go there', rating: 1}];

  var dates = getDates(commentsAndRating.length);

  var reviewers = [];
  var coffeeShops = [];
  commentsAndRating.forEach(function() {
    reviewers.push(getRandomElement(reviewerIds));
    coffeeShops.push(getRandomElement(coffeeShopsIds));
  });

  var reviews = [];
  commentsAndRating.forEach(function(item, index){
    reviews.push({
      date: dates[index],
      rating: item.rating,
      comments: item.comments,
      publisherId: reviewers[index],
      coffeeShopId: coffeeShops[index]});
  });

  return reviews;
}

function getRandomElement(someArray) {
  var index = Math.floor(Math.random() * someArray.length);
  return someArray[index];
}

function getDates(nDates) {
  var dayInMilliseconds = 1000 * 60 * 60 * 24;
  var dates = [];
  for(var i=nDates-1; i>=0; i--) {
    dates.push(Date.now() - dayInMilliseconds * i)
  }
  return dates;
}
