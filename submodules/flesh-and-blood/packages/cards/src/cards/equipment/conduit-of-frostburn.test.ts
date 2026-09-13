import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslanderStormbind as iyslander } from "../heroes/iyslander-stormbind.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { icebindRed } from "../actions/icebind.ts";
import { weaveIceRed } from "../actions/weave-ice.ts";
import { conduitOfFrostburn } from "./conduit-of-frostburn.ts";

/**
 * Conduit of Frostburn (UPR125) — Ice Wizard Equipment Arms.
 *
 * Printed Instant: Destroy this: The next card you play this turn with an
 * effect that deals arcane damage gains "When this deals arcane damage to a
 * hero, destroy a frozen card in their arsenal."
 */

describe("Conduit of Frostburn (UPR125) AAA", () => {
  it("happy: the next arcane ping destroys a frozen arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        arms: [conduitOfFrostburn],
        hand: [icebindRed, weaveIceRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(icebindRed, { fuse: true, fuseCards: [weaveIceRed], target: Dash.id });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, snatchRed).toBeFrozen();
    Iyslander.activate(conduitOfFrostburn);
    game.untilIdle({ ordering: "listed" });
    Iyslander.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabCard(Iyslander, conduitOfFrostburn).toBeIn("graveyard");
  });

  it("boundary: without a frozen arsenal card the ping still deals arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        arms: [conduitOfFrostburn],
        hand: [volticBoltRed, weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.activate(conduitOfFrostburn);
    game.untilIdle({ ordering: "listed" });
    Iyslander.play(volticBoltRed, { pitch: [weaveIceRed], target: game.as(dash).id });
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Iyslander, conduitOfFrostburn).toBeIn("graveyard");
  });

  it("timing: the grant is this-turn only", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        arms: [conduitOfFrostburn],
        hand: [volticBoltRed, weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.activate(conduitOfFrostburn);
    game.untilIdle({ ordering: "listed" });
    Iyslander.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Iyslander, conduitOfFrostburn).toBeIn("graveyard");
    expectFabCard(game.as(dash), snatchRed).toBeIn("arsenal");
  });
});
