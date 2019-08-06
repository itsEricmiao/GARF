/*
    Import CSV files and convert to AdjList data structure
    Import using fs
*/

console.log("This is Import CSV function");
var fs = require('fs');

try {
    var data = fs.readFileSync('test_data_small.csv', 'utf8');

} catch (e) {
    console.log('ERROR in ImportCSV Module: Cannot find File', e.stack);
}

let res = data.split('\n');
console.log("First row of the data: ", res[1]);
for (i in res) {
    let element = res[i];
    let indv = element.split(',');
    console.log(indv);
    console.log(" ");
}


//var news = res.split('\r');å
// console.log(res);  
