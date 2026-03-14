function poseToPoints(pose){
  // basic torso & arm points; three poses
  const base = [[-40,-120],[40,-120],[60,-40],[50,40],[-50,40],[-60,-40]];
  let armL, armR;
  if(pose==='arms_up'){ armL=[-70,-150]; armR=[70,-150]; }
  else if(pose==='right_reach'){ armL=[-80,-60]; armR=[110,-20]; }
  else { armL=[-110,-20]; armR=[80,-60]; }
  return [armL, ...base.slice(0,2), armR, ...base.slice(2)];
}

export function initSilhouette(app, silhouetteSpec){
  const g = new PIXI.Graphics();
  g.x = app.screen.width*0.68; g.y = app.screen.height*0.62;
  app.stage.addChild(g);

  const keyframes = (silhouetteSpec?.keyframes||[
    {t:0,pose:'arms_up'},{t:2.6,pose:'right_reach'},{t:5.2,pose:'left_reach'},{t:7.8,pose:'arms_up'}
  ]);
  const duration = keyframes[keyframes.length-1].t;

  function interpPose(t){
    const tt = ((t % duration) + duration) % duration;
    let i=0; while(i<keyframes.length-1 && keyframes[i+1].t < tt) i++;
    const a=keyframes[i], b=keyframes[(i+1)%keyframes.length];
    const span = (b.t>a.t)?(b.t-a.t):(b.t+duration-a.t);
    const u = (tt-a.t)/span;
    const A = poseToPoints(a.pose), B = poseToPoints(b.pose);
    return A.map((p,idx)=>[ p[0]*(1-u)+B[idx][0]*u, p[1]*(1-u)+B[idx][1]*u ]);
  }

  function drawAt(t){
    const pts = interpPose(t);
    g.clear();
    g.lineStyle({ width: 3, color: 0xff1ec8, alpha:1 });
    g.beginFill(0xffffff, 0.0);
    g.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length;i++){ g.lineTo(pts[i][0], pts[i][1]); }
    g.closePath(); g.endFill();
  }
  return { graphicsMask: g, updatePose: drawAt };
}