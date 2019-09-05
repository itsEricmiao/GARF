function GARF() {
    this.genIndv = function() {};
    this.getFitness = function() {};
    this.mutate = function() {};
    this.goalFitness = GARF.fitnessMax;
};

GARF.fitnessMax = 1;
GARF.fitnessMin = -1;

function GeneticAlgorithm(GARF, popSize, mutProb, breedFunction, verbose = false) 
{

    checkConstructorVars(GARF, popSize, mutProb, breedFunction);

    // Make sure all attributes are valid
    function checkConstructorVars(GARF, popSize, mutProb, breedFunction) {
        if(GARF === undefined) {
            throw 'GARF must be defined';
        }

        if(popSize === undefined) {
            throw 'Population size must be defined';
        }

        if (popSize <= 2) {
            throw 'Population size must be greater than 2. Current size: ' + popSize;
        }

        if(mutProb === undefined) {
            throw 'Mutability probability must be defined';
        }

        if(breedFunction === undefined) {
            throw 'Breed function must be defined';
        }
    };

    

    this.evolve = function(generations) {
        let population = this.generatePopulation(GARF.genIndv, popSize);

        for (var i = 0; i < generations; i++) {
            population = this.getFitness(population, GARF.getFitness);
            population = this.sortByFitness(population, GARF.getFitness, GARF.goalFitness);

            //if (verbose) printUpdate(population, i);
            population = breed(population, GARF.mutate, mutProb, breedFunction);
        }
        population = this.getFitness(population, GARF.getFitness);
        population = this.sortByFitness(population, GARF.getFitness, GARF.goalFitness);
        // if (verbose) printUpdate(population, generations);
        let results = getResults(population, GARF.getFitness, generations);
        return results;
    };



    // Generate a population with the given individual
    // Generation strategy and population size
    this.generatePopulation = function(genIndv, popSize) {
        let pop = [];
        for (var i = 0; i < popSize; i++) {
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
    function breed(population, mutate, mutProb, breedFunction) {

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
            let newborn = breedFunction(parentA, parentB);

            // Mutate newborn
            if (Math.random() <= mutProb) {
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

Algorithms.crossBreed = function(parentA, parentB) {
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
    User define how to create an individual
    User define how to measure the fittness of an individual
    User define how to mutate an individual
*/

function generateIndividual() {
	let array = [];
	for(var i = 0; i < 10; i++){
        x = Math.round(Math.random());
		array.push(x);
	}
	return array;
};

function getFitness(indv) {
	let fitness = 0;
	for(var i = 0; i < indv.length; i++) {
		fitness += indv[i] == 1 ? 1 : 0;
	}
	return fitness;
}

function mutate(indv) {
	let mutatedIndex = Math.floor(Math.random() * indv.length);
	indv[mutatedIndex] = indv[mutatedIndex] == 1 ? 0 : 1;
	return indv;
}

// Create a GARF
var GARF = new GARF();
GARF.genIndv = generateIndividual;
GARF.getFitness = getFitness;
GARF.goalFitness = GARF.fitnessMax;
GARF.mutate = mutate;

// Create parameters
var popSize = 10;
var mutProb = 0.2;
var generations = 5;
var breedFunction = Algorithms.crossBreed;

// Create genetic algorithm and evolve individuals
var gen = new GeneticAlgorithm(GARF, popSize, mutProb, breedFunction, true);
console.log("Example:", '\n' , gen.evolve(generations));
gen.getArr(generations);
