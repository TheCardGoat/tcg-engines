import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spiritBladeRetribution } from "./spirit-blade-retribution.ts";
import { ralliedAdvance } from "../../DOA/attacks/rallied-advance.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { scepterOfFascination } from "../../P25/items/scepter-of-fascination.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers HtExn3OxIN-a3 */
describe("Spirit Blade: Retribution — all printed banishment types", () => {
  for (const matching of [false, true])
    for (const entry of [
      { name: "empty", cards: [], power: 0 },
      { name: "ally", cards: [giantTortoise], power: 1 },
      { name: "attack", cards: [ralliedAdvance], power: 1 },
      { name: "weapon", cards: [trainingSword], power: 1 },
      {
        name: "all",
        cards: [giantTortoise, ralliedAdvance, trainingSword, scepterOfFascination],
        power: 3,
      },
    ]) {
      it(`Lorraine=${matching}, banishment=${entry.name}`, () => {
        const champion = enableAllTestElements(
          createLineageTestChampion(spiritBladeRetribution, matching ? "Lorraine" : "Other"),
        );
        const excluded = [giantTortoise, ralliedAdvance, trainingSword];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              banishment: entry.cards,
              graveyard: excluded,
              hand: [
                spiritBladeRetribution,
                ...Array.from({ length: 10 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { banishment: excluded, "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion);
        p.activate(spiritBladeRetribution, {
          attackAttackerId: hero.objectId,
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        const decision = game.state.decision;
        if (decision?.kind !== "declare-resolved-attack")
          throw new Error("Expected attack declaration");
        p.executeLegal(
          (candidate) =>
            candidate.command.move === "answer-decision" &&
            typeof candidate.command.answer === "object" &&
            candidate.command.answer !== null &&
            "cleavePlayerId" in candidate.command.answer &&
            candidate.command.answer.cleavePlayerId === q.id,
          "Declare Retribution's cleave",
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(3 + (matching ? entry.power : 0));
        expect(p.cards(spiritBladeRetribution, { zone: "graveyard" })).toHaveLength(1);
      });
    }
});
