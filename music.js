const sounds = new Map([
    [0, 'C'],
    [1, 'C#'],
    [2, 'D'],
    [3, 'D#'],
    [4, 'E'],
    [5, 'F'],
    [6, 'F#'],
    [7, 'G'],
    [8, 'G#'],
    [9, 'A'],
    [10, 'A#'],
    [11, 'B'],
    [12, 'C']
]);

function getChord(octave, start, d1, d2) {
    const sName1 = sounds.get(start) + octave;

    var s2 = start + d1;
    if (s2 > 11) {
        s2 = s2 - 12;
        octave++;
    }
    const sName2 = sounds.get(s2) + octave;

    var s3 = s2 + d2;
    if (s3 > 11) {
        s3 = s3 - 12;
        octave++;
    }
    const sName3 = sounds.get(s3) + octave;

    return [sName1, sName2, sName3];
}

function addEvents(button, chord) {
    button.addEventListener("mousedown", function () {
        sampler.triggerAttack(chord);
    });
    button.addEventListener("touchstart", function (ev) {
        sampler.triggerAttack(chord);
        ev.preventDefault();
    });
    button.addEventListener("mouseup", function () {
        sampler.triggerRelease(chord, Tone.now() + 1);
    });
    button.addEventListener("touchend", function (ev) {
        sampler.triggerRelease(chord, Tone.now() + 1);
        ev.preventDefault();
    });
}

function createButton(name, octave, start, d1, d2) {
    let button = document.createElement("button");
    button.innerHTML = start + '+' + d1 + '+' + d2 + '/' + octave + '\n' + name;
    document.getElementById("buttons").appendChild(button);

    addEvents(button, getChord(octave, start, d1, d2));
}

createButton("Am", 3, 9, 3, 4);
createButton("C", 4, 0, 4, 3);
createButton("G", 4, 7, 4, 3);
createButton("F", 4, 5, 4, 3);

const sampler = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

Tone.loaded().then(() => {
    document.getElementById("buttons").removeAttribute("disabled");
});

