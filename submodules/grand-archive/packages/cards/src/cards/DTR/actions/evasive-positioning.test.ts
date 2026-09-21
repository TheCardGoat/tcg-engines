import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { evasivePositioning } from "./evasive-positioning.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ddp7twycdq-a1 */
describe("Evasive Positioning — shared shield capacity and champion-only distant", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      for (const unused of [false, true])
        it(`${own ? "own" : "opposing"} ${ally ? "ally" : "champion"}, ${unused ? "unused expiry" : "capacity consumed"}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(evasivePositioning, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, trainingSword],
                graveyard: [giantTortoise],
                hand: [
                  evasivePositioning,
                  ...Array.from({ length: 4 }, () => fireball),
                  ...Array.from({ length: 18 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const target = owner.card(ally ? giantTortoise : champion, { zone: "field" });
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const invalid of [
            p.card(trainingSword),
            p.card(giantTortoise, { zone: "graveyard" }),
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(evasivePositioning, {
                targets: { "target-1": [invalid.objectId] },
                reservePayment: payment(1),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(evasivePositioning, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment(1),
          });
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(!ally);
          const burn = () => {
            p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
              targets: { "target-1": [target.objectId] },
              reservePayment: payment(4),
            });
            passEffectsStack(game);
          };
          if (!unused) {
            burn();
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            if (!own) {
              p.declareAttack(p.card(giantTortoise, { zone: "field" }), target);
              game.resolveCombatWithoutRetaliation();
            } else burn();
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            burn();
            expect(game.state.objects[target.objectId]!.damage).toBe(1);
          }
          advanceToMain(game, q.id);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(!ally && !own);
          q.pass();
          burn();
          expect(game.state.objects[target.objectId]!.damage).toBe(!unused && !ally ? 2 : 1);
          advanceToMain(game, p.id);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
        });
});
