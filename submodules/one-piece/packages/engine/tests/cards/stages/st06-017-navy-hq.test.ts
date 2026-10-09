import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-017 Navy HQ", () => {
  test("OnPlay and paid Main may reduce different targets with Navy Leader", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", hand: ["ST06-017"], activeDon: 1 },
      { character: ["ST02-002", "ST02-006"] },
    );
    const first = e.findCardInZone("north", "character", "ST02-002"),
      second = e.findCardInZone("north", "character", "ST02-006");
    e.playCard("ST06-017", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [first] }, "south");
    const id = e.findCardInZone("south", "stage", "ST06-017");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [second] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === first)?.cost,
    ).toBe(2);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === second)?.cost,
    ).toBe(3);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    e.endTurn("south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === first)?.cost,
    ).toBe(3);
  });
  test("decline leaves the Stage active", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST06-001", stage: "ST06-017" });
    const id = e.findCardInZone("south", "stage", "ST06-017");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("wrong Leader may pay rest but receives no cost reduction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", stage: "ST06-017" },
      { character: ["ST02-006"] },
    );
    const id = e.findCardInZone("south", "stage", "ST06-017");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.cardId === "ST02-006")?.cost,
    ).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
