import { z } from "zod";
import { CinematicSceneSchema } from "./scenes.js";
import { CinematicStyleSchema } from "./cinematics.js";

import {
  AnimationEntityRefSchema,
  AnimationPlayerRefSchema,
  AnimationRefSchema,
  AnimationZoneRefSchema,
} from "./refs.js";

export const SimulatorAudioCueIdSchema = z.enum([
  "card.draw",
  "card.move",
  "card.play",
  "card.discard",
  "card.destroy",
  "card.reveal",
  "deck.shuffle",
  "resource.gain",
  "resource.spend",
  "resource.steal",
  "life.gain",
  "life.loss",
  "combat.start",
  "combat.hit",
  "combat.block",
  "damage.prevent",
  "effect.trigger",
  "phase.change",
  "turn.change",
  "random.die",
  "random.coin",
  "game.win",
  "game.loss",
]);

export const AnimationCardFaceSchema = z.enum(["public", "hidden"]);

/** A reveal is either a viewer-safe card face or an anonymous card-back cue. */
export const AnimationRevealCueSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("card"),
      cardId: z.string().min(1),
      audience: z.discriminatedUnion("kind", [
        z.object({ kind: z.literal("all") }).strict(),
        z.object({ kind: z.literal("player"), id: z.string().min(1) }).strict(),
        z.object({ kind: z.literal("players"), ids: z.array(z.string().min(1)).min(1) }).strict(),
      ]),
      title: z.string().optional(),
      imageUrl: z.string().optional(),
    })
    .strict(),
  z.object({ kind: z.literal("hidden") }).strict(),
]);

const AnimationStepBaseShape = {
  id: z.string().min(1),
  startAtMs: z.number().int().min(0).optional(),
  durationMs: z.number().int().min(0).optional(),
  audioCue: SimulatorAudioCueIdSchema.optional(),
} as const;

export const EntityTransferStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("entityTransfer"),
    entity: AnimationEntityRefSchema,
    from: AnimationRefSchema.optional(),
    to: AnimationRefSchema.optional(),
    sourceFace: AnimationCardFaceSchema,
    destinationFace: AnimationCardFaceSchema,
    reveal: AnimationRevealCueSchema.optional(),
    /** Number of game objects represented by this single transfer visual. */
    quantity: z.number().int().positive().optional(),
    /**
     * "move" — the source node is consumed by the transfer. "copy" — the source
     * node stays visible while the transfer visual departs from it. "hold" —
     * the source zone no longer contains the entity in the destination state
     * (defeats, delayed exits inside multi-beat plans), so the transfer visual
     * parks visible at the source until this step's start time instead of
     * leaving the entity invisible during earlier beats.
     */
    sourcePresentation: z.enum(["move", "copy", "hold"]).optional(),
    /** Replace a destination, pass over it, or slide underneath its lower edge. */
    destinationPresentation: z.enum(["replace", "overlay", "underlay"]).optional(),
  })
  .strict()
  .refine((step) => step.from !== undefined || step.to !== undefined, {
    message: "entityTransfer requires a source or destination",
  });

export const EmphasizeStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("emphasize"),
    at: AnimationRefSchema,
    style: z.enum(["pulse", "spotlight"]).default("pulse"),
    reveal: AnimationRevealCueSchema.optional(),
    /** Semantic outcome tone; renderers must preserve the label when motion is reduced. */
    tone: z.enum(["positive", "negative", "neutral"]).optional(),
    label: z.string().min(1).optional(),
    /**
     * Card whose ability caused this emphasis (e.g. the attacking unit behind
     * a deck reveal). Public information even when the revealed identities are
     * private, so viewers can tell why the moment is happening.
     */
    sourceCardId: z.string().min(1).optional(),
    sourceTitle: z.string().optional(),
    sourceImageUrl: z.string().optional(),
    /**
     * Viewer-relative side of the player acting behind this emphasis (e.g.
     * whoever is looking at a deck top), stamped at the viewer projection
     * boundary so bystander captions can name the actor instead of an
     * ownerless "Looking at…".
     */
    actorSide: z.enum(["player", "opponent"]).optional(),
  })
  .strict();

export const EntityStateChangeStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("entityStateChange"),
    entity: AnimationEntityRefSchema,
    at: AnimationRefSchema,
    change: z.enum(["orientation", "face", "appearance"]),
    sourceFace: AnimationCardFaceSchema,
    destinationFace: AnimationCardFaceSchema,
    fromRotationDeg: z.number().int().optional(),
    toRotationDeg: z.number().int().optional(),
  })
  .strict()
  .superRefine((step, context) => {
    if (
      step.change === "orientation" &&
      (step.fromRotationDeg === undefined || step.toRotationDeg === undefined)
    ) {
      context.addIssue({
        code: "custom",
        message: "orientation changes require fromRotationDeg and toRotationDeg",
      });
    }
  });

export const EffectStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("effect"),
    /** Optional reusable visual treatment. Omission preserves the existing effect renderer. */
    cinematic: CinematicStyleSchema.optional(),
    /** Complete presentation tracks; the owning game supplies outcomes. */
    scene: CinematicSceneSchema.optional(),
    source: AnimationRefSchema.optional(),
    targets: z.array(AnimationRefSchema).default([]),
    label: z.string().min(1).optional(),
    /** Opt into a staged source-card treatment instead of the compact label-only effect. */
    presentation: z.enum(["source-card"]).optional(),
    /** Render motion and card art without explanatory copy. */
    showText: z.boolean().optional(),
    /** Prominent result value shown alongside the effect label, such as a damage amount. */
    valueLabel: z.string().min(1).optional(),
    tone: z.enum(["positive", "negative", "neutral"]).optional(),
    sourceFace: AnimationCardFaceSchema.optional(),
    /** Continue the staged source visual into its final zone instead of mounting a second transfer. */
    sourceExitTo: AnimationRefSchema.optional(),
  })
  .strict()
  .superRefine((step, ctx) => {
    if (step.scene && (!step.durationMs || step.durationMs < 1))
      ctx.addIssue({
        code: "custom",
        path: ["durationMs"],
        message: "Scenes require an explicit positive duration",
      });
    if (step.scene && step.cinematic)
      ctx.addIssue({
        code: "custom",
        path: ["cinematic"],
        message: "Use either a full scene or a single cinematic style",
      });
  });

export const CombatStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("combat"),
    source: AnimationRefSchema,
    target: AnimationRefSchema,
    reason: z.enum(["declared", "blocked", "resolved"]).optional(),
    attackKind: z.enum(["direct", "fight"]).optional(),
    label: z.string().min(1).optional(),
    detailLabel: z.string().min(1).optional(),
    sourceStatus: z.string().min(1).optional(),
    targetStatus: z.string().min(1).optional(),
    showText: z.boolean().optional(),
    /**
     * Participants defeated by this fight (engine-computed). Renderers use it
     * to tell combat deaths apart from effect-driven mass defeats.
     */
    defeatedCardIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const ValueDeltaStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("valueDelta"),
    subject: AnimationRefSchema,
    delta: z.number().int(),
    label: z.string().min(1).optional(),
    fromValue: z.number().int().optional(),
    toValue: z.number().int().optional(),
    tone: z.enum(["positive", "negative", "neutral"]).optional(),
  })
  .strict();

export const PhaseChangeStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("phaseChange"),
    from: z.string().min(1),
    to: z.string().min(1),
    variant: z.enum(["phase", "turn"]).default("phase"),
    player: AnimationPlayerRefSchema.optional(),
    turnNumber: z.number().int().min(1).optional(),
  })
  .strict();

export const HoldStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("hold"),
    durationMs: z.number().int().min(0),
  })
  .strict();

export const RandomizationStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("randomization"),
    at: AnimationRefSchema,
    kind: z.enum(["shuffle", "die", "coin", "selection"]),
    resultLabel: z.string().min(1).optional(),
  })
  .strict();

const ComparisonParticipantSchema = z
  .object({
    entity: AnimationEntityRefSchema,
    label: z.string().min(1),
    valueLabel: z.string().min(1),
    tone: z.enum(["winner", "loser", "neutral"]),
    /** Public identity used to render a revealed entity after it leaves the viewer projection. */
    fallbackPresentation: z
      .object({
        ownerId: z.string().min(1),
        canonicalId: z.string().min(1).optional(),
        /** A public zone whose first entity identifies this participant, such as a hero. */
        identityZone: AnimationZoneRefSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

/** A game-agnostic, two-entity comparison such as a reveal contest or vote. */
export const ComparisonStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("comparison"),
    title: z.string().min(1),
    participants: z.tuple([ComparisonParticipantSchema, ComparisonParticipantSchema]),
    resultLabel: z.string().min(1),
  })
  .strict();

export const GameResultStepV2Schema = z
  .object({
    ...AnimationStepBaseShape,
    type: z.literal("gameResult"),
    outcome: z.enum(["winner", "draw"]),
    winner: AnimationPlayerRefSchema.optional(),
    reasonLabel: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((step, context) => {
    if (step.outcome === "winner" && !step.winner) {
      context.addIssue({
        code: "custom",
        message: "winner outcomes require a winner",
      });
    }
    if (step.outcome === "draw" && step.winner) {
      context.addIssue({
        code: "custom",
        message: "draw outcomes cannot include a winner",
      });
    }
  });

export const AnimationStepV2Schema = z.union([
  EntityTransferStepV2Schema,
  EmphasizeStepV2Schema,
  EntityStateChangeStepV2Schema,
  EffectStepV2Schema,
  CombatStepV2Schema,
  ValueDeltaStepV2Schema,
  PhaseChangeStepV2Schema,
  RandomizationStepV2Schema,
  ComparisonStepV2Schema,
  GameResultStepV2Schema,
  HoldStepV2Schema,
]);

export type SimulatorAudioCueId = z.infer<typeof SimulatorAudioCueIdSchema>;
export type AnimationCardFace = z.infer<typeof AnimationCardFaceSchema>;
export type EntityTransferStepV2 = z.infer<typeof EntityTransferStepV2Schema>;
export type EmphasizeStepV2 = z.infer<typeof EmphasizeStepV2Schema>;
export type EntityStateChangeStepV2 = z.infer<typeof EntityStateChangeStepV2Schema>;
export type EffectStepV2 = z.infer<typeof EffectStepV2Schema>;
export type CombatStepV2 = z.infer<typeof CombatStepV2Schema>;
export type ValueDeltaStepV2 = z.infer<typeof ValueDeltaStepV2Schema>;
export type PhaseChangeStepV2 = z.infer<typeof PhaseChangeStepV2Schema>;
export type RandomizationStepV2 = z.infer<typeof RandomizationStepV2Schema>;
export type ComparisonStepV2 = z.infer<typeof ComparisonStepV2Schema>;
export type GameResultStepV2 = z.infer<typeof GameResultStepV2Schema>;
export type HoldStepV2 = z.infer<typeof HoldStepV2Schema>;
export type AnimationStepV2 = z.infer<typeof AnimationStepV2Schema>;
