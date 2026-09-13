export * from "./test-engine.ts";
export * from "./test-fixtures.ts";
export * from "./seating.ts";
export * from "./play-options.ts";
export * from "./harness-config.ts";
export * from "./card-ref.ts";
export * from "./player-fluent.ts";
export * from "./fluent-assert.ts";
export * from "./intent.ts";
export * from "./target-identity.ts";
export * from "./rules-aaa.ts";
export { readFabWaitState, type FabWaitState, type FabWaitWindow } from "../game/wait-state.ts";
export {
  fabObjectInstanceId,
  fabPlayerId,
  type FabObjectInstanceId,
  type FabPlayerId,
} from "../game/identity.ts";

// Test-only evaluated-state inspection. Production consumers use runtime
// projections and may not import this entrypoint.
export { buildFabRulesView } from "../rules/state-rules-view.ts";
