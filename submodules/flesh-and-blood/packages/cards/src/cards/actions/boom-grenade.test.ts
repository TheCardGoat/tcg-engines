import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { pulsewaveProtocolYellow } from "./pulsewave-protocol.ts";
import { boomGrenadeRed } from "./boom-grenade.ts";

describe("Boom Grenade: RED (EVO084) AAA", () => {
  it("happy: Mechanologist AAC hit destroys this and deals 4", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: boomGrenadeRed, state: { steamCounters: 1 } }],
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Bravo = game.as(bravo);

    Teklo.playAttack(pulsewaveProtocolYellow);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Teklo, boomGrenadeRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(10);
  });

  it("boundary: a non-Mechanologist hit does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: boomGrenadeRed, state: { steamCounters: 1 } }],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Bravo = game.as(bravo);

    Teklo.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Teklo, boomGrenadeRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: boomGrenadeRed, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, boomGrenadeRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, boomGrenadeRed).toBeIn("arena");
  });
});
