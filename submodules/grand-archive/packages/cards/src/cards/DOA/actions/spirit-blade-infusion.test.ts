import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { spiritBladeInfusion } from "./spirit-blade-infusion.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { fireball } from "./fireball.ts";
/** @covers CgyJxpEgzk-a1 */
describe("Infusion discounts only after its own champion dealt combat damage in this turn", () => {
  for (const cause of ["none", "ally", "champion", "opponent", "noncombat", "expired"] as const)
    it(`damage=${cause}`, () => {
      const base = grantTestChampionLevel(
          createClassBonusTestChampion(spiritBladeInfusion, false, "activation-discount"),
          1,
        ),
        champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), elements: ["CRUX" as const, "FIRE" as const] },
          },
        },
        game = GrandArchiveTestEngine.startFixture({
          firstPlayer: cause === "opponent" ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              hand: [
                spiritBladeInfusion,
                fireball,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
              field: [trainingSword, woodlandSquirrels],
              "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trainingSword],
              "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(champion),
        sword = p.card(trainingSword),
        pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (cause === "ally") {
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), foe);
        game.resolveCombatWithoutRetaliation();
      } else if (cause === "champion" || cause === "expired") {
        p.declareAttack(hero, foe, { weaponIds: [sword.objectId] });
        game.resolveCombatWithoutRetaliation();
        if (cause === "expired") {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
        }
      } else if (cause === "opponent") {
        q.declareAttack(foe, hero, { weaponIds: [q.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        q.pass();
      } else if (cause === "noncombat") {
        p.activate(fireball, { reservePayment: pay(4), targets: { "target-1": [foe.objectId] } });
        passEffectsStack(game);
      }
      const discounted = cause === "champion",
        before = game.state;
      expect(() =>
        p.activate(spiritBladeInfusion, {
          reservePayment: pay(1),
          targets: { "target-1": [sword.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(spiritBladeInfusion, {
        reservePayment: pay(discounted ? 0 : 2),
        targets: { "target-1": [sword.objectId] },
      });
      expect(p.zone("memory")).toHaveLength((cause === "noncombat" ? 4 : 0) + (discounted ? 0 : 2));
      passEffectsStack(game);
      expect(p.card(spiritBladeInfusion, { zone: "graveyard" })).toBeDefined();
    });
});
/** @covers CgyJxpEgzk-a2 */
describe("Infusion strengthens either player's Sword and gives its controller only a champion-hit draw", () => {
  for (const own of [false, true])
    for (const championHit of [false, true])
      it(`own sword=${own}, hits champion=${championHit}`, () => {
        const champion = createClassBonusTestChampion(
            spiritBladeInfusion,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [spiritBladeInfusion, woodlandSquirrels, woodlandSquirrels],
                field: [trainingSword, curvedDagger, giantTortoise],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword, giantTortoise],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q,
          other = own ? q : p,
          sword = owner.card(trainingSword),
          target = other.card(championHit ? champion : giantTortoise),
          pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (!own) q.pass();
        const before = game.state;
        for (const bad of [p.card(curvedDagger), p.card(giantTortoise), p.card(champion)]) {
          expect(() =>
            p.activate(spiritBladeInfusion, {
              reservePayment: pay,
              targets: { "target-1": [bad.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(spiritBladeInfusion, {
          reservePayment: pay,
          targets: { "target-1": [sword.objectId] },
        });
        passEffectsStack(game);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== owner.id)
          game.player(wait.playerId).pass();
        const hand = owner.zone("hand").length,
          top = owner.zone("main-deck")[0]!;
        owner.declareAttack(owner.card(champion), target, { weaponIds: [sword.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(4);
        expect(owner.zone("hand")).toHaveLength(hand + (championHit ? 1 : 0));
        expect(game.state.objects[top.objectId]!.zone).toBe(championHit ? "hand" : "main-deck");
        expect(other.zone("hand")).toHaveLength(0);
        advanceToMain(game, other.id);
        advanceToMain(game, owner.id);
        const later = owner.zone("hand").length;
        owner.declareAttack(owner.card(champion), target, { weaponIds: [sword.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(owner.zone("hand")).toHaveLength(later);
        expect(game.state.objects[target.objectId]!.damage).toBe(championHit ? 5 : 1);
      });
});
