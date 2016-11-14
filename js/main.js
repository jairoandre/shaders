var container,
  renderer,
  scene,
  camera,
  mesh,
  start = Date.now(),
  fov = 30;

window.addEventListener('load', function () {

  // grab the container from the DOM
  container = document.getElementById('container');

  // create a scene
  scene = new THREE.Scene();

  // create a camera the size of the browser window
  // and place it 100 units away, looking towards the center of the scene
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    1,
    10000);
  camera.position.z = 100;
  camera.target = new THREE.Vector3(0, 0, 0);

  scene.add(camera);

  // create a wireframe material
  // material = new THREE.MeshBasicMaterial({
  //   color: 0xb7ff00,
  //   wireframe: true
  // })

  console.log(document.getElementById('vertexShader'));

  material = new THREE.ShaderMaterial({
    uniforms: {
        time: { // float initialized to 0
            type: "f",
            value: 0.0
        }
    },
    vertexShader: classicalNoise3D + vertexShader,
    fragmentShader: fragmentShader
  });

  // create a sphere and assign the material
  mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(20, 5),
    material
  );
  scene.add(mesh);

  // create the renderer and attach it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  render();
});

function render () {

  // let there be light
  material.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

var vertexShader = `
varying vec2 vUv;
varying float noise;
uniform float time;

float turbulence( vec3 p ) {
  float w = 100.0;
  float t = -.5;
  for (float f = 1.0 ; f <= 10.0 ; f++ ){
      float power = pow( 2.0, f );
      t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }
  return t;
}

void main() {

    vUv = uv;

    // add time to the noise parameters so it's animated
    noise = 10.0 *  -.10 * turbulence( .5 * normal + time * .25 );
    float b = 5.0 * pnoise( 0.05 * position + vec3( 0.5 * time ), vec3( 20.0 ) );
    float displacement = - noise + b;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
`;

var fragmentShader = `
varying vec2 vUv;
varying float noise;

void main() {

    // compose the colour using the UV coordinate
    // and modulate it with the noise like ambient occlusion
    vec3 color = vec3( vUv * ( 1. - 1. * noise ), .25 );
    gl_FragColor = vec4( color.rgb, .5 );

}
`;
