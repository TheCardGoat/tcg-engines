import { z } from "zod";

export const AnimationEntityRefSchema = z
  .object({ kind: z.literal("entity"), id: z.string().min(1) })
  .strict();

export const AnimationZoneRefSchema = z
  .object({
    kind: z.literal("zone"),
    id: z.string().min(1),
    ownerId: z.string().min(1).optional(),
  })
  .strict();

export const AnimationPlayerRefSchema = z
  .object({ kind: z.literal("player"), id: z.string().min(1) })
  .strict();

export const AnimationAnchorRefSchema = z
  .object({ kind: z.literal("anchor"), id: z.string().min(1) })
  .strict();

export const AnimationRefSchema = z.discriminatedUnion("kind", [
  AnimationEntityRefSchema,
  AnimationZoneRefSchema,
  AnimationPlayerRefSchema,
  AnimationAnchorRefSchema,
]);

export type AnimationEntityRef = z.infer<typeof AnimationEntityRefSchema>;
export type AnimationZoneRef = z.infer<typeof AnimationZoneRefSchema>;
export type AnimationPlayerRef = z.infer<typeof AnimationPlayerRefSchema>;
export type AnimationAnchorRef = z.infer<typeof AnimationAnchorRefSchema>;
export type AnimationRef = z.infer<typeof AnimationRefSchema>;
