import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Group, Mesh, ShaderMaterial, MeshStandardMaterial, PMREMGenerator, Shape } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { coinImpactMs, coinSettleMs, sampleCoinMotion } from "./coin-motion";

export function TurnOrderCoin({
  clock,
  phase,
  reduced,
  modelUrl,
  onLand,
}: {
  clock: MutableRefObject<number>;
  phase: "hidden" | "toss" | "hold";
  reduced: boolean;
  modelUrl?: string;
  onLand: () => void;
}) {
  const { invalidate, gl } = useThree();
  const environment = useMemo(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const result = generator.fromScene(room, 0.04);
    room.dispose();
    generator.dispose();
    return result;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);
  const coin = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const shadowMaterial = useRef<ShaderMaterial>(null);
  const landed = useRef(false);
  const previousPhase = useRef(phase);
  const [model, setModel] = useState<Group | null>(null);
  const mark = useMemo(() => {
    const shape = new Shape();
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 ? 7 : 22;
      const angle = (i * Math.PI) / 4;
      const x = Math.sin(angle) * radius,
        y = Math.cos(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);
  useEffect(() => {
    if (!modelUrl) return;
    let cancelled = false;
    let loaded: Group | undefined;
    const dispose = (root: Group) =>
      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (material instanceof MeshStandardMaterial) {
            for (const texture of new Set([
              material.map,
              material.normalMap,
              material.roughnessMap,
              material.metalnessMap,
              material.aoMap,
            ]))
              texture?.dispose();
          }
          material.dispose();
        }
      });
    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        if (cancelled) {
          dispose(gltf.scene);
          return;
        }
        loaded = gltf.scene;
        loaded.traverse((object) => {
          if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
            object.material.envMap = environment.texture;
            object.material.metalness = 0.92;
            object.material.roughness = 0.58;
          }
        });
        setModel(loaded);
        invalidate();
      },
      undefined,
      () => {
        /* The procedural coin remains available if the optional asset fails. */
      },
    );
    return () => {
      cancelled = true;
      if (loaded) dispose(loaded);
    };
  }, [modelUrl, invalidate, environment]);
  useFrame(() => {
    if (!coin.current || !shadow.current || document.hidden) return;
    if (phase !== previousPhase.current) {
      if (phase === "toss" || phase === "hidden") landed.current = false;
      previousPhase.current = phase;
    }
    const motion = sampleCoinMotion(phase === "hold" ? coinSettleMs : clock.current, reduced);
    coin.current.position.set(0, -28 + motion.height * 0.45, 18 + motion.height);
    coin.current.rotation.set(motion.tilt, 0.08, motion.roll);
    coin.current.scale.setScalar(1 + motion.height / 500);
    const airborne = Math.min(1, motion.height / 108);
    const spread = 1 + airborne * 0.8;
    // Upper-left key light: the cast shadow falls down and right on the table.
    shadow.current.position.set(3 + motion.height * 0.22, -31 - motion.height * 0.14, -25);
    shadow.current.scale.set(spread, spread * (0.75 + 0.25 * Math.abs(Math.cos(motion.tilt))), 1);
    if (shadowMaterial.current) {
      shadowMaterial.current.uniforms.opacity.value = 0.42 - airborne * 0.25;
      shadowMaterial.current.uniforms.edge.value = 0.76 - airborne * 0.5;
    }
    if (phase === "toss" && !landed.current && (reduced || clock.current >= coinImpactMs)) {
      landed.current = true;
      onLand();
    }
  });
  return (
    <group visible={phase !== "hidden"}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[-120, 180, 300]} intensity={3.5} />
      <directionalLight position={[160, -50, 180]} intensity={1.2} color="#e7f3ff" />
      <mesh ref={shadow} position={[0, -31, -25]} scale={1}>
        <planeGeometry args={[124, 124]} />
        <shaderMaterial
          ref={shadowMaterial}
          transparent
          depthWrite={false}
          uniforms={{ opacity: { value: 0.42 }, edge: { value: 0.76 } }}
          vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="varying vec2 vUv; uniform float opacity; uniform float edge; void main(){float r=length((vUv-0.5)*2.0);gl_FragColor=vec4(0.0,0.0,0.0,opacity*(1.0-smoothstep(edge,1.0,r)));}"
        />
      </mesh>
      <group ref={coin} position={[0, -28, 18]}>
        {model ? (
          <primitive object={model} scale={74} />
        ) : (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[52, 52, 8, 64]} />
            <meshStandardMaterial
              envMap={environment.texture}
              color="#b79245"
              metalness={0.55}
              roughness={0.4}
            />
          </mesh>
        )}
        {[1, -1].map((side) => (
          <group
            key={side}
            position={[0, 0, side * 5.2]}
            rotation={[side === -1 ? Math.PI : 0, 0, 0]}
          >
            <mesh>
              <ringGeometry args={[40, 42, 64]} />
              <meshStandardMaterial
                envMap={environment.texture}
                color="#e6c67c"
                metalness={0.55}
                roughness={0.4}
              />
            </mesh>
            <mesh>
              <extrudeGeometry
                args={[
                  mark,
                  {
                    depth: 0.8,
                    bevelEnabled: true,
                    bevelSegments: 1,
                    steps: 1,
                    bevelSize: 0.6,
                    bevelThickness: 0.4,
                  },
                ]}
              />
              <meshStandardMaterial
                envMap={environment.texture}
                color="#e6c67c"
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
