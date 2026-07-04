import type { BaseCardDefinition } from "./base-card-definition.js";
// NOTE: import Lorcana via the `./cards` subpath (not the package root) so tsc
// does not follow the root barrel's `./utils/shuffle` re-export, which would
// otherwise be re-checked under this package's strict tsconfig and surface an
// unrelated indexed-access diagnostic. The `./cards` entry is an officially
// exported subpath of `@tcg/lorcana-types`.
import type { LorcanaCardDefinition } from "@tcg/lorcana-types/cards";
import type { CardDefinition as CyberpunkCardDefinition } from "@tcg/cyberpunk-types";
import type { Card as GundamCard } from "@tcg/gundam-types";
import type { OPCard } from "@tcg/op-types";
import type { SwuCard } from "@tcg/star-wars-unlimited-types";

/**
 * Cross-game `BaseCardDefinition` conformance (RFC §7 / ADR-11 / P1 wave).
 *
 * Compile-time contract guard, intentionally placed in package source (not a
 * `.test.ts`) so `tsc` enforces it under `vp run check-types` /
 * `bun run ci:agnostic:check`. Each native game card type literally
 * `extends BaseCardDefinition`, so the assignability below is
 * identity-preserving rather than a read-time projection output.
 *
 * If any game drops a base field, the corresponding flag's type resolves to
 * `false`, the `: true` annotation stops accepting the `true` literal, and
 * the type-check fails loudly — surfacing the regression at the shared
 * contract boundary rather than in a downstream consumer.
 */

/** `true` when `T` is assignable to `U`, else `false`. */
type AssignableTo<T, U> = T extends U ? true : false;

export const LORCANA_IS_BASE_CARD: AssignableTo<LorcanaCardDefinition, BaseCardDefinition> = true;
export const CYBERPUNK_IS_BASE_CARD: AssignableTo<CyberpunkCardDefinition, BaseCardDefinition> =
  true;
export const GUNDAM_IS_BASE_CARD: AssignableTo<GundamCard, BaseCardDefinition> = true;
export const ONE_PIECE_IS_BASE_CARD: AssignableTo<OPCard, BaseCardDefinition> = true;
export const SWU_IS_BASE_CARD: AssignableTo<SwuCard, BaseCardDefinition> = true;
