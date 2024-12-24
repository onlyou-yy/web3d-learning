import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SpotLight,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new Scene();
const axes = new AxesHelper(10);
const envLight = new AmbientLight(0xffffff, 0.5);
const spotLight = new SpotLight(0xffffff, 0.5);
spotLight.position.set(5, 5, 5);

spotLight.castShadow = true;
// 设置阴影的模糊度
spotLight.shadow.radius = 20;
// 设置阴影的模糊度之后可能阴影会变得很模糊，所以还要将mapSize设置大点
spotLight.shadow.mapSize.set(2048, 2048);

const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const sphereGeometry = new SphereGeometry(1);
const standardMaterial = new MeshStandardMaterial({
  color: 0xffffff,
});
const sphere = new Mesh(sphereGeometry, standardMaterial);
sphere.castShadow = true;

const planeGeo = new PlaneGeometry(50, 50);
const plane = new Mesh(planeGeo, standardMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;

//灯光跟随物体移动
spotLight.target = sphere;
//灯光的开口度
spotLight.angle = Math.PI / 6;
//灯光可以打到的距离
spotLight.distance = 0;
//灯光边缘光度的衰减量
spotLight.penumbra = 0;
//灯光距离光度的衰减量
spotLight.decay = 0;

const gui = new dat.GUI();
gui.add(sphere.position, "x").min(-100).max(100).step(0.01).name("物体x");
gui
  .add(spotLight, "angle")
  .min(Math.PI / 6)
  .max(Math.PI / 2)
  .name("灯光角度");
gui.add(spotLight, "distance").min(0).max(100).step(0.01).name("灯光距离");
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01).name("灯光边缘衰减");
gui.add(spotLight, "decay").min(0).max(5).step(0.01).name("灯光距离衰减");

scene.add(gui);
scene.add(plane);
scene.add(axes);
scene.add(envLight);
scene.add(spotLight);
scene.add(camera);
scene.add(sphere);

document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
  orbitControls.update();
  requestAnimationFrame(render);
}

render();

// 实现防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}

// 实现节流函数
function throttle(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}

// 实现并发请求函数
function throttleConcurrent(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}
