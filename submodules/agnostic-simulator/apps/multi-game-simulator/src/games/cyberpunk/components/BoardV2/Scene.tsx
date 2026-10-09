import { useSceneCardDrag } from "@tcg/simulator-presentation/three";
import type { CardInteractionAppearance } from "../GameBoard/Card";
import type { DragMotion } from "@tcg/simulator-ui";
import type { CardDragSource } from "../../engine";
import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Group,
  Matrix4,
  Raycaster,
  Vector2,
  Vector3,
  Plane,
  SRGBColorSpace,
  DataTexture,
  RGBAFormat,
  LinearFilter,
  LinearMipmapLinearFilter,
  MirroredRepeatWrapping,
  ExtrudeGeometry,
  Shape,
  ShapeGeometry,
} from "three";
import { isPerspectiveCamera } from "./cameraType";
import { boardViewport, type BoardProjection } from "./viewport";
import { BoardTextureLoader } from "./BoardTextureLoader";
import { tableSize, HAND_HOVER_LIFT, type WorldCard } from "./layout";

// One soft contact shadow is shared by every visible card. The real light still
// casts its directional shadow; this keeps each card grounded against the table.
const contactShadow = (() => {
  const side = 128;
  const pixels = new Uint8Array(side * side * 4);
  for (let y = 0; y < side; y++)
    for (let x = 0; x < side; x++) {
      const dx = Math.max(Math.abs(x - side / 2) - 45, 0);
      const dy = Math.max(Math.abs(y - side / 2) - 45, 0);
      const distance = Math.hypot(dx, dy);
      const alpha = Math.round(138 * Math.exp(-(distance * distance) / 170));
      const offset = (y * side + x) * 4;
      pixels[offset + 3] = alpha;
    }
  const texture = new DataTexture(pixels, side, side, RGBAFormat);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
})();
function Camera({ onProjection }: { onProjection: (projection: BoardProjection) => void }) {
  const { width, height } = tableSize();
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!isPerspectiveCamera(camera)) return;
    const angle = (10 * Math.PI) / 180,
      distance = 2400;
    camera.position.set(0, -Math.sin(angle) * distance, Math.cos(angle) * distance);
    camera.lookAt(0, 0, 0);
    const fit = boardViewport(size.width, size.height);
    camera.fov =
      (2 * Math.atan(fit.worldHeight / 2 / (distance - (height / 2) * Math.sin(angle))) * 180) /
      Math.PI;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // DOM coordinates use the same authored world units as the scene.
    const scale = 1;
    const toWorld = new Matrix4().set(
      1 / scale,
      0,
      0,
      -width / 2,
      0,
      -1 / scale,
      0,
      height / 2,
      0,
      0,
      1 / scale,
      12,
      0,
      0,
      0,
      1,
    );
    const toScreen = new Matrix4().set(
      size.width / 2,
      0,
      0,
      size.width / 2,
      0,
      -size.height / 2,
      0,
      size.height / 2,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    );
    const projection = toScreen
      .multiply(camera.projectionMatrix)
      .multiply(camera.matrixWorldInverse)
      .multiply(toWorld);
    const divisor = projection.elements[15];
    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), -12);
    const boundary = (x: number, y: number) => {
      raycaster.setFromCamera(new Vector2(x, y), camera);
      const point = new Vector3();
      raycaster.ray.intersectPlane(plane, point);
      return point;
    };
    const topLeft = boundary(-0.97, 0.97);
    const bottomLeft = boundary(-0.97, -0.97);
    const top = Math.max(0, topLeft.y - height / 2);
    const bottom = Math.max(0, -bottomLeft.y - height / 2);
    // Same compact threshold as useFlatBoardLayout. On phones the frustum
    // bleeds far past the table, and the full shift buried the rival field row
    // under the tucked hand backs — compact keeps the shift near its baseline.
    const compact = Math.min(size.width / width, size.height / height) <= 0.55;
    onProjection({
      transform: `matrix3d(${projection.elements.map((value) => value / divisor).join(",")})`,
      hudScale: fit.hudScale,
      anchors: {
        x: Math.max(0, Math.min(-topLeft.x, -bottomLeft.x) - width / 2),
        top,
        bottom,
        field: -48 - Math.min(compact ? 16 : 80, (top + bottom) * 0.1),
      },
    });
    invalidate();
  }, [camera, size.width, size.height, invalidate, width, height, onProjection]);
  return null;
}
function Surface({ surfaceSrc }: { surfaceSrc: string }) {
  const texture = useLoader(BoardTextureLoader, surfaceSrc);
  const ratio = Number(texture.image.width) / Number(texture.image.height);
  const height = 4500;
  const scenery = useMemo(() => {
    const map = texture.clone();
    map.colorSpace = SRGBColorSpace;
    map.wrapS = map.wrapT = MirroredRepeatWrapping;
    map.repeat.set(5, 5);
    map.needsUpdate = true;
    return map;
  }, [texture]);
  useEffect(() => () => scenery.dispose(), [scenery]);
  return (
    <group>
      <mesh position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[height * ratio, height]} />
        <meshStandardMaterial map={scenery} roughness={0.97} color="#a7aeb2" />
      </mesh>
      <mesh position={[0, 0, -9]} receiveShadow>
        <planeGeometry args={[height * ratio, height]} />
        <meshStandardMaterial color="#252c30" roughness={1} transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0, -8.9]}>
        <planeGeometry args={[height * ratio, height]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          vertexShader={`varying vec2 floorPosition; void main() { floorPosition = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`varying vec2 floorPosition; void main() { float edge = max(abs(floorPosition.x) / 800.0, abs(floorPosition.y) / 450.0); gl_FragColor = vec4(0.025, 0.035, 0.040, smoothstep(0.9, 1.8, edge) * 0.78); }`}
        />
      </mesh>
    </group>
  );
}
/** Preserve printed detail as card faces recede and rotate across the table. */
function useCardTexture(url: string) {
  const texture = useLoader(BoardTextureLoader, url);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    // Hidden landing meshes load and upload during flight, before their first draw.
    gl.initTexture(texture);
    invalidate();
  }, [texture, gl, invalidate]);
  return texture;
}

/** Rounded-rectangle outline centered on the origin, matching the printed card die-cut. */
function cardOutline(width: number, height: number, radius: number) {
  const shape = new Shape();
  const x = -width / 2,
    y = -height / 2;
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return shape;
}
/** Card face clipped to the rounded silhouette; ShapeGeometry UVs are raw units, so normalize. */
function cardFaceGeometry(width: number, height: number, radius: number) {
  const geometry = new ShapeGeometry(cardOutline(width, height, radius), 6);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++)
    uv.setXY(i, (uv.getX(i) + width / 2) / width, (uv.getY(i) + height / 2) / height);
  return geometry;
}
/** Physical sleeve with softened vertical corners; the bevel tapers the front and back edges. */
function cardSleeveGeometry(width: number, height: number, radius: number) {
  const geometry = new ExtrudeGeometry(cardOutline(width, height, radius), {
    depth: 2.5,
    bevelEnabled: true,
    bevelThickness: 0.6,
    bevelSize: 0.7,
    bevelSegments: 2,
    curveSegments: 4,
  });
  geometry.translate(0, 0, -1.25);
  return geometry;
}

function CardMesh({
  visible = true,
  motion = null,
  placed,
  hovered,
  appearance = "idle",
  reduced,
  onReady,
  depth = 10,
}: {
  motion?: DragMotion<CardDragSource> | null;
  visible?: boolean;
  depth?: number;
  placed: WorldCard;
  hovered: boolean;
  appearance?: CardInteractionAppearance;
  reduced: boolean;
  onReady: (url: string) => void;
}) {
  const texture = useCardTexture(placed.url);
  const root = useRef<Group>(null);
  const cardDrag = useSceneCardDrag(
    motion,
    (source) => source.cardId === placed.card.cardId,
    reduced,
  );
  const dragging = cardDrag.dragging;
  const invalidate = useThree((s) => s.invalidate);
  const [x, y, width, height] = placed.rect;
  const table = tableSize();
  const rimColor = placed.hidden
    ? "#30383d"
    : {
        blue: "#29464d",
        green: "#304638",
        red: "#512f33",
        yellow: "#514a2e",
      }[placed.card.color];
  const edgeColor =
    appearance === "selected"
      ? "#f5e642"
      : appearance === "attackTarget"
        ? "#ff2f92"
        : appearance === "target"
          ? "#f5e642"
          : appearance === "actionable"
            ? "#4ad9ff"
            : hovered
              ? "#aeeaf3"
              : rimColor;
  const edgeIntensity =
    appearance === "selected"
      ? 1.2
      : appearance === "attackTarget"
        ? 1.1
        : appearance === "target"
          ? 0.8
          : appearance === "actionable"
            ? 0.45
            : 0;
  const angle = (-placed.angle * Math.PI) / 180;
  const tiltX = placed.lane === "hand" ? 0 : -0.025;
  const tiltY = placed.lane === "hand" ? 0 : placed.angle * 0.003;
  useEffect(() => {
    onReady(placed.url);
  }, [onReady, placed.url]);
  useEffect(() => {
    invalidate();
  }, [hovered, appearance, reduced, visible, invalidate]);
  useFrame((_, delta) => {
    if (!root.current) return;
    root.current.rotation.set(tiltX, tiltY, angle);
    if (cardDrag.update(root.current, delta, tiltX, tiltY, angle)) return;
    root.current.position.x = x + width / 2 - table.width / 2;
    const target = hovered && placed.lane === "hand" && !placed.rival ? HAND_HOVER_LIFT : 0;
    const desiredY = table.height / 2 - y - height / 2 + target;
    const nextY = reduced
      ? desiredY
      : root.current.position.y + (desiredY - root.current.position.y) * (1 - Math.exp(-8 * delta));
    root.current.position.y = nextY;
    root.current.position.z =
      hovered && (placed.lane === "hand" || placed.lane === "field") ? 46 : depth;
    if (Math.abs(nextY - desiredY) > 0.05) invalidate();
  });
  // Fit the full source within the physical sleeve; never distort catalog images.
  const sourceWidth = Number(texture.image.width),
    sourceHeight = Number(texture.image.height);
  const ratio = sourceWidth / sourceHeight;
  const faceWidth = Math.min(width, height * ratio);
  const faceHeight = Math.min(height, width / ratio);
  // Shared corner scale for face and sleeve keeps the border width even around the arc.
  const cornerRadius = faceWidth * 0.07;
  const faceGeometry = useMemo(
    () => cardFaceGeometry(faceWidth, faceHeight, cornerRadius),
    [faceWidth, faceHeight, cornerRadius],
  );
  const sleeveGeometry = useMemo(
    () => cardSleeveGeometry(width + 5, height + 5, cornerRadius + 2.5),
    [width, height, cornerRadius],
  );
  useEffect(
    () => () => {
      faceGeometry.dispose();
      sleeveGeometry.dispose();
    },
    [faceGeometry, sleeveGeometry],
  );
  return (
    <>
      {depth >= 10 && !dragging && (
        <mesh
          visible={visible}
          position={[
            x + width / 2 - table.width / 2 + 6,
            table.height / 2 - y - height / 2 - 8,
            -8.5,
          ]}
          rotation={[0, 0, angle]}
        >
          <planeGeometry args={[width + 34, height + 34]} />
          <meshBasicMaterial
            map={contactShadow}
            transparent
            opacity={hovered ? 0.48 : 0.68}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
      <group
        visible={visible}
        ref={root}
        position={[x + width / 2 - table.width / 2, table.height / 2 - y - height / 2, depth]}
        rotation={[tiltX, tiltY, angle]}
      >
        <mesh castShadow receiveShadow geometry={sleeveGeometry}>
          <meshStandardMaterial
            color={edgeColor}
            emissive={edgeColor}
            emissiveIntensity={edgeIntensity}
            metalness={0.42}
            roughness={0.62}
          />
        </mesh>
        <mesh position={[0, 0, 2]} receiveShadow geometry={faceGeometry}>
          <meshStandardMaterial map={texture} roughness={0.86} metalness={0.03} color="#dedede" />
        </mesh>
        {placed.lane === "field" && placed.card.spent && (
          <mesh position={[0, 0, 2.1]} geometry={faceGeometry}>
            <meshBasicMaterial
              color="#05090d"
              transparent
              opacity={0.16}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </>
  );
}
/** A failed texture leaves its working DOM card visible. It does not break the match. */
class TextureBoundary extends Component<
  { children: ReactNode; onFailure?: () => void },
  { failed: boolean }
> {
  componentDidCatch() {
    this.props.onFailure?.();
  }
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function Scene({
  motion,
  cards,
  movingIds,
  cardAppearances,
  hovered,
  reduced,
  onReady,
  onContextLost,
  onArtworkError,
  onProjection,
  surfaceSrc,
  fallbackMessage = "3D is unavailable. Open the Match menu to return to V1.",
}: {
  motion: DragMotion<CardDragSource> | null;
  cards: WorldCard[];
  movingIds: ReadonlySet<string>;
  cardAppearances: Readonly<Record<string, CardInteractionAppearance>>;
  hovered: string | null;
  reduced: boolean;
  onReady: (url: string) => void;
  onContextLost: () => void;
  onArtworkError: () => void;
  onProjection: (projection: BoardProjection) => void;
  surfaceSrc: string;
  fallbackMessage?: string;
}) {
  return (
    <Canvas
      aria-label="Live Cyberpunk 3D card components"
      shadows
      camera={{ position: [0, 0, 1000], near: 100, far: 4000 }}
      dpr={[1, 2]}
      frameloop="demand"
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
      }}
      fallback={<div role="status">{fallbackMessage}</div>}
    >
      <Camera onProjection={onProjection} />
      <ambientLight intensity={1.6} />
      <directionalLight
        position={[-450, 850, 1400]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-1200}
        shadow-camera-right={1200}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-near={100}
        shadow-camera-far={3000}
        shadow-bias={-0.00015}
        shadow-normalBias={0.6}
        shadow-radius={7}
      />
      <TextureBoundary onFailure={onArtworkError}>
        <Suspense fallback={null}>
          <Surface surfaceSrc={surfaceSrc} />
        </Suspense>
      </TextureBoundary>
      {cards
        .filter((p) => p.url)
        .map((p) => (
          <TextureBoundary key={`${p.card.cardId}:${p.url}`} onFailure={onArtworkError}>
            <Suspense fallback={null}>
              {!p.hidden &&
                p.lane === "field" &&
                p.card.attachedGear.map((gear, index) => (
                  <CardMesh
                    key={gear.cardId}
                    visible={!movingIds.has(p.card.cardId) && !movingIds.has(gear.cardId)}
                    reduced={reduced}
                    hovered={false}
                    onReady={onReady}
                    depth={7 - index * 3}
                    placed={{
                      ...p,
                      card: gear,
                      url: gear.imageUrl,
                      rect: [
                        p.rect[0],
                        p.rect[1] + p.rect[3] * 0.24 * (index + 1),
                        p.rect[2],
                        p.rect[3],
                      ],
                    }}
                  />
                ))}
              <CardMesh
                motion={motion}
                visible={!movingIds.has(p.card.cardId)}
                // Overlapping field rows stack leftmost-on-top so every Unit's
                // power badge stays readable; hovering pops a Unit to the front.
                depth={
                  p.lane === "hand"
                    ? 14 + p.stackIndex * 4
                    : p.lane === "field"
                      ? 26 - Math.min(p.stackIndex, 15)
                      : 10
                }
                placed={p}
                appearance={p.hidden ? "idle" : (cardAppearances[p.card.cardId] ?? "idle")}
                hovered={hovered === p.card.cardId}
                reduced={reduced}
                onReady={onReady}
              />
            </Suspense>
          </TextureBoundary>
        ))}
    </Canvas>
  );
}
