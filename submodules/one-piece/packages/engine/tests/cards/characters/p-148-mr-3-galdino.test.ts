import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-148", () => {
  test("gives one rested DON to Leader and cannot activate again with another available", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-148"], restedDon: 2 },
      { character: ["OP16-003"] },
    );
    const id = e.findCardInZone("south", "character", "P-148");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
  });
  test("Blocker redirects the attack and protects Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-148"] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "P-148");
    e.asNorth().attack("OP16-003", e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("own cost-eight Character enables choosing zero without spending rested DON", () => {
    const e = OnePieceTestEngine.create({ character: ["P-148", "OP16-003"], restedDon: 1 });
    const id = e.findCardInZone("south", "character", "P-148");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("reducing an opponent to zero permits giving rested DON to a Character", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-148"], hand: ["OP02-106"], activeDon: 1, restedDon: 1 },
      { character: ["EB01-005"] },
    );
    const source = e.findCardInZone("south", "character", "P-148");
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: source,
      trigger: "activateMain",
    });
    e.playCard("OP02-106");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "EB01-005")] },
      "south",
    );
    e.activateEffect(source, "activateMain", "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [source] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === source)
        ?.attachedDon,
    ).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
