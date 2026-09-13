import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heatedVengeance } from "../attacks/heated-vengeance.ts";
import { dragonsDawn } from "./dragons-dawn.ts";

/** @covers 9f92917r84-a1 */
describe("Dragon's Dawn — additional materialize cost", () => {
  it("banishes three fire cards from the graveyard and rejects a short payment", () => {
    const { starter } = classBonusLeveledChampion(dragonsDawn, true, 0);
    const fires = [heatedVengeance, heatedVengeance, heatedVengeance];
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [dragonsDawn],
          memory: [woodlandSquirrels],
          graveyard: [...fires, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const fireCards = player.cards(heatedVengeance, { zone: "graveyard" });
    const before = game.state;
    expect(() =>
      player.materialize(dragonsDawn, {
        costSelections: [fireCards.slice(0, 2).map((card) => card.objectId)],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.materialize(dragonsDawn, {
      costSelections: [fireCards.map((card) => card.objectId)],
    });
    player.pass();
    game.player("player-two").pass();
    expect(player.cards(dragonsDawn, { zone: "field" })).toHaveLength(1);
    expect(player.cards(heatedVengeance, { zone: "banishment" })).toHaveLength(3);
    expect(player.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
  });
});

/** @covers 9f92917r84-a2 */
describe("Dragon's Dawn — Class Bonus On Attack", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "pumps and draws on champion hit" : "does not trigger"} with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(dragonsDawn, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            field: [dragonsDawn],
            hand: [heatedVengeance],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      const target = game.player("player-two").card(starter, { zone: "field" });
      const weapon = player.card(dragonsDawn, { zone: "field" });
      const fire = player.card(heatedVengeance, { zone: "hand" });
      const deck = player.zone("main-deck");
      player.declareAttack(attacker, target, { weaponIds: [weapon.objectId] });
      advanceCombatToTrigger(game, "9f92917r84-a2");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "9f92917r84-a2",
        ),
      ).toBe(classBonus);
      passEffectsStack(game);
      if (classBonus) {
        if (game.state.decision?.kind === "resolve-optional-effect")
          answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice")
          answerDecision(game, "resolve-effect-choice", [fire.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[attacker.objectId]!.damage).toBe(2);
      }
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 4 : 2);
      expect(player.zone("hand")).toEqual(classBonus ? deck.slice(0, 1) : [fire]);
    });
  }
});
