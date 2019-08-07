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



    // let header = get_headers();
    // var data = import_CSV();
    // let res = data.split('\n');

    // for (i in res) 
    // {
    //     console.log("Row", i ,"in dataset is: " , res[i]);
    //     let element = res[i];
    //     let indv = element.split(',');
    //     console.log(indv);
    //     console.log(" ");
    // }
}
module.exports = ImportCSV;