import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  minnieMouseUrbanVisionary,
  riveraFamilyPhoto,
  jukebox,
} from "@tcg/lorcana-cards/cards/014";
import {
  buildCardSnapshotMap,
  mergeSupplementalScryCardSnapshots,
} from "../../lib/features/simulator/model/board-utils";

// CR 2.2.0 7.1.3 and 7.5.4: choosing ink does not authorize looking at its face.
describe("Minnie optional inkwell look privacy", () => {
  for (const look of [false, true]) {
    it(`keeps return candidates masked unless the look was accepted: ${look}`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseUrbanVisionary, exerted: true, isDrying: false }],
          inkwell: [riveraFamilyPhoto, jukebox],
          deck: 3,
        },
        { deck: 3 },
      );
      const inkIds = g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().resolveNextPending({ resolveOptional: look })).toBeSuccessfulCommand();
      const board = g.getBoard("playerOne");
      const staticResources = g.asPlayerOne().staticResources;
      const snapshots = mergeSupplementalScryCardSnapshots({
        board,
        snapshots: buildCardSnapshotMap(board, staticResources),
        staticResources,
        authoritativeState: g.getAuthoritativeState(),
      });
      for (const id of inkIds) {
        expect(snapshots[id]?.isMasked).toBe(!look);
        expect(snapshots[id]?.facePresentation).toBe(look ? "faceUp" : "faceDown");
      }
      expect(
        g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [inkIds[1]!] }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toContain(inkIds[1]!);
      expect(g.asPlayerOne().isExerted(inkIds[0]!)).toBe(true);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      const log = g
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .findLast((entry) => entry.moveType === "resolveEffect")!;
      expect(JSON.stringify(log.public)).not.toContain(inkIds[1]!);
      expect(JSON.stringify(log.privateByPlayerId?.[PLAYER_ONE])).toContain(inkIds[1]!);
    });
  }
});
