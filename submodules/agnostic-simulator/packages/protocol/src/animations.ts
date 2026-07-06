import { z } from "zod";

export const AnimationEntityRefSchema = z
  .object({
    kind: z.literal("entity"),
    id: z.string().min(1),
  })
  .strict();

export const AnimationZoneRefSchema = z
  .object({
    kind: z.literal("zone"),
    id: z.string().min(1),
    ownerId: z.string().min(1).optional(),
  })
  .strict();

export const AnimationPlayerRefSchema = z
  .object({
    kind: z.literal("player"),
    id: z.string().min(1),
  })
  .strict();

export const AnimationAnchorRefSchema = z
  .object({
    kind: z.literal("anchor"),
    id: z.string().min(1),
  })
  .strict();

export const AnimationRefSchema = z.discriminatedUnion("kind", [
  AnimationEntityRefSchema,
  AnimationZoneRefSchema,
  AnimationPlayerRefSchema,
  AnimationAnchorRefSchema,
]);

export const AnimationAnchorSchema = z
  .object({
    id: z.string().min(1),
    role: z.enum(["board-right", "board-center", "source-card", "target-zone", "custom"]),
    label: z.string().min(1).optional(),
    target: AnimationRefSchema.optional(),
  })
  .strict();

export const SimulatorAudioCueIdSchema = z.enum([
  "card.draw",
  "card.move",
  "card.play",
  "card.discard",
  "deck.shuffle",
  "resource.gain",
  "resource.spend",
  "combat.start",
  "combat.hit",
  "effect.trigger",
  "phase.change",
  "turn.change",
  "game.win",
  "game.loss",
]);

const AnimationStepBaseSchema = z
  .object({
    id: z.string().min(1),
    delayMs: z.number().int().min(0).optional(),
    durationMs: z.number().int().min(0).optional(),
    audioCue: SimulatorAudioCueIdSchema.optional(),
  })
  .strict();

export const MoveEntityAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("moveEntity"),
  entity: AnimationEntityRefSchema,
  from: AnimationRefSchema.optional(),
  to: AnimationRefSchema,
});

export const EnterEntityAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("enterEntity"),
  entity: AnimationEntityRefSchema,
  to: AnimationRefSchema,
});

export const ExitEntityAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("exitEntity"),
  entity: AnimationEntityRefSchema,
  from: AnimationRefSchema,
});

export const EffectAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("effect"),
  source: AnimationRefSchema.optional(),
  targets: z.array(AnimationRefSchema).default([]),
  label: z.string().min(1).optional(),
});

export const CombatAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("combat"),
  source: AnimationRefSchema,
  target: AnimationRefSchema,
  reason: z.enum(["declared", "resolved"]).optional(),
});

export const ResourceDeltaAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("resourceDelta"),
  player: AnimationPlayerRefSchema,
  delta: z.number().int(),
  label: z.string().min(1).optional(),
  anchor: AnimationAnchorRefSchema.optional(),
});

export const PhaseChangeAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("phaseChange"),
  from: z.string().min(1),
  to: z.string().min(1),
});

export const LayoutShiftAnimationStepSchema = AnimationStepBaseSchema.extend({
  type: z.literal("layoutShift"),
  entities: z.array(AnimationEntityRefSchema).default([]),
});

export const AnimationPlanStepV1Schema = z.discriminatedUnion("type", [
  MoveEntityAnimationStepSchema,
  EnterEntityAnimationStepSchema,
  ExitEntityAnimationStepSchema,
  EffectAnimationStepSchema,
  CombatAnimationStepSchema,
  ResourceDeltaAnimationStepSchema,
  PhaseChangeAnimationStepSchema,
  LayoutShiftAnimationStepSchema,
]);

export const AnimationPlanV1Schema = z
  .object({
    id: z.string().min(1),
    version: z.literal(1),
    stateVersion: z.number().int().min(0).optional(),
    moveId: z.string().min(1).optional(),
    actorId: z.string().min(1).optional(),
    correlationId: z.string().min(1).optional(),
    fromVersion: z.number().int().min(0).optional(),
    toVersion: z.number().int().min(0).optional(),
    anchors: z.array(AnimationAnchorSchema).default([]),
    steps: z.array(AnimationPlanStepV1Schema).default([]),
  })
  .strict();

export type AnimationEntityRef = z.infer<typeof AnimationEntityRefSchema>;
export type AnimationZoneRef = z.infer<typeof AnimationZoneRefSchema>;
export type AnimationPlayerRef = z.infer<typeof AnimationPlayerRefSchema>;
export type AnimationAnchorRef = z.infer<typeof AnimationAnchorRefSchema>;
export type AnimationRef = z.infer<typeof AnimationRefSchema>;
export type AnimationAnchor = z.infer<typeof AnimationAnchorSchema>;
export type SimulatorAudioCueId = z.infer<typeof SimulatorAudioCueIdSchema>;
export type AnimationPlanStepV1 = z.infer<typeof AnimationPlanStepV1Schema>;
export type AnimationPlanV1 = z.infer<typeof AnimationPlanV1Schema>;
