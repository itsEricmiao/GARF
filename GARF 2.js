import * as GA from './GA.js';
import * as RF from './RF.js';


function generateIndividual()
{
    var forest = new RF.RandomForest(training, target_name, features, {
        numTrees: 10,	// how many trees should we use (results are averaged together)
        percentData: 1,			// what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
        percentFeatures: 1	// what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
    });
    return forest;
}

function getFitness(indv) 
{
    // indv contains a single decison trees
    // we want to loop through all the trees and get the top n%
    return indv.featureImportance();   

}

function mutate(indv) 
{
    return indv;
}

// Create a config
// var config = new GA.GAConfig();
// config.genIndv = generateIndividual;
// config.getFitness = getFitness;
// config.mutate = mutate;

// // Create parameters
// var popSize = 5;
// var mutProb = 0;
// var generations = 2;
// var breedFunction = GA.Algorithms.crossBreed;

// // Create genetic algorithm and evolve individuals
// var gen = new GA.GeneticAlgorithm(config, popSize, mutProb, breedFunction);
// console.log("Inheritance Example:", (gen.evolve(generations)));


var forest = new RF.RandomForest(training, target_name, features, {
    numTrees: 5,	            // how many trees should we use (results are averaged together)
    percentData: .8,			// what percentage of training data should each tree see (bootstrapping) - For larger datasets I find .15 works well
    percentFeatures: 1	        // what percentage of features should each tree see (feature bagging) - For larger datasets I find .7 works well
});
console.log(JSON.stringify(forest.train(training), null, "\t"));