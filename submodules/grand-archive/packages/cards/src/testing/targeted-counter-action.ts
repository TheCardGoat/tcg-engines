import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { stockedOutpost } from "../cards/RDO/domains/stocked-outpost.ts";
import { oasisTradingPost } from "../cards/ALC/domains/oasis-trading-post.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveTargetedCounterAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: "buff" | "bulwark",
) {
  for (const owner of ["own", "opponent"])
    for (const domain of counter === "bulwark" ? [false, true] : [false])
      it(`adds and uses two ${counter} counters: target=${owner}, domain=${domain}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Counter target", 0));
        const field = [
          giantTortoise,
          stockedOutpost,
          oasisTradingPost,
          trainingSword,
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field,
              graveyard: [giantTortoise],
              hand: [
                card,
                card,
                sparkAlight,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field, "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          controller = owner === "own" ? p : q,
          opponent = owner === "own" ? q : p;
        const target = controller.card(domain ? stockedOutpost : giantTortoise, { zone: "field" });
        const cost = counter === "buff" ? 2 : 1;
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        for (let count = 1; count <= 2; count++) {
          const source = p.cards(card, { zone: "hand" })[0]!;
          const before = game.state;
          const invalid = [
            p.card(champion).objectId,
            p.card(trainingSword).objectId,
            p.card(oasisTradingPost).objectId,
            p.card(giantTortoise, { zone: "graveyard" }).objectId,
            ...(counter === "buff" ? [p.card(stockedOutpost).objectId] : []),
          ];
          for (const id of invalid) {
            expect(() =>
              p.activate(source, { reservePayment: pay(cost), targets: { "target-1": [id] } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, {
            reservePayment: pay(cost),
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(count - 1);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.counters[counter]).toBe(count);
        }
        if (counter === "buff") {
          const context = {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          };
          expect(
            deriveGrandArchiveNumericProperty(
              game.state.objects[target.objectId]!,
              "power",
              context,
            ),
          ).toBe(3);
          expect(
            deriveGrandArchiveNumericProperty(
              game.state.objects[target.objectId]!,
              "life",
              context,
            ),
          ).toBe(8);
          if (owner === "opponent") advanceToMain(game, q.id);
          controller.declareAttack(target, opponent.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(3);
          expect(game.state.objects[target.objectId]!.counters.buff).toBe(2);
        } else {
          if (!domain) {
            p.activate(sparkAlight, {
              reservePayment: pay(2),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(2);
            expect(game.state.objects[target.objectId]!.counters.bulwark).toBe(2);
          }
          if (owner === "own") advanceToMain(game, q.id);
          const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
          for (const [index, attacker] of attackers.entries()) {
            opponent.declareAttack(attacker, target);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[target.objectId]!.counters.bulwark ?? 0).toBe(
              Math.max(0, 1 - index),
            );
            if (domain)
              expect(game.state.objects[target.objectId]!.counters.durability).toBe(
                index < 2 ? 4 : 3,
              );
            else
              expect(game.state.objects[target.objectId]!.damage).toBe(
                (owner === "own" ? 0 : 2) + (index < 2 ? 0 : 1),
              );
          }
        }
      });
}
