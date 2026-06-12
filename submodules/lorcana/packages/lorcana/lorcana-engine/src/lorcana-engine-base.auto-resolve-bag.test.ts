import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import {
  johnSilverAlienPirate,
  simbaProtectiveCub,
  stealFromTheRich,
} from "../../lorcana-cards/src/cards/001";
import { mauiHalfshark } from "../../lorcana-cards/src/cards/006";
import { donKarnageAirPirateLeader } from "../../lorcana-cards/src/cards/008";
import { createCardI18n } from "./card-i18n";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "./testing";

function createMockActionCard(params: {
  id: string;
  name: string;
  cost: number;
  text: string;
  abilities: ActionCard["abilities"];
}): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities,
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text,
      },
    }),
    cardNumber: 778,
  };
}

const quester = createMockCharacter({
  id: "auto-resolve-quester",
  name: "Auto Resolve Quester",
  cost: 2,
  lore: 1,
});

const optionalQuestWatcher = createMockCharacter({
  id: "optional-quest-watcher",
  name: "Optional Quest Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "optional-quest-watcher-1",
      name: "Optional Quest Watcher",
      text: "Whenever one of your characters quests, you may gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        type: "optional",
      },
    },
  ],
});

const opponentActionWatcher = createMockCharacter({
  id: "opponent-action-watcher",
  name: "Opponent Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "opponent-action-watcher-1",
      name: "Opponent Action Watcher",
      text: "Whenever an opponent plays an action, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "opponent",
        },
        timing: "whenever",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const targetedActionWatcher = createMockCharacter({
  id: "targeted-action-watcher",
  name: "Targeted Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "targeted-action-watcher-1",
      name: "Targeted Action Watcher",
      text: "Whenever you play an action, exert chosen character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "exert",
      },
    },
  ],
});

const optionalTargetedActionWatcher = createMockCharacter({
  id: "optional-targeted-action-watcher",
  name: "Optional Targeted Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "optional-targeted-action-watcher-1",
      name: "Optional Targeted Action Watcher",
      text: "Whenever you play an action, you may exert chosen character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
      },
    },
  ],
});

const upToTargetedActionWatcher = createMockCharacter({
  id: "up-to-targeted-action-watcher",
  name: "Up To Targeted Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "up-to-targeted-action-watcher-1",
      name: "Up To Targeted Action Watcher",
      text: "Whenever you play an action, exert up to 1 chosen character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: { upTo: 1 },
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

const constrainedBounceActionWatcher = createMockCharacter({
  id: "constrained-bounce-action-watcher",
  name: "Constrained Bounce Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "constrained-bounce-action-watcher-1",
      name: "Constrained Bounce Action Watcher",
      text: "Whenever you play an action, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            zones: ["play"],
            cardTypes: ["character", "item", "location"],
            filter: [{ type: "cost-comparison", comparison: "less-or-equal", value: 2 }],
          },
        },
      },
    },
  ],
});

const conditionalActionWatcher = createMockCharacter({
  id: "conditional-action-watcher",
  name: "Conditional Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "conditional-action-watcher-1",
      name: "Conditional Action Watcher",
      text: "Whenever you play an action, gain 1 lore if you still have 3 cards in hand.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["hand"],
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const readyWatcher = createMockCharacter({
  id: "ready-watcher",
  name: "Ready Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "ready-watcher-1",
      name: "Ready Watcher",
      text: "Whenever you ready this character, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const optionalAction = createMockActionCard({
  id: "optional-action",
  name: "Optional Action",
  cost: 1,
  text: "You may gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        type: "optional",
      },
    },
  ],
});

const simpleAction = createMockActionCard({
  id: "simple-action",
  name: "Simple Action",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

describe("LorcanaEngineBase bag auto-resolution", () => {
  it("auto-resolves a single mandatory no-target triggered bag effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, quester],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("keeps the triggered bag effect manual when action auto-resolution is explicitly disabled", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(stealFromTheRich, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("preserves suppression through suspended action resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [optionalAction],
      inkwell: optionalAction.cost,
      play: [mauiHalfshark],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(optionalAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    const actionId = testEngine.findCardInstanceId(optionalAction, "discard", PLAYER_ONE);
    const resolveEntry = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "resolveEffect");
    expect(resolveEntry).toMatchObject({
      moveType: "resolveEffect",
      public: [
        {
          key: "lorcana.effect.resolve.optionalSelection.rejected",
          values: {
            playerId: PLAYER_ONE,
            sourceCardId: actionId,
          },
        },
      ],
    });
  });

  it("does not auto-resolve when multiple same-player mandatory no-target bag effects are pending", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, mauiHalfshark],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("auto-resolves the last mandatory no-target bag effect after user resolves one of two", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, mauiHalfshark],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });

  it("authoritative turn flow auto-resolves a single mandatory no-target triggered bag effect for the next resolver", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        deck: 1,
        play: [{ card: readyWatcher, exerted: true }],
      },
    );

    expect(testEngine.asServer().passTurn(PLAYER_ONE)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);
  });

  it("keeps mandatory targeted triggers manual", () => {
    const target = createMockCharacter({
      id: "targeted-action-victim",
      name: "Targeted Action Victim",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [targetedActionWatcher],
        deck: 2,
      },
      {
        play: [target],
        deck: 2,
      },
    );

    const targetId = testEngine.findCardInstanceId(target, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [targetId],
        }),
    ).toBeSuccessfulCommand();

    const bagResolveEntry = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "resolveBag");
    expect(bagResolveEntry).toMatchObject({
      moveType: "resolveBag",
      playerId: PLAYER_ONE,
    });
  });

  it("keeps optional no-target triggers manual", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [quester, optionalQuestWatcher],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);

    expect(
      testEngine
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .find((log) => log.moveType === "resolveBag"),
    ).toMatchObject({
      moveType: "resolveBag",
      playerId: PLAYER_ONE,
    });
  });

  it("resolving optional targeted bag effect creates a pending effect for target selection", () => {
    const target = createMockCharacter({
      id: "optional-targeted-victim",
      name: "Optional Targeted Victim",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const targetId = target.id;
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [optionalTargetedActionWatcher],
        deck: 2,
      },
      {
        play: [target],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accepting the optional executes the bag immediately; the exert effect suspends
    // and creates a pending effect for target selection.
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();
    // Bag row is cleared while resolution continues via pendingEffects (no duplicate queue).
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Resolve the pending target selection.
    const resolvedTarget = testEngine.findCardInstanceId(target, "play", PLAYER_TWO);
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [resolvedTarget] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.isExerted(target)).toBe(true);
  });

  it("accepts optional targeted bag resolutions when explicit targets are provided", () => {
    const target = createMockCharacter({
      id: "optional-targeted-victim-2",
      name: "Optional Targeted Victim 2",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [optionalTargetedActionWatcher],
        deck: 2,
      },
      {
        play: [target],
        deck: 2,
      },
    );
    const targetId = testEngine.findCardInstanceId(target, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
          targets: [targetId],
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.isExerted(target)).toBe(true);
  });

  it("allows declining optional targeted bag effects without providing targets", () => {
    const target = createMockCharacter({
      id: "optional-targeted-decline-victim",
      name: "Optional Targeted Decline Victim",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [optionalTargetedActionWatcher],
        deck: 2,
      },
      {
        play: [target],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.isExerted(target)).toBe(false);
  });

  it("allows zero-target bag effects to defer selection until the pending choice", () => {
    const target = createMockCharacter({
      id: "up-to-targeted-victim",
      name: "Up To Targeted Victim",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [upToTargetedActionWatcher],
        deck: 2,
      },
      {
        play: [target],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [] })).toBeSuccessfulCommand();
    expect(testEngine.isExerted(target)).toBe(false);
  });

  it("auto-resolves up-to bag effects when there are no legal candidates", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [simpleAction],
      inkwell: simpleAction.cost,
      play: [upToTargetedActionWatcher],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("rejects explicit invalid targets after a bag effect suspends into pending target selection", () => {
    const invalidTarget = createMockCharacter({
      id: "invalid-constrained-bounce-target",
      name: "Invalid Constrained Bounce Target",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        play: [constrainedBounceActionWatcher],
        deck: 2,
      },
      {
        play: [invalidTarget],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [invalidTarget] }).success).toBe(
      false,
    );
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
  });

  it("auto-resolves a remaining deterministic bag effect after a manual bag resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        play: [mauiHalfshark, donKarnageAirPirateLeader],
        deck: 2,
      },
      {
        play: [simbaProtectiveCub],
        deck: 2,
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    const donBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find(
        (bagEffect) =>
          bagEffect.sourceId ===
          testEngine.findCardInstanceId(donKarnageAirPirateLeader, "play", PLAYER_ONE),
      );
    expect(donBag).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donBag!.sourceId, {
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not auto-resolve bag effects controlled by another player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        deck: 2,
      },
      {
        play: [opponentActionWatcher],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);

    expect(
      testEngine
        .asPlayerTwo()
        .resolvePendingByCard(testEngine.asPlayerTwo().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);

    expect(
      testEngine
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .find((log) => log.moveType === "resolveBag"),
    ).toMatchObject({
      moveType: "resolveBag",
      playerId: PLAYER_TWO,
    });
  });

  it("auto-accepts a single mandatory opponent-chooser trigger from the bag", () => {
    const opponentChooserQuestWatcher = createMockCharacter({
      id: "opponent-chooser-quest-watcher",
      name: "Opponent Chooser Quest Watcher",
      cost: 2,
      lore: 1,
      abilities: [
        {
          id: "opponent-chooser-quest-watcher-1",
          name: "Opponent Chooser Quest Watcher",
          text: "Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
          type: "triggered",
          trigger: {
            event: "quest",
            on: "SELF",
            timing: "whenever",
          },
          effect: {
            type: "scry",
            amount: 1,
            target: "EACH_OPPONENT",
            chooser: "OPPONENT",
            revealAll: true,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 1,
                filter: { type: "card-type", cardType: "character" },
                reveal: true,
              },
              {
                zone: "deck-bottom",
                remainder: true,
                reveal: true,
              },
            ],
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [opponentChooserQuestWatcher],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Quest — opponent must resolve the EACH_OPPONENT scry; bag clears while pending holds the flow.
    expect(testEngine.asPlayerOne().quest(opponentChooserQuestWatcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects().length).toBeGreaterThan(0);
  });

  it("does not auto-accept a single mandatory controller-chooser trigger from the bag", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [quester, targetedActionWatcher],
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        deck: 2,
      },
      {
        play: [
          createMockCharacter({
            id: "target-for-no-auto",
            name: "Target",
            cost: 2,
            strength: 2,
            willpower: 2,
            lore: 1,
          }),
        ],
        deck: 2,
      },
    );

    // Play action — the single mandatory trigger needs the controller to pick targets,
    // so it should NOT auto-accept
    expect(testEngine.asPlayerOne().playCard(simpleAction)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  describe("scry with cards-under-self amount (bagEffectNeedsPlayerDecision runtime override)", () => {
    const cardsUnderScryWatcher = createMockCharacter({
      id: "cards-under-scry-watcher",
      name: "Cards Under Scry Watcher",
      cost: 2,
      lore: 1,
      abilities: [
        {
          id: "cards-under-scry-watcher-1",
          name: "Cards Under Scry",
          text: "Whenever this character quests, look at the top card of your deck for each card under this character. Put each character card into your hand and the rest on the bottom of your deck.",
          type: "triggered",
          trigger: { event: "quest", on: "SELF", timing: "whenever" },
          effect: {
            type: "scry",
            amount: { type: "cards-under-self" },
            destinations: [
              { zone: "hand", min: 0, filter: { type: "card-type", cardType: "character" } },
              { zone: "deck-bottom", remainder: true },
            ],
          },
        },
      ],
    });

    it("auto-drains the bag when the deck is empty (no cards to reveal)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          {
            card: cardsUnderScryWatcher,
            cardsUnder: [createMockCharacter({ id: "under-1", name: "Under", cost: 1 })],
          },
        ],
        deck: [], // empty deck — engine should auto-drain without waiting for player
      });

      expect(testEngine.asPlayerOne().quest(cardsUnderScryWatcher)).toBeSuccessfulCommand();

      // Engine detects deckSize=0 and auto-drains the bag; no pending decision left.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
    });

    it("auto-drains the bag when cards-under-self resolves to 0 (no cards under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cardsUnderScryWatcher], // no cards stacked under
        deck: 3,
      });

      // The triggered ability has no has-card-under condition here, so the bag IS created.
      // bagEffectNeedsPlayerDecision should detect scryAmount=0 and return false → auto-drain.
      expect(testEngine.asPlayerOne().quest(cardsUnderScryWatcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
    });
  });

  it("auto-drains bag for for-each-opponent wrapping a nested chooser: OPPONENT scry", () => {
    const forEachOpponentNestedOpponentChooser = createMockCharacter({
      id: "for-each-opp-nested-opp-chooser",
      name: "For Each Opponent Nested Opponent Chooser",
      cost: 2,
      lore: 1,
      abilities: [
        {
          id: "for-each-opp-nested-opp-chooser-1",
          name: "For Each Opponent Nested Opponent Chooser",
          text: "When this character quests, each opponent reveals the top card of their deck. The opponent chooses to put it into their hand or on the bottom of their deck.",
          type: "triggered",
          trigger: {
            event: "quest",
            on: "SELF",
            timing: "when",
          },
          effect: {
            type: "for-each-opponent",
            effect: {
              type: "scry",
              amount: 1,
              target: "EACH_OPPONENT",
              chooser: "OPPONENT",
              revealAll: true,
              destinations: [
                {
                  zone: "hand",
                  min: 0,
                  max: 1,
                  filter: { type: "card-type", cardType: "character" },
                  reveal: true,
                },
                {
                  zone: "deck-bottom",
                  remainder: true,
                  reveal: true,
                },
              ],
            },
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [forEachOpponentNestedOpponentChooser],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Quest — bag should auto-drain because all decisions are deferred to the opponent.
    expect(
      testEngine.asPlayerOne().quest(forEachOpponentNestedOpponentChooser),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    // Pending effect should exist for the opponent to resolve the scry destination.
    expect(testEngine.asPlayerTwo().getPendingEffects().length).toBeGreaterThan(0);
  });

  it("does not queue bag effects when their trigger condition fails", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [simpleAction],
      inkwell: simpleAction.cost,
      play: [conditionalActionWatcher],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(simpleAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);

    // Board-state conditions (like target-query checking hand size) are evaluated
    // at trigger time. Since playing the action reduced the hand below 3 cards,
    // the condition fails and the ability is not queued.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // No additional lore gained — condition was false at trigger time
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
