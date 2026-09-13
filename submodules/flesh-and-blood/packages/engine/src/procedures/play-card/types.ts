import type { FabPlayOrigin } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
import type { FabProcessId } from "../../rules/events.ts";
import type { FabSplitPlayMethod } from "../../cards.ts";
import { reverseFabRulesAction, type FabRulesActionReversalReason } from "../reversal.ts";

/**
 * One named play declaration: everything the player declared for this play,
 * exactly as the begin-play command carries it. Optional fields keep the
 * engine defaults (no boost/scrap/fuse/… declarations, crank on).
 */
export interface FabPlayDeclaration {
  readonly actorId: string;
  readonly instanceId: string;
  readonly from: FabPlayOrigin;
  readonly requestedAttackTargetId?: string | null;
  readonly boost?: boolean;
  readonly scrap?: boolean;
  readonly scrapInstanceId?: string | null;
  readonly beatChest?: boolean;
  readonly beatChestInstanceId?: string | null;
  readonly crank?: boolean;
  readonly playMethod?: FabSplitPlayMethod;
  readonly fuseInstanceIds?: readonly string[];
  readonly chargeInstanceId?: string | null;
  readonly additionalAttackTargetId?: string | null;
  readonly banishCostInstanceId?: string | null;
  readonly declaredOptionalCostAbilityIds?: readonly string[];
  readonly paidOptionalCostAbilityIds?: readonly string[];
  readonly playPermissionId?: string;
}

export type FabPlayProcedureResult =
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

export function advanced(state: FabMatchState): FabPlayProcedureResult {
  return { kind: "advanced", state };
}

export function failure(
  state: FabMatchState,
  error: string,
  errorCode: string,
): FabPlayProcedureResult {
  return { kind: "failed", state, error, errorCode };
}

export function reversed(
  state: FabMatchState,
  reason: FabRulesActionReversalReason,
): FabPlayProcedureResult {
  return { kind: "reversed", state, reason };
}

export function reversePlay(
  state: FabMatchState,
  processId: FabProcessId,
  actorId: string,
  reason: FabRulesActionReversalReason,
): FabPlayProcedureResult {
  return reversed(reverseFabRulesAction(state, processId, actorId), reason);
}
