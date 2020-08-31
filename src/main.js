const testGraph = 'digraph G { Anna -> Cecil [label="3"]; Anna -> Denes [label="3"]; Bela -> Anna [label="6"]; Bela -> Ferenc [label="18"]; Bela -> Helga [label="8"]; Cecil -> Ferenc [label="13"]; Cecil -> Ilona [label="15"]; Cecil -> Janos [label="3"]; Denes -> Cecil [label="16"]; Denes -> Ilona [label="12"]; Elemer -> Ferenc [label="15"]; Elemer -> Gabor [label="3"]; Ferenc -> Anna [label="18"]; Helga -> Janos [label="17"]; Ilona -> Anna [label="16"]; Ilona -> Denes [label="9"]; Ilona -> Helga [label="15"]; Ilona -> Janos [label="11"]; Janos -> Elemer [label="8"]; Janos -> Ferenc [label="1"]; Janos -> Helga [label="5"]; }';

function load() {
    let svg = Viz(testGraph, "svg");

    $("#grapharea").html(svg);
}