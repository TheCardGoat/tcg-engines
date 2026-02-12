// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import {
  Abilities,
  Conditions,
  Costs,
  Effects,
  Targets,
  Triggers,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 010 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Rapunzel - Ready for Adventure: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: ACT OF KINDNESS (triggered)
    const actOfKindness = {
      effect: {
        target: "TRIGGERING_CHARACTER",
        type: "prevention",
      },
      name: "ACT OF KINDNESS",
      trigger: {
        event: "be-chosen",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(actOfKindness),
    );
  });

  it.skip("Rajah - Devoted Protector: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Scrooge McDuck - On the Right Track: should parse card text", () => {
    const text =
      "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FABULOUS WEALTH (triggered)
    const fabulousWealth = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "FABULOUS WEALTH",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fabulousWealth),
    );
  });

  it.skip("Webby Vanderquack - Knowledge Seeker: should parse card text", () => {
    const text =
      "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'VE READ ABOUT THIS (static)
    const iveReadAboutThis = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "I'VE READ ABOUT THIS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveReadAboutThis),
    );
  });

  it.skip("Shanti - Village Girl: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    const singer5: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer5),
    );
  });

  it.skip("Taran - Pig Keeper: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: FOLLOW THE PIG (triggered)
    const followThePig = {
      effect: {
        target: "CARD_FROM_ANY_DISCARD",
        type: "return-to-hand",
      },
      name: "FOLLOW THE PIG",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(followThePig),
    );
  });

  it.skip("Scrooge McDuck - Cavern Prospector: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Scrooge McDuck.)\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: { ink: 4 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: SPECULATION (triggered)
    const speculation = {
      effect: {
        target: "TRIGGERING_CARD",
        type: "put-card-under",
      },
      name: "SPECULATION",
      trigger: {
        event: "play",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(speculation),
    );
  });

  it.skip("Simba - King in the Making: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nTIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    const boost3: KeywordAbilityDefinition = {
      keyword: "Boost",
      type: "keyword",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost3),
    );

    // Second ability: TIMELY ALLIANCE (triggered)
    const timelyAlliance = {
      effect: {
        amount: 1,
        type: "reveal-top",
      },
      name: "TIMELY ALLIANCE",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(timelyAlliance),
    );
  });

  it.skip("Search for Clues: should parse card text", () => {
    const text =
      "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const searchForClues = {
      effect: {
        effects: [
          { type: "discard", amount: 2, target: "PLAYER_WITH_MOST_CARDS" },
          { type: "gain-lore", amount: 1, target: "CONTROLLER" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(searchForClues),
    );
  });

  it.skip("Or Rewrite History!: should parse card text", () => {
    const text = "Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const orRewriteHistory = {
      effect: {
        target: "CHARACTER_CARD_FROM_DISCARD",
        type: "return-to-hand",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(orRewriteHistory),
    );
  });

  it.skip("The Horseman Strikes!: should parse card text", () => {
    const text = "Draw a card. You may banish chosen character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const theHorsemanStrikes = {
      effect: {
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "banish", target: "CHOSEN_CHARACTER_WITH_EVASIVE" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theHorsemanStrikes),
    );
  });

  it.skip("Recovered Page: should parse card text", () => {
    const text =
      "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.\nWHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WHAT IS TO COME (triggered)
    const whatIsToCome = {
      effect: {
        amount: 4,
        target: "DECK",
        type: "look-at-top",
      },
      name: "WHAT IS TO COME",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatIsToCome),
    );

    // Second ability: WHISPERED POWER (activated)
    const whisperedPower = {
      cost: {
        banishSelf: true,
        ink: 1,
      },
      effect: {
        target: "YOUR_CHARACTER_OR_LOCATION_WITH_BOOST",
        type: "put-card-under",
      },
      name: "WHISPERED POWER",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whisperedPower),
    );
  });

  it.skip("Webby's Diary: should parse card text", () => {
    const text =
      "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LATEST ENTRY (triggered)
    const latestEntry = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "LATEST ENTRY",
      trigger: {
        event: "put-card-under",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(latestEntry),
    );
  });

  it.skip("The Black Cauldron: should parse card text", () => {
    const text =
      "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.\nRISE AND JOIN ME! {E}, 1 {I} – This turn, you may play characters from under this item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: THE CAULDRON CALLS (activated)
    const theCauldronCalls = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        target: "SELF",
        type: "put-card-under",
      },
      name: "THE CAULDRON CALLS",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theCauldronCalls),
    );

    // Second ability: RISE AND JOIN ME! (activated)
    const riseAndJoinMe = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        target: "CARDS_UNDER_SELF",
        type: "play-card",
      },
      name: "RISE AND JOIN ME!",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(riseAndJoinMe),
    );
  });

  it.skip("The Horned King - Wicked Ruler: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named The Horned King.)\nARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift2: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: ARISE! (triggered)
    const arise = {
      effect: {
        effects: [
          { type: "return-to-hand", target: "TRIGGERING_CARD" },
          { type: "discard", target: "CONTROLLER" },
        ],
        type: "compound",
      },
      name: "ARISE!",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(arise));
  });

  it.skip("Violet Sabrewing - Senior Junior Woodchuck: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Nibs - Lost Boy: should parse card text", () => {
    const text =
      "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LOOK WHO'S BACK (triggered)
    const lookWhosBack = {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "LOOK WHO'S BACK",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookWhosBack),
    );
  });

  it.skip("The Horned King - Triumphant Ghoul: should parse card text", () => {
    const text =
      "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GRAND MACHINATIONS (static with condition)
    const grandMachinations = {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "GRAND MACHINATIONS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(grandMachinations),
    );
  });

  it.skip("Nana - Canine Caregiver: should parse card text", () => {
    const text =
      "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HELPFUL INSTINCTS (triggered)
    const helpfulInstincts = {
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "return-to-hand",
      },
      name: "HELPFUL INSTINCTS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(helpfulInstincts),
    );
  });

  it.skip("Olaf - Helping Hand: should parse card text", () => {
    const text =
      "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SECOND CHANCE (triggered)
    const secondChance = {
      effect: {
        target: "CHOSEN_YOUR_CHARACTER",
        type: "return-to-hand",
      },
      name: "SECOND CHANCE",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(secondChance),
    );
  });

  it.skip("Ursula - Whisper of Vanessa: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nSLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      keyword: "Boost",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: SLIPPERY SPELL (static)
    const slipperySpell = {
      effect: {
        effects: [
          { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" },
          { type: "gain-keyword", keyword: "Evasive", target: "SELF" },
        ],
        type: "compound",
      },
      name: "SLIPPERY SPELL",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(slipperySpell),
    );
  });

  it.skip("Swooping Strike: should parse card text", () => {
    const text =
      "Each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const swoopingStrike = {
      effect: {
        target: "OPPONENT_CHOSEN_CHARACTER",
        type: "exert",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(swoopingStrike),
    );
  });

  it.skip("Performance Review: should parse card text", () => {
    const text =
      "{E} chosen ready character of yours to draw cards equal to that character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const performanceReview = {
      effect: {
        amount: "VARIABLE",
        target: "CONTROLLER",
        type: "draw",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(performanceReview),
    );
  });

  it.skip("The Great Illuminary - Abandoned Laboratory: should parse card text", () => {
    const text =
      'STARTLING DISCOVERY Characters gain " {E} — Draw a card" while here.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLING DISCOVERY (static - grants ability)
    const startlingDiscovery = {
      effect: {
        target: "CHARACTERS_HERE",
        type: "grant-ability",
      },
      name: "STARTLING DISCOVERY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(startlingDiscovery),
    );
  });

  it.skip("Webby Vanderquack - Mystery Enthusiast: should parse card text", () => {
    const text =
      "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONTAGIOUS ENERGY (triggered)
    const contagiousEnergy = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "CONTAGIOUS ENERGY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(contagiousEnergy),
    );
  });

  it.skip("Vladimir - Ceramic Unicorn Fan: should parse card text", () => {
    const text =
      "HIGH STANDARDS Whenever this character quests, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIGH STANDARDS (triggered)
    const highStandards = {
      effect: {
        target: "CHOSEN_ITEM",
        type: "banish",
      },
      name: "HIGH STANDARDS",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(highStandards),
    );
  });

  it.skip("Shere Khan - Fearsome Tiger: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ON THE HUNT (triggered)
    const onTheHunt = {
      effect: {
        effects: [
          { type: "banish", target: "CHOSEN_OPPOSING_DAMAGED_CHARACTER" },
          { type: "put-damage", amount: 1, target: "ANOTHER_CHOSEN_CHARACTER" },
        ],
        type: "compound",
      },
      name: "ON THE HUNT",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(onTheHunt),
    );
  });

  it.skip("Scrooge McDuck - S.H.U.S.H. Agent: should parse card text", () => {
    const text =
      "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.\nON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BACKUP PLAN (triggered)
    const backupPlan = {
      effect: {
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "discard", amount: 1, target: "CONTROLLER" },
        ],
        type: "compound",
      },
      name: "BACKUP PLAN",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(backupPlan),
    );

    // Second ability: ON THE MOVE (triggered)
    const onTheMove = {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "ON THE MOVE",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(onTheMove),
    );
  });

  it.skip("Webby Vanderquack - Junior Prospector: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift2: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: WORK SMARTER (triggered)
    const workSmarter = {
      effect: {
        target: "TOP_OF_DECK",
        type: "put-into-inkwell",
      },
      name: "WORK SMARTER",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(workSmarter),
    );
  });

  it.skip("So Be It!: should parse card text", () => {
    const text =
      "Each of your characters gets +1 {S} this turn. You may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const soBeIt = {
      effect: {
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "YOUR_CHARACTERS",
          },
          { type: "banish", target: "CHOSEN_ITEM" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(soBeIt),
    );
  });

  it.skip("Trust In Me: should parse card text", () => {
    const text =
      "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (modal)
    const trustInMe = {
      effect: {
        options: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: "EACH_OPPOSING_CHARACTER",
          },
          { type: "discard", amount: 2, target: "EACH_OPPONENT" },
        ],
        type: "modal",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(trustInMe),
    );
  });

  it.skip("Potion of Malice: should parse card text", () => {
    const text =
      "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUPPRESSED ANGER (activated)
    const suppressedAnger = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "put-damage",
      },
      name: "SUPPRESSED ANGER",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(suppressedAnger),
    );

    // Second ability: MINDLESS RAGE (activated)
    const mindlessRage = {
      cost: {
        banishSelf: true,
        exert: true,
      },
      effect: {
        keyword: "Reckless",
        target: "EACH_OPPOSING_DAMAGED_CHARACTER",
        type: "gain-keyword",
      },
      name: "MINDLESS RAGE",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(mindlessRage),
    );
  });

  it.skip("White Agony Plains - Golden Lagoon: should parse card text", () => {
    const text =
      "PURE LIQUID GOLD This location gets +1 {L} for each character here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PURE LIQUID GOLD (static)
    const pureLiquidGold = {
      effect: {
        forEach: "CHARACTERS_HERE",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "for-each",
      },
      name: "PURE LIQUID GOLD",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pureLiquidGold),
    );
  });

  it.skip("Peter Pan - High Flyer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Raksha - Fearless Mother: should parse card text", () => {
    const text =
      "ON PATROL Once during your turn, you may pay 1 {I} less to move this character to a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON PATROL (static - cost reduction)
    const onPatrol = {
      effect: {
        amount: 1,
        target: "SELF",
        type: "cost-reduction",
      },
      name: "ON PATROL",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onPatrol),
    );
  });

  it.skip("Rama - Vigilant Father: should parse card text", () => {
    const text =
      "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECTION OF THE PACK (triggered)
    const protectionOfThePack = {
      effect: {
        target: "SELF",
        type: "ready",
      },
      name: "PROTECTION OF THE PACK",
      trigger: {
        event: "play",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protectionOfThePack),
    );
  });

  it.skip("Raksha - Fearless Mother: should parse card text", () => {
    const text =
      "ON PATROL Once during your turn, you may pay 1 {I} less to move this character to a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON PATROL (static - cost reduction)
    const onPatrol = {
      effect: {
        amount: 1,
        target: "SELF",
        type: "cost-reduction",
      },
      name: "ON PATROL",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onPatrol),
    );
  });

  it.skip("Rama - Vigilant Father: should parse card text", () => {
    const text =
      "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECTION OF THE PACK (triggered)
    const protectionOfThePack = {
      effect: {
        target: "SELF",
        type: "ready",
      },
      name: "PROTECTION OF THE PACK",
      trigger: {
        event: "play",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protectionOfThePack),
    );
  });

  it.skip("Tinker Bell - Temperamental Fairy: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: HARMLESS DIVERSION (triggered)
    const harmlessDiversion = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "exert",
      },
      name: "HARMLESS DIVERSION",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(harmlessDiversion),
    );
  });

  it.skip("The Headless Horseman - Terror of Sleepy Hollow: should parse card text", () => {
    const text =
      "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEAVES NO TRACE (triggered)
    const leavesNoTrace = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "banish",
      },
      name: "LEAVES NO TRACE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(leavesNoTrace),
    );

    // Second ability: GATHERING STRENGTH (triggered)
    const gatheringStrength = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      name: "GATHERING STRENGTH",
      trigger: {
        event: "banish",
        on: "OPPOSING_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gatheringStrength),
    );
  });

  it.skip("Shere Khan - Fierce and Furious: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Shere Khan.)\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: WILD RAGE (activated)
    const wildRage = {
      cost: {
        dealDamageToSelf: 1,
        ink: 1,
      },
      effect: {
        target: "SELF",
        type: "ready",
      },
      name: "WILD RAGE",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(wildRage),
    );
  });

  it.skip("Next Stop, Olympus: should parse card text", () => {
    const text =
      "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.\nReady chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: ready + restriction + delayed trigger)
    const nextStopOlympus = {
      effect: {
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
          },
          { type: "delayed-trigger", effect: { type: "gain-lore", amount: 1 } },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nextStopOlympus),
    );
  });

  it.skip("Time to Go!: should parse card text", () => {
    const text =
      "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (banish + draw with conditional bonus)
    const timeToGo = {
      effect: {
        effects: [
          { type: "banish", target: "CHOSEN_CHARACTER_OF_YOURS" },
          { type: "draw", amount: 2, target: "CONTROLLER" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(timeToGo),
    );
  });

  it.skip("The Bitterwood - Underground Forest: should parse card text", () => {
    const text =
      "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GATHER RESOURCES (triggered - once per turn)
    const gatherResources = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "GATHER RESOURCES",
      trigger: {
        event: "move",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gatherResources),
    );
  });

  it.skip("Sleepy Hollow - The Bridge: should parse card text", () => {
    const text =
      "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HEAD FOR THE BRIDGE! (triggered)
    const headForTheBridge = {
      effect: {
        effects: [
          { type: "banish", target: "SELF" },
          { type: "gain-lore", amount: 2 },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "TRIGGERING_CHARACTER",
          },
        ],
        type: "compound",
      },
      name: "HEAD FOR THE BRIDGE!",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(headForTheBridge),
    );
  });

  it.skip("Rapunzel - Creative Captor: should parse card text", () => {
    const text =
      "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENSNARL (triggered)
    const ensnarl = {
      effect: {
        modifier: -3,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      name: "ENSNARL",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ensnarl),
    );
  });

  it.skip("Scuttle - Birdbrained: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Scar - Eerily Prepared: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      keyword: "Boost",
      type: "keyword",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: SURVIVAL OF THE FITTEST (triggered)
    const survivalOfTheFittest = {
      effect: {
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      name: "SURVIVAL OF THE FITTEST",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(survivalOfTheFittest),
    );
  });

  it.skip("Pluto - Clever Cluefinder: should parse card text", () => {
    const text =
      "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON THE TRAIL (activated - conditional)
    const onTheTrail = {
      cost: {
        exert: true,
      },
      effect: {
        target: "ITEM_FROM_DISCARD",
        type: "return-to-hand",
      },
      name: "ON THE TRAIL",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onTheTrail),
    );
  });

  it.skip("Promising Lead: should parse card text", () => {
    const text =
      "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: modify stat + grant keyword)
    const promisingLead = {
      effect: {
        effects: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Support",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(promisingLead),
    );
  });

  it.skip("Sudden Scare: should parse card text", () => {
    const text =
      "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: put into inkwell + opponent inkwell)
    const suddenScare = {
      effect: {
        effects: [
          { type: "put-into-inkwell", target: "CHOSEN_OPPOSING_CHARACTER" },
          { type: "put-into-inkwell", target: "OPPONENT_TOP_OF_DECK" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(suddenScare),
    );
  });

  it.skip("Spooky Sight: should parse card text", () => {
    const text =
      "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (put into inkwell with filter)
    const spookySight = {
      effect: {
        target: "ALL_CHARACTERS",
        type: "put-into-inkwell",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(spookySight),
    );
  });

  it.skip("Robin Hood - Ephemeral Archer: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      keyword: "Boost",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: EXPERT SHOT (triggered - conditional)
    const expertShot = {
      effect: {
        amount: 1,
        target: "UP_TO_2_CHOSEN_CHARACTERS",
        type: "deal-damage",
      },
      name: "EXPERT SHOT",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(expertShot),
    );
  });

  it.skip("The Headless Horseman - Cursed Rider: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named The Headless Horseman.)\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: WITCHING HOUR (triggered - complex)
    const witchingHour = {
      effect: {
        effects: [
          { type: "draw", amount: 3, target: "EACH_PLAYER" },
          { type: "discard", amount: 3, target: "EACH_PLAYER" },
          {
            type: "deal-damage",
            amount: "VARIABLE",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
        ],
        type: "compound",
      },
      name: "WITCHING HOUR",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(witchingHour),
    );
  });

  it.skip("The Twins - Lost Boys: should parse card text", () => {
    const text =
      "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TWO FOR ONE (triggered - conditional)
    const twoForOne = {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      name: "TWO FOR ONE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(twoForOne),
    );
  });

  it.skip("Nick Wilde - Persistent Investigator: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Nick Wilde.)\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: CASE CLOSED (triggered)
    const caseClosed = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "CASE CLOSED",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_DETECTIVE_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(caseClosed),
    );
  });

  it.skip("Prince Charming - Protector of the Realm: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nPROTECTIVE PRESENCE Each turn, only one character can challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: PROTECTIVE PRESENCE (static - restriction)
    const protectivePresence = {
      effect: {
        restriction: "only-one-challenge-per-turn",
        target: "ALL_CHARACTERS",
        type: "restriction",
      },
      name: "PROTECTIVE PRESENCE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(protectivePresence),
    );
  });

  it.skip("Pluto - Steel Champion: should parse card text", () => {
    const text =
      "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WINNER TAKE ALL (triggered)
    const winnerTakeAll = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      name: "WINNER TAKE ALL",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_STEEL_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(winnerTakeAll),
    );

    // Second ability: MAKE ROOM (triggered)
    const makeRoom = {
      effect: {
        target: "CHOSEN_ITEM",
        type: "banish",
      },
      name: "MAKE ROOM",
      trigger: {
        event: "play",
        on: "YOUR_OTHER_STEEL_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(makeRoom),
    );
  });

  it.skip("Zeus - Missing His Spark: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nI NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      keyword: "Boost",
      type: "keyword",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: I NEED MORE THUNDERBOLTS! (static - conditional modifier)
    const iNeedMoreThunderbolts = {
      effect: {
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
          },
          {
            type: "modify-stat",
            stat: "willpower",
            modifier: 2,
            target: "SELF",
          },
        ],
        type: "compound",
      },
      name: "I NEED MORE THUNDERBOLTS!",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iNeedMoreThunderbolts),
    );
  });

  it.skip("The Headless Horseman - Relentless Spirit: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Putting It All Together: should parse card text", () => {
    const text =
      "Chosen opposing character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: restriction + draw)
    const puttingItAllTogether = {
      effect: {
        effects: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(puttingItAllTogether),
    );
  });

  it.skip("The Game's Afoot!: should parse card text", () => {
    const text =
      "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: move + gain keyword)
    const theGamesAfoot = {
      effect: {
        effects: [
          { type: "move", target: "UP_TO_2_YOUR_CHARACTERS" },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            target: "THAT_LOCATION",
          },
        ],
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theGamesAfoot),
    );
  });

  it.skip("The Robot Queen: should parse card text", () => {
    const text =
      "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAJOR MALFUNCTION (triggered)
    const majorMalfunction = {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      name: "MAJOR MALFUNCTION",
      trigger: {
        event: "play",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(majorMalfunction),
    );
  });

  it.skip("The Sword of Hercules: should parse card text", () => {
    const text =
      "MIGHTY HIT When you play this item, banish chosen opposing Deity character.\nHAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MIGHTY HIT (triggered)
    const mightyHit = {
      effect: {
        target: "CHOSEN_OPPOSING_DEITY_CHARACTER",
        type: "banish",
      },
      name: "MIGHTY HIT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mightyHit),
    );

    // Second ability: HAND-TO-HAND (triggered)
    const handToHand = {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "HAND-TO-HAND",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(handToHand),
    );
  });

  it.skip("Zootopia - Police Headquarters: should parse card text", () => {
    const text =
      "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NEW INFORMATION (triggered - once per turn)
    const newInformation = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "NEW INFORMATION",
      trigger: {
        event: "play",
        on: "CHARACTERS_HERE",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(newInformation),
    );
  });
});
