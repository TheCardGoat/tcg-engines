import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("1-3-6-2-1: a later cost increase includes the prior negative value", () => {
  const engine = OnePieceTestEngine.create(
    {
      leaderCardId: "OP13-004",
      life: 3,
      character: ["EB01-005"],
      hand: ["ST14-016"],
      deck: ["ST06-009", "ST01-002"],
      activeDon: 1,
    },
    {
      leaderCardId: "ST06-001",
      life: ["OP03-094", "ST06-009"],
      trash: ["OP02-106"],
    },
  );
  const doma = engine.findCardInZone("south", "character", "EB01-005");
  const tsuru = engine.findCardInZone("north", "trash", "OP02-106");

  engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision("effectPlaySelection", { selectedIds: [tsuru] }, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "north");
  // Printed cost 1 minus 2 is -1, although its public cost is shown as zero.
  expect(engine.getView("south").players.south.characters[0]?.cost).toBe(0);

  engine.asSouth().play("ST14-016");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "south");
  expect(engine.getView("south").players.south.characters[0]).toMatchObject({
    instanceId: doma,
    cost: 2,
  });
  expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
    "ST06-009",
  ]);
  expect(engine.getView("south").prompts).toHaveLength(0);
});
