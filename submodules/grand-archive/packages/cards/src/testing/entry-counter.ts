import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
export function proveEntryCounter(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: "buff" | "bulwark" | "named:sheen",
  amount: number,
) {
  for (const own of [false, true])
    for (const targetKind of counter === "named:sheen" ? ["ally", "champion"] : ["ally"])
      it(`entry adds ${amount} ${counter}: own=${own}, target=${targetKind}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Merlin", 0));
        const materialize = counter === "named:sheen";
        const game = GrandArchiveTestEngine.startFixture({
          phase: materialize ? "materialize" : "main",
          playerOne: {
            champion,
            ...(materialize ? { lineage: [lineageTestChampion("Merlin", 1)] } : {}),
            zones: {
              field: [giantTortoise, trainingSword, woodlandSquirrels],
              hand: [
                ...(materialize ? [] : [card]),
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "material-deck": materialize ? [card] : [],
              memory: materialize ? [woodlandSquirrels, woodlandSquirrels] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise, trainingSword, woodlandSquirrels],
              graveyard: [giantTortoise],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = (own ? p : q).card(targetKind === "ally" ? giantTortoise : champion, {
          zone: "field",
        });
        const untouched = (own ? q : p).card(targetKind === "ally" ? giantTortoise : champion, {
          zone: "field",
        });
        if (materialize) p.materialize(card);
        else
          p.activate(card, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
        passEffectsStack(game);
        expect(game.state.decision?.kind).toBe("announce-triggered-ability");
        for (const invalid of [
          p.card(trainingSword),
          q.card(giantTortoise, { zone: "graveyard" }),
          ...(!materialize ? [p.card(champion)] : []),
        ]) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.counters[counter]).toBe(amount);
        expect(game.state.objects[untouched.objectId]!.counters[counter] ?? 0).toBe(0);
        if (counter === "bulwark") {
          const attacker = own ? q : p;
          if (own) advanceToMain(game, q.id);
          attacker.declareAttack(attacker.card(giantTortoise, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.counters.bulwark ?? 0).toBe(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          attacker.declareAttack(attacker.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
        }
        if (counter === "buff") {
          const evalContext = {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          };
          expect(
            deriveGrandArchiveNumericProperty(
              game.state.objects[target.objectId]!,
              "power",
              evalContext,
            ),
          ).toBe(2);
          expect(
            deriveGrandArchiveNumericProperty(
              game.state.objects[target.objectId]!,
              "life",
              evalContext,
            ),
          ).toBe(7);
        }
      });
}
