import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { sceneState } from './sceneState'

const COUNT = 9000
const CENTER = new THREE.Vector3(1.9, 0.1, 0)

// Three overlapping lobes — a blob with structure reads more alive than one gaussian.
const LOBES: [number, number, number, number][] = [
  [0.55, 0.35, 0.1, 0.85],
  [-0.5, -0.05, 0.25, 0.9],
  [0.05, -0.45, -0.35, 0.75],
]

// Network state: one node per directory category, laid out like the 3x2 card grid
// (01 02 03 / 04 05 06) so hovering a card lights the cluster in the same place.
const NODES: [number, number, number][] = [
  [-2.45, 1.25, -1.2],
  [0, 1.5, -1.9],
  [2.45, 1.25, -1.4],
  [-2.25, -1.35, -1.6],
  [0, -1.6, -1.0],
  [2.25, -1.35, -2.1],
]

// Grid neighbours plus two diagonals through the middle
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [3, 4],
  [4, 5],
  [0, 3],
  [1, 4],
  [2, 5],
  [0, 4],
  [2, 4],
]

const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Curl of the simplex field via central differences — divergence-free, so the
// cloud swirls and folds instead of drifting apart.
vec3 curl(vec3 p) {
  const float e = 0.1;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));

  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);
  return normalize(vec3(x, y, z) / (2.0 * e));
}
`

// Rotation and the core→network drift are shared by the particles and the bonds,
// so the two never come apart.
const placement = /* glsl */ `
vec3 place(vec3 pos, float angle, float morph, vec3 center) {
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  pos.xz = rot * pos.xz;
  return pos + mix(center, vec3(0.0), morph);
}
`

const vertexShader = /* glsl */ `
attribute vec3 aNet;
attribute float aCluster;
attribute float aSeed;

uniform float uTime;
uniform float uAngle;
uniform float uMorph;
uniform vec3 uCenter;
uniform vec3 uPointer;
uniform float uRepulsion;
uniform float uSize;

varying float vCluster;
varying float vSeed;
varying float vDepth;

${simplex}
${placement}

void main() {
  vec3 pos = mix(position, aNet, uMorph);

  // Organic drift along a slowly translating curl field — strong in the core
  // state, calm once the cloud has settled into the graph
  float amp = 0.26 * (1.0 - uMorph) + 0.05;
  pos += curl(pos * 0.8 + vec3(0.0, uTime * 0.12, 0.0)) * amp;

  // Breathing pulse, phase-shifted per particle
  pos *= 1.0 + 0.03 * (1.0 - uMorph) * sin(uTime * 1.4 + aSeed * 6.2831);

  pos = place(pos, uAngle, uMorph, uCenter);

  // Cursor repulsion: gaussian falloff in world space
  vec3 toPointer = pos - uPointer;
  float d2 = dot(toPointer, toPointer);
  pos += normalize(toPointer + 1e-4) * exp(-d2 * 2.5) * uRepulsion;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.7 + 0.6 * aSeed) * (6.0 / max(1.0, -mv.z));

  vCluster = aCluster;
  vSeed = aSeed;
  vDepth = -mv.z;
}
`

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform float uMorph;
uniform float uHovered;  // -1 = none, else cluster index 0..5

varying float vCluster;
varying float vSeed;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.12, d);
  if (alpha < 0.01) discard;

  // ~7% of particles burn amber — instrument lights on the specimen
  vec3 color = mix(uColorA, uColorB, step(0.93, vSeed));

  // Cluster hover: lift mine, dim the rest (network state only)
  float isMine = step(abs(vCluster - uHovered), 0.5);
  float hasHover = step(-0.5, uHovered);
  float highlight = 1.0 + isMine * hasHover * uMorph * 0.9;
  float dim = 1.0 - (1.0 - isMine) * hasHover * uMorph * 0.6;

  // Depth fade keeps the far side of the cloud atmospheric
  float depthFade = smoothstep(11.0, 4.0, vDepth);

  // The graph sits behind text — it dims globally so it stays atmosphere
  float stateFade = 1.0 - 0.45 * uMorph;

  gl_FragColor = vec4(
    color * highlight,
    alpha * uOpacity * dim * stateFade * (0.45 + 0.55 * depthFade)
  );
}
`

const bondVertexShader = /* glsl */ `
attribute float aT;    // 0 at edge start, 1 at edge end
attribute float aSeed; // per-edge random phase

uniform float uAngle;
uniform float uMorph;
uniform vec3 uCenter;

varying float vT;
varying float vSeed;

${placement}

void main() {
  vT = aT;
  vSeed = aSeed;
  vec3 pos = place(position, uAngle, uMorph, uCenter);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const bondFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uOpacity; // already multiplied by uMorph — bonds only exist in the graph
uniform vec3 uColor;

varying float vT;
varying float vSeed;

void main() {
  // Faint constant bond
  float base = 0.16;

  // A light pulse travels start -> end, phase-shifted per edge
  float pulsePos = fract(uTime * 0.22 + vSeed);
  float pulse = exp(-pow((vT - pulsePos) * 9.0, 2.0)) * 1.6;

  float alpha = (base + pulse) * uOpacity;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uColor * (1.0 + pulse), alpha);
}
`

function Scene() {
  const coreRef = useRef<THREE.ShaderMaterial>(null)
  const bondRef = useRef<THREE.ShaderMaterial>(null)
  const { gl, camera } = useThree()

  const geometry = useMemo(() => {
    // Deterministic PRNG so the cloud looks the same on every load
    let s = 42
    const rand = () => {
      s |= 0
      s = (s + 0x6d2b79f5) | 0
      let t = Math.imul(s ^ (s >>> 15), 1 | s)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-6))) * Math.cos(2 * Math.PI * rand())

    const core = new Float32Array(COUNT * 3)
    const net = new Float32Array(COUNT * 3)
    const clusters = new Float32Array(COUNT)
    const seeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const lobe = LOBES[i % LOBES.length]
      const sigma = lobe[3]
      core[i * 3] = lobe[0] + gauss() * sigma * 0.55
      core[i * 3 + 1] = lobe[1] + gauss() * sigma * 0.5
      core[i * 3 + 2] = lobe[2] + gauss() * sigma * 0.55

      const cluster = i % NODES.length
      const node = NODES[cluster]
      net[i * 3] = node[0] + gauss() * 0.28
      net[i * 3 + 1] = node[1] + gauss() * 0.28
      net[i * 3 + 2] = node[2] + gauss() * 0.28

      clusters[i] = cluster
      seeds[i] = rand()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(core, 3))
    geo.setAttribute('aNet', new THREE.BufferAttribute(net, 3))
    geo.setAttribute('aCluster', new THREE.BufferAttribute(clusters, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.computeBoundingSphere()
    return geo
  }, [])

  const bondGeometry = useMemo(() => {
    const positions = new Float32Array(EDGES.length * 2 * 3)
    const t = new Float32Array(EDGES.length * 2)
    const seeds = new Float32Array(EDGES.length * 2)

    EDGES.forEach(([a, b], i) => {
      positions.set(NODES[a], i * 6)
      positions.set(NODES[b], i * 6 + 3)
      t[i * 2] = 0
      t[i * 2 + 1] = 1
      // Golden-ratio stagger so no two pulses travel in lockstep
      const phase = (0.618034 * i) % 1
      seeds[i * 2] = phase
      seeds[i * 2 + 1] = phase
    })

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aT', new THREE.BufferAttribute(t, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [])

  // Animation state lives here, not in the uniform objects below: three clones the
  // uniforms it is handed when it builds the material, so the objects passed as
  // props are templates for the initial values only. Per-frame writes have to go
  // through `material.uniforms` via the refs — see useFrame.
  const anim = useMemo(
    () => ({ time: 0, angle: 0, morph: 0, repulsion: 0, pointer: new THREE.Vector3(999, 999, 0) }),
    [],
  )

  const baseUniforms = () => ({
    uTime: { value: 0 },
    uAngle: { value: 0 },
    uMorph: { value: 0 },
    uHovered: { value: -1 },
    uCenter: { value: CENTER.clone() },
    uPointer: { value: new THREE.Vector3(999, 999, 0) },
    uRepulsion: { value: 0 },
  })

  const pointUniforms = useMemo(
    () => ({
      ...baseUniforms(),
      uSize: { value: 3.2 * Math.min(2, gl.getPixelRatio()) },
      uOpacity: { value: 0.95 },
      uColorA: { value: new THREE.Color('#00f0b5') },
      uColorB: { value: new THREE.Color('#ffb347') },
    }),
    [gl],
  )
  const bondUniforms = useMemo(
    () => ({ ...baseUniforms(), uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#00f0b5') } }),
    [],
  )

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const coarse = useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const slow = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useFrame((_state, delta) => {
    if (!coreRef.current || !bondRef.current) return

    const dt = Math.min(delta, 1 / 20) * (slow ? 0.25 : 1)
    anim.time += dt
    anim.morph += (sceneState.morph - anim.morph) * Math.min(1, 6 * delta)
    // The graph holds still while you read it; the loose core keeps turning
    anim.angle += dt * 0.05 * (1 - anim.morph)

    if (!coarse) {
      ndc.set(sceneState.pointer[0], sceneState.pointer[1])
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) {
        anim.pointer.lerp(hit, Math.min(1, 8 * delta))
      }
      anim.repulsion += (0.42 - anim.repulsion) * Math.min(1, 4 * delta)
    }

    const points = coreRef.current.uniforms
    points.uTime.value = anim.time
    points.uAngle.value = anim.angle
    points.uMorph.value = anim.morph
    points.uHovered.value = sceneState.hovered
    points.uPointer.value.copy(anim.pointer)
    points.uRepulsion.value = anim.repulsion

    const bonds = bondRef.current.uniforms
    bonds.uTime.value = anim.time
    bonds.uAngle.value = anim.angle
    bonds.uMorph.value = anim.morph
    bonds.uOpacity.value = anim.morph
    bondRef.current.visible = anim.morph > 0.01

    // Uniforms are only re-uploaded when a different material was bound in between,
    // which a scene this small cannot rely on
    coreRef.current.uniformsNeedUpdate = true
    bondRef.current.uniformsNeedUpdate = true
  })

  return (
    <>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={coreRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={bondGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={bondRef}
          vertexShader={bondVertexShader}
          fragmentShader={bondFragmentShader}
          uniforms={bondUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

/**
 * DOM side of the scene. Scroll drives the core -> network morph: the blob holds
 * through the hero and has collapsed into the graph by the time the directory is
 * in view. The pointer is tracked on window because the canvas sits behind the
 * page and never receives events itself.
 */
function useSceneDriver() {
  useEffect(() => {
    let frame = 0
    const readScroll = () => {
      frame = 0
      const h = window.innerHeight
      sceneState.morph = Math.min(1, Math.max(0, (window.scrollY - h * 0.3) / (h * 0.5)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(readScroll)
    }
    const onPointerMove = (e: PointerEvent) => {
      sceneState.pointer = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2) + 1,
      ]
    }

    readScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
}

export default function NeuralCore() {
  useSceneDriver()

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => gl.setClearColor('#0a0b0e', 0)}
      className="!absolute inset-0"
    >
      <Scene />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.25} luminanceSmoothing={0.5} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.45} />
      </EffectComposer>
    </Canvas>
  )
}
