import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2, type ShaderMaterial } from "three";
import type { CardTransferRect } from "./motion";
import {
  resolutionTiming,
  sampleCardReaction,
  type CardReaction,
  type ResolutionKind,
} from "./resolution-motion";

const vertex = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `
varying vec2 vUv;
uniform vec2 board, origin, destination;
uniform float time, impactAt, reduced, inspecting, removal, effectActive;
void main(){
  vec2 p=vec2(vUv.x,1.-vUv.y)*board;
  vec2 delta=destination-origin;
  float len=max(length(delta),1.);
  vec2 dir=delta/len;
  vec2 rel=p-origin;
  float along=dot(rel,dir)/len;
  float across=abs(rel.x*dir.y-rel.y*dir.x);
  float charge=sin(clamp(time/140.,0.,1.)*3.14159)*step(time,140.)*effectActive;
  float flight=clamp((time-140.)/300.,0.,1.);
  float head=flight*flight*(3.-2.*flight);
  float tail=clamp((along-head+.26)/.26,0.,1.);
  float span=step(0.,along)*step(along,head)*step(head-.26,along);
  float taper=pow(tail,2.5);
  float beam=exp(-across*across/(3.+20.*tail))*span*taper;
  beam*=step(140.,time)*step(time,440.)*(1.-reduced)*effectActive;
  float relation=exp(-across*across/3.)*step(0.,along)*step(along,1.)*sin(clamp(along,0.,1.)*3.14159)*.22*inspecting;
  float post=max(0.,time-impactAt);
  float age=clamp(post/420.,0.,1.);
  float hit=step(impactAt,time)*(1.-age)*effectActive;
  float distanceToTarget=length(p-destination);
  float radius=12.+age*55.;
  float ring=exp(-pow((distanceToTarget-radius)/2.,2.))*hit*.5*(1.-reduced);
  float glow=exp(-distanceToTarget*distanceToTarget/(340.+age*1500.))*hit*.7;
  float sparks=0.;
  for(int i=0;i<8;i++){
    float a=float(i)*2.39996;
    vec2 spark=destination+vec2(cos(a),sin(a))*(10.+age*(48.+float(i)*5.));
    vec2 d=p-spark;
    sparks+=exp(-dot(d,d)/(1.4+2.*(1.-age)))*hit*(1.-reduced);
  }
  float sourceGlow=exp(-dot(rel,rel)/850.)*charge*.23*(1.-reduced);
  float alpha=clamp(beam+relation+ring+glow+sparks+sourceGlow,0.,.9);
  vec3 warm=mix(vec3(1.,.73,.32),vec3(.86,.81,1.),removal*.45);
  vec3 color=mix(warm,vec3(1.,.97,.87),clamp(beam+glow+sparks,0.,1.));
  gl_FragColor=vec4(color,alpha);
}`;

/** A single bounded shader pass, driven by the same R3F clock as card motion.
 * The source remains readable; a short tapered trail terminates at the target.
 * No arrows, looping particles, geometry allocation, or React state per frame. */
export function CardResolutionEffect({
  source,
  target,
  clock,
  phase,
  eventKey,
  kind,
  reduced = false,
  inspect = false,
  reaction,
  onImpact,
}: {
  source: CardTransferRect;
  target: CardTransferRect;
  clock: MutableRefObject<number>;
  phase: "idle" | "pending" | "resolve" | "outcome";
  eventKey: unknown;
  kind: ResolutionKind;
  reduced?: boolean;
  inspect?: boolean;
  reaction: MutableRefObject<CardReaction>;
  onImpact: () => void;
}) {
  const viewport = useThree((state) => state.size);
  const hit = useRef(false);
  const material = useRef<ShaderMaterial>(null);
  const callback = useRef(onImpact);
  callback.current = onImpact;
  const uniforms = useMemo(
    () => ({
      board: { value: new Vector2() },
      origin: { value: new Vector2() },
      destination: { value: new Vector2() },
      time: { value: -1000 },
      impactAt: { value: 440 },
      reduced: { value: 0 },
      inspecting: { value: 0 },
      removal: { value: 0 },
      effectActive: { value: 0 },
    }),
    [],
  );
  useLayoutEffect(() => {
    hit.current = false;
  }, [eventKey]);
  useLayoutEffect(
    () => () => {
      reaction.current = { x: 0, y: 0, scale: 1, opacity: 1 };
    },
    [reaction],
  );
  useFrame(() => {
    if (document.hidden) return;
    const impact = reduced ? resolutionTiming.reducedImpact : resolutionTiming.impact;
    const active = phase === "resolve" || phase === "outcome";
    const elapsed =
      phase === "outcome" ? impact + clock.current : phase === "resolve" ? clock.current : -1000;
    const live = material.current?.uniforms;
    if (!live) return;
    live.board.value.set(viewport.width, viewport.height);
    live.origin.value.set(source.left + source.width / 2, source.top + source.height / 2);
    live.destination.value.set(target.left + target.width / 2, target.top + target.height / 2);
    live.time.value = elapsed;
    live.impactAt.value = impact;
    live.reduced.value = Number(reduced);
    live.effectActive.value = Number(active);
    live.inspecting.value = Number(inspect && phase === "pending");
    live.removal.value = Number(kind === "remove");
    reaction.current = sampleCardReaction(kind, elapsed, reduced);
    if (phase === "resolve" && !hit.current && elapsed >= impact) {
      hit.current = true;
      callback.current();
    }
  }, -0.5);
  return (
    <mesh renderOrder={100}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
