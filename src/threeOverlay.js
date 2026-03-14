export function initThreeOverlay(canvasSel){
  const canvas = document.querySelector(canvasSel);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:false });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1); scene.add(camera);
  const geo = new THREE.PlaneGeometry(2,2);
  const mat = new THREE.ShaderMaterial({
    transparent:true,
    uniforms: {
      uVoid: { value: 0.0 },
      uTime: { value: 0.0 },
      uRes:  { value: new THREE.Vector2(1,1) }
    },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
    fragmentShader:`precision mediump float; varying vec2 vUv; uniform float uVoid; uniform float uTime; uniform vec2 uRes;
    float rand(vec2 uv){ return fract(sin(dot(uv, vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 uv=vUv; float scan=sin((uv.y+uTime*0.05)*1200.0);
      float grain=(rand(uv*uRes.xy+uTime)-0.5)*0.18*uVoid;
      float edge = smoothstep(0.0, 1.0, uVoid);
      float a = 0.12 + 0.32*uVoid;
      vec3 col = mix(vec3(0.0), vec3(0.02,0.03,0.05) + 0.06*scan + grain, edge);
      gl_FragColor = vec4(col, a);
    }`
  });
  const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight; if(w===0||h===0) return;
    renderer.setSize(w,h,false); mat.uniforms.uRes.value.set(w,h);
  }
  window.addEventListener('resize', resize); resize();

  let t0 = performance.now();
  function update(voidMeter){
    mat.uniforms.uVoid.value = voidMeter; mat.uniforms.uTime.value = (performance.now()-t0)/1000.0;
    renderer.render(scene,camera);
  }
  return { update };
}