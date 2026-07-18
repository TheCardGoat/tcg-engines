import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01EdwardWeevil023, op01DonquixoteDoflamingo060 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-060 Donquixote Doflamingo", () => {
  test("reveals and optionally plays the eligible top-deck Character rested while attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        deck: [eb01EdwardWeevil023, eb01Doma005],
        activeDon: 3,
      },
      { life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderId = engine.leader("south");
    const revealedId = engine.findCardInZone("south", "deck", eb01EdwardWeevil023);
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.attachDon(leaderId, 2, "south");
    engine.declareAttack(leaderId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected the attacking player to receive the revealed-card play choice.");
    }
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([revealedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [revealedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === revealedId),
    ).toMatchObject({ rested: true });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
