import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-005 Sengoku", () => {
  test("When Attacking reduces a chosen opposing cost by4 for this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST06-005", playedOnTurn: 0 }] },
      { character: ["ST02-013"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = e.findCardInZone("north", "character", "ST02-013");
    e.declareAttack(e.findCardInZone("south", "character", "ST06-005"), e.leader("north"), "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.cost,
    ).toBe(3);
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    e.endTurn("south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.cost,
    ).toBe(7);
  });
  test("may choose no cost target", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST06-005", playedOnTurn: 0 }] },
      { character: ["ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST06-005"), e.leader("north"), "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.cardId === "ST02-006")?.cost,
    ).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
