let graph;
let img;
let index = -1;
let runningGraphs;
let runningStates;

function load() {
    if (isLoadRequested() || isStoredGraphDijkstraCompatible()) {
        graph = getStoredGraph().graph;
        img = getStoredGraph().img;

        drawFirstGraph();
    } else {
        refresh_undirected();
    }
}

function refresh_undirected() {
    graph = generateWeightedUndirectedGraph(10, 0.2);
    img = visualizeGraph(graph);

    storeGraph(graph, img);

    drawFirstGraph();
}

function refresh_directed() {
    graph = generateWeightedDirectedGraph(10, 0.2);
    img = visualizeGraph(graph);

    storeGraph(graph, img);

    drawFirstGraph();
}

function drawFirstGraph() {
    $("#grapharea").html(img);
    $("#body").empty();
    $("#statearea").toggleClass("hidden", true);
}

function run() {
    let startnodeInput = $("#startnode-input");
    let startNode = startnodeInput.val().toUpperCase();

    if (!Object.keys(graph.nodes).includes(startNode)) {
        startnodeInput.toggleClass("error-input", true);
    } else {
        startnodeInput.toggleClass("error-input", false);
        
        $("#grapharea").empty();

        // Run the algorithm and save results
        let runningResults = runDijsktra(graph, startNode, false);
        runningGraphs = runningResults.graphs;
        runningStates = runningResults.state;
        index = -1;

        // Show the initialization step
        $("#statearea").toggleClass("hidden", false);
        next();
    }
}

function next() {
    if (index + 1 < runningGraphs.length) {
        index++;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
    }
}

function prev() {
    if (index -1 >= 0) {
        index--;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
    }
}

function setupState(stateObject) {
    let table = $("#body");
    table.empty();

    let nodes = Object.keys(stateObject);

    if (index <= 0) {
        $("#iteration-number").text(`Az algoritmus inicializálási lépése után az állapot: `);
    } else {
        $("#iteration-number").text(`Az algoritmus ${index}. iterációja után az állapot: `);
    }

    nodes.forEach(node => {
        let htmlStr = "<tr>";
        htmlStr += `<td>${node}</td>`;

        if (stateObject[node].distance === Infinity) {
            htmlStr += "<td>&#8734;</td>";
        } else {
            htmlStr += `<td>${stateObject[node].distance}</td>`;
        }
        
        if (stateObject[node].ancestor) {
            htmlStr += `<td>${stateObject[node].ancestor}</td>`;
        } else {
            htmlStr += `<td>NULL</td>`;
        }

        if (stateObject[node].status === "unvisited") {
            htmlStr += `<td>Még nem elért</td>`;
        } else if (stateObject[node].status === "visited") {
            htmlStr += `<td>Elért</td>`;
        } else {
            htmlStr += `<td>Lezárt</td>`;
        }
        
        htmlStr += "</tr>";
        table.append($(htmlStr));
    });
}

function loadBFS() {
    let newLink = setupNewLink("bfs.html");
    requestLoad();

    window.location.href = newLink;
}

function loadDFS() {
    let newLink = setupNewLink("dfs.html");
    requestLoad();

    window.location.href = newLink;
}
