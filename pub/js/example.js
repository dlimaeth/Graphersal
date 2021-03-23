//url: https://young-castle-42730.herokuapp.com/examples.html?

/* JS Library usage examples */
"use strict";

const g1 = new Graphersal('graph1')
document.querySelector('#BFS').appendChild(g1.getGraphElement())

function generateGraph(g, n) {
    while (g.nodes.length > 0) {
        g.removeNode(0)
    }

    for (let i = 0; i < n; i++) {
        g.addNode(Math.random()*360+20, Math.random()*160+20)
    }

    for (let i = 0; i < n; i++) {
        for (let j = i+1; j < n; j++) {
            parseInt(Math.random()*n/5) ?  null : g.addEdge(i,j);
        }
    }
}

function runBFS(g) {
    let s = g.getNode(0)
    const queue = []
    queue.push([s,1])
    g.setFound(s,1)
    while (queue.length != 0) {
        const q = queue.shift()
        q[0].neigbours.forEach(edge => {
            if (!edge.node.found) {
                queue.push([edge.node, q[1]+1])
                g.setFound(edge.node, q[1]+1)
            }
        });
    }
}

function reset(g) {
    g.resetGraph()
}


/* g.addNode(100, 30)
g.addNode(70, 110)
g.addEdge(0, 1)
g.addNode(310, 50)
g.addEdge(1, 2) */
//g.colorNode(g.nodes[1], 'chartreuse')

const g2 = new Graphersal('graph2')
document.querySelector('#colors').appendChild(g2.getGraphElement())
function changeGraphColor(g, color) {
    g.nodes.forEach(node => g.colorNode(node, color))
}






const g3 = new Graphersal('graph3')
document.querySelector('#edgeCut').appendChild(g3.getGraphElement())
function changeGraphColor(g, color) {
    g.nodes.forEach(node => g.colorNode(node, color))
}

function addListeners() {
    let p = g3.getGraphElement().createSVGPoint(); 
    let q = g3.getGraphElement().createSVGPoint(); 

    g3.getGraphElement().addEventListener('mousedown', (e) => {
        if (e.target.id = g3.getGraphElement().id) {
            p.x = e.clientX;
            p.y = e.clientY;
            p =  p.matrixTransform(g3.getGraphElement().getScreenCTM().inverse());
        }
    });
    //g3.getGraphElement().addEventListener('mousemove', drag);
    g3.getGraphElement().addEventListener('mouseup', (e) => {
        q.x = e.clientX;
        q.y = e.clientY;
        q =  q.matrixTransform(g3.getGraphElement().getScreenCTM().inverse());
        g3.cutEdges(p.x, p.y, q.x, q.y)
    });
    //g3.getGraphElement().addEventListener('mouseleave', endDrag);
}
addListeners()
