import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spontaneousCombustion } from "./spontaneous-combustion.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers cQlxapCsxQ-a1 */
describe("Spontaneous Combustion requires an ally attacking your champion", () => {
  for (const victim of ["champion", "ally"] as const)
    for (const attackerKind of ["small-ally", "large-ally", "champion"] as const)
      it(`${attackerKind} attacks ${victim}`, () => {
        const champion = createClassBonusTestChampion(
            spontaneousCombustion,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  spontaneousCombustion,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                field: [giantTortoise],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise, woodlandSquirrels, trainingSword] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          target = victim === "champion" ? hero : p.card(giantTortoise),
          attacker =
            attackerKind === "champion"
              ? q.card(champion)
              : q.card(attackerKind === "small-ally" ? woodlandSquirrels : giantTortoise),
          pay = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        q.declareAttack(
          attacker,
          target,
          attackerKind === "champion" ? { weaponIds: [q.card(trainingSword).objectId] } : {},
        );
        q.pass();
        const attacking = game.state;
        if (victim !== "champion" || attackerKind === "champion") {
          expect(() =>
            p.activate(spontaneousCombustion, {
              reservePayment: pay,
              targets: { "target-1": [attacker.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(attacking);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          return;
        }
        const bystander = q.card(attackerKind === "small-ally" ? giantTortoise : woodlandSquirrels);
        expect(() =>
          p.activate(spontaneousCombustion, {
            reservePayment: pay,
            targets: { "target-1": [bystander.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(attacking);
        expect(() =>
          p.activate(spontaneousCombustion, {
            reservePayment: pay.slice(1),
            targets: { "target-1": [attacker.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(attacking);
        p.activate(spontaneousCombustion, {
          reservePayment: pay,
          targets: { "target-1": [attacker.objectId] },
        });
        expect(p.zone("memory")).toHaveLength(3);
        passEffectsStack(game);
        if (attackerKind === "small-ally") {
          expect(q.card(woodlandSquirrels, { zone: "graveyard" }).objectId).toBe(attacker.objectId);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.combat).toBeNull();
        } else {
          expect(game.state.objects[attacker.objectId]!.damage).toBe(4);
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          attackerKind === "small-ally" ? 0 : 1,
        );
      });
});
