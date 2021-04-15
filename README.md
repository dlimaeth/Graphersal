# js-library-dlimaeth
https://graphersal.herokuapp.com/

<h3 id="gettingStarted">Getting Started</h3>
     <p> To use the library you simply need to import the graphersal.css and 
         graphersal.js files. So the head section of your html file should look like this.
     </p>
     <!--<img src="images/loading library.png" width="676" height="355"> -->
     <pre>
        <code>
            &lt!DOCTYPE html&gt
            &lthtml lang="en"&gt
             &lthead&gt
                &ltmeta charset="utf-8"&gt
                &ltmeta name="viewport" content="width=device-width, initial-scale=1"&gt
                
                &lttitle&gtgraphersal&lt/title&gt
            
                &lt!-- Load library --&gt
                &ltlink rel="stylesheet" type="text/css" href="graphersal.css"&gt
                &ltscript defer type="text/javascript" src='js/graphersal.js'&gt&lt/script&gt
            
                &lt!-- Then we load a script that depends on our library --&gt
                &ltscript defer type="text/javascript" src='js/example.js'&gt&lt/script&gt
            
             &lt/head>
         </code>
     </pre>
    
     <br>
     <p>
         You can add a graph to the DOM like so. In this example we add it to the body but 
         you can add it to any tag that takes svg elements.
     </p>
     <pre>
         <code>
            const graphID = 'myGraph'   // The id of the graph element in the DOM       No Default
            const height = 200          // height of graph element in pixels.           Default: 200
            const width = 400           // width of graph element in pixels.            Default: 400
            const isDirected = true     // Whether or not this is a directed graph.     Default: false
            const myGraph = new Graphersal(graphID, isDirected, height, width)
            document.querySelector('body').appendChild(myGraph.getGraphElement())
         </code>
     </pre>