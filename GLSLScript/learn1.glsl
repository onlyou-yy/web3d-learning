#ifdef GL_ES
precision mediump float;
#endif

// 画布尺寸，即代表画布宽高 (w,h)
uniform vec2 u_resolution;

void main(){
  vec2 circleSize = vec2(10,10);
  //是一个 vec4 类型的变量 (x, y, z, 1/w)，其中 x, y 是当前片元的窗口坐标。直译就是片元坐标
  vec2 st = gl_FragCoord.xy / u_resolution - 0.5;
  //step(n1,n2);当n2大于n1的时候返回1，否则返回0
  float stepV = step(0.5,st.x);
  //length(vec) 获取向量长度
  float lengthV = length(st);
  float circleRV = 1.0 - step(0.2,lengthV);

  // gl_FragColor = vec4(0,st.y,0,1);
  // gl_FragColor = vec4(0,stepV,0,1);
  // gl_FragColor = vec4(0,lengthV,0,1);
  gl_FragColor = vec4(circleRV,circleRV,circleRV,1);
}