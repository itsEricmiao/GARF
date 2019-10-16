import "./lodash.js";
export { RandomForest, DecisionTree }

function RandomForest(input, target, features, options) {

    this.numTrees = options.numTrees || 80;
    this.percentData = options.percentData || .2;
    this.percentFeatures = options.percentFeatures || .7;
    this.verbose = options.verbose || false;
    this.initTrees = options.inputTrees || [];

    this.data = input;
    this.target = target;
    this.features = features.slice(0);
    this.trees = [];
    this.percentBestTrees = .3;

    // The RF can generate trees or take the trees from previous generation
    if (this.initTrees) {
        for (var x in this.initTrees) {
            this.trees.push(this.initTrees[x])
        }
    }

    for (var i = this.trees.length; i < this.numTrees; i++) {

        // select n% of data
        var d = input.slice(0);
        d = _.slice(_.shuffle(d), 0, (d.length * this.percentData));
        var n_features = Math.round(features.length * this.percentFeatures);

        var f = features.slice(0);
        f = _.slice(_.shuffle(f), 0, n_features);

        if (this.verbose) {
            console.log('Tree ' + i + ' : ' + d.length + ' data / ' + f.length + ' features');
            console.log(JSON.stringify(f.sort()));
        }
        this.trees.push(new DecisionTree(d, target, f));
    }
}

RandomForest.prototype.predictClass = function (sample) {
    return this.predict(sample, 'class');
};
RandomForest.prototype.predictProbability = function (sample) {
    return this.predict(sample, 'probability');
};

RandomForest.prototype.predict = function (sample, type) {

    type = type || 'class'; // class or probability
    var results = [];
    _.each(this.trees, function (dt) {
        results.push(dt.predict(sample));
    });

    if (type == 'class') {
        return mostCommon(results);
    } else if (type == 'probability') {
        var counts = {};
        for (var i = 0; i < results.length; i++) {
            var num = results[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        _.each(counts, function (e, i) {
            counts[i] = e / results.length;
        });
        return counts;
    }
};

RandomForest.prototype.train = function (samples) {
    var instance = this;
    var report = {
        allTrees: this.trees,
        size: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        fscore: 0,
        class: {},
        featureImportance: null
    };


    _.each(samples, function (s) {

        report.size++;

        var pred = instance.predictClass(s);
        var actual = s[instance.target];

        report.class[pred] = report.class[pred] || { size: 0, predicted: 0, predicted_correct: 0 };
        report.class[pred].predicted++;

        report.class[actual] = report.class[actual] || { size: 0, predicted: 0, predicted_correct: 0 };
        report.class[actual].size++;


        if (pred == actual) {
            report.correct++;
            report.class[pred].predicted_correct++;
        } else {
            report.incorrect++;
        }
    });

    var class_length = 0;
    _.each(report.class, function (d) {
        d.precision = d.predicted_correct / d.predicted;
        d.recall = d.predicted_correct / d.size;
        d.fscore = 2 * (d.precision * d.recall) / (d.precision + d.recall);

        report.precision += d.precision;
        report.recall += d.recall;
        report.fscore += d.fscore;

        class_length++;
    });

    report.accuracy = report.correct / report.size;
    report.precision /= class_length;
    report.recall /= class_length;
    report.fscore /= class_length;
    report.featureImportance = this.featureImportance();
    return report;
};


RandomForest.prototype.getBestTrees = function (samples) {

    var all_trees = this.trees;
    all_trees.sort(function (a, b) {
        return a.evaluate(samples).accuracy - b.evaluate(samples).accuracy
    })
    var end = Math.round(all_trees.length * this.percentBestTrees);
    var bestTrees = all_trees.slice(all_trees.length - end, all_trees.length)
    return bestTrees
};


// This will return a dictionary that has <featureName, fscore>
RandomForest.prototype.featureImportance = function () {
    var r = {};
    for (var i in this.features) {
        r[this.features[i]] = gain(this.data, this.target, this.features[i]);
    }
    return r;
};



/*
    ID3 Decision Tree Algorithm
*/

function DecisionTree(input, target, features) {
    this.data = input;
    this.target = target;
    this.features = features;
    this.model = createTree(input, target, features);
}

DecisionTree.prototype = {
    predict: function (sample) {
        var root = this.model;
        while (root.type !== "result") {
            var attr = root.name;
            var sampleVal = sample[attr];
            var childNode = _.find(root.vals, function (x) { return x.name == sampleVal });
            if (childNode) {
                root = childNode.child;
            } else {
                try {
                    root = root.vals[0].child;
                } catch (e) {
                    //console.log(root);
                }
            }
        }

        return root.val;
    },

    evaluate: function (samples) {
        var instance = this;
        var target = this.target;
        var total = 0;
        var correct = 0;

        _.each(samples, function (s) {
            total++;
            var pred = instance.predict(s);
            var actual = s[target];
            if (pred == actual) {
                correct++;
            }
        });

        var returnVal = {
            correct_classification: correct,
            total_classification: total,
            accuracy: correct / total
        }
        return returnVal;
    },

    featureImportance: function () {
        var r = {};
        for (var i in this.features) {
            r[this.features[i]] = gain(this.data, this.target, this.features[i]);
        }
        return r;
    },

    toJSON: function () {
        return {data:this.data, target:this.target, features: this.features, model: this.model};
    },

    getData: function(){
        return this.data;
    }

};


/**
 * Private APIs
 */

function createTree(input, target, features) {
    var targets = _.uniq(_.map(input, target));
    if (targets.length == 1) {
        // console.log("end node! "+targets[0]);
        return { type: "result", val: targets[0], name: targets[0], alias: targets[0] + randomTag() };
    }
    if (features.length == 0) {
        // console.log("returning the most dominate feature!!!");
        var topTarget = mostCommon(targets);
        return { type: "result", val: topTarget, name: topTarget, alias: topTarget + randomTag() };
    }
    var bestFeature = maxGain(input, target, features);
    var remainingFeatures = _.without(features, bestFeature);
    var possibleValues = _.uniq(_.map(input, bestFeature));

    if (possibleValues.length == 0) {
        //console.log("returning the most dominate feature!!!");
        var topTarget = mostCommon(targets);
        return { type: "result", val: topTarget, name: topTarget, alias: topTarget + randomTag() };
    }

    var node = { name: bestFeature, alias: bestFeature + randomTag() };
    node.type = "feature";
    node.vals = _.map(possibleValues, function (v) {
        // console.log("creating a branch for "+v);
        var _newS = input.filter(function (x) { return x[bestFeature] == v });
        var child_node = { name: v, alias: v + randomTag(), type: "feature_value" };
        child_node.child = createTree(_newS, target, remainingFeatures);
        return child_node;
    });
    return node;
}

function entropy(vals) {
    var uniqueVals = _.uniq(vals);
    var probs = uniqueVals.map(function (x) { return prob(x, vals) });
    var logVals = probs.map(function (p) { return -p * log2(p) });
    return logVals.reduce(function (a, b) { return a + b }, 0);
}

function gain(input, target, feature) {
    var attrVals = _.uniq(_.map(input, feature));
    var setEntropy = entropy(_.map(input, target));
    var setSize = _.size(input);
    var entropies = attrVals.map(function (n) {
        var subset = input.filter(function (x) { return x[feature] === n });
        return (subset.length / setSize) * entropy(_.map(subset, target));
    });
    var sumOfEntropies = entropies.reduce(function (a, b) { return a + b }, 0);
    return setEntropy - sumOfEntropies;
}

function maxGain(input, target, features) {
    return _.max(features, function (e) { return gain(input, target, e) });
}

function prob(val, vals) {
    var instances = _.filter(vals, function (x) { return x === val }).length;
    var total = vals.length;
    return instances / total;
}

function log2(n) {
    return Math.log(n) / Math.log(2);
}

function mostCommon(l) {
    return _.sortBy(l, function (a) {
        return count(a, l);
    }).reverse()[0];
}

function count(a, l) {
    return _.filter(l, function (b) { return b === a }).length
}

function randomTag() {
    return "_r" + Math.round(Math.random() * 1000000).toString();
}