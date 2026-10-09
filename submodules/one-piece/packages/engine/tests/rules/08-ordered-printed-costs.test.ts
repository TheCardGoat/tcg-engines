import { getCard } from "@tcg/op-cards";
import type { EffectBlock } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic native costs isolate CR8-3-1-1; no exported duplicate-cost card is claimed.
function withCosts(block: Partial<EffectBlock>, run: () => void) {
  const card = getCard("EB01-005");
  const saved = card.effects;
  card.effects = {
    effects: [
      {
        trigger: "activateMain",
        actions: [{ action: "draw", player: "self", amount: 1 }],
        ...block,
      },
    ],
  };
  try {
    run();
  } finally {
    card.effects = saved;
  }
}

test.each(["south", "north"] as const)(
  "separate printed hand costs keep their choices after restore: %s",
  (seat) => {
    withCosts(
      {
        costs: [
          { cost: "trashFromHand", amount: 1 },
          { cost: "trashFromHand", amount: 1 },
        ],
      },
      () => {
        const player = {
          leaderCardId: "ST01-001",
          character: ["EB01-005"],
          hand: ["ST01-002", "ST01-003", "ST01-004"],
          deck: ["ST01-005", "ST01-006"],
        };
        let e = OnePieceTestEngine.create(
          seat === "south" ? player : {},
          seat === "north" ? player : {},
          { activeSeat: seat },
        );
        e.activateMain("EB01-005", seat);
        const first = e.findCardInZone(seat, "hand", "ST01-002");
        const second = e.findCardInZone(seat, "hand", "ST01-003");
        e.resolveDecision("effectCostTrashFromHand", { selectedIds: [first] }, seat);
        expect(e.getView(seat).players[seat].trash.map((card) => card.cardId)).toEqual([
          "ST01-002",
        ]);
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.pendingDecision("effectCostTrashFromHand", seat);
        e.resolveDecision("effectCostTrashFromHand", { selectedIds: [second] }, seat);
        expect(e.getView(seat).players[seat].trash.map((card) => card.cardId)).toEqual([
          "ST01-002",
          "ST01-003",
        ]);
        expect(e.getView(seat).players[seat].hand.map((card) => card.cardId)).toEqual([
          "ST01-004",
          "ST01-005",
        ]);
        expect(e.getView(seat).prompts).toHaveLength(0);
      },
    );
  },
);

test("different filters and amounts bind each printed hand payment separately", () => {
  withCosts(
    {
      costs: [
        { cost: "trashFromHand", amount: 1, filters: [{ filter: "name", value: "Usopp" }] },
        { cost: "trashFromHand", amount: 2, filters: [{ filter: "name", value: "Karoo" }] },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        hand: ["ST01-002", "ST01-002", "ST01-003", "ST01-003", "ST01-003", "ST01-004"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      e.resolveDecision(
        "effectCostTrashFromHand",
        { selectedIds: [e.findCardInZone("south", "hand", "ST01-002")] },
        "south",
      );
      const karoo = e
        .getView("south")
        .players.south.hand.filter((card) => card.cardId === "ST01-003")
        .map((card) => card.instanceId)
        .filter((id): id is string => id !== null)
        .slice(0, 2);
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: karoo }, "south");
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
        "ST01-003",
        "ST01-003",
      ]);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
        "ST01-003",
        "ST01-004",
        "ST01-005",
      ]);
    },
  );
});

test("repeated DON costs consume separate current resources", () => {
  withCosts(
    {
      costs: [
        { cost: "restDon", amount: 1 },
        { cost: "restDon", amount: 2 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        activeDon: 3,
        hand: [],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      const view = e.getView("south").players.south;
      expect(view.activeDon).toBe(0);
      expect(view.restedDon).toBe(3);
      expect(view.hand.map((card) => card.cardId)).toEqual(["ST01-005"]);
    },
  );
});

test("an unaffordable full list spends no prefix", () => {
  withCosts(
    {
      costs: [
        { cost: "restDon", amount: 1 },
        { cost: "trashFromHand", amount: 1 },
        { cost: "trashFromHand", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        activeDon: 1,
        hand: ["ST01-002"],
      });
      const before = e.getView("south").players.south;
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "EB01-005"),
        trigger: "activateMain",
      });
      expect(e.getView("south").players.south).toEqual(before);
    },
  );
});

test("a choice that prevents the later payment keeps the prefix and spends once-per-turn", () => {
  withCosts(
    {
      oncePerTurn: true,
      costs: [
        { cost: "trashFromHand", amount: 1 },
        { cost: "trashFromHand", amount: 1, filters: [{ filter: "name", value: "Karoo" }] },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        hand: ["ST01-002", "ST01-003"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      e.resolveDecision(
        "effectCostTrashFromHand",
        { selectedIds: [e.findCardInZone("south", "hand", "ST01-003")] },
        "south",
      );
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-003",
      ]);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(e.getView("south").prompts).toHaveLength(0);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "EB01-005"),
        trigger: "activateMain",
      });
    },
  );
});

test("a Life payment supplies a later printed hand payment", () => {
  withCosts(
    {
      costs: [
        { cost: "addLifeToHand", amount: 1, position: "top" },
        { cost: "trashFromHand", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        hand: [],
        life: ["ST01-002"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      // The only eligible hand card is paid automatically.
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-005",
      ]);
    },
  );
});

test("alternative affordability follows the common prefix and survives a saved branch choice", () => {
  withCosts(
    {
      costs: [{ cost: "addLifeToHand", amount: 1, position: "top" }],
      alternativeCosts: [
        [{ cost: "trashFromHand", amount: 1 }],
        [{ cost: "restDon", amount: 1 }],
        [{ cost: "trashFromHand", amount: 2 }],
      ],
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        activeDon: 1,
        hand: [],
        life: ["ST01-002"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      const step = e.pendingDecision("effectAlternativeCost", "south").steps[0];
      if (step?.kind !== "chooseOption") throw new Error("Expected branch choice");
      expect(step.options.map((option) => option.id)).toEqual(["0", "1"]);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectAlternativeCost", { optionId: "0" }, "south");
      // The only eligible hand card is paid automatically.
      expect(e.getView("south").players.south.activeDon).toBe(1);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-005",
      ]);
    },
  );
});

test("rest-card affordability can use a DON card before a later payment", () => {
  withCosts(
    {
      costs: [
        { cost: "restCards", amount: 2 },
        { cost: "trashFromHand", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: [{ card: getCard("EB01-005"), rested: true }],
        activeDon: 1,
        hand: ["ST01-002"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      // Leader plus DON are the only two eligible resources and pay automatically.
      expect(e.getView("south").players.south.leader.rested).toBe(true);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
    },
  );
});

test("a later partially payable entry pays its remaining matching card and skips the body", () => {
  withCosts(
    {
      oncePerTurn: true,
      costs: [
        { cost: "trashFromHand", amount: 1 },
        { cost: "trashFromHand", amount: 2, filters: [{ filter: "name", value: "Karoo" }] },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        hand: ["ST01-002", "ST01-003", "ST01-003"],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      e.resolveDecision(
        "effectCostTrashFromHand",
        { selectedIds: [e.findCardInZone("south", "hand", "ST01-003")] },
        "south",
      );
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-003",
        "ST01-003",
      ]);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test.each(["hand", "trash"] as const)(
  "a moved source leaves the payable generic %s component and later tail intact",
  (component) => {
    withCosts(
      {
        oncePerTurn: true,
        costs: [
          { cost: "trashCharacter", amount: 1 },
          component === "hand"
            ? { cost: "returnThisAndHandToDeck", handAmount: 1, position: "bottom" }
            : { cost: "returnTrashToDeck", amount: 1, includeSelf: true, position: "bottom" },
          { cost: "restDon", amount: 1 },
        ],
      },
      () => {
        let e = OnePieceTestEngine.create({
          character: ["EB01-005", "ST01-004"],
          hand: ["ST01-002", "ST01-003"],
          trash: ["ST01-006"],
          activeDon: 1,
          deck: ["ST01-005", "ST01-006"],
        });
        const source = e.findCardInZone("south", "character", "EB01-005");
        const selected =
          component === "hand" ? e.findCardInZone("south", "hand", "ST01-002") : source;
        e.asSouth().activateMain("EB01-005");
        e.resolveDecision("effectCostTrashCharacter", { selectedIds: [source] }, "south");
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision(
          component === "hand" ? "effectCostReturnHandToDeck" : "effectCostReturnTrashToDeck",
          { selectedIds: [selected] },
          "south",
        );
        const view = e.getView("south");
        expect(view.players.south.activeDon).toBe(0);
        expect(view.players.south.restedDon).toBe(1);
        expect(view.players.south.hand.map((card) => card.cardId)).toEqual(
          component === "hand" ? ["ST01-003"] : ["ST01-002", "ST01-003"],
        );
        expect(view.players.south.trash.map((card) => card.cardId)).toEqual(
          component === "hand" ? ["ST01-006", "EB01-005"] : ["ST01-006"],
        );
        expect(view.prompts).toHaveLength(0);
      },
    );
  },
);

test("an unavailable indivisible source cost does not prevent a payable tail", () => {
  withCosts(
    {
      costs: [
        { cost: "trashCharacter", amount: 1 },
        { cost: "returnThisToHand" },
        { cost: "restDon", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005", "ST01-004"],
        activeDon: 1,
        hand: [],
        deck: ["ST01-005", "ST01-006"],
      });
      const source = e.findCardInZone("south", "character", "EB01-005");
      e.asSouth().activateMain("EB01-005");
      e.resolveDecision("effectCostTrashCharacter", { selectedIds: [source] }, "south");
      expect(e.getView("south").players.south.hand).toHaveLength(0);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "EB01-005",
      ]);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("a full-field play cost keeps its cursor through replacement without repaying the prefix", () => {
  withCosts(
    {
      costs: [
        { cost: "restDon", amount: 1 },
        { cost: "playCard", amount: 1, zones: ["hand"] },
        { cost: "restDon", amount: 1 },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["EB01-005", "ST01-003", "ST01-004", "ST01-005", "ST01-006"],
        hand: ["ST01-002"],
        activeDon: 2,
        deck: ["ST01-005", "ST01-006"],
      });
      const replacement = e.findCardInZone("south", "character", "ST01-003");
      e.asSouth().activateMain("EB01-005");
      e.pendingDecision("effectPlayCharacterReplacement", "south");
      expect(e.getView("south").players.south.activeDon).toBe(1);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectPlayCharacterReplacement", { selectedIds: [replacement] }, "south");
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.restedDon).toBe(2);
      expect(
        e.getView("south").players.south.characters.some((card) => card?.cardId === "ST01-002"),
      ).toBe(true);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-005",
      ]);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("a hand-or-field cost does not require a card in hand before its payable tail", () => {
  withCosts(
    {
      costs: [
        { cost: "trashFromHand", amount: 1, fieldZones: ["character"] },
        { cost: "restDon", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        activeDon: 1,
        hand: [],
        deck: ["ST01-005", "ST01-006"],
      });
      e.asSouth().activateMain("EB01-005");
      expect(e.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "EB01-005",
      ]);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-005",
      ]);
    },
  );
});

test("partial Life orientation keeps the original top-two scope", () => {
  withCosts(
    {
      costs: [
        { cost: "turnLifeFaceUp", count: 1, position: "choice" },
        { cost: "turnLifeFaceUp", count: 2, position: "top" },
        { cost: "restDon", amount: 1 },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        life: ["ST01-002", "ST01-003", "ST01-004"],
        activeDon: 1,
        hand: [],
        deck: ["ST01-005", "ST01-006"],
      });
      const top = e.getView("judge").players.south.life[0]?.instanceId;
      if (!top) throw new Error("Expected first Life");
      e.asSouth().activateMain("EB01-005");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectCostTurnLifeFaceUp", { selectedIds: [top] }, "south");
      expect(e.getView("north").players.south.life.map((card) => card.cardId)).toEqual([
        "ST01-002",
        "ST01-003",
        null,
      ]);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.hand).toHaveLength(0);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test.each(["yes", "no"] as const)(
  "a K.O. replacement completes before the later DON payment: %s",
  (optionId) => {
    withCosts(
      {
        oncePerTurn: true,
        costs: [
          { cost: "koCharacter", amount: 1, filters: [{ filter: "name", value: "Kyros" }] },
          { cost: "restDon", amount: 1 },
        ],
      },
      () => {
        let e = OnePieceTestEngine.create({
          leaderCardId: "OP13-004",
          character: ["EB01-005", "OP04-082"],
          activeDon: 1,
          hand: [],
          deck: ["ST01-005", "ST01-006"],
        });
        e.asSouth().activateMain("EB01-005");
        e.pendingDecision("effectKoReplacement", "south");
        expect(e.getView("south").players.south.activeDon).toBe(1);
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision("effectKoReplacement", { optionId }, "south");
        expect(e.getView("south").players.south.activeDon).toBe(0);
        expect(e.getView("south").players.south.restedDon).toBe(1);
        expect(e.getView("south").players.south.handCount).toBe(optionId === "yes" ? 0 : 1);
        expect(
          e.getView("south").players.south.characters.some((card) => card?.cardId === "OP04-082"),
        ).toBe(optionId === "yes");
        expect(e.getView("south").prompts).toHaveLength(0);
        e.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: e.findCardInZone("south", "character", "EB01-005"),
          trigger: "activateMain",
        });
      },
    );
  },
);
