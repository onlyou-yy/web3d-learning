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
const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);

directionalLight.castShadow = true;
// 设置阴影的模糊度
directionalLight.shadow.radius = 20;
// 设置阴影的模糊度之后可能阴影会变得很模糊，所以还要将mapSize设置大点
directionalLight.shadow.mapSize.set(2048, 2048);
// directionalLight.shadow 中还有个相机属性 camera 和透视相机一样决定照射阴影的范围
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.updateProjectionMatrix();

const gui = new dat.GUI();
gui
  .add(directionalLight.shadow.camera, "near")
  .min(0)
  .max(10)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
scene.add(gui);

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

const planeGeo = new PlaneGeometry(10, 10);
const plane = new Mesh(planeGeo, standardMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;

scene.add(plane);
scene.add(axes);
scene.add(envLight);
scene.add(directionalLight);
scene.add(camera);
scene.add(sphere);

document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
  orbitControls.update();
  requestAnimationFrame(render);
}

render();
