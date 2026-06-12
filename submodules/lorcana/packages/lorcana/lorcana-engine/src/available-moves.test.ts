import { describe, expect, it } from "bun:test";

import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "./testing";

const questableCharacter = createMockCharacter({
  id: "am-questable",
  name: "Questable Character",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const freshCharacter = createMockCharacter({
  id: "am-fresh",
  name: "Fresh Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "am-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const handCharacter = createMockCharacter({
  id: "am-hand",
  name: "Hand Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const evasiveDefender = createMockCharacter({
  id: "am-evasive-defender",
  name: "Evasive Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "am-evasive-defender-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const evasiveAttacker = createMockCharacter({
  id: "am-evasive-attacker",
  name: "Evasive Attacker",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "am-evasive-attacker-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const nonEvasiveAttacker = createMockCharacter({
  id: "am-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const targetedAction = createMockAction({
  id: "am-targeted-action",
  name: "Targeted Action",
  cost: 2,
  text: "Deal 3 damage to chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});

const playerTargetAction = createMockAction({
  id: "am-player-target-action",
  name: "Player Target Action",
  cost: 2,
  text: "Chosen player gains 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CHOSEN_PLAYER",
      },
    },
  ],
});

const opponentChoosesBanishAction = createMockAction({
  id: "am-opponent-chooses-banish",
  name: "Opponent Chooses Banish",
  cost: 4,
  text: "Each opponent chooses and banishes one of their characters.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

const multiTargetAction = createMockAction({
  id: "am-multi-target-action",
  name: "Multi Target Action",
  cost: 2,
  text: "Exert 2 chosen opposing characters.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 2,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

const wardedOpponent = createMockCharacter({
  id: "am-warded-opponent",
  name: "Warded Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "am-warded-opponent-ward",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
});

const singerFive = createMockCharacter({
  id: "am-singer-five",
  name: "Singer Five",
  cost: 3,
  abilities: [
    {
      id: "am-singer-five-kw",
      keyword: "Singer",
      text: "Singer 5",
      type: "keyword",
      value: 5,
    },
  ],
});

const helperSinger = createMockCharacter({
  id: "am-helper-singer",
  name: "Helper Singer",
  cost: 3,
});

const voicelessSinger = createMockCharacter({
  id: "am-voiceless-singer",
  name: "Voiceless Singer",
  cost: 4,
  abilities: [
    {
      id: "am-voiceless-singer-static",
      name: "VOICELESS",
      text: "VOICELESS This character can't {E} to sing songs.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
    },
  ],
});

const discardCostAbilityCharacter = createMockCharacter({
  id: "am-discard-cost-ability",
  name: "Discard Cost Ability",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "am-discard-cost-ability-1",
      name: "GOOD AIM",
      text: "GOOD AIM Once during your turn, you may choose and discard a card to deal 2 damage to chosen character.",
      type: "activated",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});

const singTogetherSong = createMockSong({
  id: "am-sing-together-song",
  name: "Big Chorus",
  cost: 8,
  text: "Sing Together 8. Draw a card.",
  abilities: [
    {
      id: "am-sing-together-song-kw",
      keyword: "SingTogether",
      text: "Sing Together 8",
      type: "keyword",
      value: 8,
    },
  ],
});

const shiftBaseCharacter = createMockCharacter({
  id: "am-shift-base",
  name: "Shift Hero",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const discardShiftCharacter = createMockCharacter({
  id: "am-discard-shift",
  name: "Shift Hero",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  abilities: [
    {
      id: "am-discard-shift-kw",
      keyword: "Shift",
      text: "Shift: Discard a song card",
      type: "keyword",
      shiftTarget: "Shift Hero",
      cost: {
        discardCards: 1,
        discardChosen: true,
        discardCardType: "song",
      },
    },
  ],
});

const multiDiscardShiftCharacter = createMockCharacter({
  id: "am-multi-discard-shift",
  name: "Shift Hero",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  abilities: [
    {
      id: "am-multi-discard-shift-kw",
      keyword: "Shift",
      text: "Shift: Discard 2 cards",
      type: "keyword",
      shiftTarget: "Shift Hero",
      cost: {
        discardCards: 2,
        discardChosen: true,
      },
    },
  ],
});

describe("LorcanaEngineBase.getAvailableMoves", () => {
  it("returns quest move with questable characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const questMove = moves.find((m) => m.moveId === "quest");

    expect(questMove).toBeDefined();
    expect(questMove!.selectableCardIds.length).toBe(1);
  });

  it("does not return quest for fresh (drying) characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: freshCharacter, isDrying: true }],
        deck: 1,
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const questMove = moves.find((m) => m.moveId === "quest");

    expect(questMove).toBeUndefined();
  });

  it("returns challenge move with valid attackers", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const challengeMove = moves.find((m) => m.moveId === "challenge");

    expect(challengeMove).toBeDefined();
    expect(challengeMove!.selectableCardIds.length).toBe(1);
  });

  it("surfaces activated abilities that need discard-cost selection before execution", () => {
    const secondHandCard = createMockCharacter({
      id: "am-second-hand-card",
      name: "Second Hand Card",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: discardCostAbilityCharacter, isDrying: false }],
        hand: [handCharacter, secondHandCard],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [opponentCharacter],
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const activateMove = moves.find((move) => move.moveId === "activateAbility");

    expect(activateMove).toBeDefined();
    expect(activateMove?.selectableCardIds).toContain(
      testEngine.asPlayerOne().getCard(discardCostAbilityCharacter).id,
    );
  });

  it("lists activated abilities that need discard-cost selection in move options", () => {
    const secondHandCard = createMockCharacter({
      id: "am-third-hand-card",
      name: "Third Hand Card",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: discardCostAbilityCharacter, isDrying: false }],
        hand: [handCharacter, secondHandCard],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [opponentCharacter],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const activateMove = p1.getAvailableMoves().find((move) => move.moveId === "activateAbility");

    expect(activateMove?.selectableCardIds).toHaveLength(1);

    const [abilityCardId] = activateMove!.selectableCardIds;
    const abilityOptions = p1.getMoveOptions("activateAbility", abilityCardId!);

    expect(abilityOptions).toContainEqual({
      kind: "ability",
      abilityIndex: 0,
      abilityLabel: "GOOD AIM",
      selectableCosts: [
        {
          kind: "discardCards",
          count: 1,
          candidateCardIds: expect.any(Array),
          zone: "hand",
        },
      ],
    });
  });

  it("surfaces discard-cost Shift cards in available moves when payment and a legal target exist", () => {
    const discardSong = createMockSong({
      id: "am-shift-discard-song",
      name: "Shift Song",
      cost: 2,
      text: "Sing this song.",
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [shiftBaseCharacter],
        hand: [discardSong, discardShiftCharacter],
        deck: 1,
        inkwell: 0,
      },
      {
        deck: 1,
      },
    );

    const shiftMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "shiftCard");

    expect(shiftMove).toBeDefined();
    expect(shiftMove?.selectableCardIds).toContain(
      testEngine.asPlayerOne().getCard(discardShiftCharacter).id,
    );
  });

  it("lists typed discard-cost Shift targets with selectable discard costs", () => {
    const discardSong = createMockSong({
      id: "am-shift-discard-song-option",
      name: "Shift Song Option",
      cost: 2,
      text: "Sing this song.",
    });
    const secondDiscardSong = createMockSong({
      id: "am-shift-discard-song-option-2",
      name: "Shift Song Option Two",
      cost: 2,
      text: "Sing this song too.",
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [shiftBaseCharacter],
        hand: [discardSong, secondDiscardSong, discardShiftCharacter],
        deck: 1,
        inkwell: 0,
      },
      {
        deck: 1,
      },
    );

    const player = testEngine.asPlayerOne();
    const shiftCardId = testEngine.findCardInstanceId(discardShiftCharacter, "hand", "player_one");
    const shiftTargetId = testEngine.findCardInstanceId(shiftBaseCharacter, "play", "player_one");
    const discardSongId = testEngine.findCardInstanceId(discardSong, "hand", "player_one");
    const secondDiscardSongId = testEngine.findCardInstanceId(
      secondDiscardSong,
      "hand",
      "player_one",
    );

    expect(player.getMoveOptions("shiftCard", shiftCardId)).toContainEqual({
      kind: "card",
      cardId: shiftTargetId,
      selectableCosts: [
        {
          kind: "discardCards",
          count: 1,
          candidateCardIds: [discardSongId, secondDiscardSongId],
          zone: "hand",
          cardType: "song",
        },
      ],
    });
  });

  it("blocks playing a second card when ink is exhausted after paying for the first", () => {
    const threeDropA = createMockCharacter({
      id: "am-three-drop-a",
      name: "Three Drop A",
      cost: 3,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const threeDropB = createMockCharacter({
      id: "am-three-drop-b",
      name: "Three Drop B",
      cost: 3,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeDropA, threeDropB],
        deck: 1,
        inkwell: 4,
      },
      {
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();

    // Player should be able to play one 3-cost card with 4 ink
    const movesBeforePlay = p1.getAvailableMoves();
    const playMoveBefore = movesBeforePlay.find((m) => m.moveId === "playCard");
    expect(playMoveBefore).toBeDefined();

    // Play the first card
    const cardAId = testEngine.findCardInstanceId(threeDropA, "hand", "player_one");
    p1.playCard(cardAId);

    // After playing a 3-cost card with 4 ink, only 1 ink remains
    // The second 3-cost card should not be playable
    const movesAfterPlay = p1.getAvailableMoves();
    const playMoveAfter = movesAfterPlay.find((m) => m.moveId === "playCard");
    const secondCardId = testEngine.findCardInstanceId(threeDropB, "hand", "player_one");
    p1.playCard(secondCardId);

    if (playMoveAfter) {
      expect(playMoveAfter.selectableCardIds).not.toContain(secondCardId);
    }
  });

  it("lists untyped multi-discard Shift targets with selectable discard costs", () => {
    const firstDiscardCard = createMockCharacter({
      id: "am-shift-discard-any-1",
      name: "Any Shift Card One",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const secondDiscardCard = createMockCharacter({
      id: "am-shift-discard-any-2",
      name: "Any Shift Card Two",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const thirdDiscardCard = createMockAction({
      id: "am-shift-discard-any-3",
      name: "Any Shift Card Three",
      cost: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [shiftBaseCharacter],
        hand: [firstDiscardCard, secondDiscardCard, thirdDiscardCard, multiDiscardShiftCharacter],
        deck: 1,
        inkwell: 0,
      },
      {
        deck: 1,
      },
    );

    const player = testEngine.asPlayerOne();
    const shiftCardId = testEngine.findCardInstanceId(
      multiDiscardShiftCharacter,
      "hand",
      "player_one",
    );
    const shiftTargetId = testEngine.findCardInstanceId(shiftBaseCharacter, "play", "player_one");
    const firstDiscardId = testEngine.findCardInstanceId(firstDiscardCard, "hand", "player_one");
    const secondDiscardId = testEngine.findCardInstanceId(secondDiscardCard, "hand", "player_one");
    const thirdDiscardId = testEngine.findCardInstanceId(thirdDiscardCard, "hand", "player_one");
    const shiftingCardId = shiftCardId;

    expect(player.getMoveOptions("shiftCard", shiftCardId)).toContainEqual({
      kind: "card",
      cardId: shiftTargetId,
      selectableCosts: [
        {
          kind: "discardCards",
          count: 2,
          candidateCardIds: [firstDiscardId, secondDiscardId, thirdDiscardId, shiftingCardId],
          zone: "hand",
        },
      ],
    });
  });

  it("does not surface discard-cost Shift when there are not enough valid discard candidates", () => {
    const nonSongDiscard = createMockAction({
      id: "am-shift-non-song-discard",
      name: "Not A Song",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [shiftBaseCharacter],
        hand: [nonSongDiscard, discardShiftCharacter],
        deck: 1,
        inkwell: 0,
      },
      {
        deck: 1,
      },
    );

    const shiftMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "shiftCard");

    expect(shiftMove).toBeUndefined();
  });

  it("reuses cached challenge availability for repeated calls in the same state", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const p1Internals = p1 as unknown as {
      _cachedChallengeAttackersStateID: number;
      getStateID(): number;
    };
    const firstMoves = p1.getAvailableMoves();
    const secondMoves = p1.getAvailableMoves();

    expect(secondMoves).toBe(firstMoves);
    expect(p1Internals._cachedChallengeAttackersStateID).toBe(p1Internals.getStateID());
    expect(
      secondMoves.find((move: (typeof secondMoves)[number]) => move.moveId === "challenge")
        ?.selectableCardIds,
    ).toEqual(
      firstMoves.find((move: (typeof firstMoves)[number]) => move.moveId === "challenge")
        ?.selectableCardIds,
    );
  });

  it("reuses cached legal move ids when enumerateMoves is called after getAvailableMoves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const underlyingEngine = p1.engine as unknown as {
      enumerateMoves(): string[];
    };
    const originalEnumerateMoves = underlyingEngine.enumerateMoves.bind(underlyingEngine);
    let enumerateMoveCalls = 0;
    underlyingEngine.enumerateMoves = () => {
      enumerateMoveCalls += 1;
      return originalEnumerateMoves();
    };

    try {
      p1.getAvailableMoves();
      const legalMoves = p1.enumerateMoves();

      expect(enumerateMoveCalls).toBe(1);
      expect(legalMoves).toContain("challenge");
    } finally {
      underlyingEngine.enumerateMoves = originalEnumerateMoves;
    }
  });

  it("reuses runtime enumeration results for repeated same-state calls", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const clientEngine = testEngine.asPlayerOne().engine as unknown as {
      runtime: {
        enumerateMovesForPlayer(playerId: string, actorRole: string): string[];
      };
      getPlayerId(): string;
    };
    const playerId = clientEngine.getPlayerId();
    const firstMoves = clientEngine.runtime.enumerateMovesForPlayer(playerId, "player");
    const secondMoves = clientEngine.runtime.enumerateMovesForPlayer(playerId, "player");

    expect(secondMoves).toBe(firstMoves);
    expect(secondMoves).toEqual(firstMoves);
  });

  it("returns putCardIntoInkwell for inkable hand cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [handCharacter],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const inkMove = moves.find((m) => m.moveId === "putCardIntoInkwell");

    expect(inkMove).toBeDefined();
    expect(inkMove!.selectableCardIds.length).toBe(1);
  });

  it("excludes non-Evasive attacker when only Evasive defenders exist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [nonEvasiveAttacker],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: evasiveDefender, exerted: true }],
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const challengeMove = moves.find((m) => m.moveId === "challenge");

    // Non-Evasive attacker should not be able to challenge an Evasive defender
    expect(challengeMove).toBeUndefined();
  });

  it("includes Evasive attacker when Evasive defenders exist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [evasiveAttacker],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: evasiveDefender, exerted: true }],
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const challengeMove = moves.find((m) => m.moveId === "challenge");

    // Evasive attacker should be able to challenge an Evasive defender
    expect(challengeMove).toBeDefined();
    expect(challengeMove!.selectableCardIds.length).toBe(1);
  });

  it("returns passTurn when available", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const passTurnMove = moves.find((m) => m.moveId === "passTurn");

    expect(passTurnMove).toBeDefined();
    expect(passTurnMove!.selectableCardIds).toEqual([]);
  });

  it("returns singCard when a song is only playable via Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [singTogetherSong],
        play: [singerFive, helperSinger],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const singMove = moves.find((move) => move.moveId === "singCard");

    expect(singMove).toBeDefined();
    expect(singMove?.selectableCardIds).toEqual([
      testEngine.findCardInstanceId(singTogetherSong, "hand", "player_one"),
    ]);
  });
});

describe("LorcanaEngineBase.getMoveOptions", () => {
  it("returns valid defenders for challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const challengeMove = p1.getAvailableMoves().find((m) => m.moveId === "challenge");
    expect(challengeMove).toBeDefined();

    const attackerId = challengeMove!.selectableCardIds[0];
    const options = p1.getMoveOptions("challenge", attackerId);

    expect(options.length).toBe(1);
    expect(options[0].kind).toBe("card");
  });

  it("reuses cached challenge move options for the same attacker in the same state", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const attackerId = p1.getAvailableMoves().find((m) => m.moveId === "challenge")!
      .selectableCardIds[0];
    const firstOptions = p1.getMoveOptions("challenge", attackerId);
    const secondOptions = p1.getMoveOptions("challenge", attackerId);

    expect(secondOptions).toBe(firstOptions);
    expect(secondOptions).toEqual(firstOptions);
  });

  it("filters out Evasive defenders for non-Evasive attackers", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [nonEvasiveAttacker],
        deck: 1,
        inkwell: 3,
      },
      {
        play: [
          { card: opponentCharacter, exerted: true },
          { card: evasiveDefender, exerted: true },
        ],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const challengeMove = p1.getAvailableMoves().find((m) => m.moveId === "challenge");
    expect(challengeMove).toBeDefined();

    const attackerId = challengeMove!.selectableCardIds[0];
    const options = p1.getMoveOptions("challenge", attackerId);

    // Should only see the non-Evasive opponent, not the Evasive one
    expect(options.length).toBe(1);
  });

  it("returns valid board-card targets for single-target playCard actions", () => {
    const extraOpponent = createMockCharacter({
      id: "am-opponent-extra",
      name: "Opponent Extra",
      cost: 2,
      strength: 1,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [targetedAction],
        inkwell: targetedAction.cost,
        deck: 1,
      },
      {
        play: [opponentCharacter, extraOpponent],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const options = p1.getMoveOptions("playCard", playMove!.selectableCardIds[0]);

    expect(options).toHaveLength(2);
    expect(options.every((option) => option.kind === "card")).toBe(true);
  });

  it("excludes illegal Ward targets from single-target playCard shortcuts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [targetedAction],
        inkwell: targetedAction.cost,
        deck: 1,
      },
      {
        play: [opponentCharacter, wardedOpponent],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const options = p1.getMoveOptions("playCard", playMove!.selectableCardIds[0]);

    expect(options).toHaveLength(1);
    expect(options[0]?.kind).toBe("card");
  });

  it("excludes opponents whose Ward was granted by a static ability (e.g. Goofy - Emerald Champion)", () => {
    const wardGranter = createMockCharacter({
      id: "am-ward-granter",
      name: "Ward Granter",
      cost: 5,
      strength: 3,
      willpower: 5,
      lore: 2,
      abilities: [
        {
          id: "am-ward-granter-provide-cover",
          type: "static",
          text: "Your other characters gain Ward.",
          name: "PROVIDE COVER",
          effect: {
            type: "gain-keyword",
            keyword: "Ward",
            target: {
              selector: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              count: "all",
              excludeSelf: true,
            },
          },
        },
      ],
    });
    const unwardedAlly = createMockCharacter({
      id: "am-unwarded-ally",
      name: "Unwarded Ally",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [targetedAction],
        inkwell: targetedAction.cost,
        deck: 1,
      },
      {
        play: [wardGranter, unwardedAlly],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const options = p1.getMoveOptions("playCard", playMove!.selectableCardIds[0]);
    expect(options).toHaveLength(1);
    expect(options[0]?.kind).toBe("card");
  });

  it("falls back to no playCard shortcut targets when none are legal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [targetedAction],
        inkwell: targetedAction.cost,
        deck: 1,
      },
      {
        play: [wardedOpponent],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const cardId = playMove!.selectableCardIds[0];
    expect(p1.getMoveOptions("playCard", cardId)).toEqual([]);
    expect(p1.hasTargetedPlayCardPreview(cardId)).toBe(true);
  });

  it("does not expose playCard shortcut targets for player-target actions", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [playerTargetAction],
        inkwell: playerTargetAction.cost,
        deck: 1,
      },
      {
        play: [opponentCharacter],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    expect(p1.getMoveOptions("playCard", playMove!.selectableCardIds[0])).toEqual([]);
  });

  it("does not expose playCard shortcut targets when the opponent picks the targets", () => {
    // Regression: bug-04 (Be King Undisputed) — the action's effect carries
    // `chosenBy: "opponent"`, so the controller must not be prompted to pre-pick
    // a target. Playing the card moves it to limbo first; the opponent then
    // picks from their own characters via the resolution prompt.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [opponentChoosesBanishAction],
        inkwell: opponentChoosesBanishAction.cost,
        deck: 1,
      },
      {
        play: [opponentCharacter, wardedOpponent],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const cardId = playMove!.selectableCardIds[0];
    expect(p1.getMoveOptions("playCard", cardId)).toEqual([]);
    expect(p1.hasTargetedPlayCardPreview(cardId)).toBe(false);
  });

  it("exposes the first legal playCard shortcut target for multi-target actions", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [multiTargetAction],
        inkwell: multiTargetAction.cost,
        deck: 1,
      },
      {
        play: [opponentCharacter, wardedOpponent],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const playMove = p1.getAvailableMoves().find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    expect(p1.getMoveOptions("playCard", playMove!.selectableCardIds[0])).toEqual([
      {
        kind: "card",
        cardId: testEngine.asPlayerTwo().getCard(opponentCharacter).id,
      },
    ]);
  });

  it("returns empty array for quest (no second selection)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [questableCharacter],
        deck: 1,
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const questMove = p1.getAvailableMoves().find((m) => m.moveId === "quest");
    expect(questMove).toBeDefined();

    const cardId = questMove!.selectableCardIds[0];
    const options = p1.getMoveOptions("quest", cardId);

    expect(options).toEqual([]);
  });

  it("returns a Sing Together option with only eligible singers", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [singTogetherSong],
        play: [
          singerFive,
          helperSinger,
          { card: questableCharacter, exerted: true },
          { card: freshCharacter, isDrying: true },
          voicelessSinger,
        ],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const songId = testEngine.findCardInstanceId(singTogetherSong, "hand", "player_one");
    const singerFiveId = testEngine.findCardInstanceId(singerFive, "play", "player_one");
    const helperSingerId = testEngine.findCardInstanceId(helperSinger, "play", "player_one");

    const options = p1.getMoveOptions("singCard", songId);

    expect(options).toEqual([
      {
        kind: "singTogether",
        requiredTotal: 8,
        singers: [
          { cardId: singerFiveId, value: 5 },
          { cardId: helperSingerId, value: 3 },
        ],
      },
    ]);
  });

  it("keeps singCard options limited to single singers for songs without Sing Together", () => {
    const simpleSong = createMockSong({
      id: "am-simple-song",
      name: "Simple Song",
      cost: 5,
      text: "Draw a card.",
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simpleSong],
        play: [singerFive, helperSinger],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    const songId = testEngine.findCardInstanceId(simpleSong, "hand", "player_one");
    const singerFiveId = testEngine.findCardInstanceId(singerFive, "play", "player_one");

    expect(p1.getMoveOptions("singCard", songId)).toEqual([{ kind: "card", cardId: singerFiveId }]);
  });
});
