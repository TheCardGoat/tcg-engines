import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test("Thrust Pad Cannon returns the attacker and ends combat without Life damage", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("ST03-002"), playedOnTurn: 0 }] },
    { hand: ["ST03-016"], activeDon: 2, life: 2 },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attacker = engine.findCardInZone("south", "character", "ST03-002");
  const event = engine.findCardInZone("north", "hand", "ST03-016");
  engine.declareAttack(attacker, engine.leader("north"), "south");
  engine.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [attacker] }, "north");
  expect(engine.getView("north").players.north.lifeCount).toBe(2);
  expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
    attacker,
  );
  expect(engine.getView("north").prompts).toHaveLength(0);
});
test("Thrust Pad Cannon Trigger may return its controller's own Character", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
    { life: ["ST03-016"], character: ["ST03-002"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const target = engine.findCardInZone("north", "character", "ST03-002");
  engine.declareAttack(
    engine.findCardInZone("south", "character", "EB01-018"),
    engine.leader("north"),
    "south",
  );
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
  expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
    target,
  );
  expect(engine.getView("north").players.north.activeDon).toBe(0);
});
