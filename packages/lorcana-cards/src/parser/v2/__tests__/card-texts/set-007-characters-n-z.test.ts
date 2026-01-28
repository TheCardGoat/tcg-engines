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

describe("Set 007 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Rhino - Motivational Speaker: should parse card text", () => {
    const text = "DESTINY CALLING Your other characters get +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DESTINY CALLING (static - buff other characters)
    const destinyCalling = {
      type: "static",
      name: "DESTINY CALLING",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(destinyCalling),
    );
  });

  it.skip("Perdita - Playful Mother: should parse card text", () => {
    const text =
      "WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.\nDON'T BE AFRAID Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // WHO'S NEXT? (triggered - cost reduction on quest)
    const whosNext = {
      type: "triggered",
      name: "WHO'S NEXT?",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whosNext),
    );

    // DON'T BE AFRAID (static - Puppies gain Ward)
    const dontBeAfraid = {
      type: "static",
      name: "DON'T BE AFRAID",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(dontBeAfraid),
    );
  });

  it.skip("Roger Radcliffe - Dog Lover: should parse card text", () => {
    const text =
      "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THERE YOU GO (triggered - remove damage from Puppies on quest)
    const thereYouGo = {
      type: "triggered",
      name: "THERE YOU GO",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thereYouGo),
    );
  });

  it.skip("Trusty - Loyal Bloodhound: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Peg - Natural Performer: should parse card text", () => {
    const text =
      "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CAPTIVE AUDIENCE (activated - conditional draw)
    const captiveAudience = {
      type: "activated",
      name: "CAPTIVE AUDIENCE",
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "character-count",
          count: 3,
          comparison: "greater-or-equal",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(captiveAudience),
    );
  });

  it.skip("Tramp - Street-Smart Dog: should parse card text", () => {
    const text =
      "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.\nHOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // NOW IT'S A PARTY (static - cost reduction)
    const nowItsAParty = {
      type: "static",
      name: "NOW IT'S A PARTY",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowItsAParty),
    );

    // HOW'S PICKINGS? (triggered - draw/discard on play)
    const howsPickings = {
      type: "triggered",
      name: "HOW'S PICKINGS?",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "compound",
          effects: [],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(howsPickings),
    );
  });

  it.skip("The Troubadour - Musical Narrator: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nSinger 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Resist +1
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Singer 4
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 4,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Wendy Darling - Pirate Queen: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nTELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // TELL NO TALES (triggered - remove damage on other character banished)
    const tellNoTales = {
      type: "triggered",
      name: "TELL NO TALES",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(tellNoTales),
    );
  });

  it.skip("Pascal - Garden Chameleon: should parse card text", () => {
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

  it.skip("Penny - Bolt's Person: should parse card text", () => {
    const text =
      "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENDURING LOYALTY (triggered - remove damage and grant Resist)
    const enduringLoyalty = {
      type: "triggered",
      name: "ENDURING LOYALTY",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "compound",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(enduringLoyalty),
    );
  });

  it.skip("Thunderbolt - Wonder Dog: should parse card text", () => {
    const text =
      "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Puppy Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("The Prince - Vigilant Suitor: should parse card text", () => {
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

  it.skip("Wreck-It Ralph - Hero's Duty: should parse card text", () => {
    const text =
      "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OUTFLANK (triggered - gain lore buff on other banish)
    const outflank = {
      type: "triggered",
      name: "OUTFLANK",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(outflank),
    );
  });

  it.skip("Pongo - Dear Old Dad: should parse card text", () => {
    const text =
      "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FOUND YOU, YOU LITTLE RASCAL (triggered - play from inkwell)
    const foundYou = {
      type: "triggered",
      name: "FOUND YOU, YOU LITTLE RASCAL",
      trigger: {
        event: "start-of-turn",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(foundYou),
    );
  });

  it.skip("Perla - Nimble Seamstress: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Snow White - Fairest in the Land: should parse card text", () => {
    const text = "HIDDEN AWAY This character can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIDDEN AWAY (static - can't be challenged)
    const hiddenAway = {
      type: "static",
      name: "HIDDEN AWAY",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hiddenAway),
    );
  });

  it.skip("Pepa Madrigal - Sensitive Sister: should parse card text", () => {
    const text =
      "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CLEAR SKIES, CLEAR SKIES (triggered - gain lore on sing)
    const clearSkies = {
      type: "triggered",
      name: "CLEAR SKIES, CLEAR SKIES",
      trigger: {
        event: "sing",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(clearSkies),
    );
  });

  it.skip("So Much to Give: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action - draw and grant Bodyguard
    const soMuchToGive = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          {
            type: "gain-keyword",
            keyword: "Bodyguard",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(soMuchToGive),
    );
  });

  it.skip("Restoring the Heart: should parse card text", () => {
    const text =
      "Remove up to 3 damage from chosen character or location. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action - remove damage and draw
    const restoringTheHeart = {
      type: "action",
      effect: {
        type: "compound",
        effects: [
          { type: "remove-damage", amount: 3, target: "CHOSEN_CHARACTER" },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restoringTheHeart),
    );
  });

  it.skip("The Family Madrigal: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action - look at top cards and search
    const theFamilyMadrigal = {
      type: "action",
      effect: {
        type: "look-at-top",
        amount: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theFamilyMadrigal),
    );
  });

  it.skip("Spaghetti Dinner: should parse card text", () => {
    const text =
      "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FINE DINING (activated - exert and pay ink for conditional lore)
    const fineDining = {
      type: "activated",
      name: "FINE DINING",
      cost: { exert: true, ink: 1 },
      effect: {
        type: "conditional",
        condition: {
          type: "character-count",
          count: 2,
          comparison: "greater-or-equal",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fineDining),
    );
  });

  it.skip("The Glass Slipper: should parse card text", () => {
    const text =
      "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // PERFECT PAIR (static - deck restriction)
    const perfectPair = {
      type: "static",
      name: "PERFECT PAIR",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(perfectPair),
    );

    // SEARCH THE KINGDOM (activated - banish and exert to search)
    const searchTheKingdom = {
      type: "activated",
      name: "SEARCH THE KINGDOM",
      cost: { banishSelf: true },
      effect: {
        type: "search-deck",
        cardType: "character",
        putInto: "hand",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(searchTheKingdom),
    );
  });

  it.skip("Treasure Guardian - Foreboding Sentry: should parse card text", () => {
    const text =
      "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // UNTOLD TREASURE (triggered - conditional draw on play)
    const untoldTreasure = {
      type: "triggered",
      name: "UNTOLD TREASURE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "have-character",
          classification: "Illusion",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(untoldTreasure),
    );
  });

  it.skip("Te Kā - Elemental Terror: should parse card text", () => {
    const text =
      "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Te Kā.)\nANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 7
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 7 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // ANCIENT RAGE (triggered - banish exerted opponent)
    const ancientRage = {
      type: "triggered",
      name: "ANCIENT RAGE",
      trigger: {
        event: "exert",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ancientRage),
    );
  });

  it.skip("Te Kā - Lava Monster: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +2
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Yzma - Transformed Kitten: should parse card text", () => {
    const text =
      "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I WIN (triggered - conditional return on banish)
    const iWin = {
      type: "triggered",
      name: "I WIN",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "comparison",
          left: { type: "cards-in-hand", controller: "you" },
          comparison: "greater",
          right: { type: "cards-in-hand", controller: "opponent" },
        },
        then: {
          type: "return-to-hand",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iWin));
  });

  it.skip("Rajah - Ghostly Tiger: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Vanish keyword
    const vanish: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Vanish",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(vanish),
    );
  });

  it.skip("Sven - Keen-Eyed Reindeer: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // FORMIDABLE GLARE (triggered - debuff on play)
    const formidableGlare = {
      type: "triggered",
      name: "FORMIDABLE GLARE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(formidableGlare),
    );
  });

  it.skip("Yzma - Above It All: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Yzma.)\nEvasive (Only characters with Evasive can challenge this character.)\nBACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // BACK TO WORK (triggered - bounce and discard on banish in challenge)
    const backToWork = {
      type: "triggered",
      name: "BACK TO WORK",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(backToWork),
    );
  });

  it.skip("The Queen - Jealous Beauty: should parse card text", () => {
    const text =
      "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NO ORDINARY APPLE (activated - move cards for lore)
    const noOrdinaryApple = {
      type: "activated",
      name: "NO ORDINARY APPLE",
      cost: { exert: true },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(noOrdinaryApple),
    );
  });

  it.skip("Panic - High-Strung Imp: should parse card text", () => {
    const text =
      "STARTLED SHRIEK When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLED SHRIEK (triggered - move damage on play)
    const startledShriek = {
      type: "triggered",
      name: "STARTLED SHRIEK",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: 2,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(startledShriek),
    );
  });

  it.skip("This Is My Family: should parse card text", () => {
    const text = "Gain 1 lore. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisIsMyFamily = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsMyFamily),
    );
  });

  it.skip("Show Me More!: should parse card text", () => {
    const text = "Each player draws 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const showMeMore = {
      type: "action",
      effect: { type: "draw", amount: 3, target: "EACH_PLAYER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(showMeMore),
    );
  });

  it.skip("Restoring the Crown: should parse card text", () => {
    const text =
      "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const restoringTheCrown = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restoringTheCrown),
    );
  });

  it.skip("Thomas O'Malley - Feline Charmer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Pete - Pirate Scoundrel: should parse card text", () => {
    const text =
      "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const pilferAndPlunder = {
      type: "triggered",
      name: "PILFER AND PLUNDER",
      trigger: { event: "play" },
      effect: {
        type: "optional",
        effect: { type: "banish", target: "CHOSEN_ITEM" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pilferAndPlunder),
    );
  });

  it.skip("Shere Khan - Infamous Tiger: should parse card text", () => {
    const text = "WHAT A PITY When you play this character, discard your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatAPity = {
      type: "triggered",
      name: "WHAT A PITY",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "discard", amount: "all" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatAPity),
    );
  });

  it.skip("Queen of Hearts - Unpredictable Bully: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)\nIF I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const ifILoseMyTemper = {
      type: "triggered",
      name: "IF I LOSE MY TEMPER...",
      trigger: { event: "play", on: "YOUR_OTHER_CHARACTERS" },
      effect: { type: "put-damage", amount: 1, target: "PLAYED_CARD" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ifILoseMyTemper),
    );
  });

  it.skip("Yokai - Intellectual Schemer: should parse card text", () => {
    const text =
      "INNOVATE You pay 1 {I} less to play characters using their Shift ability.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const innovate = {
      type: "static",
      name: "INNOVATE",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(innovate),
    );
  });

  it.skip("Yzma - Exasperated Schemer: should parse card text", () => {
    const text =
      "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const howShallIDoIt = {
      type: "triggered",
      name: "HOW SHALL I DO IT?",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "optional", effect: { type: "compound", effects: [] } },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(howShallIDoIt),
    );
  });

  it.skip("Pacha - Trekmate: should parse card text", () => {
    const text =
      "FULL PACK While you have more cards in your hand than each opponent, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fullPack = {
      type: "static",
      name: "FULL PACK",
      effect: {
        type: "conditional",
        condition: {
          type: "comparison",
          left: { type: "cards-in-hand", controller: "you" },
          comparison: "greater",
          right: { type: "cards-in-hand", controller: "opponent" },
        },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fullPack),
    );
  });

  it.skip("Tweedledee & Tweedledum - Strange Storytellers: should parse card text", () => {
    const text =
      "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const anotherRecitation = {
      type: "triggered",
      name: "ANOTHER RECITATION",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "optional",
        effect: { type: "return-to-hand", target: "CHOSEN_DAMAGED_CHARACTER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(anotherRecitation),
    );
  });

  it.skip("Tramp - Enterprising Dog: should parse card text", () => {
    const text =
      "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const heyPidge = {
      type: "static",
      name: "HEY, PIDGE",
      effect: {
        type: "conditional",
        condition: { type: "have-character", name: "Lady" },
        then: { type: "cost-reduction" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heyPidge),
    );

    const noTimeForWisecracks = {
      type: "triggered",
      name: "NO TIME FOR WISECRACKS",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(noTimeForWisecracks),
    );
  });

  it.skip("Pete - Space Pirate: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Pete.)\nFRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const frightfulScheme = {
      type: "static",
      name: "FRIGHTFUL SCHEME",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(frightfulScheme),
    );
  });

  it.skip("Wake Up, Alice!: should parse card text", () => {
    const text = "Return chosen damaged character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wakeUpAlice = {
      type: "action",
      effect: { type: "return-to-hand", target: "CHOSEN_DAMAGED_CHARACTER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wakeUpAlice),
    );
  });

  it.skip("The Return of Hercules: should parse card text", () => {
    const text =
      "Each player may reveal a character card from their hand and play it for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theReturnOfHercules = {
      type: "action",
      effect: { type: "play-card", from: "hand", free: true },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theReturnOfHercules),
    );
  });

  it.skip("Queen of Hearts - Losing Her Temper: should parse card text", () => {
    const text = "ROYAL PAIN While this character has damage, she gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const royalPain = {
      type: "static",
      name: "ROYAL PAIN",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalPain),
    );
  });

  it.skip("The Matchmaker - Unforgiving Expert: should parse card text", () => {
    const text =
      "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youAreADisgrace = {
      type: "triggered",
      name: "YOU ARE A DISGRACE!",
      trigger: { event: "challenge", on: "SELF" },
      effect: { type: "lose-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youAreADisgrace),
    );
  });

  it.skip("Stabbington Brother - Without a Patch: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const getEm = {
      type: "static",
      name: "GET 'EM!",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(getEm));
  });

  it.skip("Stabbington Brother - With a Patch: should parse card text", () => {
    const text =
      "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const crimeOfOpportunity = {
      type: "triggered",
      name: "CRIME OF OPPORTUNITY",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "lose-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(crimeOfOpportunity),
    );
  });

  it.skip("The Phantom Blot - Shadowy Figure: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Ratigan - Nefarious Criminal: should parse card text", () => {
    const text =
      "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aMarvelousPerformance = {
      type: "triggered",
      name: "A MARVELOUS PERFORMANCE",
      trigger: { event: "play" },
      effect: { type: "gain-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aMarvelousPerformance),
    );
  });

  it.skip("We've Got Company!: should parse card text", () => {
    const text =
      "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const weveGotCompany = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(weveGotCompany),
    );
  });

  it.skip("Out of Order: should parse card text", () => {
    const text = "Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const outOfOrder = {
      type: "action",
      effect: { type: "banish", target: "CHOSEN_CHARACTER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(outOfOrder),
    );
  });

  it.skip("Ruby Coil: should parse card text", () => {
    const text =
      "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const crimsonSpark = {
      type: "triggered",
      name: "CRIMSON SPARK",
      trigger: { event: "put-into-inkwell" },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(crimsonSpark),
    );
  });

  it.skip("Unconventional Tool: should parse card text", () => {
    const text =
      "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fixedInNoTime = {
      type: "triggered",
      name: "FIXED IN NO TIME",
      trigger: { event: "banish", on: "SELF" },
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fixedInNoTime),
    );
  });

  it.skip("Scrooge McDuck - Resourceful Miser: should parse card text", () => {
    const text =
      "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const putItToGoodUse = {
      type: "static",
      name: "PUT IT TO GOOD USE",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(putItToGoodUse),
    );

    const fortuneHunter = {
      type: "triggered",
      name: "FORTUNE HUNTER",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "look-at-top", amount: 4 },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(fortuneHunter),
    );
  });

  it.skip("Tamatoa - Happy as a Clam: should parse card text", () => {
    const text =
      "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.\nI'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const coolestCollection = {
      type: "triggered",
      name: "COOLEST COLLECTION",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "return-to-hand", target: "ITEM_FROM_DISCARD" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(coolestCollection),
    );

    const imBeautifulBaby = {
      type: "triggered",
      name: "I'M BEAUTIFUL, BABY!",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "optional",
        effect: { type: "play-card", from: "hand", free: true },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(imBeautifulBaby),
    );
  });

  it.skip("Pepper - Quick-Thinking Puppy: should parse card text", () => {
    const text =
      "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const inTheNickOfTime = {
      type: "triggered",
      name: "IN THE NICK OF TIME",
      trigger: { event: "banish" },
      effect: {
        type: "optional",
        effect: { type: "add-to-inkwell", target: "BANISHED_CHARACTER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(inTheNickOfTime),
    );
  });

  it.skip("Robin Hood - Eye for Detail: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Penny the Orphan - Clever Child: should parse card text", () => {
    const text =
      "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ourBottleWorked = {
      type: "static",
      name: "OUR BOTTLE WORKED!",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ourBottleWorked),
    );
  });

  it.skip("Water Has Memory: should parse card text", () => {
    const text =
      "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const waterHasMemory = {
      type: "action",
      effect: { type: "look" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(waterHasMemory),
    );
  });

  it.skip("Sapphire Coil: should parse card text", () => {
    const text =
      "BRILLIANT SHINE During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const brilliantShine = {
      type: "triggered",
      name: "BRILLIANT SHINE",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(brilliantShine),
    );
  });

  it.skip("Raya - Guidance Seeker: should parse card text", () => {
    const text =
      "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aGreaterPurpose = {
      type: "triggered",
      name: "A GREATER PURPOSE",
      trigger: { event: "put-into-inkwell" },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aGreaterPurpose),
    );
  });

  it.skip("Tuk Tuk - Disarmingly Cute: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Razoul - Menacing Guard: should parse card text", () => {
    const text =
      "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const myOrdersComeFromJafar = {
      type: "triggered",
      name: "MY ORDERS COME FROM JAFAR",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(myOrdersComeFromJafar),
    );
  });

  it.skip("Tick-Tock - Relentless Crocodile: should parse card text", () => {
    const text =
      "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookingForLunch = {
      type: "static",
      name: "LOOKING FOR LUNCH",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookingForLunch),
    );
  });

  it.skip("Orville - Albatross Air: should parse card text", () => {
    const text =
      "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const welcomeAboardFolks = {
      type: "static",
      name: "WELCOME ABOARD, FOLKS",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(welcomeAboardFolks),
    );
  });

  it.skip("Restoring Atlantis: should parse card text", () => {
    const text =
      "Your characters can't be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const restoringAtlantis = {
      type: "action",
      effect: { type: "restriction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restoringAtlantis),
    );
  });

  it.skip("Steel Coil: should parse card text", () => {
    const text =
      "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const metallicFlow = {
      type: "triggered",
      name: "METALLIC FLOW",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(metallicFlow),
    );
  });

  it.skip("Training Staff: should parse card text", () => {
    const text =
      "PRECISION STRIKE {E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const precisionStrike = {
      type: "activated",
      name: "PRECISION STRIKE",
      cost: { exert: true, ink: 1 },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(precisionStrike),
    );
  });
});
