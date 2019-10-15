import * as RF from "./RF.js";
import * as DATA from './all_data.js';

var target_name = DATA.target;
var all_data = DATA.all_data;
var features = DATA.all_features;

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
  
  all_data = shuffle(all_data)
  var training_data = all_data.slice(0,10)
  var testing_data = all_data.slice(11,12)
  

// Train a single tree
var dt = new RF.DecisionTree(training_data, target_name, features);
// Evaluate their accuracy on training & test data
console.log('Single Training Accuracy: ', dt.evaluate(training_data));
console.log('Single Test Accuracy: ', dt.evaluate(testing_data));			
// console.log(dt.toJSON())