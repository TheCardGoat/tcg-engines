import { describe } from "vitest";
import { potionInfusionAnimate } from "./potion-infusion-animate.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers nDYInWoAnw-a1 */
describe("potionInfusionAnimate — named champion discount", () => {
  proveChampionActivationDiscount({
    card: potionInfusionAnimate,
    discount: 2,
    lineageName: "Arisanna",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createLineageTestChampion,
  lineageTestChampion,
} from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers nDYInWoAnw-a2 */
describe("Potion Infusion Animate — Potion ally and death ability", () => {
  for (const matching of [false, true])
    it(`animates a non-regalia Potion and recovers on death, named champion=${matching}`, () => {
      const champion = enableAllTestElements(
          grantTestChampionLevel(
            createLineageTestChampion(potionInfusionAnimate, matching ? "Arisanna" : "Other"),
            3,
          ),
        ),
        opponent = lineageTestChampion("Opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [potionOfHealing, trainingSword, giantTortoise],
            hand: [
              potionInfusionAnimate,
              fireball,
              fireball,
              fireball,
              ...Array.from({ length: 16 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        potion = p.card(potionOfHealing),
        foe = q.card(opponent),
        spells = p.cards(fireball, { zone: "hand" });
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      p.activate(spells[0]!, { reservePayment: pay(4), targets: { "target-1": [hero.objectId] } });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(4);
      p.activate(spells[1]!, { reservePayment: pay(4), targets: { "target-1": [hero.objectId] } });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(8);
      const before = game.state;
      for (const ref of [p.card(trainingSword), p.card(giantTortoise), hero]) {
        expect(() =>
          p.activate(potionInfusionAnimate, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-potion": [ref.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(potionInfusionAnimate, {
        reservePayment: pay(matching ? 2 : 4),
        targets: { "target-potion": [potion.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[potion.objectId]!.states.has("rested")).toBe(true);
      expect(() => p.activateAbility(potion, "qtb31x97n2-a2")).toThrow();
      const turn = game.state.turn.number;
      advanceToMain(game, p.id, turn);
      p.declareAttack(potion, foe);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(3);
      p.activate(spells[2]!, {
        reservePayment: pay(4),
        targets: { "target-1": [potion.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[potion.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[hero.objectId]!.damage).toBe(3);
    });
});
