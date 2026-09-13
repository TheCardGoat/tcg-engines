import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { fireball } from "../actions/fireball.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { corhaziCourier } from "./corhazi-courier.ts";
/** @covers YqQsXwEvv5-a2 */
for (const bonus of [false, true])
  for (const fire of [false, true])
    for (const hitAlly of [false, true])
      for (const drawn of [false, true])
        it(`Courier class=${bonus},fire discard=${fire},ally hit=${hitAlly},discard drawn=${drawn}`, () => {
          const champion = createClassBonusTestChampion(
              corhaziCourier,
              bonus,
              "activation-discount",
            ),
            discard = fire ? fireball : woodlandSquirrels,
            other = fire ? woodlandSquirrels : fireball;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [corhaziCourier, giantTortoise],
                hand: [drawn ? other : discard],
                "main-deck": [drawn ? discard : other, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise, trainingSword], hand: [discard] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            foe = q.card(champion),
            hit = hitAlly ? q.card(giantTortoise) : foe,
            chosen = p.card(giantTortoise),
            top = p.zone("main-deck")[0]!;
          p.declareAttack(corhaziCourier, hit);
          for (let step = 0; game.state.combat && step < 64; step++) {
            const d = game.state.decision,
              w = game.waitState();
            if (d?.kind === "resolve-effect-choice") break;
            if (d?.kind === "choose-retaliators") answerDecision(game, "choose-retaliators", []);
            else if (w.kind === "opportunity") game.player(w.playerId).pass();
            else throw new Error("Unexpected combat wait");
          }
          if (bonus) {
            expect(game.state.objects[top.objectId]!.zone).toBe("hand");
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [
                q.card(discard, { zone: "hand" }).objectId,
              ]),
            ).toThrow();
            expect(game.state).toEqual(before);
            const paid = p.card(discard, { zone: "hand" });
            answerDecision(game, "resolve-effect-choice", [paid.objectId]);
            passEffectsStack(game);
            expect(game.state.objects[paid.objectId]!.zone).toBe("graveyard");
            if (fire) {
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [q.card(trainingSword).objectId]),
              ).toThrow();
              answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
              passEffectsStack(game);
            }
          }
          if (game.state.combat) game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hit.objectId]!.damage).toBe(1);
          expect(game.state.objects[chosen.objectId]!.damage).toBe(bonus && fire ? 1 : 0);
          expect(p.zone("hand")).toHaveLength(1);
          expect(q.zone("hand")).toHaveLength(1);
          expect(p.zone("graveyard")).toHaveLength(bonus ? 1 : 0);
        });
