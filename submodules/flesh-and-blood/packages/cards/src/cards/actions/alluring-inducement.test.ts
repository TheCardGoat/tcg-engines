import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { shiyanaDiamondGemini } from "../heroes/shiyana-diamond-gemini.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { alluringInducementYellow } from "./alluring-inducement.ts";

describe("Alluring Inducement (DTD215) AAA", () => {
  it("happy: when this attacks, it may become a revealed attack action card", () => {
    const game = FabTestEngine.start(
      {
        hero: shiyanaDiamondGemini,
        hand: [alluringInducementYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Shiyana = game.as(shiyanaDiamondGemini);

    Shiyana.playAttack(alluringInducementYellow, { stopAt: "on-attack" });
    Shiyana.accept();
    Shiyana.target(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: declining the copy leaves this at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: shiyanaDiamondGemini,
        hand: [alluringInducementYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Shiyana = game.as(shiyanaDiamondGemini);

    Shiyana.playAttack(alluringInducementYellow, { stopAt: "on-attack" });
    Shiyana.decline();
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: Unity creates Eloquence when this defends together with a card from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: shiyanaDiamondGemini,
        hand: [alluringInducementYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Shiyana = game.as(shiyanaDiamondGemini);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Shiyana.defendWith(alluringInducementYellow, nimblismBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Shiyana).toHaveTokenCount("eloquence", 1);
  });
});
