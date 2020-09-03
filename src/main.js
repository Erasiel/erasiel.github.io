const testGraph = 'digraph G { Anna -> Cecil [label="3"]; Anna -> Denes [label="3"]; Bela -> Anna [label="6"]; Bela -> Ferenc [label="18"]; Bela -> Helga [label="8"]; Cecil -> Ferenc [label="13"]; Cecil -> Ilona [label="15"]; Cecil -> Janos [label="3"]; Denes -> Cecil [label="16"]; Denes -> Ilona [label="12"]; Elemer -> Ferenc [label="15"]; Elemer -> Gabor [label="3"]; Ferenc -> Anna [label="18"]; Helga -> Janos [label="17"]; Ilona -> Anna [label="16"]; Ilona -> Denes [label="9"]; Ilona -> Helga [label="15"]; Ilona -> Janos [label="11"]; Janos -> Elemer [label="8"]; Janos -> Ferenc [label="1"]; Janos -> Helga [label="5"]; }';

let graph;
let img;
let index = -1;
let runningGraphs;
let runningStates;

function load() {
    refresh();
}

function refresh() {
    let graph = generateWeightedDirectedGraph(10, 0.2);
    let img = visualizeWeightedDirectedGraph(graph);
    let runningResults = runDijsktra(graph, 'A');
    runningGraphs = runningResults.graphs;
    runningStates = runningResults.state;
    index = -1;

    $("#grapharea").html(img);
    $("#body").empty();
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
    console.log(stateObject)
}
