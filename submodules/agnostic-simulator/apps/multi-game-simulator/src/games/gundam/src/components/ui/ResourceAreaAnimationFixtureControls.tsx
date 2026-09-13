import { useSyncExternalStore } from "react";
import type { MatchRuntime } from "@tcg/gundam-engine";

import { DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { judgePlaceResource } from "../../game/fixtures/resource-area-animation-demo.ts";

const MAX_RESOURCES = 15;

export function ResourceAreaAnimationFixtureControls({
  runtime,
}: {
  readonly runtime: MatchRuntime;
}) {
  const snapshot = useSyncExternalStore(
    (listener) => runtime.onStateUpdate(listener),
    () => resourceFixtureSnapshot(runtime),
    () => resourceFixtureSnapshot(runtime),
  );
  const [stateId, resourceCount, resourceDeckCount] = snapshot.split(":").map(Number);
  const canAdd = resourceDeckCount > 0 && resourceCount < MAX_RESOURCES;

  return (
    <aside
      className="fixed right-2 top-14 z-[90] flex min-h-10 items-center gap-2 rounded-md border border-sky-400/60 bg-slate-950/95 px-2 py-1.5 font-mono text-white shadow-xl backdrop-blur sm:right-28 sm:top-3 sm:gap-3 sm:px-3 sm:py-2"
      aria-label="Resource Area animation fixture controls"
      data-state-id={stateId}
    >
      <div className="leading-tight">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
          Judge fixture
        </div>
        <div className="text-xs text-slate-300">
          Resource Area {resourceCount}/{MAX_RESOURCES}
        </div>
      </div>
      <button
        type="button"
        className="min-h-8 rounded border border-sky-300 bg-sky-500 px-3 text-xs font-black uppercase tracking-[0.12em] text-sky-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-white"
        disabled={!canAdd}
        onClick={() => judgePlaceResource(runtime)}
      >
        Add Resource
      </button>
    </aside>
  );
}

function resourceFixtureSnapshot(runtime: MatchRuntime): string {
  const state = runtime.getState();
  const resources =
    state.ctx.zones.private.zoneCards[`resourceArea:${DEV_PLAYER_ONE}`]?.length ?? 0;
  const resourceDeck =
    state.ctx.zones.private.zoneCards[`resourceDeck:${DEV_PLAYER_ONE}`]?.length ?? 0;
  return `${state.ctx._stateID}:${resources}:${resourceDeck}`;
}
