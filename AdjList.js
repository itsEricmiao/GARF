// This is the data structure class 

class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    addVertex(v) //It adds the vertex v as key to adjList and init its values with an array
    {
        this.AdjList.set(v, []);
    }

    addEdge(v, w) //It adds an edge between the src and dest
    {
        this.AdjList.get(v).push(w);
        //this.AdjList.get(w).push(v);
    }

    printGraph() {
        var get_keys = this.AdjList.keys();
        for (var i of get_keys) {
            var get_values = this.AdjList.get(i);
            var conc = "";
            for (var j of get_values) {
                conc += j + " ";
            }
            console.log(i + " -> " + conc);
        }
    }
    

    createSampleData() 
    {
        const Property = require('./Property.js')
        const Component = require('./Component.js')
        const CSV_parser = require('./ImportCSV.js')
        var g = new Graph(6);
        var vertices = ['feature_A', 'feature_B', 'feature_C', 'feature_D', 'feature_E', 'feature_F'];
        for (var i = 0; i < vertices.length; i++) 
        {
            g.addVertex(vertices[i]);
        }
        g.addEdge('feature_A', 0.43534534);
        g.addEdge('feature_B', 0.324);
        g.addEdge('feature_C', 0.23432);
        g.addEdge('feature_D', 0.256532);
        g.addEdge('feature_E', 0.7653);
        g.addEdge('feature_F', 0.64236);

        return g;
    }

    TESTING() 
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
}

module.exports = Graph;
