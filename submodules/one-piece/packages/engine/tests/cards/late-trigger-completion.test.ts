import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

function activateDamagedLife(engine: OnePieceTestEngine) {
  engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
  engine.asNorth().activateLifeTrigger();
}

describe("late-set Life Trigger clauses", () => {
  test("OP17-117 Counter can protect a Charlotte Linlin Leader", () => {
    const engine = OnePieceTestEngine.create(
      { activeDon: 2 },
      { leaderCardId: "OP03-077", hand: ["OP17-117"], activeDon: 1, character: ["EB01-025"] },
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.asSouth().attachDon(engine.leader("south"), 2);
    engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
    engine.asNorth().chooseCounter("OP17-117");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Linlin Counter target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
    ]);
    engine.asNorth().chooseTargets(engine.leader("north"));
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test.each(["OP09-081", "OP01-001"])(
    "OP16-109 applies its Leader condition for %s",
    (leaderCardId) => {
      const engine = OnePieceTestEngine.create(
        { character: ["OP01-006", "OP01-006", "EB01-025"] },
        { leaderCardId, life: ["OP16-109"], hand: [], deck: 12 },
      );
      const deckBefore = engine.getView("north").players.north.deckCount;
      const targets = engine
        .getView("south")
        .players.south.characters.flatMap((card) =>
          card?.cardId === "OP01-006" && card.instanceId ? [card.instanceId] : [],
        );
      activateDamagedLife(engine);
      if (leaderCardId === "OP09-081") {
        const step = engine.pendingDecision("effectTargetSelection", "north").steps[0];
        if (step?.kind !== "selectEntity") throw new Error("Expected Doc Q targets.");
        expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual(targets);
        engine.resolveDecision("effectTargetSelection", { selectedIds: targets }, "north");
        expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toEqual(
          expect.arrayContaining(targets),
        );
      }
      expect(engine.getView("north").players.north.deckCount).toBe(
        deckBefore - (leaderCardId === "OP09-081" ? 1 : 0),
      );
      expect(engine.getView("north").prompts).toHaveLength(0);
    },
  );

  test("OP16-110 draws and rests a cost-6-or-less opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB01-025", "OP01-120"] },
      { life: ["OP16-110"], hand: [], deck: 12 },
    );
    const targetId = engine.findCardInZone("south", "character", "EB01-025");
    const deckBefore = engine.getView("north").players.north.deckCount;
    activateDamagedLife(engine);
    const step = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Vasco Shot target.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.asNorth().chooseTargets(targetId);
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.deckCount).toBe(deckBefore - 1);
  });

  test.each([3, 4])("OP16-111 checks Life after taking damage from %s cards", (lifeCount) => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        life: ["OP16-111", ...Array.from({ length: lifeCount - 1 }, () => "EB01-025")],
        hand: [],
      },
    );
    activateDamagedLife(engine);
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.cardId === "OP16-111"),
    ).toBe(lifeCount === 3);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeCount - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("OP16-114 activates its On K.O. effect from Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB01-025", "OP01-120"] },
      { life: ["OP16-114"], hand: [] },
    );
    const targetId = engine.findCardInZone("south", "character", "EB01-025");
    activateDamagedLife(engine);
    const step = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Laffitte target.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.asNorth().chooseTargets(targetId);
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("OP16-115 can negate an opposing Leader through the turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", character: ["EB01-025"], activeDon: 1 },
      { life: ["OP16-115"], hand: [] },
    );
    engine.asSouth().attachDon(engine.leader("south"), 1);
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(6000);
    activateDamagedLife(engine);
    engine.asNorth().chooseTargets(engine.leader("south"));
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(5000);
  });

  test("OP16-116 draws two and lets the Life owner trash one", () => {
    const engine = OnePieceTestEngine.create({}, { life: ["OP16-116"], hand: [], deck: 12 });
    const before = engine.getView("north").players.north.deckCount;
    activateDamagedLife(engine);
    expect(engine.getView("north").players.north.hand).toHaveLength(2);
    const drawn = engine.getView("north").players.north.hand[0]?.instanceId;
    if (!drawn) throw new Error("Expected a drawn card.");
    engine.asNorth().trashFromHand(drawn);
    expect(engine.getView("north").players.north.deckCount).toBe(before - 2);
    expect(engine.getView("north").players.north.hand).toHaveLength(1);
  });

  test("OP16-117 recovers a Blackbeard Pirates card, excluding the resolving Event", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        life: ["OP16-117"],
        hand: [],
        trash: ["ST27-005", "EB01-025"],
      },
    );
    const targetId = engine.findCardInZone("north", "trash", "ST27-005");
    activateDamagedLife(engine);
    const step = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Black Hole recovery.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.asNorth().chooseTargets(targetId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("OP16-119 negates a Character before K.O. so its On K.O. does not activate", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-110"] },
      { life: ["OP16-119"], hand: [] },
    );
    const targetId = engine.findCardInZone("south", "character", "OP16-110");
    const deckBefore = engine.getView("south").players.south.deckCount;
    activateDamagedLife(engine);
    engine.asNorth().chooseTargets(targetId);
    engine.asNorth().chooseTargets(targetId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test.each(["pay", "decline", "partial"])(
    "OP17-117 gives the opponent the %s decision",
    (choice) => {
      const handCount = choice === "partial" ? 2 : 3;
      const engine = OnePieceTestEngine.create(
        { character: ["EB01-025"], hand: Array.from({ length: handCount }, () => "EB01-025") },
        { life: ["OP17-117"], hand: [] },
      );
      const targetId = engine.findCardInZone("south", "character", "EB01-025");
      activateDamagedLife(engine);
      engine.resolveDecision(
        "effectActionChoice",
        { optionId: choice === "decline" ? "1" : "0" },
        "south",
      );
      if (choice !== "pay") engine.asNorth().chooseTargets(targetId);
      const view = engine.getView("south");
      expect(view.players.south.hand).toHaveLength(choice === "decline" ? 3 : 0);
      expect(view.players.south.characters.some((card) => card?.instanceId === targetId)).toBe(
        choice === "pay",
      );
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("ST27-005 recovers itself as a black card after battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP01-120"] },
      { character: [{ cardId: "ST27-005", rested: true }], trash: ["EB01-025"], hand: [] },
    );
    const teachId = engine.findCardInZone("north", "character", "ST27-005");
    engine.asSouth().attack("OP01-120", teachId);
    const step = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Teach recovery.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([teachId]);
    engine.asNorth().chooseTargets(teachId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      teachId,
    );
  });
});
