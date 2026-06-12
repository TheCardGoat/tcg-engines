import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../../card-i18n";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "../../testing";

describe("end-turn trigger scope (Bug A - Simba Pride Protector)", () => {
  const endOfYourTurnGainLore = createMockCharacter({
    id: "eot-scope-source",
    name: "End Of Your Turn Scope Source",
    cost: 3,
    lore: 1,
    abilities: [
      {
        id: "eot-scope-source-1",
        name: "At End Of Your Turn",
        type: "triggered",
        trigger: {
          event: "end-turn",
          on: "YOU",
          timing: "at",
        },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        text: "At the end of your turn, gain 1 lore.",
      },
    ],
  });

  it("does NOT fire when the opponent ends their turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: endOfYourTurnGainLore, isDrying: false }],
        deck: 3,
      },
      { deck: 3 },
    );

    // p1 pass -> p1 end turn (YOU fires for p1)
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    const loreAfterOwnEndOfTurn = testEngine.getLore(PLAYER_ONE);
    expect(loreAfterOwnEndOfTurn).toBe(1);

    // p2 pass -> p2 end turn (should NOT fire for p1's source)
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    testEngine.asPlayerTwo().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreAfterOwnEndOfTurn);
  });

  it("owner:'you' target descriptor resolves only controller-owned characters at end of turn", () => {
    // Use deal-damage instead of ready so we don't collide with the next player's
    // Ready step that would reset exerted state regardless of the trigger effect.
    const allyChar = createMockCharacter({
      id: "eot-scope-ally",
      name: "EOT Scope Ally",
      cost: 2,
      strength: 2,
      willpower: 10,
    });
    const enemyChar = createMockCharacter({
      id: "eot-scope-enemy",
      name: "EOT Scope Enemy",
      cost: 2,
      strength: 2,
      willpower: 10,
    });
    const damageYoursSource = createMockCharacter({
      id: "eot-damage-source",
      name: "EOT Damage Source",
      cost: 3,
      willpower: 10,
      lore: 1,
      abilities: [
        {
          id: "eot-damage-source-1",
          name: "Punish Yours",
          type: "triggered",
          trigger: {
            event: "end-turn",
            on: "YOU",
            timing: "at",
          },
          effect: {
            amount: 1,
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
            type: "deal-damage",
          },
          text: "At the end of your turn, deal 1 damage to each of your other characters.",
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: damageYoursSource, isDrying: false },
          { card: allyChar, isDrying: false },
        ],
        deck: 3,
      },
      {
        play: [{ card: enemyChar, isDrying: false }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Controller's ally must be damaged
    expect(testEngine.asPlayerOne().getDamage(allyChar)).toBe(1);
    // Opponent's character must NOT be damaged
    expect(testEngine.asPlayerTwo().getDamage(enemyChar)).toBe(0);
  });
});

describe("challenge restriction defender-is-character (Bug B - Fa Zhou)", () => {
  it("does NOT fire when the defender is a location", () => {
    const challengeCharacterOnlyWatcher = createMockCharacter({
      id: "defender-char-only",
      name: "Defender Char Only",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "defender-char-only-1",
          name: "Char Challenge Lore",
          type: "triggered",
          trigger: {
            event: "challenge",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
            restrictions: [{ type: "defender-is-character" }],
          },
          effect: {
            amount: 3,
            target: "CONTROLLER",
            type: "gain-lore",
          },
          text: "Whenever one of your characters challenges another character, gain 3 lore.",
        },
      ],
    });

    const attacker = createMockCharacter({
      id: "defender-char-only-attacker",
      name: "Attacker",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const defenderLocation = createMockLocation({
      id: "defender-char-only-loc",
      name: "Defender Location",
      cost: 2,
      willpower: 3,
      lore: 0,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: challengeCharacterOnlyWatcher, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 3,
      },
      {
        play: [defenderLocation],
        deck: 3,
      },
    );

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().challenge(attacker, defenderLocation).success).toBe(true);
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Should NOT have gained 3 lore (defender was a location)
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
  });

  it("does NOT fire on 2nd challenge when that challenge hits a location (Fa Zhou)", () => {
    // Reproduce Fa Zhou War Hero: trigger restriction = defender-is-character,
    // condition = challenges-by-player == 2. Scenario: char->char then char->location.
    const faZhouLike = createMockCharacter({
      id: "fa-zhou-like",
      name: "Fa Zhou Like",
      cost: 3,
      strength: 2,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "fa-zhou-like-1",
          name: "Training Exercises",
          type: "triggered",
          trigger: {
            event: "challenge",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
            restrictions: [{ type: "defender-is-character" }],
          },
          condition: {
            type: "turn-metric",
            metric: "challenges-by-player",
            playerScope: "you",
            comparison: { operator: "eq", value: 2 },
          },
          effect: { amount: 3, type: "gain-lore" },
          text: "Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
        },
      ],
    });

    const attacker1 = createMockCharacter({
      id: "fa-zhou-atk1",
      name: "Attacker One",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const attacker2 = createMockCharacter({
      id: "fa-zhou-atk2",
      name: "Attacker Two",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const weakDefenderChar = createMockCharacter({
      id: "fa-zhou-weak-char",
      name: "Weak Defender Char",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const weakDefenderLocation = createMockLocation({
      id: "fa-zhou-weak-loc",
      name: "Weak Defender Loc",
      cost: 1,
      willpower: 1,
      lore: 0,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: faZhouLike, isDrying: false },
          { card: attacker1, isDrying: false },
          { card: attacker2, isDrying: false },
        ],
        deck: 3,
      },
      {
        play: [{ card: weakDefenderChar, exerted: true }, weakDefenderLocation],
        deck: 3,
      },
    );

    // challenge 1: char vs char (restriction OK -> fires, but challenges-by-player==1, condition fails)
    expect(testEngine.asPlayerOne().challenge(attacker1, weakDefenderChar).success).toBe(true);
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    const loreAfterFirst = testEngine.getLore(PLAYER_ONE);

    // challenge 2: char vs location (restriction should block trigger entirely)
    expect(testEngine.asPlayerOne().challenge(attacker2, weakDefenderLocation).success).toBe(true);
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Should NOT have gained 3 lore (defender was a location).
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreAfterFirst);
  });

  it("fires when the defender is a character", () => {
    const challengeCharacterOnlyWatcher = createMockCharacter({
      id: "defender-char-only-b",
      name: "Defender Char Only B",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "defender-char-only-b-1",
          name: "Char Challenge Lore",
          type: "triggered",
          trigger: {
            event: "challenge",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
            restrictions: [{ type: "defender-is-character" }],
          },
          effect: {
            amount: 3,
            target: "CONTROLLER",
            type: "gain-lore",
          },
          text: "Whenever one of your characters challenges another character, gain 3 lore.",
        },
      ],
    });

    const attacker = createMockCharacter({
      id: "defender-char-only-b-attacker",
      name: "Attacker B",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const defenderChar = createMockCharacter({
      id: "defender-char-only-b-defender",
      name: "Defender Char",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: challengeCharacterOnlyWatcher, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 3,
      },
      {
        play: [{ card: defenderChar, exerted: true }],
        deck: 3,
      },
    );

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().challenge(attacker, defenderChar).success).toBe(true);
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 3);
  });
});

const quester = createMockCharacter({
  id: "triggered-quester",
  name: "Triggered Quester",
  cost: 2,
  lore: 1,
});

const backupQuester = createMockCharacter({
  id: "triggered-backup-quester",
  name: "Backup Quester",
  cost: 2,
  lore: 1,
});

const printedQuestWatcher = createMockCharacter({
  id: "printed-quest-watcher",
  name: "Printed Quest Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "printed-quest-watcher-1",
      name: "Quest Watcher",
      text: "Whenever one of your characters quests, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
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

const selfBanishedWatcher = createMockCharacter({
  id: "self-banished-watcher",
  name: "Self Banished Watcher",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  abilities: [
    {
      id: "self-banished-watcher-1",
      name: "Parting Gift",
      text: "When this character is banished, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const selfInkwellWatcher = createMockCharacter({
  id: "self-inkwell-watcher",
  name: "Self Inkwell Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "self-inkwell-watcher-1",
      name: "Ink Watcher",
      text: "Whenever a card is put into your inkwell, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
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

const putChosenCharacterIntoInkwell = createMockAction({
  id: "put-chosen-character-into-inkwell",
  name: "Put Chosen Character Into Inkwell",
  cost: 2,
  text: "Put chosen character into their player's inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CHOSEN_CHARACTER",
        facedown: true,
        exerted: true,
      },
    },
  ],
});

const printedPlayWatcher = createMockCharacter({
  id: "printed-play-watcher",
  name: "Printed Play Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "printed-play-watcher-1",
      name: "Play Watcher",
      text: "Whenever you play a character or location, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: ["character", "location"],
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

const indexedPlayTrigger = createMockCharacter({
  id: "indexed-play-trigger",
  name: "Indexed Play Trigger",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "indexed-play-trigger-0",
      name: "Backup Trigger",
      text: "Whenever one of your characters quests, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
    {
      id: "indexed-play-trigger-1",
      name: "Localized Trigger",
      text: "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          duration: "until-start-of-next-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
        },
      },
    },
  ],
});

const triggeredTestLocation = createMockLocation({
  id: "triggered-test-location",
  name: "Triggered Test Location",
  cost: 2,
  lore: 1,
});

function createFloatingQuestLoreAction(id: string, name: string, amount: number): ActionCard {
  return {
    id,
    canonicalId: `ci_${id}`,
    cardType: "action",
    name,
    cost: 1,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    cardNumber: 1,
    text: `Whenever one of your characters quests this turn, gain ${amount} lore.`,
    i18n: createCardI18n(name, {
      en: {
        name,
        text: `Whenever one of your characters quests this turn, gain ${amount} lore.`,
      },
    }),
    abilities: [
      {
        type: "action",
        effect: {
          type: "create-triggered-ability",
          lifecycle: {
            kind: "floating",
            duration: "this-turn",
          },
          ability: {
            trigger: {
              event: "quest",
              on: "YOUR_CHARACTERS",
              timing: "whenever",
            },
            effect: {
              amount,
              target: "CONTROLLER",
              type: "gain-lore",
            },
          },
        },
      },
    ],
  };
}

function createGrantBodyguardAction(id: string, name: string): ActionCard {
  return {
    id,
    canonicalId: `ci_${id}`,
    cardType: "action",
    name,
    cost: 1,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    cardNumber: 2,
    text: "Chosen character gains Bodyguard until the start of your next turn.",
    i18n: createCardI18n(name, {
      en: {
        name,
        text: "Chosen character gains Bodyguard until the start of your next turn.",
      },
    }),
    abilities: [
      {
        type: "action",
        effect: {
          type: "gain-keyword",
          keyword: "Bodyguard",
          duration: "until-start-of-next-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    ],
  };
}

const floatingQuestLoreOne = createFloatingQuestLoreAction(
  "floating-quest-lore-one",
  "Floating Quest Lore One",
  1,
);

const floatingQuestLoreTwo = createFloatingQuestLoreAction(
  "floating-quest-lore-two",
  "Floating Quest Lore Two",
  2,
);

const grantTemporaryBodyguard = createGrantBodyguardAction(
  "grant-temporary-bodyguard",
  "Grant Temporary Bodyguard",
);

const oncePerTurnQuestWatcher = createMockCharacter({
  id: "once-per-turn-quest-watcher",
  name: "Once per Turn Quest Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "once-per-turn-quest-watcher-1",
      text: "Whenever one of your characters quests, gain 1 lore. Once per turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }],
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const firstTimeEachTurnQuestWatcher = createMockCharacter({
  id: "first-time-quest-watcher",
  name: "First Time Quest Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "first-time-quest-watcher-1",
      text: "The first time one of your characters quests each turn, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "first-time-each-turn" }],
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const discardQuestWatcher = createMockCharacter({
  id: "discard-quest-watcher",
  name: "Discard Quest Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "discard-quest-watcher-1",
      text: "While this is in your discard, whenever one of your characters quests, gain 1 lore.",
      type: "triggered",
      sourceZones: ["discard"],
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
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

const discardStartTurnWatcher = createMockCharacter({
  id: "discard-start-turn-watcher",
  name: "Discard Start Turn Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "discard-start-turn-watcher-1",
      text: "At the start of your turn, if this card is in your discard, gain 1 lore.",
      type: "triggered",
      sourceZones: ["discard"],
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const temporaryBodyguardWatcher = createMockCharacter({
  id: "temporary-bodyguard-watcher",
  name: "Temporary Bodyguard Watcher",
  cost: 3,
  lore: 1,
  abilities: [
    {
      id: "temporary-bodyguard-watcher-1",
      text: "Whenever one of your characters with Bodyguard is banished, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          hasKeyword: "Bodyguard",
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

const temporaryBodyguardTarget = createMockCharacter({
  id: "temporary-bodyguard-target",
  name: "Temporary Bodyguard Target",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const lethalDefender = createMockCharacter({
  id: "temporary-bodyguard-lethal-defender",
  name: "Lethal Defender",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("triggered abilities", () => {
  it("matches play triggers with multiple subject card types", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [printedPlayWatcher],
      hand: [triggeredTestLocation],
      inkwell: triggeredTestLocation.cost,
    });

    expect(testEngine.asPlayerOne().playCard(triggeredTestLocation)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("queues printed triggered abilities into the bag before they resolve", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [printedQuestWatcher, quester],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(quester).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("resolves self-banish printed triggers after the source leaves play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [selfBanishedWatcher],
      deck: 1,
    });

    expect(testEngine.asServer().manualSetDamage(selfBanishedWatcher, 2)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(selfBanishedWatcher)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not let a source trigger on its own move into the inkwell unless the trigger is explicitly self-referential", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [selfInkwellWatcher],
        deck: 1,
      },
      {
        hand: [putChosenCharacterIntoInkwell],
        inkwell: putChosenCharacterIntoInkwell.cost,
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().playCard(putChosenCharacterIntoInkwell, {
        targets: [selfInkwellWatcher],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(selfInkwellWatcher)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("lets the same player choose among multiple bag effects from one event", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [floatingQuestLoreOne, floatingQuestLoreTwo],
        inkwell: 2,
        play: [quester, backupQuester],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(floatingQuestLoreOne).success).toBe(true);
    expect(testEngine.asPlayerOne().playCard(floatingQuestLoreTwo).success).toBe(true);

    const floatingQuestLoreOneId = testEngine.findCardInstanceId(
      floatingQuestLoreOne,
      "discard",
      PLAYER_ONE,
    );
    const floatingQuestLoreTwoId = testEngine.findCardInstanceId(
      floatingQuestLoreTwo,
      "discard",
      PLAYER_ONE,
    );

    expect(testEngine.asPlayerOne().quest(quester).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().quest(backupQuester).success).toBe(false);

    const floatingQuestLoreTwoBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bagEffect) => bagEffect.sourceId === floatingQuestLoreTwoId);
    const floatingQuestLoreOneBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bagEffect) => bagEffect.sourceId === floatingQuestLoreOneId);

    expect(floatingQuestLoreTwoBag).toBeDefined();
    expect(floatingQuestLoreOneBag).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(floatingQuestLoreTwoBag!.sourceId).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 3);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
  });

  it("enforces once-per-turn triggered restrictions when bag effects resolve", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [quester, backupQuester, oncePerTurnQuestWatcher],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(quester).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().quest(backupQuester).success).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
      quester.lore + backupQuester.lore + 1,
    );
  });

  it("enforces first-time-each-turn restrictions using occurrence tracking", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [quester, backupQuester, firstTimeEachTurnQuestWatcher],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(quester).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().quest(backupQuester).success).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
      quester.lore + backupQuester.lore + 1,
    );
  });

  it("supports printed triggers from discard when sourceZones opt out of play-only defaults", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [quester],
        discard: [discardQuestWatcher],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(quester).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("still evaluates discard-sourced printed triggers at start of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        discard: [discardStartTurnWatcher],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(bagEffect?.abilityIndex).toBe(0);
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(bagEffect!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);
  });

  it("preserves printed trigger abilityIndex from bag resolution into pending effects", () => {
    const otherTarget = createMockCharacter({
      id: "indexed-play-target",
      name: "Indexed Play Target",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [indexedPlayTrigger],
        inkwell: indexedPlayTrigger.cost,
        play: [otherTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(indexedPlayTrigger).success).toBe(true);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect?.abilityIndex).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
      }).success,
    ).toBe(true);

    const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffect?.abilityIndex).toBe(1);
    expect(pendingEffect?.selectionContext?.kind).toBe("target-selection");
  });

  it("matches trigger subject keyword queries against temporary keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grantTemporaryBodyguard],
        inkwell: grantTemporaryBodyguard.cost,
        play: [temporaryBodyguardWatcher, temporaryBodyguardTarget],
        deck: 1,
      },
      {
        play: [{ card: lethalDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(grantTemporaryBodyguard, {
        targets: [temporaryBodyguardTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(temporaryBodyguardTarget, "Bodyguard")).toBe(true);

    expect(
      testEngine.asPlayerOne().challenge(temporaryBodyguardTarget, lethalDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(temporaryBodyguardTarget)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("fires during-opponent-turn banish watcher twice when two allies are banished in separate moves", () => {
    const allyA = createMockCharacter({
      id: "banish-ally-a",
      name: "Ally A",
      cost: 2,
      strength: 2,
      willpower: 3,
    });
    const allyB = createMockCharacter({
      id: "banish-ally-b",
      name: "Ally B",
      cost: 2,
      strength: 2,
      willpower: 3,
    });
    const opponentBanishWatcher = createMockCharacter({
      id: "opponent-banish-watcher",
      name: "Opponent Banish Watcher",
      cost: 3,
      lore: 1,
      willpower: 4,
      abilities: [
        {
          id: "opponent-banish-watcher-1",
          name: "WATCHER",
          text: "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
          type: "triggered",
          trigger: {
            event: "banish",
            on: "YOUR_OTHER_CHARACTERS",
            timing: "whenever",
            restrictions: [{ type: "during-turn", whose: "opponent" }],
          },
          effect: {
            amount: 1,
            type: "gain-lore",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          opponentBanishWatcher,
          { card: allyA, isDrying: false },
          { card: allyB, isDrying: false },
        ],
      },
      {},
    );

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(allyA, 10)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    expect(testEngine.asServer().manualSetDamage(allyB, 10)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
  });

  it("does not queue an end-turn trigger when a comparison condition is false", () => {
    const conditionalEndTurnWatcher = createMockCharacter({
      id: "conditional-end-turn-watcher",
      name: "Conditional End Turn Watcher",
      cost: 3,
      lore: 1,
      abilities: [
        {
          id: "conditional-end-turn-watcher-1",
          name: "Keep Up",
          text: "At the end of your turn, if an opponent has more cards in their hand than you, gain 1 lore.",
          type: "triggered",
          trigger: {
            event: "end-turn",
            on: "YOU",
            timing: "at",
          },
          condition: {
            type: "comparison",
            left: {
              type: "cards-in-hand",
              controller: "opponent",
            },
            comparison: "greater-than",
            right: {
              type: "cards-in-hand",
              controller: "you",
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

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [conditionalEndTurnWatcher],
        inkwell: conditionalEndTurnWatcher.cost,
        deck: 1,
      },
      {
        hand: [],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(conditionalEndTurnWatcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("skips end-turn triggered resolution when ability.condition requires exerted source and character is ready", () => {
    const exertedGateWatcher = createMockCharacter({
      id: "exerted-gate-eot",
      name: "Exerted Gate EOT",
      cost: 1,
      lore: 1,
      abilities: [
        {
          id: "exerted-gate-eot-1",
          name: "If Exerted Gain",
          type: "triggered",
          trigger: {
            event: "end-turn",
            on: "YOU",
            timing: "at",
          },
          condition: {
            type: "target-query",
            query: {
              selector: "all",
              reference: "source",
              filters: [{ type: "exerted" }],
            },
            comparison: { operator: "gte", value: 1 },
          },
          effect: {
            amount: 5,
            target: "CONTROLLER",
            type: "gain-lore",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: exertedGateWatcher, isDrying: false }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
