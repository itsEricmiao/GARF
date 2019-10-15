import * as Command from './Command.js';

var configFile = {
    type: "smu-clustering",
    score: 0.0,
    prevTrees: [],
    commands: ["init", "train", "bestTrees"] 
}

export async function main(config) {
    let task = new Command.Command(config);
    for (var i = 0; i < config.commands.length; i++) {
        task.execute(config.commands[i])
    }
    var output = task._output();
    return output
}

(async()=>{
    let output = await main(configFile)
    console.log(output.prevTrees)
})();


