import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { exposeDarkness } from "./expose-darkness.ts";
import { corhaziCourier } from "../../DOA/allies/corhazi-courier.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 991ovfr8o0-a1 */
describe("Expose Darkness — conditional draw and temporary Stealth removal", () => {
  for (const own of [false, true])
    for (const kind of ["stealth", "ally", "champion"] as const)
      it(`targets ${own ? "own" : "opposing"} ${kind}, draws only once, and restores Stealth after the turn`, () => {
        const champion = createClassBonusTestChampion(exposeDarkness, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [corhaziCourier, giantTortoise, trainingSword],
              graveyard: [corhaziCourier],
              hand: [exposeDarkness, exposeDarkness, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [corhaziCourier, giantTortoise],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const owner = own ? p : q,
          attacker = own ? q : p;
        const target =
          kind === "stealth"
            ? owner.card(corhaziCourier, { zone: "field" })
            : kind === "ally"
              ? owner.card(giantTortoise)
              : owner.card(champion);
        const attackSource = attacker.card(giantTortoise);
        if (kind === "stealth") {
          const before = game.state;
          expect(() => attacker.declareAttack(attackSource, target)).toThrow();
          expect(game.state).toEqual(before);
        }
        if (own) q.pass();
        const top = p.zone("main-deck")[0]!;
        const actions = p.cards(exposeDarkness);
        for (const [index, action] of actions.entries()) {
          if (own && index) q.pass();
          const payment = [
            {
              kind: "card" as const,
              cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ];
          if (!index) {
            for (const invalid of [
              p.card(trainingSword),
              p.card(corhaziCourier, { zone: "graveyard" }),
            ]) {
              const before = game.state;
              expect(() =>
                p.activate(action, {
                  targets: { "target-1": [invalid.objectId] },
                  reservePayment: payment,
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
          }
          p.activate(action, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment,
          });
          if (!index) expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
          passEffectsStack(game);
          expect(p.zone("main-deck")).toHaveLength(kind === "stealth" ? 4 : 5);
        }
        attacker.declareAttack(attackSource, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        advanceToMain(game, owner.id);
        advanceToMain(game, attacker.id);
        if (kind === "stealth") {
          const before = game.state;
          expect(() => attacker.declareAttack(attackSource, target)).toThrow();
          expect(game.state).toEqual(before);
        } else {
          attacker.declareAttack(attackSource, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(kind === "champion" ? 2 : 1);
        }
      });
});
