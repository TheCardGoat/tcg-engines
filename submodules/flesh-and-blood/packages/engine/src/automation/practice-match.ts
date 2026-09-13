import type { FabMatchRuntime } from "../runtime.ts";
import type { FabTestEngine } from "../testing/test-engine.ts";

/** Lightweight local-match handle shared by simulator fixtures and practice. */
export interface FabPracticeMatch {
  readonly runtime: FabMatchRuntime;
  readonly engine: FabTestEngine;
  readonly player1Id: string;
  readonly player2Id: string;
  readonly seed: string;
}
