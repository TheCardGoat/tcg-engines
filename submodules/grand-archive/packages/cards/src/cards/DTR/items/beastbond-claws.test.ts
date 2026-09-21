import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { beastbondClaws } from "./beastbond-claws.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../../DOA/allies/gray-wolf.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainedHawk } from "../../DOA/allies/trained-hawk.ts";
import { prodigiousBurstmage } from "../../DOA/allies/prodigious-burstmage.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers qmj9q5gmsp-a1 */
describe("Beastbond Claws — owned Animal or Beast protection", () => {
  for (const targetCard of [woodlandSquirrels, grayWolf])
    for (const expiry of [false, true])
      it(`${targetCard.slug}: banishment, Stealth, life and ${expiry ? "expiry" : "lethal boundary"}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(beastbondClaws, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [beastbondClaws, targetCard, prodigiousBurstmage],
              graveyard: [targetCard],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise, trainedHawk, grayWolf],
              hand: [fireball, fireball, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(beastbondClaws),
          target = p.card(targetCard, { zone: "field" });
        q.pass();
        for (const invalid of [
          p.card(champion),
          source,
          p.card(prodigiousBurstmage),
          p.card(targetCard, { zone: "graveyard" }),
          q.card(grayWolf),
        ]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "qmj9q5gmsp-a1", {
              targets: { "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "qmj9q5gmsp-a1", { targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        const life = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const baseLife = targetCard === woodlandSquirrels ? 1 : 2;
        expect(life()).toBe(baseLife);
        passEffectsStack(game);
        expect(life()).toBe(baseLife + 2);
        const before = game.state;
        expect(() => q.declareAttack(q.card(giantTortoise), target)).toThrow();
        expect(game.state).toEqual(before);
        q.declareAttack(q.card(trainedHawk), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
        if (expiry) {
          advanceToMain(game, p.id);
          expect(life()).toBe(baseLife);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          advanceToMain(game, q.id);
          q.declareAttack(q.card(giantTortoise), target);
          game.resolveCombatWithoutRetaliation();
          if (targetCard === grayWolf) {
            expect(game.state.objects[target.objectId]!.zone).toBe("field");
            q.declareAttack(q.card(trainedHawk), target);
            game.resolveCombatWithoutRetaliation();
          }
        } else {
          for (let damage = 3; damage <= baseLife + 2; damage++) {
            q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
              targets: { "target-1": [target.objectId] },
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            });
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.zone).toBe(
              damage === baseLife + 2 ? "graveyard" : "field",
            );
          }
        }
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      });
});
