import {
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const renderer = new WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new Scene();
const axes = new AxesHelper(10);
const envLight = new AmbientLight(0xffffff, 0.2);
const pointLight = new PointLight(0xff0000, 1);
pointLight.position.set(5, 5, 5);

pointLight.castShadow = true;
// 设置阴影的模糊度
pointLight.shadow.radius = 20;
// 设置阴影的模糊度之后可能阴影会变得很模糊，所以还要将mapSize设置大点
pointLight.shadow.mapSize.set(2048, 2048);

const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const sphereGeometry = new SphereGeometry(1, 48, 48);
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

const smallBall = new Mesh(
  new SphereGeometry(0.2),
  new MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.add(pointLight);
smallBall.position.set(5, 5, 5);

//灯光可以打到的距离
pointLight.distance = 20;
//灯光距离光度的衰减量
pointLight.decay = 0.2;

const gui = new dat.GUI();
gui.add(pointLight.position, "x").min(-100).max(100).step(0.01).name("物体x");
gui.add(pointLight, "distance").min(0).max(100).step(0.01).name("灯光距离");
gui.add(pointLight, "decay").min(0).max(5).step(0.01).name("灯光距离衰减");

scene.add(gui);
scene.add(plane);
scene.add(axes);
scene.add(envLight);
scene.add(smallBall);
scene.add(camera);
scene.add(sphere);

document.body.appendChild(renderer.domElement);

const clock = new Clock();
function render() {
  let time = clock.getElapsedTime();
  smallBall.position.x = Math.sin(time) * 3;
  smallBall.position.z = Math.cos(time) * 3;
  renderer.render(scene, camera);
  // orbitControls.update();
  requestAnimationFrame(render);
}

render();
