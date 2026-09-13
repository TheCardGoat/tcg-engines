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

  test("may decline optional so paid effect does not apply", () => {
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
    engine.attachDon(leaderId, 2, "south");
    engine.declareAttack(leaderId, engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
