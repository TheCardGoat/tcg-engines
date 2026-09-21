import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { soutirerVortex } from "./soutirer-vortex.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { backdash } from "../actions/backdash.ts";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers du4df43ci2-a1 */
describe("Soutirer Vortex — distinct owned omen reserve costs", () => {
  for (const costs of [[], [0], [0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 2, 2]] as const)
    for (const opponent of [false, true])
      it(`${costs.join(",") || "no"} costs in ${opponent ? "opposing" : "own"} omens`, () => {
        const champion = createClassBonusTestChampion(soutirerVortex, false, "activation-discount");
        const definitions = [woodlandSquirrels, backdash, twoOfHearts];
        const omens = costs.map((cost) => definitions[cost]!);
        const setup = (owner: boolean) => ({
          champion,
          zones: {
            field: Array.from({ length: owner ? costs.length : 0 }, () => condemnedTrinket),
            hand: [
              soutirerVortex,
              ...Array.from({ length: costs.length * 3 + 6 }, () => woodlandSquirrels),
            ],
            graveyard: [...(owner ? omens : []), giantTortoise],
            banishment: [woodlandSquirrels, backdash, twoOfHearts],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        });
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opponent ? "playerTwo" : "playerOne",
          playerOne: setup(!opponent),
          playerTwo: setup(opponent),
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const maker = opponent ? q : p;
        for (const definition of omens) {
          const card = maker.cards(definition, { zone: "graveyard" })[0]!;
          maker.activateAbility(
            maker.cards(condemnedTrinket, { zone: "field" })[0]!,
            "21oy1nd4nw-a1",
            {
              reservePayment: maker
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 3)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            },
          );
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [card.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[card.objectId]).toMatchObject({
            zone: "banishment",
            counters: { omen: 1 },
          });
        }
        if (opponent) advanceToMain(game, p.id);
        const expected = !opponent && new Set(costs).size >= 3 ? 3 : 6;
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, expected)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const source = p.card(soutirerVortex, { zone: "hand" });
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        const memory = p.zone("memory").length;
        p.activate(source, { reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(memory + expected);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      });
});

/** @covers du4df43ci2-a2 */
describe("Soutirer Vortex — independently triggered omens", () => {
  for (const count of [1, 2])
    for (const cost of [0, 1, 2])
      for (const active of [false, true])
        it(`${count} cost-one omens against cost ${cost}, source ${active ? "on field" : "in graveyard"}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(soutirerVortex, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  ...(active ? [soutirerVortex] : []),
                  ...Array.from({ length: count }, () => condemnedTrinket),
                  ...Array.from({ length: 3 }, () => enfeebledDagger),
                ],
                hand: [backdash, ...Array.from({ length: count * 3 + 3 }, () => woodlandSquirrels)],
                graveyard: [
                  ...(active ? [] : [soutirerVortex]),
                  ...Array.from({ length: count }, () => backdash),
                  giantTortoise,
                ],
                banishment: [backdash],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [enfeebledDagger],
                hand: [
                  backdash,
                  twoOfHearts,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const hero = p.card(champion),
            enemy = q.card(champion);
          for (let n = 0; n < count; n++) {
            const card = p.cards(backdash, { zone: "graveyard" })[0]!;
            p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 3)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            passEffectsStack(game);
            answerDecision(game, "resolve-effect-choice", [card.objectId]);
            passEffectsStack(game);
          }
          for (const dagger of p.cards(enfeebledDagger, { zone: "field" })) {
            p.activateAbility(dagger, "idpdon8f0h-a1", {
              targets: { "target-unit": [hero.objectId] },
            });
            passEffectsStack(game);
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(3);
          // Its controller's matching card does not trigger any omen.
          p.activate(p.card(backdash, { zone: "hand" }), {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(3);
          expect(game.state.objects[enemy.objectId]!.damage).toBe(0);
          advanceToMain(game, q.id);
          // An activated ability is not a card activation.
          q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
            targets: { "target-unit": [hero.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(4);
          expect(game.state.objects[enemy.objectId]!.damage).toBe(0);
          const definition = [woodlandSquirrels, backdash, twoOfHearts][cost]!;
          const card = q.cards(definition, { zone: "hand" })[0]!;
          const payment = q
            .cards(woodlandSquirrels, { zone: "hand" })
            .filter((c) => c.objectId !== card.objectId)
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          q.activate(card, {
            reservePayment: payment,
            ...(cost === 1 ? { targets: { "target-1": [enemy.objectId] } } : {}),
          });
          expect(game.state.objects[hero.objectId]!.damage).toBe(4);
          if (active && cost === 1 && count === 2) {
            expect(game.state.decision?.kind).toBe("order-triggered-abilities");
            const decision = game.state.decision;
            if (decision?.kind !== "order-triggered-abilities")
              throw new Error("Expected both omen triggers");
            expect(decision.playerId).toBe(p.id);
            expect(decision.pendingTriggerIds).toHaveLength(2);
            answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
          }
          passEffectsStack(game);
          const hits = active && cost === 1 ? count : 0;
          expect(game.state.objects[hero.objectId]!.damage).toBe(4 - hits);
          expect(game.state.objects[enemy.objectId]!.damage).toBe(hits);
          expect(game.state.objects[card.objectId]!.zone).toBe(cost === 1 ? "graveyard" : "field");
        });
});
