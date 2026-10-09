import { z } from "zod";
import { AnimationRefSchema } from "./refs.js";

/** Points are board-relative, or tied to a viewer-safe registered object. */
export const ScenePointSchema = z.union([
  z.object({ x: z.number().min(-1).max(2), y: z.number().min(-1).max(2) }).strict(),
  z.object({ ref: AnimationRefSchema }).strict(),
]);
const timing = {
  id: z.string().min(1),
  begin: z.number().min(0).max(1),
  end: z.number().min(0).max(1),
  ease: z.enum(["linear", "ease-in", "ease-out", "ease-in-out"]).optional(),
};
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const SceneTrackSchema = z.discriminatedUnion("kind", [
  z
    .object({
      ...timing,
      kind: z.literal("backdrop"),
      color,
      accent: color,
      pattern: z.enum(["sky", "grid", "mist", "embers"]),
      asset: z.string().min(1).optional(),
      opacity: z.number().min(0).max(0.9).default(0.65),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("actor"),
      asset: z.string().min(1),
      color: color.optional(),
      from: ScenePointSchema,
      to: ScenePointSchema,
      size: z.number().min(0.02).max(0.8),
      rotation: z.number().min(-1080).max(1080).default(0),
      motion: z.enum(["glide", "rear", "orbit", "bounce"]),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("travel"),
      from: ScenePointSchema,
      to: ScenePointSchema,
      path: z.enum(["straight", "arc", "orbit", "zigzag"]),
      color,
      count: z.number().int().min(1).max(48),
      stagger: z.number().min(0).max(0.8).default(0.15),
      trail: z.boolean().default(true),
      shape: z.enum(["orb", "arrow", "ring", "disc"]).default("orb"),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("particles"),
      at: ScenePointSchema,
      color,
      count: z.number().int().min(1).max(96),
      spread: z.number().min(0.01).max(1),
      motion: z.enum(["converge", "burst", "rise", "dust", "snow"]),
      seed: z.number().int().min(0).max(65535).default(1),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("area"),
      color,
      motion: z.enum(["wave", "sweep", "pulse"]),
      direction: z.enum(["left", "right"]).default("left"),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("reaction"),
      at: AnimationRefSchema,
      motion: z.enum([
        "recoil",
        "lunge",
        "hitstop",
        "landing",
        "reveal",
        "shake",
        "tuck",
        "snapback",
      ]),
      toward: AnimationRefSchema.optional(),
      strength: z.number().min(0.1).max(4).default(1),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("material"),
      at: AnimationRefSchema,
      treatment: z.enum([
        "flash",
        "burn",
        "freeze",
        "stone",
        "dissolve",
        "cracks",
        "heal",
        "shield",
        "glitch",
      ]),
      color,
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("camera"),
      motion: z.enum(["shake", "zoom", "pixel"]),
      strength: z.number().min(0.1).max(3).default(1),
    })
    .strict(),
  z
    .object({
      ...timing,
      kind: z.literal("die"),
      from: ScenePointSchema,
      to: ScenePointSchema,
      value: z.number().int().min(1).max(6),
      color,
      size: z.number().min(0.03).max(0.25).default(0.1),
    })
    .strict(),
]);
export const CinematicSceneSchema = z
  .object({
    /** Must enclose the playfield, not a one-pixel center anchor. */
    board: AnimationRefSchema,
    tracks: z.array(SceneTrackSchema).min(1).max(64),
  })
  .strict()
  .superRefine((scene, ctx) => {
    const cost = scene.tracks.reduce((sum, track) => sum + ("count" in track ? track.count : 1), 0);
    if (cost > 512)
      ctx.addIssue({
        code: "custom",
        path: ["tracks"],
        message: "A scene can contain at most 512 visual objects",
      });
    const ids = new Set<string>();
    scene.tracks.forEach((track, index) => {
      if (track.end <= track.begin)
        ctx.addIssue({
          code: "custom",
          path: ["tracks", index, "end"],
          message: "Scene tracks require end > begin",
        });
      if (ids.has(track.id))
        ctx.addIssue({
          code: "custom",
          path: ["tracks", index, "id"],
          message: "Scene track IDs must be unique",
        });
      ids.add(track.id);
      if (track.kind === "reaction" && track.motion === "lunge" && !track.toward)
        ctx.addIssue({
          code: "custom",
          path: ["tracks", index, "toward"],
          message: "Lunge requires a destination",
        });
    });
  });
export type ScenePoint = z.infer<typeof ScenePointSchema>;
export type SceneTrack = z.infer<typeof SceneTrackSchema>;
export type CinematicScene = z.infer<typeof CinematicSceneSchema>;

/** Includes all refs needed before the destination state replaces the source. */
export function cinematicSceneRefs(scene: CinematicScene) {
  const refs = [scene.board];
  for (const track of scene.tracks) {
    if ("at" in track)
      refs.push("ref" in track.at ? track.at.ref : "kind" in track.at ? track.at : scene.board);
    if ("toward" in track && track.toward) refs.push(track.toward);
    for (const point of ["from" in track ? track.from : null, "to" in track ? track.to : null])
      if (point && "ref" in point) refs.push(point.ref);
  }
  return refs;
}
