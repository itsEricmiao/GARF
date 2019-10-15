import * as RF from './RF.js';
import * as data from './all_data.js';
export {Command}

function Command(configFile) {
    var newData         = shuffle(data.all_data)
    this.config         = configFile
    this.model          = null;
    this.training_set   = newData.slice(0, 100);
    this.testing_set    = newData.slice(111, 130);
    this.target         = data.target
    this.features       = data.all_features
    this.oldScore       = configFile.oldScore
    this.cur_bestTree   = [];
    this.newScore       = 0;
}


Command.prototype = {
    execute: function (name) {
        var args = Array.from(arguments).slice(1);
        var funcName = '_' + name;
        if (this[funcName]) {
            this[funcName]();
        }
    },


    _init: function () {
        var randomForest = new RF.RandomForest(this.training_set, this.target, this.features, {
            numTrees: 100,	                    // how many trees should we use (results are averaged together)
            percentData: .9,			        // what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
            percentFeatures: 0.1,	            // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
            //No new trees
        });
        this.model = randomForest
    },


    _generate: function () {
        var rf = new RF.RandomForest(this.training_set, this.target, this.features, {
            numTrees: 80,	                    // how many trees should we use (results are averaged together)
            percentData: .8,			        // what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
            percentFeatures: 0.2,	            // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
            bestTrees: this._readTrees()
        });
        this.model = rf
    },


    _train: function () {
        this.newScore = this.model.train(this.testing_set).accuracy
        // console.log("Accuracy of current generation", this.newScore)
    },


    _bestTrees: function () {
        var bestTrees = this.model.getBestTrees(this.testing_set);
        var output = [];
        for (var i = 0; i < bestTrees.length; i++) {
            var singleTree_JSON = bestTrees[i].toJSON();
            output.push(JSON.stringify(singleTree_JSON));
        }
        this.cur_bestTree = output;
    },


    _readTrees: function () {
        var bestTrees = []
        var input = this.config["prevTrees"];
        for (var i = 0; i < input.length; i++) {
            var x = JSON.parse(input[i])
            var data_ = x["data"]
            var target_ = x["target"]
            var features_ = x["features"]
            var dt = new RF.DecisionTree(data_, target_, features_);
            bestTrees.push(dt);
        }
        return bestTrees;
    },


    _output: function(){
        var output = {
            oldScore: this.oldScore*100,
            newScore: this.newScore*100,
            prevTrees: this.cur_bestTree,
            commands: []
        }
        return output;
    }
};


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

