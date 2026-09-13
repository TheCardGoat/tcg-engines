import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "./snatch.ts";
import { phantasmalSymbiosisYellow } from "./phantasmal-symbiosis.ts";

describe("Phantasmal Symbiosis (DYN215) AAA", () => {
  it("happy: when this attacks it opens a name-card decision", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalSymbiosisYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(phantasmalSymbiosisYellow, { stopAt: "on-attack" });

    expectWait(game).toHaveDecision("effect-resolution");
  });

  it("boundary: phantasm is on the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalSymbiosisYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(phantasmalSymbiosisYellow, { stopAt: "on-attack" });
    Prism.choose("Dash");
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveKeyword("phantasm");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: naming this attack grants Illusionist on the chain; naming Dash does not change the Mechanologist hero", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalSymbiosisYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(phantasmalSymbiosisYellow, { stopAt: "on-attack" });
    Prism.choose("Phantasmal Symbiosis");
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackSupertype("Illusionist");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Prism.id,
      cardName: "Phantasmal Symbiosis",
    });
    expectFabCard(game.as(dash), dash).notToHaveSupertype("Illusionist");
    expectFabCard(Prism, snatchRed).notToHaveSupertype("Illusionist");
  });
});
