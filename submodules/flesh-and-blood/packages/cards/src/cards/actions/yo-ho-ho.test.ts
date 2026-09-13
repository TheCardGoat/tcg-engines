import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { yoHoHoBlue } from "./yo-ho-ho.ts";

/**
 * Yo Ho Ho (SEA058) — Pirate Necromancer Action, cost 0, go again.
 *
 * Printed: Your next Pirate ally attack this turn gets +1{p} and "When this
 * hits a hero, create a Gold token." Go again
 */

describe("Yo Ho Ho (SEA058) AAA", () => {
  it("happy: the next Pirate ally attack gets +1{p} and creates Gold on a hero hit", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [yoHoHoBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(yoHoHoBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Gravy).toHaveAP(1);

    Gravy.activate(oystenHeartOfGoldYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabToken(game, "gold").toHaveCount(1);
  });

  it("boundary: a non-ally attack gets no +1{p} and creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [yoHoHoBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(yoHoHoBlue);
    game.helpers.resolveUntilIdle();

    Gravy.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("timing: Gold is created only after the ally hits; a full block creates none", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [yoHoHoBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);
    const blocks = Dash.cardsIn("hand", nimblismBlue);

    Gravy.play(yoHoHoBlue);
    game.helpers.resolveUntilIdle();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    expectFabToken(game, "gold").toHaveCount(0);

    Dash.defendWith(blocks[0]!, blocks[1]!);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabToken(game, "gold").toHaveCount(0);
    expect(Dash.cardsIn("graveyard", nimblismBlue)).toHaveLength(2);
  });
});
