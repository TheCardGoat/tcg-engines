import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { scorchingTrap } from "./scorching-trap.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers wjbqjdmthh-a1
 * @covers wjbqjdmthh-a2
 */
describe("Scorching Trap — memory reaction", () => {
  for (const matching of [false, true])
    for (const prepared of [false, true])
      it(`requires class and preparation and damages only the attacker: ${matching}/${prepared}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(scorchingTrap, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              memory: [scorchingTrap],
              hand: [acceptedContract, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(scorchingTrap, { zone: "memory" }),
          self = p.card(champion),
          attacker = q.card(giantTortoise);
        if (prepared) {
          p.activate(acceptedContract, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
          passEffectsStack(game);
        }
        advanceToMain(game, q.id);
        q.declareAttack(attacker, self);
        q.pass();
        const before = game.state;
        expect(() =>
          p.activate(source, {
            targets: { "target-1": [q.card(champion).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const activate = () =>
          p.activate(source, {
            targets: { "target-1": [attacker.objectId] },
          });
        if (!matching || !prepared) {
          expect(activate).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        activate();
        expect(game.state.objects[self.objectId]!.counters.preparation).toBe(2);
        expect(game.state.objects[attacker.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[attacker.objectId]!.damage).toBe(2);
        expect(p.cards(scorchingTrap, { zone: "graveyard" })).toHaveLength(1);
      });
});
