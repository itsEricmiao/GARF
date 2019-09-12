function ConfigGA() 
{
    this.genIndv = function() {};
    this.getFitness = function() {};
    this.mutate = function() {};
};


function GARF(GA, populationSize, mutateProbability, breedingFunction) 
{
    this.evolve = function(generations) {
        let population = this.generatePopulation(GA.genIndv, populationSize);
        for (var i = 0; i < generations; i++) {
            population = this.getFitness(population, GA.getFitness);
            population = this.sortByFitness(population, GA.getFitness, GA.goalFitness);
            printUpdate(population, i);
            population = breed(population, GA.mutate, mutateProbability, breedingFunction);
        }
        population = this.getFitness(population, GA.getFitness);
        population = this.sortByFitness(population, GA.getFitness, GA.goalFitness);
        printUpdate(population, generations);
        let results = getResults(population, GA.getFitness, generations);
        return results;
    };



    this.generatePopulation = function(genIndv, populationSize) {
        let pop = [];
        for (var i = 0; i < populationSize; i++) {
            let indv = { individual: genIndv() }
            pop.push(indv);
        }
        return pop;
    };

    this.getFitness = function(population, getFitness) {
        for (var i = 0; i < population.length; i++){
            let indv = population[i];
            indv.fitness = getFitness(indv.individual);
            population[i] = indv;
        }
        return population;
    }

    // Sort the population array
    this.sortByFitness = function(population, getFitness, goalFitness) {
        population.sort(function(a, b) {
            return (b.fitness - a.fitness) * goalFitness;
        });
        return population;
    };

    // breed population and apply mutation if probability met
    function breed(population, mutate, mutateProbability, breedingFunction) {

        // Select best individuals and remove bottom half of population
        let breeders = Math.round(population.length / 2);
        let newPopulation = population.slice(0, breeders);

        // Select parents
        while (newPopulation.length != population.length) {
            let parentAIndex = Math.floor(Math.random() * breeders);
            let parentBIndex = Math.floor(Math.random() * breeders);

            while (parentAIndex == parentBIndex) {
                parentBIndex = Math.floor(Math.random() * breeders);
            }

            let parentA = population[parentAIndex].individual;
            let parentB = population[parentBIndex].individual;

            // Create newborn
            let newborn = breedingFunction(parentA, parentB);

            // Mutate newborn
            if (Math.random() <= mutateProbability) {
                newborn = mutate(newborn);
            }
            newPopulation.push({ individual: newborn });
        }
        return newPopulation;
    };

    function getResults(population, getFitness, generations) {
        let output = {
            generations: generations,
            population: []
        };
        for (var i = 0; i < population.length; i++) {
            let indv = population[i];
            output.population.push(indv);
        }
        return output;
    };

    function printUpdate(population, generation) {
        let fittestScore = population[0].fitness;
        let sum = 0;
        for (var i = 0; i < population.length; i++) {
            sum += population[i].fitness;
        }
        let average = sum / population.length;
        console.log("Generation:", generation, "Fittest:", fittestScore, "Average:", average);
    };
};



//RF Start here: ------------------------------------------------------------------------------------------------------------------------


var dt = (function () {
          
    /*
     * Creates an instance of DecisionTree
     * builder - contains training set and some configuration parameters
     */
    function DecisionTree(builder) {        
        this.root = buildDecisionTree({
            trainingSet: builder.trainingSet,
            ignoredAttributes: arrayToHashSet(builder.ignoredAttributes),
            categoryAttr: builder.categoryAttr || 'category',
            minItemsCount: builder.minItemsCount || 1,
            entropyThrehold: builder.entropyThrehold || 0.01,
            maxTreeDepth: builder.maxTreeDepth || 80
        });
    }
          

    DecisionTree.prototype.predict = function (item) {
        return predict(this.root, item);
    }

    /*
     * Creates a forest of specific number of trees
     * builder - contains training set and some configuration parameters for building decision trees
     */
    function RandomForest(builder, treesNumber) {
        this.trees = buildRandomForest(builder, treesNumber);
    }
          
    RandomForest.prototype.predict = function (item) {
        return predictRandomForest(this.trees, item);
    }
    
    /*
     * Transforming array to object with such attributes as elements of array (afterwards it can be used as HashSet)
     */
    function arrayToHashSet(array) {
        var hashSet = {};
        if (array) {
            for(var i in array) {
                var attr = array[i];
                hashSet[attr] = true;
            }
        }
        return hashSet;
    }
    
    /*
     * Calculating how many objects have the same values of specific attribute.
     * items - array of objects
     * attr  - variable with name of attribute, which embedded in each object
     */
    function countUniqueValues(items, attr) {
        var counter = {};

        // detecting different values of attribute
        for (var i = items.length - 1; i >= 0; i--) {
            // items[i][attr] - value of attribute
            counter[items[i][attr]] = 0;
        }
          
        // counting number of occurrences of each of values
        // of attribute
        for (var i = items.length - 1; i >= 0; i--) {
            counter[items[i][attr]] += 1;
        }

        return counter;
    }
    
    /*
     * Calculating entropy of array of objects by specific attribute.
     * items - array of objects
     * attr  - variable with name of attribute, which embedded in each object
     */
    function entropy(items, attr) {
        // counting number of occurrences of each of values
        // of attribute
        var counter = countUniqueValues(items, attr);

        var entropy = 0;
        var p;
        for (var i in counter) {
            p = counter[i] / items.length;
            entropy += -p * Math.log(p);
        }

        return entropy;
    }
          
    /*
     * Splitting array of objects by value of specific attribute, using specific predicate and pivot.
     * Items which matched by predicate will be copied to the new array called 'match', and the rest of the items will be copied to array with name 'notMatch'
     * items - array of objects
     * attr  - variable with name of attribute, which embedded in each object
     * predicate - function(x, y) which returns 'true' or 'false'
     * pivot - used as the second argument when calling predicate function: e.g. predicate(item[attr], pivot)
     */

    function split(items, attr, predicate, pivot) {
        var match = [];
        var notMatch = [];

        var item,
            attrValue;
          
        for (var i = items.length - 1; i >= 0; i--) {
            item = items[i];
            attrValue = item[attr];

            if (predicate(attrValue, pivot)) {
                match.push(item);
            } else {
                notMatch.push(item);
            }
        };

        return {
            match: match,
            notMatch: notMatch
        };
    }

    /*
     * Finding value of specific attribute which is most frequent in given array of objects.
       items - array of objects
     * attr  - variable with name of attribute, which embedded in each object
     */
    function mostFrequentValue(items, attr) {
        // counting number of occurrences of each of values of attribute
        var counter = countUniqueValues(items, attr);

        var mostFrequentCount = 0;
        var mostFrequentValue;

        for (var value in counter) {
            if (counter[value] > mostFrequentCount) {
                mostFrequentCount = counter[value];
                mostFrequentValue = value;
            }
        };

        return mostFrequentValue;
    }
          
    var predicates = {
        '==': function (a, b) { return a == b },
        '>=': function (a, b) { return a >= b }
    };

    /*
     * Function for building decision tree
     */
    function buildDecisionTree(builder) {

        var trainingSet = builder.trainingSet;
        var minItemsCount = builder.minItemsCount;
        var categoryAttr = builder.categoryAttr;
        var entropyThrehold = builder.entropyThrehold;
        var maxTreeDepth = builder.maxTreeDepth;
        var ignoredAttributes = builder.ignoredAttributes;

        if ((maxTreeDepth == 0) || (trainingSet.length <= minItemsCount)) {
            // restriction by maximal depth of tree
            // or size of training set is to small
            // so we have to terminate process of building tree
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        var initialEntropy = entropy(trainingSet, categoryAttr);

        if (initialEntropy <= entropyThrehold) {
            // entropy of training set too small
            // (it means that training set is almost the same type .... whats the word for it???),
            // so we have to terminate process of building tree
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        // used as hash-set for avoiding the checking of split by rules
        // with the same 'attribute-predicate-pivot' more than once
        var alreadyChecked = {};
          
        // this variable expected to contain rule, which splits training set
        // into subsets with smaller values of entropy (produces informational gain)
        var bestSplit = {gain: 0};

        for (var i = trainingSet.length - 1; i >= 0; i--) {
            var item = trainingSet[i];

            // iterating over all attributes of item
            for (var attr in item) {
                if ((attr == categoryAttr) || ignoredAttributes[attr]) {
                    continue;
                }

                // let the value of current attribute be the pivot
                var pivot = item[attr];

                // pick the predicate
                // depending on the type of the attribute value
                var predicateName;
                if (typeof pivot == 'number') {
                    predicateName = '>=';
                } else {
                    // there is no sense to compare non-numeric attributes
                    // so we will check only equality of such attributes
                    predicateName = '==';
                }

                var attrPredPivot = attr + predicateName + pivot;
                if (alreadyChecked[attrPredPivot]) {
                    // skip such pairs of 'attribute-predicate-pivot',
                    // which been already checked
                    continue;
                }
                alreadyChecked[attrPredPivot] = true;

                var predicate = predicates[predicateName];
          
                // splitting training set by given 'attribute-predicate-value'
                var currSplit = split(trainingSet, attr, predicate, pivot);

                // calculating entropy of subsets
                var matchEntropy = entropy(currSplit.match, categoryAttr);
                var notMatchEntropy = entropy(currSplit.notMatch, categoryAttr);

                // calculating informational gain
                var newEntropy = 0;
                newEntropy += matchEntropy * currSplit.match.length;
                newEntropy += notMatchEntropy * currSplit.notMatch.length;
                newEntropy /= trainingSet.length;
                var currGain = initialEntropy - newEntropy;

                if (currGain > bestSplit.gain) {
                    // remember pairs 'attribute-predicate-value'
                    // which provides informational gain
                    bestSplit = currSplit;
                    bestSplit.predicateName = predicateName;
                    bestSplit.predicate = predicate;
                    bestSplit.attribute = attr;
                    bestSplit.pivot = pivot;
                    bestSplit.gain = currGain;
                }
            }
        }

        if (!bestSplit.gain) {
            // can't find optimal split
            return { category: mostFrequentValue(trainingSet, categoryAttr) };
        }

        // building subtrees
        builder.maxTreeDepth = maxTreeDepth - 1;

        builder.trainingSet = bestSplit.match;
        var matchSubTree = buildDecisionTree(builder);

        builder.trainingSet = bestSplit.notMatch;
        var notMatchSubTree = buildDecisionTree(builder);

        return {
            attribute: bestSplit.attribute,
            predicate: bestSplit.predicate,
            predicateName: bestSplit.predicateName,
            pivot: bestSplit.pivot,
            match: matchSubTree,
            notMatch: notMatchSubTree,
            matchedCount: bestSplit.match.length,
            notMatchedCount: bestSplit.notMatch.length
        };
    }

    /*
     * Classifying item, using decision tree
     */
    function predict(tree, item) {
        var attr,
            value,
            predicate,
            pivot;
        
        // Traversing tree from the root to leaf
        while(true) {
          
            if (tree.category) {
                // only leafs contains predicted category
                return tree.category;
            }

            attr = tree.attribute;
            value = item[attr];

            predicate = tree.predicate;
            pivot = tree.pivot;

            // move to one of subtrees
            if (predicate(value, pivot)) {
                tree = tree.match;
            } else {
                tree = tree.notMatch;
            }
        }
    }

    /**
     * Building array of decision trees
     */
    function buildRandomForest(builder, treesNumber) {
        var items = builder.trainingSet;
          
        // creating training sets for each tree
        var trainingSets = [];
        for (var t = 0; t < treesNumber; t++) {
            trainingSets[t] = [];
        }
        for (var i = items.length - 1; i >= 0 ; i--) {
          // assigning items to training sets of each tree
          // using 'round-robin' strategy
          var correspondingTree = i % treesNumber;
          trainingSets[correspondingTree].push(items[i]);
        }

        // building decision trees
        var forest = [];
        for (var t = 0; t < treesNumber; t++) {
            builder.trainingSet = trainingSets[t];

            var tree = new DecisionTree(builder);
            forest.push(tree);
        }
        return forest;
    }

    /**
     * Each of decision tree classifying item
     * ('voting' that item corresponds to some class).
     *
     * This function returns hash, which contains 
     * all classifying results, and number of votes 
     * which were given for each of classifying results
     */
    function predictRandomForest(forest, item) {
        var result = {};
        for (var i in forest) {
            var tree = forest[i];
            var prediction = tree.predict(item);
            result[prediction] = result[prediction] ? result[prediction] + 1 : 1;
        }
        return result;
    }

    var exports = {};
    exports.DecisionTree = DecisionTree;
    exports.RandomForest = RandomForest;
    return exports;
})();



function Algorithms() {};

Algorithms.singleCrossOver = function(parentA, parentB) {
    // // Select cutOff point and create newborn
    // let cutOff = Math.floor(Math.random() * parentA.length);
    // let newborn = parentA.slice(0, cutOff + 1);
    // let parentBChrom = parentB.slice(cutOff + 1, parentB.length);

    // for (var i = 0; i < parentBChrom.length; i++) {
    //     newborn.push(parentBChrom[i]);
    // }
    // return newborn;
}

// Training set
var data = 
 [{compound: 'SMU_001', feature_1: 10, feature_2: 200, feature_3: 45, result: 'Postive'},
 {compound: 'SMU_002', feature_1: 20, feature_2: 700, feature_3: 3, result: 'Negative'},
 {compound: 'SMU_003', feature_1: 13, feature_2: 245, feature_3: 54, result: 'Postive'},
 {compound: 'SMU_004', feature_1: 12, feature_2: 267, feature_3: 65, result: 'Postive'},
 {compound: 'SMU_005', feature_1: 13, feature_2: 256, feature_3: 45, result: 'Postive'},
 {compound: 'SMU_006', feature_1: 11, feature_2: 254, feature_3: 34, result: 'Postive'},
 {compound: 'SMU_007', feature_1: 32, feature_2: 900, feature_3: 9, result: 'Negative'},
 {compound: 'SMU_008', feature_1: 15, feature_2: 222, feature_3: 41, result: 'Postive'},
 {compound: 'SMU_009', feature_1: 13, feature_2: 224, feature_3: 45, result: 'Postive'},
 {compound: 'SMU_010', feature_1: 45, feature_2: 987, feature_3: 8, result: 'Negative'}
 ];


// Configuration for DT
var config = {
 trainingSet: data, 
 categoryAttr: 'result', 
 ignoredAttributes: ['compound']
};

function generateIndividual() {
    let arr = [];
    for (var i = 0; i < 5; i++)
    {
        var decisionTree = new dt.DecisionTree(config)
        var numberOfTrees = 5;
        var randomForest = new dt.RandomForest(config, numberOfTrees);
        arr.push(decisionTree)
    }
	return arr;
};


function getFitness(individual) {
	let fitness = 0;
	for(var i = 0; i < individual.length; i++) {
		fitness += individual[i] == 1 ? 1 : 0;
	}
	return fitness;
}


function mutate(individual) {
	let mutatedIndex = Math.floor(Math.random() * individual.length);
	individual[mutatedIndex] = individual[mutatedIndex] == 1 ? 0 : 1;
	return individual;
}

// Config GA
var GA = new ConfigGA();
GA.genIndv = generateIndividual;
GA.getFitness = getFitness;
GA.mutate = mutate;

// Create parameters
var populationSize = 10;
var mutateProbability = 0.1;
var generations = 10;
var crossOverFunction = Algorithms.singleCrossOver;


    var output = generateIndividual();
    for(var i = 0; i < output.length; i++)
    {
        //x = JSON.stringify(output[i])
        // x = output[i]
        // y = JSON.stringify(x)
        // console.log ()
        // console.log ()
        // console.log (x)
        // console.log (y)
        x = JSON.stringify(output[i])
        console.log(JSON.parse(x))
    }
   
    
    


// Create genetic algorithm 
// var gen = new GARF(GA, populationSize, mutateProbability, crossOverFunction);
// var output = gen.evolve(generations); // OUTPUT IS AN OBJECT
// x = JSON.stringify(output)
// console.log(x); 
