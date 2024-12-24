import { AmbientLight, BoxGeometry, BufferAttribute, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, ObjectSpaceNormalMap, PerspectiveCamera, Scene, TangentSpaceNormalMap, TextureLoader, Vector2, WebGLRenderer } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

const scene = new Scene();
const camera = new PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
camera.position.set(5,5,5)
scene.add(camera);
const ambientLight = new AmbientLight(0xffffff,1);
scene.add(ambientLight);
const directionalLight = new DirectionalLight( 0xffffff, 2);
directionalLight.position.set(5,5,5);
scene.add( directionalLight );

const loader = new TextureLoader();
/**颜色通道，一般用来放基础图像 */
const colorTexture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_COL_1K_METALNESS.jpg"))
/**慢射通道，用来控制光线反射 */
const aoTexture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_AO_1K_METALNESS.jpg"))
/**置换通道，用来控制物体形状 */
const dispTexture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_DISP_1K_METALNESS.jpg"))
/**法线通道，同来控制物体高低感，当光线照射上去的时候制造出立体感 */
const nrmTexture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_NRM_1K_METALNESS.jpg"))
/**用于改变材质的粗糙度，也叫 GLOSS */
const roughnessTextture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_ROUGHNESS_1K_METALNESS.jpg"))
/**金属通道，用来控制物体的金属感 */
const metalnessTextture = loader.load(require("../assets/textures/weaveSteel/MetalDesignerWeaveSteel002_METALNESS_1K_METALNESS.jpg"))
/**REFL 光线反射通道 */

const boxGeometry = new BoxGeometry(1,1,1);
boxGeometry.setAttribute("uv2",new BufferAttribute(boxGeometry.attributes.uv.array,2))
const standMaterial = new MeshStandardMaterial({
  // color:0xff0000,
  map:colorTexture,
  aoMap:aoTexture,
  aoMapIntensity:1,
  displacementMap:dispTexture,
  displacementScale:0,
  // displacementBias:-1,
  roughness:1,
  roughnessMap:roughnessTextture,
  metalness:1,
  metalnessMap:metalnessTextture,
  normalMap:nrmTexture,
});

const box = new Mesh(boxGeometry,standMaterial);
scene.add(box);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
const orbitControls = new OrbitControls(camera,renderer.domElement);
orbitControls.enableDamping = true;

document.body.appendChild(renderer.domElement);


function render(){
  orbitControls.update()
  renderer.render(scene,camera);
  requestAnimationFrame(render)
}
render()
