// This is the GARF class. GARF connects GA interface with RF algorithm
const RandomForest = require('./RF');
const GeneticAlgorithm = require('./GA');
class GARF {
    constructor(RF) 
    {
        this.cur_generation = RF;
    }

    Init() 
    {
        console.log("GARF: Init function");
    }


    Generate() 
    {
        console.log("GARF: Generate function");
    }


    Fitness() 
    {
        console.log("GARF: Fitness function");
    }


    Selection()
    {
        console.log("GARF: Selection function");
    }

    Mating()
    {
        console.log("GARF: Mating function");
    }

}