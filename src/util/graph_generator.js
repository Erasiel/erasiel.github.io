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
            colors: {
                node: {},
                edge: {}
            },
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
            colors: {
                node: {},
                edge: {}
            },
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
            if (i == j || matrix[i][j] == 1 || matrix[j][i] == 1) continue;

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

function generateWeightedUndirectedConnectedGraph(nodeCount = 10, edgeChance = 0.15, minWeight = 1, maxWeight = 20) {
    let graph = generateWeightedUndirectedGraph(nodeCount, edgeChance, minWeight, maxWeight);
    let union = {};
    
    for (let i = 0; i < nodeCount; i++) {
        union[Alphabet[i]] = Alphabet[i];
    }

    Object.keys(graph.nodes).forEach(node => {
        let newParent = union[node];
        
        graph.nodes[node].forEach(edge => {
            let oldParent = union[edge.node];

            Object.keys(union).forEach(uNode => {
                if (union[uNode] == oldParent) {
                    union[uNode] = newParent;
                }
            });

        });
    });

    separateParents = [];
    Object.keys(union).forEach(node => {
        if (!separateParents.includes(union[node])) {
            separateParents.push(union[node]);
        }
    });


    for (let i = 0; i < separateParents.length - 1; i++) {
        let weight = Math.floor(Math.random() * (maxWeight - minWeight)) + minWeight;
        let edge1 = { node: separateParents[i + 1], weight: weight };
        let edge2 = { node: separateParents[i], weight: weight };

        graph.nodes[separateParents[i]].push(edge1);
        graph.nodes[separateParents[i + 1]].push(edge2);
    }

    return graph;
}
