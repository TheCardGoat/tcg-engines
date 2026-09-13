import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../src/effect-parser/index.ts";

describe("empty-parser grammar gap closures", () => {
  test("named Character presence grants permanent Blocker without zone noun", () => {
    const effects = buildCardEffects("If you have a [Sarfunkel], this Character gains [Blocker].");
    expect(effects).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [{ filter: "name", value: "Sarfunkel" }],
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("named Stage presence on field grants permanent Blocker", () => {
    const effects = buildCardEffects(
      "If you have [Merry Go] on your field, this Character gains [Blocker].",
    );
    expect(effects).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "stage",
              filters: [{ filter: "name", value: "Merry Go" }],
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("mixed opponent DON!! or trait Character rest stays one mixed-zone rest", () => {
    const effects = buildCardEffects(
      "[Activate: Main] You may rest this Character: Rest up to 1 of your opponent's DON!! cards or {Animal} or {SMILE} type Characters with a cost of 3 or less.",
    );
    expect(effects?.effects?.[0]?.costs).toEqual([{ cost: "restThisCard" }]);
    expect(effects?.effects?.[0]?.optional).toBe(true);
    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["costArea", "character"],
          count: { amount: 1, upTo: true },
          filters: [
            {
              filter: "anyOf",
              filters: [
                { filter: "trait", value: "Animal", match: "includes" },
                { filter: "trait", value: "SMILE", match: "includes" },
              ],
            },
            { filter: "cost", comparison: "lte", value: 3 },
          ],
        },
      },
    ]);
  });

  test("give DON!! to attribute-qualified Leader", () => {
    const result = parseActions(
      'Give up to 2 rested DON!! cards to your "Slash" attribute Leader.',
    );
    expect(result).toEqual({
      parsed: [
        {
          action: "giveDon",
          target: {
            player: "self",
            zones: ["leader"],
            count: { amount: 1 },
            filters: [{ filter: "attribute", value: "slash" }],
          },
          count: { amount: 2, upTo: true },
          donState: "rested",
        },
      ],
      unparsed: "",
    });
  });

  test("reversed give DON!! to this Leader or Character", () => {
    const effects = buildCardEffects(
      "[Activate: Main] [Once Per Turn] Give this Leader or 1 of your Characters up to 1 rested DON!! card.",
    );
    expect(effects).toEqual({
      effects: [
        {
          trigger: "activateMain",
          oncePerTurn: true,
          actions: [
            {
              action: "giveDon",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              count: { amount: 1, upTo: true },
              donState: "rested",
            },
          ],
        },
      ],
    });
  });

  test("set active then pronoun power continuation", () => {
    const effects = buildCardEffects(
      '[Activate:Main] [Once Per Turn] (4) (You may rest the specified number of DON!! cards in your cost area): Set up to 1 of your "Supernova" or "Straw Hat Crew" type Character cards with a cost of 5 or less as active. It gains +1000 power during this turn.',
    );
    expect(effects?.effects?.[0]?.costs).toEqual([{ cost: "restDon", amount: 4 }]);
    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "setActive",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [
            {
              filter: "anyOf",
              filters: [
                { filter: "trait", value: "Supernova", match: "includes" },
                { filter: "trait", value: "Straw Hat Crew", match: "includes" },
              ],
            },
            { filter: "cost", comparison: "lte", value: 5 },
          ],
        },
      },
      {
        action: "modifyPower",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
        },
        value: 1000,
        duration: "thisTurn",
        previousActionTargets: true,
      },
    ]);
  });

  test("circled-number DON!! rest cost", () => {
    const effects = buildCardEffects(
      "[DON!! x2] [When Attacking] ① (You may rest the specified number of DON!! cards in your cost area.): Draw 1 card.",
    );
    expect(effects?.effects?.[0]).toMatchObject({
      trigger: "whenAttacking",
      conditions: [{ condition: "donAttached", amount: 2 }],
      costs: [{ cost: "restDon", amount: 1 }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    });
  });

  test("compound set Characters and Leader as active", () => {
    const result = parseActions(
      'set up to 1 of your "Fish-Man" or "Merfolk" type Characters and up to 1 of your Leader as active',
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]?.action).toBe("setActive");
    expect(result.parsed[1]).toEqual({
      action: "setActive",
      target: {
        player: "self",
        zones: ["leader"],
        count: { amount: 1, upTo: true },
      },
    });
    expect(result.unparsed).toBe("");
  });

  test("Leader dual attack/attacked trash-for-power", () => {
    const effects = buildCardEffects(
      "When this Leader attacks or is attacked, you may trash any number of Event or Stage cards from your hand. This Leader gains +1000 power during this battle for every card trashed.",
    );
    expect(effects?.effects).toHaveLength(2);
    expect(effects?.effects?.map((block) => block.trigger).sort()).toEqual([
      "onOpponentAttack",
      "whenAttacking",
    ]);
    expect(effects?.effects?.[0]?.actions[0]?.action).toBe("trashFromHand");
    expect(effects?.effects?.[0]?.actions[1]).toMatchObject({
      action: "modifyPower",
      valuePerPreviousActionTarget: 1000,
      duration: "thisBattle",
    });
  });

  test("total Character cost gated Life reveal play", () => {
    const effects = buildCardEffects(
      `[DON!! x1] [Activate: Main] [Once Per Turn] If the total cost of your Characters is 5 or more, you may return 1 of your Characters to the owner's hand: Reveal 1 card from the top of your Life cards. If that card is a "Supernovas" type Character card with a cost of 5 or less, you may play that card.`,
    );
    expect(effects?.effects?.[0]?.costs).toEqual([{ cost: "returnCharacter", amount: 1 }]);
    expect(effects?.effects?.[0]?.actions[0]?.action).toBe("revealFromLife");
    expect(JSON.stringify(effects)).toContain("zoneValueTotal");
  });

  test("compound Characters and DON!! set active", () => {
    const effects = buildCardEffects(
      `[End of Your Turn] If you have 6 or less cards in your hand, set up to 1 of your "Fish-Man" or "Merfolk" type Characters and up to 1 of your DON!! cards as active.`,
    );
    expect(effects?.effects?.[0]?.actions).toHaveLength(2);
    expect(effects?.effects?.[0]?.actions[1]).toEqual({
      action: "setActive",
      target: {
        player: "self",
        zones: ["costArea"],
        count: { amount: 1, upTo: true },
      },
    });
  });

  test("start of turn narrative activation with deck search", () => {
    const effects = buildCardEffects(
      `This effect can be activated at the start of your turn. If you have 8 or more DON!! cards on your field, look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.`,
    );
    expect(effects?.effects?.[0]?.trigger).toBe("startOfYourTurn");
    expect(effects?.effects?.[0]?.optional).toBe(true);
    expect(effects?.effects?.[0]?.actions[0]?.action).toBe("search");
  });

  test("hand trash by trait card effect draws equal amount", () => {
    const effects = buildCardEffects(
      `When a card is trashed from your hand by your "Navy" type card's effect, draw cards equal to the number of cards trashed.`,
    );
    expect(effects).toEqual({
      effects: [
        {
          trigger: "whenCardsTrashedFromHandByEffect",
          eventFilter: {
            player: "self",
            causedBy: "self",
            sourceFilters: [{ filter: "trait", value: "Navy", match: "includes" }],
            minimumAmount: 1,
          },
          actions: [
            {
              action: "draw",
              player: "self",
              amount: 0,
              amountFromTriggerEvent: true,
            },
          ],
        },
      ],
    });
  });

  test("rest any number of DON!! for scaled power", () => {
    const effects = buildCardEffects(
      `[DON!! x1] [On Your Opponent's Attack] If you have 5 or less active DON!! cards, you may rest any number of your DON!! cards. For every DON!! card rested this way, this Leader or up to 1 of your "Straw Hat Crew" type Characters gains +2000 power during this battle.`,
    );
    expect(effects?.effects?.[0]?.actions[0]?.action).toBe("restDonForPower");
    expect(effects?.effects?.[0]?.conditions).toEqual(
      expect.arrayContaining([
        { condition: "donAttached", amount: 1 },
        { condition: "activeDonCount", comparison: "lte", value: 5 },
      ]),
    );
  });
});
