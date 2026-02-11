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
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      name: "DESTINY CALLING",
      type: "static",
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
      effect: {
        amount: 2,
        type: "cost-reduction",
      },
      name: "WHO'S NEXT?",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whosNext),
    );

    // DON'T BE AFRAID (static - Puppies gain Ward)
    const dontBeAfraid = {
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      name: "DON'T BE AFRAID",
      type: "static",
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
      effect: {
        effect: {
          type: "remove-damage",
          amount: 1,
          target: "YOUR_CHARACTERS",
        },
        type: "optional",
      },
      name: "THERE YOU GO",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
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
      cost: { exert: true },
      effect: {
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
        type: "conditional",
      },
      name: "CAPTIVE AUDIENCE",
      type: "activated",
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
      effect: {
        type: "cost-reduction",
      },
      name: "NOW IT'S A PARTY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowItsAParty),
    );

    // HOW'S PICKINGS? (triggered - draw/discard on play)
    const howsPickings = {
      effect: {
        effect: {
          type: "compound",
          effects: [],
        },
        type: "optional",
      },
      name: "HOW'S PICKINGS?",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
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
      keyword: "Resist",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Singer 4
    const singer: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
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
      effect: {
        effect: {
          type: "remove-damage",
          amount: "all",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "TELL NO TALES",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
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
      effect: {
        effect: {
          type: "compound",
          effects: [],
        },
        type: "optional",
      },
      name: "ENDURING LOYALTY",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
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
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
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
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "OUTFLANK",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
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
      effect: {
        effects: [],
        type: "compound",
      },
      name: "FOUND YOU, YOU LITTLE RASCAL",
      trigger: {
        event: "start-of-turn",
      },
      type: "triggered",
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
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      name: "HIDDEN AWAY",
      type: "static",
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
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "CLEAR SKIES, CLEAR SKIES",
      trigger: {
        event: "sing",
      },
      type: "triggered",
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
      effect: {
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          {
            type: "gain-keyword",
            keyword: "Bodyguard",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "compound",
      },
      type: "action",
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
      effect: {
        effects: [
          { type: "remove-damage", amount: 3, target: "CHOSEN_CHARACTER" },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
        type: "compound",
      },
      type: "action",
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
      effect: {
        amount: 5,
        type: "look-at-top",
      },
      type: "action",
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
      cost: { exert: true, ink: 1 },
      effect: {
        condition: {
          type: "character-count",
          count: 2,
          comparison: "greater-or-equal",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      name: "FINE DINING",
      type: "activated",
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
      effect: {
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      name: "PERFECT PAIR",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(perfectPair),
    );

    // SEARCH THE KINGDOM (activated - banish and exert to search)
    const searchTheKingdom = {
      cost: { banishSelf: true },
      effect: {
        cardType: "character",
        putInto: "hand",
        type: "search-deck",
      },
      name: "SEARCH THE KINGDOM",
      type: "activated",
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
      effect: {
        condition: {
          type: "have-character",
          classification: "Illusion",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      name: "UNTOLD TREASURE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
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
      cost: { ink: 7 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // ANCIENT RAGE (triggered - banish exerted opponent)
    const ancientRage = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "banish",
      },
      name: "ANCIENT RAGE",
      trigger: {
        event: "exert",
      },
      type: "triggered",
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
      keyword: "Challenger",
      type: "keyword",
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
      effect: {
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
        type: "conditional",
      },
      name: "I WIN",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      type: "triggered",
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
      keyword: "Vanish",
      type: "keyword",
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
      effect: {
        modifier: -3,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "FORMIDABLE GLARE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
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
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // BACK TO WORK (triggered - bounce and discard on banish in challenge)
    const backToWork = {
      effect: {
        effects: [],
        type: "compound",
      },
      name: "BACK TO WORK",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
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
      cost: { exert: true },
      effect: {
        effects: [],
        type: "compound",
      },
      name: "NO ORDINARY APPLE",
      type: "activated",
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
      effect: {
        effect: {
          type: "move-damage",
          amount: 2,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
        type: "optional",
      },
      name: "STARTLED SHRIEK",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
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
      effect: { effects: [], type: "compound" },
      type: "action",
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
      effect: { amount: 3, target: "EACH_PLAYER", type: "draw" },
      type: "action",
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
      effect: { effects: [], type: "compound" },
      type: "action",
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
      effect: {
        effect: { type: "banish", target: "CHOSEN_ITEM" },
        type: "optional",
      },
      name: "PILFER AND PLUNDER",
      trigger: { event: "play" },
      type: "triggered",
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
      effect: { amount: "all", type: "discard" },
      name: "WHAT A PITY",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const ifILoseMyTemper = {
      effect: { amount: 1, target: "PLAYED_CARD", type: "put-damage" },
      name: "IF I LOSE MY TEMPER...",
      trigger: { event: "play", on: "YOUR_OTHER_CHARACTERS" },
      type: "triggered",
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
      effect: { type: "cost-reduction" },
      name: "INNOVATE",
      type: "static",
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
      effect: { effect: { type: "compound", effects: [] }, type: "optional" },
      name: "HOW SHALL I DO IT?",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      effect: {
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
        type: "conditional",
      },
      name: "FULL PACK",
      type: "static",
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
      effect: {
        effect: { type: "return-to-hand", target: "CHOSEN_DAMAGED_CHARACTER" },
        type: "optional",
      },
      name: "ANOTHER RECITATION",
      trigger: { event: "quest", on: "SELF" },
      type: "triggered",
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
      effect: {
        condition: { type: "have-character", name: "Lady" },
        then: { type: "cost-reduction" },
        type: "conditional",
      },
      name: "HEY, PIDGE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heyPidge),
    );

    const noTimeForWisecracks = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "NO TIME FOR WISECRACKS",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      cost: { ink: 4 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const frightfulScheme = {
      effect: { effects: [], type: "compound" },
      name: "FRIGHTFUL SCHEME",
      type: "static",
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
      effect: { target: "CHOSEN_DAMAGED_CHARACTER", type: "return-to-hand" },
      type: "action",
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
      effect: { free: true, from: "hand", type: "play-card" },
      type: "action",
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
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "ROYAL PAIN",
      type: "static",
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
      effect: { amount: 1, type: "lose-lore" },
      name: "YOU ARE A DISGRACE!",
      trigger: { event: "challenge", on: "SELF" },
      type: "triggered",
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
      effect: {
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      name: "GET 'EM!",
      type: "static",
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
      effect: { amount: 1, type: "lose-lore" },
      name: "CRIME OF OPPORTUNITY",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      effect: { amount: 1, type: "gain-lore" },
      name: "A MARVELOUS PERFORMANCE",
      trigger: { event: "play" },
      type: "triggered",
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
      effect: { effects: [], type: "compound" },
      type: "action",
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
      effect: { target: "CHOSEN_CHARACTER", type: "banish" },
      type: "action",
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
      effect: {
        modifier: 2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "CRIMSON SPARK",
      trigger: { event: "put-into-inkwell" },
      type: "triggered",
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
      effect: { type: "cost-reduction" },
      name: "FIXED IN NO TIME",
      trigger: { event: "banish", on: "SELF" },
      type: "triggered",
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
      effect: { type: "cost-reduction" },
      name: "PUT IT TO GOOD USE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(putItToGoodUse),
    );

    const fortuneHunter = {
      effect: { amount: 4, type: "look-at-top" },
      name: "FORTUNE HUNTER",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      effect: { target: "ITEM_FROM_DISCARD", type: "return-to-hand" },
      name: "COOLEST COLLECTION",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(coolestCollection),
    );

    const imBeautifulBaby = {
      effect: {
        effect: { type: "play-card", from: "hand", free: true },
        type: "optional",
      },
      name: "I'M BEAUTIFUL, BABY!",
      trigger: { event: "quest", on: "SELF" },
      type: "triggered",
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
      effect: {
        effect: { type: "add-to-inkwell", target: "BANISHED_CHARACTER" },
        type: "optional",
      },
      name: "IN THE NICK OF TIME",
      trigger: { event: "banish" },
      type: "triggered",
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
      effect: {
        keyword: "Ward",
        type: "gain-keyword",
      },
      name: "OUR BOTTLE WORKED!",
      type: "static",
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
      effect: { type: "look" },
      type: "action",
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
      effect: { type: "optional" },
      name: "BRILLIANT SHINE",
      trigger: { event: "put-into-inkwell" },
      type: "triggered",
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
      effect: {
        keyword: "Resist",
        type: "gain-keyword",
        value: 1,
      },
      name: "A GREATER PURPOSE",
      trigger: { event: "put-into-inkwell" },
      type: "triggered",
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
      keyword: "Resist",
      type: "keyword",
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
      effect: { type: "conditional" },
      name: "MY ORDERS COME FROM JAFAR",
      trigger: { event: "play", on: "SELF" },
      type: "triggered",
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
      effect: {
        keyword: "Evasive",
        type: "gain-keyword",
      },
      name: "LOOKING FOR LUNCH",
      type: "static",
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
      effect: {
        keyword: "Evasive",
        type: "gain-keyword",
      },
      name: "WELCOME ABOARD, FOLKS",
      type: "static",
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
      effect: { type: "restriction" },
      type: "action",
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
      effect: { type: "optional" },
      name: "METALLIC FLOW",
      trigger: { event: "put-into-inkwell" },
      type: "triggered",
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
      cost: { exert: true, ink: 1 },
      effect: {
        keyword: "Challenger",
        type: "gain-keyword",
        value: 2,
      },
      name: "PRECISION STRIKE",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(precisionStrike),
    );
  });
});
