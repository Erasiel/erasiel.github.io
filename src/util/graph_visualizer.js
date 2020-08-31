/**
 * Returns the visualization of the parameter graph.
 * 
 * @param {Object} graph Graph object prepared by generateWeightedDirectedGraph function
 * @param {String} format Output format of the visualized graph. For web-based applications "svg" is recommended. 
 */
function visualizeWeightedDirectedGraph(graph, format = "svg") {
    let nodes = Object.keys(graph);
    let nodeCount = nodes.length;
    
    let graphvizString = "digraph G { ";

    nodes.forEach(node => {
        graph[node].forEach(edge => {
            graphvizString += `${node} -> ${edge.node} [label="${edge.weight}"]; `
        });
    });

    graphvizString += "}";

    console.log(graphvizString);

    let img = Viz(graphvizString, format);

    return img;
}
