import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, playersForFabPlayer, unsupported } from "../shared.ts";
import { orderChooseOptionChoosers } from "./choose-option.ts";

/** Shared number-binding key for one chooser on a choose-number leaf. */
export function chooseNumberBindingKey(path: readonly number[], chooserId: string): string {
  return `${path.join(".")}:${chooserId}`;
}

/**
 * CR "Choose a number" — bind the chosen integer for "that much" / "that many"
 * follow-ups. Does **not** grant resources or other invented consequences;
 * subsequent sequence steps read `chosen-number` via amount bindings.
 *
 * Default when no option is recorded and no min/max/chooser is authored: 1.
 * "Each hero secretly chooses 1–6" records one option per seated hero.
 */
export function proposeChooseNumber(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-number" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const min = effect.min ?? 1;
  const max = effect.max ?? min;
  const prompted =
    effect.min !== undefined || effect.max !== undefined || effect.chooser !== undefined;
  const chooserIds = playersForFabPlayer(
    state,
    layer.controllerId,
    effect.chooser ?? "controller",
    layer.bindings,
  );
  if (!chooserIds || chooserIds.length === 0) {
    return unsupported(effect, "choose-number chooser is unresolved");
  }
  const ordered = orderChooseOptionChoosers(layer.controllerId, chooserIds);
  const chosenByPlayer: Record<string, number> = {};
  for (const chooserId of ordered) {
    const key = prompted
      ? chooseNumberBindingKey(ctx.effectPath, chooserId)
      : ctx.effectPath.join(".");
    const raw = ctx.effectOptions[key];
    const chosen =
      raw !== undefined && Number.isFinite(Number(raw))
        ? Math.floor(Number(raw))
        : prompted
          ? NaN
          : 1;
    if (!Number.isInteger(chosen) || chosen < min || chosen > max) {
      return unsupported(effect, "choose-number selection is out of range");
    }
    chosenByPlayer[chooserId] = chosen;
  }
  const values = Object.values(chosenByPlayer);
  const highest = values.length > 0 ? Math.max(...values) : min;
  const uniqueHighest = values.filter((value) => value === highest).length === 1 ? 1 : 0;
  const events = [];
  for (const chooserId of ordered) {
    const chosen = chosenByPlayer[chooserId]!;
    const heroId = state.containers.zonesByPlayerId[chooserId]?.heroZone[0];
    if (!heroId) return unsupported(effect, "choose-number chooser has no hero");
    const hero = snapshotObject(state, heroId, chooserId, "heroZone");
    events.push({
      ...baseEvent(layer, processId),
      name: "set-status" as const,
      affected: [hero],
      bindings: {
        ...layer.bindings,
        "chosen-number": chosen,
        chosenNumber: chosen,
        [`chosen-number:${chooserId}`]: chosen,
        "highest-chosen-number": highest,
        "highest-chosen-number-unique": uniqueHighest,
        // Printed "the hero that chose the highest number" pays every tied
        // chooser (HNT255 Spur Locked) — per-chooser fact, ties included;
        // distinct from highest-chosen-number-unique ("exactly one hero chose
        // highest"), which gates only "no one else chose" wordings. Keyed
        // for every chooser so each for-each iteration resolves its own
        // subject regardless of which chooser's event merged last.
        "chose-highest-number": chosen === highest ? 1 : 0,
        ...Object.fromEntries(
          Object.entries(chosenByPlayer).map(([playerId, value]) => [
            `chose-highest-number:${playerId}`,
            value === highest ? 1 : 0,
          ]),
        ),
        ...Object.fromEntries(
          Object.entries(chosenByPlayer).map(([playerId, value]) => [
            `chosen-number:${playerId}`,
            value,
          ]),
        ),
      },
      data: { object: hero, status: `chose-number:${chosen}` },
    });
  }
  return { supported: true, events };
}
