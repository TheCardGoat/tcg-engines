import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { describe, expect, it } from "vitest";
import { collapsingTrap } from "./collapsing-trap.ts";
import { proveNextEntryRested } from "../../../testing/next-entry-rested.ts";
/** @covers v2214upufo-a2 */
describe("collapsingTrap — next entry batch", () => {
  proveNextEntryRested({ card: collapsingTrap, cost: 0, items: false });
});

/** @covers v2214upufo-a1 */
describe("Collapsing Trap — preparation payment from memory", () => {
  for (const matching of [false, true])
    for (const ownTurn of [false, true])
      for (const prepared of [false, true])
        it(`requires class, opposing turn, and preparation: ${matching}/${ownTurn}/${prepared}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(collapsingTrap, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                memory: [collapsingTrap],
                hand: [acceptedContract, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one");
          const source = p.card(collapsingTrap, { zone: "memory" });
          const self = p.card(champion);
          if (prepared) {
            p.activate(acceptedContract, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            });
            passEffectsStack(game);
          }
          if (!ownTurn) {
            advanceToMain(game, game.player("player-two").id);
            game.player("player-two").pass();
          }
          const before = game.state;
          if (!matching || ownTurn || !prepared) {
            expect(() => p.activate(source)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.activate(source);
          expect(game.state.objects[self.objectId]!.counters.preparation).toBe(2);
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          passEffectsStack(game);
          expect(p.cards(collapsingTrap, { zone: "graveyard" })).toHaveLength(1);
        });
});
