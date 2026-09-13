import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { reposition } from "./reposition.ts";

/** @covers vfq3huqj5b-a2 */
describe("Reposition — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: reposition });
});

/** @covers vfq3huqj5b-a1 */
describe("Reposition — distant timing", () => {
  for (const owner of ["player-one", "player-two"] as const) {
    it(`makes a ${owner} unit distant only on resolution and until its controller's turn ends`, () => {
      const champion = createClassBonusTestChampion(reposition, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [reposition, woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const target = game.player(owner).card(champion, { zone: "field" });
      player.activate(reposition, {
        targets: { "target-1": [target.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      expect(game.state.objects[target.objectId]?.states.has("distant")).toBe(false);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      expect(game.state.objects[target.objectId]?.states.has("distant")).toBe(true);

      // Advance only through real Opportunity passes; a decision is an unexpected boundary.
      const passToNextTurn = () => {
        const turn = game.state.turn.number;
        for (let step = 0; step < 32 && game.state.turn.number === turn; step++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice") {
            game.player(wait.playerId).execute({ move: "skip-materialization" });
            continue;
          }
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.number).toBe(turn + 1);
      };
      passToNextTurn();
      expect(game.state.objects[target.objectId]?.states.has("distant")).toBe(
        owner === "player-two",
      );
      if (owner === "player-two") {
        passToNextTurn();
        expect(game.state.objects[target.objectId]?.states.has("distant")).toBe(false);
      }
    });
  }

  it("rejects a non-unit target without reserving the payment", () => {
    const champion = createClassBonusTestChampion(reposition, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [reposition, woodlandSquirrels], field: [potionOfHealing] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(reposition, {
        targets: { "target-1": [player.card(potionOfHealing).objectId] },
        reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
