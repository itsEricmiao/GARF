// This is the data structure class 

class AdjList
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

var g = new AdjList(6);
var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
for(var i = 0; i < vertices.lenggith; i++)
{
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