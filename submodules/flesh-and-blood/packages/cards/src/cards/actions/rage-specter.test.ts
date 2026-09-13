import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigmaNewMoon } from "../heroes/enigma-new-moon.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { rageSpecterBlue } from "./rage-specter.ts";

describe("Rage Specter (MST132) AAA", () => {
  it("happy: entering with no other Illusionist aura refunds 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        hand: [rageSpecterBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    Enigma.play(rageSpecterBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, rageSpecterBlue).toBeIn("arena");
    expect(Enigma.actionPoints()).toBe(1);
  });

  it("boundary: entering while another Illusionist aura is already seated does not refund AP", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        arena: [spectralShield],
        hand: [rageSpecterBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    Enigma.play(rageSpecterBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, rageSpecterBlue).toBeIn("arena");
    expect(Enigma.actionPoints()).toBe(0);
  });

  it("timing: during your turn this has ward 6", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        hand: [rageSpecterBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    Enigma.play(rageSpecterBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, rageSpecterBlue).toHaveKeyword("ward");
    expectFabPlayer(Enigma).toHaveAP(1);
  });
});
