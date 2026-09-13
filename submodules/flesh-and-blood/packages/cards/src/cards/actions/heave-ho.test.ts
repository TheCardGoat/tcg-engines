import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { heaveHoBlue } from "./heave-ho.ts";

/**
 * Heave Ho (SEA057) — Pirate Necromancer Action, cost 0, go again.
 *
 * Printed: Your next Pirate ally attack this turn gets overpower and "When
 * this hits a hero, create a Gold token." Go again
 */

describe("Heave Ho (SEA057) AAA", () => {
  it("happy: the next Pirate ally attack has overpower and creates Gold on a hero hit", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [heaveHoBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(heaveHoBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Gravy).toHaveAP(1);

    Gravy.activate(oystenHeartOfGoldYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabToken(game, "gold").toHaveCount(1);
  });

  it("boundary: a non-ally attack gets neither overpower nor the Gold hit trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [heaveHoBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(heaveHoBlue);
    game.helpers.resolveUntilIdle();

    Gravy.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).notToHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("timing: Gold is created only after the ally hits; a full block creates none", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [heaveHoBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(heaveHoBlue);
    game.helpers.resolveUntilIdle();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("overpower");
    expectFabToken(game, "gold").toHaveCount(0);

    Dash.defendWith(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabToken(game, "gold").toHaveCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });
});
