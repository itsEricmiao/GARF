import * as RF from './RF.js';
import * as DATA from './all_data.js';



var target_name = DATA.target;
var all_data = DATA.all_data;
var features = DATA.all_features;
// what features of the training data should we use to train on?


function shuffle(data) {
  var j, x, i;
  for (i = data.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = data[i];
    data[i] = data[j];
    data[j] = x;
  }
  return data;
}

var newData = shuffle(all_data)
var training = newData.slice(0, 100)
var testing = newData.slice(101, 130)
var forest = new RF.RandomForest(training, target_name, features, {
  numTrees: 50,	              // how many trees should we use (results are averaged together)
  percentData: .9,			      // what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
  percentFeatures: 0.1	      // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well

});

console.log(forest.train(testing).accuracy)


var bestTrees = forest.getBestTrees(testing);
var x = output_bestTrees(bestTrees)
// console.log(JSON.parse(x[0]))
var y = read_bestTrees_from_JSON(x)




var newData = shuffle(all_data)
var training = newData.slice(0, 100)
var testing = newData.slice(101, 130)
var newForest = new RF.RandomForest(training, target_name, features, {
  numTrees: 50,	              // how many trees should we use (results are averaged together)
  percentData: .9,			      // what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
  percentFeatures: 0.1,	      // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
  inputTrees: y
});

console.log(newForest.train(testing).accuracy)


function output_bestTrees(bestTrees) {
  //create a loop to iterate through our trees
  var output = []
  for (var i = 0; i < bestTrees.length; i++) {
    var singleTree_JSON = bestTrees[i].toJSON();
    output.push(JSON.stringify(singleTree_JSON));
  }
  return output
}


function read_bestTrees_from_JSON(input) {
  var bestTrees = []
  for (var i = 0; i < input.length; i++) {
    var x = JSON.parse(input[i])
    var data_ = x["data"]
    var target_ = x["target"]
    var features_ = x["features"]
    var dt = new RF.DecisionTree(data_, target_, features_);
    bestTrees.push(dt);
  }
  return bestTrees;
}
// var bestTrees2 = newForest.getBestTrees(testing);


// var newData = shuffle(all_data)
// var training = newData.slice(0, 100)
// var testing = newData.slice(101, 130)
// var newForest2 = new RF.RandomForest(training, target_name, features, {
//   numTrees: 50,	              // how many trees should we use (results are averaged together)
//   percentData: .9,			      // what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
//   percentFeatures: 0.1,	      // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
//   inputTrees: bestTrees2
// });

// console.log(newForest2.train(testing).accuracy)
// var bestTrees = newForest2.getBestTrees(testing);



// Train a forest of trees
// var rf = new RF.RandomForest(training_data, target_name, features, {
//   numTrees: 10,	// how many trees should we use (results are averaged together)
//   percentData: 1,			// what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
//   percentFeatures: 1	// what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
// });

// // Evaluate our forest with the test data
// console.log('Evaluating Forest...');
// console.log(JSON.stringify(rf.train(testing_data), null, "\t"));
// console.log(rf.featureImportance());	// "1"

// // and predict a value on potentially unseen data

// // return percentage of trees that agree on each class
// for(i = 0; i < testing_data.length; i++)
// {
//   // returns a single class that has the consensus vote
//   var prediction = rf.predictClass(testing_data[i]);
// }
