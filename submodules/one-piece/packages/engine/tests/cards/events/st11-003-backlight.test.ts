import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST11-003 Backlight", () => {
  test("the rest mode selects only an opposing Character costing at most five", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["ST11-003"], activeDon: 2, character: ["ST04-005"] },
      { character: ["ST04-005", "ST04-004"] },
    );
    const low = e.findCardInZone("north", "character", "ST04-005"),
      high = e.findCardInZone("north", "character", "ST04-004");
    e.asSouth().play("ST11-003");
    e.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([low]);
    e.asSouth().chooseTargets(low);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === low)?.rested,
    ).toBe(true);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === high)?.rested,
    ).toBe(false);
  });
  test("the KO mode selects only rested opposing Characters costing at most five", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["ST11-003"], activeDon: 2 },
      {
        character: [
          { cardId: "ST04-005", rested: true },
          "ST05-006",
          { cardId: "ST04-004", rested: true },
        ],
      },
    );
    const low = e.findCardInZone("north", "character", "ST04-005");
    e.asSouth().play("ST11-003");
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([low]);
    e.asSouth().chooseTargets(low);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
  });
  test("another Leader gets neither choice after paying the Event cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST11-003"], activeDon: 2 },
      { character: ["ST04-005"] },
    );
    e.asSouth().play("ST11-003");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test.each(["0", "1"])("can choose zero targets in mode %s", (optionId) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["ST11-003"], activeDon: 2 },
      { character: [{ cardId: "ST04-005", rested: true }] },
    );
    e.asSouth().play("ST11-003");
    e.resolveDecision("effectActionChoice", { optionId }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
