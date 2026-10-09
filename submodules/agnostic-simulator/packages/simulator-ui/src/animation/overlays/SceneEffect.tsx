import {
  createContext,
  useContext,
  useLayoutEffect,
  useId,
  useRef,
  type ComponentType,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import type {
  AnimationRef,
  CinematicScene,
  ScenePoint,
  SceneTrack,
} from "@tcg/protocol/animations";
import { type AnimationNodeRegistry } from "../lib/node-registry";

export interface SceneArtworkProps {
  readonly color: string;
  readonly timing: { readonly delayMs: number; readonly durationMs: number };
}
/** Asset keys are resolved by the host. The wire contract cannot inject markup or URLs. */
export const SceneArtworkContext = createContext<
  Readonly<Record<string, ComponentType<SceneArtworkProps>>>
>({});

export function scenePoint(
  point: ScenePoint,
  board: DOMRect,
  rectFor: (ref: AnimationRef) => DOMRect | null,
) {
  if ("ref" in point) {
    const rect = rectFor(point.ref);
    return rect && rect.width > 0 && rect.height > 0
      ? { x: rect.left + rect.width / 2 - board.left, y: rect.top + rect.height / 2 - board.top }
      : null;
  }
  return { x: board.width * point.x, y: board.height * point.y };
}

/** Deterministic normalized trajectories, shared by trail and moving artwork. */
export function sceneTrajectory(
  from: { x: number; y: number },
  to: { x: number; y: number },
  path: "straight" | "arc" | "orbit" | "zigzag",
) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  return Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    const offset =
      path === "arc"
        ? -Math.sin(t * Math.PI) * length * 0.3
        : path === "orbit"
          ? Math.sin(t * Math.PI * 4) * Math.sin(t * Math.PI) * length * 0.22
          : path === "zigzag"
            ? Math.sin(t * Math.PI * 8) * Math.sin(t * Math.PI) * Math.min(24, length * 0.1)
            : 0;
    return {
      x: from.x + dx * t + (length ? (-dy / length) * offset : 0),
      y: from.y + dy * t + (length ? (dx / length) * offset : 0),
    };
  });
}
export function sceneParticle(seed: number, index: number) {
  const n = Math.sin((seed + 1) * 127.1 + index * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export function sceneTrackTiming(
  track: SceneTrack,
  startAtMs: number,
  durationMs: number,
  elapsedMs = 0,
) {
  return {
    delay: startAtMs + track.begin * durationMs - elapsedMs,
    duration: (track.end - track.begin) * durationMs,
  };
}

/** All mutations are additive/temporary and owned by the mounted driver layer. */
export function sceneNodeFrames(
  track: Extract<SceneTrack, { kind: "reaction" | "material" | "camera" }>,
  rect: DOMRect,
  toward?: DOMRect | null,
  pixelFilterId?: string,
): Keyframe[] {
  if (track.kind === "material") {
    switch (track.treatment) {
      case "dissolve":
        return [
          { clipPath: "inset(0 0 0 0)", opacity: 1 },
          { clipPath: "inset(0 0 65% 0)", opacity: 0.5 },
          { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        ];
      case "burn":
        return [
          { filter: "brightness(1)", clipPath: "inset(0 0 0 0)" },
          {
            filter: "sepia(1) saturate(4) brightness(1.6)",
            clipPath: "inset(0 0 0 0)",
            offset: 0.35,
          },
          { filter: "grayscale(1) brightness(.25)", clipPath: "inset(0 0 95% 0)" },
        ];
      case "freeze":
        return [
          { filter: "none" },
          { filter: "grayscale(1) sepia(.4) hue-rotate(150deg) brightness(1.5)" },
          { filter: "none" },
        ];
      case "stone":
        return [
          { filter: "none" },
          { filter: "grayscale(1) contrast(1.7) brightness(.65)" },
          { filter: "none" },
        ];
      case "glitch":
        return [
          { filter: "none" },
          { filter: "hue-rotate(120deg) contrast(2)" },
          { filter: "hue-rotate(-90deg)", offset: 0.7 },
          { filter: "none" },
        ];
      default:
        return [
          { filter: "brightness(1)" },
          {
            filter: `brightness(${track.treatment === "flash" ? 2.5 : 1.4}) drop-shadow(0 0 10px ${track.color})`,
          },
          { filter: "brightness(1)" },
        ];
    }
  }
  const strength = track.strength;
  if (track.kind === "camera")
    return track.motion === "zoom"
      ? [
          { transform: "scale(1)" },
          { transform: `scale(${1 + 0.035 * strength})` },
          { transform: "scale(1)" },
        ]
      : track.motion === "pixel"
        ? [
            { filter: "none" },
            { filter: pixelFilterId ? `url(#${pixelFilterId})` : "contrast(1.8) saturate(.6)" },
            { filter: "none" },
          ]
        : [0, -5, 4, -3, 2, 0].map((x) => ({
            transform: `translate(${x * strength}px, ${x * strength * 0.45}px)`,
          }));
  switch (track.motion) {
    case "lunge": {
      if (!toward) return [];
      const dx = toward.left + toward.width / 2 - rect.left - rect.width / 2;
      const dy = toward.top + toward.height / 2 - rect.top - rect.height / 2;
      const length = Math.hypot(dx, dy) || 1;
      return [
        { transform: "translate(0,0) scale(1)", offset: 0 },
        {
          transform: `translate(${(-dx / length) * 14}px,${(-dy / length) * 14}px) scale(1.05)`,
          offset: 150 / 485,
        },
        {
          transform: `translate(${dx + (dx / length) * 9}px,${dy + (dy / length) * 9}px) scale(1.05)`,
          offset: 290 / 485,
        },
        {
          transform: `translate(${dx + (dx / length) * 9}px,${dy + (dy / length) * 9}px) scale(1.05)`,
          offset: 365 / 485,
        },
        { transform: "translate(0,0) scale(1)", offset: 1 },
      ];
    }
    case "landing":
      return [
        {
          transform: `translateY(${-35 * strength}px) scale(1.15)`,
          boxShadow: "0 28px 18px #0008",
        },
        { transform: "translateY(0) scale(1.06,.9)", offset: 0.55, boxShadow: "0 2px 3px #0008" },
        { transform: "translateY(-4px) scale(.98,1.02)", offset: 0.75 },
        { transform: "translateY(0) scale(1)", boxShadow: "0 4px 12px #0007" },
      ];
    case "reveal":
      return [
        { transform: "scale(1) rotateY(0deg)" },
        { transform: `scale(${1 + strength * 0.6}) rotateY(180deg)` },
        { transform: "scale(1) rotateY(360deg)" },
      ];
    case "tuck":
      return [
        { transform: "translateY(-25px) scale(1.08)" },
        { transform: "translateY(25px) scale(.95)" },
        { transform: "translateY(0) scale(1)" },
      ];
    case "snapback":
      return [
        { transform: `translate(${40 * strength}px,${-30 * strength}px) rotate(8deg)` },
        { transform: "translate(-4px,2px) rotate(-1deg)" },
        { transform: "translate(0,0) rotate(0deg)" },
      ];
    case "hitstop":
      return [
        { transform: "scale(1)" },
        { transform: "scale(1.025)", offset: 0.05 },
        { transform: "scale(1.025)", offset: 0.9 },
        { transform: "scale(1)" },
      ];
    default:
      return [0, -6, 5, -3, 2, 0].map((x) => ({
        transform: `translateX(${x * strength}px) rotate(${x * strength * 0.22}deg)`,
      }));
  }
}

export function SceneEffect({
  scene,
  startAtMs,
  durationMs,
  registry,
  rectFor,
  playbackStartedAtMs,
  scopeId,
}: {
  readonly scene: CinematicScene;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly registry: AnimationNodeRegistry;
  readonly rectFor: (ref: AnimationRef) => DOMRect | null;
  readonly playbackStartedAtMs?: number;
  readonly scopeId?: string;
}) {
  const artwork = useContext(SceneArtworkContext);
  const clipId = useId().replace(/:/g, "");
  const board = rectFor(scene.board);
  useLayoutEffect(() => {
    const animations = new Map<string, { node: HTMLElement; animation: Animation }>();
    const bind = () => {
      const elapsed =
        playbackStartedAtMs === undefined
          ? 0
          : Math.max(0, performance.now() - playbackStartedAtMs);
      const transferLayer = scopeId
        ? [...document.querySelectorAll<HTMLElement>("[data-animation-scope]")].find(
            (layer) => layer.dataset.animationScope === scopeId,
          )
        : null;
      for (const track of scene.tracks) {
        if (track.kind !== "reaction" && track.kind !== "material" && track.kind !== "camera")
          continue;
        const ref = track.kind === "camera" ? scene.board : track.at;
        const clone =
          ref.kind === "entity"
            ? [
                ...(transferLayer?.querySelectorAll<HTMLElement>(
                  "[data-animation-transfer-entity]",
                ) ?? []),
              ].find((node) => node.dataset.animationTransferEntity === ref.id)
            : null;
        const node = clone ?? registry.getPreferred(ref)?.node;
        const previous = animations.get(track.id);
        if (previous?.node === node) continue;
        previous?.animation.cancel();
        animations.delete(track.id);
        if (!node?.animate) continue;
        const timing = sceneTrackTiming(track, startAtMs, durationMs, elapsed);
        if (timing.delay + timing.duration <= 0) continue;
        const frames = sceneNodeFrames(
          track,
          node.getBoundingClientRect(),
          track.kind === "reaction" && track.toward
            ? registry.getPreferred(track.toward)?.node.getBoundingClientRect()
            : null,
          `${clipId}-pixels`,
        );
        if (!frames.length) continue;
        const animation = node.animate(frames, {
          delay: timing.delay,
          duration: timing.duration,
          easing:
            track.kind === "reaction" && track.motion === "hitstop"
              ? "steps(1,end)"
              : track.kind === "reaction" && track.motion === "lunge"
                ? "linear"
                : (track.ease ?? "ease-out"),
          fill: "none",
          composite: track.kind === "material" || track.kind === "camera" ? "replace" : "add",
        });
        animations.set(track.id, { node, animation });
      }
    };
    bind();
    // Transfer portals can mount one layout commit after the effect. Rebind
    // only when the visible node changes, preserving the original scene clock.
    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });
    const unsubscribe = registry.subscribe(bind);
    return () => {
      observer.disconnect();
      unsubscribe();
      animations.forEach(({ animation }) => animation.cancel());
    };
  }, [scene, startAtMs, durationMs, registry, playbackStartedAtMs, scopeId, clipId]);
  if (!board || board.width <= 1 || board.height <= 1) return null;
  const color = "var(--game-accent, #e0aa57)";
  const elapsed =
    playbackStartedAtMs === undefined ? 0 : Math.max(0, performance.now() - playbackStartedAtMs);
  return (
    <svg
      data-cinematic-scene
      width={board.width}
      height={board.height}
      viewBox={`0 0 ${board.width} ${board.height}`}
      style={{ position: "absolute", left: board.left, top: board.top, overflow: "hidden" }}
    >
      <defs>
        <filter
          id={`${clipId}-pixels`}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={board.width}
          height={board.height}
        >
          <feFlood x="4" y="4" width="2" height="2" result="sample" />
          <feComposite in="sample" in2="sample" operator="in" x="0" y="0" width="10" height="10" />
          <feTile x="0" y="0" width={board.width} height={board.height} result="samples" />
          <feComposite in="SourceGraphic" in2="samples" operator="in" />
          <feMorphology operator="dilate" radius="5" />
        </filter>
        <clipPath id={clipId}>
          <rect width={board.width} height={board.height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <SceneCamera
          tracks={scene.tracks}
          board={board}
          startAtMs={startAtMs}
          durationMs={durationMs}
          elapsedMs={elapsed}
          pixelFilterId={`${clipId}-pixels`}
        >
          {scene.tracks.map((track) => {
            const ms = sceneTrackTiming(track, startAtMs, durationMs, elapsed);
            const transition = {
              delay: ms.delay / 1000,
              duration: ms.duration / 1000,
              ease:
                track.ease === "ease-in"
                  ? ("easeIn" as const)
                  : track.ease === "ease-in-out"
                    ? ("easeInOut" as const)
                    : track.ease === "linear"
                      ? ("linear" as const)
                      : ("easeOut" as const),
            };
            const fade = {
              initial: { opacity: 0 },
              animate: { opacity: [0, 1, 1, 0] },
              transition: { ...transition, times: [0, 0.12, 0.82, 1] },
            };
            const data = { "data-scene-track": track.id, "data-scene-kind": track.kind };
            if (track.kind === "backdrop") {
              const BackdropArt = track.asset ? artwork[track.asset] : undefined;
              return (
                <motion.g key={track.id} {...data} {...fade}>
                  <rect
                    width={board.width}
                    height={board.height}
                    fill={track.color}
                    opacity={track.opacity}
                  />
                  {BackdropArt && (
                    <svg
                      width={board.width}
                      height={board.height}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <BackdropArt
                        color={track.accent}
                        timing={{ delayMs: ms.delay, durationMs: ms.duration }}
                      />
                    </svg>
                  )}
                  {Array.from({ length: 16 }, (_, i) => (
                    <motion.path
                      key={i}
                      d={
                        track.pattern === "grid"
                          ? `M ${(i * board.width) / 15} 0 V ${board.height} M 0 ${(i * board.height) / 15} H ${board.width}`
                          : `M -30 ${(i * board.height) / 15} Q ${board.width * 0.5} ${(i * board.height) / 15 - 80} ${board.width + 30} ${(i * board.height) / 15}`
                      }
                      stroke={track.accent}
                      fill="none"
                      strokeWidth={track.pattern === "mist" ? 20 : track.pattern === "sky" ? 3 : 1}
                      opacity={track.pattern === "grid" ? 0.2 : 0.12}
                      animate={{ x: [-20, 20], y: track.pattern === "embers" ? [30, -30] : [0, 0] }}
                      transition={transition}
                    />
                  ))}
                </motion.g>
              );
            }
            if (track.kind === "actor") {
              const from = scenePoint(track.from, board, rectFor),
                to = scenePoint(track.to, board, rectFor);
              if (!from || !to) return null;
              const Art = artwork[track.asset];
              const actorColor = track.color ?? color;
              const actorPath = sceneTrajectory(
                from,
                to,
                track.motion === "orbit" ? "orbit" : track.motion === "bounce" ? "arc" : "straight",
              );
              const size = Math.min(board.width, board.height) * track.size;
              return (
                <motion.g key={track.id} {...data} {...fade}>
                  <motion.g
                    initial={{ x: from.x, y: from.y, rotate: 0 }}
                    animate={{
                      x: actorPath.map((point) => point.x),
                      y: actorPath.map((point) => point.y),
                      rotate: [
                        0,
                        track.motion === "rear" ? -34 : track.rotation * 0.5,
                        track.rotation,
                      ],
                    }}
                    transition={transition}
                  >
                    <svg
                      x={-size / 2}
                      y={-size / 2}
                      width={size}
                      height={size}
                      viewBox="0 0 100 100"
                    >
                      {Art ? (
                        <Art
                          color={actorColor}
                          timing={{ delayMs: ms.delay, durationMs: ms.duration }}
                        />
                      ) : (
                        <OriginalSceneArtwork
                          color={actorColor}
                          asset={track.asset}
                          timing={{ delayMs: ms.delay, durationMs: ms.duration }}
                        />
                      )}
                    </svg>
                  </motion.g>
                </motion.g>
              );
            }
            if (track.kind === "travel") {
              const from = scenePoint(track.from, board, rectFor),
                to = scenePoint(track.to, board, rectFor);
              if (!from || !to) return null;
              const path = sceneTrajectory(from, to, track.path),
                d = path.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
              return (
                <g key={track.id} {...data}>
                  {track.trail && (
                    <motion.path
                      d={d}
                      stroke={track.color}
                      strokeWidth={3}
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0] }}
                      transition={transition}
                    />
                  )}
                  {Array.from({ length: track.count }, (_, i) => (
                    <motion.g
                      key={i}
                      data-scene-projectile
                      initial={{ x: from.x, y: from.y, opacity: 0 }}
                      animate={{
                        x: path.map((p) => p.x),
                        y: path.map((p) => p.y),
                        opacity: [0, ...Array.from({ length: 15 }, () => 1), 0],
                        rotate: track.shape === "disc" ? [0, 720] : [0, 0],
                      }}
                      transition={{
                        ...transition,
                        delay:
                          transition.delay +
                          (i / track.count) * transition.duration * track.stagger,
                        duration: transition.duration * (1 - track.stagger),
                      }}
                    >
                      {track.shape === "arrow" ? (
                        <path
                          d="M -14 0 H 12 M 4 -5 L 12 0 L 4 5"
                          fill="none"
                          stroke={track.color}
                          strokeWidth={3}
                        />
                      ) : (
                        <circle
                          r={track.shape === "ring" ? 12 : 6}
                          fill={track.shape === "ring" ? "none" : track.color}
                          stroke={track.color}
                          strokeWidth={3}
                        />
                      )}
                    </motion.g>
                  ))}
                </g>
              );
            }
            if (track.kind === "particles") {
              const at = scenePoint(track.at, board, rectFor);
              if (!at) return null;
              return (
                <g key={track.id} {...data}>
                  {Array.from({ length: track.count }, (_, i) => {
                    const angle = sceneParticle(track.seed, i) * Math.PI * 2,
                      radius =
                        (0.3 + sceneParticle(track.seed, i + track.count) * 0.7) *
                        Math.min(board.width, board.height) *
                        track.spread;
                    const dx = Math.cos(angle) * radius,
                      dy = Math.sin(angle) * radius;
                    const inward = track.motion === "converge",
                      rise = track.motion === "rise" || track.motion === "snow";
                    return (
                      <motion.circle
                        key={i}
                        r={2 + sceneParticle(track.seed, i + 99) * 3}
                        fill={track.color}
                        initial={{
                          cx: at.x + (inward ? dx : 0),
                          cy: at.y + (inward ? dy : 0),
                          opacity: 0,
                        }}
                        animate={{
                          cx: inward ? [at.x + dx, at.x] : [at.x, at.x + dx],
                          cy: inward
                            ? [at.y + dy, at.y]
                            : [
                                at.y,
                                at.y +
                                  (rise
                                    ? -radius
                                    : track.motion === "dust"
                                      ? Math.abs(dy) * 0.25
                                      : dy),
                              ],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          ...transition,
                          delay:
                            transition.delay +
                            sceneParticle(track.seed, i) * transition.duration * 0.2,
                          duration: transition.duration * 0.8,
                        }}
                      />
                    );
                  })}
                </g>
              );
            }
            if (track.kind === "area")
              return (
                <motion.g key={track.id} {...data} {...fade}>
                  {track.motion === "wave" ? (
                    <motion.ellipse
                      cx={board.width / 2}
                      cy={board.height / 2}
                      rx={board.width * 0.75}
                      ry={board.height * 0.75}
                      stroke={track.color}
                      strokeWidth={22}
                      fill="none"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3] }}
                      transition={transition}
                    />
                  ) : track.motion === "sweep" ? (
                    <motion.rect
                      y={0}
                      width={board.width * 0.22}
                      height={board.height}
                      fill={track.color}
                      opacity={0.65}
                      initial={{
                        x: track.direction === "left" ? board.width : -board.width * 0.22,
                      }}
                      animate={{
                        x:
                          track.direction === "left"
                            ? [board.width, -board.width * 0.22]
                            : [-board.width * 0.22, board.width],
                      }}
                      transition={transition}
                    />
                  ) : (
                    <rect
                      width={board.width}
                      height={board.height}
                      fill={track.color}
                      opacity={0.35}
                    />
                  )}
                </motion.g>
              );
            if (track.kind === "material") {
              const rect = rectFor(track.at);
              if (!rect) return null;
              const x = rect.left - board.left,
                y = rect.top - board.top;
              return (
                <motion.g key={track.id} {...data} {...fade}>
                  <rect
                    x={x - 3}
                    y={y - 3}
                    width={rect.width + 6}
                    height={rect.height + 6}
                    rx={8}
                    fill={track.color}
                    fillOpacity={track.treatment === "flash" ? 0.35 : 0.12}
                    stroke={track.color}
                    strokeWidth={3}
                  />
                  {track.treatment === "cracks" &&
                    Array.from({ length: 7 }, (_, i) => (
                      <path
                        key={i}
                        d={`M ${x + rect.width / 2} ${y + rect.height / 2} l ${((i % 3) - 1) * rect.width * 0.45} ${(i % 2 ? 1 : -1) * rect.height * 0.4}`}
                        stroke={track.color}
                        strokeWidth={2}
                      />
                    ))}
                </motion.g>
              );
            }
            if (track.kind === "die") {
              const from = scenePoint(track.from, board, rectFor),
                to = scenePoint(track.to, board, rectFor);
              if (!from || !to) return null;
              const size = Math.min(board.width, board.height) * track.size;
              return (
                <motion.g key={track.id} {...data} {...fade}>
                  <motion.ellipse
                    cx={to.x}
                    cy={to.y + size * 0.7}
                    rx={size * 0.65}
                    ry={size * 0.15}
                    fill="#000000"
                    animate={{ opacity: [0, 0.2, 0.55, 0.4], scale: [0.5, 1.3, 0.8, 1] }}
                    transition={transition}
                  />
                  <motion.g
                    initial={{ x: from.x, y: from.y, rotate: 0, scale: 0.5 }}
                    animate={{
                      x: [from.x, to.x - 30, to.x, to.x],
                      y: [from.y, to.y - size * 2, to.y - size * 0.1, to.y],
                      rotate: [0, 720, 1080, 1080],
                      scale: [0.5, 1.2, 0.9, 1],
                    }}
                    transition={{ ...transition, times: [0, 0.5, 0.8, 1] }}
                  >
                    <rect
                      x={-size / 2}
                      y={-size / 2}
                      width={size}
                      height={size}
                      rx={size * 0.14}
                      fill="#182330"
                      stroke={track.color}
                      strokeWidth={3}
                    />
                    {diePips(track.value).map(([x, y], i) => (
                      <circle
                        key={i}
                        cx={x * size}
                        cy={y * size}
                        r={size * 0.07}
                        fill={track.color}
                      />
                    ))}
                  </motion.g>
                </motion.g>
              );
            }
            if (track.kind === "camera") return <g key={track.id} {...data} />;
            return <g key={track.id} {...data} />;
          })}
        </SceneCamera>
      </g>
    </svg>
  );
}
function diePips(value: number): readonly (readonly [number, number])[] {
  const corners: readonly (readonly [number, number])[] = [
    [-0.23, -0.23],
    [0.23, 0.23],
    [-0.23, 0.23],
    [0.23, -0.23],
  ];
  return value === 1
    ? [[0, 0]]
    : value === 2
      ? corners.slice(0, 2)
      : value === 3
        ? [...corners.slice(0, 2), [0, 0]]
        : value === 4
          ? corners
          : value === 5
            ? [...corners, [0, 0]]
            : [...corners, [-0.23, 0], [0.23, 0]];
}
/** Original vector props. Hosts may replace each asset key through SceneArtworkContext. */
function OriginalSceneArtwork({
  asset,
  color,
  timing,
}: {
  asset: string;
  color: string;
  timing: { delayMs: number; durationMs: number };
}) {
  if (asset === "cannon")
    return (
      <g fill="#253649" stroke={color} strokeWidth={3}>
        <path d="M 15 43 L 80 25 L 90 50 L 25 68 Z" />
        <circle cx={28} cy={75} r={14} />
        <circle cx={67} cy={75} r={14} />
      </g>
    );
  if (asset === "wing")
    return (
      <g fill="#253649" stroke={color} strokeWidth={2}>
        <motion.path
          d="M 48 56 Q 15 0 5 25 L 18 60 L 45 72 L 60 56 Q 96 0 98 26 L 81 65 L 56 77 Z"
          style={{ transformOrigin: "50px 60px" }}
          animate={{ scaleY: [0.7, 1, 0.5, 1, 0.7], skewY: [-8, 5, -6, 5, 0] }}
          transition={{
            delay: timing.delayMs / 1000,
            duration: timing.durationMs / 1000,
            ease: "easeInOut",
          }}
        />
        <path d="M 46 35 L 66 44 L 57 63 L 46 71 L 38 59 Z" />
      </g>
    );
  if (asset === "banner")
    return (
      <g fill="#253649" stroke={color} strokeWidth={3}>
        <path d="M 10 20 H 90 L 80 50 L 90 80 H 10 L 20 50 Z" />
        <path d="M 50 30 L 64 50 L 50 70 L 36 50 Z" fill={color} />
      </g>
    );
  return (
    <g fill="#253649" stroke={color} strokeWidth={3}>
      <path d="M 50 5 L 85 28 L 92 60 L 50 95 L 8 60 L 15 28 Z" />
      <path d="M 50 5 V 95 M 15 28 L 50 60 L 85 28 M 8 60 H 92" />
    </g>
  );
}

function SceneCamera({
  tracks,
  board,
  startAtMs,
  durationMs,
  elapsedMs,
  children,
  pixelFilterId,
}: {
  tracks: readonly SceneTrack[];
  board: DOMRect;
  startAtMs: number;
  durationMs: number;
  elapsedMs: number;
  children: ReactNode;
  pixelFilterId: string;
}) {
  return tracks
    .filter((track) => track.kind === "camera")
    .reduceRight<ReactNode>((content, track) => {
      if (track.kind !== "camera") return content;
      return (
        <SceneCameraTrack
          key={track.id}
          track={track}
          board={board}
          pixelFilterId={pixelFilterId}
          timing={sceneTrackTiming(track, startAtMs, durationMs, elapsedMs)}
        >
          {content}
        </SceneCameraTrack>
      );
    }, children);
}

function SceneCameraTrack({
  track,
  board,
  pixelFilterId,
  timing,
  children,
}: {
  track: Extract<SceneTrack, { kind: "camera" }>;
  board: DOMRect;
  pixelFilterId: string;
  timing: { delay: number; duration: number };
  children: ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    // Browser keyframes treat URL filters as discrete values. String interpolation
    // in the motion renderer would corrupt the SVG fragment identifier.
    const animation = ref.current?.animate(sceneNodeFrames(track, board, null, pixelFilterId), {
      delay: timing.delay,
      duration: timing.duration,
      easing: track.ease ?? "linear",
      fill: "none",
    });
    return () => animation?.cancel();
  }, [track, board, pixelFilterId, timing.delay, timing.duration]);
  return (
    <g
      ref={ref}
      data-scene-camera={track.motion}
      style={{ transformOrigin: `${board.width / 2}px ${board.height / 2}px` }}
    >
      {children}
    </g>
  );
}
