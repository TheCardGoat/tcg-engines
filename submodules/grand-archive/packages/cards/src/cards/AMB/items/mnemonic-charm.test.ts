import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { mnemonicCharm } from "./mnemonic-charm.ts";

/** @covers to1pmvo54d-a1 */
describe("Mnemonic Charm — On Enter draw", () => {
  it("draws one card into memory only when the entry trigger resolves", () => {
    const champion = createClassBonusTestChampion(mnemonicCharm, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [mnemonicCharm, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const top = player.zone("main-deck")[0]!;
    player.activate(mnemonicCharm, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(player.zone("memory")).toHaveLength(2);
    player.pass();
    game.player("player-two").pass();
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "to1pmvo54d-a1",
      ),
    ).toBe(true);
    expect(game.state.objects[top.objectId]?.zone).toBe("main-deck");
    passEffectsStack(game);
    expect(game.state.objects[top.objectId]?.zone).toBe("memory");
  });
});

/** @covers to1pmvo54d-a2 */
describe("Mnemonic Charm — Class Bonus Empower", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "sacrifices" : "rejects"} Empower 2 with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        mnemonicCharm,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [mnemonicCharm] } },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      if (!classBonus) {
        const before = game.state;
        expect(() => player.activateAbility(mnemonicCharm, "to1pmvo54d-a2")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(mnemonicCharm, "to1pmvo54d-a2");
      expect(player.cards(mnemonicCharm, { zone: "field" })).toHaveLength(0);
      expect(game.state.players[player.id]!.states.empower).toBeUndefined();
      passEffectsStack(game);
      expect(game.state.players[player.id]!.states.empower).toBe(2);
      expect(player.cards(mnemonicCharm, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
