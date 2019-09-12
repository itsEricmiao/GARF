/*
    Import CSV files and convert to AdjList data structure
    Import using fs (Node.js File System Module)...
    
    - Come back for fs later???
    - Need to fix col and row later
*/

const Component = require('./Component.js')
var fs = require('fs'); 

class ImportCSV 
{
    constructor() 
    {
        this.CSV_name = [];
        this.data = [];
    }


    read_data_from_CSV()
    {
        try 
        {
            var all_data = fs.readFileSync(this.CSV_name, 'utf8');

        } catch (e) 
        {
            console.log('ERROR in ImportCSV Module: Cannot find File', e.stack);
        }
        this.data = all_data
    }

    get_data() 
    {
        return this.data;
    }

    //This function will return the headers of the dataset
    get_headers() 
    {
        let header = this.data.split('\n')[0];
        return header;
    }

    set_data_file_path(file_path) 
    {
        this.CSV_name = file_path;
    }

   
}
module.exports = ImportCSV;



//  let header = get_headers();
//  var data = import_CSV();
//  let res = data.split('\n');
 
//  for (i in res) 
//  {
//      console.log("Row", i ,"in dataset is: " , res[i]);
//      let element = res[i];
//      let indv = element.split(',');
//      console.log(indv);
//      console.log(" ");
//  }

function TEST_IMPORTCSV_REAL_DATA() 
{
    let parser = new CSV_parser();
    parser.set_data_file_path('./Test_Data/data.csv');
    //parser.set_data_file_path('./Test_Data/test_data_small.csv');
    parser.read_data_from_CSV();
    var data = parser.get_data();
    var headers = parser.get_headers();
    var single_header = headers.split(',');
    let rows = data.split('\n');

    
    let all_c = [];
    for (let i = 0; i < 63; i++) 
    {
        let each_row = rows[i];
        let individual_feature_num = each_row.split(',');
        let compound_name = individual_feature_num[0];
        let c = new Component();
        c.setName(compound_name);
        let arr = [];
        for (let j = 1; j < 94; j++) 
        {
            let value = individual_feature_num[j];
            let p = new Property();
            p.quickSetting(single_header[j], value);
            arr.push(p);
        }
        c.setProperties(arr);
        c.setClassification(1);
        all_c.push(c);
    }

    for (i in all_c) 
    {
        all_c[i].printComponent();
        console.log("");
    }
}