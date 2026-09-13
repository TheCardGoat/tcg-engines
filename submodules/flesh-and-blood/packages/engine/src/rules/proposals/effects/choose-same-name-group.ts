import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { nextFabDestinationRef } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";

export function proposeChooseSameNameGroup(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-same-name-group" },
): FabEffectProposalResult {
  const partition = ctx.effectPartitions[ctx.effectPath.join(".")];
  const selectedIds = partition?.selected;
  const remainderIds = partition?.remainder;
  if (!selectedIds || !remainderIds) {
    return unsupported(effect, "same-name group choice is unresolved");
  }
  const objects = objectTargets(
    ctx.state,
    ctx.layer,
    effect.target,
    ctx.targetPath,
    ctx.effectTargets,
    ctx.effectPath,
  );
  if (!objects) return unsupported(effect, "same-name group pool is unresolved");
  const byId = new Map(objects.map((object) => [object.instanceId, object]));
  const selected = selectedIds.flatMap((id) => {
    const object = byId.get(id);
    return object ? [object] : [];
  });
  const remainder = remainderIds.flatMap((id) => {
    const object = byId.get(id);
    return object ? [object] : [];
  });
  if (
    selected.length !== selectedIds.length ||
    remainder.length !== remainderIds.length ||
    selected.length === 0 ||
    selected.length + remainder.length !== objects.length
  ) {
    return unsupported(effect, "same-name group choice no longer matches its source pool");
  }
  const selectedNameKey = selected[0]!.current.names
    .map((name) => name.trim().toLocaleLowerCase("en-US"))
    .join("\u0000");
  if (
    selected.some(
      (object) =>
        object.current.names
          .map((name) => name.trim().toLocaleLowerCase("en-US"))
          .join("\u0000") !== selectedNameKey,
    )
  ) {
    return unsupported(effect, "selected cards do not share the same full name");
  }
  const events = [
    ...selected.map((object, index) => ({
      ...baseEvent(ctx.layer, ctx.processId),
      name: "move-zone" as const,
      affected: [object],
      bindings: {
        ...ctx.layer.bindings,
        [effect.selectedBinding]: selected,
        [effect.orderedRemainderBinding]: remainder,
      },
      data: {
        object,
        destinationRef: nextFabDestinationRef(ctx.state, object, index),
        from: "deck" as const,
        to: "banished" as const,
        reason: "banish" as const,
      },
    })),
    ...[...remainder].reverse().map((object, index) => ({
      ...baseEvent(ctx.layer, ctx.processId),
      name: "move-zone" as const,
      affected: [object],
      bindings: {
        ...ctx.layer.bindings,
        [effect.selectedBinding]: selected,
        [effect.orderedRemainderBinding]: remainder,
      },
      data: {
        object,
        destinationRef: nextFabDestinationRef(ctx.state, object, selected.length + index),
        from: "deck" as const,
        to: "deck" as const,
        reason: "move" as const,
        position: "top" as const,
      },
    })),
  ];
  return { supported: true, events };
}
