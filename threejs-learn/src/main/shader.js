import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";

const scene = new Scene();
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 6);
scene.add(camera);

const textureloader = new TextureLoader();
const texture = textureloader.load(require("../assets/textures/bird/bird.jpg"));
const depthTexture = textureloader.load(
  require("../assets/textures/bird/bird_depth.jpg")
);

const mouse = new Vector2(0, 0);
const planeGeo = new PlaneGeometry(6.4, 4.27);
const shaderMaterial = new ShaderMaterial({
  uniforms: {
    uTexture: {
      value: texture,
    },
    uDepthTexture: {
      value: depthTexture,
    },
    uMouse: {
      value: mouse,
    },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform vec2 u_resolution;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;
    void main(){
      vec4 color = texture2D(uTexture,vUv);
      vec4 depth = texture2D(uDepthTexture,vUv);
      float depthValue = depth.r;
      float x = vUv.x + uMouse.x * 0.02 * depthValue;
      float y = vUv.y + uMouse.y * 0.02 * depthValue;
      vec4 newColor = texture2D(uTexture,vec2(x,y));
      gl_FragColor = newColor;
    }
  `,
});
// const shaderMaterial = new MeshBasicMaterial({ map: texture });
const plane = new Mesh(planeGeo, shaderMaterial);
scene.add(plane);

document.body.appendChild(renderer.domElement);

function render() {
  shaderMaterial.uniforms.uMouse.value = mouse;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

window.addEventListener("mousemove", (event) => {
  // 范围在 （-1 ，1）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
