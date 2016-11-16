
varying vec4 vertColor;
varying float noise;

float random( vec3 scale, float seed ){
    return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

    // compose the colour using the UV coordinate
    // and modulate it with the noise like ambient occlusion
    // get a random offset
    //float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
    vec2 vUv = vec2(vertColor.rgb);
    vec3 color = vec3( vUv * ( 1. - 1.3 * noise), 0. );
    gl_FragColor = vertColor;
}
