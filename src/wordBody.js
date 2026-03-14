export function initWordBody(app, mask, affirmations, conversions){
  const aff = new PIXI.Container();
  const conv = new PIXI.Container();
  aff.mask = mask; conv.mask = mask; app.stage.addChild(aff, conv);

  // jittered grid
  const cellW=140, cellH=44, jitter=16;
  const cols=6, rows=12;
  const startX = mask.x - (cols/2)*cellW + cellW/2;
  const startY = mask.y - (rows/2)*cellH + cellH/2;
  let aIdx=0, cIdx=0; const allConv = [];

  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const px = startX + c*cellW + (Math.random()*2-1)*jitter;
      const py = startY + r*cellH + (Math.random()*2-1)*jitter;

      const tA = new PIXI.Text(affirmations[aIdx++ % affirmations.length],
        { fill:0xffffff, fontWeight:800, fontSize:22, fontFamily:'Inter' });
      tA.anchor.set(0.5); tA.x=px; tA.y=py; aff.addChild(tA);

      const tC = new PIXI.Text(conversions[cIdx++ % conversions.length],
        { fill:0xff1ec8, fontWeight:800, fontSize:22, fontFamily:'Inter' });
      tC.anchor.set(0.5); tC.x=px; tC.y=py; tC.alpha = 0; conv.addChild(tC); allConv.push(tC);
    }
  }

  function updateWords(voidMeter){
    const N = allConv.length;
    for(let i=0;i<N;i++){
      const frac = i/N;
      const target = Math.max(0, Math.min(1, (voidMeter - 0.30)/0.55 - frac*0.12));
      allConv[i].alpha = target;
    }
    aff.alpha = 1.0 - Math.min(1, Math.max(0, (voidMeter - 0.15)/0.5));
  }

  // flip more cells when a harmful token is hit on-beat
  function flipForToken(){
    const N = allConv.length; const take = Math.max(1, Math.floor(N*0.12));
    for(let k=0;k<take;k++){
      const i = Math.floor(Math.random()*N);
      allConv[i].alpha = Math.min(1, allConv[i].alpha + 0.7);
    }
  }
  window.__flipToken = flipForToken; // used by scheduler

  return { updateWords, flipForToken };
}