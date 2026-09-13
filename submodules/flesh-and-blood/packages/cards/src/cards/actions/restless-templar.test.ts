import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { ankaDragUnderYellow } from "./anka-drag-under.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { restlessTemplarRed } from "./restless-templar.ts";
import { snatchRed } from "./snatch.ts";

describe("Restless Templar (IAR) AAA", () => {
  it("happy: a controlled Decay Zombie dying creates a Gate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: malice, arena: [restlessTemplarRed, restlessMagisterRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);
    Dash.playAttack(snatchRed, { target: Malice.findCardInZone("arena", restlessMagisterRed) });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Malice).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: a non-Zombie ally dying does not create a Gate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: malice, arena: [restlessTemplarRed, ankaDragUnderYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);
    Dash.playAttack(snatchRed, { target: Malice.findCardInZone("arena", ankaDragUnderYellow) });
    Malice.defendWith([]);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Malice).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
