//Main.js
//Testing purpose for now

const Property = require('./Property.js')
const Component = require('./Component.js')
const CSV_parser = require('./ImportCSV.js')
const Graph = require('./AdjList.js')


function TEST_COMPONENT_PROPERTY() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        let name = "F" + i;
        let value = Math.random();
        let p = new Property();
        p.quickSetting(name, value);
        arr.push(p);
    }
}


function TEST_ADJLIST() {
    //Test case 1: Untemplated
    var g = new Graph(6);
    var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (var i = 0; i < vertices.length; i++) {
        g.addVertex(vertices[i]);
    }
    g.addEdge('A', 'B');
    g.addEdge('A', 'D');
    g.addEdge('A', 'E');
    g.addEdge('B', 'C');
    g.addEdge('D', 'E');
    g.addEdge('E', 'F');
    g.addEdge('E', 'C');
    g.addEdge('C', 'F');

    g.printGraph();

}

function TEST_IMPORTCSV() {
    let parser = new CSV_parser();
    // parser.set_data_file_path('./Test_Data/data.csv');
    parser.set_data_file_path('./Test_Data/test_data_small.csv');
    parser.read_data_from_CSV();
    var data = parser.get_data();
    var headers = parser.get_headers();
    var single_header = headers.split(',');
    let rows = data.split('\n');

    let all_c = [];
    for (let i = 0; i < 10; i++) {
        let each_row = rows[i];
        let individual_feature_num = each_row.split(',');
        let compound_name = individual_feature_num[0];
        let c = new Component();
        c.setName(compound_name);
        let arr = [];
        for (let j = 1; j < 9; j++) {
            let value = individual_feature_num[j];
            let p = new Property();
            p.quickSetting(single_header[j], value);
            arr.push(p);
        }
        c.setProperties(arr);
        c.setClassification(1);
        all_c.push(c);
    }

    for (i in all_c) {
        all_c[i].printComponent();
        console.log("");
    }
}


