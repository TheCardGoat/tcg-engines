import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { clarentSwordOfPeace } from "./clarent-sword-of-peace.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { fireball } from "../actions/fireball.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers m31WVJ9F04-a1 */
describe("Clarent spends durability on separate one-damage non-combat buffers", () => {
  for (const classBonus of [false, true])
    for (const expired of [false, true])
      it(`class=${classBonus}, expired=${expired}`, () => {
        const champion = createClassBonusTestChampion(
            clarentSwordOfPeace,
            classBonus,
            "activation-discount",
          ),
          opponent = createClassBonusTestChampion(fireball, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: expired ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [clarentSwordOfPeace, giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                hand: [
                  ...Array.from({ length: 5 }, () => fireball),
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                field: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          ally = p.card(giantTortoise),
          foe = q.card(opponent),
          sword = p.card(clarentSwordOfPeace);
        if (!expired) q.pass();
        if (!classBonus) {
          const before = game.state;
          expect(() => p.activateAbility(sword, "m31WVJ9F04-a1")).toThrow();
          expect(game.state).toEqual(before);
          expect(game.state.objects[sword.objectId]!.counters.durability).toBe(2);
          return;
        }
        p.activateAbility(sword, "m31WVJ9F04-a1");
        expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1);
        passEffectsStack(game);
        if (expired) advanceToMain(game, q.id);
        else {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        }
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), ally);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        const targets = [foe, hero, ally, hero, ally];
        for (let index = 0; index < targets.length; index++) {
          const target = targets[index]!;
          q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          if (index === 0) expect(game.state.objects[foe.objectId]!.damage).toBe(1);
          if (index === 1) expect(game.state.objects[hero.objectId]!.damage).toBe(expired ? 1 : 0);
          if (index === 2) expect(game.state.objects[ally.objectId]!.damage).toBe(expired ? 2 : 1);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(expired ? 2 : 1);
        expect(game.state.objects[ally.objectId]!.damage).toBe(expired ? 3 : 2);
        expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1);
      });
});
