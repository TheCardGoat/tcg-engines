import { describe, expect, it } from "vitest";

import { expectFabPlayer, FAB_MANUAL_HARNESS, FabTestEngine } from "../../../../testing/index.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";
import { teklovossen } from "../../../../../../cards/src/cards/heroes/teklovossen.ts";
import { hyperDriver } from "../../../../../../cards/src/cards/tokens/hyper-driver.ts";
import { systemFailureYellow } from "../../../../../../cards/src/cards/actions/system-failure.ts";

describe("effect: remove-all-counters bindings", () => {
  it("binds the affected object as it while retaining the numeric removal count", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemFailureYellow],
        arena: [{ card: hyperDriver, state: { steamCounters: 2 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const driverId = Teklo.findCardInZone("arena", hyperDriver);

    Teklo.play(systemFailureYellow, { targetInstanceId: driverId });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const removal = game.committedEvents().find((event) => event.name === "counter-removed");
    expect(removal?.bindings["counters-removed"]).toBe(2);
    expect(removal?.bindings.it).toEqual(
      expect.objectContaining({ instanceId: driverId, controllerId: Teklo.id }),
    );
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
