const VF = Vex.Flow;

const notes = {
    'A': ['a/2', 'a/3', 'a/4', 'a/5'],
    'B': ['b/2', 'b/3', 'b/4', 'b/5'],
    'C': ['c/2', 'c/3', 'c/4', 'c/5', 'c/6'],
    'D': ['d/2', 'd/3', 'd/4', 'd/5', 'd/6'],
    'E': ['e/2', 'e/3', 'e/4', 'e/5', 'e/6'],
    'F': ['f/2', 'f/3', 'f/4', 'f/5', 'f/6'],
    'G': ['g/2', 'g/3', 'g/4', 'g/5', 'g/6'],
};

let noteKeys = Object.keys(notes);
let currentNote = '';

// Create an SVG renderer and attach it to the DIV element named "vf".
const div = document.getElementById("vf");
const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(500, 600);
const context = renderer.getContext();
context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

// Create a stave
let trebleStave = new VF.Stave(20, 20, 120);
let bassStave = new VF.Stave(20, 150, 120); // Increase the position here

// Add a clef and time signature.
trebleStave.addClef("treble");
bassStave.addClef("bass");

// Connect it to the rendering context and draw!
trebleStave.setContext(context).draw();
bassStave.setContext(context).draw();

// Connect staves
let connector = new VF.StaveConnector(trebleStave, bassStave);
connector.setType(VF.StaveConnector.type.BRACE);
connector.setContext(context).draw();

function newNote() {
    // Clear the old stave
    context.clear();
    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();
    connector.setContext(context).draw();

    // Create a new random note
    let noteIndex = Math.floor(Math.random() * noteKeys.length);
    currentNote = noteKeys[noteIndex];
    let octaveIndex = Math.floor(Math.random() * notes[currentNote].length);
    let clef = octaveIndex < notes[currentNote].length / 2 ? "bass" : "treble";  // Decides clef based on note range
    let note = new VF.StaveNote({clef: clef, keys: [notes[currentNote][octaveIndex]], duration: "w" });

    // Draw the note
    let voice = new VF.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables([note]);
    let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, clef === "bass" ? bassStave : trebleStave);
}

function flashWrongNote() {
    let svgElem = document.querySelector('svg g path');
    svgElem.classList.add('wrong');
    setTimeout(() => {
        svgElem.classList.remove('wrong');
    }, 500);
}

window.addEventListener('keydown', function(event) {
    let validKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    if (!validKeys.includes(event.key.toLowerCase())) {
        return;
    }
    if (event.key.toUpperCase() === currentNote) {
        newNote();
    } else {
        flashWrongNote();
    }
});

function checkInput(input) {
    if (input.toUpperCase() === currentNote) {
        newNote();
    } else {
        flashWrongNote();
    }
}

window.addEventListener('keydown', function(event) {
    let validKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    if (!validKeys.includes(event.key.toLowerCase())) {
        return;
    }
    checkInput(event.key);
});

let buttons = document.getElementById("buttons").getElementsByTagName("button");
for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
        checkInput(this.innerText);
    });
}

newNote();
