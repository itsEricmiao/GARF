//Main.js
//Testing purpose for now

const Property = require('./Property.js')
const Component = require('./Component.js')
const CSV_parser = require('./ImportCSV.js')
const Graph = require('./AdjList.js')


function TEST_COMPONENT_PROPERTY() 
{
    let arr = [];
    for (let i = 0; i < 10; i++) 
    {
        let name = "F" + i;
        let value = Math.random();
        let p = new Property();
        p.quickSetting(name, value);
        arr.push(p);
    }
}


function TEST_ADJLIST() 
{
    //Test case 1: Untemplated
    var g = new Graph(6);
    var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (var i = 0; i < vertices.length; i++) 
    {
        g.addVertex(vertices[i]);
    }
    g.addEdge('A', 'data_1');
    g.addEdge('A', 'data_2');
    g.addEdge('A', 'data_3');
    g.addEdge('B', 'data_4');
    g.addEdge('D', 'data_5');
    g.addEdge('E', 'data_6');
    g.addEdge('E', 'data_7');
    g.addEdge('C', 'data_8');
    g.addEdge('F', 'data_9');

    g.printGraph();

}

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

function TEST_IMPORTCSV_SMALL_DATA() 
{
    let parser = new CSV_parser();
    parser.set_data_file_path('./Test_Data/test_data_small.csv');
    parser.read_data_from_CSV();
    var data = parser.get_data();
    var headers = parser.get_headers();
    var single_header = headers.split(',');
    let rows = data.split('\n');

    let all_c = [];
    for (let i = 0; i < 10; i++) 
    {
        let each_row = rows[i];
        let individual_feature_num = each_row.split(',');
        let compound_name = individual_feature_num[0];
        let c = new Component();
        c.setName(compound_name);
        let arr = [];
        for (let j = 1; j < 9; j++) 
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


function TEST_TREE()
{
const SAMPLE_DATASET = require('data/sample.json');
const SAMPLE_DATASET_CLASS_NAME = 'liked';

var assert = require('assert');
var ID3 = require('lib/decision-tree');

describe('ID3 Decision Tree', function() {
  var dt;
  before(function() {
    dt = new ID3(SAMPLE_DATASET.data, SAMPLE_DATASET_CLASS_NAME, SAMPLE_DATASET.features);
  });

  it('should initialize', function() {
    assert.ok(dt);
  });

  it('should train on the dataset', function() {
    assert.ok(dt.toJSON());
  });

  it('should predict on a sample instance', function() {
    var sample = SAMPLE_DATASET.data[0];
    var predicted_class = dt.predict(sample);
    var actual_class = sample[SAMPLE_DATASET_CLASS_NAME];
    assert.equal(predicted_class, actual_class);
  });

  it('should evaluate perfectly on training dataset', function() {
    var accuracy = dt.evaluate(SAMPLE_DATASET.data);
    assert.equal(accuracy, 1);
  });

  it('should provide access to the underlying model as JSON', function() {
    var treeModel = dt.toJSON();
    assert.equal(treeModel.constructor, Object);
    assert.equal(treeModel.vals.constructor, Array);
    assert.equal(treeModel.vals.length, 3);
  });
});
}

//TEST_IMPORTCSV_SMALL_DATA();
// TEST_TREE();
TEST_ADJLIST();