import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 010 Card Text Parser Tests", () => {
  it.skip("Baloo - Friend and Guardian: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: Support
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Gaston - Frightful Bully: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: TOP THAT! (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TOP THAT!",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Rapunzel - Ready for Adventure: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );

    // Second ability: ACT OF KINDNESS (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ACT OF KINDNESS",
        trigger: expect.objectContaining({
          event: "be-chosen",
          timing: "whenever",
        }),
      }),
    );
  });

  it.skip("Rajah - Devoted Protector: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("Eilonwy - Princess of Llyr: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Scrooge McDuck - On the Right Track: should parse card text", () => {
    const text =
      "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FABULOUS WEALTH (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FABULOUS WEALTH",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
        }),
      }),
    );
  });

  it.skip("Webby Vanderquack - Knowledge Seeker: should parse card text", () => {
    const text =
      "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'VE READ ABOUT THIS (static)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I'VE READ ABOUT THIS",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
        }),
      }),
    );
  });

  it.skip("Gurgi - Apple Lover: should parse card text", () => {
    const text =
      "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HAPPY DAY (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HAPPY DAY",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 2,
          upTo: true,
        }),
      }),
    );
  });

  it.skip("Mrs. Beakley - Former S.H.U.S.H. Agent: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("Shanti - Village Girl: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 5,
      }),
    );
  });

  it.skip("Flash - Records Specialist: should parse card text", () => {
    const text =
      "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HOLD... YOUR HORSES (static - enters play exerted)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "HOLD... YOUR HORSES",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "enters-play-exerted",
        }),
      }),
    );

    // Second ability: DEEP RESEARCH (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DEEP RESEARCH",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
        }),
      }),
    );
  });

  it.skip("Taran - Pig Keeper: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );

    // Second ability: FOLLOW THE PIG (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FOLLOW THE PIG",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Ariel - Ethereal Voice: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nCOMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: COMMAND PERFORMANCE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "COMMAND PERFORMANCE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Scrooge McDuck - Cavern Prospector: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Scrooge McDuck.)\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 4,
        }),
      }),
    );

    // Second ability: SPECULATION (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SPECULATION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
      }),
    );
  });

  it.skip("Mowgli - Man Cub: should parse card text", () => {
    const text =
      "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HAVE A BETTER LOOK (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HAVE A BETTER LOOK",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Simba - King in the Making: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nTIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 3,
      }),
    );

    // Second ability: TIMELY ALLIANCE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIMELY ALLIANCE",
        trigger: expect.objectContaining({
          timing: "whenever",
        }),
      }),
    );
  });

  it.skip("Goofy - Ghost Hunter: should parse card text", () => {
    const text =
      "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PERFECT TRAP (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PERFECT TRAP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
        }),
      }),
    );
  });

  it.skip("Della Duck - Returning Mother: should parse card text", () => {
    const text =
      "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HERE TO HELP (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HERE TO HELP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Amber Champion: should parse card text", () => {
    const text =
      "LEADING THE WAY Your other Amber characters get +2 {W}.\nFRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEADING THE WAY (static)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LEADING THE WAY",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "willpower",
          modifier: 2,
        }),
      }),
    );

    // Second ability: FRIENDLY CHORUS (static - conditional Singer 8)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FRIENDLY CHORUS",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Singer",
          value: 8,
        }),
      }),
    );
  });

  it.skip("Goofy - Galumphing Gumshoe: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // Second ability: HOT PURSUIT (triggered - dual trigger)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HOT PURSUIT",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
        }),
      }),
    );
  });

  it.skip("Gazelle - Ballad Singer: should parse card text", () => {
    const text =
      "Singer 7 (This character counts as cost 7 to sing songs.)\nCROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 7
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 7,
      }),
    );

    // Second ability: CROWD FAVORITE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CROWD FAVORITE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Search for Clues: should parse card text", () => {
    const text =
      "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Or Rewrite History!: should parse card text", () => {
    const text = "Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Della's Moon Lullaby: should parse card text", () => {
    const text =
      "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("The Horseman Strikes!: should parse card text", () => {
    const text = "Draw a card. You may banish chosen character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Recovered Page: should parse card text", () => {
    const text =
      "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.\nWHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WHAT IS TO COME (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT IS TO COME",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );

    // Second ability: WHISPERED POWER (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "WHISPERED POWER",
        cost: expect.objectContaining({
          ink: 1,
          banishSelf: true,
        }),
      }),
    );
  });

  it.skip("Webby's Diary: should parse card text", () => {
    const text =
      "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LATEST ENTRY (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LATEST ENTRY",
        trigger: expect.objectContaining({
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("The Black Cauldron: should parse card text", () => {
    const text =
      "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.\nRISE AND JOIN ME! {E}, 1 {I} – This turn, you may play characters from under this item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: THE CAULDRON CALLS (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THE CAULDRON CALLS",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
      }),
    );

    // Second ability: RISE AND JOIN ME! (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "RISE AND JOIN ME!",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
      }),
    );
  });

  it.skip("Munchings and Crunchings: should parse card text", () => {
    const text =
      "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WHAT A JUICY APPLE (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "WHAT A JUICY APPLE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 2,
          upTo: true,
        }),
      }),
    );

    // Second ability: COME ON OUT (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "COME ON OUT",
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Duckburg - Funso's Funzone: should parse card text", () => {
    const text =
      "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHERE FUN IS IN THE ZONE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHERE FUN IS IN THE ZONE",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Minnie Mouse - Amethyst Champion: should parse card text", () => {
    const text =
      "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL BALANCE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MYSTICAL BALANCE",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("The Horned King - Wicked Ruler: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named The Horned King.)\nARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 2,
        }),
      }),
    );

    // Second ability: ARISE! (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ARISE!",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
      }),
    );
  });

  it.skip("Gwythaint - Savage Hunter: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: SWOOPING STRIKE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SWOOPING STRIKE",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Demona - Betrayer of the Clan: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 2,
      }),
    );

    // Second ability: STONE BY DAY (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Magica De Spell - Shadowy and Sinister: should parse card text", () => {
    const text =
      "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DARK INCANTATION (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DARK INCANTATION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Lena Sabrewing - Mysterious Duck: should parse card text", () => {
    const text =
      "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ARCANE CONNECTION (triggered with condition)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ARCANE CONNECTION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Iago - Stompin' Mad: should parse card text", () => {
    const text =
      "Challenger +5 (While challenging, this character gets +5 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +5 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 5,
      }),
    );
  });

  it.skip("Violet Sabrewing - Senior Junior Woodchuck: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Elsa - Exploring the Unknown: should parse card text", () => {
    const text =
      "CLOSER LOOK When you play this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CLOSER LOOK (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CLOSER LOOK",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Duckworth - Ghost Butler: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nFINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: FINAL ACT (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FINAL ACT",
        trigger: expect.objectContaining({
          event: "banish",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Nibs - Lost Boy: should parse card text", () => {
    const text =
      "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LOOK WHO'S BACK (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOOK WHO'S BACK",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("The Horned King - Triumphant Ghoul: should parse card text", () => {
    const text =
      "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GRAND MACHINATIONS (static with condition)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "GRAND MACHINATIONS",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
        }),
      }),
    );
  });

  it.skip("Coldstone - Reincarnated Cyborg: should parse card text", () => {
    const text =
      "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THE CANTRIPS HAVE BEEN SPOKEN (triggered with condition)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THE CANTRIPS HAVE BEEN SPOKEN",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Magica De Spell - Spiteful Sorceress: should parse card text", () => {
    const text =
      "MYSTICAL MANIPULATION Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL MANIPULATION (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MYSTICAL MANIPULATION",
        trigger: expect.objectContaining({
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "move-damage",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Nana - Canine Caregiver: should parse card text", () => {
    const text =
      "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HELPFUL INSTINCTS (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HELPFUL INSTINCTS",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Magica De Spell - Conniving Sorceress: should parse card text", () => {
    const text =
      "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.)\nSHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 7
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 7,
        }),
      }),
    );

    // Second ability: SHADOW'S GRASP (triggered with condition)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHADOW'S GRASP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 4,
        }),
      }),
    );
  });

  it.skip("Demona - Scourge of the Wyvern Clan: should parse card text", () => {
    const text =
      "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: AD SAXUM COMMUTATE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AD SAXUM COMMUTATE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );

    // Second ability: STONE BY DAY (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Hades - Looking for a Deal: should parse card text", () => {
    const text =
      "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT D'YA SAY? (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT D'YA SAY?",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Olaf - Helping Hand: should parse card text", () => {
    const text =
      "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SECOND CHANCE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SECOND CHANCE",
        trigger: expect.objectContaining({
          event: "leave-play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Merlin - Completing His Research: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: LEGACY OF LEARNING (triggered with condition)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LEGACY OF LEARNING",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Ursula - Whisper of Vanessa: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nSLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: SLIPPERY SPELL (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SLIPPERY SPELL",
      }),
    );
  });

  it.skip("Cheshire Cat - Inexplicable: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: IT'S LOADS OF FUN (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IT'S LOADS OF FUN",
        trigger: expect.objectContaining({
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "move-damage",
        }),
      }),
    );
  });

  it.skip("Begone!: should parse card text", () => {
    const text =
      "Return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Can't Hold It Back Anymore: should parse card text", () => {
    const text =
      "Exert chosen opposing character. Move all damage counters from all other characters to that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Swooping Strike: should parse card text", () => {
    const text =
      "Each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Performance Review: should parse card text", () => {
    const text =
      "{E} chosen ready character of yours to draw cards equal to that character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Fragile as a Flower: should parse card text", () => {
    const text =
      "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Junior Woodchuck Guidebook: should parse card text", () => {
    const text =
      "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THE BOOK KNOWS EVERYTHING (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THE BOOK KNOWS EVERYTHING",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Grimorum Arcanorum: should parse card text", () => {
    const text =
      "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\nCELERITAS Your characters named Demona gain Rush. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: DOCTRINA ADDUCERE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DOCTRINA ADDUCERE",
        trigger: expect.objectContaining({
          event: "exert",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );

    // Second ability: CELERITAS (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CELERITAS",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Rush",
        }),
      }),
    );
  });

  it.skip("The Great Illuminary - Abandoned Laboratory: should parse card text", () => {
    const text =
      'STARTLING DISCOVERY Characters gain " {E} — Draw a card" while here.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLING DISCOVERY (static - grants ability)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STARTLING DISCOVERY",
      }),
    );
  });

  it.skip("Flotsam - Slippery as an Eel: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Kaa - Suspicious Serpent: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Webby Vanderquack - Mystery Enthusiast: should parse card text", () => {
    const text =
      "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONTAGIOUS ENERGY (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CONTAGIOUS ENERGY",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
        }),
      }),
    );
  });

  it.skip("Finnick - Tiny Terror: should parse card text", () => {
    const text =
      "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU BETTER RUN (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU BETTER RUN",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Vladimir - Ceramic Unicorn Fan: should parse card text", () => {
    const text =
      "HIGH STANDARDS Whenever this character quests, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIGH STANDARDS (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HIGH STANDARDS",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Flintheart Glomgold - Scheming Billionaire: should parse card text", () => {
    const text =
      "TRY ME While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TRY ME (static - conditional Ward)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TRY ME",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Ward",
        }),
      }),
    );
  });

  it.skip("Jetsam - Opportunistic Eel: should parse card text", () => {
    const text =
      "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // AMBUSH FROM THE DEEP (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AMBUSH FROM THE DEEP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 3,
        }),
      }),
    );
  });

  it.skip("Kaa - Secretive Snake: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Emily Quackfaster - Level-Headed Librarian: should parse card text", () => {
    const text =
      "RECOMMENDED READING When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // RECOMMENDED READING (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RECOMMENDED READING",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Flynn Rider - Spectral Scoundrel: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)\nI'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: I'LL TAKE THAT (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I'LL TAKE THAT",
      }),
    );
  });

  it.skip("Bellwether - Master Manipulator: should parse card text", () => {
    const text =
      "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // VENDETTA (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "VENDETTA",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-damage",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Launchpad - Exceptional Pilot: should parse card text", () => {
    const text =
      "OFF THE MAP When you play this character, you may banish chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OFF THE MAP (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OFF THE MAP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Baloo - Carefree Bear: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Baloo.)\nROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Second ability: ROLL WITH IT (triggered - modal)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROLL WITH IT",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Megara - Secret Keeper: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: I'LL BE FINE (static - grants triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I'LL BE FINE",
      }),
    );
  });

  it.skip("Goldie O'Gilt - Cunning Prospector: should parse card text", () => {
    const text =
      "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CLAIM JUMPER (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CLAIM JUMPER",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );

    // Second ability: STRIKE GOLD (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STRIKE GOLD",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Shere Khan - Fearsome Tiger: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: ON THE HUNT (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ON THE HUNT",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("Scrooge McDuck - S.H.U.S.H. Agent: should parse card text", () => {
    const text =
      "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.\nON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BACKUP PLAN (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BACKUP PLAN",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );

    // Second ability: ON THE MOVE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ON THE MOVE",
        trigger: expect.objectContaining({
          event: "challenged",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Akela - Forest Runner: should parse card text", () => {
    const text =
      "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // AHEAD OF THE PACK (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "AHEAD OF THE PACK",
        cost: expect.objectContaining({
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
        }),
      }),
    );
  });

  it.skip("Goofy - Emerald Champion: should parse card text", () => {
    const text =
      "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.\nPROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVEN THE SCORE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EVEN THE SCORE",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );

    // Second ability: PROVIDE COVER (static)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PROVIDE COVER",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Ward",
        }),
      }),
    );
  });

  it.skip("Little John - Impermanent Outlaw: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 3,
      }),
    );

    // Second ability: READY TO RASSLE (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "READY TO RASSLE",
        trigger: expect.objectContaining({
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Webby Vanderquack - Junior Prospector: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 2,
        }),
      }),
    );

    // Second ability: Ward
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Third ability: WORK SMARTER (triggered)
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WORK SMARTER",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
      }),
    );
  });

  it.skip("So Be It!: should parse card text", () => {
    const text =
      "Each of your characters gets +1 {S} this turn. You may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound effect)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Trust In Me: should parse card text", () => {
    const text =
      "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (modal)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
      }),
    );
  });

  it.skip("Chomp!: should parse card text", () => {
    const text = "Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Malicious, Mean, and Scary: should parse card text", () => {
    const text = "Put 1 damage counter on each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "put-damage",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Potion of Malice: should parse card text", () => {
    const text =
      "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUPPRESSED ANGER (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SUPPRESSED ANGER",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "put-damage",
          amount: 1,
        }),
      }),
    );

    // Second ability: MINDLESS RAGE (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "MINDLESS RAGE",
        cost: expect.objectContaining({
          exert: true,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Reckless",
        }),
      }),
    );
  });

  it.skip("Inscrutable Map: should parse card text", () => {
    const text =
      "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BACKTRACK (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BACKTRACK",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: -1,
        }),
      }),
    );
  });

  it.skip("Enigmatic Inkcaster: should parse card text", () => {
    const text =
      "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ITS OWN REWARD (activated with condition)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "ITS OWN REWARD",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Blessed Bagpipes: should parse card text", () => {
    const text =
      "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MCDUCK HEIRLOOM (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MCDUCK HEIRLOOM",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
      }),
    );

    // Second ability: BATTLE ANTHEM (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BATTLE ANTHEM",
        trigger: expect.objectContaining({
          event: "challenged",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("White Agony Plains - Golden Lagoon: should parse card text", () => {
    const text =
      "PURE LIQUID GOLD This location gets +1 {L} for each character here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PURE LIQUID GOLD (static)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PURE LIQUID GOLD",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
        }),
      }),
    );
  });

  it.skip("Ares - God of War: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.) CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Reckless
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );

    // Second ability: CALL TO BATTLE (triggered - once per turn)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CALL TO BATTLE",
        trigger: expect.objectContaining({
          event: "put-card-under",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Peter Pan - High Flyer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Raksha - Fearless Mother: should parse card text", () => {
    const text =
      "ON PATROL Once during your turn, you may pay 1 {I} less to move this character to a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON PATROL (static - cost reduction)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ON PATROL",
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Rama - Vigilant Father: should parse card text", () => {
    const text =
      "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECTION OF THE PACK (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PROTECTION OF THE PACK",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Mother Gothel - Underhanded Schemer: should parse card text", () => {
    const text =
      "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SOMEBODY'S GOT TO USE IT (static - conditional modifier)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SOMEBODY'S GOT TO USE IT",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
        }),
      }),
    );
  });

  it.skip("Hermes - Harried Messenger: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Beast - Aggressive Lord: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: THAT'S MINE (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THAT'S MINE",
        trigger: expect.objectContaining({
          event: "challenge",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Bronx - Ferocious Beast: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Reckless
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Tinker Bell - Temperamental Fairy: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Second ability: HARMLESS DIVERSION (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HARMLESS DIVERSION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("David Xanatos - Charismatic Leader: should parse card text", () => {
    const text =
      "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEARN FROM EVERYTHING (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LEARN FROM EVERYTHING",
        trigger: expect.objectContaining({
          event: "banish",
          timing: "whenever",
          on: "YOUR_CHARACTERS",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );

    // Second ability: WHAT ARE YOU WAITING FOR? (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT ARE YOU WAITING FOR?",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Rush",
        }),
      }),
    );
  });

  it.skip("Hans - Brazen Manipulator: should parse card text", () => {
    const text =
      "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: JOSTLING FOR POWER (static - restriction)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "JOSTLING FOR POWER",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-quest",
        }),
      }),
    );

    // Second ability: GROWING INFLUENCE (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GROWING INFLUENCE",
        trigger: expect.objectContaining({
          event: "start-of-turn",
          timing: "at",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Hercules - Mighty Leader: should parse card text", () => {
    const text =
      "EVER VIGILANT This character can't be dealt damage unless he's being challenged.\nEVER VALIANT While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVER VIGILANT (static - damage protection)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "EVER VIGILANT",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-be-dealt-damage",
        }),
      }),
    );

    // Second ability: EVER VALIANT (static - conditional protection)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "EVER VALIANT",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-be-dealt-damage",
        }),
      }),
    );
  });

  it.skip("Goliath - Guardian of Castle Wyvern: should parse card text", () => {
    const text =
      "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BE CAREFUL, ALL OF YOU (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BE CAREFUL, ALL OF YOU",
        trigger: expect.objectContaining({
          event: "challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Brooklyn - Second in Command: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Donald Duck - Ruby Champion: should parse card text", () => {
    const text =
      "HIGH ENERGY Your other Ruby characters get +1 {S}.\nPOWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HIGH ENERGY (static - modifier)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "HIGH ENERGY",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
        }),
      }),
    );

    // Second ability: POWERFUL REWARD (static - conditional modifier)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "POWERFUL REWARD",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
        }),
      }),
    );
  });

  it.skip("Elisa Maza - Intrepid Investigator: should parse card text", () => {
    const text =
      "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SPECIAL DETAIL (static - conditional modifier)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SPECIAL DETAIL",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
        }),
      }),
    );
  });

  it.skip("Aladdin - Barreling Through: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nReckless (This character can't quest and must challenge each turn if able.)\nONLY THE BOLD While there's a card under this character, your characters with Reckless gain \"{E} — Gain 1 lore.\"";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: Reckless
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );

    // Third ability: ONLY THE BOLD (static - grants ability)
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ONLY THE BOLD",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );
  });

  it.skip("Lady Tremaine - Sinister Socialite: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: EXPEDIENT SCHEMES (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EXPEDIENT SCHEMES",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("The Headless Horseman - Terror of Sleepy Hollow: should parse card text", () => {
    const text =
      "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LEAVES NO TRACE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LEAVES NO TRACE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );

    // Second ability: GATHERING STRENGTH (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GATHERING STRENGTH",
        trigger: expect.objectContaining({
          event: "banish",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
        }),
      }),
    );
  });

  it.skip("Mulan - Standing Her Ground: should parse card text", () => {
    const text =
      "FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FLOWING BLADE (static - conditional protection)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FLOWING BLADE",
        effect: expect.objectContaining({
          type: "grant-ability",
          ability: "takes-no-damage-from-challenges",
        }),
      }),
    );
  });

  it.skip("Brom Bones - Burly Bully: should parse card text", () => {
    const text =
      "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ROUGH AND TUMBLE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROUGH AND TUMBLE",
        trigger: expect.objectContaining({
          event: "challenge",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "lose-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Shere Khan - Fierce and Furious: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Shere Khan.)\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // Second ability: WILD RAGE (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "WILD RAGE",
        cost: expect.objectContaining({
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Next Stop, Olympus: should parse card text", () => {
    const text =
      "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.\nReady chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: ready + restriction + delayed trigger)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Get to Safety!: should parse card text", () => {
    const text =
      "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (play + conditional draw)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Time to Go!: should parse card text", () => {
    const text =
      "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (banish + draw with conditional bonus)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Ghostly Tale: should parse card text", () => {
    const text = "Exert all opposing characters with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (exert all with filter)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Dragon Fire: should parse card text", () => {
    const text = "Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (banish)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Mushu's Rocket: should parse card text", () => {
    const text =
      "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I NEED FIREPOWER (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I NEED FIREPOWER",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Rush",
        }),
      }),
    );

    // Second ability: HITCH A RIDE (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "HITCH A RIDE",
        cost: expect.objectContaining({
          ink: 2,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Rush",
        }),
      }),
    );
  });

  it.skip("The Bitterwood - Underground Forest: should parse card text", () => {
    const text =
      "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GATHER RESOURCES (triggered - once per turn)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GATHER RESOURCES",
        trigger: expect.objectContaining({
          event: "move",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Sleepy Hollow - The Bridge: should parse card text", () => {
    const text =
      "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HEAD FOR THE BRIDGE! (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HEAD FOR THE BRIDGE!",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Judy Hopps - On the Case: should parse card text", () => {
    const text =
      "HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIDDEN CLUES (triggered - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HIDDEN CLUES",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Hen Wen - Prophetic Pig: should parse card text", () => {
    const text =
      "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FUTURE SIGHT (triggered - scry)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FUTURE SIGHT",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Anna - Making Snow Plans: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Daisy Duck - Ghost Finder: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Cri-Kee - Good Luck Charm: should parse card text", () => {
    const text = "Alert (This character can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Alert keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Alert",
      }),
    );
  });

  it.skip("Rapunzel - Creative Captor: should parse card text", () => {
    const text =
      "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENSNARL (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ENSNARL",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -3,
        }),
      }),
    );
  });

  it.skip("Fergus McDuck - Scrooge's Father: should parse card text", () => {
    const text =
      "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TOUGHEN UP (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TOUGHEN UP",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Ward",
        }),
      }),
    );
  });

  it.skip("Scuttle - Birdbrained: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Ichabod Crane - Bookish Schoolmaster: should parse card text", () => {
    const text =
      "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WELL-READ (triggered - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WELL-READ",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Jasmine - Soothing Princess: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nUPLIFTING AURA Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: UPLIFTING AURA (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "UPLIFTING AURA",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Judy Hopps - Lead Detective: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Judy Hopps.)\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 4,
        }),
      }),
    );

    // Second ability: LATERAL THINKING (static - grants keywords)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LATERAL THINKING",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Ichabod Crane - Scared Out of His Mind: should parse card text", () => {
    const text =
      "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CHILLING TALE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CHILLING TALE",
        trigger: expect.objectContaining({
          event: "banish",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Scar - Eerily Prepared: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: SURVIVAL OF THE FITTEST (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SURVIVAL OF THE FITTEST",
        trigger: expect.objectContaining({
          event: "put-card-under",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -5,
        }),
      }),
    );
  });

  it.skip("Daisy Duck - Paranormal Investigator: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Daisy Duck.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 4,
        }),
      }),
    );

    // Second ability: Support
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );

    // Third ability: STRANGE HAPPENINGS (static - conditional)
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STRANGE HAPPENINGS",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "enters-play-exerted",
        }),
      }),
    );
  });

  it.skip("Cinderella - Dream Come True: should parse card text", () => {
    const text =
      "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHATEVER YOU WISH FOR (triggered - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHATEVER YOU WISH FOR",
        trigger: expect.objectContaining({
          event: "end-of-turn",
          timing: "at",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Judy Hopps - Uncovering Clues: should parse card text", () => {
    const text =
      "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THOROUGH INVESTIGATION (triggered - dual trigger)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THOROUGH INVESTIGATION",
        trigger: expect.objectContaining({
          timing: "when",
        }),
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Pluto - Clever Cluefinder: should parse card text", () => {
    const text =
      "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ON THE TRAIL (activated - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "ON THE TRAIL",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Daisy Duck - Sapphire Champion: should parse card text", () => {
    const text =
      "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nLOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: STAND FAST (static - grants keyword)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STAND FAST",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
        }),
      }),
    );

    // Second ability: LOOK AHEAD (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOOK AHEAD",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Kristoff - Mining the Ruins: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nWORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: WORTH MINING (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WORTH MINING",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Detective: should parse card text", () => {
    const text =
      "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GET A CLUE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GET A CLUE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Hen Wen's Visions: should parse card text", () => {
    const text =
      "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (look at top + rearrange)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Promising Lead: should parse card text", () => {
    const text =
      "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: modify stat + grant keyword)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Might Solve a Mystery: should parse card text", () => {
    const text =
      "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (look at top + put into hand)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Sudden Scare: should parse card text", () => {
    const text =
      "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: put into inkwell + opponent inkwell)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Spooky Sight: should parse card text", () => {
    const text =
      "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (put into inkwell with filter)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Detective's Badge: should parse card text", () => {
    const text =
      "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECT AND SERVE (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "PROTECT AND SERVE",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Ink Amplifier: should parse card text", () => {
    const text =
      "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENERGY CAPTURE (triggered - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ENERGY CAPTURE",
        trigger: expect.objectContaining({
          event: "draw",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Fairy Godmother's Wand: should parse card text", () => {
    const text =
      "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ONLY TILL MIDNIGHT (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ONLY TILL MIDNIGHT",
        trigger: expect.objectContaining({
          event: "put-into-inkwell",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Ward",
        }),
      }),
    );
  });

  it.skip("Inkrunner: should parse card text", () => {
    const text =
      "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: PREFLIGHT CHECK (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PREFLIGHT CHECK",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );

    // Second ability: READY TO RIDE (activated)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "READY TO RIDE",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Alert",
        }),
      }),
    );
  });

  it.skip("Castle of the Horned King - Bastion of Evil: should parse card text", () => {
    const text =
      "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // INTO THE GLOOM (triggered - once per turn)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "INTO THE GLOOM",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Robin Hood - Ephemeral Archer: should parse card text", () => {
    const text =
      "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 1,
      }),
    );

    // Second ability: EXPERT SHOT (triggered - conditional)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EXPERT SHOT",
        trigger: expect.objectContaining({
          event: "quest",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Donald Duck - Ghost Hunter: should parse card text", () => {
    const text =
      "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // RAISE A RUCKUS (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RAISE A RUCKUS",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Challenger",
          value: 2,
        }),
      }),
    );
  });

  it.skip("Goliath - Clan Leader: should parse card text", () => {
    const text =
      "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: DUSK TO DAWN (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DUSK TO DAWN",
        trigger: expect.objectContaining({
          event: "end-of-turn",
          timing: "at",
        }),
        effect: expect.objectContaining({
          type: "draw-until-hand-size",
          size: 2,
        }),
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("The Headless Horseman - Cursed Rider: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named The Headless Horseman.)\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // Second ability: WITCHING HOUR (triggered - complex)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WITCHING HOUR",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Clawhauser - Donut Detective: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +2 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 2,
      }),
    );
  });

  it.skip("Francine - Eyeing the Evidence: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 1,
      }),
    );
  });

  it.skip("Inspector Tezuka - Resolute Officer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("Basil - Tenacious Mouse: should parse card text", () => {
    const text =
      "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HOLD YOUR GROUND (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HOLD YOUR GROUND",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
        }),
      }),
    );
  });

  it.skip("Hudson - Determined Reader: should parse card text", () => {
    const text =
      "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FINDING ANSWERS (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FINDING ANSWERS",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Minnie Mouse - Ghost Hunter: should parse card text", () => {
    const text =
      "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEARCH THE SHADOWS (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SEARCH THE SHADOWS",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Alert",
        }),
      }),
    );
  });

  it.skip("Lexington - Small in Stature: should parse card text", () => {
    const text =
      "Alert (This character can challenge as if they had Evasive.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Alert
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Alert",
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("David Xanatos - Steel Clan Leader: should parse card text", () => {
    const text =
      "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MINOR INCONVENIENCE (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MINOR INCONVENIENCE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Chief Bogo - Calling the Shots: should parse card text", () => {
    const text =
      "MY JURISDICTION During your turn, this character can't be dealt damage.\nDEPUTIZE Your other characters gain the Detective classification.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MY JURISDICTION (static - conditional protection)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "MY JURISDICTION",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-be-dealt-damage",
        }),
      }),
    );

    // Second ability: DEPUTIZE (static - grants classification)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "DEPUTIZE",
        effect: expect.objectContaining({
          type: "property-modification",
        }),
      }),
    );
  });

  it.skip("The Twins - Lost Boys: should parse card text", () => {
    const text =
      "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TWO FOR ONE (triggered - conditional)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TWO FOR ONE",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Nick Wilde - Persistent Investigator: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Nick Wilde.)\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Second ability: CASE CLOSED (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CASE CLOSED",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Prince Charming - Protector of the Realm: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nPROTECTIVE PRESENCE Each turn, only one character can challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: PROTECTIVE PRESENCE (static - restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PROTECTIVE PRESENCE",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Broadway - Sturdy and Strong: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: STONE BY DAY (static - conditional restriction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STONE BY DAY",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-ready",
        }),
      }),
    );
  });

  it.skip("Pluto - Steel Champion: should parse card text", () => {
    const text =
      "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WINNER TAKE ALL (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WINNER TAKE ALL",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );

    // Second ability: MAKE ROOM (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MAKE ROOM",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Fairy Godmother - Magical Benefactor: should parse card text", () => {
    const text =
      "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nSTUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 3,
      }),
    );

    // Second ability: STUNNING TRANSFORMATION (triggered - complex)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STUNNING TRANSFORMATION",
        trigger: expect.objectContaining({
          event: "put-card-under",
          timing: "whenever",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Zeus - Missing His Spark: should parse card text", () => {
    const text =
      "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nI NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Boost 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Boost",
        value: 2,
      }),
    );

    // Second ability: I NEED MORE THUNDERBOLTS! (static - conditional modifier)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I NEED MORE THUNDERBOLTS!",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("The Headless Horseman - Relentless Spirit: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("But I'm Much Faster: should parse card text", () => {
    const text =
      "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: gain Alert + gain Challenger)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("Putting It All Together: should parse card text", () => {
    const text =
      "Chosen opposing character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: restriction + draw)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("He Hurled His Thunderbolt: should parse card text", () => {
    const text =
      "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: deal damage + gain keyword)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("The Game's Afoot!: should parse card text", () => {
    const text =
      "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability (compound: move + gain keyword)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });

  it.skip("The Robot Queen: should parse card text", () => {
    const text =
      "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAJOR MALFUNCTION (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MAJOR MALFUNCTION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("The Sword of Hercules: should parse card text", () => {
    const text =
      "MIGHTY HIT When you play this item, banish chosen opposing Deity character.\nHAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: MIGHTY HIT (triggered)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MIGHTY HIT",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );

    // Second ability: HAND-TO-HAND (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HAND-TO-HAND",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          timing: "whenever",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Ingenious Device: should parse card text", () => {
    const text =
      "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.\nTIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SURPRISE PACKAGE (activated)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SURPRISE PACKAGE",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );

    // Second ability: TIME GROWS SHORT (triggered)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIME GROWS SHORT",
        trigger: expect.objectContaining({
          event: "banish",
          timing: "when",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 3,
        }),
      }),
    );
  });

  it.skip("Illuminary Tunnels - Linked Caverns: should parse card text", () => {
    const text =
      "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.\nLOCUS While you have a character here, you pay 1 {I} less to play locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUBTERRANEAN NETWORK (static - conditional modifier)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SUBTERRANEAN NETWORK",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
        }),
      }),
    );

    // Second ability: LOCUS (static - cost reduction)
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LOCUS",
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Zootopia - Police Headquarters: should parse card text", () => {
    const text =
      "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NEW INFORMATION (triggered - once per turn)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NEW INFORMATION",
        trigger: expect.objectContaining({
          event: "play",
          timing: "when",
        }),
        effect: expect.objectContaining({
          type: "draw",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Castle Wyvern - Above the Clouds: should parse card text", () => {
    const text =
      "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PROTECT THIS CASTLE (static - grants keywords)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PROTECT THIS CASTLE",
        effect: expect.objectContaining({
          type: "compound",
        }),
      }),
    );
  });
});
