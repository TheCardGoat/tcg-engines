import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aDarkAgeNoMore, riveraFamilyPhoto, fruFruVipGuest } from "@tcg/lorcana-cards/cards/014";
import { buildCardSnapshotMap } from "../../lib/features/simulator/model/board-utils";

// CR 7.1.3 and 7.5.4–7.5.6: this action neither looks at nor reveals the top deck card.
describe("A Dark Age No More blind ink privacy", () => {
  for (const owner of [PLAYER_ONE, PLAYER_TWO]) {
    it(`hides the unseen ink card from all viewers when ${owner} plays the action`, () => {
      const fixture = {
        hand: [aDarkAgeNoMore],
        inkwell: 3,
        deck: owner === PLAYER_ONE ? [riveraFamilyPhoto] : [riveraFamilyPhoto, fruFruVipGuest],
      };
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        owner === PLAYER_ONE ? fixture : { deck: 3 },
        owner === PLAYER_TWO ? fixture : { deck: 3 },
      );
      if (owner === PLAYER_TWO) expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const actor = owner === PLAYER_ONE ? g.asPlayerOne() : g.asPlayerTwo();
      const inkId = g.findCardInstanceId(riveraFamilyPhoto, "deck", owner)!;
      expect(actor.playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
      expect(actor.getCardZone(inkId)).toBe("inkwell");
      expect(g.isCardFaceDown(inkId, "inkwell", owner)).toBe(true);
      expect(g.isExerted(inkId)).toBe(true);
      expect(g.getInkDrops(owner)).toBe(1);
      for (const view of ["playerOne", "playerTwo", "spectator"] as const) {
        const snapshots = buildCardSnapshotMap(g.getBoard(view), actor.staticResources);
        expect(snapshots[inkId]?.isMasked).toBe(true);
      }
      const log = g
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .findLast((e) => e.moveType === "playCard")!;
      expect(JSON.stringify(log.public)).not.toContain(inkId);
      expect(JSON.stringify(log.privateByPlayerId ?? {})).not.toContain(inkId);
      expect(actor.getPendingEffects()).toHaveLength(0);
    });
  }
});
