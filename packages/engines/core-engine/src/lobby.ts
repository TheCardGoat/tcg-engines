export * from "./lobby-engine/lobby-engine";
export type * from "./lobby-engine/lobby-engine-types";
export * from "./lobby-engine/lobby-messages-type";
export {
  ClientMessageType,
  ServerMessageType,
} from "./lobby-engine/lobby-messages-type";
export * from "./lobby-engine/side-effects-adapter";
export type { EngineLogger } from "./shared/logger";

export function exhaustiveCheck(_: never): never {
  throw new Error("Should not reach here");
}
