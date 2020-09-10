const Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/**
 * Randomly creates a directed, weighted graph object. Nodes are labeled with capital letters.
 * 
 * Example output object:
 * {
 *   meta: 
 *   {
 *     colors: { 'A': 'red', 'B': 'blue' }
 *   },
 *   nodes: 
 *   {
 *     'A': 
 *     [
 *       { node: 'B', weight: 10 },
 *       { node: 'C', weight: 12 },
 *       // ...
 *     ],
 *     'B': [],
 *     // ...
 *   }
 * }
 *
 * @param {number} nodeCount Number of nodes in the output graph (<= 26 for consistent labeling)
 * @param {number} edgeChance Chance of having a directed edge between two nodes (float in 0..1 interval)
 * @param {number} minWeight 
 * @param {number} maxWeight 
 */
function generateWeightedDirectedGraph(nodeCount = 10, edgeChance = 0.15, minWeight = 1, maxWeight = 20) {
    let graph = {
        meta: {
            colors: {},
            directed: true
        },
        nodes: {}
    };
    let weightInterval = maxWeight - minWeight;

    for (let i = 0; i < nodeCount; i++) {
        graph.nodes[Alphabet[i]] = [];

        for (let j = 0; j < nodeCount; j++) {
            if (i == j) continue;

            if (Math.random() <= edgeChance) {
                let weight = Math.floor(Math.random() * weightInterval) + minWeight;
                let edge = { node: Alphabet[j], weight: weight };

                graph.nodes[Alphabet[i]].push(edge);
            }
        }
    }

    return graph;
}

function generateWeightedUndirectedGraph(nodeCount = 10, edgeChance = 0.15, minWeight = 1, maxWeight = 20) {
    let graph = {
        meta: {
            colors: {},
            directed: false
        },
        nodes: {}
    };
    let weightInterval = maxWeight - minWeight;
    let matrix = [];
    
    for (let i = 0; i < nodeCount; i++) {
        matrix.push([]);
    }

    for (let i = 0; i < nodeCount; i++) {
        if (!graph.nodes[Alphabet[i]]) {
            graph.nodes[Alphabet[i]] = [];
        }

        for (let j = 0; j < nodeCount; j++) {
            if (i == j || matrix[i][j] == 1 || matrix[j][i] == 1    ) continue;

            if (Math.random() <= edgeChance) {
                let weight = Math.floor(Math.random() * weightInterval) + minWeight;
                let edge1 = { node: Alphabet[j], weight: weight };
                let edge2 = { node: Alphabet[i], weight: weight };

                if (!graph.nodes[Alphabet[j]]) {
                    graph.nodes[Alphabet[j]] = [];
                }
                
                graph.nodes[Alphabet[i]].push(edge1);
                graph.nodes[Alphabet[j]].push(edge2);

                matrix[i][j] = 1;
                matrix[j][i] = 1;
            }
        }
    }

    return graph;
}
