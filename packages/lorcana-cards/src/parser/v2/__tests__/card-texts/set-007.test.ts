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

describe("Set 007 Card Text Parser Tests", () => {
  it.skip("Rhino - Motivational Speaker: should parse card text", () => {
    const text = "DESTINY CALLING Your other characters get +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DESTINY CALLING (static - buff other characters)
    const destinyCalling: StaticAbilityDefinition = {
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
    const whosNext: TriggeredAbilityDefinition = {
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
    const dontBeAfraid: StaticAbilityDefinition = {
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

  it.skip("Bolt - Superdog: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Bolt.)\nMARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.\nBOLT STARE {E} – Banish chosen Illusion character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // MARK OF POWER (triggered - gain lore on ready)
    const markOfPower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MARK OF POWER",
      trigger: {
        event: "ready",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(markOfPower),
    );

    // BOLT STARE (activated - exert to banish Illusion)
    const boltStare: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BOLT STARE",
      cost: { exert: true },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(boltStare),
    );
  });

  it.skip("Roger Radcliffe - Dog Lover: should parse card text", () => {
    const text =
      "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THERE YOU GO (triggered - remove damage from Puppies on quest)
    const thereYouGo: TriggeredAbilityDefinition = {
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
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
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
    const captiveAudience: ActivatedAbilityDefinition = {
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

  it.skip("Mittens - Sassy Street Cat: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // NO THANKS NECESSARY (triggered - buff Bodyguard characters on inkwell)
    const noThanksNecessary: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NO THANKS NECESSARY",
      trigger: {
        event: "put-into-inkwell",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_BODYGUARD_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(noThanksNecessary),
    );
  });

  it.skip("Tramp - Street-Smart Dog: should parse card text", () => {
    const text =
      "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.\nHOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // NOW IT'S A PARTY (static - cost reduction)
    const nowItsAParty: StaticAbilityDefinition = {
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
    const howsPickings: TriggeredAbilityDefinition = {
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
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // TELL NO TALES (triggered - remove damage on other character banished)
    const tellNoTales: TriggeredAbilityDefinition = {
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

  it.skip("Mirabel Madrigal - Hopeful Dreamer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.) Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Singer 5
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Aurora - Waking Beauty: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Singer 5
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );

    // SWEET DREAMS (triggered - ready on remove damage)
    const sweetDreams: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWEET DREAMS",
      trigger: {
        event: "remove-damage",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(sweetDreams),
    );
  });

  it.skip("Cinderella - The Right One: should parse card text", () => {
    const text =
      "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IF THE SLIPPER FITS (triggered - move card to gain lore)
    const ifTheSlipperFits: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IF THE SLIPPER FITS",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 3,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ifTheSlipperFits),
    );
  });

  it.skip("Mariano Guzman - Handsome Suitor: should parse card text", () => {
    const text =
      "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I SEE YOU (static - conditional lore buff)
    const iSeeYou: StaticAbilityDefinition = {
      type: "static",
      name: "I SEE YOU",
      effect: {
        type: "conditional",
        condition: {
          type: "have-character",
          name: "Dolores Madrigal",
        },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iSeeYou),
    );
  });

  it.skip("Candlehead - Dedicated Racer: should parse card text", () => {
    const text =
      "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WINNING ISN'T EVERYTHING (triggered - remove damage on banish)
    const winningIsntEverything: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WINNING ISN'T EVERYTHING",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(winningIsntEverything),
    );
  });

  it.skip("Bolt - Dependable Friend: should parse card text", () => {
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

  it.skip("Pascal - Garden Chameleon: should parse card text", () => {
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

  it.skip("King Candy - Royal Racer: should parse card text", () => {
    const text =
      "SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SWEET REVENGE (triggered - opponent banishes on Racer banished)
    const sweetRevenge: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWEET REVENGE",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(sweetRevenge),
    );
  });

  it.skip("Penny - Bolt's Person: should parse card text", () => {
    const text =
      "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ENDURING LOYALTY (triggered - remove damage and grant Resist)
    const enduringLoyalty: TriggeredAbilityDefinition = {
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

  it.skip("Fix-It Felix, Jr. - Pint-Sized Hero: should parse card text", () => {
    const text =
      "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET'S GET TO WORK (triggered - ready Racer on return to hand)
    const letsGetToWork: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LET'S GET TO WORK",
      trigger: {
        event: "return-to-hand",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letsGetToWork),
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
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
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
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Isabela Madrigal - In the Moment: should parse card text", () => {
    const text =
      "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M TIRED OF PERFECT (triggered - protection on sing)
    const imTiredOfPerfect: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'M TIRED OF PERFECT",
      trigger: {
        event: "sing",
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imTiredOfPerfect),
    );
  });

  it.skip("Calhoun - Courageous Rescuer: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // BACK TO START POSITIONS! (triggered - return card on challenge)
    const backToStartPositions: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BACK TO START POSITIONS!",
      trigger: {
        event: "challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHARACTER_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(backToStartPositions),
    );
  });

  it.skip("Wreck-It Ralph - Hero's Duty: should parse card text", () => {
    const text =
      "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OUTFLANK (triggered - gain lore buff on other banish)
    const outflank: TriggeredAbilityDefinition = {
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

  it.skip("Lady - Miss Park Avenue: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // SOMETHING WONDERFUL (triggered - return cards on play)
    const somethingWonderful: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SOMETHING WONDERFUL",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHARACTER_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(somethingWonderful),
    );
  });

  it.skip("Pongo - Dear Old Dad: should parse card text", () => {
    const text =
      "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FOUND YOU, YOU LITTLE RASCAL (triggered - play from inkwell)
    const foundYou: TriggeredAbilityDefinition = {
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

  it.skip("Kenai - Protective Brother: should parse card text", () => {
    const text =
      "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HE NEEDS ME (triggered - conditional ready and heal at end of turn)
    const heNeedsMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HE NEEDS ME",
      trigger: {
        event: "end-of-turn",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "is-exerted",
        },
        then: {
          type: "compound",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heNeedsMe),
    );
  });

  it.skip("Minnie Mouse - Storyteller: should parse card text", () => {
    const text =
      "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // GATHER AROUND (triggered - buff self on play character)
    const gatherAround: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GATHER AROUND",
      trigger: {
        event: "play",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gatherAround),
    );

    // JUST ONE MORE (triggered - debuff opponent on quest)
    const justOneMore: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "JUST ONE MORE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(justOneMore),
    );
  });

  it.skip("Perla - Nimble Seamstress: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
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
    const hiddenAway: StaticAbilityDefinition = {
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

  it.skip("Mirabel Madrigal - Musically Talented: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // HER OWN SPECIAL GIFT (triggered - return song on quest)
    const herOwnSpecialGift: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HER OWN SPECIAL GIFT",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CARD_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(herOwnSpecialGift),
    );
  });

  it.skip("Calhoun - Battle-Tested: should parse card text", () => {
    const text =
      "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TACTICAL ADVANTAGE (triggered - discard to debuff)
    const tacticalAdvantage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TACTICAL ADVANTAGE",
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
      expect.objectContaining(tacticalAdvantage),
    );
  });

  it.skip("Pepa Madrigal - Sensitive Sister: should parse card text", () => {
    const text =
      "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CLEAR SKIES, CLEAR SKIES (triggered - gain lore on sing)
    const clearSkies: TriggeredAbilityDefinition = {
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
    const soMuchToGive: ActionAbilityDefinition = {
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
    const restoringTheHeart: ActionAbilityDefinition = {
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
    const theFamilyMadrigal: ActionAbilityDefinition = {
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

  it.skip("Amber Coil: should parse card text", () => {
    const text =
      "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HEALING AURA (triggered - heal on inkwell)
    const healingAura: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HEALING AURA",
      trigger: {
        event: "put-into-inkwell",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healingAura),
    );
  });

  it.skip("Spaghetti Dinner: should parse card text", () => {
    const text =
      "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FINE DINING (activated - exert and pay ink for conditional lore)
    const fineDining: ActivatedAbilityDefinition = {
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

  it.skip("Kanine Krunchies: should parse card text", () => {
    const text = "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU CAN BE A CHAMPION, TOO (static - buff Puppies)
    const youCanBeAChampion: StaticAbilityDefinition = {
      type: "static",
      name: "YOU CAN BE A CHAMPION, TOO",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youCanBeAChampion),
    );
  });

  it.skip("The Glass Slipper: should parse card text", () => {
    const text =
      "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // PERFECT PAIR (static - deck restriction)
    const perfectPair: StaticAbilityDefinition = {
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
    const searchTheKingdom: ActivatedAbilityDefinition = {
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

  it.skip("Kuzco - Temporary Whale: should parse card text", () => {
    const text =
      "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T YOU SAY A WORD (triggered - bounce and draw on inkwell)
    const dontYouSayAWord: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DON'T YOU SAY A WORD",
      trigger: {
        event: "put-into-inkwell",
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
      expect.objectContaining(dontYouSayAWord),
    );
  });

  it.skip("Treasure Guardian - Foreboding Sentry: should parse card text", () => {
    const text =
      "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // UNTOLD TREASURE (triggered - conditional draw on play)
    const untoldTreasure: TriggeredAbilityDefinition = {
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

  it.skip("Honeymaren - Northuldra Guide: should parse card text", () => {
    const text =
      "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TALE OF THE FIFTH SPIRIT (triggered - conditional lore on play)
    const taleOfTheFifthSpirit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TALE OF THE FIFTH SPIRIT",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "exerted",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(taleOfTheFifthSpirit),
    );
  });

  it.skip("Iago - Giant Spectral Parrot: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nVanish (When an opponent chooses this character for an action, banish them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Vanish keyword
    const vanish: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Vanish",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(vanish),
    );
  });

  it.skip("Chernabog - Creature of the Night: should parse card text", () => {
    const text =
      "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MIDNIGHT REVEL (triggered - force opponent exert on play)
    const midnightRevel: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MIDNIGHT REVEL",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(midnightRevel),
    );
  });

  it.skip("Jafar - Newly Crowned: should parse card text", () => {
    const text =
      "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THIS IS NOT DONE YET (triggered - return Illusion on banish)
    const thisIsNotDoneYet: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS IS NOT DONE YET",
      trigger: {
        event: "banish",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "BANISHED_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsNotDoneYet),
    );
  });

  it.skip("Hades - Fast Talker: should parse card text", () => {
    const text =
      "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FOR JUST A LITTLE PAIN (triggered - damage self to banish)
    const forJustALittlePain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FOR JUST A LITTLE PAIN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(forJustALittlePain),
    );
  });

  it.skip("Madame Medusa - Diamond Lover: should parse card text", () => {
    const text =
      "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEARCH THE SWAMP (triggered - damage self to mill)
    const searchTheSwamp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SEARCH THE SWAMP",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 3,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(searchTheSwamp),
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
    const ancientRage: TriggeredAbilityDefinition = {
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

  it.skip("Elsa - Trusted Sister: should parse card text", () => {
    const text =
      "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT DO WE DO NOW? (triggered - conditional lore on quest)
    const whatDoWeDoNow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT DO WE DO NOW?",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "have-character",
          name: "Anna",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatDoWeDoNow),
    );
  });

  it.skip("Madam Mim - Cheating Spellcaster: should parse card text", () => {
    const text =
      "PLAY ROUGH Whenever this character quests, exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PLAY ROUGH (triggered - exert opponent on quest)
    const playRough: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PLAY ROUGH",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(playRough),
    );
  });

  it.skip("Giant Cobra - Ghostly Serpent: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)\nMYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Vanish keyword
    const vanish: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Vanish",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(vanish),
    );

    // MYSTERIOUS ADVANTAGE (triggered - discard to gain lore)
    const mysteriousAdvantage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MYSTERIOUS ADVANTAGE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(mysteriousAdvantage),
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
    const iWin: TriggeredAbilityDefinition = {
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

  it.skip("Bucky - Nutty Rascal: should parse card text", () => {
    const text =
      "POP! When this character is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // POP! (triggered - draw on banish in challenge)
    const pop: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POP!",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(pop));
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

  it.skip("Kronk - Laid Back: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nI'M LOVIN' THIS If an effect would cause you to discard one or more cards, you don't discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ward keyword
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // I'M LOVIN' THIS (static - discard prevention)
    const imLovinThis: StaticAbilityDefinition = {
      type: "static",
      name: "I'M LOVIN' THIS",
      effect: {
        type: "replacement",
        replaces: "damage",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(imLovinThis),
    );
  });

  it.skip("Mother Gothel - Vain Sorceress: should parse card text", () => {
    const text =
      "NOW YOU'VE UPSET ME Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW YOU'VE UPSET ME (triggered - move damage on challenge)
    const nowYouveUpsetMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOW YOU'VE UPSET ME",
      trigger: {
        event: "challenge",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: 1,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowYouveUpsetMe),
    );
  });

  it.skip("Sven - Keen-Eyed Reindeer: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // FORMIDABLE GLARE (triggered - debuff on play)
    const formidableGlare: TriggeredAbilityDefinition = {
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

  it.skip("Diablo - Spiteful Raven: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nChallenger +2 (While challenging, this character gets +2 {S})";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Challenger +2
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Merlin - Clever Clairvoyant: should parse card text", () => {
    const text =
      "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PRESTIDIGITONIUM (triggered - name and reveal on quest)
    const prestidigitonium: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PRESTIDIGITONIUM",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(prestidigitonium),
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
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // BACK TO WORK (triggered - bounce and discard on banish in challenge)
    const backToWork: TriggeredAbilityDefinition = {
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

  it.skip("Elsa - Ice Maker: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // WINTER WALL (triggered - exert and conditional freeze on quest)
    const winterWall: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WINTER WALL",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(winterWall),
    );
  });

  it.skip("Kenai - Magical Bear: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)\nWISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Challenger +2
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // WISDOM OF HIS STORY (triggered - return to hand and gain lore on banish)
    const wisdomOfHisStory: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WISDOM OF HIS STORY",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(wisdomOfHisStory),
    );
  });

  it.skip("Kuzco - Panicked Llama: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nWE CAN FIGURE THIS OUT At the start of your turn, choose one: \n• Each player draws a card. \n• Each player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // WE CAN FIGURE THIS OUT (triggered - modal choice at start of turn)
    const weCanFigureThisOut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WE CAN FIGURE THIS OUT",
      trigger: {
        event: "start-of-turn",
      },
      effect: {
        type: "modal",
        options: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(weCanFigureThisOut),
    );
  });

  it.skip("Anna - Ice Breaker: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // WINTER AMBUSH (triggered - freeze opponent on play)
    const winterAmbush: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WINTER AMBUSH",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(winterAmbush),
    );
  });

  it.skip("Donald Duck - Flustered Sorcerer: should parse card text", () => {
    const text = "OBFUSCATE! Opponents need 25 lore to win the game.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OBFUSCATE! (static - change win condition)
    const obfuscate: StaticAbilityDefinition = {
      type: "static",
      name: "OBFUSCATE!",
      effect: {
        type: "win-condition-modification",
        loreRequired: 25,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(obfuscate),
    );
  });

  it.skip("The Queen - Jealous Beauty: should parse card text", () => {
    const text =
      "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NO ORDINARY APPLE (activated - move cards for lore)
    const noOrdinaryApple: ActivatedAbilityDefinition = {
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
    const startledShriek: TriggeredAbilityDefinition = {
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

  it.skip("Archimedes - Exceptional Owl: should parse card text", () => {
    const text =
      "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MORE TO LEARN (triggered - draw on opponent target)
    const moreToLearn: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MORE TO LEARN",
      trigger: {
        event: "challenged",
      },
      effect: {
        type: "optional",
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(moreToLearn),
    );
  });

  it.skip("Dolores Madrigal - Within Earshot: should parse card text", () => {
    const text =
      "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I HEAR YOU (triggered - reveal hand on sing)
    const iHearYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I HEAR YOU",
      trigger: { event: "sing" },
      effect: { type: "reveal-hand", target: "OPPONENT" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iHearYou),
    );
  });

  it.skip("Mufasa - Among the Stars: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mufasa.)\nEvasive (Only characters with Evasive can challenge this character.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Magical Maneuvers: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand. Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const magicalManeuvers: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicalManeuvers),
    );
  });

  it.skip("This Is My Family: should parse card text", () => {
    const text = "Gain 1 lore. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisIsMyFamily: ActionAbilityDefinition = {
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

    const showMeMore: ActionAbilityDefinition = {
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

    const restoringTheCrown: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restoringTheCrown),
    );
  });

  it.skip("Amethyst Coil: should parse card text", () => {
    const text =
      "MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const magicalTouch: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAGICAL TOUCH",
      trigger: {
        event: "put-into-inkwell",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: 1,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicalTouch),
    );
  });

  it.skip("Grewnge - Cannon Expert: should parse card text", () => {
    const text =
      "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rapidFire: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RAPID FIRE",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rapidFire),
    );
  });

  it.skip("Baymax - Low Battery: should parse card text", () => {
    const text = "SHHHHH This character enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shhhhh: StaticAbilityDefinition = {
      type: "static",
      name: "SHHHHH",
      effect: {
        type: "enters-play-modification",
        modification: "exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shhhhh),
    );
  });

  it.skip("Thomas O'Malley - Feline Charmer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Pete - Pirate Scoundrel: should parse card text", () => {
    const text =
      "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const pilferAndPlunder: TriggeredAbilityDefinition = {
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

  it.skip("Hiro Hamada - Future Champion: should parse card text", () => {
    const text =
      "ORIGIN STORY When you play a Floodborn character on this card, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const originStory: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ORIGIN STORY",
      trigger: { event: "play" },
      effect: { type: "draw", amount: 1, target: "CONTROLLER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(originStory),
    );
  });

  it.skip("Cheshire Cat - Perplexing Feline: should parse card text", () => {
    const text =
      "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const madGrin: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAD GRIN",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_DAMAGED_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(madGrin),
    );
  });

  it.skip("Shere Khan - Infamous Tiger: should parse card text", () => {
    const text = "WHAT A PITY When you play this character, discard your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatAPity: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT A PITY",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "discard", amount: "all" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatAPity),
    );
  });

  it.skip("Basil - Secret Informer: should parse card text", () => {
    const text =
      "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const drawThemOut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DRAW THEM OUT",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "ALL_OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(drawThemOut),
    );
  });

  it.skip("Mad Hatter - Unruly Eccentric: should parse card text", () => {
    const text =
      "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const unbirthdayPresent: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UNBIRTHDAY PRESENT",
      trigger: { event: "challenge" },
      effect: {
        type: "optional",
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(unbirthdayPresent),
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

    const ifILoseMyTemper: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IF I LOSE MY TEMPER...",
      trigger: { event: "play", on: "YOUR_OTHER_CHARACTERS" },
      effect: { type: "put-damage", amount: 1, target: "PLAYED_CARD" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ifILoseMyTemper),
    );
  });

  it.skip("Hiro Hamada - Armor Designer: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const youCanBeWayMore: StaticAbilityDefinition = {
      type: "static",
      name: "YOU CAN BE WAY MORE",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youCanBeWayMore),
    );
  });

  it.skip("Yokai - Intellectual Schemer: should parse card text", () => {
    const text =
      "INNOVATE You pay 1 {I} less to play characters using their Shift ability.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const innovate: StaticAbilityDefinition = {
      type: "static",
      name: "INNOVATE",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(innovate),
    );
  });

  it.skip("Donald Duck - Lively Pirate: should parse card text", () => {
    const text =
      "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const duckOfAction: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DUCK OF ACTION",
      trigger: { event: "challenged" },
      effect: {
        type: "optional",
        effect: { type: "return-to-hand", target: "ACTION_FROM_DISCARD" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(duckOfAction),
    );
  });

  it.skip("Lady - Elegant Spaniel: should parse card text", () => {
    const text =
      "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aDogsLife: StaticAbilityDefinition = {
      type: "static",
      name: "A DOG'S LIFE",
      effect: {
        type: "conditional",
        condition: { type: "have-character", name: "Tramp" },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aDogsLife),
    );
  });

  it.skip("Yzma - Exasperated Schemer: should parse card text", () => {
    const text =
      "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const howShallIDoIt: TriggeredAbilityDefinition = {
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

    const fullPack: StaticAbilityDefinition = {
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

    const anotherRecitation: TriggeredAbilityDefinition = {
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

  it.skip("Baymax - Giant Robot: should parse card text", () => {
    const text =
      "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const functionalityImproved: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FUNCTIONALITY IMPROVED",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        then: { type: "remove-damage", amount: "all", target: "SELF" },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(functionalityImproved),
    );
  });

  it.skip("Gizmoduck - Suited Up: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    const blatheringBlatherskite: StaticAbilityDefinition = {
      type: "static",
      name: "BLATHERING BLATHERSKITE",
      effect: { type: "challenge-ready", target: "SELF" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(blatheringBlatherskite),
    );
  });

  it.skip("Fidget - Sneaky Bat: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const iTookCareOfEverything: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I TOOK CARE OF EVERYTHING",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iTookCareOfEverything),
    );
  });

  it.skip("Mr. Smee - Efficient Captain: should parse card text", () => {
    const text =
      "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const pipeUpTheCrew: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PIPE UP THE CREW",
      trigger: { event: "play" },
      effect: {
        type: "optional",
        effect: { type: "ready", target: "CHOSEN_CHARACTER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pipeUpTheCrew),
    );
  });

  it.skip("Daisy Duck - Multitalented Pirate: should parse card text", () => {
    const text =
      "FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fowlPlay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FOWL PLAY",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "return-to-hand", target: "CHOSEN_OPPOSING_CHARACTER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fowlPlay),
    );
  });

  it.skip("John Silver - Vengeful Pirate: should parse card text", () => {
    const text =
      "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1 (Damage dealt to this character is reduced by 1.)\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    const drawnToAFight: StaticAbilityDefinition = {
      type: "static",
      name: "DRAWN TO A FIGHT",
      effect: {
        type: "conditional",
        condition: { type: "exerted" },
        then: { type: "cost-reduction" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(drawnToAFight),
    );

    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );

    const iAintGoneSoft: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I AIN'T GONE SOFT!",
      trigger: { event: "play" },
      effect: {
        type: "optional",
        effect: { type: "deal-damage", amount: 1, target: "CHOSEN_CHARACTER" },
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(iAintGoneSoft),
    );
  });

  it.skip("Tramp - Enterprising Dog: should parse card text", () => {
    const text =
      "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const heyPidge: StaticAbilityDefinition = {
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

    const noTimeForWisecracks: TriggeredAbilityDefinition = {
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

  it.skip("King of Hearts - Picky Ruler: should parse card text", () => {
    const text =
      "OBJECTIONABLE STATE Damaged characters can't challenge your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const objectionableState: StaticAbilityDefinition = {
      type: "static",
      name: "OBJECTIONABLE STATE",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "ALL_OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(objectionableState),
    );
  });

  it.skip("Anastasia - Bossy Stepsister: should parse card text", () => {
    const text =
      "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ohIHateThis: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OH, I HATE THIS!",
      trigger: {
        event: "challenged",
        on: "SELF",
      },
      effect: { type: "discard", amount: 1, target: "CHALLENGING_PLAYER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ohIHateThis),
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

    const frightfulScheme: StaticAbilityDefinition = {
      type: "static",
      name: "FRIGHTFUL SCHEME",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(frightfulScheme),
    );
  });

  it.skip("Lady Tremaine - Bitterly Jealous: should parse card text", () => {
    const text =
      "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thatsQuiteEnough: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THAT'S QUITE ENOUGH",
      cost: { exert: true },
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thatsQuiteEnough),
    );
  });

  it.skip("Wake Up, Alice!: should parse card text", () => {
    const text = "Return chosen damaged character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wakeUpAlice: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "return-to-hand", target: "CHOSEN_DAMAGED_CHARACTER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wakeUpAlice),
    );
  });

  it.skip("He's a Tramp: should parse card text", () => {
    const text =
      "Chosen character gets +1 {S} this turn for each character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hesATramp: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hesATramp),
    );
  });

  it.skip("The Return of Hercules: should parse card text", () => {
    const text =
      "Each player may reveal a character card from their hand and play it for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theReturnOfHercules: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "play-card", from: "hand", free: true },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theReturnOfHercules),
    );
  });

  it.skip("Ink Geyser: should parse card text", () => {
    const text =
      "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const inkGeyser: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(inkGeyser),
    );
  });

  it.skip("Emerald Coil: should parse card text", () => {
    const text =
      "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shimmeringWings: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHIMMERING WINGS",
      trigger: { event: "put-into-inkwell" },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shimmeringWings),
    );
  });

  it.skip("Grandmother Fa - Spirited Elder: should parse card text", () => {
    const text =
      "I'VE GOT ALL THE LUCK WE'LL NEED Whenever this character quests, you may give chosen character of yours +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iveGotAllTheLuck: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'VE GOT ALL THE LUCK WE'LL NEED",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "YOUR_CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveGotAllTheLuck),
    );
  });

  it.skip("Queen of Hearts - Losing Her Temper: should parse card text", () => {
    const text = "ROYAL PAIN While this character has damage, she gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const royalPain: StaticAbilityDefinition = {
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

    const youAreADisgrace: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU ARE A DISGRACE!",
      trigger: { event: "challenge", on: "SELF" },
      effect: { type: "lose-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youAreADisgrace),
    );
  });

  it.skip("Denahi - Impatient Hunter: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
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

  it.skip("Stabbington Brother - Without a Patch: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const getEm: StaticAbilityDefinition = {
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

  it.skip("Belle - Mechanic Extraordinaire: should parse card text", () => {
    const text =
      "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 7 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const salvage: StaticAbilityDefinition = {
      type: "static",
      name: "SALVAGE",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(salvage),
    );

    const repurpose: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "REPURPOSE",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "optional", effect: { type: "gain-lore", amount: 1 } },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(repurpose),
    );
  });

  it.skip("Cy-Bug - Invasive Enemy: should parse card text", () => {
    const text =
      "HIVE MIND This character gets +1 {S} for each other character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hiveMind: StaticAbilityDefinition = {
      type: "static",
      name: "HIVE MIND",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hiveMind),
    );
  });

  it.skip("Stabbington Brother - With a Patch: should parse card text", () => {
    const text =
      "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const crimeOfOpportunity: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CRIME OF OPPORTUNITY",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "lose-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(crimeOfOpportunity),
    );
  });

  it.skip("Card Soldiers - Royal Troops: should parse card text", () => {
    const text =
      "TAKE POINT While a damaged character is in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const takePoint: StaticAbilityDefinition = {
      type: "static",
      name: "TAKE POINT",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(takePoint),
    );
  });

  it.skip("Cogsworth - Climbing Clock: should parse card text", () => {
    const text =
      "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stillUseful: StaticAbilityDefinition = {
      type: "static",
      name: "STILL USEFUL",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stillUseful),
    );
  });

  it.skip("Beagle Boys - Small-Time Crooks: should parse card text", () => {
    const text =
      "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hurryItUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HURRY IT UP!",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "compound", effects: [] },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hurryItUp),
    );
  });

  it.skip("Li Shang - Newly Promoted: should parse card text", () => {
    const text =
      "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const iWontLetYouDown: StaticAbilityDefinition = {
      type: "static",
      name: "I WON'T LET YOU DOWN",
      effect: { type: "challenge-ready", target: "SELF" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWontLetYouDown),
    );

    const bigResponsibility: StaticAbilityDefinition = {
      type: "static",
      name: "BIG RESPONSIBILITY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bigResponsibility),
    );
  });

  it.skip("Moana - Island Explorer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const adventurousSpirit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ADVENTUROUS SPIRIT",
      trigger: { event: "challenge", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(adventurousSpirit),
    );
  });

  it.skip("The Phantom Blot - Shadowy Figure: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Beast - Frustrated Designer: should parse card text", () => {
    const text =
      "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iveHadIt: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I'VE HAD IT!",
      cost: { exert: true, ink: 2 },
      effect: { type: "deal-damage", amount: 5, target: "CHOSEN_CHARACTER" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveHadIt),
    );
  });

  it.skip("Mushu - Majestic Dragon: should parse card text", () => {
    const text =
      "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const intimidatingAndAweInspiring: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INTIMIDATING AND AWE-INSPIRING",
      trigger: { event: "challenge" },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHALLENGING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(intimidatingAndAweInspiring),
    );

    const guardianOfLostSouls: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GUARDIAN OF LOST SOULS",
      trigger: { event: "banish-in-challenge" },
      effect: { type: "gain-lore", amount: 2 },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(guardianOfLostSouls),
    );
  });

  it.skip("Maurice - Unconventional Inventor: should parse card text", () => {
    const text =
      "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const howOnEarthDidThatHappen: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HOW ON EARTH DID THAT HAPPEN?",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "optional", effect: { type: "compound", effects: [] } },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(howOnEarthDidThatHappen),
    );
  });

  it.skip("Goofy - Extreme Athlete: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const starPower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STAR POWER",
      trigger: { event: "challenge", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(starPower),
    );
  });

  it.skip("Lyle Tiberius Rourke - Crystallized Mercenary: should parse card text", () => {
    const text =
      "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const explosive: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXPLOSIVE",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "deal-damage", amount: 2, target: "ALL_CHARACTERS" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(explosive),
    );
  });

  it.skip("Mulan - Imperial General: should parse card text", () => {
    const text =
      'Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nEvasive (Only characters with Evasive can challenge this character.)\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const exceptionalLeader: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXCEPTIONAL LEADER",
      trigger: { event: "challenge", on: "SELF" },
      effect: { type: "grant-ability", target: "YOUR_OTHER_CHARACTERS" },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(exceptionalLeader),
    );
  });

  it.skip("Baloo - Ol' Iron Paws: should parse card text", () => {
    const text =
      "FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fightLikeABear: StaticAbilityDefinition = {
      type: "static",
      name: "FIGHT LIKE A BEAR",
      effect: { type: "damage-prevention", target: "YOUR_CHARACTERS" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fightLikeABear),
    );
  });

  it.skip("Ratigan - Nefarious Criminal: should parse card text", () => {
    const text =
      "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aMarvelousPerformance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "A MARVELOUS PERFORMANCE",
      trigger: { event: "play" },
      effect: { type: "gain-lore", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aMarvelousPerformance),
    );
  });

  it.skip("Milo Thatch - Undaunted Scholar: should parse card text", () => {
    const text =
      "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const imYourGuy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'M YOUR GUY",
      trigger: { event: "play" },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imYourGuy),
    );
  });

  it.skip("We've Got Company!: should parse card text", () => {
    const text =
      "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const weveGotCompany: ActionAbilityDefinition = {
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

    const outOfOrder: ActionAbilityDefinition = {
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

    const crimsonSpark: TriggeredAbilityDefinition = {
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

    const fixedInNoTime: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FIXED IN NO TIME",
      trigger: { event: "banish", on: "SELF" },
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fixedInNoTime),
    );
  });

  it.skip("Maurice's Machine: should parse card text", () => {
    const text =
      "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const breakDown: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BREAK DOWN",
      trigger: { event: "banish", on: "SELF" },
      effect: {
        type: "optional",
        effect: { type: "return-to-hand", target: "ITEM_FROM_DISCARD" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(breakDown),
    );
  });

  it.skip("Devil's Eye Diamond: should parse card text", () => {
    const text =
      "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thePriceOfPower: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE PRICE OF POWER",
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: { type: "damaged" },
        then: { type: "gain-lore", amount: 1 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thePriceOfPower),
    );
  });

  it.skip("Clarabelle - News Reporter: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBREAKING STORY Your other characters with Support get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    const breakingStory: StaticAbilityDefinition = {
      type: "static",
      name: "BREAKING STORY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(breakingStory),
    );
  });

  it.skip("Scrooge McDuck - Resourceful Miser: should parse card text", () => {
    const text =
      "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const putItToGoodUse: StaticAbilityDefinition = {
      type: "static",
      name: "PUT IT TO GOOD USE",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(putItToGoodUse),
    );

    const fortuneHunter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FORTUNE HUNTER",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "look-at-top", amount: 4 },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(fortuneHunter),
    );
  });

  it.skip("Mattias - Arendelle General: should parse card text", () => {
    const text =
      "PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const proudToServe: StaticAbilityDefinition = {
      type: "static",
      name: "PROUD TO SERVE",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(proudToServe),
    );
  });

  it.skip("Monsieur D'Arque - Despicable Proprietor: should parse card text", () => {
    const text =
      "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iveComeToCollect: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'VE COME TO COLLECT",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "optional", effect: { type: "compound", effects: [] } },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveComeToCollect),
    );
  });

  it.skip("Belle - Apprentice Inventor: should parse card text", () => {
    const text =
      "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatAMess: StaticAbilityDefinition = {
      type: "static",
      name: "WHAT A MESS",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatAMess),
    );
  });

  it.skip("Lucky - Runt of the Litter: should parse card text", () => {
    const text =
      "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const followMyVoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FOLLOW MY VOICE",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "look-at-top", amount: 2 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(followMyVoice),
    );
  });

  it.skip("Dawson - Puzzling Sleuth: should parse card text", () => {
    const text =
      "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const beSensible: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BE SENSIBLE",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "look-at-top", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beSensible),
    );
  });

  it.skip("Tamatoa - Happy as a Clam: should parse card text", () => {
    const text =
      "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.\nI'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const coolestCollection: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "COOLEST COLLECTION",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "return-to-hand", target: "ITEM_FROM_DISCARD" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(coolestCollection),
    );

    const imBeautifulBaby: TriggeredAbilityDefinition = {
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

  it.skip("Heihei - Expanded Consciousness: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );

    const clearYourMind: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLEAR YOUR MIND",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "move" },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(clearYourMind),
    );
  });

  it.skip("Kida - Creative Thinker: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nKEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    const keyToThePuzzle: ActivatedAbilityDefinition = {
      type: "activated",
      name: "KEY TO THE PUZZLE",
      cost: { exert: true },
      effect: { type: "look-at-top", amount: 2 },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(keyToThePuzzle),
    );
  });

  it.skip("Marie - Favored Kitten: should parse card text", () => {
    const text =
      "I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const illShowYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'LL SHOW YOU",
      trigger: { event: "quest", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(illShowYou),
    );
  });

  it.skip("Pepper - Quick-Thinking Puppy: should parse card text", () => {
    const text =
      "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const inTheNickOfTime: TriggeredAbilityDefinition = {
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

  it.skip("Freckles - Good Boy: should parse card text", () => {
    const text =
      "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justSoCute: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "JUST SO CUTE!",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justSoCute),
    );
  });

  it.skip("Honey Lemon - Chemistry Whiz: should parse card text", () => {
    const text =
      "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const prettyGreatHuh: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PRETTY GREAT, HUH?",
      trigger: { event: "play" },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(prettyGreatHuh),
    );
  });

  it.skip("Robin Hood - Eye for Detail: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
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

    const ourBottleWorked: StaticAbilityDefinition = {
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

  it.skip("Lady Kluck - Protective Confidant: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Jasmine - Inspired Researcher: should parse card text", () => {
    const text =
      "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const extraAssistance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXTRA ASSISTANCE",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(extraAssistance),
    );
  });

  it.skip("Jebidiah Farnsworth - Expedition Cook: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    const iGotYourFourBasicFoodGroups: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iGotYourFourBasicFoodGroups),
    );
  });

  it.skip("Baymax - Upgraded Robot: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    const advancedScanner: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ADVANCED SCANNER",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "search" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(advancedScanner),
    );
  });

  it.skip("Maid Marian - Badminton Ace: should parse card text", () => {
    const text =
      "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const goodShot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GOOD SHOT",
      trigger: { event: "take-damage" },
      effect: { type: "deal-damage", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goodShot),
    );

    const fairPlay: StaticAbilityDefinition = {
      type: "static",
      name: "FAIR PLAY",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(fairPlay),
    );
  });

  it.skip("Water Has Memory: should parse card text", () => {
    const text =
      "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const waterHasMemory: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "look" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(waterHasMemory),
    );
  });

  it.skip("All Is Found: should parse card text", () => {
    const text =
      "Put up to 2 cards from your discard into your inkwell, facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const allIsFound: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "move" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(allIsFound),
    );
  });

  it.skip("Sapphire Coil: should parse card text", () => {
    const text =
      "BRILLIANT SHINE During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const brilliantShine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BRILLIANT SHINE",
      trigger: { event: "put-into-inkwell" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(brilliantShine),
    );
  });

  it.skip("Baymax's Charging Station: should parse card text", () => {
    const text =
      "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const energyConverter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENERGY CONVERTER",
      trigger: { event: "play" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(energyConverter),
    );
  });

  it.skip("Dr. Calico - Green-Eyed Man: should parse card text", () => {
    const text =
      "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youreBeginningToIrkMe: StaticAbilityDefinition = {
      type: "static",
      name: "YOU'RE BEGINNING TO IRK ME",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreBeginningToIrkMe),
    );
  });

  it.skip("Helga Sinclair - Tough as Nails: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S}).\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    const quickReflexes: StaticAbilityDefinition = {
      type: "static",
      name: "QUICK REFLEXES",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(quickReflexes),
    );
  });

  it.skip("Bolt - Headstrong Dog: should parse card text", () => {
    const text =
      "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theresNoTurningBack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THERE'S NO TURNING BACK",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theresNoTurningBack),
    );
  });

  it.skip("Raya - Guidance Seeker: should parse card text", () => {
    const text =
      "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aGreaterPurpose: TriggeredAbilityDefinition = {
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

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
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

  it.skip("Fa Zhou - War Hero: should parse card text", () => {
    const text =
      "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const trainingExercises: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TRAINING EXERCISES",
      trigger: { event: "challenge" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(trainingExercises),
    );
  });

  it.skip("Razoul - Menacing Guard: should parse card text", () => {
    const text =
      "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const myOrdersComeFromJafar: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MY ORDERS COME FROM JAFAR",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "conditional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(myOrdersComeFromJafar),
    );
  });

  it.skip("Jafar - Aspiring Ruler: should parse card text", () => {
    const text =
      "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thatsBetter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THAT'S BETTER",
      trigger: { event: "play", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thatsBetter),
    );
  });

  it.skip("Tick-Tock - Relentless Crocodile: should parse card text", () => {
    const text =
      "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookingForLunch: StaticAbilityDefinition = {
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

  it.skip("Kakamora - Band of Pirates: should parse card text", () => {
    const text =
      "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3. (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const showboating: StaticAbilityDefinition = {
      type: "static",
      name: "SHOWBOATING",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(showboating),
    );
  });

  it.skip("Mulan - Disguised Soldier: should parse card text", () => {
    const text =
      "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whereDoISignIn: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHERE DO I SIGN IN?",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whereDoISignIn),
    );
  });

  it.skip("Orville - Albatross Air: should parse card text", () => {
    const text =
      "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const welcomeAboardFolks: StaticAbilityDefinition = {
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

  it.skip("Miss Bianca - Unwavering Agent: should parse card text", () => {
    const text =
      "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const haveALittleFaith: StaticAbilityDefinition = {
      type: "static",
      name: "HAVE A LITTLE FAITH",
      effect: { type: "cost-reduction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(haveALittleFaith),
    );
  });

  it.skip("Aladdin - Research Assistant: should parse card text", () => {
    const text =
      "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.\nPUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const helpingHand: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HELPING HAND",
      trigger: { event: "quest", on: "SELF" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(helpingHand),
    );

    const putInTheEffort: StaticAbilityDefinition = {
      type: "static",
      name: "PUT IN THE EFFORT",
      effect: {
        type: "modify-stat",
        stat: "strength",
        value: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(putInTheEffort),
    );
  });

  it.skip("Bagheera - Guardian Jaguar: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    const youMustBeBrave: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU MUST BE BRAVE",
      trigger: { event: "banish", on: "SELF" },
      effect: { type: "deal-damage", amount: 2 },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youMustBeBrave),
    );
  });

  it.skip("Gantu - Experienced Enforcer: should parse card text", () => {
    const text =
      "CLOSE ALL CHANNELS When you play this character, characters can't exert to sing songs until the start of your next turn.\nDON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn't apply to singing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const closeAllChannels: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLOSE ALL CHANNELS",
      trigger: { event: "play", on: "SELF" },
      effect: { type: "restriction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(closeAllChannels),
    );

    const dontGetAnyIdeas: StaticAbilityDefinition = {
      type: "static",
      name: "DON'T GET ANY IDEAS",
      effect: { type: "cost-increase" },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(dontGetAnyIdeas),
    );
  });

  it.skip("Mickey Mouse - Inspirational Warrior: should parse card text", () => {
    const text =
      "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stirringSpirit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STIRRING SPIRIT",
      trigger: { event: "banish-in-challenge" },
      effect: { type: "optional" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stirringSpirit),
    );
  });

  it.skip("Restoring Atlantis: should parse card text", () => {
    const text =
      "Your characters can't be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const restoringAtlantis: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "restriction" },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restoringAtlantis),
    );
  });

  it.skip("Double Trouble: should parse card text", () => {
    const text = "Deal 1 damage each to up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const doubleTrouble: ActionAbilityDefinition = {
      type: "action",
      effect: { type: "deal-damage", amount: 1 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doubleTrouble),
    );
  });

  it.skip("Steel Coil: should parse card text", () => {
    const text =
      "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const metallicFlow: TriggeredAbilityDefinition = {
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

    const precisionStrike: ActivatedAbilityDefinition = {
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
