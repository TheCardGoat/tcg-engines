import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  mickeyMouseBraveLittleTailor,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
} from "../../001";
import { nothingToHide } from "./165-nothing-to-hide";

describe("Nothing to Hide", () => {
  it("reveals each opponent hand and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nothingToHide],
        inkwell: nothingToHide.cost,
        deck: [mickeyMouseBraveLittleTailor],
      },
      {
        hand: [mickeyMouseArtfulRogue, mickeyMouseTrueFriend],
      },
    );
    const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(nothingToHide)).toBeSuccessfulCommand();

    expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(1);
    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    for (const cardId of opponentHandIds) {
      expect(cardMeta[cardId]?.revealed).toBe(true);
    }
  });
});
