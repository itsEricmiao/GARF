import * as Command from './Command.js';

var configFile = {
    oldScore: 0.0,
    newScore: 0.0,
    prevTrees: [],
    commands: ["init", "train", "bestTrees"]
}

export function main(config) {
    let task = new Command.Command(config);
    for (var i = 0; i < config.commands.length; i++) {
        task.execute(config.commands[i])
    }
    var output = task._output();
    console.log("Score of current generation:", output.newScore) //Score of current generation: 73.68421052631578
    return output
}

let output = main(configFile)
// console.log(output) // Promise {}

