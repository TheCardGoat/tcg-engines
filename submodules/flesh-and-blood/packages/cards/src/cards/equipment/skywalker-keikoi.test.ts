import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigmaNewMoon } from "../heroes/enigma-new-moon.ts";
import { snatchRed } from "../actions/snatch.ts";
import { skywalkerKeikoi } from "./skywalker-keikoi.ts";

describe("Skywalker Keikoi (ENG006) AAA", () => {
  it("happy: destroy face-down legs to prevent 1 of Snatch", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigmaNewMoon,
        legs: [{ card: skywalkerKeikoi, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    game.as(dash).playAttack(snatchRed);
    Enigma.defendWith();
    game.as(dash).pass();
    Enigma.activate(skywalkerKeikoi);
    game.closeCombat();

    expectFabCard(Enigma, skywalkerKeikoi).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(17);
  });

  it("boundary: face-up legs cannot activate the Instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigmaNewMoon,
        legs: [{ card: skywalkerKeikoi, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    game.as(dash).playAttack(snatchRed);
    Enigma.defendWith();
    game.as(dash).pass();
    Enigma.expectActivationRejected(skywalkerKeikoi);
    game.closeCombat();

    expectFabCard(Enigma, skywalkerKeikoi).toBeIn("legs");
    expectFabPlayer(Enigma).toHaveLife(16);
  });
});
