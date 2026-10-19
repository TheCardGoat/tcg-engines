import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PlaneGeometry, ShaderMaterial, Texture } from "three";
import { boardFrameCover, boardFrameSize } from "./camera-layout";
import { arenaRows } from "./layout";

export const turnLightAssets = {
  off: "https://cdn.tcg.online/public/alpha-clash/simulator/arena-turn-lights-v1/table-lights-off.webp",
  blue: "https://cdn.tcg.online/public/alpha-clash/simulator/arena-turn-lights-v1/table-blue-lit.webp",
  red: "https://cdn.tcg.online/public/alpha-clash/simulator/arena-turn-lights-v1/table-red-lit.webp",
};

// Preserve the metal end caps while compressing only the empty stone between them.
// Both the neutral surface and the lit assets use this exact geometry and UV layout.
export function BoardFrameGeometry({ compact }: { compact: boolean }) {
  const { camera, viewport } = useThree();
  const scale = useMemo(() => boardFrameCover(camera, compact), [camera, viewport, compact]);
  const frame = boardFrameSize(compact);
  const height = frame.height * scale;
  return (
    <planeGeometry
      args={[frame.width * scale, height, 1, 3]}
      onUpdate={(geometry: PlaneGeometry) => {
        const positions = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        const rows = [height / 2, height / 2 - 120 * scale, -height / 2 + 160 * scale, -height / 2];
        const textureRows = [1, 0.905, 0.126, 0];
        for (let row = 0; row < 4; row++) {
          for (let column = 0; column < 2; column++) {
            positions.setY(row * 2 + column, rows[row]);
            uv.setY(row * 2 + column, textureRows[row]);
          }
        }
        positions.needsUpdate = true;
        uv.needsUpdate = true;
        geometry.computeBoundingSphere();
      }}
    />
  );
}

/** Registered border surfaces cross-fade; the stone and card shadows stay fixed. */
export function BoardTurnLighting({
  blue,
  red,
  ownTurn,
  compact,
  reducedMotion,
}: {
  blue?: Texture;
  red?: Texture;
  ownTurn: boolean | null;
  compact: boolean;
  reducedMotion: boolean;
}) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      blueMap: { value: blue },
      redMap: { value: red },
      blueAmount: { value: 0 },
      redAmount: { value: 0 },
    }),
    [blue, red],
  );
  useFrame((state, delta) => {
    if (!material.current) return;
    const live = material.current.uniforms;
    const factor = reducedMotion ? 1 : 1 - Math.exp(-delta * 18);
    const blueTarget = ownTurn === true ? 0.9 : 0;
    const redTarget = ownTurn === false ? 0.9 : 0;
    live.blueAmount.value += (blueTarget - live.blueAmount.value) * factor;
    live.redAmount.value += (redTarget - live.redAmount.value) * factor;
    if (
      Math.abs(blueTarget - live.blueAmount.value) + Math.abs(redTarget - live.redAmount.value) >
      0.001
    )
      state.invalidate();
  });
  return (
    <>
      {blue && red && (
        <mesh position={[0, -arenaRows(compact, true).seatOffset / 2 - 45, -7.9]}>
          <BoardFrameGeometry compact={compact} />
          <shaderMaterial
            ref={material}
            key={`${blue.uuid}:${red.uuid}`}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            toneMapped={false}
            vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={`
          uniform sampler2D blueMap; uniform sampler2D redMap;
          uniform float blueAmount; uniform float redAmount; varying vec2 vUv;
          void main(){
            vec3 b=texture2D(blueMap,vUv).rgb; vec3 r=texture2D(redMap,vUv).rgb;
            // Use the complete metal border, including its local light reflections.
            // Feather toward the fixed stone; never cross-fade the playfield itself.
            float sides=1.0-smoothstep(0.045,0.07,min(vUv.x,1.0-vUv.x));
            float lower=1.0-smoothstep(0.105,0.14,vUv.y);
            float upper=smoothstep(0.89,0.925,vUv.y);
            float bm=max(lower,sides*(1.0-smoothstep(0.35,0.5,vUv.y)))*blueAmount;
            float rm=max(upper,sides*smoothstep(0.5,0.65,vUv.y))*redAmount;
            float a=max(bm,rm);
            gl_FragColor=vec4((b*bm+r*rm)/max(bm+rm,0.0001),a);
            #include <colorspace_fragment>
          }`}
          />
        </mesh>
      )}
    </>
  );
}
