import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { veilingBreeze } from "./veiling-breeze.ts";
import { favorableWinds } from "./favorable-winds.ts";
import { fireball } from "./fireball.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers KoF3AMSlUe-a1 */
describe("Veiling Breeze reduces each damage instance by the chosen wind reveal count", () => {
  for (const revealed of [0, 1, 3])
    for (const expired of [false, true])
      it(`reveal=${revealed}, expired=${expired}`, () => {
        const champion = createClassBonusTestChampion(veilingBreeze, false, "activation-discount"),
          opponent = createClassBonusTestChampion(fireball, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: expired ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [veilingBreeze, woodlandSquirrels],
                memory: [favorableWinds, favorableWinds, favorableWinds, woodlandSquirrels],
                graveyard: [favorableWinds],
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                memory: [favorableWinds],
                field: [giantTortoise, woodlandSquirrels, blitzMage],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          other = p.card(giantTortoise);
        if (!expired) q.pass();
        const before = game.state;
        expect(() => p.activate(veilingBreeze)).toThrow();
        expect(game.state).toEqual(before);
        p.activate(veilingBreeze, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
        const choosing = game.state;
        for (const bad of [
          p.cards(woodlandSquirrels, { zone: "memory" })[0]!,
          p.card(favorableWinds, { zone: "graveyard" }),
          q.card(favorableWinds, { zone: "memory" }),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
          expect(game.state).toEqual(choosing);
        }
        const selected = p
            .cards(favorableWinds, { zone: "memory" })
            .slice(0, revealed)
            .map((c) => c.objectId),
          memory = p.zone("memory");
        answerDecision(game, "resolve-effect-choice", selected);
        passEffectsStack(game);
        expect(
          game.state.eventHistory
            .filter((e) => e.type === "card-revealed")
            .map((e) => e.objectId)
            .sort(),
        ).toEqual([...selected].sort());
        expect(p.zone("memory")).toEqual(memory);
        if (expired) advanceToMain(game, q.id);
        else {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        }
        q.declareAttack(giantTortoise, other);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[other.objectId]!.damage).toBe(1);
        q.declareAttack(blitzMage, hero);
        game.resolveCombatWithoutRetaliation();
        const prevention = expired ? 0 : revealed;
        expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, 3 - prevention));
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          Math.max(0, 3 - prevention) + Math.max(0, 1 - prevention),
        );
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          Math.max(0, 3 - prevention) + 2 * Math.max(0, 1 - prevention),
        );
        expect(q.zone("memory")).toHaveLength(expired ? 2 : 3);
      });
});
