//Main.js
//Testing purpose for now

const Property = require('./Property.js')
const Component = require('./Component.js')
const CSV_parser = require('./ImportCSV.js')

let parser = new CSV_parser();
// parser.set_data_file_path('./Test_Data/data.csv');
parser.set_data_file_path('./Test_Data/test_data_small.csv');
parser.read_data_from_CSV();
var data = parser.get_data();
var headers = parser.get_headers();
var single_header = headers.split(',');
let rows = data.split('\n');
console.log(rows);
let arr = [];
for (i in rows) 
{
    //console.log("Row", i, "in dataset is: ", rows[i]);
    let each_row = rows[i];
    let individual_feature_num = each_row.split(',');
    let compound_name = individual_feature_num[0];
    //console.log(individual_feature_num);
    for (let j = 1; j < 8; j++) 
    {
        let value = individual_feature_num[j+1];
        let p = new Property();
        p.quickSetting(single_header[j], value);
        arr.push(p);
    }
    // console.log(" ");
}


// let arr = [];
// for (let i = 0; i < 10; i++) {
//     let name = "F" + i;
//     let value = Math.random();
//     let p = new Property();
//     p.quickSetting(name, value);
//     arr.push(p);
// }

let c = new Component();
c.setName("SMU_001");
c.setClassification(1);
c.setProperties(arr);
c.printComponent();