import { initPixiApp } from './pixiApp.js';
import { initSilhouette } from './silhouette.js';
import { initWordBody } from './wordBody.js';
import { initThreeOverlay } from './threeOverlay.js';
import { scheduleCaptions } from './scheduler.js';

const $ = sel => document.querySelector(sel);
let state = { running:false, voidMeter:0, bpm:120, beatWindowMs:180, songOffsetMs:0, activeTokens: new Set() };

async function loadLevel(url){
  const res = await fetch(url);
  return await res.json();
}
function uiShow(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

async function start(){
  const level = await loadLevel('./content/levels/clay_full.json');
  state.bpm = level.bpm;
  state.beatWindowMs = level.mechanic.beatWindowMs||180;
  state.songOffsetMs = level.audio.songOffsetMs||0;

  // audio
  const audio = $('#track');
  audio.innerHTML = '';
  for(const s of level.audio.sources){
    const src = document.createElement('source');
    src.src = s.src; src.type = s.type;
    audio.appendChild(src);
  }

  // renderers
  const app = initPixiApp('#pixi');
  const { graphicsMask, updatePose } = initSilhouette(app, level.figure.silhouette);
  const { updateWords } = initWordBody(app, graphicsMask, level.figure.affirmations, level.figure.conversions);
  const overlay = initThreeOverlay('#three');

  // captions / tokens
  const captionsLayer = $('#captions');
  scheduleCaptions(level, audio, captionsLayer, token => state.activeTokens.add(token));

  // input
  window.addEventListener('keydown', (e)=>{
    if(e.code==='Space' || e.key===' '){
      judgeAffirmation(audio.currentTime*1000);
      e.preventDefault();
    }
  });
  $('#pauseBtn').onclick = ()=>{ state.running = !state.running; if(state.running) audio.play(); else audio.pause(); };
  $('#endBtn').onclick   = ()=>{ audio.pause(); state.running=false; uiShow('#gate'); };

  audio.addEventListener('playing', ()=>{ state.running=true; requestAnimationFrame(loop); });
  await audio.play();

  function loop(){
    if(!state.running) return;
    const tMs = audio.currentTime*1000 - state.songOffsetMs;
    updatePose(tMs/1000);           // animate silhouette
    updateWords(state.voidMeter);   // word cross‑reveal
    overlay.update(state.voidMeter); // lo‑fi overlay
    $('#voidVal').textContent = Math.round(state.voidMeter*100);
    requestAnimationFrame(loop);
  }

  function judgeAffirmation(nowMs){
    const beatMs = 60000/state.bpm;
    const nearest = Math.round((nowMs - state.songOffsetMs)/beatMs)*beatMs + state.songOffsetMs;
    const dt = Math.abs(nowMs - nearest);
    if(dt <= state.beatWindowMs){
      let add = 0.02; // base
      if(state.activeTokens.size>0){
        const maxW = window.__activeTokenWeight ? window.__activeTokenWeight() : 0.0;
        add *= (1 + maxW);
      }
      state.voidMeter = Math.min(1.0, state.voidMeter + add);
      state.activeTokens.clear();
      if(window.__flipToken){ window.__flipToken(); }
    } else {
      state.voidMeter = Math.min(1.0, state.voidMeter + 0.004); // slow drift
    }
  }
}

$('#startBtn').onclick = async ()=>{ uiShow('#stage'); await start(); };