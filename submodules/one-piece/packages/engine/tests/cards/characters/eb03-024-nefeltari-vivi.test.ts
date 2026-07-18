import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Koza004,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  eb03NefeltariVivi024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-024 Nefeltari Vivi", () => {
  test("plays either printed trait, prevents later Character play, then blocks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03NefeltariVivi024, eb01Koza004, eb01TonyTonyChopper006, eb01Doma005],
        activeDon: 5,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const alabastaId = engine.findCardInZone("south", "hand", eb01Koza004);
    const strawHatId = engine.findCardInZone("south", "hand", eb01TonyTonyChopper006);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03NefeltariVivi024, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Vivi's trait play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([alabastaId, strawHatId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [strawHatId] }, "south");

    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: alabastaId }).reason,
    ).toBe("A card effect prevents this card from being played.");

    const viviId = engine.findCardInZone("south", "character", eb03NefeltariVivi024);
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Vivi's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(viviId);
    engine.resolveDecision("battleBlocker", { selectedIds: [viviId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      viviId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
