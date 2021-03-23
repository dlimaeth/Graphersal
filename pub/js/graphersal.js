/* JS Libraries */
"use strict";
console.log('----------')
console.log('SCRIPT: Creating and loading our JS libraries')

// Helpers

function _addNode(cx, cy, graph) {
    const node = {}
    const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    nodeElement.setAttribute('cx', `${cx}`)
    nodeElement.setAttribute('cy', `${cy}`)
    nodeElement.setAttribute('r', '20')
    nodeElement.setAttribute('stroke', 'black')
    nodeElement.setAttribute('fill', 'red')
    nodeElement.classList = 'node'
    
    node.element = nodeElement
    node.neigbours = []
    node.found = false
    // why not use a little jQuery:
    graph.nodeElements.appendChild(nodeElement)
    graph.nodes.push(node) // add to the node to list

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textElement.setAttribute('x', `${cx}`)
    textElement.setAttribute('y', `${cy  + 5}`)
    textElement.setAttribute('fill', 'black')
    textElement.innerHTML = `${graph.nodes.length}`
    textElement.setAttribute('font-size', '20')
    textElement.setAttribute('text-anchor', 'middle')
    textElement.classList = 'text'
    graph.textElements.appendChild(textElement)
    node.textElement = textElement
}

function _removeNode(node, graph) {
    node.neigbours.forEach(neigbour => {
        neigbour.node.neigbours = neigbour.node.neigbours.filter(edge => edge.node !== node)
        graph.edgeElements.removeChild(neigbour.edgeElement)
    })
    
    graph.textElements.removeChild(node.textElement)
    graph.nodeElements.removeChild(node.element)
    graph.nodes = graph.nodes.filter(p => p !== node)
    graph.nodes.forEach((node, i) => {
        node.textElement.innerHTML = `${i+1}`
    })
}

// Assumes an edge already exists between these nodes
function _setEdge(node1, node2) {
    
    let index = node1.neigbours.findIndex(obj => {
        return obj.node === node2
    })

    let edgeElement = node1.neigbours[index].edgeElement

    let x1, y1, x2, y2;
    if (node1.neigbours[index].first) {
        x1 = node1.element.cx.baseVal.value
        y1 = node1.element.cy.baseVal.value
        x2 = node2.element.cx.baseVal.value
        y2 = node2.element.cy.baseVal.value
    }
    else {
        x1 = node2.element.cx.baseVal.value
        y1 = node2.element.cy.baseVal.value
        x2 = node1.element.cx.baseVal.value
        y2 = node1.element.cy.baseVal.value
    }

    let norm = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
    let d1 = (x2 - x1) / norm
    let d2 = (y2 - y1) / norm


    edgeElement.setAttribute('x1', `${x1+20*d1}`)
    edgeElement.setAttribute('y1', `${y1+20*d2}`)
    edgeElement.setAttribute('x2', `${x2-20*d1}`)
    edgeElement.setAttribute('y2', `${y2-20*d2}`)  
    
}

function _removeEdge(node1, node2, graph) {
    let edgeElement;
    node1.neigbours = node1.neigbours.filter(e => {
        edgeElement = e.edgeElement
        return e.node !== node2
    })
    node2.neigbours = node2.neigbours.filter(e => e.node !== node1)
    graph.edgeElements.removeChild(edgeElement)
}

function _orientation(p, q, r) { 
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    let val = (q[1] - p[1]) * (r[0] - q[0]) - 
              (q[0] - p[0]) * (r[1] - q[1]); 
  
    if (val == 0) return 0;  // colinear 
  
    return (val > 0)? 1: 2; // clock or counterclock wise 
} 

function _doIntersect(p1, q1, p2, q2) { 
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = _orientation(p1, q1, p2); 
    let o2 = _orientation(p1, q1, q2); 
    let o3 = _orientation(p2, q2, p1); 
    let o4 = _orientation(p2, q2, q1); 
  
    // General case 
    return o1 != o2 && o3 != o4;

}

// Main library code
function Graphersal(graphID, height, width) {
	// the constructor function should instantiate any variables that
	//  each Circle Generator instance should have a unique version of.
	//  In this case, each CG should have its own array of circles separate from
	//  other CGs.
    this.graphElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const h = height ? height : 200;
    const w = width ? width : 400
    this.graphElement.style = `position: relative; width: ${w}px; height: ${h}px;`
    this.graphElement.id = graphID
    //document.querySelector('body').append(this.graphElement)

    this.textElements = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.edgeElements = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.nodeElements = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.graphElement.appendChild(this.edgeElements)
    this.graphElement.appendChild(this.nodeElements)
    this.graphElement.appendChild(this.textElements)
    
	this.nodes = []
    //this.edges = []
	this.edgeFill = true

    this.selectedElement = null
    // https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    this.graphElement.addEventListener('mousedown', startDrag);
    this.graphElement.addEventListener('mousemove', drag);
    this.graphElement.addEventListener('mouseup', endDrag);
    this.graphElement.addEventListener('mouseleave', endDrag);

    /* const graphElement = this.graphElement
    const nodes = this.nodes */
    const g = this
    function getMousePosition(evt) {
        return {
          x: evt.clientX,
          y: evt.clientY
        };
      }
    let selectedElement = null
    let offset = null;
    function startDrag(evt) {
        if (evt.target.classList.contains('node')) {
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            offset.x -= parseFloat(selectedElement.getAttributeNS(null, "cx"));
            offset.y -= parseFloat(selectedElement.getAttributeNS(null, "cy"));
        }
    }
    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var dragX = evt.clientX;
            var dragY = evt.clientY;
            selectedElement.setAttribute('cx', `${dragX - offset.x}`)
            selectedElement.setAttribute('cy', `${dragY - offset.y}`)

            // updating edge positions
            let index = g.nodes.findIndex(node => {
                return node.element === selectedElement
            })
            g.nodes[index].neigbours.forEach(edge => {
                _setEdge(g.nodes[index], edge.node)
            });
            //update text position
            g.nodes[index].textElement.setAttribute('x', `${dragX - offset.x}`)
            g.nodes[index].textElement.setAttribute('y', `${dragY - offset.y + 5}`)

        }
    }
    function endDrag(evt) {
        selectedElement = null;
    }

    // User can add this themselves
    /* this.graphElement.addEventListener('mousedown', (e) => {
        if (e.button == 2) {
            e.preventDefault()
            console.log('right clicked')
            _addNode(e.clientX, e.clientY, this)
        }
    }); */

    //window.oncontextmenu = function(e) { e.preventDefault();}
}

Graphersal.prototype = {

	addNode: function(cx, cy) {
        _addNode(cx, cy, this)
	},

    addEdge: function(index1, index2) {
        const node1 = this.nodes[index1]
        const node2 = this.nodes[index2]
        let index = node1.neigbours.findIndex(obj => {
            return obj.node === node2
        })

        let edgeElement; 
        if (index == -1) {
            edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            edgeElement.setAttribute('stroke', 'black')
            edgeElement.setAttribute('stroke-opacity', `${this.edgeFill ? 1.0 : 0.0}`)
            this.edgeElements.appendChild(edgeElement)
            node1.neigbours.push({node: node2, edgeElement: edgeElement, first: true})
            node2.neigbours.push({node: node1, edgeElement: edgeElement, first: false})
            
            _setEdge(node1, node2)

        }
        else {
            console.log("Edge already exists between these nodes")
        }
        
        
    },
    colorNode(node, color) {
        node.element.setAttribute('fill', color)
    },

    // i is the order in which the node is found
    // 1 if found first, 2 if found second, ...
    setFound(node, i) {
        node.found = true
        setTimeout(() => {
            node.element.setAttribute('fill', 'chartreuse')
        }, 1000*i)

        
    },

    resetGraph() {
        this.nodes.forEach(node => {
            node.found = false
            node.element.setAttribute('fill', 'red')
        })
    },
    toggleEdgeFill() {
        this.edgeFill = !this.edgeFill
        this.nodes.forEach(node => {
            node.neigbours.forEach(edge => {
                edge.edgeElement.setAttribute('stroke-opacity', `${this.edgeFill ? 1.0 : 0.0}`)
            })
        })
    },

    removeNode(index) {
        _removeNode(this.nodes[index], this)
    },
    removeEdge(index1, index2) {
        _removeEdge(this.nodes[index1], this.nodes[index2], this)
    },
    getGraphElement() {
        return this.graphElement
    },
    getNode(index) {
        return this.nodes[index]
    },
    setDimensions(h, w) {
        h ? this.graphElement.style["height"] = `${h}px` : null;
        w ? this.graphElement.style["width"] = `${w}px` : null;
    },
    // removes edges across the line segement 
    cutEdges(x1, y1, x2, y2) {
        const p1 = [x1,y1]
        const q1 = [x2,y2]
        this.nodes.forEach((node) => {
            node.neigbours = node.neigbours.filter((edge) => {
                let p2 = [edge.edgeElement.x1.baseVal.value, edge.edgeElement.y1.baseVal.value]
                let q2 = [edge.edgeElement.x2.baseVal.value, edge.edgeElement.y2.baseVal.value]

                const intersect = _doIntersect(p1, q1, p2, q2)
                if (intersect) {
                    edge.node.neigbours = edge.node.neigbours.filter(e => e.node !== node)
                    this.edgeElements.removeChild(edge.edgeElement)
                }
                return !intersect
            })
        })
    } 


}


