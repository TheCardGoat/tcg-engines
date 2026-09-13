import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { fireball } from "../actions/fireball.ts";
import { demonsBargain } from "../../PRD/actions/demons-bargain.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { sparkFairy } from "./spark-fairy.ts";
import { spellshieldArcane } from "../actions/spellshield-arcane.ts";
/** @covers FWnxKjSeB1-a2 */
describe("Spark Fairy grants its target a controller-specific unpreventable recollection trigger", () => {
  for (const own of [false, true])
    for (const ending of ["death", "control"] as const)
      it(`own target=${own}, duration ends after ${ending}`, () => {
        const base = grantTestChampionLevel(
            createClassBonusTestChampion(fireball, true, "activation-discount"),
            1,
          ),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), elements: ["FIRE" as const, "ARCANE" as const] },
            },
          },
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  sparkFairy,
                  spellshieldArcane,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                field: [sparkFairy, giantTortoise, trainingSword],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [
                  spellshieldArcane,
                  fireball,
                  demonsBargain,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                field: [trainingSword, giantTortoise],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(sparkFairy, { zone: "hand" }),
          owner = own ? p : q,
          other = own ? q : p,
          target = owner.card(trainingSword),
          hero = owner.card(champion),
          otherHero = other.card(champion);
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        const before = game.state;
        for (const bad of [hero, otherHero]) {
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [bad.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        for (let i = 0; i < 128; i++) {
          if (
            game.state.stack.some(
              (item) =>
                item.kind === "triggered-ability" && item.ability.id === "granted-n2mtlo-a1",
            )
          )
            break;
          const wait = game.waitState();
          if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else throw new Error(`Unexpected ${wait.kind}`);
        }
        expect(game.state.turn.phase).toBe("recollection");
        expect(game.state.turn.playerId).toBe(owner.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        owner.activate(spellshieldArcane, {
          reservePayment: owner
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
        expect(game.state.objects[otherHero.objectId]!.damage).toBe(0);
        advanceToMain(game, owner.id);
        advanceToMain(game, other.id);
        advanceToMain(game, owner.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(2);
        if (own) advanceToMain(game, q.id);
        const pay = q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (ending === "death") {
          q.activate(fireball, { reservePayment: pay, targets: { "target-1": [source.objectId] } });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        } else {
          q.activate(demonsBargain, {
            reservePayment: pay,
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.controllerId).toBe(q.id);
        }
        expect(
          p
            .cards(sparkFairy, { zone: "field" })
            .filter((card) => game.state.objects[card.objectId]!.controllerId === p.id),
        ).toHaveLength(1);
        advanceToMain(game, p.id);
        advanceToMain(game, q.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(2);
        expect(game.state.objects[otherHero.objectId]!.damage).toBe(0);
        // This scenario advances several complete turns with overlapping Fairy
        // effects. Allow the same budget as engine scenarios during concurrent CI.
      }, 15_000);
});
