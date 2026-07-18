import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05MonkeyDLuffy119 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-119 Monkey.D.Luffy", () => {
  test("returns ten DON!!, orders every other Character, and grants exactly the next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05MonkeyDLuffy119],
        character: [eb01Doma005, op05MonkeyDLuffy119, eb01Fourtricks025],
        activeDon: op05MonkeyDLuffy119.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstId = engine.findCardInZone("south", "character", eb01Doma005);
    const sameNameId = engine.findCardInZone("south", "character", op05MonkeyDLuffy119);
    const thirdId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.playCard(op05MonkeyDLuffy119, "south");
    const sourceId = engine
      .getView("south")
      .players.south.characters.find(
        (card) => card?.instanceId !== sameNameId && card?.cardId === op05MonkeyDLuffy119.id,
      )?.instanceId;
    expect(sourceId).toBeDefined();
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Luffy's private deck order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstId, sameNameId, thirdId]),
    );
    expect(order.candidates.map((candidate) => candidate.ref.id)).not.toContain(sourceId);
    const submittedOrder = [thirdId, sameNameId, firstId];
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: submittedOrder },
      "south",
    );
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(submittedOrder);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 10);
    expect(
      engine
        .getView("south")
        .players.south.characters.map((card) => card?.instanceId)
        .filter(Boolean),
    ).toEqual([sourceId]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    engine.endTurn("south");
    expect(engine.getState()).toMatchObject({ activeSeat: "south", turnNumber: 2 });
    engine.endTurn("south");
    expect(engine.getState()).toMatchObject({ activeSeat: "north", turnNumber: 3 });
  });

  test("rests one DON!! to add up to one active DON!! only once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05MonkeyDLuffy119],
      activeDon: 1,
      donDeckCount: 1,
    });
    const luffyId = engine.findCardInZone("south", "character", op05MonkeyDLuffy119);
    engine.activateEffect(luffyId, "activateMain", "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Luffy's add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 0,
    });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: luffyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
