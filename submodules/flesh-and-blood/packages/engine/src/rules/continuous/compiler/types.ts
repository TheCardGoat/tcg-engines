import type { FabCondition, FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabContinuousAtom } from "../ir.ts";

export interface FabContinuousCompileError {
  readonly code: "not_continuous" | "unsupported_mechanic" | "unsupported_dependency";
  readonly effectId: string;
  readonly path: readonly (string | number)[];
  readonly mechanic: string;
}

export type FabContinuousCompileResult =
  | { readonly ok: true; readonly atoms: readonly FabContinuousAtom[] }
  | { readonly ok: false; readonly error: FabContinuousCompileError };

export interface FabContinuousCompileInput {
  readonly effectId: string;
  readonly effect: FabEffect;
  readonly condition?: FabCondition;
}

export interface CompileCursor {
  readonly effectId: string;
  /** Ability-level condition: evaluated once per atom, subjectless (subject = source). */
  readonly condition: FabCondition | null;
  /**
   * In-effect conditional gate: evaluated per resolved application subject, so
   * "if it's attacking a Royal hero" sees the latched attack, not the grantor.
   */
  readonly subjectCondition?: FabCondition;
  readonly path: readonly (string | number)[];
}
