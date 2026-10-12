import { fitArenaCamera } from "./camera-layout";
import { CardPrintedStats } from "./CardPrintedStats";
import { BoardPriorityLight } from "./BoardPriorityLight";
import { useZoneTransitions } from "./useZoneTransitions";
import { paymentPlacement } from "./payment-placement";
import { arenaRows } from "./layout";
import { TabletopCanvas } from "@tcg/simulator-presentation/tabletop";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import { inspectionPose, inspectionMotion } from "@tcg/simulator-presentation/inspection-pose";
import {
  SceneCard,
  CardSelectionRim,
  useCardPose,
  useSceneTextures,
  type SceneDragMotion,
  type SceneTextureRecord,
  type SceneTextureStatus,
  CounterToken,
  CounterTransferMotion,
} from "@tcg/simulator-presentation/three";
import { useEffect, useLayoutEffect, useMemo, useRef, createContext, useContext } from "react";
import { useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  Path,
  PerspectiveCamera,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Vector3,
} from "three";
import { boardCueSample, BoardCuePreviewPicker } from "./BoardCuePreview";
import { BoardFrameGeometry, BoardTurnLighting, turnLightAssets } from "./BoardTurnLighting";
import { ResourceCounter } from "./ResourceCounter";
import { RESOURCE_GEMS, cardColors, resourceColorHex } from "./resource-colors";
import { getCard } from "@tcg/alpha-clash-cards";
import type { AcSeat, CounterMove, LiveBoardState, LiveBoardCard } from "../board-types";
import {
  counterAppearance,
  counterCountsDuringTransfers,
  visibleCounters,
} from "./counter-display";
import { cardArtwork } from "./card-artwork";
import { arenaAssets, resourcePlaceSound } from "./assets";
import { CARD_RATIO, type PlacedCard } from "./layout";
import { handHitBounds, handPlacement, handScreenBounds, handScreenSlot } from "./hand-layout";

import type { ArenaZone } from "./zones";
import type { ArenaOpening } from "./useArenaOpening";
import {
  OpeningMotion,
  useOpeningCardMotion,
  useHasOpeningMotion,
  useRestingOpeningPlacement,
} from "./OpeningMotion";
import { openingPlacement } from "./opening-layout";
import { SceneZone } from "./SceneZones";
import { zonePerspective } from "./zone-perspective";
import { zoneSurface } from "./zone-surface";

export interface ZoneAnchor extends CardAnchor {
  surfaceTransform?: string;
  dropSurface?: {
    left: number;
    top: number;
    width: number;
    height: number;
    transform: string;
    worldWidth: number;
    worldHeight: number;
    bevel: number;
    arm: number;
  };
  captionLeft: number;
  captionTop: number;
}
export interface CardAnchor {
  /** Projected card surface, relative to the visual bounds. */
  surfaceTransform?: string;
  hit?: { left: number; top: number; width: number; height: number };
  layer?: number;
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
interface SceneProps {
  onMotionStart?: () => () => void;
  dragMotion?: SceneDragMotion;
  availableInteractionIds?: ReadonlySet<string>;
  selectionActive?: boolean;
  /** Resources engaged in a staged cost: they tap sideways like spent cards. */
  paymentEngagedIds?: ReadonlySet<string>;
  paymentStaging?: boolean;
  paymentSourceId?: string;
  openingScene?: ArenaOpening;
  openingSound?: boolean;
  zones: ArenaZone[];
  highlightedZone: string | null;
  muteAccentIds?: ReadonlySet<string>;
  inspectedCard: LiveBoardCard | null;
  onZoneAnchors: (anchors: ZoneAnchor[]) => void;
  board: LiveBoardState;
  viewer: AcSeat;
  cards: PlacedCard[];
  compact: boolean;
  hovered: string | null;
  selected: ReadonlySet<string>;
  selectable: ReadonlySet<string> | null;
  /** Instance being resolved by the open prompt; highlighted in its zone. */
  resolvingId?: string | null;
  reducedMotion: boolean;
  onAnchors: (anchors: CardAnchor[]) => void;
  onFailure: () => void;
  onAssets: (status: SceneTextureStatus) => void;
  retryKey: number;
  counterFlights: readonly CounterMove[];
  onCounterFlightComplete: (sequence: number) => void;
  /** Whose turn it is; that seat's border lamps are lit. */
  turnSeat?: AcSeat;
  /** Who holds priority; that seat's zones and the centre arrow are highlighted. */
  prioritySeat?: AcSeat | null;
}

const TextureContext = createContext<ReadonlyMap<string, SceneTextureRecord>>(new Map());
function useTexture(url: string) {
  return useContext(TextureContext).get(url)?.texture;
}

function useBoardScale() {
  const size = useThree((state) => state.size);
  return Math.min(1, size.width / size.height / 1.6);
}
const PIP_COLORS: Record<string, string> = {
  white: "#efe8d5",
  black: "#8b96a3",
  green: "#63a85f",
  red: "#c75f4f",
  blue: "#5b8fb5",
};
const CARD_TYPE_LABEL: Record<string, string> = {
  clash: "Clash",
  clashground: "Clashground",
  accessory: "Accessory",
  action: "Action",
  contender: "Contender",
};

/**
 * Printed card face rendered as text. Shown while artwork loads or when none
 * exists, so a face never reads as a blank frame: name, cost, type, rules
 * text, and Clash stats.
 */
function TextCardFace({ card }: { card: LiveBoardCard }) {
  const texture = useMemo(() => {
    const width = 512;
    const height = Math.round((width * 7) / 5);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#16232e";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "#3c5162";
      context.lineWidth = 4;
      context.strokeRect(10, 10, width - 20, height - 20);
      const definition = card.definitionId
        ? (() => {
            try {
              return getCard(card.definitionId);
            } catch {
              return null;
            }
          })()
        : null;
      const name = card.name ?? definition?.name ?? "Card";
      // Name bar: shrink long names instead of truncating.
      let nameSize = 34;
      context.textAlign = "left";
      context.textBaseline = "middle";
      while (nameSize > 20) {
        context.font = `700 ${nameSize}px system-ui, sans-serif`;
        if (context.measureText(name).width <= width - 56) break;
        nameSize -= 2;
      }
      context.fillStyle = "#e8eef2";
      context.fillText(name, 24, 52, width - 48);
      const cost = definition && "cost" in definition ? definition.cost : undefined;
      const typeLabel =
        CARD_TYPE_LABEL[definition?.cardType ?? ""] ?? definition?.cardType ?? "Card";
      const typeText = cost ? `${typeLabel} · ${cost.total}` : typeLabel;
      context.font = "500 24px system-ui, sans-serif";
      context.fillStyle = "#9fb2bf";
      context.fillText(typeText, 24, 96, width - 48);
      if (cost) {
        // Colored pips after the type line, one dot per required resource.
        let pipX = 24 + context.measureText(typeText).width + 14;
        for (const [color, amount] of Object.entries(cost.pips ?? {})) {
          context.fillStyle = PIP_COLORS[color] ?? "#9fb2bf";
          for (let index = 0; index < Math.min(5, amount); index++) {
            context.beginPath();
            context.arc(pipX, 96, 7, 0, Math.PI * 2);
            context.fill();
            pipX += 18;
          }
        }
      }
      context.strokeStyle = "#2c3f4e";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(24, 122);
      context.lineTo(width - 24, 122);
      context.stroke();
      // Rules text: wrap, then shrink until the block fits the text box.
      const rules = (definition && "text" in definition ? definition.text : "") ?? "";
      const boxWidth = width - 56;
      const boxTop = 150;
      const boxBottom = height - 118;
      let textSize = 25;
      let lines: string[] = [];
      const wrap = (size: number) => {
        context.font = `400 ${size}px system-ui, sans-serif`;
        const wrapped: string[] = [];
        for (const paragraph of rules.split("\n")) {
          let line = "";
          for (const word of paragraph.split(" ")) {
            const next = line ? `${line} ${word}` : word;
            if (context.measureText(next).width > boxWidth && line) {
              wrapped.push(line);
              line = word;
            } else line = next;
          }
          wrapped.push(line);
        }
        return wrapped;
      };
      while (textSize > 14) {
        lines = wrap(textSize);
        if (boxTop + lines.length * textSize * 1.24 <= boxBottom) break;
        textSize -= 1;
      }
      context.font = `400 ${textSize}px system-ui, sans-serif`;
      context.fillStyle = "#cfdae2";
      context.textAlign = "left";
      lines.forEach((line, index) => {
        const y = boxTop + index * textSize * 1.24 + textSize * 0.6;
        if (y <= boxBottom) context.fillText(line, 28, y, boxWidth);
      });
      if (definition && "attack" in definition && "defense" in definition) {
        const stat = (x: number, label: string, value: number) => {
          context.fillStyle = "#0e161d";
          context.beginPath();
          context.roundRect(x, height - 92, 118, 58, 12);
          context.fill();
          context.strokeStyle = "#3c5162";
          context.lineWidth = 2;
          context.stroke();
          context.fillStyle = "#e8eef2";
          context.font = "700 30px system-ui, sans-serif";
          context.textAlign = "center";
          context.fillText(`${label} ${value}`, x + 59, height - 62, 106);
          context.textAlign = "left";
        };
        stat(28, "A", definition.attack);
        stat(width - 146, "D", definition.defense);
      }
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [card.name, card.definitionId]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.045]}>
      <planeGeometry args={[0.965, 0.965 / CARD_RATIO]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
/** Resource identity shares the card's depth, so foreground cards occlude it. */
function ResourceColorMarker({ color, x }: { color: string; x: number }) {
  const map = useTexture(RESOURCE_GEMS[color] ?? "");
  return (
    <group position={[x, 0, 0.075]}>
      <mesh>
        <circleGeometry args={[0.19, 32]} />
        <meshBasicMaterial color="#091018" transparent opacity={0.92} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[0.19, 0.205, 32]} />
        <meshBasicMaterial color="#647980" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.004]} rotation={[0, 0, map ? 0 : Math.PI / 4]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial
          key={map?.uuid ?? "pending"}
          map={map}
          color={map ? "#ffffff" : resourceColorHex(color)}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Card-attached cue matching the rounded artwork and scene depth. */
function CardCueFrame({
  selected,
  resolving = false,
  available = false,
  hovered = false,
  aspect = CARD_RATIO,
}: {
  selected: boolean;
  resolving?: boolean;
  available?: boolean;
  hovered?: boolean;
  aspect?: number;
}) {
  const thickness = selected ? 0.022 : available ? (hovered ? 0.016 : 0.012) : 0.018;
  const geometry = useMemo(() => {
    // Match SceneCard's aspect-preserving rounded face, including narrower art.
    const width = Math.min(1, aspect / CARD_RATIO);
    const height = width / aspect;
    const inset = 0.012;
    const outline = (path: Shape | Path, inset: number) => {
      const x = -width / 2 + inset;
      const y = -height / 2 + inset;
      const w = width - inset * 2;
      const h = height - inset * 2;
      const r = Math.max(0.001, width * 0.07 - inset);
      path.moveTo(x + r, y);
      path.lineTo(x + w - r, y);
      path.quadraticCurveTo(x + w, y, x + w, y + r);
      path.lineTo(x + w, y + h - r);
      path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      path.lineTo(x + r, y + h);
      path.quadraticCurveTo(x, y + h, x, y + h - r);
      path.lineTo(x, y + r);
      path.quadraticCurveTo(x, y, x + r, y);
    };
    const ring = (outer: number, inner: number) => {
      const shape = new Shape();
      outline(shape, outer);
      const hole = new Path();
      outline(hole, inner);
      shape.holes.push(hole);
      return new ShapeGeometry(shape, 12);
    };
    return {
      rim: ring(inset, inset + thickness),
      glow: ring(inset + thickness, inset + thickness + (hovered ? 0.045 : 0.03)),
    };
  }, [aspect, thickness, hovered]);
  useEffect(
    () => () => {
      geometry.rim.dispose();
      geometry.glow.dispose();
    },
    [geometry],
  );
  const cueColor = selected || resolving ? "#ffe3a0" : available ? "#69dcea" : "#a4f4ff";
  return (
    <group>
      <mesh geometry={geometry.rim} position={[0, 0, 0.003]}>
        <meshBasicMaterial color={cueColor} toneMapped={false} />
      </mesh>
      {/* An inward halo stays inside the card silhouette and obeys scene depth. */}
      <mesh geometry={geometry.glow} position={[0, 0, 0.003]}>
        <meshBasicMaterial
          color={cueColor}
          transparent
          opacity={hovered || !available ? 0.3 : 0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {selected && <HandSelectionMark />}
    </group>
  );
}
/** A shape cue supplements gold so selection is not conveyed by color alone. */
function HandSelectionMark() {
  const geometry = useMemo(() => {
    const check = new Shape();
    check.moveTo(-0.045, 0);
    check.lineTo(-0.012, -0.034);
    check.lineTo(0.05, 0.032);
    check.lineTo(0.033, 0.048);
    check.lineTo(-0.012, 0);
    check.lineTo(-0.029, 0.018);
    check.closePath();
    return new ShapeGeometry(check);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group position={[-0.34, 0.5, 0.005]}>
      <mesh>
        <circleGeometry args={[0.075, 24]} />
        <meshBasicMaterial color="#ffe3a0" toneMapped={false} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0, 0.001]}>
        <meshBasicMaterial color="#17232c" toneMapped={false} />
      </mesh>
    </group>
  );
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
function Card({
  health,
  onMotionStart,
  placed,
  retrievalOrigin,
  dragMotion,
  sound = false,
  highlighted,
  available = false,
  muteAccentIds,
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
  counterCounts,
  dimUnselectable = false,
  resolving = false,
  onArrival,
  engaged = false,
  staged = false,
}: {
  health?: number;
  onMotionStart?: () => () => void;
  dragMotion?: SceneDragMotion;
  sound?: boolean;
  onArrival?: () => void;
  staged?: boolean;
  inspecting?: boolean;
  selectionInOverlay?: boolean;
  counterCounts?: Readonly<Record<string, number>>;
  /** Resource tapped into a staged cost: rotated sideways while engaged. */
  engaged?: boolean;
  /** An open choice dims hand cards that are not targetable. */
  dimUnselectable?: boolean;
  /** The card whose effect is resolving: steady gold cue in its zone. */
  resolving?: boolean;
  retrievalOrigin?: ArenaZone;
  placed: PlacedCard;
  highlighted: boolean;
  /** This hand card has an enabled native action, separate from prompt targeting. */
  available?: boolean;
  muteAccentIds?: ReadonlySet<string>;
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
  // Camera fitting publishes viewport changes after resize; refresh screen-space poses too.
  useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const handPose = placed.hand
    ? handPlacement(
        placed,
        slot,
        count,
        rival,
        { camera, ...size, compact },
        hovered && !inspecting,
      )
    : placed;
  const openingPose = useRestingOpeningPlacement(handPose, rival, slot, count, compact);
  const resting = staged ? paymentPlacement(placed, camera, size.width, size.height) : openingPose;
  const { card, x, y, z, height, angle, hand } = resting;
  // Field cards lean halfway toward the viewer; screen-space hand and opening
  // poses keep their own rotation. Lift the low edge clear of the table.
  const fieldTilt = camera.rotation.x * 0.5;
  const fieldLift =
    resting.rotationX === undefined ? (Math.abs(Math.sin(fieldTilt)) * height) / 2 : 0;
  const concealed = (!inspecting && card.faceDown) || !card.definitionId;
  const url = concealed ? arenaAssets.back : cardArtwork(card);
  const map = useTexture(url ?? "");
  const back = useTexture(arenaAssets.back);
  const artAspect =
    map?.image?.width && map?.image?.height ? map.image.width / map.image.height : CARD_RATIO;
  const width = height * CARD_RATIO;
  const inspectionDistance = camera.position.length() * 0.43;
  const focusPose = inspectionPose(camera, {
    distance: inspectionDistance,
    aspect: CARD_RATIO,
    viewportAspect: size.width / size.height,
    heightFraction: compact ? 0.5 : 0.72,
  });
  const openingMotion = useHasOpeningMotion();
  const soundEnabled = useRef(sound);
  soundEnabled.current = sound;
  const previousZone = useRef(card.zone);
  const origin = useMemo(
    () =>
      retrievalOrigin
        ? {
            x: retrievalOrigin.x * (retrievalOrigin.scaleX ? horizontalScale : 1),
            y: retrievalOrigin.y,
            z: 25,
            turn: 0,
            scale: 90,
          }
        : undefined,
    [retrievalOrigin, horizontalScale],
  );
  const retrievalSounded = useRef(false);
  useEffect(() => {
    if (!origin || retrievalSounded.current) return;
    retrievalSounded.current = true;
    if (sound) playSimulatorSound("card.move", () => soundEnabled.current && !document.hidden);
  }, [origin, sound]);
  const resourcePlacement =
    !inspecting && card.zone === "resource" && previousZone.current === "hand";
  const zonePlacement = !inspecting && card.zone !== previousZone.current;
  const clashPlacement = zonePlacement && card.zone === "clash";
  const ref = useCardPose(
    {
      x: inspecting
        ? focusPose.x
        : x * (card.zone === "contender" || card.zone === "clashground" ? horizontalScale : 1),
      y: inspecting ? focusPose.y : y,
      z: inspecting
        ? focusPose.z
        : z +
          fieldLift +
          (hovered && card.zone !== "contender" && resting.rotationX === undefined
            ? hand
              ? 65
              : 25
            : 0),
      turn: inspecting ? 0 : angle + (engaged ? Math.PI / 2 : 0),
      scale: inspecting ? focusPose.scale : width,
    },
    {
      origin,
      drag:
        dragMotion && !inspecting && !staged
          ? { motion: dragMotion, id: card.instanceId }
          : undefined,
      reduced: reducedMotion || openingMotion,
      resetKey: card.controller,
      rotationX: inspecting ? focusPose.rotationX : (resting.rotationX ?? fieldTilt),
      transition: {
        onStart: onMotionStart,
        key: `${inspecting ? "inspect" : staged ? "payment" : placed.departing ? "departure" : "board"}:${card.zone}`,
        duration: placed.departing
          ? 0.55
          : staged
            ? 0.38
            : resourcePlacement
              ? 0.36
              : zonePlacement
                ? 0.3
                : inspecting
                  ? inspectionMotion.enterSeconds
                  : inspectionMotion.returnSeconds,
        turnDelay: resourcePlacement ? 0.25 : 0,
        onComplete: () => {
          onArrival?.();
          const playArrival =
            resourcePlacement && sound
              ? () =>
                  playSimulatorSound(
                    "resource.gain",
                    () => soundEnabled.current && !document.hidden,
                    resourcePlaceSound,
                  )
              : clashPlacement && sound
                ? () =>
                    playSimulatorSound("card.play", () => soundEnabled.current && !document.hidden)
                : undefined;
          playArrival?.();
        },
        lift:
          resourcePlacement || zonePlacement
            ? 0
            : inspectionDistance *
              (inspecting ? inspectionMotion.enterArc : inspectionMotion.returnArc),
      },
    },
  );
  useLayoutEffect(() => {
    previousZone.current = card.zone;
  }, [card.zone]);
  useOpeningCardMotion(ref, handPose, rival, slot, count, compact, horizontalScale, reducedMotion);
  const muted = muteAccentIds?.has(card.instanceId) === true;
  const clashState =
    !muted && (clash?.attackerId === card.instanceId || clash?.targetId === card.instanceId)
      ? clash?.attackerId === card.instanceId
        ? "#ffb661"
        : "#ff7777"
      : undefined;
  const accent = selected
    ? "#ffe3a0"
    : clashState
      ? clashState
      : highlighted
        ? "#65deed"
        : available && hand && !concealed
          ? "#59bdd0"
          : "#6a747b";
  const damage = card.phaseDamage + card.clashDamage;
  const counterScale = Math.min(3, Math.max(1, 214 / height));
  return (
    <group ref={ref}>
      <SceneCard
        rounded
        backTexture={back}
        texture={map}
        aspect={CARD_RATIO}
        edgeColor={inspecting ? "#192027" : accent}
      />
      {map && !concealed && (card.attack !== undefined || health !== undefined) && (
        <CardPrintedStats
          attack={card.attack}
          defense={card.defense}
          health={health}
          contender={card.zone === "contender"}
          color={cardColors(card.definitionId!)[0] ?? "black"}
          aspect={artAspect}
          field={!inspecting && !hand && (card.zone === "clash" || card.zone === "contender")}
        />
      )}
      {!inspecting &&
        card.zone === "resource" &&
        card.definitionId &&
        cardColors(card.definitionId).map((color, index, colors) => (
          <ResourceColorMarker
            key={color}
            color={color}
            x={(index - (colors.length - 1) / 2) * 0.42}
          />
        ))}
      {!concealed &&
        !inspecting &&
        visibleCounters(counterCounts ?? card.counters)
          .slice(0, 2)
          .map(([kind, amount], index) => (
            <CounterToken
              key={kind}
              count={amount}
              label={counterAppearance(kind).label}
              color={counterAppearance(kind).color}
              position={[-0.25, 0.23 - index * 0.26 * counterScale, 0.055]}
              scale={counterScale}
            />
          ))}
      {!concealed && !inspecting && visibleCounters(counterCounts ?? card.counters).length > 2 && (
        <CounterToken
          count={visibleCounters(counterCounts ?? card.counters).length - 2}
          label="MORE"
          color="#b8c9d2"
          position={[-0.25, 0.23 - 0.52 * counterScale, 0.055]}
          scale={counterScale}
        />
      )}
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
      {!selectionInOverlay && (selected || highlighted) && !hand && (
        <CardSelectionRim selected={selected} color={accent} aspect={CARD_RATIO} />
      )}
      {!selectionInOverlay && hand && (selected || highlighted) && (
        <CardCueFrame selected={selected} hovered={hovered} aspect={artAspect} />
      )}
      {!selectionInOverlay &&
        !inspecting &&
        !concealed &&
        hand &&
        available &&
        !selected &&
        !highlighted &&
        !dimUnselectable && (
          <CardCueFrame selected={false} available hovered={hovered} aspect={artAspect} />
        )}
      {resolving && !selected && !highlighted && (
        <CardCueFrame selected={false} resolving aspect={artAspect} />
      )}
      {/* A pending choice dims hand cards that are not targetable. */}
      {!selectionInOverlay && hand && !selected && !highlighted && dimUnselectable && (
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[0.97, 0.97 / CARD_RATIO]} />
          <meshBasicMaterial color="#0a1118" transparent opacity={0.42} depthWrite={false} />
        </mesh>
      )}
      {!selectionInOverlay && clashState && !selected && !highlighted && (
        <CardSelectionRim selected={false} color={clashState} aspect={CARD_RATIO} />
      )}
      {!map && !concealed && <TextCardFace card={card} />}
      {!concealed && damage > 0 && (
        <CounterToken
          count={damage}
          label="Damage"
          kind="damage"
          variant="round"
          orientation="screen"
          minScreenSize={28}
          position={[0.3, -0.43, 0.07]}
          scale={Math.min(1.65, counterScale)}
        />
      )}
    </group>
  );
}
/** Only viewport changes may alter the board camera. */
function CameraRig({ compact }: { compact: boolean }) {
  const { camera, size, invalidate, set, get } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    fitArenaCamera(camera, size, compact);
    const viewport = get().viewport;
    set({ viewport: { ...viewport, ...viewport.getCurrentViewport(camera) } });
    invalidate();
  }, [camera, size.width, size.height, compact, set, get, invalidate]);
  return null;
}

function SceneAnchors({
  paymentEngagedIds,
  paymentSourceId,
  zones,
  onZoneAnchors,
  cards,
  compact,
  hovered,
  onAnchors,
  openingScene,
  viewer,
}: Pick<
  SceneProps,
  | "cards"
  | "compact"
  | "hovered"
  | "onAnchors"
  | "zones"
  | "onZoneAnchors"
  | "paymentEngagedIds"
  | "paymentSourceId"
  | "openingScene"
  | "viewer"
>) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    const horizontalScale = Math.min(1, size.width / size.height / 1.6);
    const handCards = cards.filter((card) => card.hand && card.card.controller === viewer);
    onZoneAnchors(
      zones.map((zone) => {
        if (zone.zone === "hand" && !openingScene?.beat) {
          const rival = zone.seat !== viewer;
          const count = rival ? Math.min(8, zone.count) : handCards.length;
          if (count > 0) {
            const slots = Array.from({ length: count }, (_, index) =>
              handScreenBounds(handScreenSlot(index, count, rival, { ...size, compact })),
            );
            const left = Math.min(...slots.map((slot) => slot.left));
            const top = Math.max(0, Math.min(...slots.map((slot) => slot.top)));
            const right = Math.max(...slots.map((slot) => slot.left + slot.width));
            const bottom = Math.min(
              size.height,
              Math.max(...slots.map((slot) => slot.top + slot.height)),
            );
            return {
              id: zone.id,
              left,
              top,
              width: right - left,
              height: bottom - top,
              captionLeft: (left + right) / 2,
              captionTop: rival ? bottom + 8 : top - 8,
            };
          }
        }
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
        const left = Math.min(...xs);
        const top = Math.min(...ys);
        const width = Math.max(...xs) - left;
        const height = Math.max(...ys) - top;
        const corner = (index: number) => ({ x: xs[index] - left, y: ys[index] - top });
        const surface = zoneSurface(zone);
        const worldWidth = surface.width - surface.inset * 2;
        const worldHeight = surface.height - surface.inset * 2;
        const dropPoints = [-1, 1].flatMap((dx) =>
          [-1, 1].map((dy) => {
            const p = new Vector3(
              x + (dx * worldWidth) / 2,
              zone.y + (dy * worldHeight) / 2,
              surface.z,
            ).project(camera);
            return { x: ((p.x + 1) * size.width) / 2, y: ((1 - p.y) * size.height) / 2 };
          }),
        );
        const dropLeft = Math.min(...dropPoints.map((p) => p.x));
        const dropTop = Math.min(...dropPoints.map((p) => p.y));
        const dropWidth = Math.max(...dropPoints.map((p) => p.x)) - dropLeft;
        const dropHeight = Math.max(...dropPoints.map((p) => p.y)) - dropTop;
        const dropCorner = (index: number) => ({
          x: dropPoints[index].x - dropLeft,
          y: dropPoints[index].y - dropTop,
        });
        return {
          id: zone.id,
          left: Math.min(...xs),
          top: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
          surfaceTransform: zonePerspective(
            [corner(1), corner(3), corner(2), corner(0)],
            width,
            height,
          ),
          dropSurface: {
            left: dropLeft,
            top: dropTop,
            width: dropWidth,
            height: dropHeight,
            transform: zonePerspective(
              [dropCorner(1), dropCorner(3), dropCorner(2), dropCorner(0)],
              dropWidth,
              dropHeight,
            ),
            worldWidth,
            worldHeight,
            bevel: surface.bevel,
            arm: surface.arm,
          },
          captionLeft: ((caption.x + 1) * size.width) / 2,
          captionTop: ((1 - caption.y) * size.height) / 2,
        };
      }),
    );
    onAnchors(
      cards.map((card) => {
        const handView = { camera, ...size, compact };
        const seatHand = cards.filter(
          (entry) => entry.hand && entry.card.controller === card.card.controller,
        );
        const slot = seatHand.indexOf(card);
        const base =
          card.card.instanceId === paymentSourceId
            ? paymentPlacement(card, camera, size.width, size.height)
            : card.hand
              ? handPlacement(
                  card,
                  slot,
                  seatHand.length,
                  card.card.controller !== viewer,
                  handView,
                  hovered === card.card.instanceId,
                )
              : card;
        const p = openingScene
          ? openingPlacement(
              base,
              openingScene.beat,
              card.card.controller !== viewer,
              slot,
              seatHand.length,
              compact,
              { camera, viewportAspect: size.width / size.height },
            )
          : base;
        const w = p.height * CARD_RATIO;
        const corners = [
          [-w / 2, -p.height / 2],
          [w / 2, -p.height / 2],
          [w / 2, p.height / 2],
          [-w / 2, p.height / 2],
        ].map(([dx, dy]) => {
          const point = new Vector3(dx, dy, 5);
          point.applyAxisAngle(
            new Vector3(0, 0, 1),
            p.angle + (paymentEngagedIds?.has(p.card.instanceId) ? Math.PI / 2 : 0),
          );
          const tilt = p.rotationX ?? camera.rotation.x * 0.5;
          point.applyAxisAngle(new Vector3(1, 0, 0), tilt);
          point.add(
            new Vector3(
              p.x *
                (p.rotationX === undefined &&
                (p.card.zone === "contender" || p.card.zone === "clashground")
                  ? horizontalScale
                  : 1),
              p.y,
              p.z + (p.rotationX === undefined ? (Math.abs(Math.sin(tilt)) * p.height) / 2 : 0),
            ),
          );
          return point.project(camera);
        });
        const xs = corners.map((c) => ((c.x + 1) * size.width) / 2),
          ys = corners.map((c) => ((1 - c.y) * size.height) / 2);
        const restingHit =
          card.hand &&
          card.card.controller === viewer &&
          card.card.instanceId !== paymentSourceId &&
          !openingScene?.beat
            ? handScreenBounds(handScreenSlot(slot, seatHand.length, false, handView))
            : undefined;
        const visual = {
          left: Math.min(...xs),
          top: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        };
        const corner = (index: number) => ({
          x: xs[index] - visual.left,
          y: ys[index] - visual.top,
        });
        return {
          id: p.card.instanceId,
          layer: card.hand ? (hovered === card.card.instanceId ? 30 : 10 + slot) : 1,
          hit: restingHit ? handHitBounds(visual, restingHit, size) : undefined,
          ...visual,
          surfaceTransform: zonePerspective(
            [corner(3), corner(2), corner(1), corner(0)],
            visual.width,
            visual.height,
          ),
        };
      }),
    );
    invalidate();
  }, [
    camera,
    size.width,
    size.height,
    cards,
    hovered,
    openingScene?.beat,
    viewer,
    compact,
    onAnchors,
    zones,
    onZoneAnchors,
    paymentEngagedIds,
    paymentSourceId,
    invalidate,
  ]);
  return null;
}
/** Priority shading belongs behind the camera-facing hand, not above DOM controls. */
function TurnLights({
  ownTurn,
  compact,
  reducedMotion,
}: {
  ownTurn: boolean | null;
  compact: boolean;
  reducedMotion: boolean;
}) {
  const off = useTexture(turnLightAssets.off);
  const blue = useTexture(turnLightAssets.blue);
  const red = useTexture(turnLightAssets.red);
  return (
    <>
      <mesh position={[0, -arenaRows(compact, true).seatOffset / 2 - 45, -8]} receiveShadow>
        <BoardFrameGeometry compact={compact} />
        <meshStandardMaterial
          key={off?.uuid ?? "neutral-loading"}
          map={off ?? undefined}
          color={off ? "#cbd1d6" : "#091018"}
          metalness={0.25}
          roughness={0.85}
        />
      </mesh>
      <BoardTurnLighting
        blue={blue ?? undefined}
        red={red ?? undefined}
        ownTurn={ownTurn}
        compact={compact}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

function Table(props: SceneProps) {
  const { board, viewer, compact, hovered, selected, selectable, reducedMotion } = props;
  // The shared interaction hook also returns an empty set when there is no choice.
  const hasSelectableCards = props.selectionActive || (selectable?.size ?? 0) > 0;
  const previousCards = useRef(board.cards);
  const retrievalOrigins = new Map<string, ArenaZone>();
  for (const card of board.cards) {
    const before = previousCards.current.find((entry) => entry.instanceId === card.instanceId);
    if (!before || before.zone === card.zone) continue;
    const origin = props.zones.find(
      (zone) => zone.seat === before.controller && zone.zone === before.zone,
    );
    if (origin) retrievalOrigins.set(card.instanceId, origin);
  }
  useLayoutEffect(() => {
    previousCards.current = board.cards;
  }, [board.cards]);
  // Pile cards and off-page hand cards use the same inspection plane as board cards.
  const visibleCards = useMemo(() => {
    const card = props.inspectedCard;
    if (!card || props.cards.some((placed) => placed.card.instanceId === card.instanceId))
      return props.cards;
    const zone = props.zones.find(
      (zone) => zone.seat === card.controller && zone.zone === card.zone,
    );
    return [
      ...props.cards,
      { card, x: zone?.x ?? 0, y: zone?.y ?? 0, z: 24, height: 160, angle: 0, hand: false },
    ];
  }, [props.cards, props.inspectedCard, props.zones]);
  const horizontalScale = useBoardScale();
  const { cards, arrived } = useZoneTransitions(
    visibleCards,
    board.cards,
    props.zones,
    viewer,
    horizontalScale,
    reducedMotion,
    board.damageEvents,
  );
  const rival: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  const handCards = useMemo(
    () => cards.filter((card) => card.hand && card.card.controller === viewer),
    [cards, viewer],
  );
  const beat = props.openingScene?.beat;
  const sample = boardCueSample();
  const cueTurn = beat
    ? null
    : sample
      ? sample.ownTurn
      : props.turnSeat
        ? props.turnSeat === viewer
        : null;
  const cuePriority = beat
    ? null
    : sample
      ? sample.priority === "none"
        ? null
        : sample.priority
      : props.prioritySeat
        ? props.prioritySeat === viewer
          ? "you"
          : "opponent"
        : null;
  const rivalHand = board.cards
    .filter((card) => card.controller === rival && card.zone === "hand")
    .slice(0, 8);
  const textures = useSceneTextures(
    [
      ...Object.values(arenaAssets),
      ...Object.values(turnLightAssets),
      ...Object.values(RESOURCE_GEMS),
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
  const counterFlight = props.counterFlights[0];
  const shownCounters = useMemo(
    () =>
      counterCountsDuringTransfers(
        cards.map(({ card }) => card),
        props.counterFlights,
      ),
    [cards, props.counterFlights],
  );
  const flightSource =
    counterFlight && cards.find((placed) => placed.card.instanceId === counterFlight.fromId);
  const flightTarget =
    counterFlight && cards.find((placed) => placed.card.instanceId === counterFlight.toId);
  const counterAnchor = (placed: PlacedCard): [number, number, number] => {
    const width = placed.height * CARD_RATIO;
    const dx = -0.25 * width;
    const dy = 0.23 * width;
    const x =
      placed.x *
      (placed.card.zone === "contender" || placed.card.zone === "clashground"
        ? horizontalScale
        : 1);
    return [
      x + dx * Math.cos(placed.angle) - dy * Math.sin(placed.angle),
      placed.y + dx * Math.sin(placed.angle) + dy * Math.cos(placed.angle),
      placed.z + 8,
    ];
  };
  return (
    <TextureContext.Provider value={textures}>
      <OpeningMotion
        opening={props.openingScene}
        reduced={reducedMotion}
        sound={props.openingSound}
        paused={
          textures.size === 0 ||
          [...textures.values()].some((entry) => !entry.texture && !entry.failed)
        }
      >
        {counterFlight && flightSource && flightTarget && (
          <CounterTransferMotion
            key={counterFlight.sequence}
            count={counterFlight.amount}
            label={counterAppearance(counterFlight.kind).label}
            color={counterAppearance(counterFlight.kind).color}
            from={counterAnchor(flightSource)}
            to={counterAnchor(flightTarget)}
            reduced={reducedMotion}
            sound={props.openingSound}
            onComplete={() => props.onCounterFlightComplete(counterFlight.sequence)}
          />
        )}
        <CameraRig compact={compact} />
        <SceneAnchors
          paymentEngagedIds={props.paymentEngagedIds}
          paymentSourceId={props.paymentSourceId}
          zones={props.zones}
          onZoneAnchors={props.onZoneAnchors}
          cards={cards}
          openingScene={props.openingScene}
          viewer={viewer}
          compact={compact}
          hovered={hovered}
          onAnchors={props.onAnchors}
        />
        {[true, false].map((own) => (
          <BoardPriorityLight
            key={String(own)}
            own={own}
            active={cuePriority === (own ? "you" : "opponent")}
            compact={compact}
            horizontalScale={horizontalScale}
            reducedMotion={reducedMotion}
          />
        ))}
        {props.zones
          .filter((zone) => ["clash", "accessory", "resource", "clashground"].includes(zone.zone))
          .map((zone) => (
            <SceneZone
              key={zone.id}
              zone={zone}
              own={zone.seat === viewer}
              priority={cuePriority === (zone.seat === viewer ? "you" : "opponent")}
              highlighted={props.highlightedZone === zone.id}
              horizontalScale={horizontalScale}
            />
          ))}
        {props.zones
          .filter(
            (zone) => !zone.counter && zone.zone !== "hand" && props.highlightedZone === zone.id,
          )
          .map((zone) => (
            <Label
              key={`label:${zone.id}`}
              text={zone.name.toUpperCase()}
              x={zone.x}
              y={zone.captionY}
              z={3}
              width={150}
              height={22}
              panel={false}
              scaleX={zone.scaleX}
              color={zone.seat === viewer ? "#a4dce4" : "#d7bb93"}
            />
          ))}
        {!beat &&
          props.zones
            .filter((zone) => zone.zone === "resource")
            .map((zone) => (
              <ResourceCounter key={zone.id} zone={zone} own={zone.seat === viewer} />
            ))}
        <TurnLights ownTurn={cueTurn} compact={compact} reducedMotion={reducedMotion} />
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

        {board.portalOpen && (
          <Label text="PORTAL OPEN" x={-530} y={0} width={210} height={28} color="#75eced" />
        )}
        {board.standbyCount > 0 && (
          <Label
            text={`STANDBY ${board.standbyCount}`}
            x={420}
            y={110}
            width={180}
            height={28}
            scaleX={false}
          />
        )}
        {cards.map((placed) => (
          <Card
            health={
              placed.card.zone === "contender"
                ? board.players[
                    placed.card.controller === "player-one" ? "player-one" : "player-two"
                  ].health
                : undefined
            }
            onMotionStart={props.onMotionStart}
            key={placed.card.instanceId}
            retrievalOrigin={retrievalOrigins.get(placed.card.instanceId)}
            onArrival={
              placed.departing ? () => arrived(placed.card.instanceId, placed.card.zone) : undefined
            }
            dragMotion={props.dragMotion}
            sound={props.openingSound}
            placed={
              props.inspectedCard?.instanceId === placed.card.instanceId
                ? { ...placed, card: props.inspectedCard }
                : placed
            }
            counterCounts={shownCounters.get(placed.card.instanceId)}
            staged={props.paymentSourceId === placed.card.instanceId}
            engaged={props.paymentEngagedIds?.has(placed.card.instanceId) === true}
            inspecting={props.inspectedCard?.instanceId === placed.card.instanceId}
            highlighted={selectable?.has(placed.card.instanceId) === true}
            available={
              placed.hand &&
              placed.card.controller === viewer &&
              !hasSelectableCards &&
              props.availableInteractionIds?.has(placed.card.instanceId) === true
            }
            dimUnselectable={
              placed.hand &&
              placed.card.controller === viewer &&
              props.paymentSourceId !== placed.card.instanceId &&
              hasSelectableCards &&
              !selectable?.has(placed.card.instanceId)
            }
            resolving={props.resolvingId === placed.card.instanceId}
            muteAccentIds={props.muteAccentIds}
            selectionInOverlay={props.paymentStaging && placed.card.zone === "resource"}
            selected={selected.has(placed.card.instanceId)}
            hovered={hovered === placed.card.instanceId}
            reducedMotion={reducedMotion}
            clash={board.clash}
            rival={placed.card.controller !== viewer}
            slot={
              placed.card.controller === viewer
                ? handCards.indexOf(placed)
                : rivalHand.findIndex((card) => card.instanceId === placed.card.instanceId)
            }
            count={placed.card.controller === viewer ? handCards.length : rivalHand.length}
            compact={compact}
          />
        ))}
      </OpeningMotion>
    </TextureContext.Provider>
  );
}
export function ArenaScene(props: SceneProps) {
  return (
    <>
      <BoardCuePreviewPicker />
      <TabletopCanvas
        onContextLost={props.onFailure}
        shadows
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
        <Table {...props} />
      </TabletopCanvas>
    </>
  );
}
