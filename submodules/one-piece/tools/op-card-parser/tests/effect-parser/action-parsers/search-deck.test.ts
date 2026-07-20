import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — SearchAction", () => {
  test("preserves a named-card or bare Event alternative", () => {
    const result = parseActions(
      "Look at 4 cards from the top of your deck; reveal up to 1 [Sanji] or Event card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "name", value: "Sanji" },
            { filter: "cardCategory", value: "event" },
          ],
        },
      ],
    });
  });

  test("scopes an excluded name to its trait branch before a named alternative", () => {
    const result = parseActions(
      'Look at 3 cards from the top of your deck; reveal up to 1 "Revolutionary Army" type card other than [Koala] or up to 1 [Nico Robin] and add it to your hand. Then, trash the rest.',
    );
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            {
              filter: "allOf",
              filters: [
                { filter: "excludeName", value: "Koala" },
                { filter: "trait", value: "Revolutionary Army", match: "includes" },
              ],
            },
            { filter: "name", value: "Nico Robin" },
          ],
        },
      ],
    });
  });

  test("preserves a named-card or color-and-category search alternative", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 [Monkey.D.Luffy] or 1 red Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "name", value: "Monkey.D.Luffy" },
            {
              filter: "allOf",
              filters: [
                { filter: "color", value: "red" },
                { filter: "cardCategory", value: "event" },
              ],
            },
          ],
        },
      ],
    });
  });

  test("preserves the full no-base-effect filter", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 Character card with 6000 power or less and no base effect and add it to your hand and place the rest at the bottom of your deck in any order",
    );

    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "noBaseEffect" },
        { filter: "power", comparison: "lte", value: 6000 },
        { filter: "cardCategory", value: "character" },
      ],
    });
    expect(result.unparsed).toBe("");
  });

  test("preserves Trigger and excluded-name filters", () => {
    const result = parseActions(
      "Look at 4 cards from the top of your deck; reveal up to 1 card with a [Trigger] other than [Lilith] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "excludeName", value: "Lilith" },
        { filter: "hasTrigger", value: true },
      ],
    });
  });

  test("basic: reveal up to 1 trait-typed Character and add to hand", () => {
    const result = parseActions(
      "look at 3 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type Character card and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "search",
      lookCount: 3,
      source: { player: "self", zone: "deck" },
      revealCount: { amount: 1, upTo: true },
      revealFilters: [
        { filter: "trait", value: "Donquixote Pirates", match: "includes" },
        { filter: "cardCategory", value: "character" },
      ],
      revealDestination: "hand",
      remainderPosition: "bottom",
    });
    expect(result.unparsed).toBe("");
  });

  test("keeps a named-card or typed-card search as alternatives outside the exclusion", () => {
    const result = parseActions(
      "Look at 4 cards from the top of your deck; reveal up to 1 [Sanji] or {Big Mom Pirates} type card other than [Charlotte Pudding] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(result.parsed).toEqual([
      {
        action: "search",
        lookCount: 4,
        source: { player: "self", zone: "deck" },
        revealCount: { amount: 1, upTo: true },
        revealFilters: [
          { filter: "excludeName", value: "Charlotte Pudding" },
          {
            filter: "anyOf",
            filters: [
              { filter: "name", value: "Sanji" },
              { filter: "trait", value: "Big Mom Pirates", match: "includes" },
            ],
          },
        ],
        revealDestination: "hand",
        remainderPosition: "bottom",
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("preserves a top-or-bottom remainder choice", () => {
    const result = parseActions(
      "Look at 2 cards from the top of your deck; reveal up to 1 [The Seven Warlords of the Sea] type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.",
    );
    expect(result.parsed).toEqual([
      {
        action: "search",
        lookCount: 2,
        source: { player: "self", zone: "deck" },
        revealCount: { amount: 1, upTo: true },
        revealFilters: [
          {
            filter: "trait",
            value: "The Seven Warlords of the Sea",
            match: "includes",
          },
        ],
        revealDestination: "hand",
        remainderPosition: "any",
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("cost filter: card with a cost of 4 or more", () => {
    const result = parseActions(
      "Look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 4 or more and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 4,
      revealCount: { amount: 1, upTo: true },
      revealFilters: [{ filter: "cost", comparison: "gte", value: 4 }],
      revealDestination: "hand",
      remainderPosition: "bottom",
    });
  });

  test("name filter: [Zou]", () => {
    const result = parseActions(
      "look at 7 cards from the top of your deck; reveal up to 1 [Zou] and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 7,
      revealFilters: [{ filter: "name", value: "Zou" }],
    });
  });

  test("{Trait} type Stage card", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 {Dressrosa} type Stage card and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealFilters: [
        { filter: "trait", value: "Dressrosa" },
        { filter: "cardCategory", value: "stage" },
      ],
    });
  });

  test("Look at 5 with no filters (just 'card')", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 card and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealCount: { amount: 1, upTo: true },
      revealDestination: "hand",
      remainderPosition: "bottom",
    });
    // "card" alone produces no meaningful filter
    expect((result.parsed[0] as { revealFilters?: unknown[] }).revealFilters).toBeUndefined();
  });

  test("reveal up to 2 cards", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 2 {Sky Island} type Character cards and add them to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealCount: { amount: 2, upTo: true },
      revealFilters: [
        { filter: "trait", value: "Sky Island" },
        { filter: "cardCategory", value: "character" },
      ],
    });
  });

  test("remainder at top of deck", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck; reveal up to 1 card and add it to your hand and place the rest at the top of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      remainderPosition: "top",
    });
  });

  test("search followed by another action via '. Then, '", () => {
    const result = parseActions(
      "look at 3 cards from the top of your deck; reveal up to 1 [Zou] and add it to your hand and place the rest at the bottom of your deck in any order. Then, draw 1 card",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "search", lookCount: 3 });
    expect(result.parsed[1]).toEqual({ action: "draw", player: "self", amount: 1 });
    expect(result.unparsed).toBe("");
  });

  test("non-matching text returns no search action", () => {
    const result = parseActions("draw 1 card");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "draw" });
  });

  test("cost range filter: card with a cost of 2 or less", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 Character card with a cost of 2 or less and add it to your hand and place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "cost", comparison: "lte", value: 2 },
        { filter: "cardCategory", value: "character" },
      ],
    });
  });

  test("buildCardEffects: [On Play] search action", () => {
    const result = buildCardEffects(
      "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 4 or more and add it to your hand and place the rest at the bottom of your deck in any order.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "search",
      lookCount: 4,
      revealFilters: [{ filter: "cost", comparison: "gte", value: 4 }],
    });
  });

  test('quoted trait: "Cross Guild" type card', () => {
    const result = parseActions(
      'Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order',
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [{ filter: "trait", value: "Cross Guild", match: "includes" }],
    });
  });

  test('suffix trait and excluded name: card with a type including "Baroque Works"', () => {
    const result = parseActions(
      'Look at 4 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" other than [Miss.Valentine(Mikita)] and add it to your hand. Then, trash the rest',
    );
    expect(result.parsed).toEqual([
      {
        action: "search",
        lookCount: 4,
        source: { player: "self", zone: "deck" },
        revealCount: { amount: 1, upTo: true },
        revealFilters: [
          { filter: "excludeName", value: "Miss.Valentine(Mikita)" },
          { filter: "trait", value: "Baroque Works", match: "includes" },
        ],
        revealDestination: "hand",
        remainderPosition: "trash",
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("comma-separated traits: [A], [B], or [C] type", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck; reveal up to 1 [Straw Hat Crew], [Kid Pirates], or [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Straw Hat Crew", match: "includes" },
            { filter: "trait", value: "Kid Pirates", match: "includes" },
            { filter: "trait", value: "Heart Pirates", match: "includes" },
          ],
        },
      ],
    });
  });

  test('color + quoted trait: purple "Straw Hat Crew" type card', () => {
    const result = parseActions(
      'Look at 5 cards from the top of your deck; reveal up to 1 purple "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order',
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "color", value: "purple" },
        { filter: "trait", value: "Straw Hat Crew", match: "includes" },
      ],
    });
  });

  test("mixed attribute or colored category alternatives stay grouped", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck; reveal up to 1 (Slash) attribute card or green Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "attribute", value: "slash" },
            {
              filter: "allOf",
              filters: [
                { filter: "color", value: "green" },
                { filter: "cardCategory", value: "event" },
              ],
            },
          ],
        },
      ],
    });
    expect(result.unparsed).toBe("");
  });

  test("mixed trait-prefix and type-including alternatives stay grouped", () => {
    const result = parseActions(
      'Look at 5 cards from the top of your deck; reveal up to 1 "Land of Wano" type card or card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Land of Wano", match: "includes" },
            { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
          ],
        },
      ],
    });
  });
});

describe("parseActions — trashFromDeck", () => {
  test("Trash 2 cards from the top of your deck", () => {
    const result = parseActions("Trash 2 cards from the top of your deck");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromDeck", player: "self", amount: 2 }]);
  });

  test("trash 3 cards from the top of your deck (lowercase)", () => {
    const result = parseActions("trash 3 cards from the top of your deck");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromDeck", player: "self", amount: 3 }]);
  });

  test("you may trash 2 cards from the top of your deck", () => {
    const result = parseActions("you may trash 2 cards from the top of your deck");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromDeck", player: "self", amount: 2 }]);
  });

  test("trash 5 cards from the top of your deck", () => {
    const result = parseActions("trash 5 cards from the top of your deck");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromDeck", player: "self", amount: 5 }]);
  });
});

describe("parseActions — rearrangeDeck", () => {
  test("Look at 5 cards, place at top or bottom", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "rearrangeDeck",
        player: "self",
        count: 5,
        position: "topOrBottom",
      },
    ]);
  });

  test("Look at 3 cards, place at bottom", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck and place them at the bottom of the deck in any order",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "rearrangeDeck",
        player: "self",
        count: 3,
        position: "bottom",
      },
    ]);
  });

  test("Look at 5 cards, trash up to 2, then order the rest at the bottom", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck and trash up to 2 cards. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "rearrangeDeck",
        player: "self",
        count: 5,
        position: "bottom",
        trashUpTo: 2,
      },
    ]);
  });
});

describe("parseActions — search play variants", () => {
  test("look at + play up to 1 + place rest at bottom", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck and play up to 1 [Animal] type Character card with a cost of 3 or less. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealDestination: "character",
      remainderPosition: "bottom",
      revealCount: { amount: 1, upTo: true },
    });
  });

  test("look at + reveal + add to hand + trash the rest", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 3,
      revealDestination: "hand",
      remainderPosition: "trash",
    });
  });

  test("look at the top N cards (alternative word order)", () => {
    const result = parseActions(
      "Look at the top 5 cards of your deck; reveal up to 1 [Sky Island] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealDestination: "hand",
      remainderPosition: "bottom",
    });
  });

  test("look at + add up to N cards to hand + place rest at top", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the top of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 3,
      revealCount: { amount: 1, upTo: true },
      revealDestination: "hand",
      remainderPosition: "top",
    });
  });

  test("look at + play [Revolutionary Army] type with power filter", () => {
    const result = parseActions(
      "Look at 3 cards from the top of your deck and play up to 1 [Revolutionary Army] type Character card with 5000 power or less. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 3,
      revealDestination: "character",
      remainderPosition: "bottom",
      revealFilters: expect.arrayContaining([
        { filter: "trait", value: "Revolutionary Army", match: "includes" },
        { filter: "power", comparison: "lte", value: 5000 },
      ]),
    });
  });

  test("look at + play a filtered Character rested", () => {
    const result = parseActions(
      "Look at 5 cards from the top of your deck and play up to 1 [Animal] type Character card with 4000 power or less rested. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "search",
        lookCount: 5,
        source: { player: "self", zone: "deck" },
        revealCount: { amount: 1, upTo: true },
        revealFilters: [
          { filter: "power", comparison: "lte", value: 4000 },
          { filter: "trait", value: "Animal", match: "includes" },
          { filter: "cardCategory", value: "character" },
        ],
        revealDestination: "character",
        remainderPosition: "bottom",
        playState: "rested",
      },
    ]);
  });

  test("look at + play a type-including Character with an additional cost filter", () => {
    const result = parseActions(
      'Look at 5 cards from the top of your deck; play up to 1 Character card with a type including "CP" and a cost of 5 or less. Then, trash the rest.',
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "search",
        lookCount: 5,
        source: { player: "self", zone: "deck" },
        revealCount: { amount: 1, upTo: true },
        revealFilters: [
          { filter: "trait", value: "CP", match: "includes" },
          { filter: "cost", comparison: "lte", value: 5 },
          { filter: "cardCategory", value: "character" },
        ],
        revealDestination: "character",
        remainderPosition: "trash",
      },
    ]);
  });
});

describe("parseActions — search look at up to and reveal", () => {
  test("look at up to 5 cards + reveal", () => {
    const result = parseActions(
      "Look at up to 5 cards from the top of your deck; reveal up to 1 red Character with a cost of 1 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 5,
      revealDestination: "hand",
      remainderPosition: "bottom",
    });
  });

  test("reveal N card from deck + play", () => {
    const result = parseActions(
      "Reveal 1 card from the top of your deck and play up to 1 Character with a cost of 9 or less other than [Sanji]. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "search",
      lookCount: 1,
      revealDestination: "character",
      remainderPosition: "bottom",
    });
  });
});
