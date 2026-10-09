import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("ST13 Ace search places the selected Character face-up and trashes only face-up Life", () => {
  const engine = OnePieceTestEngine.create({
    leaderCardId: "ST13-002",
    activeDon: 2,
    deck: ["ST01-012", "ST01-002", "ST01-002", "ST01-002", "ST01-002", "ST01-002"],
    life: ["ST01-002"],
  });
  engine.attachDon(engine.leader("south"), 2);
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  const selected = engine.findCardInZone("south", "deck", "ST01-012");
  engine.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
  const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
  if (order?.kind !== "orderItems") throw Error("Expected remainder order");
  engine.asSouth().orderCards(
    "effectSearchRemainderOrder",
    order.candidates.map((c) => c.ref.id),
  );
  expect(engine.getView("north").players.south.life[0]?.cardId).toBe("ST01-012");
  engine.endTurn();
  expect(engine.getView("south").players.south.lifeCount).toBe(1);
  expect(engine.getView("south").players.south.trash.some((c) => c.instanceId === selected)).toBe(
    true,
  );
});

test.each([false, true])(
  "Luffy damage replacement suppresses Trigger only for face-up Life: %s",
  (faceUp) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST13-003", life: [{ cardId: "ST01-014", faceUp, publicKnowledge: faceUp }] },
      { character: [{ cardId: "ST01-012", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const life = e.findCardInZone("south", "life", "ST01-014");
    const deckBefore = e.getView("south").players.south.deckCount;
    e.asNorth().attack("ST01-012", e.leader("south"));
    if (!faceUp) {
      expect(e.pendingDecision("lifeTrigger", "south")).toBeDefined();
    } else {
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.handCount).toBe(0);
      expect(e.getView("south").players.south.deckCount).toBe(deckBefore + 1);
      expect(e.getState().players.south.deck.at(-1)).toBe(life);
    }
  },
);

test("10-1-3-1 and 8-1-3-4-2: active Banish replaces the hand move before defending Luffy", () => {
  const e = OnePieceTestEngine.create(
    {
      leaderCardId: "ST13-003",
      life: [{ cardId: "ST01-014", faceUp: true, publicKnowledge: true }],
    },
    { character: [{ cardId: "OP01-067", playedOnTurn: 0 }] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack("OP01-067", e.leader("south"));
  expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST01-014");
  expect(e.getView("south").prompts).toHaveLength(0);
});

test.each(["top", "bottom"])(
  "ST13 FAQ: Makino replaced %s cost does not reorder Life after snapshot",
  (position) => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      hand: ["ST13-012"],
      activeDon: 1,
      life: [
        { cardId: "ST02-002", faceUp: true, publicKnowledge: true },
        "ST02-006",
        { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
      ],
    });
    const original = e.getView("judge").players.south.life.map((c) => c.instanceId);
    e.playCard("ST13-012");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostAddLifeToHand", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.expectFailure({ type: "resolvePrompt", seat: "south", promptId: p.id, optionId: "middle" });
    e.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "south");
    const paid = position === "top" ? original[0] : original.at(-1);
    expect(e.getState().players.south.deck.at(-1)).toBe(paid);
    expect(e.getView("judge").players.south.life.map((c) => c.instanceId)).toEqual(
      original.filter((id) => id !== paid),
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getState().capabilityHistory).toHaveLength(0);
  },
);

test("ST13 FAQ: Reject deals damage then Luffy replaces the independent own Life add", () => {
  const e = OnePieceTestEngine.create(
    {
      leaderCardId: "ST13-003",
      hand: ["OP06-116"],
      activeDon: 4,
      life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }],
    },
    { life: ["ST02-006"] },
  );
  const ownLife = e.findCardInZone("south", "life", "ST02-002");
  e.playCard("OP06-116");
  e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
  expect(e.getView("south").players.north.lifeCount).toBe(0);
  expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toContain("ST02-006");
  expect(e.getView("south").players.south.handCount).toBe(0);
  expect(e.getState().players.south.deck.at(-1)).toBe(ownLife);
  expect(e.getView("south").prompts).toHaveLength(0);
});

test("Luffy replaces effect damage too, before the Life Trigger decision", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["OP06-116"], activeDon: 4, life: ["ST02-002"] },
    {
      leaderCardId: "ST13-003",
      life: [{ cardId: "ST01-014", faceUp: true, publicKnowledge: true }],
    },
  );
  const life = e.findCardInZone("north", "life", "ST01-014");
  e.playCard("OP06-116");
  e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
  expect(e.getView("north").players.north.handCount).toBe(0);
  expect(e.getState().players.north.deck.at(-1)).toBe(life);
  expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST02-002");
  expect(e.getView("south").prompts).toHaveLength(0);
});

test.each(["yes", "no"])(
  "8-3-1-7: Sabo field-to-Life cost replacement %s across snapshot",
  (optionId) => {
    // Explicit rules fixture: real Sabo cost; a self-owned replacement without
    // an opponent-effect gate isolates replacement-sensitive cost completion.
    const kid = getCard("ST02-013");
    const original = kid.effects;
    try {
      kid.effects = {
        replacementEffects: [
          {
            replacedEvent: "removeFromField",
            eventFilter: { targetSelf: true },
            replacementAction: { action: "trashThisCard" },
          },
        ],
      };
      let e = OnePieceTestEngine.create({
        leaderCardId: "ST13-001",
        activeDon: 1,
        character: ["ST02-013", "ST02-002"],
      });
      const paid = e.findCardInZone("south", "character", "ST02-013");
      const recipient = e.findCardInZone("south", "character", "ST02-002");
      const basePower = e.getView("south").players.south.characters[1]?.power;
      e.attachDon(e.leader("south"), 1);
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
      const p = e.pendingDecision("effectRemovalReplacement", "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: p.id,
        optionId: "invalid",
      });
      e.resolveDecision("effectRemovalReplacement", { optionId }, "south");
      if (optionId === "no") e.asSouth().chooseTargets(recipient);
      expect(e.getView("south").players.south.trash.some((c) => c.instanceId === paid)).toBe(
        optionId === "yes",
      );
      expect(e.getView("north").players.south.life.some((c) => c.instanceId === paid)).toBe(
        optionId === "no",
      );
      expect(e.getView("south").players.south.characters[1]?.power).toBe(
        (basePower ?? 0) + (optionId === "no" ? 2000 : 0),
      );
      expect(e.getView("south").prompts).toHaveLength(0);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      });
      expect(e.getState().capabilityHistory).toHaveLength(0);
    } finally {
      kid.effects = original;
    }
  },
);

test("10-2-13-5: a replaced Life cost spends its once-per-turn activation", () => {
  // Synthetic timing variant of real Makino: isolates the general cost rule.
  const makino = getCard("ST13-012");
  const original = makino.effects;
  const block = original?.effects?.[0];
  if (!block) throw Error("Expected Makino effect");
  try {
    makino.effects = { effects: [{ ...block, trigger: "activateMain", oncePerTurn: true }] };
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      character: ["ST13-012"],
      life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }, "ST02-006"],
    });
    const source = e.findCardInZone("south", "character", "ST13-012");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: source,
      trigger: "activateMain",
    });
  } finally {
    makino.effects = original;
  }
});

test("Life-to-hand prohibition stops the move before a Luffy replacement can apply", () => {
  // Synthetic coexistence fixture: Atmos's printed Leader gate cannot normally
  // coexist with Luffy. Test the two independent rules without changing cards.
  const luffy = getCard("ST13-003");
  const original = luffy.effects;
  try {
    luffy.effects = {
      ...original,
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "cannotBeRemoved",
              target: { player: "self", zones: ["life"], count: { amount: "all" } },
              duration: "thisTurn",
              bySource: "ownEffect",
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-003",
        hand: ["OP06-116", "ST13-012"],
        activeDon: 5,
        life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }],
      },
      { life: ["ST02-006"] },
    );
    const life = e.findCardInZone("south", "life", "ST02-002");
    e.asSouth().activateMain(e.leader("south"));
    e.playCard("OP06-116");
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.life[0]?.instanceId).toBe(life);
    e.playCard("ST13-012");
    expect(e.getView("south").players.south.life[0]?.instanceId).toBe(life);
    expect(e.getView("south").prompts).toHaveLength(0);
  } finally {
    luffy.effects = original;
  }
});
