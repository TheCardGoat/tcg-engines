import type { FabActivatedAbility } from "@tcg/flesh-and-blood-types";
import type { FabAttackTarget, FabMatchState, FabZoneKind } from "../../state.ts";
import type { FabRulesActionReversalReason } from "../reversal.ts";

export type FabActivationProcedureResult =
  | { readonly kind: "advanced"; readonly state: FabMatchState }
  | {
      readonly kind: "reversed";
      readonly state: FabMatchState;
      readonly reason: FabRulesActionReversalReason;
    }
  | {
      readonly kind: "failed";
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

export interface FabActivationRequest {
  readonly actorId: string;
  readonly instanceId: string;
  readonly abilityId: string | null;
  readonly attackTargetId?: string | null;
  /**
   * CR 8.5.41 / 8.3.30: named equipment seat for modular re-equip. The
   * activate command reuses `target` for this declaration.
   */
  readonly equipToZone?: "head" | "chest" | "arms" | "legs" | null;
  /** Index of the declared arm of a mixed `alternative` activation cost. */
  readonly alternativeCostIndex?: number | null;
}

export interface FabActivationQuote {
  readonly stateID: number;
  readonly request: FabActivationRequest;
  readonly handled: boolean;
  readonly allowed: boolean;
  readonly reasonCode: string | null;
  readonly reason: string | null;
  readonly ability: FabActivatedAbility | null;
  readonly source: import("../../rules/continuous/ir.ts").FabObjectRef | null;
  readonly sourceZone: FabZoneKind | null;
  readonly resourceCost: number | null;
  readonly chiCost: number | null;
  readonly lifeCost: number | null;
  readonly actionPointCost: number | null;
  readonly requiredDeclarations: readonly string[];
  readonly effectIds: readonly string[];
  readonly attackTarget: FabAttackTarget | null;
}
