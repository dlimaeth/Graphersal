/* JS Library usage examples */
"use strict";

const g = new Graphersal('myGraph')
g.addNode(100, 30)
g.addNode(70, 110)
g.addEdge(g.nodes[0], g.nodes[1])
g.addNode(310, 50)
g.addEdge(g.nodes[1], g.nodes[2])
//g.colorNode(g.nodes[1], 'chartreuse')