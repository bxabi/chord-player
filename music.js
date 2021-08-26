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

var root = document.querySelector(':root');

function resizeButtons() {
    document.getElementById("buttons").style.height = window.innerHeight - 50;

    const buttonWidth = window.innerWidth / 6 - 2;
    const buttonHeight = (window.innerHeight - 60) / 6 - 2;

    root.style.setProperty("--buttonWidth", buttonWidth + "px");
    root.style.setProperty("--buttonHeight", buttonHeight + "px");
};

window.addEventListener("load", resizeButtons);
window.addEventListener('resize', resizeButtons);


SELECTIONMODE = false;

function getChord(octave, start, d1, d2) {
    const sName1 = sounds.get(start) + octave;

    var s2 = start + d1;
    if (s2 > 11) {
        s2 = s2 - 12;
        octave++;
    }
    const sName2 = sounds.get(s2) + octave;

    if (d2) {
        var s3 = s2 + d2;
        if (s3 > 11) {
            s3 = s3 - 12;
            octave++;
        }
        const sName3 = sounds.get(s3) + octave;
        return [sName1, sName2, sName3];
    }

    // we only have 2 sounds in this case
    return [sName1, sName2];
}

function addEvents(button, chord) {
    button.addEventListener("mousedown", function () {
        sampler.triggerAttack(chord);
        if (SELECTIONMODE) {
            if (button.style.opacity == "1")
                button.style.opacity = "0.3";
            else button.style.opacity = "1";
        }
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

function setPosition(button, x, y, heightOffset) {
    button.style.setProperty("left", "calc(var(--buttonWidth) * " + x + ")");
    button.style.setProperty("top", "calc(var(--buttonHeight) * " + y + " + " + heightOffset + "px)");
}

function createButtonRelative(name, octave, start, d1, d2) {
    let button = document.createElement("button");
    if (name[name.length - 1] == 'm')
        button.classList.add("row2");
    else if (name[name.length - 1] == '5')
        button.classList.add("row3");
    else button.classList.add("row1");

    let content = '<p>' + name + '</p>';
    content += '<p class="relativeNoteNumbers">' + start + '+' + d1;
    if (d2)
        content += '+' + d2;
    content += "</p>";
    button.innerHTML = content;
    //        '<p class="octaves">' + octave + "</p>";
    document.getElementById("buttons").appendChild(button);

    addEvents(button, getChord(octave, start, d1, d2));
    return button;
}

for (i = 0; i < 6; ++i) {
    let button = createButtonRelative(sounds.get(i), 4, i, 4, 3);
    setPosition(button, i, 0, 0);

    button = createButtonRelative(sounds.get(i) + "m", 4, i, 3, 4);
    setPosition(button, i, 1, 0);

    button = createButtonRelative(sounds.get(i) + "5", 4, i, 7);
    setPosition(button, i, 2, 0);

    button = createButtonRelative(sounds.get(i + 6), 4, i + 6, 4, 3);
    setPosition(button, i, 3, 10);

    button = createButtonRelative(sounds.get(i + 6) + "m", 4, i + 6, 3, 4);
    setPosition(button, i, 4, 10);

    button = createButtonRelative(sounds.get(i + 6) + "5", 4, i + 6, 7);
    setPosition(button, i, 5, 10);
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

Tone.loaded().then(() => {
    document.getElementById("buttons").removeAttribute("disabled");
});

function selectButtonClicked() {
    if (!SELECTIONMODE) {
        document.querySelectorAll("#buttons button").forEach(button => { button.style.opacity = "0.3" });
    }
    SELECTIONMODE = !SELECTIONMODE;
}

function ResetButtonClicked() {
    document.querySelectorAll("#buttons button").forEach(button => { button.style.opacity = "1" });
    SELECTIONMODE = fals;
}