import type {
  FabBaseObjectProperties,
  FabFaceId,
  FabNumericProperty,
  FabZone,
} from "@tcg/flesh-and-blood-types";
import type { FabZoneRef } from "./zones.ts";
import type { FabCardPropertyState } from "../cards.ts";
import type {
  FabAttackProxyId,
  FabCanonicalCardId,
  FabObjectInstanceId,
  FabPlayerId,
} from "./identity.ts";

export type FabCounterRecord =
  | {
      /** Damage marked on a living object; this is not a rules counter. */
      readonly kind: "damage";
      readonly count: number;
    }
  | {
      readonly kind: "numeric";
      readonly property: "power" | "defense" | "life";
      readonly value: number;
      readonly count: number;
    }
  | { readonly kind: "named"; readonly name: string; readonly count: number };

export type FabObjectMarker =
  | { readonly kind: "face-down" }
  | { readonly kind: "tapped" }
  | { readonly kind: "frozen" }
  | { readonly kind: "transformed"; readonly into: string }
  | { readonly kind: "wagered" }
  | { readonly kind: "awakened" }
  | { readonly kind: "status"; readonly value: string };

export type FabLkiId = `lki:${string}`;

export interface FabObjectMoveHistoryEntry {
  readonly from: FabZoneRef | null;
  readonly to: FabZoneRef;
  readonly eventId: string | null;
  readonly turnNumber: number;
  readonly combatNumber: number | null;
  readonly chainLinkNumber: number | null;
  /** Interned evaluated last-known information immediately before the move. */
  readonly lki: FabLkiId | null;
}

/** Compact LKI shared by every move fact observing the same object checkpoint. */
export interface FabMoveLkiSnapshot {
  readonly objectKind: FabObjectRecord["objectKind"];
  readonly baseSource: FabObjectRecord["baseSource"];
  readonly ref: { readonly instanceId: FabObjectInstanceId; readonly incarnation: number };
  readonly canonicalId: FabCanonicalCardId;
  readonly ownerId: FabPlayerId;
  readonly controllerId: FabPlayerId | null;
  readonly zone: FabZoneRef;
  readonly base: FabBaseObjectProperties;
  readonly copyable: FabBaseObjectProperties;
  readonly baseNumeric: Readonly<Partial<Record<FabNumericProperty, number>>>;
  readonly current: FabBaseObjectProperties;
  readonly counters: readonly FabCounterRecord[];
  readonly markers: readonly FabObjectMarker[];
  readonly appliedEffectIds: readonly string[];
}

export interface FabObjectHistory {
  readonly moves: readonly FabObjectMoveHistoryEntry[];
}

/** A rules-relevant declaration made for this exact object incarnation. */
export type FabObjectDeclarationFact =
  | {
      /** Numeric declaration value retained for static abilities on this incarnation. */
      readonly kind: "numeric-binding";
      readonly binding: string;
      readonly value: number;
    }
  | {
      readonly kind: "fusion";
      /** Printed fusion elements satisfied by the revealed cards. */
      readonly revealedSupertypes: readonly string[];
    }
  | {
      /** The optional boost cost was paid for this exact incarnation. */
      readonly kind: "boost";
    }
  | {
      /** The optional scrap additional cost was paid for this incarnation (CR 8.3.32). */
      readonly kind: "scrap";
      readonly scrappedCanonicalId: string | null;
      readonly scrappedNames: readonly string[];
    }
  | {
      /** MON Charge additional cost was paid to play this incarnation (CR 8.5.29). */
      readonly kind: "charge";
      /** Printed color of the charged card, when known. */
      readonly color?: "red" | "yellow" | "blue" | "purple" | null;
      /** Exact charged card retained for later effects on this play. */
      readonly chargedCard?: {
        readonly instanceId: FabObjectInstanceId;
        readonly incarnation: number;
      };
    }
  | {
      /** Played from banished via Rune Gate without paying its resource cost (CR 8.3.27a). */
      readonly kind: "rune-gate";
    }
  | {
      /** Chain-link number this incarnation was played as (Rupture CR 8.4.6). */
      readonly kind: "played-at-chain-link";
      readonly chainLinkNumber: number;
    }
  | {
      /** Origin zone of the current play — "this play" scope (cleared by the
       * next object-resetting move), unlike lifetime-sticky move history. */
      readonly kind: "played-from";
      readonly zone: FabZone;
    };

/** Physical object identity (CR 1.2.3 and 3.0.9). */
export interface FabObjectRecord {
  readonly instanceId: FabObjectInstanceId;
  readonly canonicalId: FabCanonicalCardId;
  /** Intrinsic lifecycle category. It never changes when copy effects change
   * the object's evaluated type box. */
  readonly objectKind: "catalog-card" | "created-token" | "macro";
  /** Authoritative base-property source. Registered objects derive from the
   * immutable match program; created copies retain the exact frozen stage-1
   * copyable value and provenance captured when they were created. */
  readonly baseSource:
    | { readonly kind: "registered" }
    | {
        readonly kind: "frozen-copy";
        readonly copyable: FabBaseObjectProperties;
        readonly source: {
          readonly instanceId: FabObjectInstanceId;
          readonly incarnation: number;
          readonly canonicalId: FabCanonicalCardId;
        };
        readonly createdByEventId: string;
      };
  readonly ownerId: FabPlayerId;
  readonly incarnation: number;
  readonly visibility: "public" | "private";
  readonly activeFace: FabActiveFaceState;
  /** Active printed face(s) for this exact object incarnation. */
  readonly cardPropertyState: FabCardPropertyState;
  /** Declared additional-cost facts that survive non-reset zone movement. */
  readonly declarationFacts?: readonly FabObjectDeclarationFact[];
  readonly counters: readonly FabCounterRecord[];
  readonly markers: readonly FabObjectMarker[];
  readonly history: FabObjectHistory;
  /**
   * CR 2.5.3a discrete life gained this incarnation. Reset at end of turn
   * (CR 4.4.3a). Omitted when zero.
   */
  readonly lifeGained?: number;
  /**
   * CR 2.5.3a non-damage life lost this incarnation. Combat damage uses
   * `kind: "damage"` counters. Reset at end of turn (CR 4.4.3a). Omitted when zero.
   */
  readonly lifeLost?: number;
}

/** Printed-face state is distinct from face-down visibility and split declarations. */
export type FabActiveFaceState =
  | { readonly kind: "single" }
  | {
      readonly kind: "paired";
      readonly family: "flip" | "twin" | "transcend";
      readonly activeFaceIds: readonly [FabFaceId, ...FabFaceId[]];
    };

export interface FabObjectStore {
  /** JavaScript lookup keys are strings; each stored record carries its branded identity. */
  readonly objects: Readonly<Record<string, FabObjectRecord>>;
}

/**
 * A distinct non-card object representing an attack created by an activated
 * attack ability. The source remains a card object; this record is the attack
 * identity that can carry attack-only effects across snapshot restoration.
 */
export interface FabAttackProxyRecord {
  readonly id: FabAttackProxyId;
  readonly sourceId: FabObjectInstanceId;
  /** Exact source incarnation retained when the source ceases during this link. */
  readonly sourceRef: {
    readonly instanceId: FabObjectInstanceId;
    readonly incarnation: number;
  };
  readonly controllerId: FabPlayerId;
  readonly createdByEventId: string;
}

export function lookupObject(
  state: FabObjectStore,
  instanceId: FabObjectInstanceId,
): FabObjectRecord | undefined {
  return state.objects[instanceId];
}
