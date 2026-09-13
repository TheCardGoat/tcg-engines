import { describe, expect, it } from "vitest";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { fyendalSSpringTunic } from "../../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { snapshotFunctionalTriggerSources } from "./snapshots.ts";
import { buildFabRulesView } from "./state-rules-view.ts";

// Kernel contract: trigger sources retain detached, immutable boundary facts,
// including when their source also has a non-triggered activated ability.
describe("trigger source boundary snapshots", () => {
  it("keeps the old counters when an equipment activation changes the live source", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: fyendalSSpringTunic, state: { energyCounters: 3 } }],
        hand: [],
        deck: [],
        resourcePoints: 0,
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: [] },
    );
    const tunicSources = () =>
      snapshotFunctionalTriggerSources(game.getRuntime().getState()).filter(
        (source) => source.source.canonicalId === fyendalSSpringTunic.canonicalId,
      );
    const before = tunicSources();
    expect(before).toHaveLength(1);
    expect(before[0]!.source.counters).toEqual({ energy: 3 });
    const live = buildFabRulesView(game.getRuntime().getState()).object(before[0]!.source.ref)!;
    expect(before[0]!.source.current.abilities[0]).not.toBe(live.current.abilities[0]);
    expect(Object.isFrozen(before[0]!.source.current.abilities)).toBe(true);
    expect(Object.isFrozen(before[0]!.source.current.abilities[0])).toBe(true);

    game.as(bravo).activate(fyendalSSpringTunic);

    const after = tunicSources();
    expect(after).toHaveLength(1);
    expect(after[0]!.source.counters).toEqual({});
    expect(after[0]!.source.current.abilities).toEqual(before[0]!.source.current.abilities);
    expect(after[0]!.source.current.abilities[0]).not.toBe(before[0]!.source.current.abilities[0]);
    expect(before[0]!.source.counters).toEqual({ energy: 3 });
    expect(Object.isFrozen(before[0]!.source.counters)).toBe(true);
  });
});
