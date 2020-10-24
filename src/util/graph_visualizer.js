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
