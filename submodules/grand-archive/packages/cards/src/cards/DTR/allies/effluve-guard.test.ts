import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { effluveGuard } from "./effluve-guard.ts";
import { vacuousServant } from "../tokens/vacuous-servant.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 5tz8bwcoel-a1 */
describe("Effluve Guard — Ciel omen grants Vigor to controlled Vacuous Servants", () => {
  for (const ciel of [false, true])
    for (const location of ["omen", "banishment", "field", "graveyard"] as const)
      it(`wakes only the named allies at the end phase: Ciel=${ciel}, source=${location}`, () => {
        const champion = createLineageTestChampion(effluveGuard, ciel ? "Ciel" : "Other");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                vacuousServant,
                woodlandSquirrels,
                condemnedTrinket,
                ...(location === "field" ? [effluveGuard] : []),
              ],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [
                woodlandSquirrels,
                ...(location === "omen" || location === "graveyard" ? [effluveGuard] : []),
              ],
              banishment: location === "banishment" ? [effluveGuard] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [vacuousServant], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(effluveGuard),
          servant = p.card(vacuousServant),
          other = p.card(woodlandSquirrels, { zone: "field" });
        if (location === "omen") {
          p.activateAbility(p.card(condemnedTrinket), "21oy1nd4nw-a1", {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [source.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[source.objectId]!.counters.omen).toBe(1);
        }
        for (const attacker of [servant, other]) {
          p.declareAttack(attacker, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
        }
        advanceToMain(game, q.id);
        expect(game.state.objects[servant.objectId]!.states.has("rested")).toBe(
          !(ciel && location === "omen"),
        );
        expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(true);
        const opposing = q.card(vacuousServant);
        q.declareAttack(opposing, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        advanceToMain(game, p.id);
        expect(game.state.objects[opposing.objectId]!.states.has("rested")).toBe(true);
      });
});
