// levels.js — Level data & chart generator for "Clay and Soul"

export const LEVELS = [
  makeClayAndSoulLevel()
];

function makeClayAndSoulLevel() {
  const bpm = 118;
  const durationSec = 105; // ~1:45 target
  const beats = Math.floor((durationSec * bpm) / 60);

  return {
    id: 'level1',
    title: 'Clay and Soul (Level Edit)',
    theme: 'Religious reassurance → obedience (purity & “old name” rhetoric)',
    bpm,
    duration: durationSec,
    track: './assets/music/Clay and Soul Sonauto.mp3',
    keyboard: {
      beatWindowMs: 180,
      steps: buildStepsPattern(beats)
    },
    captions: buildCaptions(),
    overlays: buildOverlays(),
    visuals: {
      pixelFromScore: [ [0,1],[20,2],[40,3],[60,4],[80,6] ],
      satFromScore:   [ [0,1.0],[20,0.8],[40,0.6],[60,0.4],[80,0.2] ]
    }
  };
}

/**
 * Build a repeating 8-bar (32-beat) pattern across song length.
 * Controls:
 *  - ArrowUp: ascension (hold)
 *  - ArrowRight: pressure
 *  - ArrowLeft: counter-pressure
 *  - ArrowDown: collapse
 *  - Space: accent hits
 */
function buildStepsPattern(totalBeats) {
  const steps = [];
  const block = 32; // beats per pattern cycle (8 bars)

  for (let base=0; base<totalBeats; base+=block) {
    // Bars 1–2 (8 beats): Hold Up; hits on 3 & 7
    addHold(steps, base+0, 'ArrowUp', 8);
    addHit(steps, base+2, 'Space');
    addHit(steps, base+6, 'Space');

    // Bars 3–4: Hold Right; hit on 5 (within this 8-beat window: base+8..base+15)
    addHold(steps, base+8, 'ArrowRight', 8);
    addHit(steps, base+13, 'Space'); // slightly late, creates tension

    // Bars 5–6: Hold Left; hits on 3 (space) and final Up on last beat
    addHold(steps, base+16, 'ArrowLeft', 8);
    addHit(steps, base+19, 'Space');
    addHit(steps, base+23, 'ArrowUp');

    // Bars 7–8: Hold Down; hits on 3 & 7 (space)
    addHold(steps, base+24, 'ArrowDown', 8);
    addHit(steps, base+25, 'Space');
    addHit(steps, base+27, 'Space');
  }
  return steps.filter(s => s.beat < totalBeats);
}

// Helpers to populate steps
function addHold(arr, beat, key, beats=4) {
  arr.push({ beat, type:'hold', key, beats });
}
function addHit(arr, beat, key) {
  arr.push({ beat, type:'hit', key: key==='Space' ? ' ' : key });
}

/** Caption fragments (short, never full directives) */
function buildCaptions() {
  return [
    { at: 3.0,  text: 'look at your hands' },
    { at: 9.0,  text: 'heavy water' },
    { at: 15.0, text: 'woven in a secret place' },
    { at: 21.0, text: 'your old name' },
    { at: 31.0, text: 'wash the clay away' },
    { at: 41.0, text: 'before the pills' },
    { at: 52.0, text: 'find the start' },
    { at: 66.0, text: 'everything is new' }
  ];
}

/** Critical overlays (analytical reframing) */
function buildOverlays() {
  return [
    { at: 6.0,  text: 'Notice the shift from care to correction' },
    { at: 18.0, text: 'Purity language can be a tool of control' },
    { at: 36.0, text: 'Reassurance becomes obedience' },
    { at: 74.0, text: 'Identity is not a negotiable burden' }
  ];
}
