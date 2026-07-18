import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — canAttackActive", () => {
  test("This Character can also attack active Characters", () => {
    const result = parseActions("This Character can also attack your opponent's active Characters");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "canAttackActive",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
      },
    ]);
  });

  test("This Leader can also attack active Characters", () => {
    const result = parseActions("This Leader can also attack your opponent's active Characters");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "canAttackActive",
        target: {
          player: "self",
          zones: ["leader"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
      },
    ]);
  });
});

describe("parseActions — cannotActivate", () => {
  test("opponent cannot activate [Blocker] during this battle", () => {
    const result = parseActions("Your opponent cannot activate [Blocker] during this battle");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
        },
        keyword: "blocker",
        duration: "thisBattle",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] during this turn", () => {
    const result = parseActions("Your opponent cannot activate [Blocker] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
        },
        keyword: "blocker",
        duration: "thisTurn",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] of Character with cost filter", () => {
    const result = parseActions(
      "your opponent cannot activate the [Blocker] of any Character with a cost of 5 or less during this battle",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
        keyword: "blocker",
        duration: "thisBattle",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] Character with power filter", () => {
    const result = parseActions(
      "Your opponent cannot activate a [Blocker] Character that has 2000 or less power during this battle",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "power", comparison: "lte", value: 2000 }],
        },
        keyword: "blocker",
        requiresKeyword: true,
        duration: "thisBattle",
      },
    ]);
  });
});

describe("parseActions — negateEffects", () => {
  test("negate effect of target during this turn", () => {
    const result = parseActions(
      "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "negateEffects",
      target: {
        player: "opponent",
        zones: ["leader", "character"],
        count: { amount: 1, upTo: true },
      },
      duration: "thisTurn",
    });
  });

  test("negate effect without explicit duration defaults to thisTurn", () => {
    const result = parseActions("Negate the effects of up to 1 of your opponent's Characters.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "negateEffects",
      duration: "thisTurn",
    });
  });

  test("negate and give power — compound clause", () => {
    const result = parseActions(
      "Negate the effect of up to 1 of your opponent's Leader or Character cards and give that card 4000 power during this turn.",
    );
    expect(result.parsed.length).toBeGreaterThanOrEqual(1);
    expect(result.parsed[0]).toMatchObject({ action: "negateEffects" });
  });
});

describe("parseActions — cannotAttack", () => {
  test("target cannot attack until end of opponent's next turn", () => {
    const result = parseActions(
      "Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotAttack",
      target: {
        player: "opponent",
        zones: ["leader"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "state", value: "rested" }],
      },
      duration: "untilEndOfOpponentNextTurn",
    });
  });

  test("target cannot attack during this turn", () => {
    const result = parseActions(
      "Up to 1 of your opponent's Characters cannot attack during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotAttack",
      duration: "thisTurn",
    });
  });
});

describe("parseActions — cannotBeRested", () => {
  test("preserves the opponent's next End Phase duration", () => {
    const result = parseActions(
      "Up to 2 of your opponent's Characters with a cost of 5 or less cannot be rested until the end of your opponent's next End Phase.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeRested",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 2, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
        duration: "untilEndOfOpponentNextEndPhase",
      },
    ]);
  });
});

describe("parseActions — cannotBeKod", () => {
  test("trait Characters other than a named Character cannot be K.O.'d in battle", () => {
    const result = parseActions(
      "Kurozumi Clan type Characters other than your [Kurozumi Semimaru] cannot be K.O.'d in battle.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "cannotBeKod",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: "all" },
            filters: [
              { filter: "trait", value: "Kurozumi Clan", match: "includes" },
              { filter: "excludeName", value: "Kurozumi Semimaru" },
            ],
          },
          duration: "permanent",
          restriction: "inBattle",
        },
      ],
      unparsed: "",
    });
  });

  test("trait Characters other than a named Character are protected only from opponent effects", () => {
    const result = parseActions(
      "your [Foxy Pirates] type Characters other than [Pickles] cannot be K.O.'d by your opponent's effects.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "cannotBeKod",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: "all" },
            filters: [
              { filter: "trait", value: "Foxy Pirates", match: "includes" },
              { filter: "excludeName", value: "Pickles" },
            ],
          },
          duration: "permanent",
          restriction: "byEffect",
          byPlayer: "opponent",
        },
      ],
      unparsed: "",
    });
  });

  test("cannot draw using your own effects during this turn", () => {
    const result = parseActions("you cannot draw cards using your own effects during this turn");

    expect(result).toEqual({
      parsed: [
        {
          action: "cannotDraw",
          player: "self",
          source: "ownEffects",
          duration: "thisTurn",
        },
      ],
      unparsed: "",
    });
  });

  test("cannot set DON!! active using Character effects during this turn", () => {
    const result = parseActions(
      "you cannot set DON!! cards as active using Character effects during this turn",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "cannotSetDonActive",
          player: "self",
          source: "characterEffects",
          duration: "thisTurn",
        },
      ],
      unparsed: "",
    });
  });

  test("cannot be played from hand by effects", () => {
    const result = parseActions("This card in your hand cannot be played by effects.");

    expect(result).toEqual({
      parsed: [{ action: "cannotBePlayedByEffects" }],
      unparsed: "",
    });
  });

  test("battle protection followed by a permanent power bonus", () => {
    const result = parseActions(
      "This Character cannot be K.O.'d in battle by (Slash) attribute cards and gains +1000 power.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeKod",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
        restriction: "inBattle",
        byFilter: [{ filter: "attribute", value: "slash" }],
      },
      {
        action: "modifyPower",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        value: 1000,
        duration: "permanent",
      },
    ]);
  });

  test("accepts official angle-bracket attribute notation", () => {
    const result = parseActions(
      "This Character cannot be K.O.'d in battle by <Slash> attribute cards and gains +2000 power.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "cannotBeKod",
      restriction: "inBattle",
      byFilter: [{ filter: "attribute", value: "slash" }],
    });
    expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 2000 });
  });

  test("parses OP14-003 source power filter", () => {
    const result = parseActions(
      "This Character cannot be K.O.'d by effects of your opponent's Characters with 5000 base power or less.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeKod",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
        restriction: "byEffect",
        byPlayer: "opponent",
        byFilter: [
          { filter: "cardCategory", value: "character" },
          { filter: "basePower", comparison: "lte", value: 5000 },
        ],
      },
    ]);
  });

  test("protects this Character from battle K.O. by Leaders", () => {
    expect(parseActions("this Character cannot be K.O.'d in battle by Leaders")).toEqual({
      parsed: [
        {
          action: "cannotBeKod",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            self: true,
          },
          duration: "permanent",
          restriction: "inBattle",
          byFilter: [{ filter: "cardCategory", value: "leader" }],
        },
      ],
      unparsed: "",
    });
  });

  test("protects either inclusive trait through the opponent's next turn", () => {
    expect(
      parseActions(
        'none of your "ODYSSEY" or "Straw Hat Crew" type Characters can be K.O.\'d by effects until the end of your opponent\'s next turn',
      ),
    ).toEqual({
      parsed: [
        {
          action: "cannotBeKod",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: "all" },
            filters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "ODYSSEY", match: "includes" },
                  { filter: "trait", value: "Straw Hat Crew", match: "includes" },
                ],
              },
            ],
          },
          duration: "untilEndOfOpponentNextTurn",
          restriction: "byEffect",
        },
      ],
      unparsed: "",
    });
  });
});

describe("cannotBeRemoved action", () => {
  test("this Character cannot be removed from the field by opponent's effects", () => {
    const result = parseActions(
      "this Character cannot be removed from the field by your opponent's effects",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotBeRemoved",
      bySource: "opponentEffect",
      duration: "permanent",
    });
    expect(result.unparsed).toBe("");
  });

  test("this Character cannot be removed from the field by your effects", () => {
    const result = parseActions("this Character cannot be removed from the field by your effects");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotBeRemoved",
      bySource: "ownEffect",
      duration: "permanent",
    });
  });
});
