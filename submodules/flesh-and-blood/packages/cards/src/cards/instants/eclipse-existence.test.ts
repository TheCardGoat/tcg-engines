import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { snatchRed } from "../actions/snatch.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { eclipseExistenceBlue } from "./eclipse-existence.ts";

describe("Eclipse Existence (MON218) AAA", () => {
  it("happy: every attack that hits a Light hero this turn may consume soul and life", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [eclipseExistenceBlue, snatchRed, snatchRed],
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      {
        hero: boltyn,
        soul: [snatchRed, snatchRed],
        life: 30,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);
    const Boltyn = game.as(boltyn);

    Levia.play(eclipseExistenceBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Levia.playAttack(snatchRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    Levia.playAttack(snatchRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveLife(20);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expect(
      game
        .getView({ role: "player", actorId: Levia.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);
  });

  it("boundary: an unused until-end-of-turn trigger disappears at turn end", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [eclipseExistenceBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: boltyn, soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.play(eclipseExistenceBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(
      game
        .getView({ role: "player", actorId: Levia.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);

    Levia.endTurn();
    game.helpers.resolveUntilIdle();

    expect(
      game
        .getView({ role: "player", actorId: Levia.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
