import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { marksmanCaptain } from "./marksman-captain.ts";

/** @covers 9dqou3vgi8-a1 */
describe("Marksman Captain — Ranged 2", () => {
  proveRangedAlly({ card: marksmanCaptain, power: 1, ranged: 2, classBonus: false });
});

/** @covers 9dqou3vgi8-a2 */
describe("Marksman Captain — On Enter distant", () => {
  for (const targetKind of ["ally", "champion"] as const) {
    it(`makes another ${targetKind} distant only on resolution`, () => {
      const champion = createClassBonusTestChampion(marksmanCaptain, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [marksmanCaptain, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels, potionOfHealing],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(marksmanCaptain, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      const captain = player.card(marksmanCaptain, { zone: "field" });
      const ally = player.card(woodlandSquirrels, { zone: "field" });
      const ownChampion = player.card(champion, { zone: "field" });
      const target = targetKind === "ally" ? ally : ownChampion;
      expect(
        game.state.decision?.kind === "announce-triggered-ability" ||
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "9dqou3vgi8-a2",
          ),
      ).toBe(true);
      for (const invalid of [
        captain,
        player.card(potionOfHealing, { zone: "field" }),
        opponent.card(woodlandSquirrels, { zone: "field" }),
      ]) {
        const before = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [invalid.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      expect(game.state.objects[captain.objectId]!.states.has("distant")).toBe(false);
      const other = targetKind === "ally" ? ownChampion : ally;
      expect(game.state.objects[other.objectId]!.states.has("distant")).toBe(false);
    });
  }
});
