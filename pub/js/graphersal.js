/* JS Libraries */
"use strict";
console.log('----------')
console.log('SCRIPT: Creating and loading our JS libraries')

const node_radius = 20;

// Helpers

function _addNode(cx, cy, graph) {
    const node = {}
    const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    nodeElement.setAttribute('cx', `${cx}`)
    nodeElement.setAttribute('cy', `${cy}`)
    nodeElement.setAttribute('r', `${node_radius}`)
    nodeElement.setAttribute('stroke', 'black')
    nodeElement.setAttribute('fill', 'red')
    nodeElement.style.opacity =  graph.nodeElements.childNodes.length ? graph.nodeElements.childNodes[0].style.opacity : 1.0;

    nodeElement.classList = 'node'
    
    node.element = nodeElement
    node.neigbours = []
    node.found = false
    // why not use a little jQuery:
    graph.nodeElements.appendChild(nodeElement)
    graph.nodes.push(node) // add to the node to list

    const nodeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    nodeLabel.setAttribute('x', `${cx}`)
    nodeLabel.setAttribute('y', `${cy  + 5}`)
    nodeLabel.setAttribute('fill', 'black')
    nodeLabel.innerHTML = `${graph.nodes.length - 1}`
    nodeLabel.setAttribute('font-size', '20')
    nodeLabel.setAttribute('text-anchor', 'middle')
    nodeLabel.style.opacity = graph.nodeLabels.childNodes.length ? graph.nodeLabels.childNodes[0].style.opacity : 1.0;
    nodeLabel.classList = 'text'
    graph.nodeLabels.appendChild(nodeLabel)
    node.nodeLabel = nodeLabel
}

function _removeNode(node, graph) {
    node.neigbours.forEach(e => {
        e.node.neigbours = e.node.neigbours.filter(edge => edge.node !== node)
        graph.edgeElements.removeChild(e.edgeElement)
        graph.edgeLabels.removeChild(e.edgeLabel)
    })
    if (node.image) {
        graph.images.removeChild(node.image)
    }
    graph.nodeLabels.removeChild(node.nodeLabel)
    graph.nodeElements.removeChild(node.element)
    graph.nodes = graph.nodes.filter(p => p !== node)
    graph.nodes.forEach((node, i) => {
        node.nodeLabel.innerHTML = `${i}`
    })
}

// Assumes an edge already exists between these nodes
function _setEdge(node1, node2, isDirected) {
    
    let index = node1.neigbours.findIndex(e => {
        return e.node === node2 && e.first
    })
    
    let edgeElement = node1.neigbours[index].edgeElement
    let edgeLabel = node1.neigbours[index].edgeLabel

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

    // So the lines don't go inside the nodes
    let norm = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
    let d1 = (x2 - x1) / norm
    let d2 = (y2 - y1) / norm
    x1 = x1+node_radius*d1;
    y1 = y1+node_radius*d2;
    x2 = x2-node_radius*d1;
    y2 = y2-node_radius*d2;

    if (isDirected) {
        // find the tips of the arrows
        const tip1 = [0,0]
        const tip2 = [0,0]
        tip1[0] = x2 + 10*(-d1-d2)/Math.sqrt(2);
        tip1[1] = y2 + 10*(d1-d2)/Math.sqrt(2);
        tip2[0] = x2 + 10*(-d1+d2)/Math.sqrt(2);
        tip2[1] = y2 + 10*(-d1-d2)/Math.sqrt(2);
        edgeElement.setAttribute('points', `${x1},${y1} ${x2},${y2} ${tip1[0]},${tip1[1]} ${x2},${y2} ${tip2[0]},${tip2[1]}`)
    } else {
        edgeElement.setAttribute('points', `${x1},${y1} ${x2},${y2}`)
    }
    /* edgeElement.setAttribute('x1', `${x1}`)
    edgeElement.setAttribute('y1', `${y1}`)
    edgeElement.setAttribute('x2', `${x2}`)
    edgeElement.setAttribute('y2', `${y2}`)  */ 

    const lx = (x1+x2)/2.0
    const ly = (y1+y2)/2.0
    edgeLabel.setAttribute('x', `${lx - d2*15}`)
    edgeLabel.setAttribute('y', `${ly + d1*15}`)
}

function _removeEdge(node1, node2, graph) {
    let edgeElement;
    let edgeLabel;
    node1.neigbours = node1.neigbours.filter(e => {
        edgeElement = e.edgeElement
        edgeLabel = e.edgeLabel
        return e.node !== node2
    })
    node2.neigbours = node2.neigbours.filter(e => e.node !== node1 || e.first)
    graph.edgeElements.removeChild(edgeElement)
    graph.edgeLabels.removeChild(edgeLabel)
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
function Graphersal(graphID, isDirected, height, width) {

    this.isDirected = isDirected ? isDirected : false

    this.graphElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const h = height ? height : 200;
    const w = width ? width : 400
    this.graphElement.style = `position: relative; width: ${w}px; height: ${h}px;`
    this.graphElement.id = graphID
    //document.querySelector('body').append(this.graphElement)

    this.nodeLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.edgeLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.edgeElements = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.nodeElements = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.images = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.graphElement.appendChild(this.edgeElements)
    this.graphElement.appendChild(this.edgeLabels)
    this.graphElement.appendChild(this.nodeElements)
    this.graphElement.appendChild(this.nodeLabels)
    this.graphElement.appendChild(this.images)
    
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
        else if (evt.target.classList.contains('image')) {
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
            offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
        }
    }
    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var dragX = evt.clientX;
            var dragY = evt.clientY;

            // Find the selected node
            let index = g.nodes.findIndex(node => {
                return node.element === selectedElement || node.image === selectedElement
            })

            if (selectedElement === g.nodes[index].image) {
                // update image position
                g.nodes[index].image.setAttribute('x', `${dragX - offset.x}`)
                g.nodes[index].image.setAttribute('y', `${dragY - offset.y}`)
                // update node position
                g.nodes[index].element.setAttribute('cx', `${dragX - offset.x+30}`)
                g.nodes[index].element.setAttribute('cy', `${dragY - offset.y+30}`)
                //update text position
                g.nodes[index].nodeLabel.setAttribute('x', `${dragX - offset.x+30}`)
                g.nodes[index].nodeLabel.setAttribute('y', `${dragY - offset.y + 5+30}`)
            }
            else {
                // update image position
                if (g.nodes[index].image) {
                    g.nodes[index].image.setAttribute('x', `${dragX - offset.x -30}`)
                    g.nodes[index].image.setAttribute('y', `${dragY - offset.y-30}`)
                }
                // update node position
                g.nodes[index].element.setAttribute('cx', `${dragX - offset.x}`)
                g.nodes[index].element.setAttribute('cy', `${dragY - offset.y}`)
                //update text position
                g.nodes[index].nodeLabel.setAttribute('x', `${dragX - offset.x}`)
                g.nodes[index].nodeLabel.setAttribute('y', `${dragY - offset.y + 5}`)
            }


            // updating edge positions
            g.nodes[index].neigbours.forEach(edge => {
                if (edge.first) {
                    _setEdge(g.nodes[index], edge.node, g.isDirected)
                }
                else {
                    _setEdge(edge.node, g.nodes[index], g.isDirected)
                }
                
            });

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

    addEdge: function(index1, index2, weight) {
        if (index1 >= this.nodes.length || index2 >= this.nodes.length || index1 == index2) {
            alert("invalid edges")
            return;
        } 
        const node1 = this.nodes[index1]
        const node2 = this.nodes[index2]
        let index = node1.neigbours.findIndex(e => {
            console.log(this.isDirected)
            if (this.isDirected) {
                return e.node === node2 && e.first
            }
            else {
                return e.node === node2
            }
            
        })

        let edgeElement; 
        let edgeLabel;
        if (index == -1) {
            edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            edgeElement.setAttribute('fill', 'none')
            edgeElement.setAttribute('stroke', 'black')
            edgeElement.setAttribute('stroke-opacity', `${this.edgeFill ? 1.0 : 0.0}`)
            this.edgeElements.appendChild(edgeElement)

            edgeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            edgeLabel.setAttribute('fill', 'black')
            edgeLabel.innerHTML = `${weight !== null ? weight : 1}`
            edgeLabel.setAttribute('font-size', '15')
            edgeLabel.setAttribute('text-anchor', 'middle')
            edgeLabel.style.opacity = this.edgeLabels.childNodes.length ? this.edgeLabels.childNodes[0].style.opacity : 0.0;
            edgeLabel.classList = 'text'
            this.edgeLabels.appendChild(edgeLabel)
            
            node1.neigbours.push({node: node2, edgeElement: edgeElement, first: true, edgeLabel: edgeLabel, weight: weight !== null ? weight : 1})
            node2.neigbours.push({node: node1, edgeElement: edgeElement, first: false, edgeLabel: edgeLabel, weight: weight !== null ? weight : 1})
            
            console.log(this.isDirected)
            _setEdge(node1, node2, this.isDirected)

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
    toggleEdgeLabels() {
        this.edgeLabels.childNodes.forEach(label => {
            label.style.opacity = parseFloat(label.style.opacity) ? 0.0 : 1.0
        })
    },
    toggleNodeFill() {
        this.nodes.forEach(node => {
            node.element.style.opacity = parseFloat(node.element.style.opacity) ? 0.0 : 1.0
        })
    },
    toggleNodeLabels() {
        this.nodes.forEach(node => {
            node.nodeLabel.style.opacity = parseFloat(node.nodeLabel.style.opacity) ? 0.0 : 1.0
        })
    },

    removeNodeByIndex(index) {
        _removeNode(this.nodes[index], this)
    },
    removeNodeByElement(element) {
        const node = this.nodes.filter(node => node.element === element || node.image === element)[0]
        _removeNode(node, this)
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
    // adds an image to the node at index
    addImage(index, imagePath) {
        this.nodes[index].image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
        this.nodes[index].image.setAttribute('href', imagePath)
        this.nodes[index].image.style.width = '60'
        this.nodes[index].image.style.height = '60'
        this.nodes[index].image.setAttribute('x', `${this.nodes[index].element.cx.baseVal.value-30}`)
        this.nodes[index].image.setAttribute('y', `${this.nodes[index].element.cy.baseVal.value-30}`)
        this.nodes[index].image.classList = "image"
        this.images.appendChild(this.nodes[index].image)
    },
    // removes the image to the node at index
    removeImage(index) {
        if (this.nodes[index].image) {
            this.images.removeChild(this.nodes[index].image)
            this.nodes[index].image = null
        }
    },
    // removes edges across the line segement 
    cutEdges(x1, y1, x2, y2) {
        const p1 = [x1,y1]
        const q1 = [x2,y2]
        this.nodes.forEach((node) => {
            node.neigbours = node.neigbours.filter((edge) => {
                let p2 = [edge.edgeElement.points[0].x, edge.edgeElement.points[0].y]
                let q2 = [edge.edgeElement.points[1].x, edge.edgeElement.points[1].y]

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


