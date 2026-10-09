import { PresentationZone, cardSelection } from "@tcg/simulator-presentation";
import {
  SceneCard,
  CardSelectionRim,
  useCardPose,
  useSceneTextures,
} from "@tcg/simulator-presentation/three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { grandArchiveAnimationOrigins, type GrandArchivePresentationSnapshot } from "./animation";
import {
  GRAND_ARCHIVE_ARENA,
  GRAND_ARCHIVE_CARD_ASPECT,
  grandArchiveCardTextureUrl,
  grandArchiveLayout,
  grandArchiveScreenPosition,
  type GrandArchivePose,
} from "./layout";
import { grandArchiveComposition } from "./composition";
import { ThemeTable } from "./theme-table";
import { grandArchiveShouldReportMetrics } from "./metrics";
import type {
  GrandArchiveBoardCard,
  GrandArchiveBoardMetrics,
  GrandArchiveBoardProps,
} from "./types";

/** Shared cache retains Grand Archive's viewer-safe asset selection. */
function useBoardTextures(
  props: GrandArchiveBoardProps,
  displayedCards: readonly GrandArchiveBoardCard[],
  themeAssets: readonly string[],
) {
  return useSceneTextures(
    [
      ...displayedCards.map((card) => grandArchiveCardTextureUrl(card, props.assets.cardBackUrl)),
      ...themeAssets,
    ],
    props.assetRetryKey,
    props.onAssetStatus,
  );
}

function CameraAndLayout({
  props,
  poses,
}: {
  props: GrandArchiveBoardProps;
  poses: ReadonlyMap<string, GrandArchivePose>;
}) {
  const { camera, size, invalidate, gl } = useThree();
  const callbacks = useRef(props);
  callbacks.current = props;
  const metricTime = useRef(0);
  const lastMetrics = useRef<GrandArchiveBoardMetrics | undefined>(undefined);
  const metricsAlive = useRef(true);
  useEffect(() => {
    metricsAlive.current = true;
    return () => {
      metricsAlive.current = false;
    };
  }, []);
  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const aspect = Math.max(1, size.width) / Math.max(1, size.height);
    const span = Math.max(GRAND_ARCHIVE_ARENA.height, GRAND_ARCHIVE_ARENA.width / aspect);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.position.set(0, 30, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    callbacks.current.onLayout?.(
      new Map(
        [...poses].map(([id, pose]) => [
          id,
          grandArchiveScreenPosition(
            pose,
            aspect,
            props.projection.cards.find((card) => card.id === id)?.aspectRatio,
          ),
        ]),
      ),
    );
    invalidate();
  }, [camera, size.width, size.height, poses, invalidate]);
  useFrame((state, delta) => {
    if (!callbacks.current.onMetrics) return;
    const frameTime = state.clock.elapsedTime;
    // Fiber invokes frame subscribers before gl.render; sample after that render
    // without requesting another frame or reporting pre-upload resource counts.
    queueMicrotask(() => {
      if (!metricsAlive.current || !callbacks.current.onMetrics) return;
      const metrics: GrandArchiveBoardMetrics = {
        frameMs: delta < 0.1 ? delta * 1000 : 0,
        drawCalls: gl.info.render.calls,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      };
      if (
        !grandArchiveShouldReportMetrics(
          lastMetrics.current,
          metrics,
          frameTime - metricTime.current,
        )
      )
        return;
      lastMetrics.current = metrics;
      metricTime.current = frameTime;
      callbacks.current.onMetrics(metrics);
    });
  });
  return null;
}

const SOCKET_EXTRUDE_OPTIONS = {
  depth: 0.075,
  bevelEnabled: true,
  bevelThickness: 0.025,
  bevelSize: 0.025,
  bevelSegments: 2,
  steps: 1,
};

function Socket({ aspect, champion }: { aspect: number; champion: boolean }) {
  const shape = useMemo(() => {
    const halfHeight = 0.5 / aspect;
    const frame = new THREE.Shape();
    frame.moveTo(-0.56, -halfHeight - 0.07);
    frame.lineTo(0.56, -halfHeight - 0.07);
    frame.lineTo(0.56, halfHeight + 0.07);
    frame.lineTo(-0.56, halfHeight + 0.07);
    frame.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-0.515, -halfHeight - 0.015);
    hole.lineTo(-0.515, halfHeight + 0.015);
    hole.lineTo(0.515, halfHeight + 0.015);
    hole.lineTo(0.515, -halfHeight - 0.015);
    hole.closePath();
    frame.holes.push(hole);
    return frame;
  }, [aspect]);
  return (
    <mesh castShadow receiveShadow position={[0, 0, -0.07]}>
      <extrudeGeometry args={[shape, SOCKET_EXTRUDE_OPTIONS]} />
      <meshStandardMaterial
        color={champion ? "#b49351" : "#827567"}
        metalness={0.6}
        roughness={0.38}
      />
    </mesh>
  );
}

function Card({
  card,
  pose,
  initialPose,
  texture,
  failed,
  selected,
  candidate,
  feedback,
  props,
}: {
  card: GrandArchiveBoardCard;
  pose: GrandArchivePose;
  initialPose?: GrandArchivePose;
  texture?: THREE.Texture;
  failed: boolean;
  selected: boolean;
  candidate: boolean;
  feedback: boolean;
  props: GrandArchiveBoardProps;
}) {
  const aspect = card.aspectRatio ?? GRAND_ARCHIVE_CARD_ASPECT;
  const [hovered, setHovered] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  useEffect(() => {
    setFeedbackVisible(feedback);
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedbackVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, [feedback, props.projection.feedbackKey]);
  const size = useThree((state) => state.size);
  const lifted = (hovered || selected) && card.owner === "self" && card.zone === "hand";
  const targetY = pose.y + (lifted ? 0.24 : 0);
  const targetScale = pose.scale * (selected ? cardSelection.scale : lifted ? 1.14 : 1);
  const visibleHeight = Math.max(
    GRAND_ARCHIVE_ARENA.height,
    (GRAND_ARCHIVE_ARENA.width * size.height) / Math.max(1, size.width),
  );
  // Fit the complete rotated card inside the viewport, including its physical edge.
  // Reduced motion uses the same reveal position without interpolating the move.
  const halfCardHeight =
    (targetScale *
      (Math.abs(Math.cos(pose.turn)) * (1 / aspect + 0.035) +
        Math.abs(Math.sin(pose.turn)) * 1.035)) /
    2;
  const targetZ = lifted ? Math.min(pose.z, visibleHeight / 2 - halfCardHeight - 0.08) : pose.z;
  const group = useCardPose(
    { ...pose, y: targetY, z: targetZ, scale: targetScale },
    {
      origin: initialPose,
      resetKey: props.projection.resetKey,
      reduced: props.reducedMotion,
    },
  );
  const highlighted = selected || candidate || feedbackVisible;
  const accent = selected ? cardSelection.rim : candidate ? "#f5e4a5" : "#b3f3d9";
  return (
    <group
      ref={group}
      onClick={(event) => {
        event.stopPropagation();
        props.events?.onCardPick?.(card.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        props.events?.onCardHover?.(card.id);
      }}
      onPointerOut={() => {
        setHovered(false);
        props.events?.onCardHover?.();
      }}
    >
      {!card.faceDown && card.zone === "field" ? (
        <Socket aspect={aspect} champion={card.role === "champion"} />
      ) : null}
      <SceneCard
        rounded
        texture={texture}
        aspect={aspect}
        failed={failed}
        edgeColor={
          card.faceDown && card.zone === "hand"
            ? "#302e2c"
            : card.owner === "self"
              ? "#a49773"
              : "#768b94"
        }
      />
      {highlighted ? (
        <group position={[0, 0, 0.025]}>
          <CardSelectionRim selected={selected} color={accent} aspect={aspect} />
          {candidate ? (
            <mesh position={[0, 0.86, 0]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.11, 0.11]} />
              <meshBasicMaterial color={accent} />
            </mesh>
          ) : null}
        </group>
      ) : null}
    </group>
  );
}

function TargetLink({ source, target }: { source: GrandArchivePose; target: GrandArchivePose }) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(source.x, 0.48, source.z),
      new THREE.Vector3((source.x + target.x) / 2 + 0.28, 0.7, (source.z + target.z) / 2),
      new THREE.Vector3(target.x, 0.5, target.z),
    );
    const vertices = curve.getPoints(24);
    return new Float32Array(
      vertices.flatMap((point, index) =>
        index < vertices.length - 1 && index % 2 === 0
          ? [...point.toArray(), ...vertices[index + 1].toArray()]
          : [],
      ),
    );
  }, [source, target]);
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#fff0a8" depthTest={false} />
      </lineSegments>
      <mesh position={[target.x, 0.52, target.z]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <ringGeometry args={[0.16, 0.21, 4]} />
        <meshBasicMaterial color="#fff0a8" depthTest={false} />
      </mesh>
    </group>
  );
}

function BoardWorld(props: GrandArchiveBoardProps) {
  const size = useThree((state) => state.size);
  const composition = useMemo(
    () => grandArchiveComposition(size.width, size.height, props.assets.theme.contract),
    [size.width, size.height, props.assets.theme.contract],
  );
  const compositionCallback = useRef(props.onComposition);
  compositionCallback.current = props.onComposition;
  useLayoutEffect(() => {
    compositionCallback.current?.(composition);
  }, [composition]);
  const poses = useMemo(() => {
    const { width, height, slots, playCenterX } = composition;
    const horizontalScale = width / GRAND_ARCHIVE_ARENA.width;
    const stretch = height / GRAND_ARCHIVE_ARENA.height;
    const cards = new Map(props.projection.cards.map((card) => [card.id, card]));
    return new Map(
      [...grandArchiveLayout(props.projection.cards)].map(([id, pose]) => {
        const card = cards.get(id);
        if (!card) return [id, pose];
        if (card.zone === "memory" && !card.attachedTo) {
          const slot = card.owner === "self" ? slots.selfMemory : slots.opponentMemory;
          const row = props.projection.cards.filter(
            (item) => item.zone === "memory" && item.owner === card.owner && !item.attachedTo,
          );
          const index = row.findIndex((item) => item.id === id);
          const spacing = Math.min(0.45, (slot.width - 1.35) / Math.max(1, row.length - 1));
          return [
            id,
            {
              ...pose,
              x: slot.x + 0.38 + (index - (row.length - 1) / 2) * spacing,
              z: slot.y,
              scale: 0.48,
            },
          ];
        }
        if (card.zone === "main-deck" && !card.attachedTo) {
          const slot = card.owner === "self" ? slots.selfDeck : slots.opponentDeck;
          return [id, { ...pose, x: slot.x, z: slot.y - 0.12, scale: 1.14 }];
        }
        const hand = card.zone === "hand";
        const field = card.zone === "field";
        return [
          id,
          {
            ...pose,
            x:
              pose.x *
                (hand
                  ? Math.min(horizontalScale, 1.64)
                  : field
                    ? Math.max(1, (width - slots.action.width - 1) / GRAND_ARCHIVE_ARENA.width)
                    : horizontalScale) +
              (hand || field ? playCenterX : 0),
            z: pose.z * stretch,
          },
        ];
      }),
    );
  }, [props.projection.cards, composition]);
  const displayedCards = useMemo(
    () => props.projection.cards.filter((card) => poses.has(card.id)),
    [props.projection.cards, poses],
  );
  const themeAssets = props.assets.theme.variants[composition.mode].assets;
  const textures = useBoardTextures(props, displayedCards, Object.values(themeAssets));
  const previous = useRef<GrandArchivePresentationSnapshot | undefined>(undefined);
  const { cards, resetKey } = props.projection;
  const origins = useMemo(
    () => grandArchiveAnimationOrigins(previous.current, { cards, resetKey }),
    [cards, resetKey],
  );
  useLayoutEffect(() => {
    previous.current = { projection: { cards, resetKey }, poses };
  }, [cards, resetKey, poses]);
  const candidates = useMemo(
    () => new Set(props.projection.candidateCardIds),
    [props.projection.candidateCardIds],
  );
  const feedback = useMemo(
    () => new Set(props.projection.feedbackCardIds),
    [props.projection.feedbackCardIds],
  );
  return (
    <>
      <CameraAndLayout props={props} poses={poses} />
      <ThemeTable
        composition={composition}
        theme={props.assets.theme}
        surface={textures.get(themeAssets.surface)?.texture}
        frame={textures.get(themeAssets.frame)?.texture}
        housing={textures.get(themeAssets.housing)?.texture}
        ornament={textures.get(themeAssets.ornament)?.texture}
      />
      <PresentationZone
        cards={props.projection.cards}
        getKey={(card) => `${card.id}:${card.incarnation ?? 0}`}
        getPose={(card) => poses.get(card.id)}
      >
        {(card, pose) => {
          const resource = textures.get(grandArchiveCardTextureUrl(card, props.assets.cardBackUrl));
          return (
            <Card
              key={`${card.id}:${card.incarnation ?? 0}`}
              card={card}
              pose={pose}
              initialPose={origins.get(card.id)}
              texture={resource?.texture}
              failed={resource?.failed ?? false}
              selected={props.projection.selectedCardId === card.id}
              candidate={candidates.has(card.id)}
              feedback={feedback.has(card.id)}
              props={props}
            />
          );
        }}
      </PresentationZone>
      {props.projection.targetLinks?.map((link) => {
        const source = poses.get(link.sourceCardId);
        const target = poses.get(link.targetCardId);
        return source && target ? (
          <TargetLink
            key={`${link.sourceCardId}:${link.targetCardId}`}
            source={source}
            target={target}
          />
        ) : null;
      })}
    </>
  );
}

/** Rendering only. Legal actions, visibility, focus, and prompts stay in React DOM. */
export function GrandArchiveBoard(props: GrandArchiveBoardProps) {
  return (
    <Canvas
      orthographic
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 30, 0], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => props.events?.onBackgroundPick?.()}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.domElement.setAttribute("aria-hidden", "true");
      }}
    >
      <BoardWorld {...props} />
    </Canvas>
  );
}
