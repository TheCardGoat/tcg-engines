import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { penumbralWaltz } from "./penumbral-waltz.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { cosmicBolt } from "../../SP4/actions/cosmic-bolt.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ominousShadow } from "../../EVP/tokens/ominous-shadow.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers nt1lyk1dvd-a1
 * @covers nt1lyk1dvd-a2
 * @covers nt1lyk1dvd-a3
 */
describe("Penumbral Waltz", () => {
  for (const matching of [false, true])
    for (const x of [0, 2, 3])
      it(`pays ${x} preparation, grants X+3 shielding, Tristan=${matching}`, () => {
        const champion = enableAllTestElements(
          lineageTestChampion(matching ? "Tristan" : "Other", 0),
        );
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [ominousShadow],
          playerOne: {
            champion,
            zones: {
              hand: [
                acceptedContract,
                penumbralWaltz,
                cosmicBolt,
                cosmicBolt,
                ...Array.from({ length: 11 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          target = p.card(champion);
        const pay = (count: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, count)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.counters.preparation).toBe(3);
        const before = game.state;
        expect(() => p.activate(penumbralWaltz, { variables: { X: 4 } })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(penumbralWaltz, { variables: { X: x } });
        expect(game.state.objects[target.objectId]!.counters.preparation ?? 0).toBe(3 - x);
        passEffectsStack(game);
        expect(p.cards(ominousShadow, { zone: "field" })).toHaveLength(matching && x >= 3 ? 2 : 0);
        let total = 0;
        for (let hit = 0; hit < 2; hit++) {
          p.activate(p.cards(cosmicBolt, { zone: "hand" })[0]!, {
            reservePayment: pay(3),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          total += 4 + 2 * hit;
          expect(game.state.objects[target.objectId]!.damage).toBe(Math.max(0, total - (x + 3)));
        }
      });
});
