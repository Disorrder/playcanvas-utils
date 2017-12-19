attribute vec2 aPosition;
varying vec2 vUv;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUv = (aPosition.xy + 1.0) * 0.5;
}
