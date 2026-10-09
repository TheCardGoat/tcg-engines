import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Black Maria (OP17-072) cost=2 power=1000 counter=1000
describe("OP17-072 Black Maria", () => {
  test("[On Opponent's Attack] resolves its trigger during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-072"], hand: ["EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-072");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-072", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-072",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: declining on the first attack leaves the once-per-turn effect for a later attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-072"], hand: ["EB01-005"], life: ["EB01-025", "EB01-025", "EB01-025"] },
      { character: ["OP13-013"] },
      { activeSeat: "north" },
    );
    const attacker = e.findCardInZone("north", "character", "OP13-013");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("EB01-005");
    e.declareAttack(attacker, e.leader("south"), "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "EB01-005")] },
      "south",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB01-005");
  });
  test("Blocker redirects the attack away from Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-072"], hand: [] },
      {},
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    const id = e.findCardInZone("south", "character", "OP17-072");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
