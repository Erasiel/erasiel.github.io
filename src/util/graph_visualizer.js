/**
 * Returns the visualization of the parameter graph.
 * 
 * @param {Object} graph Graph object prepared by generateWeightedDirectedGraph function
 * @param {String} format Output format of the visualized graph. For web-based applications "svg" is recommended. 
 */
function visualizeWeightedDirectedGraph(graph, format = "svg") {
    let nodes = Object.keys(graph.nodes);
    
    let graphvizString = 'digraph G { { node[style = filled]; ';

    // Colors
    nodes.forEach(node => {
        if (graph.meta.colors.node[node]) {
            if (graph.meta.colors.node[node] == "black") {
                graphvizString += `${node}[fillcolor = ${graph.meta.colors.node[node]} fontcolor=white]`;
            } else {
                graphvizString += `${node}[fillcolor = ${graph.meta.colors.node[node]}]`;
            }
        } else {
            graphvizString += `${node}[fillcolor = white]`;
        }
    });
    
    graphvizString += "}";


    nodes.forEach(node => {
        graph.nodes[node].forEach(edge => {
            graphvizString += `${node} -> ${edge.node} [label="${edge.weight}"]; `
        });
    });

    graphvizString += "}";

    let img = Viz(graphvizString, format);

    return img;
}

function visualizeWeightedUndirectedGraph(graph, format = "svg") {
    let nodes = Object.keys(graph.nodes);
    let drawnEdges = [];

    let graphvizString = 'graph G { { node[style = filled]; ';

    // Colors
    nodes.forEach(node => {
        if (graph.meta.colors.node[node]) {
            if (graph.meta.colors.node[node] == "black") {
                graphvizString += `${node}[fillcolor = ${graph.meta.colors.node[node]} fontcolor=white]`;
            } else {
                graphvizString += `${node}[fillcolor = ${graph.meta.colors.node[node]}]`;
            }
        } else {
            graphvizString += `${node}[fillcolor = white]`;
        }
    });
    
    graphvizString += "}";

    // Edges
    nodes.forEach(node => {
        graph.nodes[node].forEach(edge => {
            if (!drawnEdges.includes(node + edge.node) && !drawnEdges.includes(edge.node + node)) {
                graphvizString += `${node} -- ${edge.node} [label="${edge.weight}"`
                
                // Edge color
                if (graph.meta.colors.edge[`${node}-${edge.node}`]) {
                    graphvizString += ` color="${graph.meta.colors.edge[`${node}-${edge.node}`]}" penwidth = 3`;
                }

                graphvizString += "]; "
                drawnEdges.push(node + edge.node);
            }
        });
    });

    graphvizString += "}";

    let img = Viz(graphvizString, format);

    return img;
}

function visualizeGraph(graph, format = "svg") {
    if (graph.meta.directed == true) {
        return visualizeWeightedDirectedGraph(graph, format);
    } else {
        return visualizeWeightedUndirectedGraph(graph, format);
    }
}

function visualizeTree(edges, format = "svg") {
    let graphvizString = 'graph G { ';

    edges.forEach(edge => {
        graphvizString += `${edge};`
    });

    graphvizString += '}';

    let img = Viz(graphvizString, format);

    return img;
}

function visualizeInnerStructure(graph, format = "svg") {
    let graphvizString = 'digraph G { size="7, 6" \n graph[nodesep="0.2"] \n rankdir=LR; \n node [shape=record]; \n';
    const arrowStyle = '[arrowhead=vee, arrowtail=dot, dir=both, tailclip=false]; \n';
    let nodes = Object.keys(graph.nodes).sort().reverse();

    // Pre-declare all nodes
    nodes.forEach((node, i) => {
        graphvizString += `node${i} [label = "{ <data> ${node} | <ref> }"]; \n`;
        graphvizString += `null${i} [label="NULL" shape=box]; \n`;
        
        // Pre-declare all edges
        graph.nodes[node].forEach((edge, j) => {
            graphvizString += `edge${i}${j} [label="{ <data> ${edge.node} | <data> ${edge.weight} | <ref> }"]; \n`;
        });
    });

    // Declare all connections
    nodes.forEach((node, i) => {
        // Handle empty list
        if (graph.nodes[node].length == 0) {
            graphvizString += `node${i}:ref:null${i} -> null${i}:data:w` + arrowStyle;
        } else {
            graphvizString += `node${i}:ref:edge${i}${0} -> edge${i}${0}:w` + arrowStyle;
        }


        graph.nodes[node].forEach((_edge, j) => {
            // Handle NULL terminator
            if (j == graph.nodes[node].length - 1) {
                graphvizString += `edge${i}${j}:ref:null${i} -> null${i}:data:w` + arrowStyle;
            } else {
                graphvizString += `edge${i}${j}:ref:edge${i}${j + 1} -> edge${i}${j + 1}:w` + arrowStyle;
            }
        });
    });

    graphvizString += '}';
    
    let img = Viz(graphvizString, format);

    // HACK - kids, don't try this at home
    let ind = img.search("<?xml");
    img = img.slice(ind-2, img.length);

    return img;
}
