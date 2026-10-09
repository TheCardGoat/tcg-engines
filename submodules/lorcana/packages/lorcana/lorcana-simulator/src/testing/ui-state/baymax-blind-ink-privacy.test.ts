import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  baymaxAmpedUp,
  khanTransportDelivery,
  riveraFamilyPhoto,
  jukebox,
  fruFruVipGuest,
} from "@tcg/lorcana-cards/cards/014";
import { buildCardSnapshotMap } from "../../lib/features/simulator/model/board-utils";

// CR 7.1.3, 7.5.4–7.5.6: Supercharge does not look at or reveal the top deck card.
describe("Baymax blind deck-to-ink privacy", () => {
  for (const owner of [PLAYER_ONE, PLAYER_TWO]) {
    it(`keeps the inked identity hidden in the board and all logs for ${owner}`, () => {
      const fixture = {
        play: [baymaxAmpedUp],
        hand: [khanTransportDelivery],
        inkwell: 2,
        deck:
          owner === PLAYER_ONE
            ? [riveraFamilyPhoto, jukebox]
            : [riveraFamilyPhoto, jukebox, fruFruVipGuest],
      };
      const actual = LorcanaMultiplayerTestEngine.createWithFixture(
        owner === PLAYER_ONE ? fixture : { deck: 3 },
        owner === PLAYER_TWO ? fixture : { deck: 3 },
      );
      if (owner === PLAYER_TWO) expect(actual.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const chooser = owner === PLAYER_ONE ? actual.asPlayerOne() : actual.asPlayerTwo();
      const inkId = actual.findCardInstanceId(riveraFamilyPhoto, "deck", owner)!;
      expect(chooser.playCard(khanTransportDelivery)).toBeSuccessfulCommand();
      expect(chooser.resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
      expect(chooser.getCardZone(inkId)).toBe("inkwell");
      expect(actual.isCardFaceDown(inkId, "inkwell", owner)).toBe(true);
      const snapshots = buildCardSnapshotMap(
        actual.getBoard(owner === PLAYER_ONE ? "playerOne" : "playerTwo"),
        chooser.staticResources,
      );
      expect(snapshots[inkId]?.isMasked).toBe(true);
      const log = actual
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .findLast((entry) => entry.moveType === "resolveEffect")!;
      expect(JSON.stringify(log.public)).not.toContain(inkId);
      expect(JSON.stringify(log.privateByPlayerId ?? {})).not.toContain(inkId);
      expect(chooser.getPendingEffects()).toHaveLength(0);
    });
  }
});
