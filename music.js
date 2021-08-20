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

function createButtonRelative(name, octave, start, d1, d2) {
    let button = document.createElement("button");
    button.innerHTML = '<p>' + name + '</p>' +
        '<p class="relativeNoteNumbers">' + start + '+' + d1 + '+' + d2 + "</p>" +
        '<p class="absoluteNoteNumbers">' + start + '-' + (start + d1) + '-' + (start + d1 + d2) + "</p>" +
        '<p class="octaves">' + octave + "</p>";
    document.getElementById("buttons").appendChild(button);

    addEvents(button, getChord(octave, start, d1, d2));
}

function createButtonAbsolute(name, octave, s1, s2, s3) {
    let button = document.createElement("button");
    button.innerHTML = '<p>' + name + '</p>' +
        '<p class="relativeNoteNumbers">' + s1 + '+' + (s2 - s1) + '+' + (s3 - s2) + "</p>" +
        '<p class="absoluteNoteNumbers">' + s1 + '-' + s2 + '-' + s3 + "</p>" +
        '<p class="octaves">' + octave + "</p>";
    document.getElementById("buttons").appendChild(button);

    addEvents(button, getChord(octave, s1, s2 - s1, s3 - s2));
}

createButtonRelative("Am", 3, 9, 3, 4);
createButtonRelative("C", 4, 0, 4, 3);
createButtonRelative("G", 4, 7, 4, 3);
createButtonRelative("F", 4, 5, 4, 3);

let hr = document.createElement("hr");
document.getElementById("buttons").appendChild(hr);

createButtonAbsolute("WA1", 4, 4, 7, 11);
createButtonAbsolute("WA2", 4, 2, 7, 11);
createButtonAbsolute("WA3", 4, 2, 6, 9);
createButtonAbsolute("WA4", 4, 1, 4, 9);
createButtonAbsolute("WA5", 4, 3, 6, 11);
createButtonAbsolute("WA6", 4, 0, 4, 7);

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

var root = document.querySelector(':root');

function toggleStyle(name) {
    let val = getComputedStyle(root).getPropertyValue(name);
    if (val == 'none')
        val = 'block';
    else val = 'none';
    root.style.setProperty(name, val);
}