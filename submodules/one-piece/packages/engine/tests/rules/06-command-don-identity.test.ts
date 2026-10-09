import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// Native synthetic setup: make a frozen DON active through an effect. The
// payment and attachment commands below are ordinary public game actions.
function withReadyFrozenDon(run: () => void) {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: {
                player: "self",
                zones: ["costArea"],
                count: { amount: 1 },
                filters: [{ filter: "state", value: "rested" }],
              },
            },
            {
              action: "setActive",
              target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
            },
          ],
        },
      ],
    };
    run();
  } finally {
    leader.effects = saved;
  }
}
function ready(engine: OnePieceTestEngine) {
  engine.asSouth().activateMain(engine.asSouth().leader());
  engine.resolveDecision("effectTargetSelection", { selectedIds: ["rested-don:south:0"] }, "south");
  expect(engine.getView("south").players.south.activeDon).toBe(3);
}
test("Character payment chooses the physical active DON and survives JSON plus invalid retry", () => {
  withReadyFrozenDon(() => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["EB01-005"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    engine.asSouth().play("EB01-005");
    const prompt = engine.pendingDecision("commandDonPayment", "south");
    const step = prompt.steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected physical DON choice");
    expect(step.candidates).toHaveLength(3);
    expect(engine.getView("south").players.south.activeDon).toBe(3);
    expect(
      engine.getView("north").logs.filter((log) => log.message.includes("reveals Doma to play")),
    ).toHaveLength(1);
    expect(
      engine.getView("north").logs.filter((log) => log.message.includes("plays Doma")),
    ).toHaveLength(0);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    for (const invalid of [
      { seat: "north" as const, selectedIds: [step.candidates[0]!.ref.id] },
      { seat: "south" as const, selectedIds: [] },
      {
        seat: "south" as const,
        selectedIds: [step.candidates[0]!.ref.id, step.candidates[0]!.ref.id],
      },
      { seat: "south" as const, selectedIds: ["don-token:missing"] },
    ]) {
      const failure = engine.expectFailure({
        type: "resolvePrompt",
        promptId: prompt.id,
        ...invalid,
      });
      engine = OnePieceTestEngine.fromState(failure.state);
      expect(engine.pendingDecision("commandDonPayment", "south").id).toBe(prompt.id);
      expect(engine.getView("south").players.south).toMatchObject({ activeDon: 3, restedDon: 0 });
      expect(engine.findCardInZone("south", "hand", "EB01-005")).toBeTruthy();
    }
    engine.resolveDecision(
      "commandDonPayment",
      { selectedIds: [step.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(engine.asSouth().findOnField("EB01-005")).toBeTruthy();
    expect(
      engine.getView("north").logs.filter((log) => log.message.includes("plays Doma")),
    ).toHaveLength(1);
  });
});

function chooseFrozen(engine: OnePieceTestEngine, amount = 1) {
  const step = engine.pendingDecision("commandDonPayment", "south").steps[0];
  if (step?.kind !== "payCost") throw new Error("Expected DON payment");
  const frozen = step.candidates.find((c) => c.label.includes("cannot refresh"));
  if (!frozen) throw new Error("Expected visibly frozen DON");
  const other = step.candidates.filter((c) => c.ref.id !== frozen.ref.id);
  engine.resolveDecision(
    "commandDonPayment",
    { selectedIds: [frozen.ref.id, ...other.slice(0, amount - 1).map((c) => c.ref.id)] },
    "south",
  );
}

test.each(["ST01-016", "ST01-017"])(
  "normal Event/Stage %s pays once with chosen frozen DON",
  (card) => {
    withReadyFrozenDon(() => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        hand: [card],
        restedDon: 3,
        donDeckCount: 0,
      });
      ready(engine);
      const id = engine.findCardInZone("south", "hand", card);
      engine.asSouth().play(card);
      expect(engine.findCardInZone("south", "hand", card)).toBe(id);
      expect(
        engine
          .getView("north")
          .logs.filter((log) => log.sourceInstanceId === id && log.message.includes("reveals")),
      ).toHaveLength(1);
      expect(
        engine.getView("north").players.south.hand.find((c) => c.instanceId === id)?.name,
      ).toBe(getCard(card).name);
      chooseFrozen(engine, card === "ST01-017" ? 2 : 1);
      if (card === "ST01-016") engine.asSouth().chooseTargets(engine.asSouth().leader());
      expect(engine.findCardInZone("south", card === "ST01-017" ? "stage" : "trash", card)).toBe(
        id,
      );
      expect(engine.getView("south").players.south.restedDon).toBe(card === "ST01-017" ? 2 : 1);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();
      expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    });
  },
);

test("giving the frozen physical DON leaves its cost-area restriction behind", () => {
  withReadyFrozenDon(() => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    engine.asSouth().attachDon(engine.asSouth().leader(), 1);
    chooseFrozen(engine);
    expect(engine.getView("south").players.south.leader?.attachedDon).toBe(1);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 3, restedDon: 0 });
    expect(engine.getView("south").players.south.leader?.attachedDon).toBe(0);
  });
});

test("full-field replacement carries exact payment through saved rule-trash choice", () => {
  withReadyFrozenDon(() => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["EB01-005"],
      character: ["ST01-003", "ST01-004", "ST01-005", "ST01-006", "ST01-007"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    const removed = engine.asSouth().findOnField("ST01-003");
    engine.asSouth().play("EB01-005");
    chooseFrozen(engine);
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("playCharacterReplacement", { selectedIds: [removed] }, "south");
    expect(engine.findCardInZone("south", "trash", "ST01-003")).toBe(removed);
    expect(engine.asSouth().findOnField("EB01-005")).toBeTruthy();
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(1);
  });
});

test("Counter Event suspends the battle for saved physical payment and resumes the original Counter once", () => {
  withReadyFrozenDon(() => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST01-014"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    engine.asSouth().endTurn();
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    const counter = engine.findCardInZone("south", "hand", "ST01-014");
    const originalCounter = engine.pendingDecision("battleCounter", "south");
    engine.resolveDecision("battleCounter", { selectedIds: [counter] }, "south");
    const replay = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: originalCounter.id,
      selectedIds: [counter],
    });
    engine = OnePieceTestEngine.fromState(replay.state);
    expect(engine.getView("south").players.south.activeDon).toBe(3);
    expect(engine.findCardInZone("south", "hand", "ST01-014")).toBe(counter);
    expect(
      engine
        .getView("north")
        .logs.filter((log) => log.sourceInstanceId === counter && log.message.includes("reveals")),
    ).toHaveLength(1);
    expect(
      engine.getView("north").players.south.hand.find((c) => c.instanceId === counter)?.name,
    ).toBe(getCard("ST01-014").name);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    chooseFrozen(engine);
    engine.asSouth().chooseTargets(engine.asSouth().leader());
    expect(engine.findCardInZone("south", "trash", "ST01-014")).toBe(counter);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(1);
  });
});

test("choosing an unrestricted DON for payment leaves all three DON active next Refresh", () => {
  withReadyFrozenDon(() => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["EB01-005"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    engine.asSouth().play("EB01-005");
    const step = engine.pendingDecision("commandDonPayment", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected DON choice");
    const unrestricted = step.candidates.find((c) => !c.label.includes("cannot refresh"));
    if (!unrestricted) throw new Error("Expected unrestricted DON");
    engine.resolveDecision("commandDonPayment", { selectedIds: [unrestricted.ref.id] }, "south");
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 3, restedDon: 0 });
  });
});

test("whole-pool attachment and zero-cost Event do not add a source-selection prompt", () => {
  withReadyFrozenDon(() => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["OP15-075"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    engine.asSouth().play("OP15-075");
    engine.asSouth().declineOptional();
    expect(engine.getView("south").players.south.activeDon).toBe(3);
    engine.asSouth().attachDon(engine.asSouth().leader(), 3);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.leader?.attachedDon).toBe(3);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.activeDon).toBe(3);
  });
});

test("full-field Uta pays its discounted cost before rule trash removes the 10000-power condition", () => {
  withReadyFrozenDon(() => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST23-001"],
      character: ["OP01-120", "ST01-003", "ST01-004", "ST01-005", "ST01-006"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    const shanks = engine.asSouth().findOnField("OP01-120");
    engine.asSouth().play("ST23-001");
    chooseFrozen(engine, 2);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
    const prompt = engine.pendingDecision("playCharacterReplacement", "south");
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [engine.asSouth().leader()],
    });
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(failed.state)));
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
    engine.resolveDecision("playCharacterReplacement", { selectedIds: [shanks] }, "south");
    expect(engine.findCardInZone("south", "trash", "OP01-120")).toBe(shanks);
    expect(engine.asSouth().findOnField("ST23-001")).toBeTruthy();
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
  });
});

test("legacy unpaid full-field snapshot selects and locks Uta payment before trashing Shanks", () => {
  withReadyFrozenDon(() => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST23-001"],
      character: ["OP01-120", "ST01-003", "ST01-004", "ST01-005", "ST01-006"],
      restedDon: 3,
      donDeckCount: 0,
    });
    ready(engine);
    // Construct the historical serialization contract: its full-field prompt
    // has not paid yet and has neither of the new continuation fields.
    const beforePayment = structuredClone(engine.getState());
    const shanks = engine.asSouth().findOnField("OP01-120");
    engine.asSouth().play("ST23-001");
    chooseFrozen(engine, 2);
    const legacy = structuredClone(engine.getState());
    const context = legacy.promptQueue.find((p) => p.status === "pending")?.resolutionContext;
    if (context?.intent !== "playCharacterReplacement") throw new Error("Expected replacement");
    delete context.paidCost;
    delete context.sourceGeneration;
    legacy.players.south.activeDon = beforePayment.players.south.activeDon;
    legacy.players.south.restedDon = beforePayment.players.south.restedDon;
    legacy.donIdentities = beforePayment.donIdentities;
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(legacy)));
    engine.resolveDecision("playCharacterReplacement", { selectedIds: [shanks] }, "south");
    expect(engine.asSouth().findOnField("OP01-120")).toBe(shanks);
    expect(engine.getView("south").players.south.activeDon).toBe(3);
    chooseFrozen(engine, 2);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("playCharacterReplacement", { selectedIds: [shanks] }, "south");
    expect(engine.findCardInZone("south", "trash", "OP01-120")).toBe(shanks);
    expect(engine.asSouth().findOnField("ST23-001")).toBeTruthy();
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
  });
});
