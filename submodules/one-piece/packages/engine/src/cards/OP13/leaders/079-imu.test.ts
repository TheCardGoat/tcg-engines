import { describe, expect, test } from "vite-plus/test";
import { getCard, eb01Doma005, op05SaintCharlos084 } from "@tcg/op-cards";

import { validateDeckForFormat } from "../../../../../cards/src/deck-validation.ts";
import { createMatch, getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

const FILLER = "OP16-096";

describe("OP13-079 Imu", () => {
  test("[Activate: Main] trashes a hand card to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, eb01Doma005],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const trashBefore = engine.getView("south").players.south.trash.length;
    const handId = engine.findCardInZone("south", "hand", FILLER);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashCard", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Imu's trash cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(handId);
    engine.resolveDecision("effectCostTrashCard", { selectedIds: [handId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.map((card) => card.instanceId)).toContain(handId);
    expect(view.trash).toHaveLength(trashBefore + 1);
    expect(view.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] alternatively trashes a {Celestial Dragons} Character to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        character: [{ card: op05SaintCharlos084, rested: true }],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const charlosId = engine.findCardInZone("south", "character", op05SaintCharlos084);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Charlos is the only legal cost, so the engine auto-pays without a prompt.
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(charlosId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("activates only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, FILLER],
        deck: [FILLER, FILLER, FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashCard", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Imu's trash cost.");
    engine.resolveDecision(
      "effectCostTrashCard",
      { selectedIds: [payment.candidates[0]!.ref.id] },
      "south",
    );

    expect(() => engine.activateEffect(leaderId, "activateMain", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the activation leaves hand, field, and trash unchanged", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, FILLER],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const before = engine.getView("south").players.south;
    const trashBefore = before.trash.length;
    const handBefore = before.hand.length;
    const deckBefore = before.deckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.hand).toHaveLength(handBefore);
    expect(after.trash).toHaveLength(trashBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is rejected with neither a {Celestial Dragons} Character nor a hand card", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP13-079", activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("plays its starting Stage before either opening hand is drawn", () => {
    const engine = OnePieceTestEngine.fromState(
      createMatch({
        firstPlayer: "south",
        shuffleDecks: false,
        openingHandSize: 5,
        players: {
          south: {
            leaderCardId: "OP13-079",
            mainDeck: ["OP13-099", ...Array(15).fill("ST06-009")],
          },
          north: { leaderCardId: "ST01-001", mainDeck: Array(16).fill("ST01-002") },
        },
      }),
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    engine.exec({ type: "chooseJoKenPo", seat: "south", choice: "paper" });
    engine.exec({ type: "chooseJoKenPo", seat: "north", choice: "rock" });
    engine.exec({ type: "chooseFirstPlayer", seat: "south", firstPlayer: "south" });
    engine.resolveDecision("startOfGameSearch", { optionId: "yes" }, "south");
    const decision = engine.pendingDecision("startOfGameStage", "south");
    const step = decision.steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected starting Stage choice");
    expect(engine.getView("south").players.north.handCount).toBe(0);
    engine.resolveDecision(
      "startOfGameStage",
      { selectedIds: [step.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP13-099");
    expect(engine.getView("south").players.south.handCount).toBe(5);
    expect(engine.getView("south").players.north.handCount).toBe(5);
  });

  test("both Imu players choose in chooser order even when choosing second, with saved decisions and invalid target retry", () => {
    let engine = OnePieceTestEngine.fromState(
      createMatch({
        firstPlayer: "north",
        shuffleDecks: false,
        openingHandSize: 5,
        players: {
          south: {
            leaderCardId: "OP13-079",
            mainDeck: ["OP13-099", ...Array(15).fill("ST06-009")],
          },
          north: {
            leaderCardId: "OP13-079",
            mainDeck: ["OP13-099", ...Array(15).fill("ST06-009")],
          },
        },
      }),
    );
    engine.exec({ type: "chooseJoKenPo", seat: "south", choice: "paper" });
    engine.exec({ type: "chooseJoKenPo", seat: "north", choice: "rock" });
    engine.exec({ type: "chooseFirstPlayer", seat: "south", firstPlayer: "north" });
    engine.expectFailure({ type: "keepHand", seat: "north" });
    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) => command.type === "resolvePrompt",
      ),
    ).toBe(true);
    expect(
      getLegalCommands(engine.getState(), "north").some(
        (command) => command.type === "resolvePrompt",
      ),
    ).toBe(false);
    engine.resolveDecision("startOfGameSearch", { optionId: "yes" }, "south");
    const prompt = engine.pendingDecision("startOfGameStage", "south");
    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) => command.type === "resolvePrompt" && command.promptId === prompt.id,
      ),
    ).toBe(true);
    const invalid = engine.findCardInZone("north", "deck", "OP13-099");
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [invalid],
    });
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision(
      "startOfGameStage",
      { selectedIds: [engine.findCardInZone("south", "deck", "OP13-099")] },
      "south",
    );
    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP13-099");
    expect(engine.getView("south").players.north.handCount).toBe(0);
    engine.resolveDecision("startOfGameSearch", { optionId: "no" }, "north");
    expect(engine.getView("north").players.north.stage).toBeNull();
    expect(engine.getView("north").players.south.handCount).toBe(5);
    expect(engine.getView("north").players.north.handCount).toBe(5);
    engine.exec({ type: "keepHand", seat: "north" });
    engine.exec({ type: "keepHand", seat: "south" });
    engine.exec({ type: "startGame", seat: "north" });
    expect(engine.getView("south").status).toBe("active");
  });

  test.each([true, false])(
    "searching shuffles even without playing a Stage (eligible Stage: %s)",
    (hasStage) => {
      const deck = hasStage
        ? ["OP13-099", "ST06-009", "ST06-011", "ST06-003", "ST06-013"]
        : ["ST06-009", "ST06-011", "ST06-003", "ST06-013"];
      const engine = OnePieceTestEngine.fromState(
        createMatch({
          firstPlayer: "south",
          shuffleDecks: false,
          openingHandSize: 0,
          seed: "Imu shuffle proof",
          players: {
            south: { leaderCardId: "OP13-079", mainDeck: deck },
            north: { leaderCardId: "ST01-001", mainDeck: Array(10).fill("ST01-002") },
          },
        }),
      );
      const original = [...engine.getState().players.south.deck];
      engine.exec({ type: "chooseJoKenPo", seat: "south", choice: "paper" });
      engine.exec({ type: "chooseJoKenPo", seat: "north", choice: "rock" });
      engine.exec({ type: "chooseFirstPlayer", seat: "south", firstPlayer: "south" });
      engine.resolveDecision("startOfGameSearch", { optionId: "yes" }, "south");
      if (hasStage) engine.resolveDecision("startOfGameStage", { selectedIds: [] }, "south");
      expect(engine.getState().players.south.deck).not.toEqual(original);
      expect([...engine.getState().players.south.deck].sort()).toEqual([...original].sort());
      expect(engine.getView("south").players.south.stage).toBeNull();
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("deck construction excludes cost-two Events, not expensive Characters or cost-one Events", () => {
    for (const [cardId, allowed] of [
      ["ST06-014", false],
      ["ST06-015", true],
      ["OP02-096", true],
    ] as const) {
      const result = validateDeckForFormat("standard", [
        { cardId: "OP13-079", quantity: 1 },
        { cardId, quantity: 1 },
      ]);
      expect(result.rules.find((rule) => rule.kind === "leader-restrictions")?.passed).toBe(
        allowed,
      );
    }
  });

  test("a starting Stage's On Play finishes before the other setup effect and opening draw", () => {
    // Synthetic timing probe: the catalog's Mary Geoise Stages have no On Play.
    const stage = getCard("OP13-099");
    const saved = stage.effects;
    try {
      stage.effects = {
        effects: [
          {
            trigger: "onPlay",
            optional: true,
            actions: [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
      };
      const engine = OnePieceTestEngine.fromState(
        createMatch({
          firstPlayer: "north",
          shuffleDecks: false,
          openingHandSize: 5,
          players: {
            south: {
              leaderCardId: "OP13-079",
              mainDeck: ["OP13-099", ...Array(15).fill("ST06-009")],
            },
            north: {
              leaderCardId: "OP13-079",
              mainDeck: ["OP13-099", ...Array(15).fill("ST06-009")],
            },
          },
        }),
      );
      engine.exec({ type: "chooseJoKenPo", seat: "south", choice: "paper" });
      engine.exec({ type: "chooseJoKenPo", seat: "north", choice: "rock" });
      engine.exec({ type: "chooseFirstPlayer", seat: "south", firstPlayer: "north" });
      engine.resolveDecision("startOfGameSearch", { optionId: "yes" }, "south");
      engine.resolveDecision(
        "startOfGameStage",
        { selectedIds: [engine.findCardInZone("south", "deck", "OP13-099")] },
        "south",
      );
      const pending = engine.pendingDecision("effectOptional", "south");
      expect(
        getLegalCommands(engine.getState(), "south").some(
          (command) => command.type === "resolvePrompt" && command.promptId === pending.id,
        ),
      ).toBe(true);
      expect(engine.getView("south").players.south.handCount).toBe(0);
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      expect(engine.getView("south").players.south.handCount).toBe(1);
      expect(engine.getView("south").players.north.handCount).toBe(0);
      engine.resolveDecision("startOfGameSearch", { optionId: "no" }, "north");
      expect(engine.getView("south").players.south.handCount).toBe(6);
      expect(engine.getView("south").players.north.handCount).toBe(5);
    } finally {
      stage.effects = saved;
    }
  });
});
