import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import { inspectionPose, inspectionMotion } from "@tcg/simulator-presentation/inspection-pose";
import {
  SceneCard,
  CardSelectionRim,
  CardInteractionRim,
  useCardPose,
  useSceneTextures,
  type SceneDragMotion,
  type SceneTextureRecord,
  type SceneTextureStatus,
} from "@tcg/simulator-presentation/three";
import { useEffect, useLayoutEffect, useMemo, useRef, createContext, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { CanvasTexture, PerspectiveCamera, SRGBColorSpace, Vector3 } from "three";
import type { AcSeat, LiveBoardState, LiveBoardCard } from "../board-types";
import { cardArtwork } from "./card-artwork";
import { arenaAssets, resourcePlaceSound } from "./assets";
import { CARD_RATIO, type PlacedCard } from "./layout";

import type { ArenaZone } from "./zones";
import type { ArenaOpening } from "./useArenaOpening";
import {
  OpeningMotion,
  useOpeningCardMotion,
  useHasOpeningMotion,
  useRestingOpeningPlacement,
} from "./OpeningMotion";
import { openingPlacement } from "./opening-layout";

export interface ZoneAnchor extends CardAnchor {
  captionLeft: number;
  captionTop: number;
}
export interface CardAnchor {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
interface SceneProps {
  dragMotion?: SceneDragMotion;
  availableInteractionIds?: ReadonlySet<string>;
  openingScene?: ArenaOpening;
  openingSound?: boolean;
  zones: ArenaZone[];
  highlightedZone: string | null;
  inspectedCard: LiveBoardCard | null;
  onZoneAnchors: (anchors: ZoneAnchor[]) => void;
  board: LiveBoardState;
  viewer: AcSeat;
  cards: PlacedCard[];
  compact: boolean;
  hovered: string | null;
  selected: ReadonlySet<string>;
  selectable: ReadonlySet<string> | null;
  reducedMotion: boolean;
  onAnchors: (anchors: CardAnchor[]) => void;
  onTurnPosition: (top: number) => void;
  onFailure: () => void;
  onAssets: (status: SceneTextureStatus) => void;
  retryKey: number;
}

const TextureContext = createContext<ReadonlyMap<string, SceneTextureRecord>>(new Map());
function useTexture(url: string) {
  return useContext(TextureContext).get(url)?.texture;
}

function useBoardScale() {
  const size = useThree((state) => state.size);
  return Math.min(1, size.width / size.height / 1.6);
}
function Label({
  text,
  x,
  y,
  z = 20,
  width = 180,
  height = 22,
  color = "#d2dde0",
  panel = true,
  scaleX = true,
}: {
  text: string;
  x: number;
  y: number;
  z?: number;
  width?: number;
  height?: number;
  color?: string;
  panel?: boolean;
  scaleX?: boolean;
}) {
  const horizontalScale = useBoardScale();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.max(64, Math.round((1024 * height) / width));
    const context = canvas.getContext("2d");
    if (context) {
      if (panel) {
        context.fillStyle = "#101c26";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#506574";
        context.fillRect(0, canvas.height - 3, canvas.width, 3);
      }
      context.fillStyle = color;
      context.font = `600 ${canvas.height * 0.68}px system-ui, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 40);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [text, color, height, width, panel]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[x * (scaleX ? horizontalScale : 1), y, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
function Plate({
  x = 0,
  scaleX = true,
  y = 0,
  z = 2,
  width,
  height,
  color = "#101a23",
}: {
  x?: number;
  scaleX?: boolean;
  y?: number;
  z?: number;
  width: number;
  height: number;
  color?: string;
}) {
  const horizontalScale = useBoardScale();
  return (
    <mesh position={[x * (scaleX ? horizontalScale : 1), y, z]} receiveShadow>
      <boxGeometry args={[width > 1000 ? width * horizontalScale : width, height, 5]} />
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.55} />
    </mesh>
  );
}
function ImagePlane({
  url,
  x = 0,
  y = 0,
  z = 5,
  width,
  height,
  lit = false,
}: {
  url: string;
  x?: number;
  y?: number;
  z?: number;
  width: number;
  height: number;
  lit?: boolean;
}) {
  const horizontalScale = useBoardScale();
  const map = useTexture(url);
  return (
    <mesh position={[x * horizontalScale, y, z]} receiveShadow>
      <planeGeometry args={[width, height]} />
      {lit ? (
        <meshStandardMaterial
          key={map?.uuid ?? "pending"}
          map={map}
          color={map ? "#cbd1d6" : "#1a2630"}
          metalness={0.25}
          roughness={0.85}
        />
      ) : (
        <meshBasicMaterial
          key={map?.uuid ?? "pending"}
          map={map}
          color={map ? "#ffffff" : "#18232d"}
          transparent
          toneMapped={false}
        />
      )}
    </mesh>
  );
}
function Card({
  placed,
  dragMotion,
  sound = false,
  highlighted,
  selected,
  hovered,
  reducedMotion,
  clash,
  rival = false,
  slot = 0,
  count = 8,
  compact = false,
  inspecting = false,
  selectionInOverlay = false,
  interactionAvailable = false,
}: {
  dragMotion?: SceneDragMotion;
  sound?: boolean;
  inspecting?: boolean;
  selectionInOverlay?: boolean;
  interactionAvailable?: boolean;
  placed: PlacedCard;
  highlighted: boolean;
  selected: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  clash: LiveBoardState["clash"];
  rival?: boolean;
  slot?: number;
  count?: number;
  compact?: boolean;
}) {
  const horizontalScale = useBoardScale();
  const resting = useRestingOpeningPlacement(placed, rival, slot, count, compact);
  const { card, x, y, z, height, angle, hand } = resting;
  const concealed = (!inspecting && card.faceDown) || !card.definitionId;
  const url = concealed ? arenaAssets.back : cardArtwork(card);
  const map = useTexture(url ?? "");
  const back = useTexture(arenaAssets.back);
  const width = height * CARD_RATIO;
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const inspectionDistance = camera.position.length() * 0.68;
  const focusPose = inspectionPose(camera, {
    distance: inspectionDistance,
    aspect: CARD_RATIO,
    viewportAspect: size.width / size.height,
  });
  const openingMotion = useHasOpeningMotion();
  const soundEnabled = useRef(sound);
  soundEnabled.current = sound;
  const previousZone = useRef(card.zone);
  const resourcePlacement =
    !inspecting && card.zone === "resource" && previousZone.current === "hand";
  const ref = useCardPose(
    {
      x: inspecting
        ? focusPose.x
        : x * (card.zone === "contender" || card.zone === "clashground" ? horizontalScale : 1),
      y: inspecting ? focusPose.y : y,
      z: inspecting
        ? focusPose.z
        : z + (hovered && resting.rotationX === undefined ? (hand ? 65 : 25) : 0),
      turn: inspecting ? 0 : angle,
      scale: inspecting ? focusPose.scale : width,
    },
    {
      drag:
        dragMotion && card.zone === "hand"
          ? { motion: dragMotion, id: card.instanceId }
          : undefined,
      reduced: reducedMotion || openingMotion,
      resetKey: card.controller,
      rotationX: inspecting ? focusPose.rotationX : (resting.rotationX ?? 0),
      transition: {
        key: `${inspecting ? "inspect" : "board"}:${card.zone}`,
        duration: resourcePlacement
          ? 0.36
          : inspecting
            ? inspectionMotion.enterSeconds
            : inspectionMotion.returnSeconds,
        turnDelay: resourcePlacement ? 0.25 : 0,
        onComplete:
          resourcePlacement && sound
            ? () =>
                playSimulatorSound(
                  "resource.gain",
                  () => soundEnabled.current && !document.hidden,
                  resourcePlaceSound,
                )
            : undefined,
        lift: resourcePlacement
          ? 0
          : inspectionDistance *
            (inspecting ? inspectionMotion.enterArc : inspectionMotion.returnArc),
      },
    },
  );
  useLayoutEffect(() => {
    previousZone.current = card.zone;
  }, [card.zone]);
  useOpeningCardMotion(ref, placed, rival, slot, count, compact, horizontalScale, reducedMotion);
  const accent = selected
    ? "#ffe3a0"
    : clash?.attackerId === card.instanceId
      ? "#ffb661"
      : clash?.targetId === card.instanceId
        ? "#ff7777"
        : highlighted
          ? "#65deed"
          : "#6a747b";
  const damage = card.phaseDamage + card.clashDamage;
  return (
    <group ref={ref}>
      <SceneCard
        rounded
        backTexture={back}
        texture={map}
        aspect={CARD_RATIO}
        edgeColor={inspecting ? "#192027" : accent}
      />
      {!map && (
        <mesh position={[0, 0, -0.065]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1, 1 / CARD_RATIO]} />
          <meshBasicMaterial
            key={back?.uuid ?? "pending"}
            map={back}
            color={back ? "#ffffff" : "#18232d"}
            toneMapped={false}
          />
        </mesh>
      )}
      {interactionAvailable && !selected && !inspecting && (
        <CardInteractionRim aspect={CARD_RATIO} />
      )}
      {!selectionInOverlay &&
        (selected ||
          highlighted ||
          clash?.attackerId === card.instanceId ||
          clash?.targetId === card.instanceId) && (
          <CardSelectionRim selected={selected} color={accent} aspect={CARD_RATIO} />
        )}
      {!map && !concealed && (
        <>
          <Label text={card.name ?? "Card"} x={0} y={0.12} z={0.02} width={0.9} height={0.16} />
          <Label
            text="ARTWORK UNAVAILABLE"
            x={0}
            y={-0.18}
            z={0.02}
            width={0.9}
            height={0.08}
            panel={false}
          />
        </>
      )}
      {damage > 0 && (
        <>
          <mesh position={[0.42, -0.6, 0.04]}>
            <planeGeometry args={[0.3, 0.25]} />
            <meshBasicMaterial color="#8c2833" />
          </mesh>
          <Label
            text={String(damage)}
            x={0.42}
            y={-0.6}
            z={0.05}
            width={0.3}
            height={0.24}
            panel={false}
            color="#ffffff"
          />
        </>
      )}
    </group>
  );
}
function CameraRig({
  zones,
  onZoneAnchors,
  cards,
  compact,
  onAnchors,
  onTurnPosition,
  openingScene,
  viewer,
}: Pick<
  SceneProps,
  | "cards"
  | "compact"
  | "onAnchors"
  | "onTurnPosition"
  | "zones"
  | "onZoneAnchors"
  | "openingScene"
  | "viewer"
>) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    // Fit projected corners, including raised hand cards, instead of clipping to one aspect ratio.
    const boundsY = compact ? [-550, 465] : [-625, 540];
    camera.position.set(0, compact ? -600 : -645, 1900);
    camera.lookAt(0, compact ? 0 : -45, 0);
    camera.aspect = size.width / size.height;
    camera.fov = 40;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const horizontalScale = Math.min(1, size.width / size.height / 1.6);
    const corners = [-830 * horizontalScale, 830 * horizontalScale].flatMap((x) =>
      boundsY.map((y) => new Vector3(x, y, 85).project(camera)),
    );
    const fit = Math.max(...corners.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))));
    camera.fov = (2 * Math.atan(Math.tan((40 * Math.PI) / 360) * fit * 1.03) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    onTurnPosition(((1 - new Vector3(0, 0, 20).project(camera).y) * size.height) / 2);
    onZoneAnchors(
      zones.map((zone) => {
        const x = zone.x * (zone.scaleX ? horizontalScale : 1);
        const points = [-1, 1].flatMap((dx) =>
          [-1, 1].map((dy) =>
            new Vector3(x + (dx * zone.width) / 2, zone.y + (dy * zone.height) / 2, 16).project(
              camera,
            ),
          ),
        );
        const xs = points.map((p) => ((p.x + 1) * size.width) / 2);
        const ys = points.map((p) => ((1 - p.y) * size.height) / 2);
        const caption = new Vector3(x, zone.captionY, 22).project(camera);
        return {
          id: zone.id,
          left: Math.min(...xs),
          top: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
          captionLeft: ((caption.x + 1) * size.width) / 2,
          captionTop: ((1 - caption.y) * size.height) / 2,
        };
      }),
    );
    const handCards = cards.filter((card) => card.hand);
    onAnchors(
      cards.map((card) => {
        const p = openingScene
          ? openingPlacement(
              card,
              openingScene.beat,
              card.card.controller !== viewer,
              handCards.indexOf(card),
              handCards.length,
              compact,
              { camera, viewportAspect: size.width / size.height },
            )
          : card;
        const w = p.height * CARD_RATIO;
        const corners = [
          [-w / 2, -p.height / 2],
          [w / 2, -p.height / 2],
          [w / 2, p.height / 2],
          [-w / 2, p.height / 2],
        ].map(([dx, dy]) => {
          const point = new Vector3(dx, dy, 5);
          point.applyAxisAngle(new Vector3(0, 0, 1), p.angle);
          point.applyAxisAngle(new Vector3(1, 0, 0), p.rotationX ?? 0);
          point.add(
            new Vector3(
              p.x *
                (p.rotationX === undefined &&
                (p.card.zone === "contender" || p.card.zone === "clashground")
                  ? horizontalScale
                  : 1),
              p.y,
              p.z,
            ),
          );
          return point.project(camera);
        });
        const xs = corners.map((c) => ((c.x + 1) * size.width) / 2),
          ys = corners.map((c) => ((1 - c.y) * size.height) / 2);
        return {
          id: p.card.instanceId,
          left: Math.min(...xs),
          top: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        };
      }),
    );
    invalidate();
  }, [
    camera,
    size.width,
    size.height,
    cards,
    openingScene?.beat,
    viewer,
    compact,
    onAnchors,
    onTurnPosition,
    zones,
    onZoneAnchors,
    invalidate,
  ]);
  return null;
}
function Table(props: SceneProps) {
  const { board, viewer, cards, compact, hovered, selected, selectable, reducedMotion } = props;
  const rival: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  const handCards = useMemo(() => cards.filter((card) => card.hand), [cards]);
  const beat = props.openingScene?.beat;
  const rivalHand = board.cards
    .filter((card) => card.controller === rival && card.zone === "hand")
    .slice(0, 8);
  const textures = useSceneTextures(
    [
      ...Object.values(arenaAssets),
      ...(props.inspectedCard && cardArtwork(props.inspectedCard)
        ? [cardArtwork(props.inspectedCard)!]
        : []),
      ...cards.map((p) =>
        p.card.faceDown ? arenaAssets.back : (cardArtwork(p.card) ?? arenaAssets.back),
      ),
    ],
    props.retryKey,
    props.onAssets,
  );
  return (
    <TextureContext.Provider value={textures}>
      <OpeningMotion
        opening={props.openingScene}
        reduced={reducedMotion}
        sound={props.openingSound}
      >
        <CameraRig
          zones={props.zones}
          onZoneAnchors={props.onZoneAnchors}
          cards={cards}
          openingScene={props.openingScene}
          viewer={viewer}
          compact={compact}
          onAnchors={props.onAnchors}
          onTurnPosition={props.onTurnPosition}
        />
        {props.zones
          .filter(
            (zone) =>
              zone.counter ||
              props.highlightedZone === zone.id ||
              (zone.count === 0 && zone.zone !== "hand"),
          )
          .map((zone) => (
            <Label
              key={zone.id}
              text={
                zone.counter || props.highlightedZone === zone.id
                  ? `${zone.name.toUpperCase()}  ${zone.ready === undefined ? zone.count : `${zone.ready}/${zone.count}`}`
                  : zone.name.toUpperCase()
              }
              x={zone.x}
              y={zone.counter ? zone.captionY : zone.y}
              z={1}
              width={
                zone.counter
                  ? zone.zone === "resource"
                    ? 220
                    : 150
                  : Math.min(zone.width + 30, 190)
              }
              height={28}
              panel={false}
              scaleX={zone.scaleX}
              color={props.highlightedZone === zone.id ? "#e2cca2" : "#94a5a8"}
            />
          ))}
        <ambientLight intensity={1.4} />
        <directionalLight
          position={[-450, 600, 1200]}
          intensity={2.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-950}
          shadow-camera-right={950}
          shadow-camera-top={650}
          shadow-camera-bottom={-650}
          shadow-camera-near={1}
          shadow-camera-far={2500}
          shadow-bias={-0.001}
          shadow-intensity={0.28}
          shadow-radius={5}
        />
        <pointLight
          position={[-650, -300, 350]}
          color="#51c9ed"
          intensity={140000}
          distance={1000}
          decay={2}
        />
        <ImagePlane url={arenaAssets.surface} width={1800} height={1200} z={-8} lit />
        <Plate width={1570} height={2} z={0} color="#34434a" />
        {board.portalOpen && (
          <Label text="PORTAL OPEN" x={-530} y={0} width={210} height={28} color="#75eced" />
        )}
        {board.standbyCount > 0 && (
          <Label text={`STANDBY ${board.standbyCount}`} x={530} y={0} width={180} height={28} />
        )}
        {([rival, viewer] as const).map((seat) => {
          const sign = seat === viewer ? -1 : 1;
          return (
            <group key={seat}>
              <Plate
                y={sign * (compact ? 278 : 247)}
                width={1080}
                height={1}
                color={sign < 0 ? "#284b56" : "#5b4a34"}
              />
              {!compact && (
                <>
                  <Plate scaleX={false} x={-310} y={sign * 350} width={254} height={1} />
                  <Plate scaleX={false} x={160} y={sign * 350} width={424} height={1} />
                </>
              )}
              {(!beat || beat.leaders === "field") && (
                <>
                  <ImagePlane
                    url={arenaAssets.badge}
                    x={-730}
                    y={sign < 0 ? -238 : 38}
                    z={32}
                    width={104}
                    height={104}
                  />
                  <Label
                    text={String(board.players[seat].health)}
                    x={-730}
                    y={sign < 0 ? -238 : 38}
                    z={34}
                    width={70}
                    height={50}
                    color="#ffffff"
                    panel={false}
                  />
                </>
              )}
            </group>
          );
        })}
        {rivalHand.map((card, i) => (
          <Card
            key={card.instanceId}
            placed={{
              card,
              x: (i - (rivalHand.length - 1) / 2) * 36,
              y: compact ? 393 : 458,
              z: 25 + i,
              height: 84,
              angle: (i - 2) * 0.055,
              hand: true,
            }}
            rival
            slot={i}
            count={rivalHand.length}
            compact={compact}
            highlighted={false}
            selected={false}
            hovered={false}
            reducedMotion={reducedMotion}
            clash={null}
          />
        ))}
        {cards.map((placed) => (
          <Card
            key={placed.card.instanceId}
            dragMotion={props.dragMotion}
            sound={props.openingSound}
            placed={
              props.inspectedCard?.instanceId === placed.card.instanceId
                ? { ...placed, card: props.inspectedCard }
                : placed
            }
            inspecting={props.inspectedCard?.instanceId === placed.card.instanceId}
            interactionAvailable={
              placed.hand && props.availableInteractionIds?.has(placed.card.instanceId) === true
            }
            highlighted={selectable?.has(placed.card.instanceId) === true}
            selectionInOverlay={beat?.id === "hand" && placed.hand}
            selected={selected.has(placed.card.instanceId)}
            hovered={hovered === placed.card.instanceId}
            reducedMotion={reducedMotion}
            clash={board.clash}
            rival={placed.card.controller !== viewer}
            slot={handCards.indexOf(placed)}
            count={handCards.length}
            compact={compact}
          />
        ))}
      </OpeningMotion>
    </TextureContext.Provider>
  );
}
function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onFailure);
    return () => canvas.removeEventListener("webglcontextlost", onFailure);
  }, [canvas, onFailure]);
  return null;
}
export function ArenaScene(props: SceneProps) {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ near: 100, far: 4000, fov: 40 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#070e16");
        gl.domElement.setAttribute("aria-hidden", "true");
      }}
      fallback={
        <div role="alert">
          WebGL is unavailable. Enable hardware acceleration or use a browser with WebGL support.
        </div>
      }
    >
      <ContextGuard onFailure={props.onFailure} />
      <Table {...props} />
    </Canvas>
  );
}
