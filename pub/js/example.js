//url: https://young-castle-42730.herokuapp.com/examples.html?

/* JS Library usage examples */
"use strict";

const g1 = new Graphersal('graph1', false)
document.querySelector('#BFS').appendChild(g1.getGraphElement())

function generateGraph(g, n, checked) {
    while (g.nodes.length > 0) {
        g.removeNodeByIndex(0)
    }
    g.edgeFill = true

    for (let i = 0; i < n; i++) {
        g.addNode(Math.random()*360+20, Math.random()*160+20)
    }

    for (let i = 0; i < n; i++) {
        for (let j = i+1; j < n; j++) {
            parseInt(Math.random()*n/5) ?  null : g.addEdge(i,j, parseInt(Math.random()*n));
        }
    }
    if (checked) {
        checked[0] ? null : g.toggleNodeFill()
        checked[1] ? null : g.toggleNodeLabels()
        checked[2] ? null : g.toggleEdgeFill()
        checked[3] ? g.toggleEdgeLabels() : null
    }
}

g1.graphElement.addEventListener('mousedown', (e) => {
    //https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
    if (e.button == 0 && e.target === g1.graphElement && document.getElementById('addcheck1').checked) {
        const dim = e.target.getBoundingClientRect();
        const x = e.clientX - dim.left;
        const y = e.clientY - dim.top;
        g1.addNode(x, y)
    }
    else if (e.button == 0 && document.getElementById('removecheck1').checked && (e.target.classList.contains('node') || e.target.classList.contains('image'))) {
        g1.removeNodeByElement(e.target)
    }
});

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

// https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html
let src;
window.addEventListener('load', function() {
    document.querySelector('#pic').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            src = URL.createObjectURL(this.files[0]); // set src to blob url

        }
    });
  });

  function addImage(g, nodeIndex) {
      g.removeImage(nodeIndex)
      g.addImage(nodeIndex, src)
  }






const g3 = new Graphersal('graph3', false)
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



const g4 = new Graphersal('graph4', true)
document.querySelector('#DFS').appendChild(g4.getGraphElement())

g4.graphElement.addEventListener('mousedown', (e) => {
    //https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
    if (e.button == 0 && e.target === g4.graphElement && document.getElementById('addcheck4').checked) {
        const dim = e.target.getBoundingClientRect();
        const x = e.clientX - dim.left;
        const y = e.clientY - dim.top;
        g4.addNode(x, y)
    }
    else if (e.button == 0 && document.getElementById('removecheck4').checked && (e.target.classList.contains('node') || e.target.classList.contains('image'))) {
        g4.removeNodeByElement(e.target)
    }
});
function runDFS(g) {
    // Create a Stack and add our initial node in it
    const stack = []
    stack.push(g.getNode(0))
 
    // Mark the first node as explored
    let i = 0
    g.setFound(stack[0],++i)
 
    // We'll continue till our Stack gets empty
    while (stack.length != 0) {
         const q = stack.pop()
         q.neigbours.forEach(edge => {
             if (edge.first && !edge.node.found) {   // use first attribute for directed graphs
                 stack.push(edge.node)
                 g.setFound(edge.node, ++i)
             }
             });
     }
 }


const g5 = new Graphersal('graph5', true)
document.querySelector('#Dijkstra').appendChild(g5.getGraphElement())

g5.graphElement.addEventListener('mousedown', (e) => {
    //https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
    if (e.button == 0 && e.target === g5.graphElement && document.getElementById('addcheck5').checked) {
        const dim = e.target.getBoundingClientRect();
        const x = e.clientX - dim.left;
        const y = e.clientY - dim.top;
        g5.addNode(x, y)
    }
    else if (e.button == 0 && document.getElementById('removecheck5').checked && (e.target.classList.contains('node') || e.target.classList.contains('image'))) {
        g5.removeNodeByElement(e.target)
    }
});

function generateGraph5() {
    generateGraph(g5, document.querySelector("#n5").value)
    document.querySelector("#nf5").checked ? null : g5.toggleNodeFill()
    document.querySelector("#nl5").checked ? null : g5.toggleNodeLabels()
    document.querySelector("#ef5").checked ? null : g5.toggleEdgeFill()
    document.querySelector("#el5").checked ? g5.toggleEdgeLabels() : null
    
}


function runDijkstra(g) {
    const R = []
    const d = []
    const s = g.nodes[0]
    let f = 0
    R.push(s)
    g.setFound(s, ++f)
    g.nodes.forEach((v,i) => {
        const edgeIndex = s.neigbours.findIndex(e => e.first && e.node === v)
        if (i === 0) {
            d.push(0)
        }
        else if (edgeIndex !== -1) {
            d.push(s.neigbours[edgeIndex].weight)
        }
        else {
            d.push(Infinity)
        }
    })

    while (R.length !== g.nodes.length) {
        let minIndex = g.nodes.findIndex(node => !R.includes(node));
        d.forEach((dist,i) => minIndex = dist < d[minIndex] && !R.includes(g.nodes[i]) ? i : minIndex)
        const u = g.nodes[minIndex]
        R.push(u)
        g.setFound(u, ++f)
        
        d.forEach((dist,i) => {
            const vindex = u.neigbours.findIndex(e => e.first && e.node === g.nodes[i])
            if (vindex !== -1) {
                d[i] = d[minIndex] + u.neigbours[vindex].weight < dist ? d[minIndex] + u.neigbours[vindex].weight : dist
            }
        })
    }
}
