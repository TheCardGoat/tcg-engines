import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { arenaRows } from "./layout";

/** A soft reflection on the stone, below cards and engravings; no change to hand lighting. */
export function BoardPriorityLight({
  own,
  active,
  compact,
  horizontalScale,
  reducedMotion,
}: {
  own: boolean;
  active: boolean;
  compact: boolean;
  horizontalScale: number;
  reducedMotion: boolean;
}) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ amount: { value: 0 }, local: { value: own ? 1 : 0 } }), [own]);
  const rows = arenaRows(compact, own);
  const center = (rows.fieldCenter + rows.railCenter) / 2;
  const height =
    rows.railCenter - rows.fieldCenter + rows.railHeight / 2 + (compact ? 246 : 216) / 2 + 120;
  useFrame((state, delta) => {
    if (!material.current) return;
    const amount = material.current.uniforms.amount;
    const target = active ? 0.2 : 0;
    amount.value += (target - amount.value) * (reducedMotion ? 1 : 1 - Math.exp(-delta * 12));
    if (Math.abs(target - amount.value) > 0.001) state.invalidate();
  });
  return (
    <mesh position={[0, (own ? -1 : 1) * center, -4]}>
      <planeGeometry args={[2400 * horizontalScale, height * 1.45]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`varying vec2 vUv; uniform float amount; uniform float local;
        void main(){
          vec2 offset=(vUv-0.5)*2.0;
          // Broad, diffuse light with a fully transparent margin on every side.
          // The old ellipse retained brightness at the plane's left/right edges.
          vec2 feather=1.0-smoothstep(vec2(0.45),vec2(1.0),abs(offset));
          float falloff=exp(-2.4*dot(offset,offset))*feather.x*feather.y;
          vec3 light=mix(vec3(0.76,0.59,0.60),vec3(0.58,0.75,0.80),local);
          gl_FragColor=vec4(light,amount*falloff);
          #include <colorspace_fragment>
        }`}
      />
    </mesh>
  );
}
