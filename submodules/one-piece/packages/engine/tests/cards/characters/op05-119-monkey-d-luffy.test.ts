import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05MonkeyDLuffy119 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

/**
 * OP05-119 Monkey.D.Luffy: optional [On Play] DON!! −10 → bottom-deck every other
 * Character (any order) then extra turn; [Activate: Main][Once Per Turn] rest 1
 * DON!! → add up to 1 active DON!!. Subject is op05MonkeyDLuffy119 (the played copy).
 */
describe("OP05-119 Monkey.D.Luffy", () => {
  test("returns ten DON!!, orders every other Character, and grants exactly the next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05MonkeyDLuffy119],
        character: [eb01Doma005, op05MonkeyDLuffy119, eb01Fourtricks025],
        activeDon: op05MonkeyDLuffy119.cost,
      },
      {},
      // Pin turn 1 so extra-turn assertions (turn 2 still south, then turn 3
      // north) stay meaningful under mid-game fixture defaults (turnNumber 3).
      { firstPlayer: "north", activeSeat: "south", turnNumber: 1 },
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

  test("may decline On Play DON!! −10 so allies stay, DON!! stay, and no extra turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05MonkeyDLuffy119],
        character: [eb01Doma005, eb01Fourtricks025],
        // Cost + 10 so a yes-path would return 10 DON!!; decline must leave pool intact.
        activeDon: op05MonkeyDLuffy119.cost + 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south", turnNumber: 1 },
    );
    const allyA = engine.findCardInZone("south", "character", eb01Doma005);
    const allyB = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;

    // Subject is the played SEC Luffy, not a same-name reprint or board copy.
    engine.playCard(op05MonkeyDLuffy119, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    const after = view.players.south;
    // Play rests cost into the cost area; decline must not return 10 DON!! to donDeck.
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.restedDon).toBe(op05MonkeyDLuffy119.cost);
    expect(after.donDeckCount).toBe(donDeckBefore);
    // Other Characters remain; only the newly played Luffy joins them.
    expect(after.characters.some((card) => card?.instanceId === allyA)).toBe(true);
    expect(after.characters.some((card) => card?.instanceId === allyB)).toBe(true);
    expect(after.characters.some((card) => card?.cardId === op05MonkeyDLuffy119.id)).toBe(true);
    // Character area is fixed-width; count occupied slots only.
    expect(after.characters.filter(Boolean)).toHaveLength(3);
    // No extra turn: south ends, north becomes active on turn 2.
    engine.endTurn("south");
    expect(engine.getState()).toMatchObject({ activeSeat: "north", turnNumber: 2 });
    expect(engine.getView("south").prompts).toHaveLength(0);
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
