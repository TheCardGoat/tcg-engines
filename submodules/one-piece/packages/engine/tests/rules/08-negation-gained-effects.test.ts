import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("8-2-2: a negated Character with printed text is not a no-base-effect target", () => {
  const engine = OnePieceTestEngine.create(
    {
      leaderCardId: "ST01-001",
      character: ["EB03-009", "ST01-007", "EB01-005"],
      restedDon: 1,
    },
    { leaderCardId: "ST06-001", life: ["OP09-097", "ST06-009"] },
  );
  const nami = engine.findCardInZone("south", "character", "ST01-007");
  const doma = engine.findCardInZone("south", "character", "EB01-005");
  const makino = engine.findCardInZone("south", "character", "EB03-009");

  engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [nami] }, "north");
  const rejected = engine.expectFailure({
    type: "activateEffect",
    seat: "south",
    sourceInstanceId: nami,
    trigger: "activateMain",
  });
  const unchanged = OnePieceTestEngine.fromState(rejected.state);
  expect(unchanged.getView("south").players.south.restedDon).toBe(1);
  expect(unchanged.getView("south").players.south.leader.attachedDon).toBe(0);
  engine.asSouth().activateMain(makino);
  engine.asSouth().acceptOptional();
  const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  if (step?.kind !== "selectEntity") throw new Error("Expected Makino's vanilla recipient.");
  expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([doma]);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "south");
  expect(
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === doma)
      ?.power,
  ).toBe(5000);
  expect(
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === nami)
      ?.power,
  ).toBe(1000);
  expect(
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === makino)
      ?.rested,
  ).toBe(true);
  expect(engine.getView("south").prompts).toHaveLength(0);
});

test("8-2-4: a Leader gains usable Double Attack after its own effects are negated", () => {
  const engine = OnePieceTestEngine.create(
    {
      leaderCardId: "OP01-002",
      character: ["ST01-010", "EB01-005", "ST01-002", "ST01-003", "ST01-004"],
      hand: ["EB02-018"],
      activeDon: 8,
    },
    {
      leaderCardId: "ST06-001",
      life: ["OP09-097", "ST06-009", "ST06-006", "ST06-007"],
    },
  );
  engine.asSouth().attack("ST01-010", engine.leader("north"));
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision(
    "effectTargetSelection",
    { selectedIds: [engine.leader("south")] },
    "north",
  );
  expect(engine.getView("south").players.north.lifeCount).toBe(3);

  // Law has all five Characters and eight active DON!!, and its turn limit is unused.
  // The rejection must be caused by negation, not payment or a missing field condition.
  const rejected = engine.expectFailure({
    type: "activateEffect",
    seat: "south",
    sourceInstanceId: engine.leader("south"),
    trigger: "activateMain",
  });
  expect(rejected.reason).toBe("This card does not have that activation timing.");
  const unchanged = OnePieceTestEngine.fromState(rejected.state).getView("south");
  expect(unchanged.players.south.activeDon).toBe(8);
  expect(unchanged.players.south.characters.filter(Boolean)).toHaveLength(5);
  expect(unchanged.players.south.hand.map((card) => card.cardId)).toEqual(["EB02-018"]);

  const replaced = engine.findCardInZone("south", "character", "ST01-003");
  engine.asSouth().play("EB02-018");
  engine.resolveDecision("playCharacterReplacement", { selectedIds: [replaced] }, "south");
  engine.resolveDecision(
    "effectTargetSelection",
    { selectedIds: [engine.leader("south")] },
    "south",
  );
  engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
  expect(engine.getView("south").players.north.lifeCount).toBe(1);
  expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
    "ST06-009",
    "ST06-006",
  ]);
  expect(engine.getView("south").players.south.leader.rested).toBe(true);
  expect(engine.getView("south").prompts).toHaveLength(0);
});
