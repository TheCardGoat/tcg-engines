import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-143", () => {
  test("Rush remains after the cost-zero opponent leaves the field", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-106", "P-143", "EB01-046"], activeDon: 10 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("OP02-106");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.playCard("P-143");
    e.playCard("EB01-046");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    e.asSouth().attack("P-143", e.leader("north"));
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "P-143")?.rested,
    ).toBe(true);
    expect(e.getView("south").players.north.lifeCount).toBe(3);
  });
  test("a cost-zero Character on its own field grants Rush after Air Door plays Tsuru", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-143"], character: ["EB01-005"], activeDon: 6 },
      { life: ["OP03-094", "EB01-005"], trash: ["OP02-106"] },
    );
    const doma = e.findCardInZone("south", "character", "EB01-005");
    const tsuru = e.findCardInZone("north", "trash", "OP02-106");

    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectPlaySelection", { selectedIds: [tsuru] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === doma),
    ).toMatchObject({ cost: 0 });
    expect(e.getView("south").players.north.characters.filter(Boolean)).toMatchObject([
      { instanceId: tsuru, cost: 1 },
    ]);

    e.asSouth().play("P-143");
    const crocodile = e.findCardInZone("south", "character", "P-143");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    e.asSouth().attack(crocodile, e.leader("north"));
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === crocodile),
    ).toMatchObject({ rested: true, cost: 6 });
    expect(e.getView("south").players.north.lifeCount).toBe(0);
  });
  test("without a cost-zero Character it cannot attack on its play turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-143"], activeDon: 6 },
      { character: ["EB01-005"] },
    );
    e.playCard("P-143");
    const id = e.findCardInZone("south", "character", "P-143");
    e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: id,
      targetId: e.leader("north"),
    });
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
