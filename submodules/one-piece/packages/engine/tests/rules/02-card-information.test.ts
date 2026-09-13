import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Rebecca048,
  getAllCards,
  getCard,
  op01Kaido094,
  op01ParadiseWaterfall057,
  op01RoronoaZoro001,
  op02BoaHancock059,
  op02Buggy058,
  op02Saldeath074,
  op02Sanji026,
  op02Seaquake021,
  op03Buggy008,
  op03Sogeking122,
  op03Usopp041,
  op03UsoppSPirateCrew042,
  op04CorridaColiseum096,
  op05MaryGeoise097,
  op06Nekomamushi110,
  op06Uta001,
  op09BartholomewKuma108,
  op09Dereshi117,
  op09Pierre110,
  op10Bartolomeo052,
  op10Mansherry056,
  op10Usopp042,
  op11GearTwo080,
  op11Zephyr006,
  op13BoaHancock051,
  op13CurlyDadan009,
  op13SaintJalmac085,
  op13StEthanbaronVNusjuro080,
  op13TheEmptyThrone099,
  op13WindmillVillage022,
  op14eb04GorgonSisters105,
  validateDeckForFormat,
} from "@tcg/op-cards";

import { createMatch, OnePieceTestEngine, type MatchConfig } from "../../src/index.ts";

// Deck-construction validation (5-1-2 family, "standard" format) is owned by
// the game workspace: validateDeckForFormat from @tcg/op-cards.

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const NORTH_ATTACKS = { firstPlayer: "south", activeSeat: "north" } as const;

function validateDeck(deck: ReadonlyArray<{ cardId: string; quantity: number }>) {
  return validateDeckForFormat("standard", deck);
}

function copyLimitPassed(deck: ReadonlyArray<{ cardId: string; quantity: number }>): boolean {
  const result = validateDeck(deck);
  const rule = result.rules.find((candidate) => candidate.kind === "copy-limit");
  if (!rule) {
    throw new Error("Expected a copy-limit rule in the validation result.");
  }
  return rule.passed;
}

const SETUP_DECK = [
  "OP13-013",
  "OP13-021",
  "OP13-022",
  "OP13-030",
  "OP13-037",
  "OP13-043",
  "OP13-013",
  "OP13-021",
  "OP13-022",
  "OP13-030",
  "OP13-037",
];

function setupConfig(leaderSouth: string, leaderNorth: string): MatchConfig {
  return {
    firstPlayer: "south",
    shuffleDecks: false,
    openingHandSize: 0,
    players: {
      south: { leaderCardId: leaderSouth, mainDeck: [...SETUP_DECK] },
      north: { leaderCardId: leaderNorth, mainDeck: [...SETUP_DECK] },
    },
  };
}

describe("2-1 Card Name", () => {
  test("2-1-1: every card has a fixed, non-empty card name", () => {
    const cards = getAllCards();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      const printedName = card.i18n?.en?.name ?? card.name;
      expect(printedName, `card ${card.id} has no name`).toBeTruthy();
    }
  });

  test("2-1-2: a [Name] reference matches cards with exactly that card name", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [op03Usopp041, eb01Fourtricks025],
      activeDon: op03UsoppSPirateCrew042.cost,
    });

    // I prefer a syntax like this:
    // const usopp = engine.getCard(op03Usopp041);
    const usoppId = engine.asSouth().findInZone("trash", op03Usopp041);
    const notUsoppId = engine.asSouth().findInZone("trash", eb01Fourtricks025);

    engine.asSouth().play(op03UsoppSPirateCrew042);

    // I want to avoid tests that are too specific to the implementation. As if we change the implementation, the test will break.
    const target = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the [Usopp] trash choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(usoppId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(notUsoppId);
    engine.asSouth().choose("effectTargetSelection", [usoppId]);

    // I prefer a syntax like this:
    // expect([op03Usopp041, eb01Fourtricks025]).toBeInHand("south");
    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toContain(usoppId);
  });

  test("2-1-3: a card that gets a card name from its text is treated as having that name", () => {
    // OP03-122 is printed as "Sogeking" but its text treats its name as [Usopp].
    expect(op03Sogeking122.name).toBe("Sogeking");
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [op03Sogeking122],
      activeDon: op03UsoppSPirateCrew042.cost,
    });
    const sogekingId = engine.asSouth().findInZone("trash", op03Sogeking122);

    engine.asSouth().play(op03UsoppSPirateCrew042);

    const target = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the [Usopp] trash choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(sogekingId);
    engine.asSouth().choose("effectTargetSelection", [sogekingId]);

    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toContain(sogekingId);
  });
});

describe("2-2 Card Category", () => {
  test("2-2-1 and 2-2-2: every card has a category, and the catalog uses exactly the five card categories", () => {
    const categories = new Set(getAllCards().map((card) => card.cardType));
    expect([...categories].sort()).toEqual(["character", "don", "event", "leader", "stage"]);
  });

  test("2-2-3: a Leader card is placed in the Leader area", () => {
    const engine = OnePieceTestEngine.create();

    const view = engine.asSouth().view();
    expect(view.players.south.leader.cardId).toBe("OP13-001");
    expect(view.players.south.hand.map((card) => card.cardId)).not.toContain("OP13-001");
  });

  test("2-2-3-1 and 2-6-3: a 'Leader' reference affects the Leader card in the Leader area", () => {
    // The Empty Throne: "[Your Turn] If you have 19 or more cards in your trash,
    // your Leader gains +1000 power."
    const engine = OnePieceTestEngine.create({
      stage: op13TheEmptyThrone099,
      trash: Array.from({ length: 19 }, () => eb01MountainGod018),
    });

    expect(engine.asSouth().view().players.south.leader.power).toBe(5000 + 1000);

    engine.asSouth().endTurn();

    expect(engine.asSouth().view().players.south.leader.power).toBe(5000);
  });

  test("2-2-4, 2-7-1 and 2-7-2: playing a Character rests DON!! equal to its printed cost and places it in the Character area", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: eb01MountainGod018.cost,
    });
    const playedId = engine.asSouth().findInZone("hand", eb01MountainGod018);

    engine.asSouth().play(eb01MountainGod018);

    const view = engine.asSouth().view();
    expect(view.players.south.characters.some((card) => card?.instanceId === playedId)).toBe(true);
    expect(view.players.south.restedDon).toBe(eb01MountainGod018.cost);
    expect(view.players.south.activeDon).toBe(0);
  });

  test("2-2-4-1: a 'Character' reference only matches Character cards in the Character area", () => {
    // Windmill Village: "Up to 1 of your Characters with 2000 base power or less
    // gains +1000 power during this turn."
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13CurlyDadan009],
      hand: [op13CurlyDadan009],
    });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);
    const fieldId = engine.asSouth().findOnField(op13CurlyDadan009);
    const handId = engine.asSouth().findInZone("hand", op13CurlyDadan009);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();

    const target = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Windmill Village's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(fieldId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(handId);
    engine.asSouth().choose("effectTargetSelection", [fieldId]);

    const view = engine.asSouth().view();
    expect(view.players.south.characters.find((card) => card?.instanceId === fieldId)?.power).toBe(
      2000 + 1000,
    );
    expect(view.players.south.stage?.rested).toBe(true);
  });

  test("2-2-4-2: a 'Character card' reference matches the category outside the Character area", () => {
    // The Empty Throne: "Play up to 1 black 'Five Elders' type Character card
    // ... from your hand."
    const engine = OnePieceTestEngine.create({
      stage: op13TheEmptyThrone099,
      hand: [op13StEthanbaronVNusjuro080],
      character: [op13StEthanbaronVNusjuro080],
      activeDon: 6,
    });
    const stageId = engine.asSouth().findInZone("stage", op13TheEmptyThrone099);
    const handId = engine.asSouth().findInZone("hand", op13StEthanbaronVNusjuro080);
    const fieldId = engine.asSouth().findOnField(op13StEthanbaronVNusjuro080);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();

    const play = engine.asSouth().pendingDecision("effectPlaySelection").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected The Empty Throne's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([handId]);
    engine.asSouth().choosePlay(handId);

    const view = engine.asSouth().view();
    expect(view.players.south.characters.some((card) => card?.instanceId === handId)).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === fieldId)).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(handId);
  });

  test("2-2-5 and 2-7-3: activating an Event card rests DON!! equal to its cost and trashes the card to resolve its effect", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op11GearTwo080],
      activeDon: 3,
      donDeckCount: 1,
    });
    const eventId = engine.asSouth().findInZone("hand", op11GearTwo080);

    engine.asSouth().play(op11GearTwo080);
    // The printed cost is paid by resting DON!! before the effect resolves.
    expect(engine.asSouth().view().players.south.restedDon).toBe(op11GearTwo080.cost);
    engine.asSouth().acceptOptional();
    engine.asSouth().chooseAddDon(1);

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.donDeckCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("2-2-5-1: an 'Event' reference matches Event-category cards", () => {
    // OP03-008 Buggy: "[On Play] Look at 5 cards from the top of your deck;
    // reveal up to 1 red Event and add it to your hand."
    const engine = OnePieceTestEngine.create({
      hand: [op03Buggy008],
      deck: [
        op02Seaquake021,
        op01ParadiseWaterfall057,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op03Buggy008.cost,
    });
    const redEventId = engine.asSouth().findInZone("deck", op02Seaquake021);
    const greenEventId = engine.asSouth().findInZone("deck", op01ParadiseWaterfall057);
    const redCharacterId = engine.asSouth().findInZone("deck", eb01Doma005);

    engine.asSouth().play(op03Buggy008);

    const search = engine.asSouth().pendingDecision("effectSearchSelection").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Buggy's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === redEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === greenEventId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === redCharacterId)?.legal).toBe(
      false,
    );
    engine.asSouth().chooseSearch(redEventId);
    const remainder = engine.asSouth().pendingDecision("effectSearchRemainderOrder").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's deck-bottom order.");
    engine
      .asSouth()
      .orderCards(
        "effectSearchRemainderOrder",
        remainder.candidates.map((candidate) => candidate.ref.id).reverse(),
      );

    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toContain(redEventId);
  });

  test("2-2-6 and 2-7-4: playing a Stage card rests DON!! equal to its cost and places it in the Stage area", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13WindmillVillage022],
      activeDon: op13WindmillVillage022.cost,
    });
    const playedId = engine.asSouth().findInZone("hand", op13WindmillVillage022);

    engine.asSouth().play(op13WindmillVillage022);

    const view = engine.asSouth().view();
    expect(view.players.south.stage?.instanceId).toBe(playedId);
    expect(view.players.south.restedDon).toBe(op13WindmillVillage022.cost);
  });

  test("2-2-6-1: a 'Stage' reference matches the Stage card in the Stage area", () => {
    // OP10-056 Mansherry: "You may rest 1 of your 'Dressrosa' type Leader or
    // Stage cards: ..."
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        hand: [op10Mansherry056],
        character: [op10Bartolomeo052],
        stage: op04CorridaColiseum096,
        activeDon: op10Mansherry056.cost,
      },
      { character: [eb01Doma005] },
    );
    const stageId = engine.asSouth().findInZone("stage", op04CorridaColiseum096);
    const returnedId = engine.asSouth().findOnField(op10Bartolomeo052);
    const opposingId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().play(op10Mansherry056);
    engine.asSouth().acceptOptional();

    const rest = engine.asSouth().pendingDecision("effectCostRestCards").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Mansherry's rest cost.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(stageId);
    engine.asSouth().restCards(stageId);
    engine.asSouth().choose("effectTargetSelection", [opposingId]);

    const view = engine.asSouth().view();
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(returnedId);
  });

  test("2-2-6-2: a 'Stage card' reference matches Stage-category cards outside the Stage area", () => {
    // EB03-048 Rebecca: "[On Play] Look at 5 cards from the top of your deck;
    // reveal up to 1 {Dressrosa} type Stage card and add it to your hand."
    const engine = OnePieceTestEngine.create({
      hand: [eb03Rebecca048],
      deck: [
        op04CorridaColiseum096,
        op05MaryGeoise097,
        eb03Rebecca048,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: eb03Rebecca048.cost,
    });
    const dressrosaStageId = engine.asSouth().findInZone("deck", op04CorridaColiseum096);
    const otherStageId = engine.asSouth().findInZone("deck", op05MaryGeoise097);
    const dressrosaCharacterId = engine.asSouth().findInZone("deck", eb03Rebecca048);

    engine.asSouth().play(eb03Rebecca048);

    const search = engine.asSouth().pendingDecision("effectSearchSelection").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Rebecca's Stage search.");
    expect(
      search.candidates.find((candidate) => candidate.ref.id === dressrosaStageId)?.legal,
    ).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === otherStageId)?.legal).toBe(
      false,
    );
    expect(
      search.candidates.find((candidate) => candidate.ref.id === dressrosaCharacterId)?.legal,
    ).toBe(false);
    engine.asSouth().chooseSearch(dressrosaStageId);
    const remainder = engine.asSouth().pendingDecision("effectSearchRemainderOrder").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Rebecca's deck-bottom order.");
    engine
      .asSouth()
      .orderCards(
        "effectSearchRemainderOrder",
        remainder.candidates.map((candidate) => candidate.ref.id).reverse(),
      );
    // "Then, ... play up to 1 {Dressrosa} type Stage card with a cost of 1 from
    // your hand" is declined here; the search result itself is the proof.
    engine.asSouth().chooseNoPlay();

    const view = engine.asSouth().view();
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(dressrosaStageId);
    expect(view.prompts).toHaveLength(0);
  });
});

describe("2-3 Color", () => {
  test("2-3-1, 2-3-2 and 2-3-3: every card has colors, drawn from the six printed colors", () => {
    const SIX_COLORS = ["red", "green", "blue", "purple", "black", "yellow"] as const;
    const cards = getAllCards();
    const used = new Set<string>();
    for (const card of cards) {
      // DON!! cards carry no color hexagon in this catalog (color: []).
      if (card.cardType === "don") continue;
      expect(card.color.length, `card ${card.id} has no color`).toBeGreaterThan(0);
      for (const color of card.color) {
        expect(SIX_COLORS, `card ${card.id} has color ${color}`).toContain(color);
        used.add(color);
      }
    }
    expect([...used].sort()).toEqual([...SIX_COLORS].sort());
  });

  test("2-3-4: some cards have multiple colors", () => {
    expect(op02Sanji026.color).toEqual(["blue", "green"]);
    expect(getAllCards().filter((card) => card.color.length > 1).length).toBeGreaterThan(0);
  });

  test("2-3-5: a multicolor card is treated as a card of every color it possesses", () => {
    // Gear Two: "If your Leader's colors include blue, add up to 1 DON!! card
    // from your DON!! deck and rest it." Sanji is a blue/green Leader.
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op11GearTwo080],
      activeDon: 3,
      donDeckCount: 1,
    });

    engine.asSouth().play(op11GearTwo080);
    engine.asSouth().acceptOptional();
    engine.asSouth().chooseAddDon(1);

    expect(engine.asSouth().view().players.south.donDeckCount).toBe(0);
    expect(engine.asSouth().view().prompts).toHaveLength(0);
  });

  test("2-3-5: a multicolor card is not treated as a color it does not possess", () => {
    // The default OP13-001 Leader is green/red, so Gear Two's blue condition fails.
    expect(getCard("OP13-001").color).toEqual(["green", "red"]);
    const engine = OnePieceTestEngine.create({
      hand: [op11GearTwo080],
      activeDon: 3,
      donDeckCount: 1,
    });

    engine.asSouth().play(op11GearTwo080);
    engine.asSouth().acceptOptional();

    const view = engine.asSouth().view();
    expect(view.players.south.donDeckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("2-3-6: 'multicolored' is referenceable in card text (positive)", () => {
    // OP13-051 Boa Hancock: "[On K.O.] If your Leader is [Boa Hancock] or
    // multicolored, draw 2 cards." OP06-001 Uta is a purple/red Leader.
    expect(op06Uta001.color.length).toBeGreaterThan(1);
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06Uta001,
        character: [{ card: op13BoaHancock051, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      NORTH_ATTACKS,
    );
    const hancockId = engine.asSouth().findOnField(op13BoaHancock051);
    const attackerId = engine.asNorth().findOnField(op01Kaido094);

    engine.asNorth().attack(attackerId, hancockId);

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hancockId);
    expect(view.players.south.hand).toHaveLength(2);
  });

  test("2-3-6: 'multicolored' is referenceable in card text (negative)", () => {
    // OP01-001 Roronoa Zoro is a monocolored red Leader, so Boa Hancock's
    // On K.O. condition fails.
    expect(op01RoronoaZoro001.color).toEqual(["red"]);
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op13BoaHancock051, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      NORTH_ATTACKS,
    );
    const hancockId = engine.asSouth().findOnField(op13BoaHancock051);
    const attackerId = engine.asNorth().findOnField(op01Kaido094);

    engine.asNorth().attack(attackerId, hancockId);

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hancockId);
    expect(view.players.south.hand).toHaveLength(0);
  });
});

describe("2-4 Type", () => {
  test("2-4-1 and 2-4-2: cards have types, and some cards have multiple types", () => {
    // Multiple printed types are stored as one compound, slash-separated trait
    // string, e.g. "Kuja Pirates The Seven Warlords of the Sea Impel Down".
    expect(op02BoaHancock059.traits?.some((trait) => trait.includes(" "))).toBe(true);
    expect(
      getAllCards().filter((card) => (card.traits ?? []).some((trait) => trait.includes(" ")))
        .length,
    ).toBeGreaterThan(0);
  });

  test("2-4-3 and 2-4-3-1: a {Type} reference matches cards whose types include it, even inside a compound type", () => {
    // OP02-058 Buggy: "reveal up to 1 blue {Impel Down} type card other than
    // [Buggy]". OP02-059 Boa Hancock's types end in "... Impel Down".
    const engine = OnePieceTestEngine.create({
      hand: [op02Buggy058],
      deck: [
        op02BoaHancock059,
        op02Saldeath074,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op02Buggy058.cost,
    });
    const compoundTraitId = engine.asSouth().findInZone("deck", op02BoaHancock059);
    const wrongColorId = engine.asSouth().findInZone("deck", op02Saldeath074);
    const wrongTraitId = engine.asSouth().findInZone("deck", eb01Doma005);

    engine.asSouth().play(op02Buggy058);

    const search = engine.asSouth().pendingDecision("effectSearchSelection").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Buggy's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongColorId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.asSouth().chooseSearch(compoundTraitId);
    const remainder = engine.asSouth().pendingDecision("effectSearchRemainderOrder").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's deck-bottom order.");
    engine
      .asSouth()
      .orderCards(
        "effectSearchRemainderOrder",
        remainder.candidates.map((candidate) => candidate.ref.id).reverse(),
      );

    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toContain(compoundTraitId);
  });
});

describe("2-5 Attribute", () => {
  test("2-5-1 and 2-5-2: cards have attributes drawn from the six printed attributes", () => {
    // The "?" attribute is part of the printed attribute set even though no card
    // in the current catalog uses it.
    const PRINTED_ATTRIBUTES = ["slash", "strike", "ranged", "special", "wisdom", "?"];
    for (const card of getAllCards()) {
      const attribute = (card as { attribute?: string | string[] }).attribute;
      if (attribute === undefined) continue;
      for (const value of Array.isArray(attribute) ? attribute : [attribute]) {
        expect(PRINTED_ATTRIBUTES, `card ${card.id} has attribute ${value}`).toContain(value);
      }
    }
  });

  test("2-5-3 and 2-5-4: some cards have multiple attributes and are treated as having each of them (Slash half)", () => {
    // OP14-105 Gorgon Sisters has the Slash and Special attributes. OP03-008
    // Buggy "cannot be K.O.'d in battle by 'Slash' attribute cards."
    expect(op14eb04GorgonSisters105.attribute).toEqual(["slash", "special"]);
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04GorgonSisters105, playedOnTurn: 0 }] },
      { character: [{ card: op03Buggy008, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op14eb04GorgonSisters105);
    const buggyId = engine.asNorth().findOnField(op03Buggy008);

    engine.asSouth().attack(attackerId, buggyId);

    const view = engine.asSouth().view();
    expect(view.players.north.characters.some((card) => card?.instanceId === buggyId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(buggyId);
  });

  test("2-5-4, 2-5-6 and 2-6-3: a <Special> attribute reference matches a multi-attribute card and modifies its power", () => {
    // OP11-006 Zephyr: "[DON!! x1] [When Attacking] Give up to 1 of your
    // opponent's (Special) attribute Characters -5000 power during this turn."
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11Zephyr006, playedOnTurn: 0, attachedDon: 1 }] },
      { character: [op14eb04GorgonSisters105, eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op11Zephyr006);
    const gorgonId = engine.asNorth().findOnField(op14eb04GorgonSisters105);
    const slashOnlyId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const target = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zephyr's (Special) target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(gorgonId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(slashOnlyId);
    engine.asSouth().choose("effectTargetSelection", [gorgonId]);

    const view = engine.asSouth().view();
    expect(view.players.north.characters.find((card) => card?.instanceId === gorgonId)?.power).toBe(
      5000 - 5000,
    );
  });

  test("2-5-5: only Leader cards and Character cards have attributes", () => {
    for (const card of getAllCards()) {
      const attribute = (card as { attribute?: unknown }).attribute;
      if (card.cardType === "leader" || card.cardType === "character") {
        expect(attribute, `card ${card.id} has no attribute`).toBeDefined();
      } else {
        expect(attribute, `card ${card.id} has an attribute`).toBeUndefined();
      }
    }
  });
});

describe("2-6 Power", () => {
  test("2-6-1 and 2-6-2: power is the battle strength, and only Leaders and Characters have it", () => {
    for (const card of getAllCards()) {
      const power = (card as { power?: unknown }).power;
      if (card.cardType === "leader") {
        expect(typeof power, `leader ${card.id} has no power`).toBe("number");
      } else if (card.cardType === "character") {
        expect(typeof power, `character ${card.id} has no power`).toBe("number");
      } else {
        expect(power, `${card.cardType} ${card.id} has power`).toBeUndefined();
      }
    }
  });

  test("2-6-2: every printed Character card has a power value", () => {
    const missing = getAllCards().filter(
      (card) =>
        card.cardType === "character" && typeof (card as { power?: unknown }).power !== "number",
    );
    expect(missing.map((card) => card.id)).toEqual([]);
  });
});

describe("2-7 Cost", () => {
  test("2-7-5: only Character cards, Event cards and Stage cards have costs", () => {
    for (const card of getAllCards()) {
      const cost = (card as { cost?: unknown }).cost;
      if (card.cardType === "character" || card.cardType === "event" || card.cardType === "stage") {
        expect(typeof cost, `${card.cardType} ${card.id} has no cost`).toBe("number");
      } else {
        expect(cost, `${card.cardType} ${card.id} has a cost`).toBeUndefined();
      }
    }
  });

  test("2-7-6: an effect may make a cost less than the written value", () => {
    // OP05-097 Mary Geoise discounts eligible Celestial Dragons in hand.
    // OP13-085 Saint Jalmac has a printed cost of 2.
    expect(op13SaintJalmac085.cost).toBe(2);

    const withoutStage = OnePieceTestEngine.create({
      hand: [op13SaintJalmac085],
      activeDon: 1,
    });
    expect(
      withoutStage.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: withoutStage.findCardInZone("south", "hand", op13SaintJalmac085),
      }).accepted,
    ).toBe(false);

    const engine = OnePieceTestEngine.create({
      stage: op05MaryGeoise097,
      hand: [op13SaintJalmac085],
      activeDon: 1,
    });
    const handCard = engine.asSouth().view().players.south.hand[0];
    expect(handCard?.cost).toBe(1);

    engine.asSouth().play(op13SaintJalmac085);

    expect(engine.asSouth().view().players.south.restedDon).toBe(1);
  });
});

describe("2-8 Card Text", () => {
  test("2-8-1 and 2-8-2: card text describes effects, and Character text is not valid outside the Character area", () => {
    // OP14-105 Gorgon Sisters has an [Activate: Main] effect that can only be
    // used while the card is in the Character area.
    const engine = OnePieceTestEngine.create({ hand: [op14eb04GorgonSisters105] });
    const handId = engine.asSouth().findInZone("hand", op14eb04GorgonSisters105);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: handId,
      trigger: "activateMain",
    });
    expect(failure.accepted).toBe(false);
  });

  test("2-8-3: card text is resolved in order starting from the text closest to the top", () => {
    // OP02-058 Buggy's text first reveals a card to the hand and only then
    // places the rest at the bottom of the deck: the search selection prompt
    // must precede the remainder-ordering prompt.
    const engine = OnePieceTestEngine.create({
      hand: [op02Buggy058],
      deck: [
        op02BoaHancock059,
        op02Saldeath074,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op02Buggy058.cost,
    });
    const eligibleId = engine.asSouth().findInZone("deck", op02BoaHancock059);

    engine.asSouth().play(op02Buggy058);

    expect(engine.asSouth().pendingDecision("effectSearchSelection")).toBeDefined();
    engine.asSouth().chooseSearch(eligibleId);

    expect(engine.asSouth().pendingDecision("effectSearchRemainderOrder")).toBeDefined();
    const remainder = engine.asSouth().pendingDecision("effectSearchRemainderOrder").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's deck-bottom order.");
    engine
      .asSouth()
      .orderCards(
        "effectSearchRemainderOrder",
        remainder.candidates.map((candidate) => candidate.ref.id).reverse(),
      );

    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toContain(eligibleId);
  });

  test("2-8-5: a card without card text is treated as having 'no base effect'", () => {
    // OP02-026 Sanji: "[Once Per Turn] When you play a Character with no base
    // effect from your hand, ... set up to 2 of your DON!! cards as active."
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op06Nekomamushi110, eb01Doma005],
      activeDon: 10,
      restedDon: 2,
    });

    // OP06-110 Nekomamushi has card text, so Sanji's effect does not trigger.
    engine.asSouth().play(op06Nekomamushi110);
    expect(engine.asSouth().view().prompts).toHaveLength(0);

    // EB01-005 Doma has no card text, so Sanji's effect triggers.
    engine.asSouth().play(eb01Doma005);
    const activeBefore = engine.asSouth().view().players.south.activeDon;
    engine.asSouth().chooseSetActiveDon(2);

    expect(engine.asSouth().view().players.south.activeDon).toBe(activeBefore + 2);
  });
});

describe("2-9 Life", () => {
  test("2-9-1 and 2-9-2: a Leader has a Life value, and at game start that many face-down Life cards are placed", () => {
    // OP01-001 has Life 5; OP01-003 has Life 4.
    expect(getCard("OP01-001")).toMatchObject({ cardType: "leader", life: 5 });
    expect(getCard("OP01-003")).toMatchObject({ cardType: "leader", life: 4 });

    // Life is placed when the game starts, after the opening-hand redraws.
    const engine = OnePieceTestEngine.fromState(createMatch(setupConfig("OP01-001", "OP01-003")));
    engine.startGame();
    const state = engine.getState();

    expect(state.players.south.life).toHaveLength(5);
    expect(state.players.north.life).toHaveLength(4);
    expect(state.players.south.deck).toHaveLength(SETUP_DECK.length - 5);
    expect(state.players.north.deck).toHaveLength(SETUP_DECK.length - 4);

    // The Life cards are placed face-down without looking at their contents.
    for (const seat of ["south", "north"] as const) {
      const view = seat === "south" ? engine.asSouth().view() : engine.asNorth().view();
      expect(view.players[seat].life.length).toBeGreaterThan(0);
      expect(view.players[seat].life.every((card) => card.hidden)).toBe(true);
      expect(view.players[seat].life.every((card) => card.name === null)).toBe(true);
    }
  });

  test("2-9-2-1: the deck-top card is placed at the bottom of the Life area", () => {
    const engine = OnePieceTestEngine.fromState(createMatch(setupConfig("OP01-001", "OP01-003")));
    engine.startGame();
    const state = engine.getState();

    // With no opening hand drawn (openingHandSize: 0), SETUP_DECK[0] is the
    // top of the deck when Life is placed; it sits at the bottom of the Life
    // area while life[0] (taken first by damage) is SETUP_DECK[4].
    const bottomOfLife = state.players.south.life.at(-1)!;
    expect(state.cards[bottomOfLife]!.cardId).toBe(SETUP_DECK[0]);
    expect(state.cards[state.players.south.life[0]!]!.cardId).toBe(SETUP_DECK[4]);
  });

  test("2-9-3: only Leader cards have Life", () => {
    for (const card of getAllCards()) {
      const life = (card as { life?: unknown }).life;
      if (card.cardType === "leader") {
        expect(typeof life, `leader ${card.id} has no Life`).toBe("number");
      } else {
        expect(life, `${card.cardType} ${card.id} has Life`).toBeUndefined();
      }
    }
  });
});

describe("2-10 (Symbol) Counter", () => {
  test("2-10-1: a Character card's Counter increases the defending card's power during the Counter Step", () => {
    // EB01-025 Fourtricks (5000) attacks the OP13-001 Leader (5000). The
    // EB01-005 Doma Counter (+1000) raises the Leader to 6000, so the attack
    // fails and no Life is lost.
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01Fourtricks025);
    const counterId = engine.asNorth().findInZone("hand", eb01Doma005);
    const lifeBefore = engine.asNorth().view().players.north.lifeCount;

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    const counter = engine.asNorth().pendingDecision("battleCounter").steps[0];
    if (counter?.kind !== "selectEntity") throw new Error("Expected a Counter decision.");
    expect(counter.candidates.map((candidate) => candidate.ref.id)).toContain(counterId);
    engine.asNorth().choose("battleCounter", [counterId]);

    expect(engine.asNorth().view().players.north.lifeCount).toBe(lifeBefore);
    expect(
      engine
        .asNorth()
        .view()
        .players.north.trash.map((card) => card.instanceId),
    ).toContain(counterId);
  });

  test("2-10-1: without a Counter, the same battle at equal power damages the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01Fourtricks025);
    const lifeBefore = engine.asNorth().view().players.north.lifeCount;

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().chooseCounter();

    expect(engine.asNorth().view().players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("2-10-2: only Character cards have (Symbol) Counter", () => {
    const cards = getAllCards();
    expect(cards.some((card) => card.cardType === "character" && "counter" in card)).toBe(true);
    for (const card of cards) {
      const counter = (card as { counter?: unknown }).counter;
      if (card.cardType !== "character") {
        expect(counter, `${card.cardType} ${card.id} has Counter`).toBeUndefined();
      }
    }
  });
});

describe("2-11 [Trigger]", () => {
  test("2-11-1: an activated [Trigger] resolves instead of the card being added to the hand", () => {
    // OP09-117 Dereshi!: "[Trigger] Draw 1 card."
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09Dereshi117] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const triggerId = engine.asNorth().findInZone("life", op09Dereshi117);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();

    const view = engine.asNorth().view();
    // The card itself is not added to the hand; the Trigger draws a new card.
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
  });

  test("2-11-1: a declined [Trigger] adds the Life card to the hand instead", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09Dereshi117] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const triggerId = engine.asNorth().findInZone("life", op09Dereshi117);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().declineLifeTrigger();

    expect(
      engine
        .asNorth()
        .view()
        .players.north.hand.map((card) => card.instanceId),
    ).toContain(triggerId);
  });

  test("2-11-2: [Trigger] is part of the card text and can be referenced by effects", () => {
    // OP09-117 Dereshi!: "reveal up to 2 cards with a [Trigger] other than
    // [Dereshi!] and add them to your hand."
    const engine = OnePieceTestEngine.create({
      hand: [op09Dereshi117],
      deck: [op09Pierre110, op09BartholomewKuma108, eb01Doma005, eb01Fourtricks025, eb01Doma005],
      activeDon: op09Dereshi117.cost,
    });
    const firstTriggerId = engine.asSouth().findInZone("deck", op09Pierre110);
    const secondTriggerId = engine.asSouth().findInZone("deck", op09BartholomewKuma108);
    const noTriggerId = engine.asSouth().findInZone("deck", eb01Doma005);

    engine.asSouth().play(op09Dereshi117);

    const search = engine.asSouth().pendingDecision("effectSearchSelection").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the [Trigger] card search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === firstTriggerId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === secondTriggerId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === noTriggerId)?.legal).toBe(
      false,
    );
    engine.asSouth().chooseSearch(firstTriggerId, secondTriggerId);
    const remainder = engine.asSouth().pendingDecision("effectSearchRemainderOrder").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected the deck-bottom order.");
    engine
      .asSouth()
      .orderCards(
        "effectSearchRemainderOrder",
        remainder.candidates.map((candidate) => candidate.ref.id).reverse(),
      );

    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toEqual(expect.arrayContaining([firstTriggerId, secondTriggerId]));
  });
});

describe("2-14 Card Number", () => {
  test("2-14-2: a deck may contain up to 4 cards with the same card number", () => {
    expect(
      copyLimitPassed([
        { cardId: "OP01-001", quantity: 1 },
        { cardId: "OP01-004", quantity: 4 },
      ]),
    ).toBe(true);
    expect(
      copyLimitPassed([
        { cardId: "OP01-001", quantity: 1 },
        { cardId: "OP01-004", quantity: 5 },
      ]),
    ).toBe(false);
  });

  test("2-14-2: a card whose own text overrides the limit may exceed 4 copies (1-3-1)", () => {
    // OP01-075 Pacifista's printed deck-building rule allows unlimited copies.
    expect(
      copyLimitPassed([
        { cardId: "OP01-001", quantity: 1 },
        { cardId: "OP01-075", quantity: 5 },
      ]),
    ).toBe(true);
  });

  test("2-14-3: every card has a unique card number", () => {
    const cards = getAllCards();
    const ids = cards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of cards) {
      expect(card.canonicalId, `card ${card.id} has no canonical card number`).toBeTruthy();
    }
  });
});
