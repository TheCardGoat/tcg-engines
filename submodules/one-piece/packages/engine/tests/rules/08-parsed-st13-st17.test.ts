import { afterEach, beforeEach, describe, expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// Exercise generated effects through the same public commands as the authored cards.
// The importer receives Effect and Trigger separately; preserve that input boundary.
function parsedTests(id: string, tests: () => void) {
  describe(`parsed ${id}`, () => {
    const card = getCard(id);
    const original = card.effects;
    beforeEach(() => {
      const text = [
        card.effect ?? "",
        "trigger" in card && card.trigger && !card.effect?.includes("[Trigger]")
          ? `[Trigger] ${card.trigger}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      const effects = buildCardEffects(text);
      expect(effects).toBeDefined();
      card.effects = effects;
    });
    afterEach(() => {
      card.effects = original;
    });
    tests();
  });
}

parsedTests("ST13-001", () => {
  test("pays a current-power qualifying Character into face-up Life and buffs another through the opponent turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-001",
        activeDon: 2,
        character: ["ST03-003", "ST02-013", "ST02-002"],
        deck: 10,
      },
      { deck: 10 },
    );
    const paid = e.findCardInZone("south", "character", "ST03-003"),
      recipient = e.findCardInZone("south", "character", "ST02-002");
    const base = e
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === recipient)?.power;
    e.attachDon(e.leader("south"), 1);
    e.attachDon(paid, 1);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostAddCharacterToLife", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("Life cost");
    expect(p.candidates.map((c) => c.ref.id)).toContain(paid);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(recipient);
    e.resolveDecision("effectCostAddCharacterToLife", { selectedIds: [paid] }, "south");
    e.asSouth().chooseTargets(recipient);
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: paid,
      cardId: "ST03-003",
    });
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === paid)).toBe(
      false,
    );
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe((base ?? 0) + 2000);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe((base ?? 0) + 2000);
    e.asNorth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe(base);
  });
});

parsedTests("ST13-002", () => {
  test("searches only exact-cost-five Characters and trashes all face-up Life including another effect's card", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-002",
        activeDon: 2,
        deck: ["ST04-005", "ST11-004", "ST04-004", "ST02-006", "ST02-002", "ST04-012"],
        life: [{ cardId: "ST02-012", faceUp: true, publicKnowledge: true }, "ST02-002"],
      },
      { deck: 10 },
    );
    const top = e.findCardInZone("south", "deck", "ST04-005"),
      prior = e.findCardInZone("south", "life", "ST02-012"),
      hidden = e.findCardInZone("south", "life", "ST02-002");
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates).toHaveLength(5);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([top]);
    e.resolveDecision("effectSearchSelection", { selectedIds: [top] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: top,
      cardId: "ST04-005",
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([prior, top]),
    );
    expect(e.getView("south").players.south.life).toHaveLength(1);
    // Hidden-zone identity verifies only the pre-existing face-down Life remains.
    expect(e.getState().players.south.life).toEqual([hidden]);
    expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
  });
});

parsedTests("ST13-003", () => {
  test("pays a discard at zero Life then adds one cost-five Character from hand and one from trash face-up", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 0,
      hand: ["ST04-005", "ST11-004", "ST04-004"],
      trash: ["ST01-012", "ST02-006"],
    });
    const hand = e.findCardInZone("south", "hand", "ST04-005"),
      trash = e.findCardInZone("south", "trash", "ST01-012"),
      paid = e.findCardInZone("south", "hand", "ST11-004");
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("Life cards");
    expect(p.candidates.map((c) => c.ref.id)).toEqual(expect.arrayContaining([hand, trash]));
    expect(p.candidates).toHaveLength(2);
    e.asSouth().chooseTargets(hand, trash);
    expect(e.getView("north").players.south.life.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([hand, trash]),
    );
    expect(e.getView("north").players.south.life.map((c) => c.cardId)).toEqual(
      expect.arrayContaining(["ST04-005", "ST01-012"]),
    );
    // Face orientation is stored in engine state; the public identities above prove visibility.
    expect([hand, trash].every((id) => e.getState().cards[id]?.faceUp)).toBe(true);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
  });
  test("pays the discard before a nonzero Life count prevents addition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 1,
      hand: ["ST11-004"],
      trash: ["ST04-005"],
    });
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

parsedTests("ST13-005", () => {
  test("pays bottom Life, reveals exact-cost-five hand Character and puts that same card face-down atop Life", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-005", "ST13-015", "ST02-006", "ST10-016"],
      activeDon: 3,
      life: ["ST02-002", "ST02-012"],
    });
    const target = e.findCardInZone("south", "hand", "ST13-015");
    const old = e.getState().players.south.life[1]!;
    e.playCard("ST13-005", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashLife", { optionId: "bottom" }, "south");
    const step = e.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("reveal");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectRevealFromHandSelection", { selectedIds: [target] }, "south");
    expect(e.getState().players.south.life[0]).toBe(target);
    expect(e.getState().cards[target]!.faceUp).toBe(false);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(old);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
});

parsedTests("ST13-006", () => {
  test("plays one of each exact cost-two name simultaneously and rejects duplicate Sabo", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-006", "ST13-007", "ST13-007", "ST13-010", "ST13-014", "ST13-015"],
      activeDon: 5,
    });
    e.playCard("ST13-006", "south");
    const sabos = e
      .getView("south")
      .players.south.hand.filter((c) => c.cardId === "ST13-007")
      .map((c) => c.instanceId)
      .filter((id): id is string => id !== null);
    const ace = e.findCardInZone("south", "hand", "ST13-010"),
      luffy = e.findCardInZone("south", "hand", "ST13-014");
    const prompt = e.pendingDecision("effectGroupedPlaySelection", "south");
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: sabos,
    });
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    e.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [sabos[0]!, ace, luffy] },
      "south",
    );
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(4);
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c!.cardId),
    ).toEqual(expect.arrayContaining(["ST13-007", "ST13-010", "ST13-014"]));
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST13-015");
  });
});

parsedTests("ST13-009", () => {
  test("FAQ pays any face-up Life, including bottom, then trashes opponent topLife at seven hand", () => {
    let e = OnePieceTestEngine.create(
      {
        hand: ["ST13-009"],
        activeDon: 7,
        life: [
          "ST02-002",
          { cardId: "ST02-006", faceUp: true, publicKnowledge: true },
          { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
        ],
      },
      { hand: Array(7).fill("ST02-002"), life: ["ST02-006", "ST02-012"] },
    );
    const [top, middle, bottom] = e.getState().players.south.life;
    e.playCard("ST13-009", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const prompt = e.pendingDecision("effectCostTurnLifeFaceUp", "south");
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [top!],
    });
    expect(e.pendingDecision("effectCostTurnLifeFaceUp", "south").id).toBe(prompt.id);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectCostTurnLifeFaceUp", { selectedIds: [bottom!] }, "south");
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    expect(e.getState().cards[top!]!.faceUp).toBe(false);
    expect(e.getState().cards[bottom!]!.faceUp).toBe(false);
    expect(e.getState().cards[middle!]!.faceUp).toBe(true);
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("ST02-006");
    expect(e.getView("south").players.north.lifeCount).toBe(1);
  });
  test("pays Life orientation before a failing six-card hand gate", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST13-009"],
        activeDon: 7,
        life: [{ cardId: "ST02-012", faceUp: true, publicKnowledge: true }],
      },
      { hand: Array(6).fill("ST02-002") },
    );
    const id = e.getState().players.south.life[0]!;
    e.playCard("ST13-009", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getState().cards[id]!.faceUp).toBe(false);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

parsedTests("ST13-013", () => {
  test("searches all three names with cost<=5 and orders the remainder", () => {
    for (const selectedCard of ["ST13-007", "ST13-010", "ST13-015"]) {
      const e = OnePieceTestEngine.create({
        hand: ["ST13-013"],
        activeDon: 1,
        deck: ["ST13-007", "ST13-010", "ST13-015", "ST10-006", "ST02-002", "ST02-006"],
      });
      e.playCard("ST13-013", "south");
      const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("search");
      expect(
        step.candidates.find((c) => c.ref.id === e.findCardInZone("south", "deck", "ST10-006"))
          ?.legal,
      ).toBe(false);
      expect(
        step.candidates.find((c) => c.ref.id === e.findCardInZone("south", "deck", "ST02-002"))
          ?.legal,
      ).toBe(false);
      const selected = e.findCardInZone("south", "deck", selectedCard);
      if (!selected) throw Error("candidate");
      e.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
      const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (order?.kind !== "orderItems") throw Error("order");
      const ids = order.candidates.map((c) => c.ref.id).reverse();
      e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([selectedCard]);
      expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
      expect(e.getState().cards[e.getState().players.south.deck[0]!]!.cardId).toBe("ST02-006");
    }
  });
});

parsedTests("ST13-016", () => {
  test("OnPlay moves one Life to decktop, preserves remaining face states and Rush attacks", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST13-016"],
        activeDon: 6,
        life: [
          { cardId: "ST02-002", faceUp: true, publicKnowledge: true },
          { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
          "ST02-006",
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const [moved, up, down] = e.getState().players.south.life;
    e.playCard("ST13-016", "south");
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: [moved!, down!, up!] }, "south");
    expect(e.getState().players.south.deck[0]).toBe(moved);
    expect(e.getState().cards[moved!]!.faceUp).toBe(false);
    expect(e.getState().players.south.life).toEqual([down, up]);
    expect(e.getState().cards[up!]!.faceUp).toBe(true);
    expect(e.getState().cards[down!]!.faceUp).toBe(false);
    const yamato = e.findCardInZone("south", "character", "ST13-016");
    e.attachDon(yamato, 1, "south");
    e.declareAttack(yamato, e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(3);
  });
});

parsedTests("ST14-006", () => {
  test.each([
    { hand: 6, costCard: "ST09-005", draw: true },
    { hand: 7, costCard: "ST09-005", draw: false },
    { hand: 6, costCard: "ST14-005", draw: false },
  ])("requires both post-play hand and current field cost: %s", ({ hand, costCard, draw }) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST14-001",
      character: [costCard],
      hand: ["ST14-006", ...Array(hand).fill("ST12-009")],
      activeDon: 4,
      deck: ["ST14-005", "ST12-015"],
    });
    e.attachDon(e.leader("south"), 1);
    e.playCard("ST14-006");
    expect(e.getView("south").players.south.handCount).toBe(hand + (draw ? 1 : 0));
    expect(e.getView("south").players.south.deckCount).toBe(draw ? 1 : 2);
  });
});

parsedTests("ST14-014", () => {
  test("Life Trigger returns only cost-two-or-less Characters", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST14-014"], trash: ["ST12-015", "ST12-004", "ST14-015"] },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "trash", "ST12-015");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recover");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(id);
  });
});

parsedTests("ST15-003", () => {
  test("opponent-turn effect KO gives Leader temporary power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-003"] },
      { hand: ["ST04-004"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST04-004", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST15-003"));
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("Blocker battle KO protects Life but does not increase Leader power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-003"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST15-003"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST15-003");
  });
});

parsedTests("ST17-001", () => {
  test("FAQ qualifying revealed top is one of two drawn before one hand card returns top", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST17-001", "ST12-009"],
      deck: ["ST17-004", "ST12-015", "ST12-004"],
      activeDon: 4,
    });
    const revealed = e.findCardInZone("south", "deck", "ST17-004"),
      second = e.findCardInZone("south", "deck", "ST12-015"),
      put = e.findCardInZone("south", "hand", "ST12-009");
    e.playCard("ST17-001");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([revealed, second]),
    );
    e.asSouth().chooseTargets(put);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    e.endTurn("south");
    e.endTurn("north");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(put);
  });
  test("non-Warlord stays top without draw or hand return", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST17-001", "ST12-015"],
      deck: ["ST12-009", "ST12-004"],
      activeDon: 4,
    });
    const top = e.findCardInZone("south", "deck", "ST12-009");
    e.playCard("ST17-001");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.endTurn("south");
    e.endTurn("north");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(top);
  });
});

parsedTests("ST17-004", () => {
  test.each(["top", "bottom"])(
    "orders top three at %s before rested DON goes to a Warlord",
    (position) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP01-062",
        hand: ["ST17-004"],
        character: ["ST12-004"],
        deck: ["ST12-009", "ST12-015", "ST12-004", "ST14-005"],
        activeDon: 4,
      });
      const ids = ["ST12-004", "ST12-009", "ST12-015"].map((c) =>
        e.findCardInZone("south", "deck", c),
      );
      e.playCard("ST17-004");
      e.resolveDecision("effectRearrangeDeckOrder", { selectedIds: ids }, "south");
      e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("DON");
      expect(p.candidates.map((c) => c.ref.id)).toContain(e.leader("south"));
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("south", "character", "ST12-004"),
      );
      e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
      expect(e.getView("south").players.south.restedDon).toBe(3);
      // Hidden deck order has no public view array.
      const deck = e.getState().players.south.deck;
      expect(position === "top" ? deck.slice(0, 3) : deck.slice(-3)).toEqual(ids);
    },
  );
});
