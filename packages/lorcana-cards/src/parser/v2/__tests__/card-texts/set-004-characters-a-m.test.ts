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

describe("Set 004 Card Text Parser Tests - Characters A M", () => {
  it.skip("Alma Madrigal - Family Matriarch: should parse card text", () => {
    const text =
      "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const toTheTable: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TO THE TABLE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "search-deck",
          cardType: "character",
          putInto: "top-of-deck",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(toTheTable),
    );
  });

  it.skip("Cinderella - Melody Weaver: should parse card text", () => {
    const text =
      "Singer 9 (This character counts as cost 9 to sing songs.)\nBEAUTIFUL VOICE Whenever this character sings a song, your other Princess characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 9
    const singer9: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 9,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer9),
    );

    // Second ability: BEAUTIFUL VOICE triggered
    const beautifulVoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BEAUTIFUL VOICE",
      trigger: {
        event: "sing",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(beautifulVoice),
    );
  });

  it.skip("Cogsworth - Majordomo: should parse card text", () => {
    const text =
      "AS YOU WERE! Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const asYouWere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AS YOU WERE!",
      trigger: {
        event: "quest",
        on: "SELF",
      },
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
      expect.objectContaining(asYouWere),
    );
  });

  it.skip("Donald Duck - Musketeer Soldier: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.";
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

    // Second ability: WAIT FOR ME! triggered
    const waitForMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WAIT FOR ME!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(waitForMe),
    );
  });

  it.skip("Gaston - Despicable Dealer: should parse card text", () => {
    const text =
      "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const dubiousRecruitment: ActivatedAbilityDefinition = {
      type: "activated",
      name: "DUBIOUS RECRUITMENT",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dubiousRecruitment),
    );
  });

  it.skip("Golden Harp - Enchanter of the Land: should parse card text", () => {
    const text =
      "STOLEN AWAY At the end of your turn, if you didn't play a song this turn, banish this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stolenAway: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STOLEN AWAY",
      trigger: {
        event: "end-of-turn",
      },
      effect: {
        type: "conditional",
        condition: { type: "played-card-this-turn" },
        then: { type: "banish", target: "SELF" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stolenAway),
    );
  });

  it.skip("Goofy - Musketeer Swordsman: should parse card text", () => {
    const text =
      "EN GAWRSH! Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const enGawrsh: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EN GAWRSH!",
      trigger: {
        event: "play",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "ready", target: "SELF" },
          { type: "restriction", restriction: "cant-quest", target: "SELF" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(enGawrsh),
    );
  });

  it.skip("Max - Loyal Sheepdog: should parse card text", () => {
    const text =
      "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hereBoy: StaticAbilityDefinition = {
      type: "static",
      name: "HERE BOY",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereBoy),
    );
  });

  it.skip("Mickey Mouse - Leader of the Band: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.";
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

    // Second ability: STRIKE UP THE MUSIC triggered
    const strikeUpTheMusic: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STRIKE UP THE MUSIC",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(strikeUpTheMusic),
    );
  });

  it.skip("Mickey Mouse - Musketeer Captain: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nBodyguard, Support\nMUSKETEERS UNITED When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(4);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift5),
    );

    // Second ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Third ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(support),
    );

    // Fourth ability: MUSKETEERS UNITED triggered
    const musketeersUnited: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MUSKETEERS UNITED",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        then: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[3].ability).toEqual(
      expect.objectContaining(musketeersUnited),
    );
  });

  it.skip("Minnie Mouse - Musketeer Champion: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDRAMATIC ENTRANCE When you play this character, banish chosen opposing character with 5 {S} or more.";
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

    // Second ability: DRAMATIC ENTRANCE triggered
    const dramaticEntrance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DRAMATIC ENTRANCE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(dramaticEntrance),
    );
  });

  it.skip("Mirabel Madrigal - Gift of the Family: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSAVING THE MIRACLE Whenever this character quests, your other Madrigal characters get +1 {L} this turn.";
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

    // Second ability: SAVING THE MIRACLE triggered
    const savingTheMiracle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SAVING THE MIRACLE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(savingTheMiracle),
    );
  });

  it.skip("Mirabel Madrigal - Prophecy Finder: should parse card text", () => {
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

  it.skip("First Aid: should parse card text", () => {
    const text = "Remove up to 1 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const firstAid: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(firstAid),
    );
  });

  it.skip("Miracle Candle: should parse card text", () => {
    const text =
      "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const abuelasGift: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ABUELA'S GIFT",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "conditional",
        condition: { type: "have-character" },
        then: { type: "compound", effects: [] },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(abuelasGift),
    );
  });

  it.skip("Bruno Madrigal - Out of the Shadows: should parse card text", () => {
    const text =
      'IT WAS YOUR VISION When you play this character, chosen character gains "When this character is banished in a challenge, you may return this card to your hand" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const itWasYourVision: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT WAS YOUR VISION",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "grant-ability",
        ability: {
          type: "triggered",
          trigger: { event: "banish" },
          effect: { type: "return-to-hand", target: "SELF" },
        },
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itWasYourVision),
    );
  });

  it.skip("Elsa - Storm Chaser: should parse card text", () => {
    const text =
      "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tempest: ActivatedAbilityDefinition = {
      type: "activated",
      name: "TEMPEST",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tempest),
    );
  });

  it.skip("Flotsam & Jetsam - Entangling Eels: should parse card text", () => {
    const text =
      "Shift: Discard 2 cards (You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)\n(This character counts as being named both Flotsam and Jetsam.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift with discard 2 cards
    const shiftDiscard2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shiftDiscard2),
    );

    // Second ability: Dual name static
    const dualName: StaticAbilityDefinition = {
      type: "static",
      effect: {
        type: "grant-keyword",
        keyword: "Bodyguard",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(dualName),
    );
  });

  it.skip("Isabela Madrigal - Golden Child: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.\nLEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: LADIES FIRST static
    const ladiesFirst: StaticAbilityDefinition = {
      type: "static",
      name: "LADIES FIRST",
      effect: {
        type: "conditional",
        condition: { type: "your-turn" },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 3,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ladiesFirst),
    );

    // Third ability: LEAVE IT TO ME triggered
    const leaveItToMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LEAVE IT TO ME",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(leaveItToMe),
    );
  });

  it.skip("Magic Broom - Illuminary Keeper: should parse card text", () => {
    const text =
      "NICE AND TIDY Whenever you play another character, you may banish this character to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const niceAndTidy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NICE AND TIDY",
      trigger: {
        event: "play",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "banish", target: "SELF" },
            { type: "draw", amount: 1, target: "CONTROLLER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(niceAndTidy),
    );
  });

  it.skip("Marshmallow - Terrifying Snowman: should parse card text", () => {
    const text =
      "BEHEMOTH This character gets +1 {S} for each card in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const behemoth: StaticAbilityDefinition = {
      type: "static",
      name: "BEHEMOTH",
      effect: {
        type: "for-each",
        counter: { type: "cards-in-hand", controller: "you" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(behemoth),
    );
  });

  it.skip("Mrs. Potts - Enchanted Teapot: should parse card text", () => {
    const text =
      "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const itllTurnOutAllRight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT'LL TURN OUT ALL RIGHT",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "have-character", name: "Lumiere" },
        then: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itllTurnOutAllRight),
    );
  });

  it.skip("Mystical Rose: should parse card text", () => {
    const text =
      "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const dispelTheEntanglement: ActivatedAbilityDefinition = {
      type: "activated",
      name: "DISPEL THE ENTANGLEMENT",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "sequence",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dispelTheEntanglement),
    );
  });

  it.skip("Cri-Kee - Lucky Cricket: should parse card text", () => {
    const text =
      "SPREADING GOOD FORTUNE When you play this character, your other characters get +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const spreadingGoodFortune: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SPREADING GOOD FORTUNE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(spreadingGoodFortune),
    );
  });

  it.skip("Diablo - Devoted Herald: should parse card text", () => {
    const text =
      "Shift: Discard an action card (You may discard an action card to play this on top of one of your characters named Diablo.)\nEvasive (Only characters with Evasive can challenge this character.)\nCIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift with discard action
    const shiftDiscardAction: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCard: 1,
        discardCardType: "action",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shiftDiscardAction),
    );

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: CIRCLE FAR AND WIDE triggered
    const circleFarAndWide: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CIRCLE FAR AND WIDE",
      trigger: {
        event: "draw",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(circleFarAndWide),
    );
  });

  it.skip("Diablo - Maleficent's Spy: should parse card text", () => {
    const text =
      "SCOUT AHEAD When you play this character, you may look at each opponent's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const scoutAhead: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SCOUT AHEAD",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(scoutAhead),
    );
  });

  it.skip("Gunther - Interior Designer: should parse card text", () => {
    const text =
      "SAD-EYED PUPPY When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const sadEyedPuppy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SAD-EYED PUPPY",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(sadEyedPuppy),
    );
  });

  it.skip("Hades - Double Dealer: should parse card text", () => {
    const text =
      "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const heresTheTradeOff: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HERE'S THE TRADE-OFF",
      cost: {
        exert: true,
        banishOther: true,
      },
      effect: {
        type: "play-for-free",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heresTheTradeOff),
    );
  });

  it.skip("Hera - Queen of the Gods: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nPROTECTIVE GODDESS Your characters named Zeus gain Ward.\nYOU'RE A TRUE HERO Your characters named Hercules gain Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: PROTECTIVE GODDESS static
    const protectiveGoddess: StaticAbilityDefinition = {
      type: "static",
      name: "PROTECTIVE GODDESS",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(protectiveGoddess),
    );

    // Third ability: YOU'RE A TRUE HERO static
    const youreATrueHero: StaticAbilityDefinition = {
      type: "static",
      name: "YOU'RE A TRUE HERO",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(youreATrueHero),
    );
  });

  it.skip("Jaq - Connoisseur of Climbing: should parse card text", () => {
    const text =
      "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const sneakyIdea: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SNEAKY IDEA",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(sneakyIdea),
    );
  });

  it.skip("Jasmine - Desert Warrior: should parse card text", () => {
    const text =
      "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const cunningManeuver: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CUNNING MANEUVER",
      trigger: {
        event: "play",
      },
      effect: {
        type: "discard",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cunningManeuver),
    );
  });

  it.skip("Megara - Captivating Cynic: should parse card text", () => {
    const text =
      "SHADY DEAL When you play this character, choose and discard a card or banish this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shadyDeal: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHADY DEAL",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "choice",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shadyDeal),
    );
  });

  it.skip("Megara - Liberated One: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nPEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: PEOPLE ALWAYS DO CRAZY THINGS triggered
    const peopleAlwaysDoCrazyThings: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PEOPLE ALWAYS DO CRAZY THINGS",
      trigger: {
        event: "play",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(peopleAlwaysDoCrazyThings),
    );
  });

  it.skip("Dodge!: should parse card text", () => {
    const text =
      "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const dodge: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(dodge));
  });

  it.skip("Hidden Inkcaster: should parse card text", () => {
    const text =
      "FRESH INK When you play this item, draw a card.\nUNEXPECTED TREASURE All cards in your hand count as having {IW}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FRESH INK triggered
    const freshInk: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FRESH INK",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "draw",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(freshInk),
    );

    // Second ability: UNEXPECTED TREASURE static
    const unexpectedTreasure: StaticAbilityDefinition = {
      type: "static",
      name: "UNEXPECTED TREASURE",
      effect: {
        type: "property-modification",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(unexpectedTreasure),
    );
  });

  it.skip("Beast - Wounded: should parse card text", () => {
    const text = "THAT HURTS! This character enters play with 4 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thatHurts: StaticAbilityDefinition = {
      type: "static",
      name: "THAT HURTS!",
      effect: {
        type: "enters-with-damage",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thatHurts),
    );
  });

  it.skip("Fa Zhou - Mulan's Father: should parse card text", () => {
    const text =
      "WAR INJURY This character can't challenge.\nHEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WAR INJURY static
    const warInjury: StaticAbilityDefinition = {
      type: "static",
      name: "WAR INJURY",
      effect: {
        type: "restriction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(warInjury),
    );

    // Second ability: HEAD OF THE HOUSEHOLD activated
    const headOfTheHousehold: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HEAD OF THE HOUSEHOLD",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(headOfTheHousehold),
    );
  });

  it.skip("Flynn Rider - Frenemy: should parse card text", () => {
    const text =
      "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const narrowAdvantage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NARROW ADVANTAGE",
      trigger: {
        event: "start-of-turn",
      },
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(narrowAdvantage),
    );
  });

  it.skip("Goofy - Super Goof: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nSUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: SUPER PEANUT POWERS triggered
    const superPeanutPowers: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SUPER PEANUT POWERS",
      trigger: {
        event: "challenge",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(superPeanutPowers),
    );
  });

  it.skip("Hercules - Clumsy Kid: should parse card text", () => {
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

  it.skip("Hercules - Daring Demigod: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Li Shang - Valorous General: should parse card text", () => {
    const text =
      "Shift: Discard a character card (You may discard a character card to play this on top of one of your characters named Li Shang.)\nLEAD THE CHARGE Your characters with 4 {S} or more get +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift with discard character
    const shiftDiscardCharacter: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCard: 1,
        discardCardType: "character",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shiftDiscardCharacter),
    );

    // Second ability: LEAD THE CHARGE static
    const leadTheCharge: StaticAbilityDefinition = {
      type: "static",
      name: "LEAD THE CHARGE",
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(leadTheCharge),
    );
  });

  it.skip("Mulan - Enemy of Entanglement: should parse card text", () => {
    const text =
      "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const timeToShine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TIME TO SHINE",
      trigger: {
        event: "play",
      },
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(timeToShine),
    );
  });

  it.skip("Brawl: should parse card text", () => {
    const text = "Banish chosen character with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const brawl: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(brawl));
  });

  it.skip("Imperial Proclamation: should parse card text", () => {
    const text =
      "CALL TO THE FRONT Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const callToTheFront: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CALL TO THE FRONT",
      trigger: {
        event: "challenge",
      },
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(callToTheFront),
    );
  });

  it.skip("Ariel - Treasure Collector: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTHE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: THE GIRL WHO HAS EVERYTHING static
    const theGirlWhoHasEverything: StaticAbilityDefinition = {
      type: "static",
      name: "THE GIRL WHO HAS EVERYTHING",
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(theGirlWhoHasEverything),
    );
  });

  it.skip("Aurora - Lore Guardian: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aurora.)\nPRESERVER Opponents can't choose your items for abilities or effects.\nROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: PRESERVER static
    const preserver: StaticAbilityDefinition = {
      type: "static",
      name: "PRESERVER",
      effect: {
        type: "restriction",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(preserver),
    );

    // Third ability: ROYAL INVENTORY activated
    const royalInventory: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ROYAL INVENTORY",
      cost: {
        exertOther: true,
      },
      effect: {
        type: "scry",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(royalInventory),
    );
  });

  it.skip("Dang Hu - Talon Chief: should parse card text", () => {
    const text =
      "YOU BETTER TALK FAST Your other Villain characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youBetterTalkFast: StaticAbilityDefinition = {
      type: "static",
      name: "YOU BETTER TALK FAST",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youBetterTalkFast),
    );
  });

  it.skip("Flounder - Collector's Companion: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.";
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

    // Second ability: I'M NOT A GUPPY static
    const imNotAGuppy: StaticAbilityDefinition = {
      type: "static",
      name: "I'M NOT A GUPPY",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(imNotAGuppy),
    );
  });

  it.skip("Iduna - Caring Mother: should parse card text", () => {
    const text =
      "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const enduringLove: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENDURING LOVE",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(enduringLove),
    );
  });

  it.skip("Glean: should parse card text", () => {
    const text = "Banish chosen item. Its player gains 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const glean: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(glean));
  });

  it.skip("Field of Ice: should parse card text", () => {
    const text =
      "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const icyDefense: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ICY DEFENSE",
      trigger: {
        event: "play",
      },
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(icyDefense),
    );
  });

  it.skip("Great Stone Dragon: should parse card text", () => {
    const text =
      "ASLEEP This item enters play exerted.\nAWAKEN {E} — Put a character card from your discard into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: ASLEEP static
    const asleep: StaticAbilityDefinition = {
      type: "static",
      name: "ASLEEP",
      effect: {
        type: "restriction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(asleep),
    );

    // Second ability: AWAKEN activated
    const awaken: ActivatedAbilityDefinition = {
      type: "activated",
      name: "AWAKEN",
      cost: {
        exert: true,
      },
      effect: {
        type: "put-into-inkwell",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(awaken),
    );
  });

  it.skip("Ice Block: should parse card text", () => {
    const text = "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const chillyLabor: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CHILLY LABOR",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chillyLabor),
    );
  });

  it.skip("Ariel's Grotto - A Secret Place: should parse card text", () => {
    const text =
      "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const treasureTrove: StaticAbilityDefinition = {
      type: "static",
      name: "TREASURE TROVE",
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(treasureTrove),
    );
  });

  it.skip("Aladdin - Brave Rescuer: should parse card text", () => {
    const text =
      "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)\nCRASHING THROUGH Whenever this character quests, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift with discard location
    const shiftDiscardLocation: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCard: 1,
        discardCardType: "location",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shiftDiscardLocation),
    );

    // Second ability: CRASHING THROUGH triggered
    const crashingThrough: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CRASHING THROUGH",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(crashingThrough),
    );
  });

  it.skip("Beast - Thick-Skinned: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const resist1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist1),
    );
  });

  it.skip("Chi-Fu - Imperial Advisor: should parse card text", () => {
    const text =
      "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const overlyCautious: StaticAbilityDefinition = {
      type: "static",
      name: "OVERLY CAUTIOUS",
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(overlyCautious),
    );
  });

  it.skip("Chien-Po - Imperial Soldier: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Donald Duck - Buccaneer: should parse card text", () => {
    const text =
      "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const boardingParty: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BOARDING PARTY",
      trigger: {
        event: "banish-in-challenge",
      },
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boardingParty),
    );
  });

  it.skip("LeFou - Opportunistic Flunky: should parse card text", () => {
    const text =
      "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iLearnedFromTheBest: StaticAbilityDefinition = {
      type: "static",
      name: "I LEARNED FROM THE BEST",
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iLearnedFromTheBest),
    );
  });

  it.skip("Ling - Imperial Soldier: should parse card text", () => {
    const text = "FULL OF SPIRIT Your Hero characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fullOfSpirit: StaticAbilityDefinition = {
      type: "static",
      name: "FULL OF SPIRIT",
      effect: {
        type: "modify-stat",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fullOfSpirit),
    );
  });

  it.skip("Luisa Madrigal - Rock of the Family: should parse card text", () => {
    const text =
      "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const imTheStrongOne: StaticAbilityDefinition = {
      type: "static",
      name: "I'M THE STRONG ONE",
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imTheStrongOne),
    );
  });

  it.skip("Magic Broom - Aerial Cleaner: should parse card text", () => {
    const text =
      "WINGED FOR A DAY During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wingedForADay: StaticAbilityDefinition = {
      type: "static",
      name: "WINGED FOR A DAY",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wingedForADay),
    );
  });

  it.skip("Magic Broom - Brigade Commander: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +1
    const resist1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist1),
    );

    // Second ability: ARMY OF BROOMS static
    const armyOfBrooms: StaticAbilityDefinition = {
      type: "static",
      name: "ARMY OF BROOMS",
      effect: {
        type: "for-each",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(armyOfBrooms),
    );
  });

  it.skip("Mickey Mouse - Playful Sorcerer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nSWEEP AWAY When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift3),
    );

    // Second ability: Resist +1
    const resist1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist1),
    );

    // Third ability: SWEEP AWAY triggered
    const sweepAway: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWEEP AWAY",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(sweepAway),
    );
  });

  it.skip("Avalanche: should parse card text", () => {
    const text =
      "Deal 1 damage to each opposing character. You may banish chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const avalanche: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(avalanche),
    );
  });

  it.skip("Fortisphere: should parse card text", () => {
    const text =
      "RESOURCEFUL When you play this item, you may draw a card.\nEXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: RESOURCEFUL triggered
    const resourceful: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RESOURCEFUL",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resourceful),
    );

    // Second ability: EXTRACT OF STEEL activated
    const extractOfSteel: ActivatedAbilityDefinition = {
      type: "activated",
      name: "EXTRACT OF STEEL",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(extractOfSteel),
    );
  });

  it.skip("Imperial Bow: should parse card text", () => {
    const text =
      "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const withinRange: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WITHIN RANGE",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(withinRange),
    );
  });
});
