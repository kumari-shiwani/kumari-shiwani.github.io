export const clothVertex = /* glsl */ `
uniform float uTime;
uniform float uSeed;
uniform float uWind;
uniform float uFlutter;
uniform float uHover;
uniform vec2  uPointer;
uniform float uPointerForce;
uniform float uWidth;
uniform float uCalm;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vFold;

// Local space: top edge at y = 0, bottom at y = -1, x in [-w/2, w/2].
vec3 displace(vec3 p) {
  float hang = clamp(-p.y, 0.0, 1.0);
  float w = pow(hang, 1.25);
  float t = uTime;
  float edge = 1.0 - smoothstep(0.0, uWidth * 0.5, abs(p.x)) * 0.35;

  float wave =
      sin(p.x * 1.9 + t * 1.35 + uSeed * 6.2831) * 0.040
    + sin(p.x * 4.1 - t * 1.90 + uSeed * 3.1 + p.y * 2.6) * 0.018
    + sin(p.y * 4.6 + p.x * 0.7 + t * 1.05 + uSeed * 9.0) * 0.012;

  float z = wave * w * uCalm * (1.0 + uFlutter * 2.4);

  // wind from travelling along the line: cloth billows backwards and lifts
  float gust = 0.65 + 0.35 * sin(p.x * 1.6 + t * 3.2 + uSeed * 4.0);
  z -= abs(uWind) * w * 0.42 * gust;
  float dx = -uWind * w * 0.10;
  float dy = abs(uWind) * w * w * 0.10;

  // cursor: a soft dent plus a travelling ripple ring
  vec2 d2 = p.xy - uPointer;
  float d = length(d2);
  float dent = exp(-d * d * 3.2) * uPointerForce;
  z -= dent * 0.20 * (0.25 + w);
  z += sin(d * 11.0 - t * 7.0) * exp(-d * 1.8) * uPointerForce * 0.035 * (0.2 + w);

  // hover: the board lifts toward the viewer like a breath of air
  z += uHover * 0.10 * (0.35 + w) * edge;

  return vec3(p.x + dx, p.y + dy, p.z + z);
}

void main() {
  vUv = uv;
  vec3 p = displace(position);
  float e = 0.012;
  vec3 px = displace(position + vec3(e, 0.0, 0.0));
  vec3 py = displace(position + vec3(0.0, e, 0.0));
  vec3 n = normalize(cross(px - p, py - p));
  vNormal = normalize(normalMatrix * n);
  vFold = p.z - position.z;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const clothFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uReady;
uniform float uHover;
uniform float uOpacity;
uniform vec3  uPaper;
uniform vec3  uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3  uThread;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vFold;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  if (!gl_FrontFacing) n = -n;

  vec3 L = normalize(vec3(-0.45, 0.65, 0.75));
  float ndl = dot(n, L);
  float shade = 0.9 + 0.17 * ndl;
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  vec3 tex = texture2D(uMap, vUv).rgb;
  vec3 base = mix(uPaper, tex, uReady);

  // sewn hem at the top: a slightly darker casing with running stitches
  float hem = smoothstep(0.958, 0.962, vUv.y);
  base *= 1.0 - hem * 0.045;
  float stitchRow = smoothstep(0.0035, 0.0, abs(vUv.y - 0.968));
  float dash = step(0.45, fract(vUv.x * 92.0));
  base = mix(base, uThread, stitchRow * dash * 0.5);

  vec3 col = gl_FrontFacing ? base : uPaper * 0.92;
  col *= shade;
  col += rim * 0.05;
  col += uHover * 0.025;

  float depth = -vViewPos.z;
  float fog = smoothstep(uFogNear, uFogFar, depth);
  col = mix(col, uFogColor, fog);

  gl_FragColor = vec4(col, uOpacity);
}
`
