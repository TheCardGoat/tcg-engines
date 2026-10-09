import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// OP14-053 FAQ: the K.O. event observes Vista's field base power, before its
// area change removes the continuous effect. The same rule applies to effect K.O.
test.each([0, 8])(
  "effect K.O. checks Vista's observed base power with %i cards in hand",
  (handCount) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-002",
        character: ["OP14-053"],
        activeDon: 1,
        hand: Array.from({ length: handCount }, () => "EB01-005"),
        deck: ["ST02-002", "EB01-005", "EB01-018"],
      },
      { hand: ["ST01-015"], activeDon: 4 },
    );
    const vista = e.findCardInZone("south", "character", "OP14-053");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.endTurn("south");
    e.asNorth().play("ST01-015");
    e.resolveDecision("effectTargetSelection", { selectedIds: [vista] }, "north");
    expect(e.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(vista);
    expect(e.getView("south").players.south.hand).toHaveLength(
      handCount + (handCount === 0 ? 1 : 0),
    );
  },
);

test("a saved K.O. listener retains observed base power through nested event filters", () => {
  const ace = getCard("OP13-002");
  const original = ace.effects;
  try {
    // Explicit protocol fixture: make Ace's printed K.O. listener optional to
    // pause after Vista leaves the field, and nest the equivalent base-power gate.
    ace.effects = {
      ...original,
      effects: original?.effects?.map((block) =>
        block.trigger !== "whenCharacterKod"
          ? block
          : {
              ...block,
              optional: true,
              eventFilter: {
                player: "self",
                filters: [
                  {
                    filter: "anyOf",
                    filters: [
                      {
                        filter: "allOf",
                        filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
                      },
                    ],
                  },
                ],
              },
            },
      ),
    };
    let e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-002",
        character: ["OP14-053"],
        activeDon: 1,
        hand: [],
        deck: ["ST02-002", "EB01-005", "EB01-018"],
      },
      { hand: ["ST01-015"], activeDon: 4 },
    );
    const vista = e.findCardInZone("south", "character", "OP14-053");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.endTurn("south");
    e.asNorth().play("ST01-015");
    e.resolveDecision("effectTargetSelection", { selectedIds: [vista] }, "north");
    e.pendingDecision("effectOptional", "south");
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual(["ST02-002"]);
  } finally {
    ace.effects = original;
  }
});

test.each([
  { providerFirst: true, pause: false, accept: false },
  { providerFirst: false, pause: false, accept: false },
  { providerFirst: true, pause: true, accept: false },
  { providerFirst: true, pause: true, accept: true },
])(
  "simultaneous K.O. observes the full aura (provider first: $providerFirst, saved replacement: $pause, accepted: $accept)",
  ({ providerFirst, pause, accept }) => {
    const observer = getCard("OP13-002");
    const removal = getCard("EB01-005");
    const originalObserver = observer.effects;
    const originalRemoval = removal.effects;
    try {
      // Explicit rules fixture: an unlimited version of Ace's observer exposes
      // every K.O. event. Real Ju Peter supplies both Elders' 7000 base power.
      observer.effects = {
        effects: [
          {
            trigger: "whenCharacterKod",
            eventFilter: {
              player: "self",
              filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
            },
            actions: [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
      };
      removal.effects = {
        effects: [
          {
            trigger: "onPlay",
            actions: [
              {
                action: "ko",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  filters: [{ filter: "excludeSelf" }],
                },
              },
            ],
          },
        ],
      };
      const elders = pause ? ["OP13-084", "ST09-010", "OP13-083"] : ["OP13-084", "OP13-083"];
      let e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP13-002",
          character: providerFirst ? elders : elders.toReversed(),
          trash: Array.from({ length: 10 }, () => "ST02-002"),
          hand: ["EB01-005"],
          activeDon: 2,
          deck: ["ST02-002", "EB01-018", "ST02-012", "EB01-005"],
          life: ["ST02-002"],
        },
        {},
      );
      e.asSouth().play("EB01-005");
      if (pause) {
        e.pendingDecision("effectKoReplacement", "south");
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision("effectKoReplacement", { optionId: accept ? "yes" : "no" }, "south");
        if (accept) e.resolveDecision("effectLifePosition", { optionId: "top" }, "south");
      }
      while (e.getView("south").prompts.length > 0) {
        const decision = e.pendingDecision("readyEffectOrder", "south");
        const step = decision.steps[0];
        if (step?.kind !== "chooseOption")
          throw new Error("Expected simultaneous K.O. effect order");
        e.resolveDecision("readyEffectOrder", { optionId: step.options[0].id }, "south");
      }
      expect(e.getView("south").players.south.hand).toHaveLength(pause && !accept ? 3 : 2);
    } finally {
      observer.effects = originalObserver;
      removal.effects = originalRemoval;
    }
  },
);
