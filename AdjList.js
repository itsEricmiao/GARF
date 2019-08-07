// This is the data structure class 

class Graph
{
    constructor(noOfVertices)
    {
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
        this.AdjList.get(w).push(v);
    }

    printGraph()
    {
        var get_keys = this.AdjList.keys();
        for (var i of get_keys)
        {
            var get_values = this.AdjList.get(i);
            var conc = "";
            for (var j of get_values)
            {
                conc += j+ " ";
            }
            console.log(i + " -> " + conc);
        }
    }
}

module.exports = Graph;
