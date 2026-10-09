import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-006 Yosaku & Johnny", () => {
  test.each(["0", "1"])("selects attack branch %s and preserves its filters", (option) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-006", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "ST12-015", rested: option === "1" }, "ST12-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-006"), e.leader("north"));
    e.resolveDecision("effectActionChoice", { optionId: option }, "south");
    const id = e.findCardInZone("north", "character", "ST12-015");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    if (option === "0") expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    else expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.characters.some((c) => c?.cardId === "ST12-004")).toBe(
      true,
    );
  });
  test("declines optional KO target and leaves it on field", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-006", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "ST12-015", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-006"), e.leader("north"));
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST12-015");
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("no DON prevents both choices", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-006", playedOnTurn: 0 }] },
      { character: ["ST12-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-006"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
