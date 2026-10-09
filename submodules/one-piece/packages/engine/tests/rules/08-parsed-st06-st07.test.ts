import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function withParsedCard(id: string, run: () => void) {
  const card = getCard(id);
  if (card.cardType !== "character" && card.cardType !== "event") {
    throw new Error("Expected a Character or Event parser fixture.");
  }
  const original = card.effects;
  try {
    card.effects = buildCardEffects(
      `${card.effect ?? ""} ${card.trigger ? `[Trigger] ${card.trigger.replace(/^\[Trigger\]\s*/, "")}` : ""}`,
    );
    run();
  } finally {
    card.effects = original;
  }
}

test("parsed Great Eruption Life Trigger lets the attacker choose their discarded card", () => {
  withParsedCard("ST06-015", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }],
        hand: ["ST03-002", "ST03-006"],
      },
      { life: ["ST06-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chosen = engine.findCardInZone("south", "hand", "ST03-006");
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.pendingDecision("effectTrashFromHandSelection", "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [chosen] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST03-002",
    ]);
    expect(
      engine.getView("south").players.south.trash.some((card) => card.instanceId === chosen),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

test.each(["ST07-010", "ST07-015"])(
  "parsed %s opponent can choose empty Life trash after snapshot",
  (id) => {
    withParsedCard(id, () => {
      let engine = OnePieceTestEngine.create(
        { hand: [id], activeDon: 10, life: ["ST03-002"] },
        { life: [] },
      );
      engine.playCard(id);
      const choice = engine.pendingDecision("effectActionChoice", "north").steps[0];
      if (choice?.kind !== "chooseOption") throw new Error("Expected opponent's choice.");
      expect(choice.options).toHaveLength(2);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
      expect(engine.getView("south").players.south.lifeCount).toBe(1);
      expect(engine.getView("south").players.north.lifeCount).toBe(0);
      expect(engine.getView("south").prompts).toHaveLength(0);
    });
  },
);

test("parsed Soul Pocus Life Trigger lets the opponent add Life to its controller", () => {
  withParsedCard("ST07-015", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
      { life: ["ST07-015"], deck: ["ST03-002", "ST03-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    expect(engine.getView("north").players.north.lifeCount).toBe(1);
    expect(engine.getView("north").players.south.lifeCount).toBe(4);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

test("parsed Power Mochi Counter skips Life look but still saves the Leader", () => {
  withParsedCard("ST07-016", () => {
    const engine = OnePieceTestEngine.create(
      {},
      { hand: ["ST07-016"], activeDon: 1, life: ["ST03-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision(
      "battleCounter",
      { selectedIds: [engine.findCardInZone("north", "hand", "ST07-016")] },
      "north",
    );
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(1);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

test("parsed Power Mochi Trigger draws before private Life look", () => {
  withParsedCard("ST07-016", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }], life: ["ST03-006"] },
      { life: ["ST07-016"], deck: ["ST03-002", "ST03-011"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
      "ST03-002",
    ]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "north");
    expect(engine.pendingDecision("effectLookAtLifePosition", "north").message).toContain("Jinbe");
    expect(JSON.stringify(engine.getView("south").decisions)).not.toContain("Jinbe");
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

test("parsed White Out protects current Characters but not later Trigger plays", () => {
  withParsedCard("ST06-016", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }],
        hand: ["ST01-015", "ST01-015"],
        activeDon: 8,
      },
      { character: ["ST03-002"], life: ["ST06-016", "ST05-009"], deck: ["ST03-015", "ST03-011"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const old = engine.findCardInZone("north", "character", "ST03-002");
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
      "ST03-015",
    ]);
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const later = engine.findCardInZone("north", "character", "ST05-009");
    engine.playCard("ST01-015");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [old] }, "south");
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.instanceId === old),
    ).toBe(true);
    engine.playCard("ST01-015");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [later] }, "south");
    expect(
      engine.getView("north").players.north.trash.some((card) => card.instanceId === later),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
