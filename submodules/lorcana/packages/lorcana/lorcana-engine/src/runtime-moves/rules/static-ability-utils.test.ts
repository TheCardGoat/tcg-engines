import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../testing";
import { evaluateStaticCondition, matchesStaticAbilityTarget } from "./static-ability-utils";

describe("static ability utils", () => {
  it("applies generic character cost reductions to Shift alternate costs", () => {
    const shiftBase = createMockCharacter({
      id: "static-utils-shift-base",
      name: "Shift Target",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const shiftedCharacter = createMockCharacter({
      id: "static-utils-shift-top",
      name: "Shift Target",
      cost: 6,
      strength: 4,
      willpower: 5,
      lore: 2,
      abilities: [
        {
          id: "static-utils-shift-top-kw",
          keyword: "Shift",
          text: "Shift 4",
          type: "keyword",
          cost: { ink: 4 },
        },
      ],
    });
    const genericReducer = createMockCharacter({
      id: "static-utils-generic-reducer",
      name: "Generic Reducer",
      cost: 2,
      strength: 1,
      willpower: 2,
      lore: 1,
      abilities: [
        {
          id: "static-utils-generic-reducer-1",
          type: "static",
          text: "Your characters cost 1 ink less to play.",
          effect: {
            type: "cost-reduction",
            amount: 1,
            cardType: "character",
          },
        },
      ],
    });

    const withoutReduction = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shiftedCharacter],
      inkwell: 3,
      play: [shiftBase],
    });
    const withoutReductionShiftTarget = withoutReduction.findCardInstanceId(
      shiftBase,
      "play",
      "player_one",
    );

    expect(
      withoutReduction.asPlayerOne().playCard(shiftedCharacter, {
        cost: { cost: "shift", shiftTarget: withoutReductionShiftTarget },
      }),
    ).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );

    const withReduction = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shiftedCharacter],
      inkwell: 3,
      play: [shiftBase, genericReducer],
    });
    const withReductionShiftTarget = withReduction.findCardInstanceId(
      shiftBase,
      "play",
      "player_one",
    );

    expect(
      withReduction.asPlayerOne().playCard(shiftedCharacter, {
        cost: { cost: "shift", shiftTarget: withReductionShiftTarget },
      }),
    ).toBeSuccessfulCommand();
  });

  it("does not apply standard-only cost reductions to Shift alternate costs", () => {
    const shiftBase = createMockCharacter({
      id: "static-utils-standard-only-shift-base",
      name: "Shift Target",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const shiftedCharacter = createMockCharacter({
      id: "static-utils-standard-only-shift-top",
      name: "Shift Target",
      cost: 6,
      strength: 4,
      willpower: 5,
      lore: 2,
      abilities: [
        {
          id: "static-utils-standard-only-shift-top-kw",
          keyword: "Shift",
          text: "Shift 4",
          type: "keyword",
          cost: { ink: 4 },
        },
      ],
    });
    const standardOnlyReducer = createMockCharacter({
      id: "static-utils-standard-only-reducer",
      name: "Standard Only Reducer",
      cost: 2,
      strength: 1,
      willpower: 2,
      lore: 1,
      abilities: [
        {
          id: "static-utils-standard-only-reducer-1",
          type: "static",
          text: "Your characters cost 1 ink less to play normally.",
          effect: {
            type: "cost-reduction",
            amount: 1,
            cardType: "character",
            playMethod: "standard",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shiftedCharacter],
      inkwell: 3,
      play: [shiftBase, standardOnlyReducer],
    });
    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(shiftedCharacter, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );
  });

  it("keeps SELF-targeted static effects on the source character", () => {
    const selfBuffSource = createMockCharacter({
      id: "self-buff-source",
      name: "Self Buff Source",
      cost: 3,
      abilities: [
        {
          id: "self-buff-source-1",
          type: "static",
          text: "This character gets +1 strength.",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "SELF",
          },
        },
      ],
    });
    const otherCharacter = createMockCharacter({
      id: "other-character",
      name: "Other Character",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [otherCharacter],
      },
      {
        play: [selfBuffSource],
      },
    );

    const state = testEngine.getAuthoritativeState();
    const otherCharacterId = testEngine.asServer().getCard(otherCharacter).id as CardInstanceId;
    const selfBuffSourceId = testEngine.asServer().getCard(selfBuffSource).id as CardInstanceId;
    const definitions = new Map<CardInstanceId, typeof selfBuffSource | typeof otherCharacter>([
      [otherCharacterId, otherCharacter],
      [selfBuffSourceId, selfBuffSource],
    ]);
    const playerTwo = "player_two" as PlayerId;

    expect(
      matchesStaticAbilityTarget({
        state,
        target: "SELF",
        sourceId: selfBuffSourceId,
        targetCardId: selfBuffSourceId,
        controllerId: playerTwo,
        getDefinitionByInstanceId: (cardId) => definitions.get(cardId),
      }),
    ).toBe(true);

    expect(
      matchesStaticAbilityTarget({
        state,
        target: "SELF",
        sourceId: selfBuffSourceId,
        targetCardId: otherCharacterId,
        controllerId: playerTwo,
        getDefinitionByInstanceId: (cardId) => definitions.get(cardId),
      }),
    ).toBe(false);
  });

  it("resolves hand-active self cost reductions that count characters in play", () => {
    const partyGuestOne = createMockCharacter({
      id: "static-utils-party-guest-one",
      name: "Party Guest One",
      cost: 1,
    });
    const partyGuestTwo = createMockCharacter({
      id: "static-utils-party-guest-two",
      name: "Party Guest Two",
      cost: 1,
    });
    const selfReducer = createMockCharacter({
      id: "static-utils-self-reducer",
      name: "Self Reducer",
      cost: 7,
      abilities: [
        {
          id: "static-utils-self-reducer-1",
          type: "static",
          text: "For each character you have in play, you pay 1 ink less to play this character.",
          sourceZones: ["hand"],
          effect: {
            type: "cost-reduction",
            amount: {
              type: "characters-in-play",
              controller: "you",
            },
            cardType: "character",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [selfReducer],
      play: [partyGuestOne, partyGuestTwo],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().getCard(selfReducer).playCost).toBe(5);
    expect(testEngine.asPlayerOne().playCard(selfReducer)).toBeSuccessfulCommand();
  });

  it("grants activated abilities from static grant-ability effects to matching characters", () => {
    const grantSource = createMockCharacter({
      id: "static-utils-grant-source",
      name: "Grant Source",
      cost: 2,
      abilities: [
        {
          id: "static-utils-grant-source-1",
          name: "WAIT A MINUTE",
          type: "static",
          text: 'WAIT A MINUTE Your characters with Reckless gain "{E} - Gain 1 lore."',
          effect: {
            type: "grant-ability",
            ability: {
              id: "static-utils-grant-source-1-ability",
              name: "WAIT A MINUTE",
              type: "activated",
              cost: { exert: true },
              effect: {
                type: "gain-lore",
                amount: 1,
                target: "CONTROLLER",
              },
              text: "{E} - Gain 1 lore.",
            },
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [{ type: "has-keyword", keyword: "Reckless" }],
            },
          },
        },
      ],
    });
    const recklessCharacter = createMockCharacter({
      id: "static-utils-reckless",
      name: "Reckless Character",
      cost: 2,
      abilities: [
        {
          id: "static-utils-reckless-1",
          keyword: "Reckless",
          text: "Reckless",
          type: "keyword",
        },
      ],
    });
    const ordinaryCharacter = createMockCharacter({
      id: "static-utils-ordinary",
      name: "Ordinary Character",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: grantSource, isDrying: false },
        { card: recklessCharacter, isDrying: false },
        { card: ordinaryCharacter, isDrying: false },
      ],
    });

    const recklessId = testEngine.findCardInstanceId(recklessCharacter, "play", "player_one");
    const ordinaryId = testEngine.findCardInstanceId(ordinaryCharacter, "play", "player_one");

    expect(testEngine.asServer().getCard(recklessId).grantedAbilityTextEntries?.[0]?.title).toBe(
      "WAIT A MINUTE",
    );
    expect(testEngine.asServer().getCard(ordinaryId).grantedAbilityTextEntries).toBeUndefined();

    expect(testEngine.asPlayerOne().activateAbility(recklessId, { abilityIndex: 0 }).success).toBe(
      true,
    );
    expect(testEngine.getLore("player_one")).toBe(1);
  });
});

describe("THE-966: static during-turn vs priority.holder (Snow Fort BARRICADE)", () => {
  it("uses canonical turn owner for during-turn(opponent), not priority.holder alone", () => {
    const p1 = "player_one" as PlayerId;
    const p2 = "player_two" as PlayerId;
    const state = {
      priority: { holder: p1 },
      playerIds: [p1, p2] as const,
      status: { turn: 2, turnOwnerId: p2, otp: p1 },
      _zonesPrivate: { cardIndex: {}, zoneCards: {}, cardMeta: {} },
      G: {
        lore: { [p1]: 0, [p2]: 0 },
        turnsCompletedByPlayer: { [p1]: 1 },
      },
    };

    expect(
      evaluateStaticCondition({
        condition: { type: "during-turn", whose: "opponent" },
        state,
        controllerId: p1,
        sourceId: "snow-fort" as CardInstanceId,
        getDefinitionByInstanceId: () => undefined,
      }),
    ).toBe(true);
  });
});
