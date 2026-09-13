import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bloodfrenzyGloombladeRed } from "./bloodfrenzy-gloomblade.ts";

/**
 * Bloodfrenzy Gloomblade, Red — Shadow Runeblade Action - Attack, cost 1, 3{p},
 * 3{d}. Usurp, Blood Debt.
 *
 * Printed: "You may play this from your banished zone. Usurp. If you've dealt
 * damage to the defending hero this turn, this gets go again. Blood Debt"
 */

describe("Bloodfrenzy Gloomblade AAA", () => {
  it("happy: after dealing damage this turn the gloomblade has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snatchRed, bloodfrenzyGloombladeRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);

    Viserai.playAttack(bloodfrenzyGloombladeRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("go-again").toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("happy: an unblocked first hit this turn still grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [bloodfrenzyGloombladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(bloodfrenzyGloombladeRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("go-again").toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a miss with no damage dealt this turn does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [bloodfrenzyGloombladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(bloodfrenzyGloombladeRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("go-again").toHaveAttackPower(3);
    Dash.defendWith(snatchRed, nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: the gloomblade may be played from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        banished: [bloodfrenzyGloombladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(bloodfrenzyGloombladeRed, { from: "banished" });
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Viserai, bloodfrenzyGloombladeRed).toBeIn("graveyard");
  });
});
