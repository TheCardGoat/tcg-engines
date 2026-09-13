import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { bareFangsRed } from "./bare-fangs.ts";

describe("Bare Fangs (EVR008) AAA", () => {
  it("happy: discarding a 6+ {p} card this way grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareFangsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(bareFangsRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: discarding a sub-6 {p} card this way grants no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareFangsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          crackedBaubleYellow,
          crackedBaubleYellow,
          crackedBaubleYellow,
          crackedBaubleYellow,
          crackedBaubleYellow,
          crackedBaubleYellow,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(bareFangsRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
