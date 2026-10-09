import { describe, expect, it } from "vitest";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { censerOfRestfulPeace } from "./censer-of-restful-peace.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { breakApart } from "../../P26/actions/break-apart.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0nlhgqpckq-a1 */
describe("Censer of Restful Peace — graveyard abilities", () => {
  for (const opposingSource of [false, true])
    for (const sourceZone of ["field", "banishment", "material-deck"] as const) {
      it(`disables Floating Memory only from the field, source=${sourceZone}, opponent=${opposingSource}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(censerOfRestfulPeace, false, "floating-memory"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              graveyard: [reclaim],
              memory: [woodlandSquirrels],
              "material-deck": [
                slateWhetstone,
                ...(!opposingSource && sourceZone === "material-deck"
                  ? [censerOfRestfulPeace]
                  : []),
              ],
              ...(!opposingSource && sourceZone !== "material-deck"
                ? { [sourceZone]: [censerOfRestfulPeace] }
                : {}),
            },
          },
          playerTwo: {
            champion,
            zones: opposingSource ? { [sourceZone]: [censerOfRestfulPeace] } : {},
          },
        });
        const p = game.player("player-one"),
          floating = p.card(reclaim);
        const options = { floatingMemoryCardIds: [floating.objectId] };
        if (sourceZone === "field") {
          const before = game.state;
          expect(() => p.materialize(slateWhetstone, options)).toThrow();
          expect(game.state).toEqual(before);
          p.materialize(slateWhetstone);
          expect(game.state.objects[floating.objectId]!.zone).toBe("graveyard");
        } else {
          p.materialize(slateWhetstone, options);
          expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
        }
        passEffectsStack(game);
        expect(p.cards(slateWhetstone, { zone: "field" })).toHaveLength(1);
      });
    }

  it("affects newly arrived graveyard cards and restores their abilities when destroyed", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(censerOfRestfulPeace, false, "floating-memory"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [censerOfRestfulPeace, woodlandSquirrels],
          hand: [reclaim, breakApart, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion, zones: { graveyard: [reclaim] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const payment = (count: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, count)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    const source = p.card(censerOfRestfulPeace),
      action = p.card(reclaim);
    p.activate(action, {
      reservePayment: payment(2),
      targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[action.objectId]!.zone).toBe("graveyard");
    const hasFloatingMemory = (id: typeof action.objectId) =>
      grandArchiveObjectActiveKeywords(game.program, game.state, game.state.objects[id]!).some(
        (keyword) => keyword.name === "floating-memory",
      );
    expect(hasFloatingMemory(action.objectId)).toBe(false);
    expect(hasFloatingMemory(q.card(reclaim).objectId)).toBe(false);
    p.activate(breakApart, {
      reservePayment: payment(5),
      targets: { "target-1": [source.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    expect(hasFloatingMemory(action.objectId)).toBe(true);
    expect(hasFloatingMemory(q.card(reclaim).objectId)).toBe(true);
  });
});
