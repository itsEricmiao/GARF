/*
    Import CSV files and convert to AdjList data structure
    Import using fs
*/

const Component = require('./Component.js')

console.log("This is Import CSV function");
var fs = require('fs');
var CSV_name = [];


function import_CSV() {
    try {
        var all_data = fs.readFileSync(CSV_name, 'utf8');

    } catch (e) {
        console.log('ERROR in ImportCSV Module: Cannot find File', e.stack);
    }
    return all_data;
}


//This function will return the header of the dataset
function get_headers()
{
    let data = import_CSV();
    let header = data.split('\n')[0];
    return header;
}


CSV_name = "./Test_Data/test_data_small.csv";
let header = get_headers();
var data = import_CSV();
let res = data.split('\n');

for (i in res) 
{
    console.log("Row", i ,"in dataset is: " , res[i]);
    let element = res[i];
    let indv = element.split(',');
    console.log(indv);
    console.log(" ");
}

let c = new Component();