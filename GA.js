// This is the interface class for Genetic Algorithm
const Stack = require("./AdjList");
const GARF = require("./GARF");
var data = new Stack();
data = data.createSampleData();

// Init function will call GARF's functions to initialize a genetic algorithm 
// This function should only be called once only. 
var INIT = function()
{
    
    console.log("GA: Calling the Init command")
}

// Generate function will call GARF functions to generate a new generation of trees (A new Forest)
var GENERATE = function()
{
    console.log("GA: Calling the Init command")
}


var FITNESS = function()
{
    console.log("GA: Calling the Fitness command")
}


var SELECTION = function()
{
    console.log("GA: Calling the Selection command")
}


var MATING = function()
{
    console.log("GA: Calling the Mating command")
}


var MUTATE = funciton()
{
    console.log("GA: Calling the Mutate command")
}

