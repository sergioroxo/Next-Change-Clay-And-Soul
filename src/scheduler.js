export function scheduleCaptions(level, audio, containerEl, onToken){
  containerEl.innerHTML = '';
  const cues = (level.captions||[]).map(c=>({ ...c, shown:false, el:null }));
  const lexicon = level.lexicon||[];
  const tokenIndex = new Map(lexicon.map(x=>[x.token.toLowerCase(), x.weight]));

  // expose current token max weight
  window.__activeTokenWeight = () => {
    const els = Array.from(containerEl.querySelectorAll('[data-token-weight]'));
    let m = 0; els.forEach(e=>{ m = Math.max(m, parseFloat(e.dataset.tokenWeight||'0')); });
    return m;
  };

  function tick(){
    const t = audio.currentTime;
    for(const c of cues){
      if(!c.shown && t >= c.at){
        const el = document.createElement('div'); el.className='caption'; el.textContent=c.text; c.el = el;
        // token detection
        let maxW = 0; tokenIndex.forEach((w,token)=>{ if(c.text.toLowerCase().includes(token)){ maxW = Math.max(maxW, w); }});
        if(maxW>0){ el.dataset.tokenWeight = String(maxW); if(onToken) onToken(); }
        containerEl.appendChild(el); c.shown=true;
        setTimeout(()=>{ if(el.parentElement) el.parentElement.removeChild(el); }, 2600);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}