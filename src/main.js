const testGraph = 'digraph G { Anna -> Cecil [label="3"]; Anna -> Denes [label="3"]; Bela -> Anna [label="6"]; Bela -> Ferenc [label="18"]; Bela -> Helga [label="8"]; Cecil -> Ferenc [label="13"]; Cecil -> Ilona [label="15"]; Cecil -> Janos [label="3"]; Denes -> Cecil [label="16"]; Denes -> Ilona [label="12"]; Elemer -> Ferenc [label="15"]; Elemer -> Gabor [label="3"]; Ferenc -> Anna [label="18"]; Helga -> Janos [label="17"]; Ilona -> Anna [label="16"]; Ilona -> Denes [label="9"]; Ilona -> Helga [label="15"]; Ilona -> Janos [label="11"]; Janos -> Elemer [label="8"]; Janos -> Ferenc [label="1"]; Janos -> Helga [label="5"]; }';

let graph;
let img;
let index = -1;
let runningGraphs;

function load() {
    refresh();
}

function refresh() {
    let graph = generateWeightedDirectedGraph(10, 0.2);
    let img = visualizeWeightedDirectedGraph(graph);
    
    runningGraphs = runDijsktra(graph, 'A').graphs;
    index = -1;

    $("#grapharea").html(img);
}

function next() {
    if (index + 1 < runningGraphs.length) {
        index++;
        $("#grapharea").html(runningGraphs[index]);
    }
}

function prev() {
    if (index -1 >= 0) {
        index--;
        $("#grapharea").html(runningGraphs[index]);
    }
}