import { describe, expect, it } from "bun:test";
import type { ActionAbilityDefinition, ActionCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../../../card-i18n";
import {
  arielOnHumanLegs,
  minnieMouseAlwaysClassy,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  stitchNewDog,
  theQueenWickedAndVain,
} from "../../../../../lorcana-cards/src/cards/001";
import { tianasPalaceJazzRestaurant } from "../../../../../lorcana-cards/src/cards/003";
import {
  dumptruckKarnagesSecondMate,
  madDogKarnagesFirstMate,
  walkThePlank,
} from "../../../../../lorcana-cards/src/cards/008";
import { ingeniousDevice } from "../../../../../lorcana-cards/src/cards/010";
import type { CommandFailure } from "#core";
import type { ActivatedAbilityDefinition, StaticAbilityDefinition } from "../../../types";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../../testing";

const fillerCard = createMockCharacter({
  id: "activate-ability-filler",
  name: "Filler",
  cost: 1,
});

const namedActivatedAbilityCharacter = createMockCharacter({
  id: "named-activated-ability-character",
  name: "Named Ability Character",
  cost: 5,
  abilities: [
    {
      id: "named-activated-ability",
      name: "I SUMMON THEE",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "I SUMMON THEE {E} — Draw a card.",
    } satisfies ActivatedAbilityDefinition,
  ],
});

const autoSkipTargetAbilitySource = createMockCharacter({
  id: "auto-skip-target-ability-source",
  name: "Auto Skip Target Ability Source",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "auto-skip-target-ability",
      name: "HOP IN",
      type: "activated",
      text: "HOP IN {E} - Put this character under one of your characters or locations with Boost.",
      cost: { exert: true },
      effect: {
        type: "put-under",
        source: "this-card",
        under: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character", "location"],
          filter: [{ type: "has-keyword", keyword: "Boost" }],
        },
      },
    } satisfies ActivatedAbilityDefinition,
  ],
});

const boostTarget = createMockCharacter({
  id: "boost-target",
  name: "Boost Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [{ type: "keyword", keyword: "Boost", value: 1, text: "Boost +1" }],
});

const nonBoostTarget = createMockCharacter({
  id: "non-boost-target",
  name: "Non Boost Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const discardChosenDealDamageCharacter = createMockCharacter({
  id: "discard-chosen-deal-damage",
  name: "Discard Chosen Deal Damage",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  abilities: [
    {
      id: "discard-chosen-deal-damage-1",
      name: "GOOD AIM",
      type: "activated",
      cost: { discardCards: 1, discardChosen: true },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
      text: "GOOD AIM",
    } satisfies ActivatedAbilityDefinition,
  ],
});

const discardChosenOpposingTarget = createMockCharacter({
  id: "discard-chosen-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const upToTargetAbilitySource = createMockCharacter({
  id: "up-to-target-ability-source",
  name: "Up To Target Ability Source",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "up-to-target-ability",
      name: "MAYBE EXERT",
      type: "activated",
      text: "MAYBE EXERT {E} - Exert up to one chosen opposing character.",
      cost: { exert: true },
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
    } satisfies ActivatedAbilityDefinition,
  ],
});

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
    cardNumber: 777,
  };
}

describe("activateAbility", () => {
  describe("discardChosen discard cost", () => {
    it("requires explicit discard card ids when discardChosen is true even if only one card is eligible", () => {
      const handOnly = createMockCharacter({
        id: "dc-hand-only",
        name: "Only Hand Card",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [discardChosenDealDamageCharacter],
          hand: [handOnly],
          deck: [fillerCard],
        },
        {
          play: [discardChosenOpposingTarget],
          deck: [fillerCard],
        },
      );

      const result = engine.asPlayerOne().activateAbility(discardChosenDealDamageCharacter, {
        targets: [discardChosenOpposingTarget],
      }) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("ABILITY_COST_SELECTION_MISSING");
    });

    it("succeeds with explicit discard and records discardCardIds on the move log", () => {
      const handOnly = createMockCharacter({
        id: "dc-hand-explicit",
        name: "Hand Explicit",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [discardChosenDealDamageCharacter],
          hand: [handOnly],
          deck: [fillerCard],
        },
        {
          play: [discardChosenOpposingTarget],
          deck: [fillerCard],
        },
      );

      const playerOne = engine.asPlayerOne();
      const sourceInstanceId = engine.findCardInstanceId(
        discardChosenDealDamageCharacter,
        "play",
        "p1",
      );
      const discardInstanceId = engine.findCardInstanceId(handOnly, "hand", "p1");

      expect(
        playerOne.activateAbility(discardChosenDealDamageCharacter, {
          costs: { discardCards: [handOnly] },
          targets: [discardChosenOpposingTarget],
        }).success,
      ).toBe(true);

      const logs = engine.getServerEngine().getRuntime().getMoveLogHistory();
      const abilityLog = logs.find(
        (log) =>
          log.moveType === "activateAbility" &&
          log.public.some(
            (message) =>
              message.key === "lorcana.ability.activated.named.discardCost" &&
              message.values.cardId === sourceInstanceId,
          ),
      );
      expect(abilityLog?.moveType).toBe("activateAbility");
      const abilityMessage = abilityLog?.public.find(
        (message) => message.key === "lorcana.ability.activated.named.discardCost",
      );
      expect(abilityMessage?.values).toMatchObject({
        cardId: sourceInstanceId,
        abilityName: "GOOD AIM",
        discardCardIds: [discardInstanceId],
      });
    });
  });

  it("returns CARD_DRYING for exert abilities on drying characters", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [namedActivatedAbilityCharacter],
      inkwell: namedActivatedAbilityCharacter.cost,
      deck: [fillerCard],
    });

    expect(engine.asPlayerOne().playCard(namedActivatedAbilityCharacter).success).toBe(true);

    const result = engine
      .asPlayerOne()
      .activateAbility(namedActivatedAbilityCharacter, "I SUMMON THEE") as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("CARD_DRYING");
  });

  it("resolves a named activated ability after the character is dry", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [namedActivatedAbilityCharacter],
        inkwell: namedActivatedAbilityCharacter.cost,
        deck: [
          createMockCharacter({ id: "player-one-filler-1", name: "Player One Filler 1", cost: 1 }),
          createMockCharacter({ id: "player-one-filler-2", name: "Player One Filler 2", cost: 1 }),
        ],
      },
      {
        deck: [
          createMockCharacter({ id: "opponent-filler-1", name: "Opponent Filler 1", cost: 1 }),
          createMockCharacter({ id: "opponent-filler-2", name: "Opponent Filler 2", cost: 1 }),
        ],
      },
    );

    const playerOne = engine.asPlayerOne();
    expect(playerOne.playCard(namedActivatedAbilityCharacter).success).toBe(true);
    expect(playerOne.passTurn().success).toBe(true);
    expect(engine.asPlayerTwo().passTurn().success).toBe(true);

    expect(playerOne.getZonesCardCount().hand).toBe(1);

    const result = playerOne.activateAbility(namedActivatedAbilityCharacter, "I SUMMON THEE");

    expect(result.success).toBe(true);
    expect(playerOne.getZonesCardCount().hand).toBe(2);
    expect(playerOne.isExerted(namedActivatedAbilityCharacter)).toBe(true);

    const runtime = engine.getServerEngine().getRuntime();
    expect(
      runtime
        .getPublishedGameEvents()
        .some(
          ({ event }) =>
            event.kind === "CUSTOM" &&
            event.customType === "abilityActivated" &&
            event.data?.abilityName === "I SUMMON THEE",
        ),
    ).toBe(true);
    expect(runtime.getMoveLogHistory().some((log) => log.moveType === "activateAbility")).toBe(
      true,
    );
  });

  it("fails cleanly when ability lookup misses on a multi-ability card", () => {
    const multiAbilityCard = createMockCharacter({
      id: "multi-ability-character",
      name: "Multi Ability",
      cost: 2,
      abilities: [
        {
          id: "multi-1",
          name: "FIRST ABILITY",
          type: "activated",
          cost: { exert: true },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          text: "FIRST ABILITY {E} — Draw a card.",
        } satisfies ActivatedAbilityDefinition,
        {
          id: "multi-2",
          name: "SECOND ABILITY",
          type: "activated",
          cost: {},
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          text: "SECOND ABILITY — Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [multiAbilityCard],
      deck: [fillerCard],
    });

    const result = engine
      .asPlayerOne()
      .activateAbility(multiAbilityCard, "MISSING ABILITY") as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("ABILITY_NOT_FOUND");
  });

  it("resolves an activated ability by its titled text prefix when the ability has no explicit name", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: theQueenWickedAndVain, isDrying: false }],
        deck: [fillerCard],
      },
      {
        deck: [fillerCard],
      },
    );

    const result = engine.asPlayerOne().activateAbility(theQueenWickedAndVain, "I SUMMON THEE");

    expect(result.success).toBe(true);
    expect(engine.asPlayerOne().isExerted(theQueenWickedAndVain)).toBe(true);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("rejects unmatched selectors on a single-ability card", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [namedActivatedAbilityCharacter],
      deck: [fillerCard],
    });

    const result = engine
      .asPlayerOne()
      .activateAbility(namedActivatedAbilityCharacter, "WRONG ABILITY") as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("ABILITY_NOT_FOUND");
  });

  it("does not recreate usage meta after a banish-self cost moves the source out of play", () => {
    const selfBanishingCharacter = createMockCharacter({
      id: "self-banishing-character",
      name: "Self Banisher",
      cost: 1,
      abilities: [
        {
          id: "self-banish-draw",
          name: "VANISHING TRICK",
          type: "activated",
          cost: { banishSelf: true },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          text: "VANISHING TRICK — Banish this character to draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [selfBanishingCharacter],
      deck: [fillerCard],
    });

    const playerOne = engine.asPlayerOne();
    const cardId = playerOne.getCard(selfBanishingCharacter).id;

    const result = playerOne.activateAbility(selfBanishingCharacter, "VANISHING TRICK");

    expect(result.success).toBe(true);
    expect(playerOne.getCardZone(selfBanishingCharacter)).toBe("discard");

    const cardMeta = engine.getAuthoritativeState().ctx.zones.private.cardMeta[cardId];
    expect(cardMeta?.activatedAbilityUses).toBeUndefined();
    expect(cardMeta?.activatedAbilityUseTurns).toBeUndefined();
  });

  it("forwards banish-character cost selections through the player-scoped activateAbility helper", () => {
    const sacrifice = createMockCharacter({
      id: "banish-character-cost-sacrifice",
      name: "Banish Character Cost Sacrifice",
      cost: 1,
    });

    const victim = createMockCharacter({
      id: "banish-character-cost-victim",
      name: "Banish Character Cost Victim",
      cost: 1,
    });

    const banishCharacterCostSource = createMockCharacter({
      id: "banish-character-cost-source",
      name: "Banish Character Cost Source",
      cost: 4,
      abilities: [
        {
          id: "banish-character-cost-ability",
          name: "PAY THE PRICE",
          type: "activated",
          cost: {
            banishCharacter: true,
          },
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          text: "PAY THE PRICE Banish one of your characters — Banish chosen opposing character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [banishCharacterCostSource, sacrifice],
      },
      {
        play: [victim],
      },
    );

    expect(
      engine.asPlayerOne().activateAbility(banishCharacterCostSource, {
        ability: "PAY THE PRICE",
        costs: {
          banishCharacters: [sacrifice],
        },
        targets: [victim],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(sacrifice)).toBe("discard");
    expect(engine.asPlayerTwo().getCardZone(victim)).toBe("discard");
  });

  it("captures the source location in the banish trigger snapshot for banish-self costs", () => {
    const selfBanishingCharacter = createMockCharacter({
      id: "self-banishing-character-at-location",
      name: "Self Banisher At Location",
      cost: 1,
      abilities: [
        {
          id: "self-banish-draw",
          name: "VANISHING TRICK",
          type: "activated",
          cost: { banishSelf: true },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          text: "VANISHING TRICK - Banish this character to draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        tianasPalaceJazzRestaurant,
        { card: selfBanishingCharacter, atLocation: tianasPalaceJazzRestaurant },
      ],
      deck: [fillerCard],
    });

    const playerOne = engine.asPlayerOne();
    const locationId = playerOne.getCard(tianasPalaceJazzRestaurant).id;
    const sourceId = playerOne.getCard(selfBanishingCharacter).id;
    const runtime = engine.getServerEngine().getRuntime();
    const runtimeState = runtime.getState();
    runtimeState.ctx.zones.private.cardMeta[sourceId] = {
      ...runtimeState.ctx.zones.private.cardMeta[sourceId],
      atLocationId: locationId,
    };

    const result = playerOne.activateAbility(selfBanishingCharacter, "VANISHING TRICK");
    const publishedBanishEvent = engine.getPublishedGameEvents().find(({ event }) => {
      if (event.kind !== "CUSTOM" || event.customType !== "cardBanished") {
        return false;
      }

      return event.data.cardId === sourceId;
    });
    const snapshotValue =
      publishedBanishEvent?.event.kind === "CUSTOM" &&
      publishedBanishEvent.event.customType === "cardBanished"
        ? publishedBanishEvent.event.data.snapshot
        : undefined;
    const subjectAtLocationId =
      snapshotValue &&
      typeof snapshotValue === "object" &&
      !Array.isArray(snapshotValue) &&
      typeof snapshotValue.subjectAtLocationId === "string"
        ? snapshotValue.subjectAtLocationId
        : undefined;

    expect(result.success).toBe(true);
    expect(subjectAtLocationId).toBe(locationId);
  });

  it("queues self-banish printed triggers only after a suspended activated ability finishes resolving", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [minnieMouseAlwaysClassy],
        inkwell: [mickeyMouseTrueFriend, simbaProtectiveCub],
        deck: [stitchNewDog],
        play: [ingeniousDevice],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    const playerOne = engine.asPlayerOne();
    const playerTwo = engine.asPlayerTwo();

    expect(playerOne.activateAbility(ingeniousDevice, "SURPRISE PACKAGE").success).toBe(true);
    expect(playerOne.getCardZone(ingeniousDevice)).toBe("discard");
    expect(playerOne.getPendingEffects()).toHaveLength(1);
    expect(playerOne.getBagCount()).toBe(0);
    expect(playerTwo.getDamage(arielOnHumanLegs)).toBe(0);

    expect(playerOne.respondWith(minnieMouseAlwaysClassy).success).toBe(true);
    expect(playerOne.getPendingEffects()).toHaveLength(0);
    expect(playerOne.getBagCount()).toBe(1);

    const [bagEffect] = playerOne.getBagEffects();
    expect(
      playerOne.resolvePendingByCard(bagEffect!.sourceId, { targets: [arielOnHumanLegs] }).success,
    ).toBe(true);
    expect(playerTwo.getDamage(arielOnHumanLegs)).toBe(3);
  });

  it("validates and resolves chosen-target activated abilities", () => {
    const source = createMockCharacter({
      id: "ability-source",
      name: "Ability Source",
      cost: 2,
      abilities: [
        {
          id: "ready-target",
          name: "READY TARGET",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const target = createMockCharacter({
      id: "ability-target",
      name: "Ability Target",
      cost: 2,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source, { card: target, exerted: true }],
    });

    const playerOne = engine.asPlayerOne();
    const sourceId = playerOne.getCard(source).id;
    const targetId = playerOne.getCard(target).id;

    const result = engine.executeMoveForView("playerOne", "activateAbility", {
      args: {
        cardId: sourceId,
        abilityIndex: 0,
        targets: [targetId],
      },
    });

    expect(result.success).toBe(true);
    expect(playerOne.isExerted(target)).toBe(false);
  });

  it("accepts effectSelections.effectSlotCardIds as an alternative to targets for chosen-target abilities", () => {
    const source = createMockCharacter({
      id: "ability-source-slot",
      name: "Ability Source Slot",
      cost: 2,
      abilities: [
        {
          id: "ready-target-slot",
          name: "READY TARGET SLOT",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET SLOT - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const target = createMockCharacter({
      id: "ability-target-slot",
      name: "Ability Target Slot",
      cost: 2,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source, { card: target, exerted: true }],
    });

    const playerOne = engine.asPlayerOne();
    const sourceId = playerOne.getCard(source).id;
    const targetId = playerOne.getCard(target).id;

    const result = engine.executeMoveForView("playerOne", "activateAbility", {
      args: {
        cardId: sourceId,
        abilityIndex: 0,
        effectSelections: { effectSlotCardIds: [targetId] },
      },
    });

    expect(result.success).toBe(true);
    expect(playerOne.isExerted(target)).toBe(false);
  });

  it("rejects choosing another opposing character when a do-your-worst character is a legal activated-ability target", () => {
    const johnSmith = createMockCharacter({
      id: "activated-john-smith",
      name: "John Smith",
      cost: 5,
      abilities: [
        {
          id: "activated-john-smith-bodyguard",
          keyword: "Bodyguard",
          text: "Bodyguard",
          type: "keyword",
        },
        {
          id: "activated-john-smith-do-your-worst",
          type: "static",
          text: "Opponents must choose this character for actions and abilities if able.",
          effect: {
            type: "restriction",
            target: "SELF",
            restriction: "must-be-chosen-for-effects",
          },
        } satisfies StaticAbilityDefinition,
      ],
    });
    const otherTarget = createMockCharacter({
      id: "activated-other-target",
      name: "Activated Other Target",
      cost: 2,
    });
    const source = createMockCharacter({
      id: "activated-source-restricted",
      name: "Activated Source Restricted",
      cost: 2,
      abilities: [
        {
          id: "ready-target-restricted",
          name: "READY TARGET RESTRICTED",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET RESTRICTED - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [source],
      },
      {
        play: [
          { card: johnSmith, exerted: true },
          { card: otherTarget, exerted: true },
        ],
      },
    );

    const playerOne = engine.asPlayerOne();
    const rejectedResult = playerOne.activateAbility(source, {
      targets: [otherTarget],
    }) as CommandFailure;

    expect(rejectedResult.success).toBe(false);
    expect(rejectedResult.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");

    expect(
      playerOne.activateAbility(source, {
        targets: [johnSmith],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().isExerted(johnSmith)).toBe(false);
  });

  it("resolves named activated abilities with card targets via the scoped helper", () => {
    const source = createMockCharacter({
      id: "ability-source-helper",
      name: "Ability Source Helper",
      cost: 2,
      abilities: [
        {
          id: "ready-target-helper",
          name: "READY TARGET HELPER",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET HELPER - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const target = createMockCharacter({
      id: "ability-target-helper",
      name: "Ability Target Helper",
      cost: 2,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source, { card: target, exerted: true }],
    });

    const playerOne = engine.asPlayerOne();
    const result = playerOne.activateAbility(source, {
      ability: "READY TARGET HELPER",
      targets: [target],
    });

    expect(result.success).toBe(true);
    expect(playerOne.isExerted(target)).toBe(false);
  });

  it("rejects invalid activated-ability targets before execution", () => {
    const source = createMockCharacter({
      id: "ability-source-invalid",
      name: "Ability Source Invalid",
      cost: 2,
      abilities: [
        {
          id: "ready-target-invalid",
          name: "READY TARGET INVALID",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET INVALID - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const illegalTarget = createMockCharacter({
      id: "illegal-target",
      name: "Illegal Target",
      cost: 2,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source],
      discard: [illegalTarget],
    });

    const playerOne = engine.asPlayerOne();
    const sourceId = playerOne.getCard(source).id;
    const illegalTargetId = playerOne.getCard(illegalTarget).id;

    const result = engine.executeMoveForView("playerOne", "activateAbility", {
      args: {
        cardId: sourceId,
        abilityIndex: 0,
        targets: [illegalTargetId],
      },
    });

    expect(result.success).toBe(false);
  });

  it("preserves chosen-for-effect references in activated abilities", () => {
    const source = createMockCharacter({
      id: "ability-source-reference",
      name: "Ability Source Reference",
      cost: 2,
      abilities: [
        {
          id: "reference-target",
          name: "REFERENCE TARGET",
          type: "activated",
          cost: {},
          effect: {
            type: "sequence",
            effects: [
              { type: "exert", target: "CHOSEN_CHARACTER" },
              { type: "ready", target: "chosen-for-effect" as never },
            ],
          },
          text: "REFERENCE TARGET - Exert and then ready the chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const target = createMockCharacter({
      id: "ability-reference-target",
      name: "Ability Reference Target",
      cost: 2,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source, target],
    });

    const playerOne = engine.asPlayerOne();
    const sourceId = playerOne.getCard(source).id;
    const targetId = playerOne.getCard(target).id;

    const result = engine.executeMoveForView("playerOne", "activateAbility", {
      args: {
        cardId: sourceId,
        abilityIndex: 0,
        targets: [targetId],
      },
    });

    expect(result.success).toBe(true);
    expect(playerOne.isExerted(target)).toBe(false);
  });

  it("surfaces and resolves the temporary activated ability granted by Walk the Plank!", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [walkThePlank],
        inkwell: walkThePlank.cost,
        play: [dumptruckKarnagesSecondMate],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(engine.asServer().manualSetDamage(simbaProtectiveCub, 1)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(walkThePlank)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .hasTemporaryAbility(dumptruckKarnagesSecondMate, "banish-damaged-when-exerted"),
    ).toBe(true);

    expect(
      engine.asPlayerOne().activateAbility(dumptruckKarnagesSecondMate, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().isExerted(dumptruckKarnagesSecondMate)).toBe(true);
    expect(engine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("rejects invalid targets and expires the temporary activated ability at turn end", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [walkThePlank],
        inkwell: walkThePlank.cost,
        deck: [fillerCard, fillerCard],
        play: [madDogKarnagesFirstMate],
      },
      {
        deck: [fillerCard, fillerCard],
        play: [simbaProtectiveCub],
      },
    );

    expect(engine.asPlayerOne().playCard(walkThePlank)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(madDogKarnagesFirstMate, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(false);

    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .hasTemporaryAbility(madDogKarnagesFirstMate, "banish-damaged-when-exerted"),
    ).toBe(false);
  });

  it("surfaces and resolves a structured temporary activated ability granted by an action", () => {
    const temporaryAbilityAction = createMockActionCard({
      id: "temporary-ability-action",
      name: "Temporary Ability Action",
      cost: 1,
      text: 'Your characters gain "{E}, 1 {I} - Deal 1 damage to chosen character" this turn.',
      abilities: [
        {
          type: "action",
          text: 'Your characters gain "{E}, 1 {I} - Deal 1 damage to chosen character" this turn.',
          effect: {
            type: "grant-ability",
            duration: "this-turn",
            target: "YOUR_CHARACTERS",
            ability: {
              id: "temporary-ping",
              type: "activated",
              text: "{E}, 1 {I} - Deal 1 damage to chosen character.",
              cost: {
                exert: true,
                ink: 1,
              },
              effect: {
                type: "deal-damage",
                amount: 1,
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
              },
            },
          },
        } satisfies ActionAbilityDefinition,
      ],
    });
    const source = createMockCharacter({
      id: "temporary-ability-source",
      name: "Temporary Ability Source",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const target = createMockCharacter({
      id: "temporary-ability-target",
      name: "Temporary Ability Target",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [temporaryAbilityAction],
        inkwell: 2,
        play: [source],
      },
      {
        play: [target],
      },
    );

    expect(engine.asPlayerOne().playCard(temporaryAbilityAction)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().hasTemporaryAbility(source, "temporary-ping")).toBe(true);

    expect(
      engine.asPlayerOne().activateAbility(source, { targets: [target] }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().isExerted(source)).toBe(true);
    expect(engine.asPlayerTwo()).toHaveDamage({ card: target, value: 1 });
  });

  it("creates a pending activated target selection and skips on resolution when no legal candidates exist", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [autoSkipTargetAbilitySource],
    });

    expect(
      engine.asPlayerOne().activateAbility(autoSkipTargetAbilitySource, "HOP IN"),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(autoSkipTargetAbilitySource)).toBe(true);
    expect(engine.asPlayerOne().getCardZone(autoSkipTargetAbilitySource)).toBe("play");
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(engine.asPlayerOne().resolveNextPending()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getCardZone(autoSkipTargetAbilitySource)).toBe("play");
  });

  it("creates a pending target selection when legal activated targets exist", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [autoSkipTargetAbilitySource, boostTarget],
    });

    expect(
      engine.asPlayerOne().activateAbility(autoSkipTargetAbilitySource, "HOP IN"),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(autoSkipTargetAbilitySource)).toBe(true);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      engine.asPlayerOne().resolveNextPending({ targets: [boostTarget] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(autoSkipTargetAbilitySource)).toBe("limbo");
    expect(engine.getCardsUnder(boostTarget)).toHaveLength(1);
  });

  it("still rejects explicit illegal targets after creating a zero-candidate pending selection", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [autoSkipTargetAbilitySource],
      },
      {
        play: [nonBoostTarget],
      },
    );

    expect(
      engine.asPlayerOne().activateAbility(autoSkipTargetAbilitySource, "HOP IN"),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    const result = engine.asPlayerOne().resolveNextPending({
      targets: [nonBoostTarget],
    }) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("INVALID_ACTION_TARGET");
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(engine.asPlayerOne().getCardZone(autoSkipTargetAbilitySource)).toBe("play");
  });

  it("rejects explicit illegal targets for activated abilities even when legal targets exist", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [autoSkipTargetAbilitySource, boostTarget],
      },
      {
        play: [nonBoostTarget],
      },
    );

    const result = engine.asPlayerOne().activateAbility(autoSkipTargetAbilitySource, {
      ability: "HOP IN",
      targets: [nonBoostTarget],
    }) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("INVALID_ACTION_TARGET");
    expect(engine.asPlayerOne().getCardZone(autoSkipTargetAbilitySource)).toBe("play");
    expect(engine.asPlayerOne().isExerted(autoSkipTargetAbilitySource)).toBe(false);
  });

  it("does not create a pending target selection for up-to effects with zero legal candidates", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upToTargetAbilitySource],
    });

    expect(
      engine.asPlayerOne().activateAbility(upToTargetAbilitySource, "MAYBE EXERT"),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(upToTargetAbilitySource)).toBe(true);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("keeps optional activated effects pending until resolved, then skips when no legal targets exist", () => {
    const optionalAutoSkipSource = createMockCharacter({
      id: "optional-auto-skip-source",
      name: "Optional Auto Skip Source",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "optional-auto-skip",
          name: "OPTIONAL HOP",
          type: "activated",
          text: "OPTIONAL HOP {E} - You may put this character under one of your characters or locations with Boost.",
          cost: { exert: true },
          effect: {
            type: "optional",
            effect: {
              type: "put-under",
              source: "this-card",
              under: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character", "location"],
                filter: [{ type: "has-keyword", keyword: "Boost" }],
              },
            },
          },
        } satisfies ActivatedAbilityDefinition,
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [optionalAutoSkipSource],
    });

    expect(
      engine.asPlayerOne().activateAbility(optionalAutoSkipSource, "OPTIONAL HOP"),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(optionalAutoSkipSource)).toBe(true);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      engine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(engine.asPlayerOne().resolveNextPending()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getCardZone(optionalAutoSkipSource)).toBe("play");
  });
});
