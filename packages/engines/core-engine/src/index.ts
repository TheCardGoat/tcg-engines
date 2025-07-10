export {
  GameCards,
  InstanceId,
  PlayerId,
  PublicId,
} from "~/game-engine/core-engine/types";
export type {
  ClientState,
  CoreEngineOpts,
} from "./game-engine/core-engine/engine/core-engine";

// Export simplified core engine
export { Core, CoreEngine } from "./game-engine/core-engine/engine/core-engine";
export * from "./lobby-engine/lobby-engine";

// Engine version
export const engineVersion = "1.0.0";
