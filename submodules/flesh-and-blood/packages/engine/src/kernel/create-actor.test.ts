import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "../testing/index.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { ragingOnslaughtRed } from "../../../cards/src/cards/actions/raging-onslaught.ts";
import { commandAndConquerRed } from "../../../cards/src/cards/actions/command-and-conquer.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { trounceRed } from "../../../cards/src/cards/blocks/trounce.ts";

// Kernel receipt contract only: independent identities must survive commitment.
// This does not claim additional Trounce card or Comprehensive Rules coverage.
describe("create event identity contract", () => {
  it("keeps the winning creator distinct from the opposing effect controller", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ragingOnslaughtRed],
        resourcePoints: 3,
        deck: [nimblismBlue, ragingOnslaughtRed, commandAndConquerRed],
      },
      { hero: bravo, hand: [trounceRed], deck: [nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    Dash.playAttack(ragingOnslaughtRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle();
    const creations = game.committedEvents().filter((event) => event.name === "create");
    expect(creations).toHaveLength(3);
    for (const event of creations) {
      expect(event.actorId).toBe(Dash.id);
      expect(event.data.object.ownerId).toBe(Dash.id);
      expect(event.data.object.controllerId).toBe(Dash.id);
      expect(event.cause).toMatchObject({ kind: "layer", controllerId: Bravo.id });
    }
  });
});
