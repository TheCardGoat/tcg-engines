import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { obelithEscort } from "./obelith-escort.ts";
import { memoriteObelith } from "../../PTM/tokens/memorite-obelith.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 3uqgjoBQ9G-a1
 * @covers 3uqgjoBQ9G-a2
 */
describe("Obelith Escort", () => {
  for (const mode of ["missing", "declined", "prepared"])
    it(`summons sheen-bearing tokens, ${mode}`, () => {
      const champion = createClassBonusTestChampion(obelithEscort, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [memoriteObelith],
        playerOne: {
          champion,
          zones: {
            hand: [
              obelithEscort,
              acceptedContract,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(obelithEscort, { reservePayment: pay(3), prepareAbilityIndexes: [0] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (mode !== "missing") {
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
      }
      p.activate(obelithEscort, {
        reservePayment: pay(3),
        ...(mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {}),
      });
      expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
        mode === "missing" ? 0 : mode === "prepared" ? 1 : 3,
      );
      passEffectsStack(game);
      const tokens = p.cards(memoriteObelith, { zone: "field" });
      expect(tokens).toHaveLength(mode === "prepared" ? 2 : 1);
      for (const token of tokens)
        expect(game.state.objects[token.objectId]!.counters["named:sheen"]).toBe(1);
      expect(q.cards(memoriteObelith, { zone: "field" })).toHaveLength(0);
    });
});
