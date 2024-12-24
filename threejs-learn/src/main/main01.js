import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import * as dat from "dat.gui";

// 最基本的东西 场景、摄像机、渲染器
//场景
const scene = new THREE.Scene();

/**摄像机
 * PerspectiveCamera(FOV,aspect ratio,near,far) 透视摄像机
 * FOV 视野角度 就是摄像机窗口大小
 * aspect ratio 长宽比 就是摄像机窗口长宽比
 * near 近截面 摄像机可以看到东西最近距离 
 * far 远截面 摄像机可以看到东西最远距离 
 * 当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中
 */
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
//设置摄像机的位置
camera.position.set(1,1,10);
//将摄像机添加到场景中
scene.add(camera);


//渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染器的大小
renderer.setSize(window.innerWidth,window.innerHeight);

//创建物体，创建一个物体需要一个几何体，然后需要用来填充这个框架的材质，之后需要将这框架和材质合成在一起才能形成一个物体
//创建一个几何体对象,这个对象包含物体的所有的顶点（vertices）和面（faces）
const geometry = new THREE.BoxGeometry(1,1,1);
//创建一个材质用来填充几何体
const material = new THREE.MeshBasicMaterial({color:0x00ff00})
//使用网格的方式进行填充,之后就可以得到一个具体的物体了
const cube = new THREE.Mesh(geometry,material);
//然后将物体添加到场景中
scene.add(cube);


//添加坐标轴
const axes = new THREE.AxesHelper(5);
scene.add(axes);

//将渲染目标添加到页面上
document.body.appendChild(renderer.domElement);

//之后将场景和摄像机进行渲染才能看到
// renderer.render( scene, camera );

//添加轨道控制器，之后摄像机可以根据鼠标的移动进行移动
// 轨道控制器就相当于让摄像机围绕着物体进行移动，类似卫星围绕地球转一样
const control = new OrbitControls(camera,renderer.domElement);
control.enableDamping = true;


//缩放
cube.scale.set(1,0.4,1.2);
//旋转
cube.rotation.set(Math.PI / 4,0,0,"XZY");

// 设置动画
gsap.to(cube.position,{x:5,duration:2});
gsap.to(cube.rotation,{x:2*Math.PI,duration:2});

function render(time){
  control.update();
  renderer.render( scene, camera );
  requestAnimationFrame(render);
}

render();

// 创建GUI控制面板
const gui = new dat.GUI();
// 控制物体的位置属性
gui.add(cube.position,"x").min(0).max(5).step(0.01).name("x轴移动").onChange((value)=>{
  console.log("x值被修改",value);
}).onFinishChange(()=>{
  console.log("执行完成");
});
// 控制物体颜色
const parmas = {
  color:"#ff0000",
  startAni:()=>{
    gsap.to(cube.position,{y:5,duration:2,repeat:true});
  }
}
gui.addColor(parmas,"color").onChange(value => {
  console.log("颜色",value);
  cube.material.color.set(value);
})
// 控制是否显示
gui.add(cube,"visible").name("是否显示")
// 控制执行事件
gui.add(parmas,"startAni").name("执行动画")
// 创建分组
const folder = gui.addFolder("设置立方体");
// 分组下设置开启线框
folder.add(cube.material,"wireframe");

window.addEventListener("resize",()=>{
  // 更新相机的比例
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新比例之后还需要更新相机的矩阵才能生效
  camera.updateProjectionMatrix();

  // 更新渲染器的大小，还有比例
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
})

window.addEventListener("dblclick",()=>{
  let fullScreenElement = document.fullscreenElement;
  if(fullScreenElement){
    document.exitFullscreen();
  }else{
    renderer.domElement.requestFullscreen();
  }
})


