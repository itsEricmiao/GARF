function ConfigGA() {
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

function Algorithms() {};

Algorithms.singleCrossOver = function(parentA, parentB) {
    // Select cutOff point and create newborn
    let cutOff = Math.floor(Math.random() * parentA.length);
    let newborn = parentA.slice(0, cutOff + 1);
    let parentBChrom = parentB.slice(cutOff + 1, parentB.length);

    for (var i = 0; i < parentBChrom.length; i++) {
        newborn.push(parentBChrom[i]);
    }
    return newborn;
}


/* 
    Simple Unit Test using Array[ ] 
    User defines how to create an individual
    User defines how to measure the fittness of an individual
    User defines how to mutate an individual
*/
function generateIndividual() {
	let array = [];
	for(var i = 0; i < 20; i++){ //manually set the number of elements in the array
        x = Math.round(Math.random());
		array.push(x);
	}
	return array;
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
var populationSize = 20;
var mutateProbability = 0.1;
var generations = 10;
var crossOverFunction = Algorithms.singleCrossOver;

// Create genetic algorithm 
var gen = new GARF(GA, populationSize, mutateProbability, crossOverFunction);
var output = gen.evolve(generations); // OUTPUT IS AN OBJECT
console.log(output);