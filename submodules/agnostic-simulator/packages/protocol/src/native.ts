import { z } from "zod";
import { EngineInteractionView, InteractionSubmission } from "./interactions.js";
import { AnimationPlanV2Schema } from "./animations/plan.js";
import { PresentationCatalogReferenceSchema } from "./presentation.js";

const id = z.string().min(1).max(128);
const counter = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const base = { v: z.literal(1) };
export const NATIVE_LIMITS = {
  inputBytes: 32768,
  outputBytes: 1048576,
  queue: 32,
  results: 4096,
  connections: 8,
} as const;
export const NativeClientMessage = z
  .discriminatedUnion("type", [
    z.strictObject({ ...base, type: z.literal("hello"), credential: id }),
    z.strictObject({
      ...base,
      type: z.literal("join_game"),
      gameId: id.optional(),
      fixtureIds: z.tuple([id, id]).meta({ minItems: 2, maxItems: 2 }).optional(),
      lastSequence: counter.optional(),
    }),
    z.strictObject({
      ...base,
      type: z.literal("submit_interaction"),
      gameId: id,
      correlationId: id,
      expectedVersion: counter,
      submission: InteractionSubmission.extend({ correlationId: id, stateVersion: counter }),
    }),
    z.strictObject({ ...base, type: z.literal("request_game_state_sync"), gameId: id }),
    z.strictObject({ ...base, type: z.literal("ping"), nonce: id }),
    z.strictObject({ ...base, type: z.literal("pong"), nonce: id }),
  ])
  .superRefine((message, context) => {
    if (message.type === "join_game" && Boolean(message.gameId) === Boolean(message.fixtureIds))
      context.addIssue({ code: "custom", message: "Specify gameId or fixtureIds exclusively" });
    if (
      message.type === "submit_interaction" &&
      (message.correlationId !== message.submission.correlationId ||
        message.expectedVersion !== message.submission.stateVersion)
    )
      context.addIssue({ code: "custom", message: "Envelope and interaction guards must agree" });
  });
export type NativeClientMessage = z.infer<typeof NativeClientMessage>;
export const NativeActionResult = z.strictObject({
  ...base,
  type: z.literal("action_result"),
  gameId: id,
  correlationId: id,
  accepted: z.boolean(),
  stateVersion: counter,
  code: id,
});
export type NativeActionResult = z.infer<typeof NativeActionResult>;
const snapshot = {
  ...base,
  gameId: id,
  matchId: id,
  stateVersion: counter,
  sequence: counter,
  // Game-owned, viewer-filtered JSON. The transport never interprets rules state.
  state: z.json(),
  interaction: EngineInteractionView,
  display: z.strictObject({
    catalog: PresentationCatalogReferenceSchema,
    cards: z.record(z.string(), z.strictObject({ name: z.string(), rulesText: z.string() })),
    objects: z.record(
      z.string(),
      z.strictObject({
        definitionId: id,
        printingId: id.optional(),
        imageUrl: z.string().optional(),
      }),
    ),
  }),
};
export const NativeServerMessage = z.discriminatedUnion("type", [
  z.strictObject({
    ...base,
    type: z.literal("welcome"),
    sessionId: id,
    role: id,
    heartbeatMs: counter,
    fixtures: z.array(z.strictObject({ id, name: z.string() })),
    supportedInputs: z.array(z.string()),
  }),
  NativeActionResult,
  z.strictObject({ ...snapshot, type: z.literal("state_sync") }),
  z.strictObject({
    ...snapshot,
    type: z.literal("state_update"),
    previousVersion: counter,
    animation: AnimationPlanV2Schema.optional(),
  }),
  z.strictObject({ ...base, type: z.literal("ping"), nonce: id }),
  z.strictObject({ ...base, type: z.literal("pong"), nonce: id }),
  z.strictObject({ ...base, type: z.literal("error"), code: id }),
]);
export type NativeServerMessage = z.infer<typeof NativeServerMessage>;
