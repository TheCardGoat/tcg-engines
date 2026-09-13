import { grandArchiveCards } from "@tcg/grand-archive-cards";
import {
  createGrandArchiveMatchInitialState,
  createGrandArchiveMatchProgram,
  type GrandArchiveInitializeOptions,
  type InitializeGrandArchiveMatchInput,
} from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "./server-engine.ts";

/**
 * The single setup entrypoint for Standard, Draft, and Pantheon. The engine's
 * discriminated input owns every format rule; the adapter only constructs the
 * admitted program/runtime pair.
 */
export function createGrandArchiveServerEngine(
  input: InitializeGrandArchiveMatchInput,
  options: GrandArchiveInitializeOptions = {},
): GrandArchiveServerEngine {
  const program = createGrandArchiveMatchProgram(grandArchiveCards);
  const state = createGrandArchiveMatchInitialState(program, input, options);
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, state));
}
