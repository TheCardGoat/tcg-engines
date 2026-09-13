import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposedObjectResetCount, unsupported, withObjectIncarnationOffset } from "../shared.ts";
import { proposeMechanicEffect } from "../mechanic-effects.ts";
import { proposeEffect } from "../propose-effect.ts";

function requiresWinnerResolution(reason: string): boolean {
  // A clash winner does not exist until clash-outcome commits. Any unresolved
  // choice/target in that winner's prize must therefore become a layer after
  // the outcome, rather than making the original clash layer unresolvable.
  return reason.includes("unresolved") || reason.includes("requires a decision");
}

/**
 * Clash (CR 8.3.34 / 8.5.45): top-deck power comparison → clash-win/lose, then
 * optional `prize` for the winner (e.g. "the winner creates a Seismic Surge").
 */
export function proposeClash(
  ctx: ProposalContext,
  effect: FabEffect & { type: "clash" },
): FabEffectProposalResult {
  const base =
    proposeMechanicEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals");
  if (!base.supported) return base;
  if (!effect.prize) return base;

  const outcome = base.events.find(
    (event): event is ProposedEvent<"clash-outcome"> => event.name === "clash-outcome",
  );
  if (!outcome) return unsupported(effect, "clash did not stage a provisional outcome");

  const winnerId = outcome.data.winnerId;
  // Ties still stage a deferred prize: Brutus (and similar outcome
  // replacements) assign a winner before clash-prize commits.
  if (winnerId) {
    const loserId =
      winnerId === outcome.data.firstPlayerId
        ? outcome.data.secondPlayerId
        : outcome.data.firstPlayerId;
    const prizeCtx: ProposalContext = {
      ...ctx,
      state: withObjectIncarnationOffset(ctx.state, proposedObjectResetCount(base.events)),
      layer: {
        ...ctx.layer,
        controllerId: winnerId,
        bindings: { ...ctx.layer.bindings, winner: winnerId, loser: loserId },
      },
      effectPath: [...ctx.effectPath, 0],
      targetPath: `${ctx.targetPath}:prize:${winnerId}`,
    };
    const result = proposeEffect(prizeCtx, effect.prize);
    if (!result.supported && !requiresWinnerResolution(result.reason)) return result;
  }
  // The outcome is replaceable (Victor Goldmane can re-clash), so the
  // authoritative winner is not known until the outcome journal commits.
  // Resolve every prize as its own winner-bound layer rather than capturing
  // the provisional winner in a precomputed event branch.
  const prizeEvent: ProposedEvent<"clash-prize"> = {
    ...outcome,
    name: "clash-prize",
    data: {
      clashId: outcome.data.clashId,
      branches: [],
      deferredEffect: effect.prize,
    },
  };
  const events: ProposedEvent[] = [
    ...base.events.map((event) =>
      event.name === "clash-outcome"
        ? { ...event, data: { ...event.data, deferredEffect: effect.prize } }
        : event,
    ),
    prizeEvent,
  ];
  return { supported: true, events, eventGroups: [events] };
}
