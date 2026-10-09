import { eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { applyCommand, OnePieceTestEngine } from "../../src/index.ts";

// Official OP14 FAQ: "your cards" includes active DON!! in the cost area.
describe("rest-card activation costs include DON!!", () => {
  test.each([false, true])("For Fun can pay with active DON!!; mixed=%s", (mixed) => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP14-037"], activeDon: 4 },
      { character: [{ card: eb01MountainGod018, rested: true }] },
    );
    const target = engine.findCardInZone("north", "character", "EB01-018");
    engine.playCard("OP14-037");
    engine.asSouth().acceptOptional();
    const step = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (step.kind !== "payCost") throw new Error("Expected rest-card payment.");
    const don = step.candidates
      .map((candidate) => candidate.ref.id)
      .filter((id) => id.startsWith("active-don:"));
    expect(don).toHaveLength(3);
    expect(
      step.candidates
        .filter((candidate) => candidate.ref.id.startsWith("active-don:"))
        .map((candidate) => candidate.label),
    ).toEqual(Array(3).fill("Active DON!! in cost area"));
    engine.resolveDecision(
      "effectCostRestCards",
      { selectedIds: mixed ? [engine.leader("south"), ...don.slice(0, 2)] : don },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(mixed ? 1 : 0);
    expect(south.restedDon).toBe(mixed ? 3 : 4);
    expect(south.leader.rested).toBe(mixed);
    expect(engine.getView("south").players.north.trash.map((card) => card.cardId)).toContain(
      "EB01-018",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

test("rest-card costs exclude rested, attached, and opposing DON!!", () => {
  const engine = OnePieceTestEngine.create(
    { hand: ["OP14-037"], character: ["EB01-005"], activeDon: 5, restedDon: 2 },
    { character: [{ card: eb01MountainGod018, rested: true }], activeDon: 3 },
  );
  const source = engine.findCardInZone("south", "character", "EB01-005");
  const target = engine.findCardInZone("north", "character", "EB01-018");
  engine.asSouth().attachDon(source, 2);
  engine.playCard("OP14-037");
  engine.asSouth().acceptOptional();
  const step = engine.pendingDecision("effectCostRestCards", "south").steps[0];
  if (step.kind !== "payCost") throw new Error("Expected rest-card payment.");
  const don = step.candidates
    .map((candidate) => candidate.ref.id)
    .filter((id) => id.startsWith("active-don:"));
  expect(don).toEqual(["active-don:south:0", "active-don:south:1"]);
  engine.resolveDecision(
    "effectCostRestCards",
    { selectedIds: [engine.leader("south"), source, don[0]] },
    "south",
  );
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
  expect(engine.getView("south").players.south.activeDon).toBe(1);
  expect(engine.getView("south").players.south.restedDon).toBe(4);
  expect(
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === source)
      ?.attachedDon,
  ).toBe(2);
  expect(engine.getView("south").players.north.activeDon).toBe(3);
});

test("a Character-only rest cost does not offer DON!! or the Leader", () => {
  const engine = OnePieceTestEngine.create({
    hand: ["OP01-055"],
    character: ["EB01-005", "EB01-018", "EB01-023"],
    activeDon: 4,
  });
  engine.playCard("OP01-055");
  engine.asSouth().acceptOptional();
  const step = engine.pendingDecision("effectCostRestCards", "south").steps[0];
  if (step.kind !== "payCost") throw new Error("Expected rest-card payment.");
  const candidates = step.candidates.map((candidate) => candidate.ref.id);
  expect(candidates).toHaveLength(3);
  expect(candidates).not.toContain(engine.leader("south"));
  expect(candidates.some((id) => id.startsWith("active-don:"))).toBe(false);
  engine.resolveDecision("effectCostRestCards", { selectedIds: candidates.slice(0, 2) }, "south");
  expect(engine.getView("south").players.south.handCount).toBe(2);
  expect(engine.getView("south").players.south.activeDon).toBe(3);
  expect(engine.getView("south").prompts).toHaveLength(0);
});

test.each(["duplicate", "opponent"])("invalid %s DON!! payment cannot consume cards", (kind) => {
  const engine = OnePieceTestEngine.create({ hand: ["OP14-037"], activeDon: 4 }, { activeDon: 3 });
  engine.playCard("OP14-037");
  engine.asSouth().acceptOptional();
  const prompt = engine.pendingDecision("effectCostRestCards", "south");
  const before = engine.getView("south").players.south;
  const selectedIds =
    kind === "duplicate"
      ? ["active-don:south:0", "active-don:south:0", "active-don:south:1"]
      : ["active-don:north:0", "active-don:north:1", "active-don:north:2"];
  const result = applyCommand(engine.getState(), {
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt.id,
    selectedIds,
  });
  expect(result.accepted).toBe(false);
  expect(
    result.state.eventHistory.some(
      (event) => event.type === "promptResolved" && event.payload.promptId === prompt.id,
    ),
  ).toBe(false);
  const recovered = OnePieceTestEngine.fromState(result.state);
  expect(result.state.promptQueue.find((entry) => entry.id === prompt.id)?.status).toBe("pending");
  expect(recovered.getView("south").players.south.activeDon).toBe(before.activeDon);
  expect(recovered.getView("south").players.south.restedDon).toBe(before.restedDon);
  expect(recovered.getView("south").players.north.activeDon).toBe(3);
  recovered.resolveDecision(
    "effectCostRestCards",
    { selectedIds: ["active-don:south:0", "active-don:south:1", "active-don:south:2"] },
    "south",
  );
  expect(recovered.getView("south").players.south.activeDon).toBe(0);
  expect(recovered.getView("south").prompts).toHaveLength(0);
});
