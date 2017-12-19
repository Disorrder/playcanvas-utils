precision highp float;

varying vec2 vUv;

uniform vec4 uColor;
uniform sampler2D uColorBuffer;
uniform float t;

void main() {
    vec4 texColor = texture2D(uColorBuffer, vUv);
    gl_FragColor = mix(texColor, uColor, t);
}
