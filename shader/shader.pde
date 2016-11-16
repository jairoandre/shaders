PShader toon;
long start;

void setup() {
  size(800, 600, P3D);
  camera(70.0, 35.0, 120.0, 50.0, 50.0, 0.0, 
       0.0, 1.0, 0.0);
  noStroke();
  start = System.currentTimeMillis();
  toon = loadShader("fragmentShader.glsl", "vertexShader.glsl");
  toon.set("time", 0.0);
}

void draw() {
  shader(toon);
  background(0); 
  float dirY = (mouseY / float(height) - 0.5) * 2;
  float dirX = (mouseX / float(width) - 0.5) * 2;
  directionalLight(204, 204, 204, -dirX, -dirY, -1);
  translate(width/2, height/2);
  sphereDetail(200);
  sphere(20);
  float time = 0.00025 * (System.currentTimeMillis() - start);
  toon.set("time", time);
}