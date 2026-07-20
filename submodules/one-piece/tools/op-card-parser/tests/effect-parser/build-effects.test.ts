import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("buildCardEffects — inline conditions", () => {
  test("gates Rayleigh's immediate and delayed On Play actions behind given DON!!", () => {
    expect(
      buildCardEffects(
        "[Rush]\n[On Play] If you have any DON!! cards given, rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, add up to 1 DON!! card from your DON!! deck and set it as active at the end of this turn.",
      ),
    ).toEqual({
      keywords: ["rush"],
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "donGiven", player: "self" }],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [
                {
                  action: "addDon",
                  count: { amount: 1, upTo: true },
                  state: "active",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("parses P-081 colored typed-field condition after a self-return activation cost", () => {
    expect(
      buildCardEffects(
        '[Activate:Main] You may return this Character to the owner\'s hand: If you have 3 or more blue "Cross Guild" type Characters, play up to 1 "Cross Guild" type Character card with a cost of 5 from your hand.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnThisToHand" }],
          actions: [
            {
              action: "play",
              condition: {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "gte",
                value: 3,
                filters: [
                  { filter: "color", value: "blue" },
                  { filter: "trait", value: "Cross Guild", match: "includes" },
                ],
              },
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "eq", value: 5 },
                { filter: "trait", value: "Cross Guild", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds Kin'emon's compound bottom-deck activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may place this Character and 1 [Kin'emon] with 0 power from your trash at the bottom of your deck in any order: Play up to 1 [Kin'emon] with a cost of 6 from your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "returnThisToDeck", position: "bottom" },
            {
              cost: "returnTrashToDeck",
              amount: 1,
              position: "bottom",
              filters: [
                { filter: "name", value: "Kin'emon" },
                { filter: "power", comparison: "eq", value: 0 },
              ],
            },
          ],
        },
      ],
    });
  });

  test("builds Tashigi's non-self removal replacement", () => {
    expect(
      buildCardEffects(
        "If you have a green Character other than [Tashigi] that would be removed from the field by your opponent's effect, you may rest this Character instead.",
      ),
    ).toEqual({
      replacementEffects: [
        {
          replacedEvent: "removeFromField",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            filters: [
              { filter: "color", value: "green" },
              { filter: "excludeName", value: "Tashigi" },
            ],
          },
          source: "opponentEffect",
          replacementAction: {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
          },
        },
      ],
    });
  });

  test("builds Roger's zero-Life win when the opponent activates Blocker", () => {
    expect(
      buildCardEffects(
        "[Rush] (This card can attack on the turn in which it is played.)\nWhen your opponent activates [Blocker], if either you or your opponent has 0 Life cards, you win the game.",
      ),
    ).toEqual({
      keywords: ["rush"],
      effects: [
        {
          trigger: "whenBlockerActivated",
          conditions: [
            {
              condition: "compound",
              operator: "or",
              conditions: [
                { condition: "lifeCount", player: "self", comparison: "eq", value: 0 },
                { condition: "lifeCount", player: "opponent", comparison: "eq", value: 0 },
              ],
            },
          ],
          actions: [{ action: "winGame" }],
        },
      ],
    });
  });

  test("preserves unequal power values assigned by selected-target order", () => {
    expect(
      buildCardEffects(
        "[On Play] Select up to 2 of your opponent's Characters, and give 1 Character -3000 power and the other -2000 power until the end of your opponent's next turn. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.",
      )?.effects,
    ).toEqual([
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 2, upTo: true },
            },
            value: -3000,
            distributedValues: [-3000, -2000],
            duration: "untilEndOfOpponentNextTurn",
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "power", comparison: "lte", value: 3000 }],
            },
          },
        ],
      },
    ]);
  });

  test("parses placing this Character at the bottom of the deck as an activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may place this Character at the bottom of the owner's deck: Give up to 1 of your opponent's Characters -3000 power during this turn.",
      )?.effects,
    ).toEqual([
      {
        trigger: "activateMain",
        costs: [{ cost: "returnThisToDeck", position: "bottom" }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ]);
  });

  test("preserves opponent-only Life removal provenance", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [Once Per Turn] When a card is removed from your opponent's Life cards, draw 2 cards and trash 1 card from your hand.",
      )?.effects,
    ).toEqual([
      {
        trigger: "whenLifeRemoved",
        eventFilter: { player: "opponent" },
        conditions: [{ condition: "donAttached", amount: 1 }],
        actions: [
          { action: "draw", amount: 2, player: "self" },
          { action: "trashFromHand", amount: 1, player: "self" },
        ],
        oncePerTurn: true,
      },
    ]);
  });

  test("preserves a global named-Character negation on a self leave-field replacement", () => {
    expect(
      buildCardEffects(
        "[Once Per Turn] If this Character would leave the field, you may trash 1 card from the top of your Life cards instead. If there is a [Monkey.D.Luffy] Character, this effect is negated.",
      )?.replacementEffects,
    ).toEqual([
      {
        replacedEvent: "leaveField",
        eventFilter: { targetSelf: true },
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
              },
              {
                condition: "notHasCard",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
              },
            ],
          },
        ],
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: { amount: 1 },
          destination: "trash",
        },
        oncePerTurn: true,
      },
    ]);
  });

  test("preserves an active-Leader power reduction as an optional activation cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may give your active Leader -5000 power during this turn: Draw 2 cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "modifyLeaderPower",
              value: -5000,
              duration: "thisTurn",
              requiresActive: true,
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 2 }],
          optional: true,
        },
      ],
    });
  });

  test("preserves a numbered active-Leader reduction alongside another activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may rest this Character and give your 1 active Leader -5000 power during this turn: Draw 2 cards.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "restThisCard" },
            {
              cost: "modifyLeaderPower",
              value: -5000,
              duration: "thisTurn",
              requiresActive: true,
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("routes an opponent-chosen card from the controller's hand to the opponent's deck", () => {
    expect(
      buildCardEffects(
        "[On Play] Play up to 1 {Alabasta} type Character card with a cost of 8 or less other than [Nefeltari Vivi] from your hand. Then, your opponent places 1 card from your hand at the bottom of their deck.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            { action: "play" },
            {
              action: "returnToDeck",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1 },
                chosenBy: "opponent",
              },
              position: "bottom",
              destinationPlayer: "opponent",
            },
          ],
        },
      ],
    });
  });

  test("preserves a category-filtered reveal-from-hand activation cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may reveal 2 Events from your hand: Play up to 1 red Character card with 3000 power or less from your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "revealFromHand",
              amount: 2,
              filters: [{ filter: "cardCategory", value: "event" }],
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves an inclusive-trait reveal-from-hand activation cost", () => {
    expect(
      buildCardEffects(
        '[Activate:Main] [Once Per Turn] You may reveal 2 cards with a type including "Whitebeard Pirates" from your hand: This Character gains +2000 power during this turn.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "revealFromHand",
              amount: 2,
              filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("treats quoted type alternatives in reveal costs as inclusive traits", () => {
    expect(
      buildCardEffects(
        '[On Play] You may reveal 1 "Music" or "FILM" type card from your hand: Set up to 2 of your DON!! cards as active at the end of this turn.',
      ),
    ).toMatchObject({
      effects: [
        {
          costs: [
            {
              cost: "revealFromHand",
              amount: 1,
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Music", match: "includes" },
                    { filter: "trait", value: "FILM", match: "includes" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("preserves an included-trait Character trash cost", () => {
    expect(
      buildCardEffects(
        '[When Attacking] You may trash 1 of your Characters with a type including "Whitebeard Pirates": Draw 1 card and this Character gains [Banish] during this turn.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves imperative DON!! and optional self-rest costs before a colon", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] Rest 1 of your DON!! cards and you may rest this Character: Give up to 1 of your opponent's Characters −2 cost during this turn.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "restDon", amount: 1 }, { cost: "restThisCard" }],
          actions: [{ action: "modifyCost", value: -2, duration: "thisTurn" }],
          optional: true,
        },
      ],
    });
  });

  test("normalizes a Unicode minus in permanent cost modifiers", () => {
    expect(
      buildCardEffects("[DON!! x1] [Your Turn] Give all of your opponent's Characters −1 cost."),
    ).toMatchObject({
      permanentEffects: [
        {
          actions: [{ action: "modifyCost", value: -1, duration: "permanent" }],
        },
      ],
    });
  });

  test("preserves self-effect removal provenance", () => {
    expect(
      buildCardEffects(
        "[Your Turn] [Once Per Turn] When a Character is removed from the field by your effect, draw 1 card.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenLeaving",
          source: "effect",
          oncePerTurn: true,
        },
      ],
    });
  });

  test("excludes this Character from a return-Character activation cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may return 1 of your Characters other than this Character to the owner's hand: Draw 1 card.",
      ),
    ).toMatchObject({
      effects: [
        {
          costs: [
            {
              cost: "returnCharacter",
              amount: 1,
              filters: [{ filter: "excludeSelf" }],
            },
          ],
        },
      ],
    });
  });

  test("preserves an inclusive trait on a return-Character activation cost", () => {
    expect(
      buildCardEffects(
        '[When Attacking] You may return 1 of your "Revolutionary Army" type Characters with a cost of 3 or more to the owner\'s hand: This Character gains +3000 power during this turn.',
      ),
    ).toMatchObject({
      effects: [
        {
          costs: [
            {
              cost: "returnCharacter",
              amount: 1,
              filters: [
                { filter: "trait", value: "Revolutionary Army", match: "includes" },
                { filter: "cost", comparison: "gte", value: 3 },
              ],
            },
          ],
        },
      ],
    });
  });

  test("preserves conditional top-card Rush and top-or-bottom placement", () => {
    expect(
      buildCardEffects(
        '[On Play] Reveal 1 card from the top of your deck and place it at the top or bottom of your deck. If the revealed card\'s type includes "Whitebeard Pirates", this Character gains [Rush] during this turn.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "revealTopDeckCard",
              player: "self",
              finalPosition: "choice",
              conditional: {
                filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
                actions: [{ action: "grantKeyword", keyword: "rush", duration: "thisTurn" }],
              },
            },
          ],
        },
      ],
    });
  });

  test("preserves the per-attack hand-trash exception for selected Characters", () => {
    expect(
      buildCardEffects(
        "[On Play] Select all of your opponent's Characters on their field. Until the end of your opponent's next turn, none of the selected Characters can attack unless your opponent trashes 2 cards from their hand whenever they attack.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: "all" },
              },
              duration: "untilEndOfOpponentNextTurn",
              unlessTrashFromHand: 2,
            },
          ],
        },
      ],
    });
  });

  test("keeps an opponent play dependent on returning a Character", () => {
    const result = buildCardEffects(
      "[On Play] Give up to 1 rested DON!! card to your Leader. Then, you may return up to 1 of your opponent's Characters with a cost of 5 or less to the owner's hand. If you do, your opponent plays up to 1 Character card with a cost of 4 or less from their hand.",
    );
    expect(result?.effects?.[0]?.actions[1]).toMatchObject({
      action: "returnToHand",
      thenActions: [
        {
          action: "play",
          source: { player: "opponent", zone: "hand" },
          count: { amount: 1, upTo: true },
        },
      ],
    });
  });

  test("parses turning the top Life card face-up as a replacement action", () => {
    expect(
      buildCardEffects(
        "If this Character would be removed from the field by your opponent's effect, you may turn 1 card from the top of your Life cards face-up instead.",
      ),
    ).toEqual({
      replacementEffects: [
        {
          replacedEvent: "removeFromField",
          source: "opponentEffect",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "turnLifeFaceUp",
            player: "self",
            count: 1,
            position: "top",
          },
        },
      ],
    });
  });

  test("parses an only-trait Character condition after an activation cost", () => {
    expect(
      buildCardEffects(
        '[On Play] You may trash 1 card from your hand: If you only have "Celestial Dragons" type Characters, K.O. up to 2 of your opponent\'s Characters with a base cost of 3 or less.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "ko",
              condition: {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "eq",
                value: 0,
                filters: [
                  {
                    filter: "trait",
                    value: "Celestial Dragons",
                    match: "includes",
                    negate: true,
                  },
                ],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("gates Edison's draw and rest behind the post-cost Life comparison", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may trash this Character: If the number of your Life cards is equal to or less than the number of your opponent's Life cards, draw 1 card. Then, rest up to 1 of your opponent's Characters with a cost of 3 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          conditions: [{ condition: "lifeComparison", selfComparison: "lte" }],
          costs: [{ cost: "trashThisCard" }],
          actions: [{ action: "draw" }, { action: "rest" }],
          optional: true,
        },
      ],
    });
  });

  test("gates Yamato's draw and subsequent DON!! transfer behind its Life count", () => {
    expect(
      buildCardEffects(
        "[On Play] If you have 3 or less Life cards, draw 2 cards. Then, give up to 1 rested DON!! card to your Leader.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 3,
            },
          ],
          actions: [{ action: "draw" }, { action: "giveDon" }],
        },
      ],
    });
  });

  test("parses placing a trash card at deck bottom as an activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may place 1 card from your trash at the bottom of your deck: Draw 1 card.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnTrashToDeck", amount: 1, position: "bottom" }],
          optional: true,
        },
      ],
    });
  });

  test("parses returning trash cards to deck bottom as an activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] You may return 7 cards from your trash to the bottom of your deck in any order: Set this Character as active.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnTrashToDeck", amount: 7, position: "bottom" }],
          oncePerTurn: true,
          optional: true,
        },
      ],
    });
  });

  test("parses trashing another trait Character as an activation cost", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash 1 of your [Homies] type Characters other than this Character and rest this Character: Set up to 1 of your [Charlotte Linlin] Characters as active.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [
                { filter: "excludeSelf" },
                { filter: "trait", value: "Homies", match: "includes" },
              ],
            },
            { cost: "restThisCard" },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves category and cost filters on a rested field-card cost", () => {
    expect(
      buildCardEffects(
        "[DON!! x1][When Attacking][Once Per Turn] You may rest 1 of your Characters with a cost of 3 or more: Set this Character as active.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "gte", value: 3 },
              ],
            },
          ],
        },
      ],
    });
  });

  test("preserves alternative categories on a rested field-card cost", () => {
    expect(
      buildCardEffects(
        '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: Draw 1 card.',
      ),
    ).toMatchObject({
      effects: [
        {
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [
                { filter: "trait", value: "Dressrosa", match: "includes" },
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "cardCategory", value: "leader" }],
                    [{ filter: "cardCategory", value: "stage" }],
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("preserves unnumbered Leader or Stage alternatives", () => {
    expect(
      buildCardEffects("[On Play] You may rest your Leader or 1 of your Stage cards: Draw 1 card."),
    ).toMatchObject({
      effects: [
        {
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "cardCategory", value: "leader" }],
                    [{ filter: "cardCategory", value: "stage" }],
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("does not leak a later return cost filter onto the rest cost", () => {
    const effects = buildCardEffects(
      '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards, and return 1 of your "Dressrosa" type Characters with a cost of 4 or more to the owner\'s hand: Draw 1 card.',
    );

    expect(effects?.effects?.[0]?.costs?.[0]).toEqual({
      cost: "restCards",
      amount: 1,
      filters: [
        { filter: "trait", value: "Dressrosa", match: "includes" },
        {
          filter: "anyOf",
          groups: [
            [{ filter: "cardCategory", value: "leader" }],
            [{ filter: "cardCategory", value: "stage" }],
          ],
        },
      ],
    });
  });

  test("parses rest-this plus a typed Leader-or-Stage compound cost", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: Draw 1 card.',
      )?.effects?.[0]?.costs,
    ).toEqual([
      { cost: "restThisCard" },
      {
        cost: "restCards",
        amount: 1,
        filters: [
          { filter: "trait", value: "Dressrosa", match: "includes" },
          {
            filter: "anyOf",
            groups: [
              [{ filter: "cardCategory", value: "leader" }],
              [{ filter: "cardCategory", value: "stage" }],
            ],
          },
        ],
      },
    ]);
  });

  test("uses included trait matching for quoted type cards returned from trash", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] You may place 2 "Thriller Bark Pirates" type cards from your trash at the bottom of your deck in any order: Draw 1 card.',
      )?.effects?.[0]?.costs,
    ).toEqual([
      {
        cost: "returnTrashToDeck",
        amount: 2,
        position: "bottom",
        filters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
      },
    ]);
  });

  test("parses returning a Character as an activation cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may return 1 of your Characters to the owner's hand: Play up to 1 Character card with a cost of 5 or less from your hand rested.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnCharacter", amount: 1 }],
          optional: true,
        },
      ],
    });
  });

  test("parses OP01-047's owner-implied Character return as an activation cost", () => {
    expect(
      buildCardEffects(
        "[Blocker] [On Play] You may return 1 Character to your hand: Play up to 1 Character card with a cost of 3 or less from your hand.",
      ),
    ).toMatchObject({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnCharacter", amount: 1 }],
          optional: true,
        },
      ],
    });
  });

  test("builds OP14-047's Blocker and ordered draw plus alternative-trait play", () => {
    const result = buildCardEffects(
      "[Blocker]\n[On Play] Draw 1 card and play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand.",
    );

    expect(result).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          actions: [
            { action: "draw", player: "self", amount: 1 },
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 3 },
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Fish-Man", match: "includes" },
                    { filter: "trait", value: "Merfolk", match: "includes" },
                  ],
                },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });

  test("builds OP14-046's self-trash cost and alternative-trait power target", () => {
    const result = buildCardEffects(
      "[Activate: Main] You may trash this Character: Up to 1 of your {Fish-Man} or {Merfolk} type Leader or Character cards gains +2000 power during this turn.",
    );

    expect(result).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashThisCard" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [
                  {
                    filter: "anyOf",
                    filters: [
                      { filter: "trait", value: "Fish-Man", match: "includes" },
                      { filter: "trait", value: "Merfolk", match: "includes" },
                    ],
                  },
                ],
              },
              value: 2000,
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds OP14-045's hand-trash-by-effect Rush trigger and On K.O. draw", () => {
    const result = buildCardEffects(
      "When a card is trashed from your hand by an effect, this Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)\n[On K.O.] Draw 1 card.",
    );

    expect(result).toEqual({
      effects: [
        {
          trigger: "whenCardTrashedFromHandByEffect",
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "onKo",
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    });
  });

  test("builds OP14-044's conditional top-card reveal, draw, and hand trash", () => {
    const result = buildCardEffects(
      '[Blocker]\n[On Play] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", draw 2 cards and trash 1 card from your hand.',
    );

    expect(result).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "revealFromDeck",
              player: "self",
              count: 1,
              ifRevealedCardMatches: {
                filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
                actions: [
                  { action: "draw", player: "self", amount: 2 },
                  { action: "trashFromHand", player: "self", amount: 1 },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test("builds OP14-043's alternative-trait play and On K.O. draw", () => {
    const result = buildCardEffects(
      "[On Play] Play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand.\n[On K.O.] Draw 1 card.",
    );

    expect(result?.effects).toEqual([
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 3 },
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Fish-Man", match: "includes" },
                  { filter: "trait", value: "Merfolk", match: "includes" },
                ],
              },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ]);
  });

  test("builds OP14-042's filtered top-deck search", () => {
    const result = buildCardEffects(
      "[On Play] If your Leader has the {Fish-Man} type, look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(result?.effects).toEqual([
      {
        trigger: "onPlay",
        conditions: [{ condition: "leaderTrait", trait: "Fish-Man", match: "includes" }],
        actions: [
          {
            action: "search",
            lookCount: 4,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [{ filter: "cost", comparison: "gte", value: 2 }],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ]);
  });

  test("builds OP14-035's turn-scoped becomes-rested freeze", () => {
    const result = buildCardEffects(
      "[Your Turn] When this Character becomes rested, up to 1 of your opponent's rested Characters with a cost of 4 or less will not become active in your opponent's next Refresh Phase.",
    );

    expect(result?.effects).toEqual([
      {
        trigger: "whenBecomesRested",
        eventFilter: { targetSelf: true },
        conditions: [{ condition: "turn", value: "your" }],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "state", value: "rested" },
                { filter: "cost", comparison: "lte", value: 4 },
              ],
            },
          },
        ],
      },
    ]);
  });

  test("builds OP14-034's field-owned filtered K.O. replacement", () => {
    const result = buildCardEffects(
      "[Once Per Turn] If your {Straw Hat Crew} type Character would be K.O.'d by your opponent's effect, you may rest 1 of your Characters instead.",
    );

    expect(result?.replacementEffects).toEqual([
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
          },
        },
        oncePerTurn: true,
      },
    ]);
  });

  test("builds OP14-021 optional rested trigger with dependent freeze", () => {
    const result = buildCardEffects(
      "[Your Turn] When this Character becomes rested, you may add 1 card from the top of your Life cards to your hand. If you do, up to 1 of your opponent's rested Characters or Stages will not become active in your opponent's next Refresh Phase.",
    );

    expect(result?.effects).toEqual([
      {
        trigger: "whenBecomesRested",
        eventFilter: { targetSelf: true },
        conditions: [{ condition: "turn", value: "your" }],
        actions: [
          {
            action: "removeFromLife",
            player: "self",
            count: { amount: 1 },
            destination: "hand",
            position: "top",
            thenActions: [
              {
                action: "freeze",
                target: {
                  player: "opponent",
                  zones: ["character", "stage"],
                  count: { amount: 1, upTo: true },
                  filters: [{ filter: "state", value: "rested" }],
                },
              },
            ],
          },
        ],
        optional: true,
      },
    ]);
  });

  test("builds an unbracketed permanent ability", () => {
    const result = buildCardEffects(
      "This Character cannot be K.O.'d by effects of your opponent's Characters with 5000 base power or less.",
    );

    expect(result?.permanentEffects).toEqual([
      {
        actions: [
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
        ],
      },
    ]);
  });

  test("builds OP02-074 named Characters' permanent Blocker grant", () => {
    const result = buildCardEffects(
      "Your [Blugori] gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
    );

    expect(result?.permanentEffects).toEqual([
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "name", value: "Blugori" }],
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ]);
  });

  test("builds OP14-004 conditional Rush and ignores reminder text", () => {
    const result = buildCardEffects(
      "If this Character has 5000 power or more, this Character gains [Rush].\n(This card can attack on the turn in which it is played.)",
    );

    expect(result?.permanentEffects).toEqual([
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 5000,
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ]);
  });

  test("OP14EB04-088 Miss Merrychristmas: [On K.O.] If leader trait, draw + K.O.", () => {
    const result = buildCardEffects(
      "[On K.O.] If your Leader's type includes \"Baroque Works\", draw 1 card and K.O. up to 1 of your opponent's Stages with a cost of 1.",
    );
    expect(result).toBeDefined();
    expect(result!.effects).toHaveLength(1);
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.conditions).toEqual([
      { condition: "leaderTrait", trait: "Baroque Works", match: "includes" },
    ]);
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
    expect(block.actions[1]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["stage"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "eq", value: 1 }],
      },
    });
  });

  test("[When Attacking] If this Character has 5000 power or more, draw + K.O.", () => {
    const result = buildCardEffects(
      "[When Attacking] If this Character has 5000 power or more, draw 1 card and K.O. up to 1 of your opponent's Characters with 3000 base power or less.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("whenAttacking");
    expect(block.conditions).toEqual([
      { condition: "cardState", target: "this", property: "power", comparison: "gte", value: 5000 },
    ]);
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
    expect(block.actions[1]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "basePower", comparison: "lte", value: 3000 }],
      },
    });
  });

  test("[On Play] If you have 2 or less Life cards, draw 2 cards", () => {
    const result = buildCardEffects("[On Play] If you have 2 or less Life cards, draw 2 cards.");
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.conditions).toEqual([
      { condition: "lifeCount", player: "self", comparison: "lte", value: 2 },
    ]);
    expect(block.actions).toEqual([{ action: "draw", player: "self", amount: 2 }]);
  });

  test("OP01-029 preserves a Life-gated additional power action on the previous target", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or less Life cards, that card gains an additional +2000 power.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
            },
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
              previousActionTargets: true,
              condition: {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 2,
              },
            },
          ],
        },
      ],
    });
  });

  test("OP01-088 preserves a rearrange-deck continuation after its Counter power action", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order. [Trigger] Draw 2 cards and trash 1 card from your hand. This card has been officially errata'd.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
            },
            {
              action: "rearrangeDeck",
              player: "self",
              count: 3,
              position: "topOrBottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
        },
      ],
    });
  });

  test("OP01-086 preserves its active Character return and corrected Trigger target", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, return up to 1 active Character with a cost of 3 or less to the owner's hand. [Trigger] Return up to 1 Character with a cost of 4 or less to the owner's hand. This card has been officially errata'd.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 4000,
              duration: "thisBattle",
            },
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "state", value: "active" },
                  { filter: "cost", comparison: "lte", value: 3 },
                ],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP01-089 matches a printed Leader trait within compound trait strings", () => {
    expect(
      buildCardEffects(
        "[Counter] If your Leader has the \"The Seven Warlords of the Sea\" type, return up to 1 Character with a cost of 5 or less to the owner's hand. This card has been officially errata'd.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          conditions: [
            {
              condition: "leaderTrait",
              trait: "The Seven Warlords of the Sea",
              match: "includes",
            },
          ],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP01-096 preserves both independently bounded K.O. actions", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 3 or less and up to 1 of your opponent's Characters with a cost of 2 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 2 }],
          optional: true,
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
            },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("marks a passive DON!! rest activation cost optional", () => {
    expect(
      buildCardEffects(
        "[On Play] (1) (You may rest the specified number of DON!! cards in your cost area.): Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "restDon", amount: 1 }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
          optional: true,
        },
      ],
    });
  });

  test("inline condition merges with bracket conditions", () => {
    const result = buildCardEffects(
      '[DON!! x2] [When Attacking] If your Leader has the "Navy" type, draw 1 card.',
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("whenAttacking");
    expect(block.conditions).toEqual([
      { condition: "donAttached", amount: 2 },
      { condition: "leaderTrait", trait: "Navy", match: "includes" },
    ]);
    expect(block.actions).toEqual([{ action: "draw", player: "self", amount: 1 }]);
  });

  test("OP12-089 Hack: [On K.O.] If leader trait, K.O. with base cost", () => {
    const result = buildCardEffects(
      'If your Leader has the "Revolutionary Army" type, this Character gains [Blocker] and +4 cost.\n[On K.O.] If your Leader has the "Revolutionary Army" type, K.O. up to 1 of your opponent\'s Characters with a base cost of 4 or less.',
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.conditions).toEqual([
      { condition: "leaderTrait", trait: "Revolutionary Army", match: "includes" },
    ]);
    expect(block.actions[0]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "baseCost", comparison: "lte", value: 4 }],
      },
    });
  });

  test("[When Attacking] If you have 7 or more cards in your trash, draw 1 card", () => {
    const result = buildCardEffects(
      "[When Attacking] If you have 7 or more cards in your trash, draw 1 card.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.conditions).toEqual([
      { condition: "zoneCount", player: "self", zone: "trash", comparison: "gte", value: 7 },
    ]);
  });

  test("no condition when If is absent", () => {
    const result = buildCardEffects("[On Play] Draw 2 cards.");
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.conditions).toBeUndefined();
  });
});

describe("buildCardEffects — OP02 blue Event and Stage regressions", () => {
  test("keeps Impel Down All Stars' post-cost condition on its up-to draw", () => {
    expect(
      buildCardEffects(
        "[Main] You may trash 2 cards from your hand: If your Leader has the [Impel Down] type, draw up to 2 cards. [Trigger] Draw 2 cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          costs: [{ cost: "trashFromHand", amount: 2 }],
          actions: [
            {
              action: "draw",
              player: "self",
              amount: 2,
              upTo: true,
              condition: {
                condition: "leaderTrait",
                trait: "Impel Down",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    });
  });

  test("keeps DEATH WINK's draw-to-hand-size and either-field Trigger", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, draw cards so that you have 2 cards in your hand. [Trigger] Return up to 1 Character with a cost of 7 or less to the owner's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 6000,
              duration: "thisBattle",
            },
            {
              action: "draw",
              player: "self",
              amount: 2,
              untilHandSize: 2,
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 7 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("scopes New Kama Land's Leader condition before its unconditional trailing trash", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may rest this Stage: If your Leader is [Emporio.Ivankov], draw 1 card and trash 1 card from your hand. Then, trash up to 3 cards from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "restThisCard" }],
          actions: [
            {
              action: "draw",
              player: "self",
              amount: 1,
              condition: {
                condition: "leaderName",
                name: "Emporio.Ivankov",
              },
            },
            {
              action: "trashFromHand",
              player: "self",
              amount: 1,
              condition: {
                condition: "leaderName",
                name: "Emporio.Ivankov",
              },
            },
            {
              action: "trashFromHand",
              player: "self",
              amount: 3,
              upTo: true,
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("keeps an on-field cost condition on ordered draw then trash actions", () => {
    expect(
      buildCardEffects(
        "[When Attacking] If you have a Character with a cost of 8 or more on your field, draw 1 card and trash 1 card from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [{ filter: "cost", comparison: "gte", value: 8 }],
            },
          ],
          actions: [
            { action: "draw", player: "self", amount: 1 },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
        },
      ],
    });
  });

  test("keeps a typed Character hand-trash cost before power reduction and draw", () => {
    expect(
      buildCardEffects(
        "[DON!!x1] [When Attacking] You may trash 1 Character card from your hand: Give up to 1 of your opponent's Characters -1000 power during this turn. Then, draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "donAttached", amount: 1 }],
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [{ filter: "cardCategory", value: "character" }],
            },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
            },
            { action: "draw", player: "self", amount: 1 },
          ],
          optional: true,
        },
      ],
    });
  });

  test("keeps a Character hand-trash cost filtered by printed power", () => {
    expect(
      buildCardEffects(
        "[Blocker][On Play] You may trash 1 Character card with 6000 power or more from your hand: Draw 2 cards.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "power", comparison: "gte", value: 6000 },
              ],
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 2 }],
          optional: true,
        },
      ],
    });
  });

  test("schedules an opponent DON!! rest at the start of their next Main Phase", () => {
    expect(
      buildCardEffects(
        "[Your Turn] [On Play] If your Leader is multicolored and your opponent has 7 or less DON!! cards on their field, your opponent rests 1 of their active DON!! cards at the start of their next Main Phase.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            { condition: "turn", value: "your" },
            {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "leaderMulticolored" },
                {
                  condition: "donFieldCount",
                  player: "opponent",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          ],
          actions: [
            {
              action: "delayed",
              timing: "startOfOpponentNextMainPhase",
              actions: [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["costArea"],
                    count: { amount: 1 },
                    filters: [{ filter: "state", value: "active" }],
                    chosenBy: "opponent",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("excludes the source from an owned Leader-or-Character power target", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [When Attacking] Up to 1 of your Leader or Character cards other than this card gains +1000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "excludeSelf" }],
              },
              value: 1000,
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("keeps a rested named-Character condition on a permanent power modifier", () => {
    expect(
      buildCardEffects("If you have a rested [Uta], this Character gains +1000 power."),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                { filter: "state", value: "rested" },
                { filter: "name", value: "Uta" },
              ],
            },
          ],
          actions: [
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
          ],
        },
      ],
    });
  });

  test("preserves a Life look before returning the Trigger card to hand", () => {
    expect(
      buildCardEffects(
        "[Trigger] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, add this card to your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          actions: [
            { action: "lookAtLife", player: "either", position: "topOrBottom", upTo: true },
            { action: "addThisCardToHand" },
          ],
        },
      ],
    });
  });

  test("grants turn unblockable only to the selected eligible attacker", () => {
    expect(
      buildCardEffects(
        "[On Play] Select up to 1 of your {Straw Hat Crew} type Characters with 6000 power or more. If the selected Character attacks during this turn, your opponent cannot activate [Blocker].",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "trait", value: "Straw Hat Crew", match: "includes" },
                  { filter: "power", comparison: "gte", value: 6000 },
                ],
              },
              keyword: "unblockable",
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("makes the controller choose cards trashed from the opponent's hand", () => {
    expect(
      buildCardEffects(
        "[On Play] If your opponent has 6 or more cards in their hand, trash 2 cards from your opponent's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 6,
            },
          ],
          actions: [
            {
              action: "trashFromHand",
              player: "opponent",
              chosenBy: "self",
              amount: 2,
            },
          ],
        },
      ],
    });
  });
});

// ── parseActions — ModifyPowerAction ──

describe("buildCardEffects — Choose one", () => {
  test("preserves both rests in Jango's self-and-opponent choice", () => {
    const effects = buildCardEffects(
      "[On Play] Choose one:\n• Set up to 1 of your {East Blue} type Leader or Character cards with a cost of 6 or less as active.\n• Rest this Character and up to 1 of your opponent's Characters.",
    );

    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "choice",
        options: [
          [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "trait", value: "East Blue", match: "includes" },
                  { filter: "cost", comparison: "lte", value: 6 },
                ],
              },
            },
          ],
          [
            {
              action: "rest",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
            },
          ],
        ],
      },
    ]);
  });

  test("choose one with two parseable options", () => {
    const effects = buildCardEffects(
      "[On Play] Choose one:\n• Trash up to 1 of your opponent's Characters with a cost of 3 or less.\n• Draw 2 cards.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "choice",
      options: [[{ action: "trashFromField" }], [{ action: "draw", amount: 2 }]],
    });
  });

  test("choose one with K.O. and draw options", () => {
    const effects = buildCardEffects(
      "[On Play] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n• Draw 1 card.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    const choice = block.actions[0]!;
    expect(choice).toMatchObject({ action: "choice" });
    if (choice.action === "choice") {
      expect(choice.options).toHaveLength(2);
      expect(choice.options[0]![0]).toMatchObject({ action: "ko" });
      expect(choice.options[1]![0]).toMatchObject({ action: "draw" });
    }
  });

  test("choose one with DON!! cost prefix", () => {
    const effects = buildCardEffects(
      "[On Play] DON!! -3: Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 7 or less.\n• Rest up to 2 of your opponent's Characters.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.costs).toBeDefined();
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({ action: "choice" });
  });
});

// ── Real card integration tests ──

describe("buildCardEffects — OP14-053 Vista", () => {
  test("preserves the opponent-turn hand condition and Leader base-power source", () => {
    expect(
      buildCardEffects(
        "[Blocker]\n[Opponent's Turn] If you have 7 or less cards in your hand, this Character's base power becomes the same as your Leader's base power.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [
            { condition: "turn", value: "opponent" },
            { condition: "handCount", player: "self", comparison: "lte", value: 7 },
          ],
          actions: [
            {
              action: "setBasePowerFrom",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              source: {
                player: "self",
                zones: ["leader"],
                count: { amount: 1 },
              },
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-054 Fisher Tiger", () => {
  test("preserves the Leader-gated draw and dynamic end-turn hand limit", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the {Fish-Man} type, draw 3 cards.\n[End of Your Turn] Trash cards from your hand until you have 5 cards in your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Fish-Man", match: "includes" }],
          actions: [{ action: "draw", player: "self", amount: 3 }],
        },
        {
          trigger: "endOfYourTurn",
          actions: [{ action: "trashFromHandUntil", player: "self", handSize: 5 }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-056 Wadatsumi", () => {
  test("preserves its permanent attack restriction and triggered self-negation", () => {
    expect(
      buildCardEffects(
        "This Character cannot attack.\nWhen a card is trashed from your hand by an effect, this Character's effect is negated during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenCardTrashedFromHandByEffect",
          actions: [
            {
              action: "negateEffects",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "thisTurn",
            },
          ],
        },
      ],
      permanentEffects: [
        {
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-061 Vergo", () => {
  test("preserves replacement ownership and the negative attack modifier", () => {
    expect(
      buildCardEffects(
        "[Once Per Turn] If your {Donquixote Pirates} type Character would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.\n[When Attacking] DON!! −1: Give up to 1 of your opponent's Characters −2000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [{ cost: "returnDon", amount: 1 }],
          optional: true,
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
          ],
        },
      ],
      replacementEffects: [
        {
          replacedEvent: "removeFromField",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            filters: [{ filter: "trait", value: "Donquixote Pirates", match: "includes" }],
          },
          source: "opponentEffect",
          replacementAction: { action: "returnDon", player: "self", amount: 1 },
          oncePerTurn: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-062 Gladius", () => {
  test("preserves the DON!! cost and both filtered On K.O. choices", () => {
    expect(
      buildCardEffects(
        "[On K.O.] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. or rest up to 1 of your opponent's Characters with a base power of 6000 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          costs: [{ cost: "returnDon", amount: 1 }],
          optional: true,
          actions: [
            {
              action: "choice",
              options: [
                [
                  {
                    action: "ko",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "basePower", comparison: "lte", value: 6000 }],
                    },
                  },
                ],
                [
                  {
                    action: "rest",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "basePower", comparison: "lte", value: 6000 }],
                    },
                  },
                ],
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-063 Sugar", () => {
  test("preserves optional active DON!! addition and the complete conditional hand play", () => {
    expect(
      buildCardEffects(
        "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] If your opponent has 6 or more DON!! cards on their field, play up to 1 {Donquixote Pirates} type Character card with a cost of 5 or less from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
        },
        {
          trigger: "onKo",
          conditions: [
            {
              condition: "donFieldCount",
              player: "opponent",
              comparison: "gte",
              value: 6,
            },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 5 },
                { filter: "trait", value: "Donquixote Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-064 Giolla", () => {
  test("preserves the optional rested DON!! and subsequent base-power-0 K.O.", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it. Then, K.O. up to 1 of your opponent's Characters with a base power of 0.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "basePower", comparison: "eq", value: 0 }],
              },
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-065 Senor Pink", () => {
  test("preserves the opponent-owned one-DON!! return action", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Your opponent returns 1 DON!! card from their field to their DON!! deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [{ action: "returnDon", player: "opponent", amount: 1 }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-067 Dellinger", () => {
  test("preserves the optional rested DON!! and complete filtered top-five search", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it, look at 5 cards from the top of your deck; reveal up to 1 {Donquixote Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                {
                  filter: "trait",
                  value: "Donquixote Pirates",
                  match: "includes",
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-068 Trebol", () => {
  test("preserves the nested Leader condition on its DON-return trigger", () => {
    expect(
      buildCardEffects(
        "[Opponent's Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, if your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenDonReturned",
          conditions: [
            { condition: "turn", value: "opponent" },
            { condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" },
          ],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "rested" }],
          oncePerTurn: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-069 Donquixote Doflamingo", () => {
  test("preserves the branch condition and opponent-next-End-Phase duration", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! −3: Choose one:\n•If your Leader has the {Donquixote Pirates} type, K.O. up to 1 of your opponent's Characters with a cost of 8 or less.\n•Up to 3 of your opponent's Characters with a cost of 7 or less cannot be rested until the end of your opponent's next End Phase.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 3 }],
          optional: true,
          actions: [
            {
              action: "choice",
              options: [
                [
                  {
                    action: "ko",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 8 }],
                    },
                    condition: {
                      condition: "leaderTrait",
                      trait: "Donquixote Pirates",
                      match: "includes",
                    },
                  },
                ],
                [
                  {
                    action: "cannotBeRested",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 3, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 7 }],
                    },
                    duration: "untilEndOfOpponentNextEndPhase",
                  },
                ],
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — optional top-Life costs", () => {
  test("keeps a post-cost Leader condition on the result action", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 1 card from the top of your Life cards: If your Leader has the {Straw Hat Crew} type, add up to 2 cards from the top of your deck to the top of your Life cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashLife", amount: 1, position: "top" }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 2, upTo: true },
              },
              position: "top",
              condition: {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("keeps an opponent hand-count condition after a hand-trash cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 2 cards from your hand: If your opponent has 6 or more cards in their hand, your opponent places 2 cards from their hand at the bottom of their deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashFromHand", amount: 2 }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "opponent",
                zones: ["hand"],
                count: { amount: 2 },
                chosenBy: "opponent",
              },
              position: "bottom",
              order: "any",
              condition: {
                condition: "handCount",
                player: "opponent",
                comparison: "gte",
                value: 6,
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — mandatory cost postconditions", () => {
  test("keeps a Counter Leader condition on the action after its mandatory DON!! cost", () => {
    expect(
      buildCardEffects(
        '[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader\'s type includes "Baroque Works", select 1 of your Characters. Change the attack target to the selected Character.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "changeBattleTarget",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
              },
              condition: {
                condition: "leaderTrait",
                trait: "Baroque Works",
                match: "includes",
              },
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-070 Buffalo", () => {
  test("preserves source-qualified rest, optional DON!! return, and dependent activation", () => {
    expect(
      buildCardEffects(
        "When this Character becomes rested by your opponent's Character's effect, you may return 1 DON!! card from your field to your DON!! deck. If you do, set this Character as active.\n[Blocker]",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          source: "opponentCharacterEffect",
          actions: [
            {
              action: "returnDon",
              player: "self",
              amount: 1,
              thenActions: [
                {
                  action: "setActive",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: { amount: 1 },
                    self: true,
                  },
                },
              ],
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-071 Pica", () => {
  test("preserves its end-of-turn Leader condition and optional active DON!!", () => {
    expect(
      buildCardEffects(
        "[End of Your Turn] If your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and set it as active.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "endOfYourTurn",
          conditions: [
            { condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" },
          ],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-072 Baby 5", () => {
  test("preserves optional DON!! ramp and DON!! −1 top-deck-to-top-Life movement", () => {
    expect(
      buildCardEffects(
        "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] DON!! −1: Add up to 1 card from the top of your deck to the top of your Life cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
        },
        {
          trigger: "onKo",
          costs: [{ cost: "returnDon", amount: 1 }],
          optional: true,
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-074 Monet", () => {
  test("preserves Leader-gated active ramp and ordered On K.O. draw, trash, and rested ramp", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] Draw 2 cards and trash 1 card from your hand. Then, add up to 2 DON!! cards from your DON!! deck and rest them.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            { condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" },
          ],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
        },
        {
          trigger: "onKo",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 1 },
            { action: "addDon", count: { amount: 2, upTo: true }, state: "rested" },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-075 Lao.G", () => {
  test("preserves optional rested DON!! ramp followed by an opposing −2000 power modifier", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it. Then, give up to 1 of your opponent's Characters −2000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-081 Spider Mice", () => {
  test("preserves top-three deck trashing and base-cost-exactly-1 K.O.", () => {
    expect(
      buildCardEffects(
        "[On Play] Trash 3 cards from the top of your deck.\n[On K.O.] K.O. up to 1 of your opponent's Characters with a base cost of 1.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [{ action: "trashFromDeck", player: "self", amount: 3 }],
        },
        {
          trigger: "onKo",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "baseCost", comparison: "eq", value: 1 }],
              },
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-082 Oinkchuck", () => {
  test("preserves its On K.O. cost modifier and rested trash-play Trigger", () => {
    expect(
      buildCardEffects(
        "[On K.O.] All of your {Thriller Bark Pirates} type Characters gain +4 cost until the end of your opponent's next End Phase.\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 2 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
              },
              value: 4,
              duration: "untilEndOfOpponentNextEndPhase",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 2 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP11-023 Arlong", () => {
  test("preserves every condition on its absolute hand-cost assignment", () => {
    expect(
      buildCardEffects(
        'If your Leader has the "Fish-Man" type, you have 3 or less Life cards and your opponent has 5 or more rested cards, give this card in your hand 3 cost.\n[Trigger] Rest up to 1 of your opponent\'s Characters with a cost of 4 or less.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
      ],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "leaderTrait", trait: "Fish-Man", match: "includes" },
                { condition: "lifeCount", player: "self", comparison: "lte", value: 3 },
                {
                  condition: "restedCardCount",
                  player: "opponent",
                  comparison: "gte",
                  value: 5,
                },
              ],
            },
          ],
          actions: [
            {
              action: "setCost",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1 },
                self: true,
              },
              value: 3,
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP11-024 Aladine", () => {
  test("preserves both optional costs and the dependent play", () => {
    expect(
      buildCardEffects(
        'When this Character is K.O.\'d by your opponent\'s effect, you may trash 1 card from your hand and rest 1 of your DON!! cards. If you do, play up to 1 "Fish-Man" or "Merfolk" type Character card with a cost of 6 or less from your hand.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          source: "opponentEffect",
          costs: [
            { cost: "trashFromHand", amount: 1 },
            { cost: "restDon", amount: 1 },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 6 },
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Fish-Man", match: "includes" },
                    { filter: "trait", value: "Merfolk", match: "includes" },
                  ],
                },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-083 Ms. Wednesday", () => {
  test("preserves optional self-trash and a −3000 current-cost-0 opposing target", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may trash this Character: Give up to 1 of your opponent's 0 cost Characters −3000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashThisCard" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
              value: -3000,
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-084 Ms. All Sunday", () => {
  test("preserves the Leader condition and distinct filters for both trash plays", () => {
    expect(
      buildCardEffects(
        '[On Play] If your Leader\'s type includes "Baroque Works", play up to 1 Character card with a type including "Baroque Works" and a cost of 4 or less and up to 1 Character card with a type including "Baroque Works" and a cost of 1 from your trash.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Baroque Works", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "eq", value: 1 },
                { filter: "trait", value: "Baroque Works", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-085 Miss.Goldenweek(Marianne)", () => {
  test("preserves ordered draw-2 then trash-2 On K.O. actions", () => {
    expect(buildCardEffects("[On K.O.] Draw 2 cards and trash 2 cards from your hand.")).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-086 Miss Doublefinger(Zala)", () => {
  test("preserves its trash threshold and both permanent modifiers", () => {
    expect(
      buildCardEffects(
        'If you have 7 or more cards in your trash, this Character gains +1000 power, and all of your Characters with a type including "Baroque Works" gain +2 cost.',
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 7,
            },
          ],
          actions: [
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
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
              },
              value: 2,
              duration: undefined,
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-087 Miss.Valentine(Mikita)", () => {
  test("preserves the Leader gate, trait filter, name exclusion, and trash remainder", () => {
    expect(
      buildCardEffects(
        '[On Play] If your Leader\'s type includes "Baroque Works", look at 4 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" other than [Miss.Valentine(Mikita)] and add it to your hand. Then, trash the rest.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
          actions: [
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
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-088 Miss.MerryChristmas(Drophy)", () => {
  test("preserves ordered draw and optional cost-1 Stage K.O. behind the Leader gate", () => {
    expect(
      buildCardEffects(
        "[On K.O.] If your Leader's type includes \"Baroque Works\", draw 1 card and K.O. up to 1 of your opponent's Stages with a cost of 1.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
          actions: [
            { action: "draw", player: "self", amount: 1 },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["stage"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "eq", value: 1 }],
              },
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-089 Ryuma", () => {
  test("preserves the On K.O. sequence and separate rested trash-play Trigger", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Draw 2 cards and trash 2 cards from your hand.\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-090 Mr.1(Daz.Bonez)", () => {
  test("preserves alternative cost conditions, Rush: Character, and On Play rest", () => {
    const result = buildCardEffects(
      "If there is a Character with a cost of 0 or with a cost of 8 or more, this Character can attack Characters on the turn in which it is played.\n[On Play] Rest up to 1 of your opponent's Characters with a cost of 0.",
    );
    expect(result?.effects).toEqual([
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "eq", value: 0 }],
            },
          },
        ],
      },
    ]);
    expect(result?.permanentEffects).toEqual([
      {
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "existsOnField",
                zone: "character",
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
              {
                condition: "existsOnField",
                zone: "character",
                filters: [{ filter: "cost", comparison: "gte", value: 8 }],
              },
            ],
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
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ]);
  });
});

describe("buildCardEffects — OP14-091 Mr.2.Bon.Kurei(Bentham)", () => {
  test("preserves both source zones and every printed eligibility filter", () => {
    expect(
      buildCardEffects(
        '[On K.O.] Play up to 1 Character card with a type including "Baroque Works" and a cost of 5 or less other than [Mr.2.Bon.Kurei(Bentham)] from your hand or trash.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: ["hand", "trash"] },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "excludeName", value: "Mr.2.Bon.Kurei(Bentham)" },
                { filter: "cost", comparison: "lte", value: 5 },
                { filter: "trait", value: "Baroque Works", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — PRB02-006 Roronoa Zoro", () => {
  test("preserves the other-Character restriction on the rest replacement", () => {
    expect(
      buildCardEffects(
        "[Opponent's Turn] If this Character would be rested by your opponent's Character's effect, you may rest 1 of your other Characters instead.[Blocker]",
      ),
    ).toEqual({
      keywords: ["blocker"],
      replacementEffects: [
        {
          replacedEvent: "rested",
          source: "opponentCharacterEffect",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              filters: [{ filter: "excludeSelf" }],
            },
          },
          conditions: [{ condition: "turn", value: "opponent" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-092 Mr.3(Galdino)", () => {
  test("preserves timing, frequency, replacement event, exact count, and deck position", () => {
    expect(
      buildCardEffects(
        "[Opponent's Turn] [Once Per Turn] If this Character would be K.O.'d, you may place 3 cards from your trash at the bottom of your deck in any order instead.",
      ),
    ).toEqual({
      replacementEffects: [
        {
          replacedEvent: "ko",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["trash"],
              count: { amount: 3 },
            },
            position: "bottom",
          },
          conditions: [{ condition: "turn", value: "opponent" }],
          oncePerTurn: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-093 Mr.4(Babe)", () => {
  test("preserves Blocker and every trash-to-hand eligibility filter", () => {
    expect(
      buildCardEffects(
        '[Blocker]\n[On K.O.] Add up to 1 Character card with a type including "Baroque Works" and a cost of 8 or less from your trash to your hand.',
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["trash"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "cardCategory", value: "character" },
                  { filter: "trait", value: "Baroque Works", match: "includes" },
                  { filter: "cost", comparison: "lte", value: 8 },
                ],
              },
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-094 Mr.5(Gem)", () => {
  test("preserves Blocker, the alternative condition, and ordered hand replacement", () => {
    const result = buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If there is a Character with a cost of 0 or with a cost of 8 or more, draw 2 cards and trash 1 card from your hand.",
    );
    expect(result?.keywords).toEqual(["blocker"]);
    expect(result?.effects).toEqual([
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "existsOnField",
                zone: "character",
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
              {
                condition: "existsOnField",
                zone: "character",
                filters: [{ filter: "cost", comparison: "gte", value: 8 }],
              },
            ],
          },
        ],
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 1 },
        ],
      },
    ]);
  });
});

describe("buildCardEffects — OP14-100 Absalom", () => {
  test("preserves the filtered On K.O. search and separate rested trash-play Trigger", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Look at 3 cards from the top of your deck; reveal up to 1 {Thriller Bark Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "search",
              lookCount: 3,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                  match: "includes",
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-102 Kumacy", () => {
  test("preserves its rested Thriller Bark Pirates trash-play Trigger", () => {
    expect(
      buildCardEffects(
        "[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-103 Gloriosa (Grandma Nyon)", () => {
  test("preserves the Life exchange cost and self-only play Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.\n[Trigger] Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "addLifeToHand", amount: 1, position: "choice" }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP01-008 Cavendish", () => {
  test("preserves the optional top-Life cost before granting Rush", () => {
    expect(
      buildCardEffects(
        "[On Play] You may add 1 card from the top of your Life cards to your hand: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "addLifeToHand", amount: 1, position: "top" }],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP01-063 Arlong", () => {
  test("keeps the selected opposing hand card tied to the conditional Life removal", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [Activate:Main] You may rest this Character: Choose 1 card from your opponent's hand; your opponent reveals that card. If the revealed card is an Event, place up to 1 card from your opponent's Life area at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          conditions: [{ condition: "donAttached", amount: 1 }],
          costs: [{ cost: "restThisCard" }],
          actions: [
            {
              action: "revealFromHand",
              player: "opponent",
              amount: 1,
              chosenBy: "self",
              ifRevealedCardMatches: {
                filters: [{ filter: "cardCategory", value: "event" }],
                actions: [
                  {
                    action: "removeFromLife",
                    player: "opponent",
                    count: { amount: 1, upTo: true },
                    destination: "deck",
                    destinationPosition: "bottom",
                  },
                ],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP01-069 Caesar Clown", () => {
  test("keeps the deck play followed by an actual shuffle", () => {
    expect(
      buildCardEffects("[On K.O.] Play up to 1 [Smiley] from your deck, then shuffle your deck."),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "deck" },
              count: { amount: 1, upTo: true },
              filters: [{ filter: "name", value: "Smiley" }],
            },
            {
              action: "shuffleDeck",
              player: "self",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP01-075 Pacifista", () => {
  test("preserves the unlimited-copy deck rule alongside Blocker", () => {
    expect(
      buildCardEffects(
        "Under the rules of this game, you may have any number of this card in your deck. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      deckBuildingRules: [{ rule: "unlimitedCopies" }],
      keywords: ["blocker"],
    });
  });
});

describe("buildCardEffects — OP01-011 Gordon", () => {
  test("preserves the optional ordered hand-to-deck cost before drawing", () => {
    expect(
      buildCardEffects(
        "[On Play] You may place 1 card from your hand at the bottom of your deck: Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnHandToDeck", amount: 1, position: "bottom" }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP01-013 Sanji", () => {
  test("preserves the top-Life cost, turn power, rested DON!! transfer, and once-per-turn limit", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] You may add 1 card from the top of your Life cards to your hand: This Character gains +2000 power during this turn. Then, give this Character up to 2 rested DON!! cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "addLifeToHand", amount: 1, position: "top" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 2000,
              duration: "thisTurn",
            },
            {
              action: "giveDon",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              count: { amount: 2, upTo: true },
              donState: "rested",
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-104 Gecko Moria", () => {
  test("preserves both filtered On Play destinations and the separate Trigger", () => {
    const eligibilityFilters = [
      {
        filter: "trait" as const,
        value: "Thriller Bark Pirates",
        match: "includes" as const,
      },
      { filter: "cost" as const, comparison: "lte" as const, value: 4 },
      { filter: "cardCategory" as const, value: "character" as const },
    ];
    expect(
      buildCardEffects(
        "[On Play] Select up to 1 {Thriller Bark Pirates} type Character with a cost of 4 or less from your trash and play it or add it to the top of your Life cards face-up.\n[Trigger] Play up to 1 Character card with a cost of 4 or less from your trash.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "choice",
              options: [
                [
                  {
                    action: "play",
                    source: { player: "self", zone: "trash" },
                    count: { amount: 1, upTo: true },
                    filters: eligibilityFilters,
                  },
                ],
                [
                  {
                    action: "addToLife",
                    target: {
                      player: "self",
                      zones: ["trash"],
                      count: { amount: 1, upTo: true },
                      filters: eligibilityFilters,
                    },
                    position: "top",
                    faceUp: true,
                  },
                ],
              ],
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-105 Gorgon Sisters", () => {
  test("preserves the reveal cost, DON!! distribution, and gated self-play Trigger", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] [Once Per Turn] You may reveal 3 {Amazon Lily} or {Kuja Pirates} type cards from your hand: Give your Leader and all of your Characters up to 1 rested DON!! card each.\n[Trigger] If your Leader has the {Kuja Pirates} type, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "revealFromHand",
              amount: 3,
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Amazon Lily", match: "includes" },
                    { filter: "trait", value: "Kuja Pirates", match: "includes" },
                  ],
                },
              ],
            },
          ],
          actions: [
            {
              action: "giveDon",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: "all" },
              },
              count: { amount: 1, upTo: true },
              donState: "rested",
              distribution: "each",
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-106 Salome", () => {
  test("preserves Blocker and its self-only play Trigger", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Trigger] Play this card.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-107 Shakuyaku", () => {
  test("preserves Life-gated hand replacement and the Leader-gated Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] If your opponent has 3 or less Life cards, draw 2 cards and trash 2 cards from your hand.\n[Trigger] If your Leader has the {Kuja Pirates} type, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 }],
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-108 Silvers Rayleigh", () => {
  test("preserves both On Play conditions, base power, and Trigger activation", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader is multicolored and your opponent has 3 or less Life cards, K.O. up to 1 of your opponent's Characters with 7000 base power or less.\n[Trigger] Activate this card's [On Play] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "leaderMulticolored" },
                { condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 },
              ],
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "basePower", comparison: "lte", value: 7000 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "onPlay" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-109 Victoria Cindry", () => {
  test("preserves Blocker and the filtered rested trash-play Trigger", () => {
    expect(
      buildCardEffects(
        "[Blocker]\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-110 Dr. Hogback", () => {
  test("distinguishes a Trigger filter from the life Trigger heading", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Play up to 1 Character card with a cost of 4 or less and a [Trigger] other than [Dr. Hogback] from your trash.\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "excludeName", value: "Dr. Hogback" },
                { filter: "hasTrigger", value: true },
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-111 Perona", () => {
  test("preserves both shared triggers, duration, cost filter, and life Trigger", () => {
    const cannotAttackAction = {
      action: "cannotAttack" as const,
      target: {
        player: "opponent" as const,
        zones: ["character" as const],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost" as const, comparison: "lte" as const, value: 6 }],
      },
      duration: "untilEndOfOpponentNextEndPhase" as const,
    };
    expect(
      buildCardEffects(
        "[On Play]/[On K.O.] Up to 1 of your opponent's Characters with a cost of 6 or less cannot attack until the end of your opponent's next End Phase.\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
      ),
    ).toEqual({
      effects: [
        { trigger: "onPlay", actions: [cannotAttackAction] },
        { trigger: "onKo", actions: [cannotAttackAction] },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-112 Boa Hancock", () => {
  test("preserves the Leader-gated Life exchange and filtered hand-play Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the {The Seven Warlords of the Sea} type, add up to 1 card from the top of your deck to the top of your Life cards. Then, add up to 1 card from the top of your opponent's Life cards to the owner's hand.\n[Trigger] Play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "leaderTrait",
              trait: "The Seven Warlords of the Sea",
              match: "includes",
            },
          ],
          actions: [
            {
              action: "addToLife",
              target: { player: "self", zones: ["deck"], count: { amount: 1, upTo: true } },
              position: "top",
            },
            {
              action: "removeFromLife",
              player: "opponent",
              count: { amount: 1, upTo: true },
              destination: "hand",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "hasTrigger", value: true },
                { filter: "power", comparison: "lte", value: 6000 },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-113 Marguerite", () => {
  test("preserves alternative search traits, hand trash, and self-play Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Amazon Lily} or {Kuja Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.\n[Trigger] If your Leader has the {Kuja Pirates} type, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Amazon Lily", match: "includes" },
                    { filter: "trait", value: "Kuja Pirates", match: "includes" },
                  ],
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-114 Ran", () => {
  test("preserves filtered rested-DON distribution and self-play Trigger", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Kuja Pirates} type Leader or Character cards.\n[Trigger] If your Leader has the {Kuja Pirates} type, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "giveDon",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1 },
                filters: [{ filter: "trait", value: "Kuja Pirates", match: "includes" }],
              },
              count: { amount: 1, upTo: true },
              donState: "rested",
            },
          ],
          oncePerTurn: true,
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-115 Rindo", () => {
  test("preserves opponent-turn timing, Life addition, self-damage, and self-play Trigger", () => {
    expect(
      buildCardEffects(
        "[Opponent's Turn] [On K.O.] Add up to 1 card from the top of your deck to the top of your Life cards. Then, you take 1 damage.\n[Trigger] If your Leader has the {Kuja Pirates} type, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onKo",
          conditions: [{ condition: "turn", value: "opponent" }],
          actions: [
            {
              action: "addToLife",
              target: { player: "self", zones: ["deck"], count: { amount: 1, upTo: true } },
              position: "top",
            },
            { action: "dealDamage", player: "self", amount: 1 },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-119 Dracule Mihawk", () => {
  test("preserves both timings, exact duration, optional cost, and battle power", () => {
    expect(
      buildCardEffects(
        "[Your Turn] When this Character becomes rested, up to 1 of your opponent's Characters with a cost of 9 or less cannot be rested until the end of your opponent's next End Phase.\n[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "cannotBeRested",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 9 }],
              },
              duration: "untilEndOfOpponentNextEndPhase",
            },
          ],
        },
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP12 permanent condition regressions", () => {
  test("preserves Ipponmatsu's compound Leader attribute and rested DON condition", () => {
    expect(
      buildCardEffects(
        "If your Leader has the (Slash) attribute and you have 6 or more rested DON!! cards, this Character cannot be rested by your opponent's effects.[Blocker]",
      ),
    ).toEqual({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "leaderAttribute", attribute: "slash" },
                {
                  condition: "donFieldCount",
                  player: "self",
                  comparison: "gte",
                  value: 6,
                  state: "rested",
                },
              ],
            },
          ],
          actions: [
            {
              action: "cannotBeRested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
              byPlayer: "opponent",
            },
          ],
        },
      ],
    });
  });

  test("preserves Alvida's base-cost Character count condition", () => {
    expect(
      buildCardEffects(
        "If you have 2 or more Characters with a base cost of 5 or more, this Character gains +1 cost.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 2,
              filters: [{ filter: "baseCost", comparison: "gte", value: 5 }],
            },
          ],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 1,
              duration: undefined,
            },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-120 Crocodile", () => {
  test("preserves opponent-only conditional draw and self-only On K.O. replay", () => {
    const qualifyingOpponentCost = {
      condition: "compound" as const,
      operator: "or" as const,
      conditions: [
        {
          condition: "hasCard" as const,
          player: "opponent" as const,
          zone: "character" as const,
          filters: [{ filter: "cost" as const, comparison: "eq" as const, value: 0 }],
        },
        {
          condition: "hasCard" as const,
          player: "opponent" as const,
          zone: "character" as const,
          filters: [{ filter: "cost" as const, comparison: "gte" as const, value: 8 }],
        },
      ],
    };
    expect(
      buildCardEffects(
        "[On Play] Up to 1 of your opponent's Characters with a cost of 9 or less cannot attack until the end of your opponent's next End Phase. Then, if your opponent has a Character with a cost of 0 or with a cost of 8 or more, draw 1 card.\n[On K.O.] You may trash 1 card from your hand: Play this Character card from your trash.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 9 }],
              },
              duration: "untilEndOfOpponentNextEndPhase",
            },
            { action: "draw", player: "self", amount: 1, condition: qualifyingOpponentCost },
          ],
        },
        {
          trigger: "onKo",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1 },
              self: true,
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-052 Hannyabal", () => {
  test("preserves Blocker, optional hand-trash cost, and filtered hand play", () => {
    expect(
      buildCardEffects(
        "[Blocker]\n[On Play] You may trash 3 cards from your hand: Play up to 1 {Impel Down} type Character card with a cost of 6 or less from your hand.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashFromHand", amount: 3 }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 6 },
                { filter: "trait", value: "Impel Down", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-051 Hatchan", () => {
  test("preserves the DON!! x2 condition on its On K.O. draw", () => {
    expect(buildCardEffects("[DON!! x2] [On K.O.] Draw 1 card.")).toEqual({
      effects: [
        {
          trigger: "onKo",
          conditions: [{ condition: "donAttached", amount: 2 }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-050 Chew", () => {
  test("preserves the Fish-Man Leader condition on its On Play draw", () => {
    expect(
      buildCardEffects("[On Play] If your Leader has the {Fish-Man} type, draw 1 card."),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Fish-Man", match: "includes" }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-049 Jinbe", () => {
  test("preserves the Rush trigger and optional DON!! cost before ordered actions", () => {
    expect(
      buildCardEffects(
        "When a card is trashed from your hand by an effect, this Character gains [Rush] during this turn.\n[On Play] You may rest 2 of your DON!! cards: Draw 2 cards and return up to 1 Character with a cost of 7 or less to the owner's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenCardTrashedFromHandByEffect",
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "onPlay",
          costs: [{ cost: "restDon", amount: 2 }],
          actions: [
            { action: "draw", player: "self", amount: 2 },
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 7 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP14-048 Shiryu", () => {
  test("preserves the optional return followed by mandatory whole-hand trash", () => {
    expect(
      buildCardEffects(
        "[On Play] Return up to 1 of your opponent's Characters to the owner's hand. Then, trash all cards from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
            },
            { action: "trashFromHand", player: "self", amount: "all" },
          ],
        },
      ],
    });
  });
});

describe("buildCardEffects — Jinbe EB04-015 integration", () => {
  test("[On K.O.] rest cost + multi-trait leader condition + play action", () => {
    const result = buildCardEffects(
      "[Blocker]\n[On K.O.] You may rest 1 of your cards: If your Leader has the {Fish-Man} or {Merfolk} type, play up to 1 green Character card with a cost of 6 or less from your hand.",
    );
    expect(result).toBeDefined();
    expect(result!.keywords).toContain("blocker");
    expect(result!.effects).toHaveLength(1);

    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.optional).toBe(true);

    // Cost: rest 1 of your cards
    expect(block.costs).toEqual([{ cost: "restCards", amount: 1 }]);

    // Action: play up to 1 green Character card with cost 6 or less from hand
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "play",
      source: { player: "self", zone: "hand" },
      count: { amount: 1, upTo: true },
      filters: expect.arrayContaining([
        { filter: "color", value: "green" },
        { filter: "cardCategory", value: "character" },
        { filter: "cost", comparison: "lte", value: 6 },
      ]),
      condition: {
        condition: "compound",
        operator: "or",
        conditions: [
          { condition: "leaderTrait", trait: "Fish-Man", match: "includes" },
          { condition: "leaderTrait", trait: "Merfolk", match: "includes" },
        ],
      },
    });
  });
});

describe("buildCardEffects — EB04 Animal Kingdom Pirates regressions", () => {
  test("preserves an unbracketed temporary Rush grant before a second action", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -2: If your Leader has the {Animal Kingdom Pirates} type, this Character gains Rush during this turn. Then, rest up to 1 of your opponent's Characters with a cost of 7 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 2 }],
          optional: true,
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "thisTurn",
              condition: {
                condition: "leaderTrait",
                trait: "Animal Kingdom Pirates",
                match: "includes",
              },
            },
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 7 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("preserves every action in a compound replacement payment", () => {
    const result = buildCardEffects(
      "[Opponent's Turn] If your blue \"Navy\" type Character would be removed from the field by your opponent's effect, you may rest this Character and trash 1 card from your hand instead.",
    );

    expect(result?.replacementEffects).toEqual([
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          filters: [
            { filter: "color", value: "blue" },
            { filter: "trait", value: "Navy", match: "includes" },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "sequence",
          actions: [
            {
              action: "rest",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
            {
              action: "trashFromHand",
              player: "self",
              amount: 1,
            },
          ],
        },
        conditions: [{ condition: "turn", value: "opponent" }],
      },
    ]);
  });

  test("preserves a trait restriction on a trash-to-deck cost", () => {
    const result = buildCardEffects(
      '[On Play] You may place 3 "Revolutionary Army" type cards from your trash at the bottom of your deck in any order: If your Leader has the "Revolutionary Army" type, play up to 1 Character card with a cost of 6 or less from your trash.',
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      {
        cost: "returnTrashToDeck",
        amount: 3,
        position: "bottom",
        filters: [{ filter: "trait", value: "Revolutionary Army", match: "includes" }],
      },
    ]);
  });

  test("uses included-trait matching for a bracketed trash-to-deck cost", () => {
    const result = buildCardEffects(
      "[Activate: Main] You may place 4 [Thriller Bark Pirates] type cards from your trash at the bottom of your deck in any order: This Character gains [Banish] during this turn.",
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      {
        cost: "returnTrashToDeck",
        amount: 4,
        position: "bottom",
        filters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
      },
    ]);
  });

  test("preserves an included-trait restriction on a trash-to-deck cost", () => {
    const result = buildCardEffects(
      '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 3 or less.',
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      {
        cost: "returnTrashToDeck",
        amount: 2,
        position: "bottom",
        filters: [{ filter: "trait", value: "CP", match: "includes" }],
      },
    ]);
  });

  test("preserves an exact-cost Character hand cost after a DON!! cost", () => {
    const result = buildCardEffects(
      "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 1 Character card with a cost of 5 from your hand: This Character gains [Rush] during this turn.",
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      { cost: "returnDon", amount: 1 },
      {
        cost: "trashFromHand",
        amount: 1,
        filters: [
          { filter: "cardCategory", value: "character" },
          { filter: "cost", comparison: "eq", value: 5 },
        ],
      },
    ]);
  });

  test("preserves a trait-filtered card trashed from hand as an optional cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 1 {Animal Kingdom Pirates} type card from your hand: Draw 2 cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [
                {
                  filter: "trait",
                  value: "Animal Kingdom Pirates",
                  match: "includes",
                },
              ],
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 2 }],
          optional: true,
        },
      ],
    });
  });

  test("preserves the Trigger filter on a trash-from-hand cost", () => {
    const result = buildCardEffects(
      "[Activate:Main] You may trash 1 card with a [Trigger] from your hand: Rest up to 1 of your opponent's Characters with a cost of 2 or less.",
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      {
        cost: "trashFromHand",
        amount: 1,
        filters: [{ filter: "hasTrigger", value: true }],
      },
    ]);
  });

  test("preserves the attacking source for this Character's battle K.O. trigger", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [Once Per Turn] When this Character battles and K.O.'s your opponent's Character, set this Character as active.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenCharacterKod",
          eventFilter: {
            player: "opponent",
            koCause: "battle",
            sourceSelf: true,
          },
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("preserves both parts of a DON!! and self-rest compound cost", () => {
    const result = buildCardEffects(
      '[Activate: Main] You may rest 1 of your DON!! cards and this Character: Look at 5 cards from the top of your deck; reveal up to 1 "Donquixote Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      { cost: "restDon", amount: 1 },
      { cost: "restThisCard" },
    ]);
  });

  test("preserves compound costs in printed order", () => {
    const result = buildCardEffects(
      "[Activate: Main] You may rest this Character and trash 1 card from your hand: Up to 1 of your {Alabasta} type Characters gains [Unblockable] during this turn.",
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      { cost: "restThisCard" },
      { cost: "trashFromHand", amount: 1 },
    ]);
  });

  test("maps returning this Character to the owner's hand as a self-only cost", () => {
    const result = buildCardEffects(
      "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may return this Character to the owner's hand: Play up to 1 Character with a cost of 3 from your hand.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "restDon", amount: 1 }, { cost: "returnThisToHand" }],
      optional: true,
    });
  });

  test("uses the trash count and preserves alternative traits in a compound cost", () => {
    const result = buildCardEffects(
      "[End of Your Turn] You may rest 2 of your DON!! cards and trash 1 {Animal Kingdom Pirates} or {Straw Hat Crew} type card from your hand: Set this Character as active.",
    );

    expect(result?.effects?.[0]?.costs).toEqual([
      { cost: "restDon", amount: 2 },
      {
        cost: "trashFromHand",
        amount: 1,
        filters: [
          {
            filter: "anyOf",
            filters: [
              {
                filter: "trait",
                value: "Animal Kingdom Pirates",
                match: "includes",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
                match: "includes",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("preserves Flame Emperor's compound Leader keyword and power follow-up", () => {
    const result = buildCardEffects(
      "[Main] If your Leader is [Portgas.D.Ace], K.O. up to 1 of your opponent's Characters with 8000 power or less, and your Leader gains [Double Attack] and +3000 power during this turn. (This card deals 2 damage.) [Trigger] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      conditions: [{ condition: "leaderName", name: "Portgas.D.Ace" }],
      actions: [
        { action: "ko" },
        { action: "grantKeyword", keyword: "doubleAttack", duration: "thisTurn" },
        { action: "modifyPower", value: 3000, duration: "thisTurn" },
      ],
    });
    expect(result?.effects?.[1]).toMatchObject({ trigger: "trigger", actions: [{ action: "ko" }] });
  });

  test("maps Fire Fist's Event-only hand cost and both ordered K.O. actions", () => {
    const result = buildCardEffects(
      "[Main] You may trash 1 Event from your hand: K.O. up to 1 of your opponent's Characters with 5000 power or less and up to 1 of your opponent's Characters with 4000 power or less. [Trigger] K.O. up to 1 of your opponent's Characters with 5000 power or less.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      costs: [
        {
          cost: "trashFromHand",
          amount: 1,
          filters: [{ filter: "cardCategory", value: "event" }],
        },
      ],
      actions: [
        { action: "ko", target: { filters: [{ value: 5000 }] } },
        { action: "ko", target: { filters: [{ value: 4000 }] } },
      ],
      optional: true,
    });
    expect(result?.effects?.[1]).toMatchObject({ trigger: "trigger", actions: [{ action: "ko" }] });
  });
});

describe("buildCardEffects — OP03 early Character regressions", () => {
  test("preserves Curiel's Character-only attack permission and DON!!-gated full Rush", () => {
    expect(
      buildCardEffects(
        "This Character cannot attack a Leader on the turn in which it is played. [DON!! x1] This Character gains [Rush]. (This card can attack on the turn in which it is played.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rushCharacter",
              duration: "permanent",
            },
          ],
        },
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("preserves Thatch's self-trash as an end-of-turn delayed action", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] This Character gains +2000 power during this turn. Then, trash this Character at the end of this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 2000,
              duration: "thisTurn",
            },
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [{ action: "trashThisCard" }],
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("preserves Corgy's optional trash count before bottom-deck ordering", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck and trash up to 2 cards. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rearrangeDeck",
              player: "self",
              count: 5,
              position: "bottom",
              trashUpTo: 2,
            },
          ],
        },
      ],
    });
  });

  test("preserves Spandam's inclusive CP Leader condition and search filter", () => {
    expect(
      buildCardEffects(
        '[On Play] If your Leader\'s type include "CP", look at 3 cards from the top of your deck; reveal up to 1 card with a type including "CP" other than [Spandam] and add it to your hand. Then, trash the rest.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "CP", match: "includes" }],
          actions: [
            {
              action: "search",
              lookCount: 3,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Spandam" },
                { filter: "trait", value: "CP", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "trash",
            },
          ],
        },
      ],
    });
  });

  test("preserves Kingbaum's top-or-bottom Life cost before playing the Trigger card", () => {
    expect(
      buildCardEffects(
        "[Trigger] You may trash 1 card from the top or bottom of your Life cards: Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "trashLife", amount: 1, position: "choice" }],
          actions: [{ action: "playThisCard" }],
          optional: true,
        },
      ],
    });
  });

  test.each([
    [
      "[DON!! x1] [When Attacking] You may trash 1 card with a [Trigger] from your hand: This Character gains +3000 power during this battle.",
      "whenAttacking",
    ],
    [
      "[On Play] You may trash 1 card with a [Trigger] from your hand: K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
      "onPlay",
    ],
  ] as const)("preserves the filtered Trigger-card hand cost", (text, trigger) => {
    const effect = buildCardEffects(text)?.effects?.[0];
    expect(effect).toMatchObject({
      trigger,
      costs: [
        {
          cost: "trashFromHand",
          amount: 1,
          filters: [{ filter: "hasTrigger", value: true }],
        },
      ],
      optional: true,
    });
  });

  test("preserves OP04 Igaram's ordered activation costs and inclusive search", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may rest this Character and give your 1 active Leader -5000 power during this turn: Look at 5 cards from the top of your deck; reveal up to 1 [Alabasta] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "restThisCard" },
            {
              cost: "modifyLeaderPower",
              value: -5000,
              duration: "thisTurn",
              requiresActive: true,
            },
          ],
          actions: [
            {
              action: "search",
              revealFilters: [{ filter: "trait", value: "Alabasta", match: "includes" }],
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves OP04 Kung Fu Jugon's conditional permanent Blocker", () => {
    expect(
      buildCardEffects(
        "If you have a [Kung Fu Jugon] other than this Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "field",
              filters: [{ filter: "excludeSelf" }, { filter: "name", value: "Kung Fu Jugon" }],
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

  test("preserves OP04 Super Spot-Billed Duck Troops' end-of-turn return", () => {
    expect(
      buildCardEffects(
        "[When Attacking] You may give your 1 active Leader -5000 power during this turn: Return this Character to the owner's hand at the end of this turn.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [
            {
              cost: "modifyLeaderPower",
              value: -5000,
              duration: "thisTurn",
              requiresActive: true,
            },
          ],
          actions: [
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [{ action: "returnToHand" }],
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP04-026 Senor Pink", () => {
  test("gates both the rest and delayed DON!! activation on the Leader trait", () => {
    expect(
      buildCardEffects(
        "[When Attacking] (1) (You may rest the specified number of DON!! cards in your cost area.): If your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters with a cost of 4 or less. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [{ cost: "restDon", amount: 1 }],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
              condition: {
                condition: "leaderTrait",
                trait: "Donquixote Pirates",
                match: "includes",
              },
            },
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [
                {
                  action: "setActive",
                  target: {
                    player: "self",
                    zones: ["costArea"],
                    count: { amount: 1, upTo: true },
                  },
                },
              ],
              condition: {
                condition: "leaderTrait",
                trait: "Donquixote Pirates",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});

describe("buildCardEffects — OP08-074 Black Maria", () => {
  test("schedules the dynamic DON!! equalization for the end of the current turn", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] If you have no other [Black Maria] Characters, add up to 5 DON!! cards from your DON!! deck and rest them. Then, at the end of this turn, return DON!! cards from your field to your DON!! deck until you have the same number of DON!! cards on your field as your opponent.",
      )?.effects?.[0]?.actions,
    ).toEqual([
      {
        action: "addDon",
        count: { amount: 5, upTo: true },
        state: "rested",
      },
      {
        action: "delayed",
        timing: "endOfThisTurn",
        actions: [
          {
            action: "returnDon",
            player: "self",
            amount: 0,
            untilSameCountAsOpponent: true,
          },
        ],
      },
    ]);
  });
});

describe("buildCardEffects — EB01 Event and Stage grammar", () => {
  test("keeps a top-deck trash payment before Finger Pistol's Main action", () => {
    const effects = buildCardEffects(
      "[Main] You may trash 2 cards from the top of your deck: K.O. up to 1 of your opponent's Characters with a cost of 5 or less. [Trigger] Activate this card's [Main] effect.",
    );

    expect(effects?.effects).toEqual([
      {
        trigger: "main",
        conditions: [
          { condition: "zoneCount", player: "self", zone: "deck", comparison: "gte", value: 2 },
        ],
        actions: [
          { action: "trashFromDeck", player: "self", amount: 2 },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 5 }],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [{ action: "activateEffect", effectTrigger: "main" }],
      },
    ]);
  });

  test("keeps mandatory until-one-Life continuations", () => {
    const kingdomCome = buildCardEffects(
      "[Main] K.O. up to 1 of your opponent's Characters. Then, trash cards from the top of your Life cards until you have 1 Life card.[Trigger] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.",
    );
    const kami = buildCardEffects(
      "[Main] Play up to 1 [Enel] with a cost of 7 or less from your hand or trash. Then, trash cards from the top of your Life cards until you have 1 Life card. [Trigger] Draw 2 cards and trash 1 card from your hand.",
    );

    expect(kingdomCome?.effects?.[0]?.actions).toContainEqual({
      action: "removeFromLife",
      player: "self",
      count: { untilRemaining: 1 },
      destination: "trash",
      position: "top",
    });
    expect(kami?.effects?.[0]?.actions).toEqual([
      {
        action: "play",
        source: { player: "self", zone: ["hand", "trash"] },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 7 },
          { filter: "name", value: "Enel" },
        ],
      },
      {
        action: "removeFromLife",
        player: "self",
        count: { untilRemaining: 1 },
        destination: "trash",
        position: "top",
      },
    ]);
  });

  test("parses Mini-Merry's filtered Character deck-return payment", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may rest this card and place 1 of your Characters with 1000 base power at the bottom of your deck: Draw 1 card.",
      )?.effects,
    ).toEqual([
      {
        trigger: "activateMain",
        costs: [
          { cost: "restThisCard" },
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "self",
            filters: [{ filter: "basePower", comparison: "eq", value: 1000 }],
          },
        ],
        actions: [{ action: "draw", player: "self", amount: 1 }],
        optional: true,
      },
    ]);
  });

  test("parses Loguetown's ordered self-and-hand deck-return payment", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may place this card and 1 card from your hand at the bottom of your deck in any order: Draw 2 cards.[Trigger] Play this card.",
      )?.effects,
    ).toEqual([
      {
        trigger: "activateMain",
        costs: [{ cost: "returnThisAndHandToDeck", handAmount: 1, position: "bottom" }],
        actions: [{ action: "draw", player: "self", amount: 2 }],
        optional: true,
      },
      { trigger: "trigger", actions: [{ action: "playThisCard" }] },
    ]);
  });

  test("keeps a leading draw condition scoped before revealing and playing exact hand cards", () => {
    const effects = buildCardEffects(
      '[On Play] If there is a Character with a cost of 8 or more, draw 1 card. Then, reveal up to 2 "Dressrosa" type Character cards with a cost of 7 or less other than [Rebecca] from your hand. Play 1 of the revealed cards and play the other card rested if it has a cost of 4 or less.',
    );

    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "draw",
        player: "self",
        amount: 1,
        condition: {
          condition: "existsOnField",
          zone: "character",
          filters: [{ filter: "cost", comparison: "gte", value: 8 }],
        },
      },
      expect.objectContaining({
        action: "revealFromHand",
        player: "self",
        amount: 2,
        upTo: true,
        filters: expect.arrayContaining([
          { filter: "excludeName", value: "Rebecca" },
          { filter: "trait", value: "Dressrosa", match: "includes" },
          { filter: "cardCategory", value: "character" },
          { filter: "cost", comparison: "lte", value: 7 },
        ]),
        thenActions: [
          expect.objectContaining({ action: "playGrouped", previousActionTargets: true }),
        ],
      }),
    ]);
  });

  test("gates an opponent-attack effect by the attacking Character's attribute", () => {
    const effects = buildCardEffects(
      "[Once Per Turn] This effect can be activated when your opponent's Character attacks. If that Character has the (Slash) attribute, this Character gains +5000 power during this battle.",
    );

    expect(effects?.effects).toEqual([
      {
        trigger: "onOpponentAttack",
        optional: true,
        actions: [
          expect.objectContaining({
            action: "modifyPower",
            value: 5000,
          }),
        ],
        conditions: [
          {
            condition: "triggerEventCard",
            filters: [{ filter: "attribute", value: "slash" }],
          },
        ],
        oncePerTurn: true,
      },
    ]);
  });

  test("preserves Event and Trigger provenance for an opponent activation", () => {
    const effects = buildCardEffects(
      "[Your Turn] [Once Per Turn] This effect can be activated when your opponent activates an Event or [Trigger]. If your opponent has 2 or more Life cards, trash 1 card from the top of each of your and your opponent's Life cards.",
    );

    expect(effects?.effects).toEqual([
      expect.objectContaining({
        trigger: "whenOpponentActivatesEvent",
        optional: true,
        oncePerTurnKey: "opponentEventOrTrigger",
        conditions: expect.arrayContaining([
          { condition: "turn", value: "your" },
          { condition: "lifeCount", player: "opponent", comparison: "gte", value: 2 },
        ]),
        actions: [expect.objectContaining({ action: "sequence" })],
        oncePerTurn: true,
      }),
      expect.objectContaining({
        trigger: "whenTriggerActivates",
        optional: true,
        oncePerTurnKey: "opponentEventOrTrigger",
        eventFilter: expect.objectContaining({ causedBy: "opponent" }),
        actions: [expect.objectContaining({ action: "sequence" })],
        oncePerTurn: true,
      }),
    ]);
  });

  test("builds a once-per-turn non-self removal replacement into face-down Life", () => {
    const effects = buildCardEffects(
      '[Blocker]\n[Once Per Turn] If your "Supernovas" type Character other than [Capone"Gang"Bege] would be removed from the field by your opponent\'s effect, you may add it to the top of your Life cards face-down instead.',
    );

    expect(effects?.replacementEffects).toEqual([
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          filters: [
            { filter: "trait", value: "Supernovas", match: "includes" },
            { filter: "excludeName", value: 'Capone"Gang"Bege' },
          ],
        },
        replacementAction: {
          action: "addToLife",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
          },
          position: "top",
          previousActionTargets: true,
        },
        oncePerTurn: true,
      },
    ]);
  });

  test("builds a self-K.O. replacement that rests an eligible Leader", () => {
    const effects = buildCardEffects(
      "If this Character would be K.O.'d, you may rest 1 of your [Fish-Man Island] or your [Shirahoshi] Leader instead.",
    );

    expect(effects?.replacementEffects).toEqual([
      {
        replacedEvent: "ko",
        eventFilter: { targetSelf: true },
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader"],
            count: { amount: 1 },
            filters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Fish-Man Island", match: "includes" },
                  { filter: "name", value: "Shirahoshi" },
                ],
              },
            ],
          },
        },
      },
    ]);
  });

  test("preserves a second Activate Main block that looks at an opponent's deck", () => {
    const effects = buildCardEffects(
      '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Big Mom Pirates" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Activate: Main] DON!! -1, You may rest this Character: Look at 1 card from the top of your opponent\'s deck.',
    );

    expect(effects?.effects).toEqual([
      expect.objectContaining({ trigger: "onPlay" }),
      {
        trigger: "activateMain",
        costs: [{ cost: "returnDon", amount: 1 }, { cost: "restThisCard" }],
        actions: [{ action: "lookAtTopDeckCard", player: "opponent" }],
        optional: true,
      },
    ]);
  });
});
