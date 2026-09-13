import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { lavaheatedBrew } from "./lavaheated-brew.ts";

/** @covers o98vn1voy5-a2 */
describe("Lavaheated Brew — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: lavaheatedBrew });
});

/** @covers o98vn1voy5-a1 */
describe("Lavaheated Brew — draw, discard, and Potion check", () => {
  for (const discard of ["held-potion", "drawn-potion", "non-potion"] as const) {
    it(`discards a ${discard} and ${discard === "non-potion" ? "damages" : "does not damage"} its champion`, () => {
      const champion = createClassBonusTestChampion(lavaheatedBrew, true, "activation-discount");
      const drawnCard = discard === "drawn-potion" ? potionOfHealing : woodlandSquirrels;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              lavaheatedBrew,
              potionOfHealing,
              ...Array.from({ length: 2 }, () => woodlandSquirrels),
            ],
            memory: [potionOfHealing],
            "main-deck": [drawnCard, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [potionOfHealing], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ownChampion = player.card(champion);
      const heldPotion = player.card(potionOfHealing, { zone: "hand" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const deckTop = player.zone("main-deck")[0]!;
      player.activate(lavaheatedBrew, { reservePayment: payment });
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      expect(player.zone("hand")).toContainEqual(deckTop);
      const selected =
        discard === "held-potion" ? heldPotion : discard === "drawn-potion" ? deckTop : deckTop;
      for (const invalid of [
        [],
        [heldPotion.objectId, deckTop.objectId],
        [player.card(potionOfHealing, { zone: "memory" }).objectId],
        [opponent.card(potionOfHealing, { zone: "hand" }).objectId],
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [selected.objectId]);
      passEffectsStack(game);
      expect(player.zone("graveyard")).toContainEqual(selected);
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(
        discard === "non-potion" ? 3 : 0,
      );
      expect(opponent.zone("hand")).toEqual([opponent.card(potionOfHealing, { zone: "hand" })]);
    });
  }
});
