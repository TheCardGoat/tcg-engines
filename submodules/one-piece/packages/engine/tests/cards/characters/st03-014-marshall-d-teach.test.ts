import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["south", "north"] as const)("Teach returns a cost3 Character from %s", (seat) => {
  const engine = OnePieceTestEngine.create(
    { hand: ["ST03-014"], activeDon: 4, character: ["ST03-002"] },
    { character: ["ST03-002", "ST03-012"] },
  );
  const target = engine.findCardInZone(seat, "character", "ST03-002");
  engine.playCard("ST03-014");
  const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  if (choice?.kind !== "selectEntity") throw new Error("Expected a bounce target.");
  expect(choice.candidates).toHaveLength(2);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
  expect(engine.getView(seat).players[seat].hand.map((card) => card.instanceId)).toContain(target);
});

test("Teach may decline its up-to return", () => {
  const engine = OnePieceTestEngine.create({
    hand: ["ST03-014"],
    activeDon: 4,
    character: ["ST03-002"],
  });
  engine.playCard("ST03-014");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
  expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
  expect(engine.getView("south").players.south.hand).toHaveLength(0);
});
