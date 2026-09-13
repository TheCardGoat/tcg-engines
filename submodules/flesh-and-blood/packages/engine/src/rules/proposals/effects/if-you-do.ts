import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import { reduceFabEventJournal } from "../../../kernel/event-journal.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import {
  layerWithEventBindings,
  liveReanchorBindings,
  proposedObjectResetCount,
  withObjectIncarnationOffset,
} from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

/** Structural "Do X. If you do, Y". */
export function proposeIfYouDo(
  ctx: ProposalContext,
  effect: FabEffect & { type: "if-you-do" },
): FabEffectProposalResult {
  const main = proposeEffect(
    { ...ctx, effectPath: [...ctx.effectPath, 0], targetPath: `${ctx.targetPath}:effect` },
    effect.effect,
  );
  if (!main.supported) return main;
  const mainSucceeded =
    main.outcome === "committed" ||
    (main.outcome !== "failed" &&
      (main.events.length > 0 || (main.eventGroups?.some((group) => group.length > 0) ?? false)));
  if (!mainSucceeded) return main;
  let thenState = ctx.state;
  let thenLayer = layerWithEventBindings(ctx.layer, main.events);
  if (main.events.length > 0) {
    const preview = reduceFabEventJournal(ctx.state, [
      {
        eventGroupId: `${ctx.processId}:if-you-do-preview`,
        required: true,
        events: [...main.events],
      },
    ]);
    if (preview.committed) {
      thenState = preview.state;
      thenLayer = {
        ...thenLayer,
        bindings: liveReanchorBindings(thenState, thenLayer.bindings),
      };
    } else {
      thenState = withObjectIncarnationOffset(ctx.state, proposedObjectResetCount(main.events));
    }
  }
  const lockedSourceCounters = countersOnSourceSnapshot(ctx.layer.source);
  if (lockedSourceCounters !== undefined) {
    thenLayer = {
      ...thenLayer,
      bindings: { ...thenLayer.bindings, "counters-on-source": lockedSourceCounters },
    };
  }
  const thenCtx: ProposalContext = {
    ...ctx,
    state: thenState,
    layer: thenLayer,
    effectPath: [...ctx.effectPath, 1],
    targetPath: `${ctx.targetPath}:then`,
  };
  const thenResult = proposeEffect(thenCtx, effect.then);
  if (!thenResult.supported) return thenResult;
  const events: ProposedEvent[] = [...main.events, ...thenResult.events];
  return {
    supported: true,
    events,
    eventGroups: [
      ...(main.eventGroups ?? (main.events.length > 0 ? [main.events] : [])),
      ...(thenResult.eventGroups ?? (thenResult.events.length > 0 ? [thenResult.events] : [])),
    ],
  };
}

function countersOnSourceSnapshot(
  source: import("../../events.ts").FabObjectSnapshot,
): number | undefined {
  const namedSteam = source.counters.steam;
  if (typeof namedSteam === "number") return namedSteam;
  const fromRecords = source.counterRecords
    .filter((counter) => counter.kind === "named" && counter.name === "steam")
    .reduce((total, counter) => total + counter.count, 0);
  const anyNamed = source.counterRecords
    .filter((counter) => counter.kind === "named")
    .reduce((total, counter) => total + counter.count, 0);
  if (fromRecords > 0) return fromRecords;
  if (anyNamed > 0) return anyNamed;
  return undefined;
}
