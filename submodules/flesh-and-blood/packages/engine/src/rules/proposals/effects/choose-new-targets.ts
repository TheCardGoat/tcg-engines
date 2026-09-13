import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { fabPlayerId } from "../../../game/identity.ts";
import type { FabAttackTarget } from "../../../state.ts";
import { quoteFabAttackTargets } from "../../legality/attack-targets.ts";
import type { FabAttackTargetCandidate } from "../../legality/types.ts";
import type { FabTargetRef } from "../../targets.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { attackTargetController, baseEvent, unsupported } from "../shared.ts";

export function chooseNewTargetsAlternatives(
  ctx: Pick<ProposalContext, "state" | "layer">,
): readonly FabAttackTargetCandidate[] {
  const live = liveAttackToRetarget(ctx);
  if (!live) return [];
  const quote = quoteFabAttackTargets(ctx.state, {
    actorId: live.actorId,
    attackInstanceId: live.attackInstanceId,
  });
  if (!quote.allowed) return [];
  return quote.candidates.filter(
    (candidate) => !sameDeclaredTarget(candidate.target, live.current),
  );
}

/**
 * CR 1.8.5f — choose new targets for the source that armed this layer.
 * Empty alternatives leave the original target unmodified. A unique
 * remaining legal target is determined (1.8.6c).
 */
export function proposeChooseNewTargets(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-new-targets" },
): FabEffectProposalResult {
  const live = liveAttackToRetarget(ctx);
  if (!live) return { supported: true, events: [] };
  const alternatives = chooseNewTargetsAlternatives(ctx);
  if (alternatives.length === 0) return { supported: true, events: [] };

  const key = ctx.effectPath.join(".");
  const selected = ctx.effectTargets[key];
  const chosen =
    alternatives.length === 1 && (!selected || selected.length === 0)
      ? alternatives[0]!.target
      : chosenAttackTarget(alternatives, selected);
  if (!chosen) return unsupported(effect, "choose-new-targets has no public target answer");

  return {
    supported: true,
    events: [
      {
        ...baseEvent(ctx.layer, ctx.processId),
        name: "retarget-attack",
        affected: [],
        data: {
          attackInstanceId: live.attackInstanceId,
          target: chosen,
          defendingPlayerId: attackTargetController(chosen),
        },
      },
    ],
  };
}

function liveAttackToRetarget(ctx: Pick<ProposalContext, "state" | "layer">): {
  readonly attackInstanceId: string;
  readonly actorId: string;
  readonly current: FabAttackTarget;
} | null {
  const link = ctx.state.combat?.activeLink;
  if (link) {
    const current = attackTargetFromLink(ctx.state, link.attackTargetRef);
    if (!current) return null;
    return {
      attackInstanceId: link.activeAttack.sourceObjectId,
      actorId: link.attackingPlayerId,
      current,
    };
  }
  const triggeringSourceId =
    ctx.layer.kind === "triggered" ? ctx.layer.triggeringEvent?.source?.instanceId : undefined;
  const attackLayer = ctx.state.rulesStack.find((layer) => {
    if (!("attackTarget" in layer) || !layer.attackTarget) return false;
    return triggeringSourceId ? layer.source.instanceId === triggeringSourceId : true;
  });
  if (!attackLayer || !("attackTarget" in attackLayer) || !attackLayer.attackTarget) return null;
  return {
    attackInstanceId: attackLayer.source.instanceId,
    actorId: attackLayer.controllerId,
    current: attackLayer.attackTarget,
  };
}

function attackTargetFromLink(
  state: ProposalContext["state"],
  ref: NonNullable<
    NonNullable<ProposalContext["state"]["combat"]>["activeLink"]
  >["attackTargetRef"],
): FabAttackTarget | null {
  if (ref.kind === "hero") return { kind: "hero", playerId: fabPlayerId(ref.playerId) };
  if (!state.objects[ref.ref.instanceId]) return null;
  return {
    kind: "permanent",
    ref: ref.ref,
    controllerId: fabPlayerId(ref.controllerIdAtDeclaration),
  };
}

function sameDeclaredTarget(candidate: FabAttackTarget, current: FabAttackTarget): boolean {
  if (candidate.kind === "hero" && current.kind === "hero") {
    return candidate.playerId === current.playerId;
  }
  if (candidate.kind === "hero" || current.kind === "hero") return false;
  return candidate.ref.instanceId === current.ref.instanceId;
}

function chosenAttackTarget(
  alternatives: readonly FabAttackTargetCandidate[],
  selected: readonly FabTargetRef[] | undefined,
): FabAttackTarget | null {
  if (!selected || selected.length !== 1) return null;
  const pick = selected[0]!;
  const match = alternatives.find((candidate) => {
    if (pick.kind === "player") {
      return candidate.kind === "hero" && candidate.target.kind === "hero"
        ? candidate.target.playerId === pick.playerId
        : false;
    }
    return candidate.kind !== "hero" && candidate.target.kind !== "hero"
      ? candidate.target.ref.instanceId === pick.ref.instanceId
      : false;
  });
  return match?.target ?? null;
}
