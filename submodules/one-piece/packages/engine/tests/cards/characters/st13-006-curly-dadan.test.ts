import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-006-curly-dadan", () => {
  test("plays one of each exact cost-two name simultaneously and rejects duplicate Sabo", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-006", "ST13-007", "ST13-007", "ST13-010", "ST13-014", "ST13-015"],
      activeDon: 5,
    });
    e.playCard("ST13-006", "south");
    const sabos = e
      .getView("south")
      .players.south.hand.filter((c) => c.cardId === "ST13-007")
      .map((c) => c.instanceId)
      .filter((id): id is string => id !== null);
    const ace = e.findCardInZone("south", "hand", "ST13-010"),
      luffy = e.findCardInZone("south", "hand", "ST13-014");
    const prompt = e.pendingDecision("effectGroupedPlaySelection", "south");
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: sabos,
    });
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    e.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [sabos[0]!, ace, luffy] },
      "south",
    );
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(4);
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c!.cardId),
    ).toEqual(expect.arrayContaining(["ST13-007", "ST13-010", "ST13-014"]));
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST13-015");
  });
  test("declines all optional plays", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST13-006", "ST13-007"], activeDon: 5 });
    e.playCard("ST13-006", "south");
    e.resolveDecision("effectGroupedPlaySelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST13-007"]);
  });
  test("Blocker redirects a Leader attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST13-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blocker = e.findCardInZone("north", "character", "ST13-006");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(blocker);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
  });

  test("declines Blocker and leaves the Character active", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST13-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
