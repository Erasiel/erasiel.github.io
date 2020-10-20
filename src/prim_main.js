let graph;
let img;
let index = -1;
let runningGraphs;
let runningStates;

function load() {
    refresh();
}

function refresh() {
    graph = generateWeightedUndirectedConnectedGraph();
    img = visualizeGraph(graph);

    $("#grapharea").html(img);
    $("#body").empty();
    $("#statearea").toggleClass("hidden", true);
}

function run() {
    console.log("RUN CALLED");
    let startnodeInput = $("#startnode-input");
    let startNode = startnodeInput.val().toUpperCase();

    if (!Object.keys(graph.nodes).includes(startNode)) {
        startnodeInput.toggleClass("error-input", true);
    } else {    
        startnodeInput.toggleClass("error-input", false);
        
        $("#grapharea").empty();

        // Run the algorithm and save results
        let runningResults = runPrim(graph, startNode);
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
    let htmlStr = "";

    if (index == 0) {
        $("#iteration-number").text(`Az algoritmus inicializálási lépése utáni állapot: `);
    } else {
        $("#iteration-number").text(`Az algoritmus ${index}. iterációja utáni állapot: `);
    }

    Object.keys(graph.nodes).forEach(node => {
        htmlStr += "<tr>";
        
        htmlStr += `<td>${node}</td>`
        if (stateObject[node].dist === Infinity) {
            htmlStr += "<td>&#8734;</td>";
        } else {
            htmlStr += `<td>${stateObject[node].dist}</td>`;
        }

        if (stateObject[node].ancestor) {
            htmlStr += `<td>${stateObject[node].ancestor}</td>`;
        } else {
            htmlStr += "<td>NULL</td>";
        }

        if (stateObject[node].inTree) {
            htmlStr += "<td>&#x2714;</td>";
        } else {
            htmlStr += "<td></td>";
        }
        
        htmlStr += "</tr>";
    });

    table.append($(htmlStr));
}