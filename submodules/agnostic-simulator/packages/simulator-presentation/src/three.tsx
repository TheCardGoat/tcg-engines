import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import * as THREE from "three";
import { cardSelection } from "./card-selection";

/** Structural view of the shared simulator-ui drag store. No game rules live here. */
export interface SceneDragMotion<T = string> {
  getSnapshot(): {
    source: T;
    rect: object;
    phase: "dragging" | "pending" | "returning";
    offset: { x: number; y: number };
  } | null;
  subscribe(listener: () => void): () => void;
}

const noDrag = () => null;
const subscribeNoDrag = () => () => {};

/** Cyberpunk's existing mesh drag, shared with other tabletop scenes. */
export function useSceneCardDrag<T>(
  motion: SceneDragMotion<T> | null | undefined,
  ownsSource: (source: T) => boolean,
  reduced: boolean,
) {
  const session = useSyncExternalStore(
    motion?.subscribe ?? subscribeNoDrag,
    motion?.getSnapshot ?? noDrag,
    noDrag,
  );
  const { camera, gl, invalidate } = useThree();
  const dragOrigin = useRef<{ session: object; projected: THREE.Vector3 } | null>(null);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const dragSway = useRef({ session: null as object | null, x: 0, y: 0, roll: 0, pitch: 0 });
  useEffect(() => motion?.subscribe(invalidate), [motion, invalidate]);
  useEffect(() => {
    invalidate();
  }, [session, invalidate]);
  const update = (
    object: THREE.Group,
    delta: number,
    tiltX: number,
    tiltY: number,
    angle: number,
  ) => {
    const current = motion?.getSnapshot();
    const ownsDrag = !!current && ownsSource(current.source);
    const sway = dragSway.current;
    const dt = Math.min(0.05, Math.max(1 / 240, delta));
    let roll = 0;
    let pitch = 0;
    if (ownsDrag && current) {
      if (sway.session !== current.rect) {
        sway.session = current.rect;
        sway.x = 0;
        sway.y = 0;
      }
      // Screen-relative speed gives the same restrained sway at every board size.
      // Translation stays exact; only the sleeve leans into the gesture.
      const bounds = gl.domElement.getBoundingClientRect();
      if (!reduced && current.phase === "dragging") {
        const vx = (current.offset.x - sway.x) / Math.max(1, bounds.width) / dt;
        const vy = (current.offset.y - sway.y) / Math.max(1, bounds.height) / dt;
        roll = Math.max(-0.09, Math.min(0.09, -vx * 0.12));
        pitch = Math.max(-0.055, Math.min(0.055, vy * 0.08));
      }
      sway.x = current.offset.x;
      sway.y = current.offset.y;
    } else {
      sway.session = null;
    }
    const follow = 1 - Math.exp(-14 * dt);
    sway.roll = reduced ? 0 : sway.roll + (roll - sway.roll) * follow;
    sway.pitch = reduced ? 0 : sway.pitch + (pitch - sway.pitch) * follow;
    if (ownsDrag || Math.abs(sway.roll) + Math.abs(sway.pitch) > 0.0002)
      object.rotation.set(tiltX + sway.pitch, tiltY, angle + sway.roll);
    if (Math.abs(sway.roll) + Math.abs(sway.pitch) > 0.0002 || roll || pitch) invalidate();
    if (ownsDrag && current) {
      if (dragOrigin.current?.session !== current.rect) {
        dragOrigin.current = {
          session: current.rect,
          projected: object.position.clone().project(camera),
        };
      }
      projected.copy(dragOrigin.current.projected);
      const bounds = gl.domElement.getBoundingClientRect();
      projected.x += (current.offset.x / bounds.width) * 2;
      projected.y -= (current.offset.y / bounds.height) * 2;
      object.position.copy(projected.unproject(camera));
      return true;
    }
    dragOrigin.current = null;
    return false;
  };
  return { dragging: !!session && ownsSource(session.source), update };
}

export interface ScenePose {
  x: number;
  y: number;
  z: number;
  turn: number;
  scale: number;
}
/** Reconcile a mesh toward a projected pose, snapping across privacy/reset boundaries. */
export function useCardPose(
  target: ScenePose,
  {
    origin,
    drag,
    resetKey,
    reduced = false,
    rotationX = -Math.PI / 2,
    transition,
  }: {
    origin?: ScenePose;
    drag?: { motion: SceneDragMotion; id: string };
    resetKey?: unknown;
    reduced?: boolean;
    /** Board plane orientation; defaults to the existing horizontal XZ table. */
    rotationX?: number;
    /** Opt-in elevated transfer, triggered only when this key changes. */
    transition?: {
      key: unknown;
      duration: number;
      lift: number;
      liftAxis?: "y" | "z";
      /** Let movement lead the turn into the destination orientation. */
      turnDelay?: number;
      onComplete?: () => void;
    };
  },
) {
  const ref = useRef<THREE.Group>(null);
  const mounted = useRef(false);
  const cardDrag = useSceneCardDrag(drag?.motion, (source) => source === drag?.id, reduced);
  const transitionKey = useRef(transition?.key);
  const flight = useRef<{
    elapsed: number;
    duration: number;
    lift: number;
    liftAxis: "y" | "z";
    from: ScenePose;
    rotationX: number;
    turnDelay: number;
    onComplete?: () => void;
  } | null>(null);
  const reset = useRef(resetKey);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    const object = ref.current;
    if (!object) return;
    if (transition && transitionKey.current !== transition.key && mounted.current && !reduced) {
      flight.current = {
        elapsed: 0,
        duration: transition.duration,
        lift: transition.lift,
        liftAxis: transition.liftAxis ?? "z",
        from: {
          x: object.position.x,
          y: object.position.y,
          z: object.position.z,
          turn: object.rotation.z,
          scale: object.scale.x,
        },
        rotationX: object.rotation.x,
        turnDelay: Math.max(0, Math.min(0.95, transition.turnDelay ?? 0)),
        onComplete: transition.onComplete,
      };
    }
    if (transition && transitionKey.current !== transition.key && mounted.current && reduced)
      transition.onComplete?.();
    transitionKey.current = transition?.key;
    if (!mounted.current || reset.current !== resetKey || reduced) {
      flight.current = null;
      const pose = !mounted.current && !reduced ? (origin ?? target) : target;
      object.position.set(pose.x, pose.y, pose.z);
      object.rotation.set(rotationX, 0, pose.turn);
      object.scale.setScalar(pose.scale);
      mounted.current = true;
      reset.current = resetKey;
    }
    invalidate();
  }, [
    transition?.key,
    target.x,
    target.y,
    target.z,
    target.turn,
    target.scale,
    origin,
    resetKey,
    reduced,
    rotationX,
    invalidate,
  ]);
  useFrame((_, delta) => {
    const object = ref.current;
    if (!object || document.hidden) return;
    if (cardDrag.update(object, delta, rotationX, 0, target.turn)) {
      flight.current = null;
      return;
    }
    if (reduced) return;
    const transfer = flight.current;
    if (transfer) {
      transfer.elapsed += delta;
      const t = Math.min(1, transfer.elapsed / transfer.duration);
      const ease = t * t * t * (t * (t * 6 - 15) + 10);
      const arc = Math.sin(Math.PI * t);
      object.position.set(
        THREE.MathUtils.lerp(transfer.from.x, target.x, ease),
        THREE.MathUtils.lerp(transfer.from.y, target.y, ease) +
          (transfer.liftAxis === "y" ? arc * transfer.lift : 0),
        THREE.MathUtils.lerp(transfer.from.z, target.z, ease) +
          (transfer.liftAxis === "z" ? arc * transfer.lift : 0),
      );
      const turnProgress = Math.max(0, (t - transfer.turnDelay) / (1 - transfer.turnDelay));
      const turnEase = turnProgress * turnProgress * (3 - 2 * turnProgress);
      object.rotation.x =
        THREE.MathUtils.lerp(transfer.rotationX, rotationX, ease) - (transfer.lift ? arc * 0.1 : 0);
      object.rotation.z =
        THREE.MathUtils.lerp(
          transfer.from.turn,
          target.turn,
          transfer.turnDelay ? turnEase : ease,
        ) + (transfer.lift ? arc * 0.035 * Math.sign(transfer.from.x - target.x) : 0);
      object.scale.setScalar(THREE.MathUtils.lerp(transfer.from.scale, target.scale, ease));
      if (t === 1) {
        flight.current = null;
        transfer.onComplete?.();
      }
      invalidate();
      return;
    }
    const step = 1 - Math.exp(-18 * Math.min(delta, 0.04));
    object.position.x = THREE.MathUtils.lerp(object.position.x, target.x, step);
    object.position.y = THREE.MathUtils.lerp(object.position.y, target.y, step);
    object.position.z = THREE.MathUtils.lerp(object.position.z, target.z, step);
    object.rotation.x = THREE.MathUtils.lerp(object.rotation.x, rotationX, step);
    object.rotation.z = THREE.MathUtils.lerp(object.rotation.z, target.turn, step);
    object.scale.setScalar(THREE.MathUtils.lerp(object.scale.x, target.scale, step));
    if (
      Math.abs(object.position.x - target.x) +
        Math.abs(object.position.y - target.y) +
        Math.abs(object.position.z - target.z) +
        Math.abs(object.rotation.x - rotationX) +
        Math.abs(object.rotation.z - target.turn) +
        Math.abs(object.scale.x - target.scale) >
      0.002
    )
      invalidate();
  });
  return ref;
}

/** Soft, bounded contact shadow. Does not require a second shadow-map render pass. */
export function CardShadow({
  width = 1.22,
  height = 1.64,
  opacity = 0.58,
}: {
  width?: number;
  height?: number;
  opacity?: number;
}) {
  return (
    <mesh position={[0.035, -0.045, -0.075]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ opacity: { value: opacity } }}
        vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader="uniform float opacity; varying vec2 vUv; void main(){vec2 edge=smoothstep(vec2(0.0),vec2(0.14),vUv)*smoothstep(vec2(0.0),vec2(0.14),1.0-vUv); gl_FragColor=vec4(0.015,0.01,0.008,edge.x*edge.y*opacity);}"
      />
    </mesh>
  );
}

/** Rounded card silhouette with UVs fitted to the printed artwork. */
function RoundedCard({
  texture,
  back,
  aspect,
  edgeColor,
}: {
  texture: THREE.Texture;
  back?: THREE.Texture;
  aspect: number;
  edgeColor: string;
}) {
  const source = texture.image;
  const ratio = source?.width && source?.height ? source.width / source.height : aspect;
  const width = Math.min(1, ratio / aspect);
  const height = width / ratio;
  const geometry = useMemo(() => {
    const x = -width / 2,
      y = -height / 2,
      r = width * 0.07;
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    const face = new THREE.ShapeGeometry(shape, 12);
    const positions = face.getAttribute("position");
    const uv = face.getAttribute("uv");
    for (let i = 0; i < positions.count; i++)
      uv.setXY(i, (positions.getX(i) - x) / width, (positions.getY(i) - y) / height);
    const body = new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 12,
    });
    return { face, body };
  }, [width, height]);
  useEffect(
    () => () => {
      geometry.face.dispose();
      geometry.body.dispose();
    },
    [geometry],
  );
  return (
    <>
      <mesh geometry={geometry.body} position={[0, 0, -0.012]} castShadow>
        <meshStandardMaterial color={edgeColor} roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh geometry={geometry.face} position={[0, 0, 0.002]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh geometry={geometry.face} position={[0, 0, -0.014]} rotation={[0, Math.PI, 0]}>
        <meshBasicMaterial map={back} color={back ? "#ffffff" : "#18232d"} toneMapped={false} />
      </mesh>
    </>
  );
}

/** World-space card body; adapters provide authorized textures only. */
export function SceneCard({
  texture,
  aspect = 5 / 7,
  failed = false,
  edgeColor = "#89b6ac",
  rounded = false,
  backTexture,
}: {
  texture?: THREE.Texture;
  aspect?: number;
  failed?: boolean;
  edgeColor?: string;
  rounded?: boolean;
  backTexture?: THREE.Texture;
}) {
  if (rounded && texture)
    return (
      <RoundedCard texture={texture} back={backTexture} aspect={aspect} edgeColor={edgeColor} />
    );
  const source = texture?.image;
  const imageAspect =
    source &&
    typeof source.width === "number" &&
    typeof source.height === "number" &&
    source.height > 0
      ? source.width / source.height
      : aspect;
  const artWidth = Math.min(1, imageAspect / aspect);
  return (
    <>
      <CardShadow height={1 / aspect + 0.24} />
      <mesh castShadow position={[0, 0, -0.028]}>
        <boxGeometry args={[1.035, 1 / aspect + 0.035, 0.065]} />
        <meshStandardMaterial color={edgeColor} roughness={0.4} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[1, 1 / aspect]} />
        <meshBasicMaterial color={failed ? "#502a35" : "#17262d"} />
      </mesh>
      {texture ? (
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[artWidth, artWidth / imageAspect]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ) : (
        <group position={[0, 0, 0.014]}>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              rotation={[0, 0, failed ? ((i ? -1 : 1) * Math.PI) / 4 : 0]}
              position={[0, !failed && i ? -0.14 : 0, i * 0.001]}
            >
              <planeGeometry args={[0.48, 0.045]} />
              <meshBasicMaterial color={failed ? "#ffc4ce" : "#95a9bb"} />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}

export function CardSelectionRim({
  selected,
  color = cardSelection.rim,
  aspect = 5 / 7,
}: {
  selected: boolean;
  color?: string;
  aspect?: number;
}) {
  const width = 1.1,
    height = 1 / aspect + 0.08,
    thickness = selected ? 0.05 : 0.025;
  return (
    <group position={[0, 0, 0.025]}>
      {[-width / 2, width / 2].map((x) => (
        <mesh key={`x${x}`} position={[x, 0, 0]}>
          <planeGeometry args={[thickness, height]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      {[-height / 2, height / 2].map((y) => (
        <mesh key={`y${y}`} position={[0, y, 0]}>
          <planeGeometry args={[width, thickness]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export { loadSceneTexture } from "./scene-texture";
export {
  useSceneTextures,
  type SceneTextureRecord,
  type SceneTextureStatus,
} from "./useSceneTextures";

/** Thin, rounded interaction halo in the card's own plane. Adapters supply availability. */
export function CardInteractionRim({
  aspect = 5 / 7,
  color = "#8de6ca",
}: {
  aspect?: number;
  color?: string;
}) {
  const rings = useMemo(() => {
    const outline = <T extends THREE.Path>(
      path: T,
      width: number,
      height: number,
      radius: number,
    ): T => {
      const x = -width / 2,
        y = -height / 2,
        r = radius;
      path.moveTo(x + r, y);
      path.lineTo(x + width - r, y);
      path.quadraticCurveTo(x + width, y, x + width, y + r);
      path.lineTo(x + width, y + height - r);
      path.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      path.lineTo(x + r, y + height);
      path.quadraticCurveTo(x, y + height, x, y + height - r);
      path.lineTo(x, y + r);
      path.quadraticCurveTo(x, y, x + r, y);
      return path;
    };
    return [0.012, 0.026, 0.044].map((expansion) => {
      const shape = outline(
        new THREE.Shape(),
        1 + expansion * 2,
        1 / aspect + expansion * 2,
        0.07 + expansion,
      );
      shape.holes.push(outline(new THREE.Path(), 1, 1 / aspect, 0.07));
      return new THREE.ShapeGeometry(shape, 12);
    });
  }, [aspect]);
  useEffect(() => () => rings.forEach((ring) => ring.dispose()), [rings]);
  return (
    <group position={[0, 0, 0.006]}>
      {rings.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={[0.85, 0.14, 0.06][index]}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
