// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 010 Card Text Parser Tests", () => {
  it.skip("Baloo - Friend and Guardian: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Gaston - Frightful Bully: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: TOP THAT! (triggered)
    const topThat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TOP THAT!",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(topThat),
    );
  });

  it.skip("Rapunzel - Ready for Adventure: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: ACT OF KINDNESS (triggered)
    const actOfKindness: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ACT OF KINDNESS",
      trigger: {
        event: "be-chosen",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "prevention",
        target: "TRIGGERING_CHARACTER",
      },
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
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Eilonwy - Princess of Llyr: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Scrooge McDuck - On the Right Track: should parse card text", () => {
    const text =
      "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FABULOUS WEALTH (triggered)
    const fabulousWealth: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FABULOUS WEALTH",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
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
    const iveReadAboutThis: StaticAbilityDefinition = {
      type: "static",
      name: "I'VE READ ABOUT THIS",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveReadAboutThis),
    );
  });

  it.skip("Gurgi - Apple Lover: should parse card text", () => {
    const text =
      "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HAPPY DAY (triggered)
    const happyDay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HAPPY DAY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(happyDay),
    );
  });

  it.skip("Mrs. Beakley - Former S.H.U.S.H. Agent: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Shanti - Village Girl: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    const singer5: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer5),
    );
  });

  it.skip("Flash - Records Specialist: should parse card text", () => {
    const text =
      "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HOLD... YOUR HORSES (static - enters play exerted)
    const holdYourHorses: StaticAbilityDefinition = {
      type: "static",
      name: "HOLD... YOUR HORSES",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(holdYourHorses),
    );

    // Second ability: DEEP RESEARCH (triggered)
    const deepResearch: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DEEP RESEARCH",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(deepResearch),
    );
  });

  it.skip("Taran - Pig Keeper: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: FOLLOW THE PIG (triggered)
    const followThePig: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FOLLOW THE PIG",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "CARD_FROM_ANY_DISCARD",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(followThePig),
    );
  });

  it.skip("Ariel - Ethereal Voice: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nCOMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: COMMAND PERFORMANCE (triggered)
    const commandPerformance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "COMMAND PERFORMANCE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "SONG",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(commandPerformance),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: SPECULATION (triggered)
    const speculation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SPECULATION",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "put-card-under",
        target: "TRIGGERING_CARD",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(speculation),
    );
  });

  it.skip("Mowgli - Man Cub: should parse card text", () => {
    const text =
      "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HAVE A BETTER LOOK (triggered)
    const haveABetterLook: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HAVE A BETTER LOOK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "reveal-hand", target: "OPPONENT" },
          { type: "discard", target: "OPPONENT", amount: 1 },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(haveABetterLook),
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
      type: "keyword",
      keyword: "Boost",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost3),
    );

    // Second ability: TIMELY ALLIANCE (triggered)
    const timelyAlliance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TIMELY ALLIANCE",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "reveal-top",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(timelyAlliance),
    );
  });

  it.skip("Goofy - Ghost Hunter: should parse card text", () => {
    const text =
      "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PERFECT TRAP (triggered)
    const perfectTrap: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PERFECT TRAP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(perfectTrap),
    );
  });

  it.skip("Della Duck - Returning Mother: should parse card text", () => {
    const text =
      "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HERE TO HELP (triggered)
    const hereToHelp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE TO HELP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest-or-challenge",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereToHelp),
    );
  });

  it.skip("Mickey Mouse - Amber Champion: should parse card text", () => {
    const text =
      "LEADING THE WAY Your other Amber characters get +2 {W}.\nFRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEADING THE WAY (static)
    const leadingTheWay: StaticAbilityDefinition = {
      type: "static",
      name: "LEADING THE WAY",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "YOUR_OTHER_AMBER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(leadingTheWay),
    );

    // Second ability: FRIENDLY CHORUS (static - conditional Singer 8)
    const friendlyChorus: StaticAbilityDefinition = {
      type: "static",
      name: "FRIENDLY CHORUS",
      effect: {
        type: "gain-keyword",
        keyword: "Singer",
        value: 8,
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(friendlyChorus),
    );
  });

  it.skip("Goofy - Galumphing Gumshoe: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: HOT PURSUIT (triggered - dual trigger)
    const hotPursuit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HOT PURSUIT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "EACH_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(hotPursuit),
    );
  });

  it.skip("Gazelle - Ballad Singer: should parse card text", () => {
    const text =
      "Singer 7 (This character counts as cost 7 to sing songs.)\nCROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 7
    const singer7: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 7,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer7),
    );

    // Second ability: CROWD FAVORITE (triggered)
    const crowdFavorite: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CROWD FAVORITE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-on-top-of-deck",
        target: "CARD_FROM_DISCARD",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(crowdFavorite),
    );
  });

  it.skip("Search for Clues: should parse card text", () => {
    const text =
      "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const searchForClues: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "discard", amount: 2, target: "PLAYER_WITH_MOST_CARDS" },
          { type: "gain-lore", amount: 1, target: "CONTROLLER" },
        ],
      },
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
    const orRewriteHistory: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHARACTER_CARD_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(orRewriteHistory),
    );
  });

  it.skip("Della's Moon Lullaby: should parse card text", () => {
    const text =
      "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const dellasMoonLullaby: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dellasMoonLullaby),
    );
  });

  it.skip("The Horseman Strikes!: should parse card text", () => {
    const text = "Draw a card. You may banish chosen character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const theHorsemanStrikes: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "banish", target: "CHOSEN_CHARACTER_WITH_EVASIVE" },
        ],
      },
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
    const whatIsToCome: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT IS TO COME",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "look-at-top",
        amount: 4,
        target: "DECK",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatIsToCome),
    );

    // Second ability: WHISPERED POWER (activated)
    const whisperedPower: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WHISPERED POWER",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "put-card-under",
        target: "YOUR_CHARACTER_OR_LOCATION_WITH_BOOST",
      },
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
    const latestEntry: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LATEST ENTRY",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
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
    const theCauldronCalls: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE CAULDRON CALLS",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "put-card-under",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theCauldronCalls),
    );

    // Second ability: RISE AND JOIN ME! (activated)
    const riseAndJoinMe: ActivatedAbilityDefinition = {
      type: "activated",
      name: "RISE AND JOIN ME!",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "play-card",
        target: "CARDS_UNDER_SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(riseAndJoinMe),
    );
  });

  it.skip("Munchings and Crunchings: should parse card text", () => {
    const text =
      "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WHAT A JUICY APPLE (activated)
    const whatAJuicyApple: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WHAT A JUICY APPLE",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatAJuicyApple),
    );

    // Second ability: COME ON OUT (static)
    const comeOnOut: StaticAbilityDefinition = {
      type: "static",
      name: "COME ON OUT",
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CHARACTERS_NAMED_GURGI",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(comeOnOut),
    );
  });

  it.skip("Duckburg - Funso's Funzone: should parse card text", () => {
    const text =
      "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHERE FUN IS IN THE ZONE (triggered)
    const whereFunIsInTheZone: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHERE FUN IS IN THE ZONE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "CHARACTER_HERE",
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
        target: "NEXT_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whereFunIsInTheZone),
    );
  });

  it.skip("Minnie Mouse - Amethyst Champion: should parse card text", () => {
    const text =
      "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL BALANCE (triggered)
    const mysticalBalance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MYSTICAL BALANCE",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_OTHER_AMETHYST_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mysticalBalance),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: ARISE! (triggered)
    const arise: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ARISE!",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "return-to-hand", target: "TRIGGERING_CARD" },
          { type: "discard", target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(arise));
  });

  it.skip("Gwythaint - Savage Hunter: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: SWOOPING STRIKE (triggered)
    const swoopingStrike: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWOOPING STRIKE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "OPPONENT_CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(swoopingStrike),
    );
  });

  it.skip("Demona - Betrayer of the Clan: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +2
    const challenger2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger2),
    );

    // Second ability: STONE BY DAY (static)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Magica De Spell - Shadowy and Sinister: should parse card text", () => {
    const text =
      "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DARK INCANTATION (triggered)
    const darkIncantation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DARK INCANTATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "shuffle-into-deck",
        target: "CARD_FROM_CHOSEN_PLAYER_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(darkIncantation),
    );
  });

  it.skip("Lena Sabrewing - Mysterious Duck: should parse card text", () => {
    const text =
      "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ARCANE CONNECTION (triggered with condition)
    const arcaneConnection: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ARCANE CONNECTION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(arcaneConnection),
    );
  });

  it.skip("Iago - Stompin' Mad: should parse card text", () => {
    const text =
      "Challenger +5 (While challenging, this character gets +5 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +5 keyword
    const challenger5: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger5),
    );
  });

  it.skip("Violet Sabrewing - Senior Junior Woodchuck: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Elsa - Exploring the Unknown: should parse card text", () => {
    const text =
      "CLOSER LOOK When you play this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CLOSER LOOK (triggered)
    const closerLook: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLOSER LOOK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(closerLook),
    );
  });

  it.skip("Duckworth - Ghost Butler: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nFINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: FINAL ACT (triggered)
    const finalAct: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FINAL ACT",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-card-under",
        target: "YOUR_CHARACTER_OR_LOCATION_WITH_BOOST",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(finalAct),
    );
  });

  it.skip("Nibs - Lost Boy: should parse card text", () => {
    const text =
      "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LOOK WHO'S BACK (triggered)
    const lookWhosBack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOK WHO'S BACK",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
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
    const grandMachinations: StaticAbilityDefinition = {
      type: "static",
      name: "GRAND MACHINATIONS",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(grandMachinations),
    );
  });

  it.skip("Coldstone - Reincarnated Cyborg: should parse card text", () => {
    const text =
      "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THE CANTRIPS HAVE BEEN SPOKEN (triggered with condition)
    const theCantripsHaveBeenSpoken: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE CANTRIPS HAVE BEEN SPOKEN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theCantripsHaveBeenSpoken),
    );
  });

  it.skip("Magica De Spell - Spiteful Sorceress: should parse card text", () => {
    const text =
      "MYSTICAL MANIPULATION Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL MANIPULATION (triggered)
    const mysticalManipulation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MYSTICAL MANIPULATION",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mysticalManipulation),
    );
  });

  it.skip("Nana - Canine Caregiver: should parse card text", () => {
    const text =
      "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HELPFUL INSTINCTS (triggered)
    const helpfulInstincts: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HELPFUL INSTINCTS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(helpfulInstincts),
    );
  });

  it.skip("Magica De Spell - Conniving Sorceress: should parse card text", () => {
    const text =
      "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.)\nSHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 7
    const shift7: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 7 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift7),
    );

    // Second ability: SHADOW'S GRASP (triggered with condition)
    const shadowsGrasp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHADOW'S GRASP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 4,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shadowsGrasp),
    );
  });

  it.skip("Demona - Scourge of the Wyvern Clan: should parse card text", () => {
    const text =
      "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: AD SAXUM COMMUTATE (triggered)
    const adSaxumCommutate: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AD SAXUM COMMUTATE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "exert", target: "ALL_OPPOSING_CHARACTERS" },
          { type: "draw-until-hand-size", size: 3, target: "EACH_PLAYER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(adSaxumCommutate),
    );

    // Second ability: STONE BY DAY (static)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Hades - Looking for a Deal: should parse card text", () => {
    const text =
      "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT D'YA SAY? (triggered)
    const whatDYaSay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT D'YA SAY?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatDYaSay),
    );
  });

  it.skip("Olaf - Helping Hand: should parse card text", () => {
    const text =
      "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SECOND CHANCE (triggered)
    const secondChance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SECOND CHANCE",
      trigger: {
        event: "leave-play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_YOUR_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(secondChance),
    );
  });

  it.skip("Merlin - Completing His Research: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: LEGACY OF LEARNING (triggered with condition)
    const legacyOfLearning: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LEGACY OF LEARNING",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(legacyOfLearning),
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
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: SLIPPERY SPELL (static)
    const slipperySpell: StaticAbilityDefinition = {
      type: "static",
      name: "SLIPPERY SPELL",
      effect: {
        type: "compound",
        effects: [
          { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" },
          { type: "gain-keyword", keyword: "Evasive", target: "SELF" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(slipperySpell),
    );
  });

  it.skip("Cheshire Cat - Inexplicable: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: IT'S LOADS OF FUN (triggered)
    const itsLoadsOfFun: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT'S LOADS OF FUN",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "move-damage",
        amount: 2,
        upTo: true,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(itsLoadsOfFun),
    );
  });

  it.skip("Begone!: should parse card text", () => {
    const text =
      "Return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const begone: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CARD_COST_3_OR_LESS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(begone),
    );
  });

  it.skip("Can't Hold It Back Anymore: should parse card text", () => {
    const text =
      "Exert chosen opposing character. Move all damage counters from all other characters to that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const cantHoldItBackAnymore: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "exert", target: "CHOSEN_OPPOSING_CHARACTER" },
          {
            type: "move-damage",
            from: "ALL_OTHER_CHARACTERS",
            to: "CHOSEN_OPPOSING_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cantHoldItBackAnymore),
    );
  });

  it.skip("Swooping Strike: should parse card text", () => {
    const text =
      "Each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const swoopingStrike: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "exert",
        target: "OPPONENT_CHOSEN_CHARACTER",
      },
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
    const performanceReview: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "draw",
        amount: "VARIABLE",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(performanceReview),
    );
  });

  it.skip("Fragile as a Flower: should parse card text", () => {
    const text =
      "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    const fragileAsAFlower: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "exert", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fragileAsAFlower),
    );
  });

  it.skip("Junior Woodchuck Guidebook: should parse card text", () => {
    const text =
      "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THE BOOK KNOWS EVERYTHING (activated)
    const theBookKnowsEverything: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE BOOK KNOWS EVERYTHING",
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBookKnowsEverything),
    );
  });

  it.skip("Grimorum Arcanorum: should parse card text", () => {
    const text =
      "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\nCELERITAS Your characters named Demona gain Rush. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: DOCTRINA ADDUCERE (triggered)
    const doctrinaAdducere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DOCTRINA ADDUCERE",
      trigger: {
        event: "exert",
        timing: "whenever",
        on: "OPPOSING_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doctrinaAdducere),
    );

    // Second ability: CELERITAS (static)
    const celeritas: StaticAbilityDefinition = {
      type: "static",
      name: "CELERITAS",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_DEMONA_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(celeritas),
    );
  });

  it.skip("The Great Illuminary - Abandoned Laboratory: should parse card text", () => {
    const text =
      'STARTLING DISCOVERY Characters gain " {E} — Draw a card" while here.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLING DISCOVERY (static - grants ability)
    const startlingDiscovery: StaticAbilityDefinition = {
      type: "static",
      name: "STARTLING DISCOVERY",
      effect: {
        type: "grant-ability",
        target: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(startlingDiscovery),
    );
  });

  it.skip("Flotsam - Slippery as an Eel: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Kaa - Suspicious Serpent: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Webby Vanderquack - Mystery Enthusiast: should parse card text", () => {
    const text =
      "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONTAGIOUS ENERGY (triggered)
    const contagiousEnergy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CONTAGIOUS ENERGY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(contagiousEnergy),
    );
  });

  it.skip("Finnick - Tiny Terror: should parse card text", () => {
    const text =
      "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU BETTER RUN (triggered)
    const youBetterRun: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU BETTER RUN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youBetterRun),
    );
  });

  it.skip("Vladimir - Ceramic Unicorn Fan: should parse card text", () => {
    const text =
      "HIGH STANDARDS Whenever this character quests, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIGH STANDARDS (triggered)
    const highStandards: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HIGH STANDARDS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(highStandards),
    );
  });

  it.skip("Flintheart Glomgold - Scheming Billionaire: should parse card text", () => {
    const text =
      "TRY ME While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TRY ME (static - conditional Ward)
    const tryMe: StaticAbilityDefinition = {
      type: "static",
      name: "TRY ME",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tryMe));
  });

  it.skip("Jetsam - Opportunistic Eel: should parse card text", () => {
    const text =
      "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // AMBUSH FROM THE DEEP (triggered)
    const ambushFromTheDeep: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AMBUSH FROM THE DEEP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_OPPOSING_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ambushFromTheDeep),
    );
  });

  it.skip("Kaa - Secretive Snake: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Emily Quackfaster - Level-Headed Librarian: should parse card text", () => {
    const text =
      "RECOMMENDED READING When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // RECOMMENDED READING (triggered)
    const recommendedReading: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RECOMMENDED READING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-card-under",
        target: "YOUR_CHARACTER_OR_LOCATION_WITH_BOOST",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(recommendedReading),
    );
  });

  it.skip("Flynn Rider - Spectral Scoundrel: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)\nI'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: I'LL TAKE THAT (static)
    const illTakeThat: StaticAbilityDefinition = {
      type: "static",
      name: "I'LL TAKE THAT",
      effect: {
        type: "compound",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
          },
          { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(illTakeThat),
    );
  });

  it.skip("Bellwether - Master Manipulator: should parse card text", () => {
    const text =
      "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // VENDETTA (triggered)
    const vendetta: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "VENDETTA",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-damage",
        amount: 1,
        target: "EACH_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(vendetta),
    );
  });

  it.skip("Launchpad - Exceptional Pilot: should parse card text", () => {
    const text =
      "OFF THE MAP When you play this character, you may banish chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OFF THE MAP (triggered)
    const offTheMap: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OFF THE MAP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_LOCATION",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(offTheMap),
    );
  });

  it.skip("Baloo - Carefree Bear: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Baloo.)\nROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: ROLL WITH IT (triggered - modal)
    const rollWithIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROLL WITH IT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modal",
        options: [
          { type: "draw", amount: 1, target: "EACH_PLAYER" },
          { type: "discard", amount: 1, target: "EACH_PLAYER" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(rollWithIt),
    );
  });

  it.skip("Megara - Secret Keeper: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: I'LL BE FINE (static - grants triggered)
    const illBeFine: StaticAbilityDefinition = {
      type: "static",
      name: "I'LL BE FINE",
      effect: {
        type: "compound",
        effects: [
          { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" },
          { type: "grant-ability", target: "SELF" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(illBeFine),
    );
  });

  it.skip("Goldie O'Gilt - Cunning Prospector: should parse card text", () => {
    const text =
      "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CLAIM JUMPER (triggered)
    const claimJumper: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLAIM JUMPER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "reveal-hand", target: "OPPONENT" },
          { type: "discard", target: "OPPONENT", amount: 1 },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(claimJumper),
    );

    // Second ability: STRIKE GOLD (triggered)
    const strikeGold: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STRIKE GOLD",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(strikeGold),
    );
  });

  it.skip("Shere Khan - Fearsome Tiger: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ON THE HUNT (triggered)
    const onTheHunt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ON THE HUNT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "banish", target: "CHOSEN_OPPOSING_DAMAGED_CHARACTER" },
          { type: "put-damage", amount: 1, target: "ANOTHER_CHOSEN_CHARACTER" },
        ],
      },
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
    const backupPlan: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BACKUP PLAN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "discard", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(backupPlan),
    );

    // Second ability: ON THE MOVE (triggered)
    const onTheMove: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ON THE MOVE",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(onTheMove),
    );
  });

  it.skip("Akela - Forest Runner: should parse card text", () => {
    const text =
      "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // AHEAD OF THE PACK (activated)
    const aheadOfThePack: ActivatedAbilityDefinition = {
      type: "activated",
      name: "AHEAD OF THE PACK",
      cost: {
        ink: 1,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aheadOfThePack),
    );
  });

  it.skip("Goofy - Emerald Champion: should parse card text", () => {
    const text =
      "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.\nPROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVEN THE SCORE (triggered)
    const evenTheScore: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EVEN THE SCORE",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_OTHER_EMERALD_CHARACTERS",
      },
      effect: {
        type: "banish",
        target: "CHALLENGING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evenTheScore),
    );

    // Second ability: PROVIDE COVER (static)
    const provideCover: StaticAbilityDefinition = {
      type: "static",
      name: "PROVIDE COVER",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_OTHER_EMERALD_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(provideCover),
    );
  });

  it.skip("Little John - Impermanent Outlaw: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    const boost3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost3),
    );

    // Second ability: READY TO RASSLE (triggered)
    const readyToRassle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "READY TO RASSLE",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(readyToRassle),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: WORK SMARTER (triggered)
    const workSmarter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WORK SMARTER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "TOP_OF_DECK",
      },
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
    const soBeIt: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "YOUR_CHARACTERS",
          },
          { type: "banish", target: "CHOSEN_ITEM" },
        ],
      },
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
    const trustInMe: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modal",
        options: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: "EACH_OPPOSING_CHARACTER",
          },
          { type: "discard", amount: 2, target: "EACH_OPPONENT" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(trustInMe),
    );
  });

  it.skip("Chomp!: should parse card text", () => {
    const text = "Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const chomp: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(chomp));
  });

  it.skip("Malicious, Mean, and Scary: should parse card text", () => {
    const text = "Put 1 damage counter on each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const maliciousMeanAndScary: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "put-damage",
        amount: 1,
        target: "EACH_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(maliciousMeanAndScary),
    );
  });

  it.skip("Potion of Malice: should parse card text", () => {
    const text =
      "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUPPRESSED ANGER (activated)
    const suppressedAnger: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SUPPRESSED ANGER",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "put-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(suppressedAnger),
    );

    // Second ability: MINDLESS RAGE (activated)
    const mindlessRage: ActivatedAbilityDefinition = {
      type: "activated",
      name: "MINDLESS RAGE",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "EACH_OPPOSING_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(mindlessRage),
    );
  });

  it.skip("Inscrutable Map: should parse card text", () => {
    const text =
      "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BACKTRACK (activated)
    const backtrack: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BACKTRACK",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(backtrack),
    );
  });

  it.skip("Enigmatic Inkcaster: should parse card text", () => {
    const text =
      "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ITS OWN REWARD (activated with condition)
    const itsOwnReward: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ITS OWN REWARD",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itsOwnReward),
    );
  });

  it.skip("Blessed Bagpipes: should parse card text", () => {
    const text =
      "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MCDUCK HEIRLOOM (triggered)
    const mcduckHeirloom: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MCDUCK HEIRLOOM",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-card-under",
        target: "YOUR_CHARACTER_OR_LOCATION_WITH_BOOST",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mcduckHeirloom),
    );

    // Second ability: BATTLE ANTHEM (triggered)
    const battleAnthem: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BATTLE ANTHEM",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(battleAnthem),
    );
  });

  it.skip("White Agony Plains - Golden Lagoon: should parse card text", () => {
    const text =
      "PURE LIQUID GOLD This location gets +1 {L} for each character here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PURE LIQUID GOLD (static)
    const pureLiquidGold: StaticAbilityDefinition = {
      type: "static",
      name: "PURE LIQUID GOLD",
      effect: {
        type: "for-each",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        forEach: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pureLiquidGold),
    );
  });

  it.skip("Ares - God of War: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.) CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );

    // Second ability: CALL TO BATTLE (triggered - once per turn)
    const callToBattle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CALL TO BATTLE",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
      },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(callToBattle),
    );
  });

  it.skip("Peter Pan - High Flyer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
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
    const onPatrol: StaticAbilityDefinition = {
      type: "static",
      name: "ON PATROL",
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "SELF",
      },
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
    const protectionOfThePack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PROTECTION OF THE PACK",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "ready",
        target: "SELF",
      },
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
    const onPatrol: StaticAbilityDefinition = {
      type: "static",
      name: "ON PATROL",
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "SELF",
      },
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
    const protectionOfThePack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PROTECTION OF THE PACK",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "ready",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protectionOfThePack),
    );
  });

  it.skip("Mother Gothel - Underhanded Schemer: should parse card text", () => {
    const text =
      "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SOMEBODY'S GOT TO USE IT (static - conditional modifier)
    const somebodysGotToUseIt: StaticAbilityDefinition = {
      type: "static",
      name: "SOMEBODY'S GOT TO USE IT",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(somebodysGotToUseIt),
    );
  });

  it.skip("Hermes - Harried Messenger: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush keyword
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Beast - Aggressive Lord: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: THAT'S MINE (triggered - conditional)
    const thatsMine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THAT'S MINE",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "lose-lore", amount: 1, target: "EACH_OPPONENT" },
          { type: "gain-lore", amount: 1 },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thatsMine),
    );
  });

  it.skip("Bronx - Ferocious Beast: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: HARMLESS DIVERSION (triggered)
    const harmlessDiversion: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HARMLESS DIVERSION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(harmlessDiversion),
    );
  });

  it.skip("David Xanatos - Charismatic Leader: should parse card text", () => {
    const text =
      "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEARN FROM EVERYTHING (triggered)
    const learnFromEverything: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LEARN FROM EVERYTHING",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(learnFromEverything),
    );

    // Second ability: WHAT ARE YOU WAITING FOR? (triggered)
    const whatAreYouWaitingFor: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT ARE YOU WAITING FOR?",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatAreYouWaitingFor),
    );
  });

  it.skip("Hans - Brazen Manipulator: should parse card text", () => {
    const text =
      "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: JOSTLING FOR POWER (static - restriction)
    const jostlingForPower: StaticAbilityDefinition = {
      type: "static",
      name: "JOSTLING FOR POWER",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "KING_AND_QUEEN_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(jostlingForPower),
    );

    // Second ability: GROWING INFLUENCE (triggered - conditional)
    const growingInfluence: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GROWING INFLUENCE",
      trigger: {
        event: "start-of-turn",
        timing: "at",
        on: "CONTROLLER",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(growingInfluence),
    );
  });

  it.skip("Hercules - Mighty Leader: should parse card text", () => {
    const text =
      "EVER VIGILANT This character can't be dealt damage unless he's being challenged.\nEVER VALIANT While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVER VIGILANT (static - damage protection)
    const everVigilant: StaticAbilityDefinition = {
      type: "static",
      name: "EVER VIGILANT",
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(everVigilant),
    );

    // Second ability: EVER VALIANT (static - conditional protection)
    const everValiant: StaticAbilityDefinition = {
      type: "static",
      name: "EVER VALIANT",
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: "YOUR_OTHER_HERO_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(everValiant),
    );
  });

  it.skip("Goliath - Guardian of Castle Wyvern: should parse card text", () => {
    const text =
      "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BE CAREFUL, ALL OF YOU (triggered)
    const beCarefulAllOfYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BE CAREFUL, ALL OF YOU",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "YOUR_GARGOYLE_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beCarefulAllOfYou),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Brooklyn - Second in Command: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Donald Duck - Ruby Champion: should parse card text", () => {
    const text =
      "HIGH ENERGY Your other Ruby characters get +1 {S}.\nPOWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HIGH ENERGY (static - modifier)
    const highEnergy: StaticAbilityDefinition = {
      type: "static",
      name: "HIGH ENERGY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_OTHER_RUBY_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(highEnergy),
    );

    // Second ability: POWERFUL REWARD (static - conditional modifier)
    const powerfulReward: StaticAbilityDefinition = {
      type: "static",
      name: "POWERFUL REWARD",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_RUBY_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(powerfulReward),
    );
  });

  it.skip("Elisa Maza - Intrepid Investigator: should parse card text", () => {
    const text =
      "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SPECIAL DETAIL (static - conditional modifier)
    const specialDetail: StaticAbilityDefinition = {
      type: "static",
      name: "SPECIAL DETAIL",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(specialDetail),
    );
  });

  it.skip("Aladdin - Barreling Through: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nReckless (This character can't quest and must challenge each turn if able.)\nONLY THE BOLD While there's a card under this character, your characters with Reckless gain \"{E} — Gain 1 lore.\"";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(reckless),
    );

    // Third ability: ONLY THE BOLD (static - grants ability)
    const onlyTheBold: StaticAbilityDefinition = {
      type: "static",
      name: "ONLY THE BOLD",
      effect: {
        type: "grant-ability",
        target: "YOUR_RECKLESS_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(onlyTheBold),
    );
  });

  it.skip("Lady Tremaine - Sinister Socialite: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: EXPEDIENT SCHEMES (triggered - conditional)
    const expedientSchemes: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXPEDIENT SCHEMES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        target: "ACTION_FROM_DISCARD",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(expedientSchemes),
    );
  });

  it.skip("The Headless Horseman - Terror of Sleepy Hollow: should parse card text", () => {
    const text =
      "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEAVES NO TRACE (triggered)
    const leavesNoTrace: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LEAVES NO TRACE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(leavesNoTrace),
    );

    // Second ability: GATHERING STRENGTH (triggered)
    const gatheringStrength: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GATHERING STRENGTH",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPOSING_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gatheringStrength),
    );
  });

  it.skip("Mulan - Standing Her Ground: should parse card text", () => {
    const text =
      "FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FLOWING BLADE (static - conditional protection)
    const flowingBlade: StaticAbilityDefinition = {
      type: "static",
      name: "FLOWING BLADE",
      effect: {
        type: "grant-ability",
        ability: "takes-no-damage-from-challenges",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(flowingBlade),
    );
  });

  it.skip("Brom Bones - Burly Bully: should parse card text", () => {
    const text =
      "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ROUGH AND TUMBLE (triggered)
    const roughAndTumble: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROUGH AND TUMBLE",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(roughAndTumble),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: WILD RAGE (activated)
    const wildRage: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WILD RAGE",
      cost: {
        ink: 1,
        dealDamageToSelf: 1,
      },
      effect: {
        type: "ready",
        target: "SELF",
      },
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
    const nextStopOlympus: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
          },
          { type: "delayed-trigger", effect: { type: "gain-lore", amount: 1 } },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nextStopOlympus),
    );
  });

  it.skip("Get to Safety!: should parse card text", () => {
    const text =
      "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (play + conditional draw)
    const getToSafety: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "play-card", target: "LOCATION_FROM_DISCARD" },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(getToSafety),
    );
  });

  it.skip("Time to Go!: should parse card text", () => {
    const text =
      "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (banish + draw with conditional bonus)
    const timeToGo: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "banish", target: "CHOSEN_CHARACTER_OF_YOURS" },
          { type: "draw", amount: 2, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(timeToGo),
    );
  });

  it.skip("Ghostly Tale: should parse card text", () => {
    const text = "Exert all opposing characters with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (exert all with filter)
    const ghostlyTale: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "exert",
        target: "ALL_OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ghostlyTale),
    );
  });

  it.skip("Dragon Fire: should parse card text", () => {
    const text = "Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (banish)
    const dragonFire: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dragonFire),
    );
  });

  it.skip("Mushu's Rocket: should parse card text", () => {
    const text =
      "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I NEED FIREPOWER (triggered)
    const iNeedFirepower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I NEED FIREPOWER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iNeedFirepower),
    );

    // Second ability: HITCH A RIDE (activated)
    const hitchARide: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HITCH A RIDE",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(hitchARide),
    );
  });

  it.skip("The Bitterwood - Underground Forest: should parse card text", () => {
    const text =
      "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GATHER RESOURCES (triggered - once per turn)
    const gatherResources: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GATHER RESOURCES",
      trigger: {
        event: "move",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
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
    const headForTheBridge: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HEAD FOR THE BRIDGE!",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "CHARACTERS_HERE",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "banish", target: "SELF" },
          { type: "gain-lore", amount: 2 },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "TRIGGERING_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(headForTheBridge),
    );
  });

  it.skip("Judy Hopps - On the Case: should parse card text", () => {
    const text =
      "HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIDDEN CLUES (triggered - conditional)
    const hiddenClues: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HIDDEN CLUES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hiddenClues),
    );
  });

  it.skip("Hen Wen - Prophetic Pig: should parse card text", () => {
    const text =
      "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FUTURE SIGHT (triggered - scry)
    const futureSight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FUTURE SIGHT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "look-at-top",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(futureSight),
    );
  });

  it.skip("Anna - Making Snow Plans: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Daisy Duck - Ghost Finder: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Cri-Kee - Good Luck Charm: should parse card text", () => {
    const text = "Alert (This character can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Alert keyword
    const alert: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Alert",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(alert));
  });

  it.skip("Rapunzel - Creative Captor: should parse card text", () => {
    const text =
      "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENSNARL (triggered)
    const ensnarl: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENSNARL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ensnarl),
    );
  });

  it.skip("Fergus McDuck - Scrooge's Father: should parse card text", () => {
    const text =
      "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TOUGHEN UP (triggered)
    const toughenUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TOUGHEN UP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(toughenUp),
    );
  });

  it.skip("Scuttle - Birdbrained: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Ichabod Crane - Bookish Schoolmaster: should parse card text", () => {
    const text =
      "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WELL-READ (triggered - conditional)
    const wellRead: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WELL-READ",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "TOP_OF_DECK",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellRead),
    );
  });

  it.skip("Jasmine - Soothing Princess: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nUPLIFTING AURA Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: UPLIFTING AURA (triggered - conditional)
    const upliftingAura: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UPLIFTING AURA",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(upliftingAura),
    );
  });

  it.skip("Judy Hopps - Lead Detective: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Judy Hopps.)\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: LATERAL THINKING (static - grants keywords)
    const lateralThinking: StaticAbilityDefinition = {
      type: "static",
      name: "LATERAL THINKING",
      effect: {
        type: "compound",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Alert",
            target: "YOUR_DETECTIVE_CHARACTERS",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            target: "YOUR_DETECTIVE_CHARACTERS",
          },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(lateralThinking),
    );
  });

  it.skip("Ichabod Crane - Scared Out of His Mind: should parse card text", () => {
    const text =
      "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CHILLING TALE (triggered)
    const chillingTale: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CHILLING TALE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chillingTale),
    );
  });

  it.skip("Scar - Eerily Prepared: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    const boost2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: SURVIVAL OF THE FITTEST (triggered)
    const survivalOfTheFittest: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SURVIVAL OF THE FITTEST",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(survivalOfTheFittest),
    );
  });

  it.skip("Daisy Duck - Paranormal Investigator: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Daisy Duck.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(support),
    );

    // Third ability: STRANGE HAPPENINGS (static - conditional)
    const strangeHappenings: StaticAbilityDefinition = {
      type: "static",
      name: "STRANGE HAPPENINGS",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "OPPONENTS_INKWELL_CARDS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(strangeHappenings),
    );
  });

  it.skip("Cinderella - Dream Come True: should parse card text", () => {
    const text =
      "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHATEVER YOU WISH FOR (triggered - conditional)
    const whateverYouWishFor: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHATEVER YOU WISH FOR",
      trigger: {
        event: "end-of-turn",
        timing: "at",
        on: "CONTROLLER",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "put-into-inkwell", target: "CARD_FROM_HAND" },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whateverYouWishFor),
    );
  });

  it.skip("Judy Hopps - Uncovering Clues: should parse card text", () => {
    const text =
      "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THOROUGH INVESTIGATION (triggered - dual trigger)
    const thoroughInvestigation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THOROUGH INVESTIGATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "look-at-top",
        amount: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thoroughInvestigation),
    );
  });

  it.skip("Pluto - Clever Cluefinder: should parse card text", () => {
    const text =
      "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON THE TRAIL (activated - conditional)
    const onTheTrail: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ON THE TRAIL",
      cost: {
        exert: true,
      },
      effect: {
        type: "return-to-hand",
        target: "ITEM_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onTheTrail),
    );
  });

  it.skip("Daisy Duck - Sapphire Champion: should parse card text", () => {
    const text =
      "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nLOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: STAND FAST (static - grants keyword)
    const standFast: StaticAbilityDefinition = {
      type: "static",
      name: "STAND FAST",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "YOUR_OTHER_SAPPHIRE_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(standFast),
    );

    // Second ability: LOOK AHEAD (triggered)
    const lookAhead: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOK AHEAD",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "YOUR_OTHER_SAPPHIRE_CHARACTERS",
      },
      effect: {
        type: "look-at-top",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(lookAhead),
    );
  });

  it.skip("Kristoff - Mining the Ruins: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nWORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    const boost1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: WORTH MINING (triggered - conditional)
    const worthMining: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WORTH MINING",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "TOP_OF_DECK",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(worthMining),
    );
  });

  it.skip("Mickey Mouse - Detective: should parse card text", () => {
    const text =
      "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GET A CLUE (triggered)
    const getAClue: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GET A CLUE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        target: "TOP_OF_DECK",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(getAClue),
    );
  });

  it.skip("Hen Wen's Visions: should parse card text", () => {
    const text =
      "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (look at top + rearrange)
    const henWensVisions: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look-at-top",
        amount: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(henWensVisions),
    );
  });

  it.skip("Promising Lead: should parse card text", () => {
    const text =
      "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: modify stat + grant keyword)
    const promisingLead: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
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
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(promisingLead),
    );
  });

  it.skip("Might Solve a Mystery: should parse card text", () => {
    const text =
      "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (look at top + put into hand)
    const mightSolveAMystery: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look-at-top",
        amount: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mightSolveAMystery),
    );
  });

  it.skip("Sudden Scare: should parse card text", () => {
    const text =
      "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: put into inkwell + opponent inkwell)
    const suddenScare: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "put-into-inkwell", target: "CHOSEN_OPPOSING_CHARACTER" },
          { type: "put-into-inkwell", target: "OPPONENT_TOP_OF_DECK" },
        ],
      },
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
    const spookySight: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        target: "ALL_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(spookySight),
    );
  });

  it.skip("Detective's Badge: should parse card text", () => {
    const text =
      "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECT AND SERVE (activated)
    const protectAndServe: ActivatedAbilityDefinition = {
      type: "activated",
      name: "PROTECT AND SERVE",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "compound",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            target: "CHOSEN_CHARACTER",
          },
          { type: "property-modification", target: "CHOSEN_CHARACTER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protectAndServe),
    );
  });

  it.skip("Ink Amplifier: should parse card text", () => {
    const text =
      "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENERGY CAPTURE (triggered - conditional)
    const energyCapture: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENERGY CAPTURE",
      trigger: {
        event: "draw",
        timing: "whenever",
        on: "OPPONENT",
      },
      effect: {
        type: "put-into-inkwell",
        target: "TOP_OF_DECK",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(energyCapture),
    );
  });

  it.skip("Fairy Godmother's Wand: should parse card text", () => {
    const text =
      "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ONLY TILL MIDNIGHT (triggered)
    const onlyTillMidnight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ONLY TILL MIDNIGHT",
      trigger: {
        event: "put-into-inkwell",
        timing: "whenever",
        on: "CONTROLLER",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_PRINCESS_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onlyTillMidnight),
    );
  });

  it.skip("Inkrunner: should parse card text", () => {
    const text =
      "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: PREFLIGHT CHECK (triggered)
    const preflightCheck: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PREFLIGHT CHECK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(preflightCheck),
    );

    // Second ability: READY TO RIDE (activated)
    const readyToRide: ActivatedAbilityDefinition = {
      type: "activated",
      name: "READY TO RIDE",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(readyToRide),
    );
  });

  it.skip("Castle of the Horned King - Bastion of Evil: should parse card text", () => {
    const text =
      "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // INTO THE GLOOM (triggered - once per turn)
    const intoTheGloom: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INTO THE GLOOM",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "CHARACTERS_HERE",
      },
      effect: {
        type: "ready",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(intoTheGloom),
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
      type: "keyword",
      keyword: "Boost",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost1),
    );

    // Second ability: EXPERT SHOT (triggered - conditional)
    const expertShot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXPERT SHOT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "UP_TO_2_CHOSEN_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(expertShot),
    );
  });

  it.skip("Donald Duck - Ghost Hunter: should parse card text", () => {
    const text =
      "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // RAISE A RUCKUS (triggered)
    const raiseARuckus: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RAISE A RUCKUS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "CHOSEN_DETECTIVE_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(raiseARuckus),
    );
  });

  it.skip("Goliath - Clan Leader: should parse card text", () => {
    const text =
      "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: DUSK TO DAWN (triggered)
    const duskToDawn: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DUSK TO DAWN",
      trigger: {
        event: "end-of-turn",
        timing: "at",
        on: "EACH_PLAYER",
      },
      effect: {
        type: "draw-until-hand-size",
        size: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(duskToDawn),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: WITCHING HOUR (triggered - complex)
    const witchingHour: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WITCHING HOUR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 3, target: "EACH_PLAYER" },
          { type: "discard", amount: 3, target: "EACH_PLAYER" },
          {
            type: "deal-damage",
            amount: "VARIABLE",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(witchingHour),
    );
  });

  it.skip("Clawhauser - Donut Detective: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +2 keyword
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Francine - Eyeing the Evidence: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Inspector Tezuka - Resolute Officer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Basil - Tenacious Mouse: should parse card text", () => {
    const text =
      "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HOLD YOUR GROUND (triggered)
    const holdYourGround: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HOLD YOUR GROUND",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_OTHER_DETECTIVE_CHARACTERS",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(holdYourGround),
    );
  });

  it.skip("Hudson - Determined Reader: should parse card text", () => {
    const text =
      "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FINDING ANSWERS (triggered)
    const findingAnswers: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FINDING ANSWERS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "discard", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(findingAnswers),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Minnie Mouse - Ghost Hunter: should parse card text", () => {
    const text =
      "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEARCH THE SHADOWS (triggered)
    const searchTheShadows: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SEARCH THE SHADOWS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: "CHOSEN_DETECTIVE_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(searchTheShadows),
    );
  });

  it.skip("Lexington - Small in Stature: should parse card text", () => {
    const text =
      "Alert (This character can challenge as if they had Evasive.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Alert
    const alert: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Alert",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(alert));

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("David Xanatos - Steel Clan Leader: should parse card text", () => {
    const text =
      "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MINOR INCONVENIENCE (triggered)
    const minorInconvenience: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MINOR INCONVENIENCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(minorInconvenience),
    );
  });

  it.skip("Chief Bogo - Calling the Shots: should parse card text", () => {
    const text =
      "MY JURISDICTION During your turn, this character can't be dealt damage.\nDEPUTIZE Your other characters gain the Detective classification.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MY JURISDICTION (static - conditional protection)
    const myJurisdiction: StaticAbilityDefinition = {
      type: "static",
      name: "MY JURISDICTION",
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(myJurisdiction),
    );

    // Second ability: DEPUTIZE (static - grants classification)
    const deputize: StaticAbilityDefinition = {
      type: "static",
      name: "DEPUTIZE",
      effect: {
        type: "property-modification",
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(deputize),
    );
  });

  it.skip("The Twins - Lost Boys: should parse card text", () => {
    const text =
      "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TWO FOR ONE (triggered - conditional)
    const twoForOne: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TWO FOR ONE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
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
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: CASE CLOSED (triggered)
    const caseClosed: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CASE CLOSED",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_DETECTIVE_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
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
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: PROTECTIVE PRESENCE (static - restriction)
    const protectivePresence: StaticAbilityDefinition = {
      type: "static",
      name: "PROTECTIVE PRESENCE",
      effect: {
        type: "restriction",
        restriction: "only-one-challenge-per-turn",
        target: "ALL_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(protectivePresence),
    );
  });

  it.skip("Broadway - Sturdy and Strong: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    const stoneByDay: StaticAbilityDefinition = {
      type: "static",
      name: "STONE BY DAY",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneByDay),
    );
  });

  it.skip("Pluto - Steel Champion: should parse card text", () => {
    const text =
      "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WINNER TAKE ALL (triggered)
    const winnerTakeAll: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WINNER TAKE ALL",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_OTHER_STEEL_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(winnerTakeAll),
    );

    // Second ability: MAKE ROOM (triggered)
    const makeRoom: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAKE ROOM",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_OTHER_STEEL_CHARACTERS",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(makeRoom),
    );
  });

  it.skip("Fairy Godmother - Magical Benefactor: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nSTUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    const boost3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Boost",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost3),
    );

    // Second ability: STUNNING TRANSFORMATION (triggered - complex)
    const stunningTransformation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STUNNING TRANSFORMATION",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          { type: "banish", target: "CHOSEN_OPPOSING_CHARACTER" },
          { type: "reveal-top", target: "OPPONENT" },
          { type: "play-card", target: "REVEALED_CARD" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stunningTransformation),
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
      type: "keyword",
      keyword: "Boost",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boost2),
    );

    // Second ability: I NEED MORE THUNDERBOLTS! (static - conditional modifier)
    const iNeedMoreThunderbolts: StaticAbilityDefinition = {
      type: "static",
      name: "I NEED MORE THUNDERBOLTS!",
      effect: {
        type: "compound",
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
      },
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
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("But I'm Much Faster: should parse card text", () => {
    const text =
      "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: gain Alert + gain Challenger)
    const butImMuchFaster: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Alert",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(butImMuchFaster),
    );
  });

  it.skip("Putting It All Together: should parse card text", () => {
    const text =
      "Chosen opposing character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: restriction + draw)
    const puttingItAllTogether: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(puttingItAllTogether),
    );
  });

  it.skip("He Hurled His Thunderbolt: should parse card text", () => {
    const text =
      "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: deal damage + gain keyword)
    const heHurledHisThunderbolt: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "deal-damage", amount: 4, target: "CHOSEN_CHARACTER" },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            target: "YOUR_DEITY_CHARACTERS",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heHurledHisThunderbolt),
    );
  });

  it.skip("The Game's Afoot!: should parse card text", () => {
    const text =
      "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: move + gain keyword)
    const theGamesAfoot: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "move", target: "UP_TO_2_YOUR_CHARACTERS" },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            target: "THAT_LOCATION",
          },
        ],
      },
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
    const majorMalfunction: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAJOR MALFUNCTION",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
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
    const mightyHit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MIGHTY HIT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_OPPOSING_DEITY_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mightyHit),
    );

    // Second ability: HAND-TO-HAND (triggered)
    const handToHand: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HAND-TO-HAND",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(handToHand),
    );
  });

  it.skip("Ingenious Device: should parse card text", () => {
    const text =
      "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.\nTIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SURPRISE PACKAGE (activated)
    const surprisePackage: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SURPRISE PACKAGE",
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "discard", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(surprisePackage),
    );

    // Second ability: TIME GROWS SHORT (triggered)
    const timeGrowsShort: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TIME GROWS SHORT",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER_OR_LOCATION",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(timeGrowsShort),
    );
  });

  it.skip("Illuminary Tunnels - Linked Caverns: should parse card text", () => {
    const text =
      "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.\nLOCUS While you have a character here, you pay 1 {I} less to play locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUBTERRANEAN NETWORK (static - conditional modifier)
    const subterraneanNetwork: StaticAbilityDefinition = {
      type: "static",
      name: "SUBTERRANEAN NETWORK",
      effect: {
        type: "for-each",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        forEach: "YOUR_OTHER_LOCATIONS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(subterraneanNetwork),
    );

    // Second ability: LOCUS (static - cost reduction)
    const locus: StaticAbilityDefinition = {
      type: "static",
      name: "LOCUS",
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "LOCATIONS",
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(locus));
  });

  it.skip("Zootopia - Police Headquarters: should parse card text", () => {
    const text =
      "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NEW INFORMATION (triggered - once per turn)
    const newInformation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NEW INFORMATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "CHARACTERS_HERE",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(newInformation),
    );
  });

  it.skip("Castle Wyvern - Above the Clouds: should parse card text", () => {
    const text =
      "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECT THIS CASTLE (static - grants keywords)
    const protectThisCastle: StaticAbilityDefinition = {
      type: "static",
      name: "PROTECT THIS CASTLE",
      effect: {
        type: "compound",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 1,
            target: "CHARACTERS_HERE",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            target: "CHARACTERS_HERE",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protectThisCastle),
    );
  });
});
