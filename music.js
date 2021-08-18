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

function addEvents(name, chord) {
    document.getElementById(name).addEventListener("mousedown", function () {
        sampler.triggerAttack(chord);
    });
    document.getElementById(name).addEventListener("touchstart", function (ev) {
        sampler.triggerAttack(chord);
        ev.preventDefault();
    });
    document.getElementById(name).addEventListener("mouseup", function () {
        sampler.triggerRelease(chord, Tone.now() + 1);
    });
    document.getElementById(name).addEventListener("touchend", function (ev) {
        sampler.triggerRelease(chord, Tone.now() + 1);
        ev.preventDefault();
    });
}

Tone.loaded().then(() => {
    addEvents("Am", getChord(3, 9, 3, 4));
    addEvents("C", getChord(4, 0, 4, 3));
    addEvents("G", getChord(4, 7, 4, 3));
    addEvents("F", getChord(4, 5, 4, 3));

    document.getElementById("buttons").removeAttribute("disabled");
});
