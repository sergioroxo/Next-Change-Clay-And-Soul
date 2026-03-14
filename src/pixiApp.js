export async function initPixiApp(canvasSel){
  const view = document.querySelector(canvasSel);
  const app = new PIXI.Application();

  // Pixi v8 initialisation is async
  await app.init({ view, backgroundAlpha:0, antialias:true, resizeTo: view.parentElement });

  // soft spotlights (Clay palette)
  const g = new PIXI.Graphics();
  g.beginFill(0xff1ec8, 0.08).drawCircle(0,0, 380).endFill();
  g.x = app.screen.width*0.68; g.y = app.screen.height*0.55; app.stage.addChild(g);

  const g2 = new PIXI.Graphics();
  g2.beginFill(0xffd36e, 0.10).drawCircle(0,0, 520).endFill();
  g2.x = app.screen.width*0.7; g2.y = app.screen.height*0.6; app.stage.addChild(g2);

  return app;
}
``
