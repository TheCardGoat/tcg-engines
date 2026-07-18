import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Foxy059,
  op07Foxy071,
  op07Itomimizu060,
  op07Porche072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-059 Foxy", () => {
  test("pays DON!! -3 and freezes up to one rested Leader and Character independently", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        character: [op07Itomimizu060, op07Foxy071, op07Porche072],
        activeDon: 3,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const northLeaderId = engine.leader("north");
    const frozenCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const refreshedCharacterId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(northLeaderId, engine.leader("south"), "north");
    engine.endTurn("north");

    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.declareAttack(engine.leader("south"), northLeaderId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const leaderChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(leaderChoice?.kind).toBe("selectEntity");
    if (leaderChoice?.kind !== "selectEntity") throw new Error("Expected Foxy's Leader choice.");
    expect(leaderChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([northLeaderId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [northLeaderId] }, "south");

    const characterChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(characterChoice?.kind).toBe("selectEntity");
    if (characterChoice?.kind !== "selectEntity") {
      throw new Error("Expected Foxy's Character choice.");
    }
    expect(characterChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      frozenCharacterId,
      refreshedCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frozenCharacterId] }, "south");

    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 3);
    engine.endTurn("south");

    const view = engine.getView("north");
    expect(view.players.north.leader.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === frozenCharacterId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === refreshedCharacterId)
        ?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
