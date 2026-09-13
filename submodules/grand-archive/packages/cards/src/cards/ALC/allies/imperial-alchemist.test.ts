import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { blightroot } from "../tokens/blightroot.ts";

import { proveGather } from "../../../testing/gather.ts";
import { imperialAlchemist } from "./imperial-alchemist.ts";

/** @covers ve1d47o7ea-a1 */
describe("Imperial Alchemist — On Enter Gather", () => {
  proveGather({ card: imperialAlchemist, reserveCost: 2, classBonus: true });
});

/** @covers ve1d47o7ea-a2 */
describe("Imperial Alchemist — each controlled Potion brew", () => {
  for (const classBonus of [false, true]) {
    for (const brewerId of ["player-one", "player-two"] as const) {
      for (const brew of [false, true]) {
        it(`Class Bonus=${classBonus}, brewer=${brewerId}, uses Brew=${brew}`, () => {
          const champion = createClassBonusTestChampion(
            imperialAlchemist,
            classBonus,
            "activation-discount",
          );
          const zones = {
            field: [imperialAlchemist, woodlandSquirrels, fraysia, fraysia, blightroot, blightroot],
            hand: [
              potionOfHealing,
              potionOfHealing,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
          };
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: brewerId === "player-one" ? "playerOne" : "playerTwo",
            playerOne: { champion, zones },
            playerTwo: { champion, zones },
          });
          const brewer = game.player(brewerId);
          const opponent = game.player(brewerId === "player-one" ? "player-two" : "player-one");
          const alchemist = brewer.card(imperialAlchemist);
          const otherAlchemist = opponent.card(imperialAlchemist);
          const buff = () => game.state.objects[alchemist.objectId]!.counters.buff ?? 0;
          for (let index = 0; index < 2; index++) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== brewer.id)
              game.player(wait.playerId).pass();
            const potion = brewer.cards(potionOfHealing, { zone: "hand" })[0]!;
            if (brew)
              brewer.activate(potion, {
                activationMethod: "brew",
                brewIngredientIds: [
                  brewer.cards(fraysia)[0]!.objectId,
                  brewer.cards(blightroot)[0]!.objectId,
                ],
              });
            else
              brewer.activate(potion, {
                reservePayment: brewer
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 3)
                  .map((ref) => ({ kind: "card", cardId: ref.objectId })),
              });
            expect(buff()).toBe(brew ? index : 0);
            expect(
              game.state.stack.filter(
                (item) => item.kind === "triggered-ability" && item.ability.id === "ve1d47o7ea-a2",
              ),
            ).toHaveLength(brew ? 1 : 0);
            if (brew) {
              brewer.pass();
              opponent.pass();
              expect(buff()).toBe(index + 1);
              // The brew trigger resolves above the Potion's activation.
              expect(brewer.cards(potionOfHealing, { zone: "field" })).toHaveLength(index);
            }
            passEffectsStack(game);
            expect(brewer.cards(potionOfHealing, { zone: "field" })).toHaveLength(index + 1);
            expect(buff()).toBe(brew ? index + 1 : 0);
            expect(game.state.objects[otherAlchemist.objectId]!.counters.buff ?? 0).toBe(0);
            expect(
              game.state.objects[brewer.card(woodlandSquirrels, { zone: "field" }).objectId]!
                .counters.buff ?? 0,
            ).toBe(0);
          }
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== brewer.id)
            game.player(wait.playerId).pass();
          const target = opponent.card(champion);
          brewer.declareAttack(alchemist, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(brew ? 3 : 1);
        });
      }
    }
  }
});
