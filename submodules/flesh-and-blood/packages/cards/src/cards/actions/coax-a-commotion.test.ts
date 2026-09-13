import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { viserai } from "../heroes/viserai.ts";
import { reapingBlade } from "../weapons/reaping-blade.ts";
import { nimblismBlue } from "./nimblism.ts";
import { coaxACommotionRed } from "./coax-a-commotion.ts";

const coaxModeId = (modeId: string): string =>
  `${coaxACommotionRed.canonicalId}:whenHitsChooseAnyNumberEachHeroCreatesQuicken:${modeId}`;

function chooseHitModes(
  game: FabTestEngine,
  actor: ReturnType<FabTestEngine["as"]>,
  modeIds: string[],
): void {
  for (let step = 0; step < 24; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      actor.chooseOptions(...modeIds);
      return;
    }
    if (wait.kind === "defense-declaration") {
      game.as(bravo).defendWith();
      continue;
    }
    if (wait.kind === "priority") {
      game.pass(wait.playerId);
      continue;
    }
    break;
  }
}

describe("Coax a Commotion (CRU180) AAA", () => {
  it("happy: hit and each hero draws a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [coaxACommotionRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(coaxACommotionRed);
    expectCombat(game).toHaveAttackPower(4);
    chooseHitModes(game, Dash, [coaxModeId("eachHeroDraws")]);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(game.as(bravo)).toHaveHandCount(1);
    expectFabCard(Dash, coaxACommotionRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not run the hit modes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [coaxACommotionRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(coaxACommotionRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: choosing life and Quicken modes heals and creates tokens", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [coaxACommotionRed], actionPoints: 1, life: 18, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(coaxACommotionRed);
    chooseHitModes(game, Dash, [
      coaxModeId("eachHeroCreatesQuickenToken"),
      coaxModeId("eachHeroGains1"),
    ]);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabToken(game, "quicken").toHaveCount(2);
  });

  it("lets the lower-life hero gain while Reaping Blade stops only the highest-life hero", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        hand: [coaxACommotionRed],
        actionPoints: 1,
        life: 10,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Bravo = game.as(bravo);

    Viserai.playAttack(coaxACommotionRed);
    chooseHitModes(game, Viserai, [coaxModeId("eachHeroGains1")]);
    game.helpers.resolveUntilIdle();

    // Coax creates one gain event per hero. Reaping Blade prohibits only the
    // still-highest Bravo after combat damage (20 - 4), not Viserai's event.
    expectFabPlayer(Viserai).toHaveLife(11);
    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
