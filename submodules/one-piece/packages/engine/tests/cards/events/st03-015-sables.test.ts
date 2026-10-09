import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["south", "north"] as const)("Sables returns a cost7 Character from %s", (seat) => {
  const engine = OnePieceTestEngine.create(
    { hand: ["ST03-015"], activeDon: 4, character: ["ST03-009"] },
    { character: ["ST03-009", "OP06-086"] },
  );
  const target = engine.findCardInZone(seat, "character", "ST03-009");
  engine.playCard("ST03-015");
  const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  if (choice?.kind !== "selectEntity") throw new Error("Expected a bounce target.");
  expect(choice.candidates).toHaveLength(2);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
  expect(engine.getView(seat).players[seat].hand.map((card) => card.instanceId)).toContain(target);
});
test("Sables Trigger activates Main without DON payment", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
    { life: ["ST03-015"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const target = engine.findCardInZone("south", "character", "EB01-018");
  engine.declareAttack(target, engine.leader("north"), "south");
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
  expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
    target,
  );
  expect(engine.getView("north").players.north.activeDon).toBe(0);
});
