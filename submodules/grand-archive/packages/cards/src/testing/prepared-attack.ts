import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { intangibleGeist } from "../cards/DOA/allies/intangible-geist.ts";
import { acceptedContract } from "../cards/DOA/actions/accepted-contract.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack } from "./decisions.ts";
export function provePreparedAttack({
  card,
  cost,
  power,
  bonusPower = 0,
  wake = false,
  returnToHand = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  power: number;
  bonusPower?: number;
  wake?: boolean;
  returnToHand?: boolean;
}): void {
  for (const classBonus of [false, true])
    for (const mode of ["prepared", "declined", "missing"] as const)
      for (const hit of wake ? [false, true] : [true])
        it(`${mode}, class=${classBonus}, hit=${hit}`, () => {
          const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
            opponent = createClassBonusTestChampion(intangibleGeist, true, "activation-discount"),
            setupCost = mode === "missing" ? 0 : 5;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  ...(setupCost ? [acceptedContract] : []),
                  ...Array.from({ length: cost + setupCost }, () => woodlandSquirrels),
                ],
                field: [trainingSword],
              },
            },
            playerTwo: { champion: opponent, zones: { field: hit ? [] : [intangibleGeist] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            attacker = p.card(champion),
            attack = p.card(card),
            target = q.card(hit ? opponent : intangibleGeist);
          if (setupCost) {
            p.activate(acceptedContract, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 5)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            passEffectsStack(game);
            expect(game.state.objects[attacker.objectId]!.counters.preparation).toBe(3);
          }
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (mode === "missing") {
            const before = game.state;
            expect(() =>
              p.activate(attack, {
                reservePayment: payment,
                attackAttackerId: attacker.objectId,
                prepareAbilityIndexes: [0],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(attack, {
            reservePayment: payment,
            attackAttackerId: attacker.objectId,
            ...(mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {}),
          });
          expect(game.state.objects[attacker.objectId]!.counters.preparation ?? 0).toBe(
            mode === "prepared" ? 2 : mode === "declined" ? 3 : 0,
          );
          passEffectsStack(game);
          declareResolvedAttack(
            game,
            attacker.objectId,
            target.objectId,
            "Declare prepared attack",
          );
          game.resolveCombatWithoutRetaliation();
          const enabled = classBonus && mode === "prepared";
          expect(game.state.objects[target.objectId]!.damage).toBe(
            hit ? power + (enabled ? bonusPower : 0) : 0,
          );
          const wakes = enabled && hit && wake;
          expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(!wakes);
          expect(game.state.objects[attack.objectId]!.zone).toBe(
            enabled && hit && returnToHand ? "hand" : "graveyard",
          );
          if (wake) {
            const options = { weaponIds: [p.card(trainingSword).objectId] };
            if (wakes) {
              p.declareAttack(attacker, q.card(opponent), options);
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(power + 1);
            } else {
              const before = game.state;
              expect(() => p.declareAttack(attacker, q.card(opponent), options)).toThrow();
              expect(game.state).toEqual(before);
            }
          }
        });
}
