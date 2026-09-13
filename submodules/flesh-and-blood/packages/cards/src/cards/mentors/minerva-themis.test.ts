import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { anothos } from "../weapons/anothos.ts";
import { minervaThemis } from "./minerva-themis.ts";

/**
 * Minerva Themis (BOL002) — Warrior Mentor.
 * Printed: "While Minerva is face-down in your arsenal, at the start of your
 * turn, you may turn her face-up. 1H weapons you control have +1{p}.
 * Whenever a weapon you control hits, put a lesson counter on Minerva. Then
 * if there are 3 or more lesson counters on Minerva, banish her, search your
 * deck a specialization card, put it face-up into your arsenal, and shuffle."
 */
describe("Minerva Themis (BOL002) AAA", () => {
  it("happy: a face-up Minerva empowers the 1H weapon and takes a lesson counter on a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arsenal: [minervaThemis],
        weapon1: [cintariSaber],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 1, Dori);

    // Cintari Saber attacks at 2{p}; Minerva's static makes it 3{p}.
    Dori.activateAttack(cintariSaber);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Dori, minervaThemis).toHaveCounters(1, "lesson");
  });

  it("boundary: 2H weapons get no +1{p} from Minerva", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arsenal: [minervaThemis],
        weapon1: [anothos],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 3, Dori);

    Dori.activateAttack(anothos);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // The +1{p} is 1H-scoped, but a 2H weapon hit still teaches her.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Dori, minervaThemis).toHaveCounters(1, "lesson");
  });

  it("timing: the third lesson counter banishes Minerva", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arsenal: [{ card: minervaThemis, state: { namedCounters: { lesson: 2 } } }],
        weapon1: [cintariSaber],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 1, Dori);

    Dori.activateAttack(cintariSaber);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Dori.cardsIn("banished", minervaThemis)).toHaveLength(1);
  });
});
