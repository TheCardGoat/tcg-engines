/**
 * Faces (CR 9.1/9.2) and physical card layouts.
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FleshAndBloodAbility } from "./ability.ts";
import type { FabKeyword } from "./keyword.ts";
import type { FabFaceId, FabNumericProperty } from "./primitives.ts";
import type { FabTypeBoxToken } from "../base-object-properties.ts";

// ---------------------------------------------------------------------------
// Faces (9.1/9.2) and tokens (8.6)
// ---------------------------------------------------------------------------

/**
 * A fully normalized face of a multi-face card. This is generated from the
 * catalog at build time; game runtime code must consume this structure rather
 * than re-splitting a display string.
 */
export interface FabCardFace {
  name: string;
  /** Typebox: "[METATYPES] [SUPERTYPES] [TYPE] – [SUBTYPES]" (2.14.1). */
  typeText: string;
  /** Game-native type-box tokens local to this face. */
  types: readonly FabTypeBoxToken[];
  traits: readonly string[];
  /** Functional text for this face only. */
  text: string;
  /** Keywords and AST are deliberately face-local. */
  keywords: readonly FabKeyword[];
  abilities: readonly FleshAndBloodAbility[];
  /** Parser audit data for this face only. */
}

/** One explicitly paired printed face of a physical double-faced card. */
export type FabPairedCardFace = FabCardFace & {
  readonly faceId: FabFaceId;
  readonly color?: "red" | "yellow" | "blue" | "purple";
  readonly numeric?: Readonly<Partial<Record<FabNumericProperty, number>>>;
};

export interface FabFlipCardLayout {
  readonly kind: "flip";
  /** CR 9.1.3 classification is source-authored, never inferred at runtime. */
  readonly family: "figment" | "invocation" | "construct";
  readonly front: FabPairedCardFace;
  readonly back: FabPairedCardFace;
}

export interface FabTwinCardLayout {
  readonly kind: "twin";
  readonly front: FabPairedCardFace;
  readonly back: FabPairedCardFace;
}

export interface FabTranscendCardLayout {
  readonly kind: "transcend";
  readonly front: FabPairedCardFace;
  readonly back: FabPairedCardFace;
}

/**
 * Explicit card layout. `split` is intentionally a discriminated variant so
 * future engine support must branch before selecting a playable face.
 */
export type FabCardLayout =
  | { kind: "single" }
  | { kind: "split"; faces: readonly [FabCardFace, FabCardFace] }
  | FabFlipCardLayout
  | FabTwinCardLayout
  | FabTranscendCardLayout;
