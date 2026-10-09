import { getCard } from "@tcg/op-cards";
import type { CardEffects } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic native replacement: the exported Zoro only replaces an opponent's
// Character effect, so it cannot establish an own activation-cost interaction.
function fixture(effects: CardEffects, run: () => void) {
  const card = getCard("EB01-005");
  const saved = card.effects;
  card.effects = effects;
  try {
    run();
  } finally {
    card.effects = saved;
  }
}

test.each(["yes", "no"] as const)(
  "rest-this cost offers replacement and preserves its tail after JSON: %s",
  (optionId) => {
    fixture(
      {
        replacementEffects: [
          {
            replacedEvent: "rested",
            eventFilter: { targetSelf: true },
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
        effects: [
          {
            trigger: "activateMain",
            oncePerTurn: true,
            costs: [{ cost: "restThisCard" }, { cost: "restDon", amount: 1 }],
            actions: [{ action: "draw", player: "self", amount: 2 }],
          },
        ],
      },
      () => {
        let e = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["EB01-005"],
          activeDon: 1,
          hand: [],
          deck: ["ST01-002", "ST01-003", "ST01-004", "ST01-005"],
        });
        const source = e.findCardInZone("south", "character", "EB01-005");
        e.asSouth().activateMain("EB01-005");
        const prompt = e.pendingDecision("effectRestReplacement", "south");
        expect(e.getView("south").players.south.activeDon).toBe(1);
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.expectFailure({
          type: "resolvePrompt",
          seat: "south",
          promptId: prompt.id,
          optionId: "invalid",
        });
        e.resolveDecision("effectRestReplacement", { optionId }, "south");
        const view = e.getView("south");
        expect(view.players.south.characters[0]?.rested).toBe(optionId === "no");
        expect(view.players.south.activeDon).toBe(0);
        expect(view.players.south.restedDon).toBe(1);
        expect(view.players.south.handCount).toBe(optionId === "yes" ? 1 : 2);
        expect(view.prompts).toHaveLength(0);
        e.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: source,
          trigger: "activateMain",
        });
      },
    );
  },
);

test("mandatory replacement resting the same target does not pay the original cost", () => {
  fixture(
    {
      replacementEffects: [
        {
          replacedEvent: "rested",
          mandatory: true,
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "rest",
            target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
          },
        },
      ],
      effects: [
        {
          trigger: "activateMain",
          oncePerTurn: true,
          costs: [{ cost: "restThisCard" }, { cost: "restDon", amount: 1 }],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        activeDon: 1,
        hand: [],
        deck: 5,
      });
      e.asSouth().activateMain("EB01-005");
      const view = e.getView("south");
      expect(view.players.south.characters[0]?.rested).toBe(true);
      expect(view.players.south.activeDon).toBe(0);
      expect(view.players.south.handCount).toBe(0);
      expect(view.prompts).toHaveLength(0);
    },
  );
});

test("restCards pays its other original target after accepting one replacement", () => {
  fixture(
    {
      replacementEffects: [
        {
          replacedEvent: "rested",
          eventFilter: { targetSelf: true },
          replacementAction: { action: "draw", player: "self", amount: 1 },
        },
      ],
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "restCards",
              amount: 2,
              filters: [{ filter: "cardCategory", value: "character" }],
            },
            { cost: "restDon", amount: 1 },
          ],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["EB01-005", "ST01-004"],
        activeDon: 1,
        hand: [],
        deck: 5,
      });
      e.asSouth().activateMain("EB01-005");
      e.pendingDecision("effectRestReplacement", "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      const view = e.getView("south");
      expect(view.players.south.characters.map((card) => card?.rested).slice(0, 2)).toEqual([
        false,
        true,
      ]);
      expect(view.players.south.activeDon).toBe(0);
      expect(view.players.south.handCount).toBe(1);
      expect(view.prompts).toHaveLength(0);
    },
  );
});

test("a replacement cannot let the old payment rest a replayed sibling", () => {
  fixture(
    {
      replacementEffects: [
        {
          replacedEvent: "rested",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "sequence",
            actions: [
              {
                action: "returnToHand",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  filters: [{ filter: "name", value: "Sanji" }],
                },
              },
              {
                action: "play",
                source: { player: "self", zone: "hand" },
                count: { amount: 1 },
                filters: [{ filter: "name", value: "Sanji" }],
              },
            ],
          },
        },
      ],
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "restCards",
              amount: 2,
              filters: [{ filter: "cardCategory", value: "character" }],
            },
            { cost: "restDon", amount: 1 },
          ],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["EB01-005", "ST01-004"],
        activeDon: 1,
        hand: [],
        deck: 5,
      });
      e.asSouth().activateMain("EB01-005");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      const view = e.getView("south");
      expect(
        view.players.south.characters.find((card) => card?.cardId === "ST01-004")?.rested,
      ).toBe(false);
      expect(view.players.south.activeDon).toBe(0);
      expect(view.players.south.handCount).toBe(0);
      expect(view.prompts).toHaveLength(0);
    },
  );
});

test.each([0, 1])(
  "mixed rest payment preserves physical DON after replacement returns live slot %s",
  (returnedIndex) => {
    fixture(
      {
        replacementEffects: [
          {
            replacedEvent: "rested",
            eventFilter: { targetSelf: true },
            replacementAction: {
              action: "returnDon",
              player: "self",
              amount: 1,
              donState: "active",
            },
          },
        ],
        effects: [
          {
            trigger: "activateMain",
            oncePerTurn: true,
            costs: [
              { cost: "restCards", amount: 3 },
              { cost: "giveDon", amount: 1, recipientZones: ["leader"] },
            ],
            actions: [{ action: "draw", player: "self", amount: 2 }],
          },
        ],
      },
      () => {
        let e = OnePieceTestEngine.create({
          character: ["EB01-005"],
          activeDon: 3,
          hand: [],
          deck: 5,
        });
        const source = e.findCardInZone("south", "character", "EB01-005");
        e.asSouth().activateMain("EB01-005");
        e.resolveDecision(
          "effectCostRestCards",
          { selectedIds: ["active-don:south:0", source, "active-don:south:1"] },
          "south",
        );
        expect(e.getView("south").players.south.activeDon).toBe(2);
        expect(e.getView("south").players.south.restedDon).toBe(1);
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision(
          "effectReturnDon",
          { selectedIds: [`active-don:${returnedIndex}`] },
          "south",
        );
        const view = e.getView("south");
        expect(view.players.south.activeDon).toBe(0);
        expect(view.players.south.restedDon).toBe(returnedIndex === 0 ? 1 : 2);
        expect(view.players.south.leader.attachedDon).toBe(returnedIndex === 0 ? 1 : 0);
        expect(view.players.south.characters[0]?.rested).toBe(false);
        expect(view.players.south.handCount).toBe(0);
        expect(view.prompts).toHaveLength(0);
      },
    );
  },
);
