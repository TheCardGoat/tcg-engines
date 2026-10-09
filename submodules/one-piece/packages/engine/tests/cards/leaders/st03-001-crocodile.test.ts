import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["south", "north"] as const)(
  "Crocodile pays DON -4 to return a cost5 Character owned by %s",
  (seat) => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST03-001", activeDon: 4, character: ["ST03-003"] },
      { character: ["ST03-003", "OP06-086"] },
    );
    const target = engine.findCardInZone(seat, "character", "ST03-003");
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected a bounce target.");
    expect(choice.candidates).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView(seat).players[seat].hand.map((card) => card.instanceId)).toContain(
      target,
    );
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 4);
  },
);

test("Crocodile may decline the DON return without consuming its activation", () => {
  const engine = OnePieceTestEngine.create({
    leaderCardId: "ST03-001",
    activeDon: 4,
    character: ["ST03-003"],
  });
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
  expect(engine.getView("south").players.south.activeDon).toBe(4);
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
  expect(engine.getView("south").players.south.activeDon).toBe(0);
});
