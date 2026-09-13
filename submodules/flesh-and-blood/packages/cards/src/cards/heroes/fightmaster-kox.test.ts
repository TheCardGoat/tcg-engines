import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { fightmasterKox } from "./fightmaster-kox.ts";

/**
 * Fightmaster Kox (SMP003) — Guardian Pit-Fighter Hero 19hp.
 *
 * Printed: Action - {t}, destroy a Gold you control: Look at the top 3 cards
 * of the event deck, then put them back in any order. Go again.
 *
 * Product scope is 1v1 only. Event-deck / shared-event formats are
 * out of scope — pin the family rather than inventing a table.
 */

describe("Fightmaster Kox (SMP003) AAA", () => {
  it("boundary: without a Gold to destroy the Action is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: fightmasterKox,
        hand: [],
        arena: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fightmasterKox).expectActivationRejected(fightmasterKox);
    expectFabPlayer(game.as(fightmasterKox)).toHaveLife(19);
  });

  it("happy: destroy Gold then look at the event deck (out of 1v1 product scope)", () => {
    const game = FabTestEngine.start(
      {
        hero: fightmasterKox,
        hand: [],
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kox = game.as(fightmasterKox);
    // Event-deck is out of 1v1 scope (recorded gap); the {t} + destroy-Gold
    // cost is still payable and visibly destroys the Gold.
    Kox.activate(fightmasterKox);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expect(Kox.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Kox).toHaveAP(1); // printed Go again
  });

  it("timing: go again refunds the Action's spent action point if the ability resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: fightmasterKox,
        hand: [],
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kox = game.as(fightmasterKox);
    Kox.activate(fightmasterKox);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Kox).toHaveAP(1);
  });
});
