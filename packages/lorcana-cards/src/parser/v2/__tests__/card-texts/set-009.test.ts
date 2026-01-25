import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 009 Card Text Parser Tests", () => {
  it.skip("Bruno Madrigal - Undetected Uncle: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nYOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: YOU JUST HAVE TO SEE IT activated
    const youJustHaveToSeeIt: ActivatedAbilityDefinition = {
      type: "activated",
      name: "YOU JUST HAVE TO SEE IT",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youJustHaveToSeeIt),
    );
  });

  it.skip("The Queen - Conceited Ruler: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: ROYAL SUMMONS triggered
    const royalSummons: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYAL SUMMONS",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(royalSummons),
    );
  });

  it.skip("Pongo - Determined Father: should parse card text", () => {
    const text =
      "TWILIGHT BARK Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TWILIGHT BARK activated (once per turn)
    const twilightBark: ActivatedAbilityDefinition = {
      type: "activated",
      name: "TWILIGHT BARK",
      cost: {
        ink: 2,
      },
      effect: {
        type: "conditional",
        condition: { type: "card-type", cardType: "character" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(twilightBark),
    );
  });

  it.skip("Stitch - Rock Star: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Stitch.)\nADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ADORING FANS triggered
    const adoringFans: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ADORING FANS",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(adoringFans),
    );
  });

  it.skip("Beast - Gracious Prince: should parse card text", () => {
    const text =
      "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FULL DANCE CARD static
    const fullDanceCard: StaticAbilityDefinition = {
      type: "static",
      name: "FULL DANCE CARD",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fullDanceCard),
    );
  });

  it.skip("Minnie Mouse - Sweetheart Princess: should parse card text", () => {
    const text =
      "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: ROYAL FAVOR static
    const royalFavor: StaticAbilityDefinition = {
      type: "static",
      name: "ROYAL FAVOR",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalFavor),
    );

    // Second ability: BYE BYE, NOW triggered
    const byeByeNow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BYE BYE, NOW",
      trigger: {
        event: "quest",
        timing: "whenever",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(byeByeNow),
    );
  });

  it.skip("Aurora - Holding Court: should parse card text", () => {
    const text =
      "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ROYAL WELCOME triggered
    const royalWelcome: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYAL WELCOME",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalWelcome),
    );
  });

  it.skip("Rapunzel - Sunshine: should parse card text", () => {
    const text =
      "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAGIC HAIR activated
    const magicHair: ActivatedAbilityDefinition = {
      type: "activated",
      name: "MAGIC HAIR",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicHair),
    );
  });

  it.skip("Mulan - Free Spirit: should parse card text", () => {
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

  it.skip("Daisy Duck - Musketeer Spy: should parse card text", () => {
    const text =
      "INFILTRATION When you play this character, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // INFILTRATION triggered
    const infiltration: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INFILTRATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(infiltration),
    );
  });

  it.skip("Tinker Bell - Generous Fairy: should parse card text", () => {
    const text =
      "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAKE A NEW FRIEND triggered
    const makeANewFriend: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAKE A NEW FRIEND",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeANewFriend),
    );
  });

  it.skip("Pluto - Determined Defender: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Pluto.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nGUARD DOG At the start of your turn, remove up to 3 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Third ability: GUARD DOG triggered
    const guardDog: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GUARD DOG",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "SELF",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(guardDog),
    );
  });

  it.skip("Ariel - Singing Mermaid: should parse card text", () => {
    const text = "Singer 7 (This character counts as cost 7 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 7 keyword
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 7,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Pluto - Rescue Dog: should parse card text", () => {
    const text =
      "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TO THE RESCUE triggered
    const toTheRescue: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TO THE RESCUE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 3,
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(toTheRescue),
    );
  });

  it.skip("Nani - Protective Sister: should parse card text", () => {
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

  it.skip("Julieta Madrigal - Excellent Cook: should parse card text", () => {
    const text =
      "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SIGNATURE RECIPE triggered
    const signatureRecipe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SIGNATURE RECIPE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(signatureRecipe),
    );
  });

  it.skip("Cinderella - Gentle and Kind: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nA WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 5
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );

    // Second ability: A WONDERFUL DREAM activated
    const aWonderfulDream: ActivatedAbilityDefinition = {
      type: "activated",
      name: "A WONDERFUL DREAM",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(aWonderfulDream),
    );
  });

  it.skip("Moana - Of Motunui: should parse card text", () => {
    const text =
      "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WE CAN FIX IT triggered
    const weCanFixIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WE CAN FIX IT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(weCanFixIt),
    );
  });

  it.skip("Pluto - Friendly Pooch: should parse card text", () => {
    const text =
      "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GOOD DOG activated
    const goodDog: ActivatedAbilityDefinition = {
      type: "activated",
      name: "GOOD DOG",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goodDog),
    );
  });

  it.skip("Ursula - Vanessa: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 4 keyword
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 4,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Queen of Hearts - Wonderland Empress: should parse card text", () => {
    const text =
      "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ALL WAYS HERE ARE MY WAYS triggered
    const allWaysHereAreMyWays: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ALL WAYS HERE ARE MY WAYS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(allWaysHereAreMyWays),
    );
  });

  it.skip("Stitch - Carefree Surfer: should parse card text", () => {
    const text =
      "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OHANA triggered with condition
    const ohana: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OHANA",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "character-count", count: 2 },
        effect: { type: "draw", amount: 2, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ohana));
  });

  it.skip("Look at This Family: should parse card text", () => {
    const text =
      "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 7 and scry effect
    const lookAtThisFamily: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "scry",
        amount: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookAtThisFamily),
    );
  });

  it.skip("Circle of Life: should parse card text", () => {
    const text = "Sing Together 8 Play a character from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 8 and play-card effect
    const circleOfLife: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "play-card",
        from: "discard",
        cost: 0,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(circleOfLife),
    );
  });

  it.skip("Heal What Has Been Hurt: should parse card text", () => {
    const text = "Remove up to 3 damage from chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const healWhatHasBeenHurt: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healWhatHasBeenHurt),
    );
  });

  it.skip("Lost in the Woods: should parse card text", () => {
    const text =
      "All opposing characters get -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with modify-stat effect
    const lostInTheWoods: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lostInTheWoods),
    );
  });

  it.skip("Bruno's Return: should parse card text", () => {
    const text =
      "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const brunosReturn: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(brunosReturn),
    );
  });

  it.skip("World's Greatest Criminal Mind: should parse card text", () => {
    const text = "Banish chosen character with 5 {S} or more.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with banish effect
    const worldsGreatestCriminalMind: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(worldsGreatestCriminalMind),
    );
  });

  it.skip("Be Our Guest: should parse card text", () => {
    const text =
      "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with scry effect
    const beOurGuest: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "scry",
        amount: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beOurGuest),
    );
  });

  it.skip("Lantern: should parse card text", () => {
    const text =
      "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BIRTHDAY LIGHTS activated
    const birthdayLights: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BIRTHDAY LIGHTS",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(birthdayLights),
    );
  });

  it.skip("Ursula's Shell Necklace: should parse card text", () => {
    const text =
      "NOW, SING! Whenever you play a song, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW, SING! triggered
    const nowSing: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOW, SING!",
      trigger: {
        event: "play",
        timing: "whenever",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowSing),
    );
  });

  it.skip("Atlantica - Concert Hall: should parse card text", () => {
    const text =
      "UNDERWATER ACOUSTICS Characters count as having +2 cost to sing songs while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // UNDERWATER ACOUSTICS static
    const underwaterAcoustics: StaticAbilityDefinition = {
      type: "static",
      name: "UNDERWATER ACOUSTICS",
      effect: {
        type: "modify-stat",
        stat: "cost",
        modifier: 2,
        target: "ALL_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(underwaterAcoustics),
    );
  });

  it.skip("The Queen - Wicked and Vain: should parse card text", () => {
    const text = "I SUMMON THEE {E} — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I SUMMON THEE activated
    const iSummonThee: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I SUMMON THEE",
      cost: {
        exert: true,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iSummonThee),
    );
  });

  it.skip("Rafiki - Mystical Fighter: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S}.)\nANCIENT SKILLS Whenever he challenges a Hyena character, this character takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +3
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // Second ability: ANCIENT SKILLS triggered
    const ancientSkills: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ANCIENT SKILLS",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "prevention",
        prevents: "damage",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ancientSkills),
    );
  });

  it.skip("Ursula - Sea Witch: should parse card text", () => {
    const text =
      "YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU'RE TOO LATE triggered
    const youreTooLate: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'RE TOO LATE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreTooLate),
    );
  });

  it.skip("Jafar - Keeper of Secrets: should parse card text", () => {
    const text =
      "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIDDEN WONDERS static
    const hiddenWonders: StaticAbilityDefinition = {
      type: "static",
      name: "HIDDEN WONDERS",
      effect: {
        type: "for-each",
        count: "cards-in-hand",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hiddenWonders),
    );
  });

  it.skip("Belle - Untrained Mystic: should parse card text", () => {
    const text =
      "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HERE NOW, DON'T DO THAT triggered
    const hereNowDontDoThat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE NOW, DON'T DO THAT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereNowDontDoThat),
    );
  });

  it.skip("Belle - Accomplished Mystic: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nENHANCED HEALING When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ENHANCED HEALING triggered
    const enhancedHealing: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENHANCED HEALING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "move-damage",
        amount: 3,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(enhancedHealing),
    );
  });

  it.skip("Peter Pan's Shadow - Not Sewn On: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nTIPTOE Your other characters with Rush gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: TIPTOE static
    const tiptoe: StaticAbilityDefinition = {
      type: "static",
      name: "TIPTOE",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(tiptoe),
    );
  });

  it.skip("Elsa - Spirit of Winter: should parse card text", () => {
    const text =
      "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Elsa.)\nDEEP FREEZE When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: DEEP FREEZE triggered
    const deepFreeze: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DEEP FREEZE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(deepFreeze),
    );
  });

  it.skip("Ursula - Voice Stealer: should parse card text", () => {
    const text =
      "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SING FOR ME triggered
    const singForMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SING FOR ME",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singForMe),
    );
  });

  it.skip("Dumbo - Ninth Wonder of the Universe: should parse card text", () => {
    const text =
      'Evasive (Only characters with Evasive can challenge this character.)\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."';
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

    // Second ability: BREAKING RECORDS activated
    const breakingRecords: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BREAKING RECORDS",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(breakingRecords),
    );

    // Third ability: MAKING HISTORY static (grants ability)
    const makingHistory: StaticAbilityDefinition = {
      type: "static",
      name: "MAKING HISTORY",
      effect: {
        type: "grant-ability",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 1 },
          effect: { type: "sequence", effects: [] },
        },
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(makingHistory),
    );
  });

  it.skip("Dumbo - The Flying Elephant: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.";
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

    // Second ability: AERIAL DUO triggered
    const aerialDuo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AERIAL DUO",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(aerialDuo),
    );
  });

  it.skip("Timothy Q. Mouse - Flight Instructor: should parse card text", () => {
    const text =
      "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET'S SHOW 'EM, DUMBO! static
    const letsShowEmDumbo: StaticAbilityDefinition = {
      type: "static",
      name: "LET'S SHOW 'EM, DUMBO!",
      effect: {
        type: "conditional",
        condition: { type: "has-character-with-keyword", keyword: "Evasive" },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letsShowEmDumbo),
    );
  });

  it.skip("Elsa - Gloves Off: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S})";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +3 keyword
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Kuzco - Wanted Llama: should parse card text", () => {
    const text =
      "OK, WHERE AM I? When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OK, WHERE AM I? triggered
    const okWhereAmI: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OK, WHERE AM I?",
      trigger: {
        event: "banish",
        timing: "when",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(okWhereAmI),
    );
  });

  it.skip("Tick-Tock - Ever-Present Pursuer: should parse card text", () => {
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

  it.skip("Dolores Madrigal - Easy Listener: should parse card text", () => {
    const text =
      "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAGICAL INFORMANT triggered with condition
    const magicalInformant: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAGICAL INFORMANT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "opponent-has-exerted-character" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicalInformant),
    );
  });

  it.skip("Camilo Madrigal - Prankster: should parse card text", () => {
    const text =
      "MANY FORMS At the start of your turn, you may choose one:\n- This character gets +1 {L} this turn.\n- This character gains Challenger +2 this turn.\n(While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MANY FORMS triggered with modal effect
    const manyForms: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MANY FORMS",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "modal",
        options: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(manyForms),
    );
  });

  it.skip("Elsa - Snow Queen: should parse card text", () => {
    const text = "FREEZE {E} — Exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FREEZE activated
    const freeze: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FREEZE",
      cost: {
        exert: true,
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(freeze),
    );
  });

  it.skip("Genie - Supportive Friend: should parse card text", () => {
    const text =
      "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THREE WISHES triggered
    const threeWishes: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THREE WISHES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(threeWishes),
    );
  });

  it.skip("Mama Odie - Voice of Wisdom: should parse card text", () => {
    const text =
      "LISTEN TO YOUR MAMA NOW Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LISTEN TO YOUR MAMA NOW triggered
    const listenToYourMamaNow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LISTEN TO YOUR MAMA NOW",
      trigger: {
        event: "quest",
        timing: "whenever",
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
      expect.objectContaining(listenToYourMamaNow),
    );
  });

  it.skip("Luisa Madrigal - Magically Strong One: should parse card text", () => {
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

  it.skip("Jafar - Lamp Thief: should parse card text", () => {
    const text =
      "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I AM YOUR MASTER NOW triggered
    const iAmYourMasterNow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I AM YOUR MASTER NOW",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iAmYourMasterNow),
    );
  });

  it.skip("Second Star to the Right: should parse card text", () => {
    const text = "Sing Together 10 Chosen player draws 5 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 10 and draw effect
    const secondStarToTheRight: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "draw",
        amount: 5,
        target: "CHOSEN_PLAYER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(secondStarToTheRight),
    );
  });

  it.skip("Poor Unfortunate Souls: should parse card text", () => {
    const text =
      "Return chosen character, item, or location with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with return-to-hand effect
    const poorUnfortunateSouls: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(poorUnfortunateSouls),
    );
  });

  it.skip("Last-Ditch Effort: should parse card text", () => {
    const text =
      "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const lastDitchEffort: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lastDitchEffort),
    );
  });

  it.skip("I'm Stuck!: should parse card text", () => {
    const text =
      "Chosen exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with restriction effect
    const imStuck: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imStuck),
    );
  });

  it.skip("The Magic Feather: should parse card text", () => {
    const text =
      "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: NOW YOU CAN FLY! triggered
    const nowYouCanFly: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOW YOU CAN FLY!",
      trigger: {
        event: "play",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowYouCanFly),
    );

    // Second ability: GROUNDED activated
    const grounded: ActivatedAbilityDefinition = {
      type: "activated",
      name: "GROUNDED",
      cost: {
        ink: 3,
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(grounded),
    );
  });

  it.skip("Magic Mirror: should parse card text", () => {
    const text = "SPEAK! {E}, 4 {I} — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SPEAK! activated
    const speak: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SPEAK!",
      cost: {
        exert: true,
        ink: 4,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(speak));
  });

  it.skip("White Rabbit's Pocket Watch: should parse card text", () => {
    const text =
      "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M LATE! activated
    const imLate: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I'M LATE!",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imLate),
    );
  });

  it.skip("Rose Lantern: should parse card text", () => {
    const text =
      "MYSTICAL PETALS {E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL PETALS activated
    const mysticalPetals: ActivatedAbilityDefinition = {
      type: "activated",
      name: "MYSTICAL PETALS",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mysticalPetals),
    );
  });

  it.skip("Casa Madrigal - Casita: should parse card text", () => {
    const text =
      "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OUR HOME triggered with condition
    const ourHome: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OUR HOME",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-character-at-location" },
        effect: { type: "gain-lore", amount: 1 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ourHome),
    );
  });

  it.skip("Kuzco - Temperamental Emperor: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nNO TOUCHY! When this character is challenged and banished, you may banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward keyword
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: NO TOUCHY! triggered
    const noTouchy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NO TOUCHY!",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHALLENGING_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(noTouchy),
    );
  });

  it.skip("Cursed Merfolk - Ursula's Handiwork: should parse card text", () => {
    const text =
      "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // POOR SOULS triggered
    const poorSouls: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POOR SOULS",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(poorSouls),
    );
  });

  it.skip("Prince Phillip - Warden of the Woods: should parse card text", () => {
    const text =
      "SHINING BEACON Your other Hero characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHINING BEACON static
    const shiningBeacon: StaticAbilityDefinition = {
      type: "static",
      name: "SHINING BEACON",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shiningBeacon),
    );
  });

  it.skip("Prince Phillip - Vanquisher of Foes: should parse card text", () => {
    const text =
      "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)\nEvasive (Only characters with Evasive can challenge this character.)\nSWIFT AND SURE When you play this character, banish all opposing damaged characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 6
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: SWIFT AND SURE triggered
    const swiftAndSure: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWIFT AND SURE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "OPPOSING_DAMAGED_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(swiftAndSure),
    );
  });

  it.skip("Goofy - Set for Adventure: should parse card text", () => {
    const text =
      "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FAMILY VACATION triggered
    const familyVacation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FAMILY VACATION",
      trigger: {
        event: "move",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(familyVacation),
    );
  });

  it.skip("Max Goof - Rebellious Teen: should parse card text", () => {
    const text =
      "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PERSONAL SOUNDTRACK triggered
    const personalSoundtrack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PERSONAL SOUNDTRACK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          from: "discard",
          target: "SONG_CARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(personalSoundtrack),
    );
  });

  it.skip("Genie - Of the Lamp: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.";
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

    // Second ability: LET'S MAKE SOME MAGIC static
    const letsMakeSomeMagic: StaticAbilityDefinition = {
      type: "static",
      name: "LET'S MAKE SOME MAGIC",
      effect: {
        type: "conditional",
        condition: { type: "self-exerted" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "YOUR_OTHER_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letsMakeSomeMagic),
    );
  });

  it.skip("Max Goof - Chart Topper: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: NUMBER ONE HIT triggered
    const numberOneHit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NUMBER ONE HIT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(numberOneHit),
    );
  });

  it.skip("Bobby Zimuruski - Spray Cheese Kid: should parse card text", () => {
    const text =
      "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SO CHEESY triggered
    const soCheesy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SO CHEESY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(soCheesy),
    );
  });

  it.skip("Megara - Pulling the Strings: should parse card text", () => {
    const text =
      "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WONDER BOY triggered
    const wonderBoy: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WONDER BOY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wonderBoy),
    );
  });

  it.skip("Enchantress - Unexpected Judge: should parse card text", () => {
    const text =
      "TRUE FORM While being challenged, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TRUE FORM static
    const trueForm: StaticAbilityDefinition = {
      type: "static",
      name: "TRUE FORM",
      effect: {
        type: "conditional",
        condition: { type: "being-challenged" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(trueForm),
    );
  });

  it.skip("Donald Duck - Sleepwalker: should parse card text", () => {
    const text =
      "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLED AWAKE triggered
    const startledAwake: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STARTLED AWAKE",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(startledAwake),
    );
  });

  it.skip("Pegasus - Gift for Hercules: should parse card text", () => {
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

  it.skip("Donald Duck - Perfect Gentleman: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)\nALLOW ME At the start of your turn, each player may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ALLOW ME triggered
    const allowMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ALLOW ME",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(allowMe),
    );
  });

  it.skip("Heihei - Bumbling Rooster: should parse card text", () => {
    const text =
      "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FATTEN YOU UP triggered with condition
    const fattenYouUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FATTEN YOU UP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "opponent-has-more-ink" },
        effect: { type: "add-to-inkwell", from: "deck" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fattenYouUp),
    );
  });

  it.skip("Shenzi - Hyena Pack Leader: should parse card text", () => {
    const text =
      "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I'LL HANDLE THIS static
    const illHandleThis: StaticAbilityDefinition = {
      type: "static",
      name: "I'LL HANDLE THIS",
      effect: {
        type: "conditional",
        condition: { type: "at-location" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(illHandleThis),
    );

    // Second ability: WHAT'S THE HURRY? triggered
    const whatsTheHurry: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT'S THE HURRY?",
      trigger: {
        event: "challenge",
        timing: "whenever",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatsTheHurry),
    );
  });

  it.skip("Tinker Bell - Most Helpful: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPIXIE DUST When you play this character, chosen character gains Evasive this turn.";
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

    // Second ability: PIXIE DUST triggered
    const pixieDust: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PIXIE DUST",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(pixieDust),
    );
  });

  it.skip("John Silver - Alien Pirate: should parse card text", () => {
    const text =
      "PICK YOUR FIGHTS When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PICK YOUR FIGHTS triggered (multiple triggers)
    const pickYourFights: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PICK YOUR FIGHTS",
      trigger: {
        event: "play",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pickYourFights),
    );
  });

  it.skip("Ursula - Deceiver: should parse card text", () => {
    const text =
      "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU'LL NEVER EVEN MISS IT triggered
    const youllNeverEvenMissIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'LL NEVER EVEN MISS IT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youllNeverEvenMissIt),
    );
  });

  it.skip("Wildcat - Mechanic: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDISASSEMBLE {E} – Banish chosen item.";
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

    // Second ability: DISASSEMBLE activated
    const disassemble: ActivatedAbilityDefinition = {
      type: "activated",
      name: "DISASSEMBLE",
      cost: {
        exert: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(disassemble),
    );
  });

  it.skip("Aladdin - Prince Ali: should parse card text", () => {
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

  it.skip("Daisy Duck - Secret Agent: should parse card text", () => {
    const text =
      "THWART Whenever this character quests, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THWART triggered
    const thwart: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THWART",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thwart),
    );
  });

  it.skip("Stand Out: should parse card text", () => {
    const text =
      "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const standOut: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(standOut),
    );
  });

  it.skip("Sudden Chill: should parse card text", () => {
    const text = "Each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with discard effect
    const suddenChill: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "discard",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(suddenChill),
    );
  });

  it.skip("Improvise: should parse card text", () => {
    const text = "Chosen character gets +1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const improvise: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(improvise),
    );
  });

  it.skip("Under the Sea: should parse card text", () => {
    const text =
      "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 8
    const underTheSea: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(underTheSea),
    );
  });

  it.skip("Make the Potion: should parse card text", () => {
    const text =
      "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with modal effect
    const makeThePotion: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modal",
        options: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeThePotion),
    );
  });

  it.skip("Mother Knows Best: should parse card text", () => {
    const text = "Return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with return-to-hand effect
    const motherKnowsBest: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(motherKnowsBest),
    );
  });

  it.skip("Family Fishing Pole: should parse card text", () => {
    const text =
      "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WATCH CLOSELY static
    const watchClosely: StaticAbilityDefinition = {
      type: "static",
      name: "WATCH CLOSELY",
      effect: {
        type: "enters-exerted",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(watchClosely),
    );

    // Second ability: THE PERFECT CAST activated
    const thePerfectCast: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE PERFECT CAST",
      cost: {
        exert: true,
        ink: 1,
        sacrifice: true,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thePerfectCast),
    );
  });

  it.skip("Signed Contract: should parse card text", () => {
    const text =
      "FINE PRINT Whenever an opponent plays a song, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FINE PRINT triggered
    const finePrint: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FINE PRINT",
      trigger: {
        event: "play",
        timing: "whenever",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(finePrint),
    );
  });

  it.skip("Hidden Cove - Tranquil Haven: should parse card text", () => {
    const text =
      "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // REVITALIZING WATERS static
    const revitalizingWaters: StaticAbilityDefinition = {
      type: "static",
      name: "REVITALIZING WATERS",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(revitalizingWaters),
    );
  });

  it.skip("LeFou - Instigator: should parse card text", () => {
    const text =
      "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FAN THE FLAMES triggered
    const fanTheFlames: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FAN THE FLAMES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fanTheFlames),
    );
  });

  it.skip("Shere Khan - Menacing Predator: should parse card text", () => {
    const text =
      "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T INSULT MY INTELLIGENCE triggered
    const dontInsultMyIntelligence: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DON'T INSULT MY INTELLIGENCE",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dontInsultMyIntelligence),
    );
  });

  it.skip("Maui - Whale: should parse card text", () => {
    const text =
      "THIS MISSION IS CURSED This character can't ready at the start of your turn.\nI GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: THIS MISSION IS CURSED static
    const thisMissionIsCursed: StaticAbilityDefinition = {
      type: "static",
      name: "THIS MISSION IS CURSED",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisMissionIsCursed),
    );

    // Second ability: I GOT YOUR BACK activated
    const iGotYourBack: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I GOT YOUR BACK",
      cost: {
        ink: 2,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iGotYourBack),
    );
  });

  it.skip("Ariel - Adventurous Collector: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.) INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.";
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

    // Second ability: INSPIRING VOICE triggered
    const inspiringVoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INSPIRING VOICE",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(inspiringVoice),
    );
  });

  it.skip("Maleficent - Monstrous Dragon: should parse card text", () => {
    const text =
      "DRAGON FIRE When you play this character, you may banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DRAGON FIRE triggered
    const dragonFire: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DRAGON FIRE",
      trigger: {
        event: "play",
        timing: "when",
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
      expect.objectContaining(dragonFire),
    );
  });

  it.skip("Powerline - Taking the Stage: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 4 keyword
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 4,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Powerline - World's Greatest Rock Star: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Singer 9
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 9,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(singer),
    );

    // Third ability: MASH-UP triggered
    const mashUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MASH-UP",
      trigger: {
        event: "sing",
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 4,
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(mashUp),
    );
  });

  it.skip("Mickey Mouse - Brave Little Prince: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: CROWNING ACHIEVEMENT static
    const crowningAchievement: StaticAbilityDefinition = {
      type: "static",
      name: "CROWNING ACHIEVEMENT",
      effect: {
        type: "conditional",
        condition: { type: "has-card-under" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(crowningAchievement),
    );
  });

  it.skip("Max Goof - Rockin' Teen: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 5
    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );

    // Second ability: I JUST WANNA STAY HOME static
    const iJustWannaStayHome: StaticAbilityDefinition = {
      type: "static",
      name: "I JUST WANNA STAY HOME",
      effect: {
        type: "restriction",
        restriction: "cant-move",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iJustWannaStayHome),
    );
  });

  it.skip("Roxanne - Powerline Fan: should parse card text", () => {
    const text =
      "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONCERT LOVER static with condition
    const concertLover: StaticAbilityDefinition = {
      type: "static",
      name: "CONCERT LOVER",
      effect: {
        type: "conditional",
        condition: { type: "has-character-with-keyword", keyword: "Singer" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(concertLover),
    );
  });

  it.skip("P.J. Pete - Caught Up in the Music: should parse card text", () => {
    const text =
      "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHOUT OUT LOUD! triggered
    const shoutOutLoud: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHOUT OUT LOUD!",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shoutOutLoud),
    );
  });

  it.skip("Gaston - Arrogant Hunter: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Reckless keyword
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Moana - Undeterred Voyager: should parse card text", () => {
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

  it.skip("Powerline - Musical Superstar: should parse card text", () => {
    const text =
      "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ELECTRIC MOVE static with condition
    const electricMove: StaticAbilityDefinition = {
      type: "static",
      name: "ELECTRIC MOVE",
      effect: {
        type: "conditional",
        condition: { type: "played-song-this-turn" },
        effect: { type: "gain-keyword", keyword: "Rush", target: "SELF" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(electricMove),
    );
  });

  it.skip("Sisu - Emboldened Warrior: should parse card text", () => {
    const text =
      "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SURGE OF POWER static
    const surgeOfPower: StaticAbilityDefinition = {
      type: "static",
      name: "SURGE OF POWER",
      effect: {
        type: "for-each",
        count: "cards-in-opponents-hands",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(surgeOfPower),
    );
  });

  it.skip("Sisu - Daring Visitor: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nBRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.";
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

    // Second ability: BRING ON THE HEAT! triggered
    const bringOnTheHeat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BRING ON THE HEAT!",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bringOnTheHeat),
    );
  });

  it.skip("Queen of Hearts - Sensing Weakness: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)\nLET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LET THE GAME BEGIN triggered
    const letTheGameBegin: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LET THE GAME BEGIN",
      trigger: {
        event: "challenge",
        timing: "whenever",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letTheGameBegin),
    );
  });

  it.skip("Lumiere - Fiery Friend: should parse card text", () => {
    const text = "FERVENT ADDRESS Your other characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FERVENT ADDRESS static
    const ferventAddress: StaticAbilityDefinition = {
      type: "static",
      name: "FERVENT ADDRESS",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ferventAddress),
    );
  });

  it.skip("Queen of Hearts - Impulsive Ruler: should parse card text", () => {
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

  it.skip("Rapunzel - Letting Down Her Hair: should parse card text", () => {
    const text =
      "TANGLE When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TANGLE triggered
    const tangle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TANGLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tangle),
    );
  });

  it.skip("Mulan - Injured Soldier: should parse card text", () => {
    const text = "BATTLE WOUND This character enters play with 2 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BATTLE WOUND static (enters play with damage)
    const battleWound: StaticAbilityDefinition = {
      type: "static",
      name: "BATTLE WOUND",
      effect: {
        type: "enters-with-damage",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(battleWound),
    );
  });

  it.skip("Mulan - Elite Archer: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nSTRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.\nTRIPLE SHOT During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5 keyword
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: STRAIGHT SHOOTER triggered with Shift condition
    const straightShooter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STRAIGHT SHOOTER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(straightShooter),
    );

    // Third ability: TRIPLE SHOT triggered on damage dealt
    const tripleShot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TRIPLE SHOT",
      trigger: {
        event: "damage-dealt",
        timing: "whenever",
      },
      effect: {
        type: "deal-damage",
        target: "CHOSEN_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(tripleShot),
    );
  });

  it.skip("Raya - Headstrong: should parse card text", () => {
    const text =
      "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOTE TO SELF, DON'T DIE triggered on banish with optional ready + restriction
    const noteToSelfDontDie: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOTE TO SELF, DON'T DIE",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(noteToSelfDontDie),
    );
  });

  it.skip("Tuk Tuk - Lively Partner: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.) ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ON A ROLL triggered on play with move + strength boost
    const onARoll: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ON A ROLL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(onARoll),
    );
  });

  it.skip("I2I: should parse card text", () => {
    const text =
      "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 9 keyword
    const singTogether: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Sing Together",
      cost: {
        ink: 9,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singTogether),
    );

    // Second ability: action effect with draw, lore gain, and conditional ready
    const i2iAction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(i2iAction),
    );
  });

  it.skip("You Can Fly!: should parse card text", () => {
    const text =
      "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Evasive until start of next turn
    const youCanFly: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youCanFly),
    );
  });

  it.skip("A Pirate's Life: should parse card text", () => {
    const text = "Sing Together 6 Each opponent loses 2 lore. You gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 6 keyword
    const singTogether: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Sing Together",
      cost: {
        ink: 6,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singTogether),
    );

    // Second ability: action effect with lore loss and lore gain
    const piratesLifeAction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(piratesLifeAction),
    );
  });

  it.skip("Be King Undisputed: should parse card text", () => {
    const text = "Each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: opponent chooses and banishes their own character
    const beKingUndisputed: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "OPPONENT_CHOOSES_OWN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beKingUndisputed),
    );
  });

  it.skip("Medallion Weights: should parse card text", () => {
    const text =
      "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DISCIPLINE AND STRENGTH activated with exert + ink cost
    const disciplineAndStrength: ActivatedAbilityDefinition = {
      type: "activated",
      name: "DISCIPLINE AND STRENGTH",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(disciplineAndStrength),
    );
  });

  it.skip("Dinner Bell: should parse card text", () => {
    const text =
      "YOU KNOW WHAT HAPPENS {E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU KNOW WHAT HAPPENS activated with draw based on damage + banish
    const youKnowWhatHappens: ActivatedAbilityDefinition = {
      type: "activated",
      name: "YOU KNOW WHAT HAPPENS",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youKnowWhatHappens),
    );
  });

  it.skip("Anna - True-Hearted: should parse card text", () => {
    const text =
      "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET ME HELP YOU triggered on quest with lore buff for Heroes
    const letMeHelpYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LET ME HELP YOU",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_HERO_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letMeHelpYou),
    );
  });

  it.skip("Huey - Savvy Nephew: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nTHREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support keyword
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: THREE NEPHEWS triggered on quest with conditional draw
    const threeNephews: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THREE NEPHEWS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-characters-named", names: ["Dewey", "Louie"] },
        effect: { type: "draw", amount: 3, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(threeNephews),
    );
  });

  it.skip("Dewey - Showy Nephew: should parse card text", () => {
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

  it.skip("Louie - Chill Nephew: should parse card text", () => {
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

  it.skip("Alice - Accidentally Adrift: should parse card text", () => {
    const text =
      "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WASHED AWAY triggered on play with inkwell move
    const washedAway: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WASHED AWAY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-to-inkwell",
          target: "CHOSEN_ITEM",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(washedAway),
    );

    // Second ability: MAKING WAVES triggered on quest with strength debuff
    const makingWaves: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAKING WAVES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(makingWaves),
    );
  });

  it.skip("Mulan - Considerate Diplomat: should parse card text", () => {
    const text =
      "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IMPERIAL INVITATION triggered on quest with look/reveal/draw
    const imperialInvitation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IMPERIAL INVITATION",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "look",
        amount: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imperialInvitation),
    );
  });

  it.skip("Cruella De Vil - Style Icon: should parse card text", () => {
    const text =
      "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: OUT OF SEASON triggered on banish with inkwell effect
    const outOfSeason: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OUT OF SEASON",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "add-to-inkwell",
        from: "deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(outOfSeason),
    );

    // Second ability: INSULTING REMARK static with strength debuff
    const insultingRemark: StaticAbilityDefinition = {
      type: "static",
      name: "INSULTING REMARK",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(insultingRemark),
    );
  });

  it.skip("Cruella De Vil - Fashionable Cruiser: should parse card text", () => {
    const text =
      "NOW GET GOING During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW GET GOING static with conditional Evasive during your turn
    const nowGetGoing: StaticAbilityDefinition = {
      type: "static",
      name: "NOW GET GOING",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowGetGoing),
    );
  });

  it.skip("Anna - Braving the Storm: should parse card text", () => {
    const text =
      "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I WAS BORN READY static with conditional lore buff
    const iWasBornReady: StaticAbilityDefinition = {
      type: "static",
      name: "I WAS BORN READY",
      effect: {
        type: "conditional",
        condition: { type: "has-other-hero-character" },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWasBornReady),
    );
  });

  it.skip("Hans - Noble Scoundrel: should parse card text", () => {
    const text =
      "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ROYAL SCHEMES triggered on play with conditional lore gain
    const royalSchemes: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYAL SCHEMES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-princess-or-queen" },
        effect: { type: "gain-lore", amount: 1 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalSchemes),
    );
  });

  it.skip("The Queen - Mirror Seeker: should parse card text", () => {
    const text =
      "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CALCULATING AND VAIN triggered on quest with scry effect
    const calculatingAndVain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CALCULATING AND VAIN",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "scry",
          amount: 3,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(calculatingAndVain),
    );
  });

  it.skip("Grand Pabbie - Oldest and Wisest: should parse card text", () => {
    const text =
      "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ANCIENT INSIGHT triggered on damage removal with lore gain
    const ancientInsight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ANCIENT INSIGHT",
      trigger: {
        event: "remove-damage",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ancientInsight),
    );
  });

  it.skip("Hades - Infernal Schemer: should parse card text", () => {
    const text =
      "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IS THERE A DOWNSIDE TO THIS? triggered on play with inkwell move
    const isThereADownsideToThis: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IS THERE A DOWNSIDE TO THIS?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-to-inkwell",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(isThereADownsideToThis),
    );
  });

  it.skip("Mama Odie - Mystical Maven: should parse card text", () => {
    const text =
      "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THIS GOING TO BE GOOD triggered on song play with inkwell effect
    const thisGoingToBeGood: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS GOING TO BE GOOD",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-to-inkwell",
          from: "deck",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisGoingToBeGood),
    );
  });

  it.skip("Aurora - Dreaming Guardian: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Aurora.)\nPROTECTIVE EMBRACE Your other characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3 keyword
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: PROTECTIVE EMBRACE static with Ward grant
    const protectiveEmbrace: StaticAbilityDefinition = {
      type: "static",
      name: "PROTECTIVE EMBRACE",
      effect: {
        type: "grant-ability",
        ability: { type: "keyword", keyword: "Ward" },
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(protectiveEmbrace),
    );
  });

  it.skip("Aurora - Tranquil Princess: should parse card text", () => {
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

  it.skip("Jasmine - Heir of Agrabah: should parse card text", () => {
    const text =
      "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M A FAST LEARNER triggered on play with damage removal
    const imAFastLearner: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'M A FAST LEARNER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imAFastLearner),
    );
  });

  it.skip("Belle - Inventive Engineer: should parse card text", () => {
    const text =
      "TINKER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TINKER triggered on quest with cost reduction
    const tinker: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TINKER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tinker),
    );
  });

  it.skip("Judy Hopps - Optimistic Officer: should parse card text", () => {
    const text =
      "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T CALL ME CUTE triggered on play with optional banish + draw
    const dontCallMeCute: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DON'T CALL ME CUTE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dontCallMeCute),
    );
  });

  it.skip("Maid Marian - Delightful Dreamer: should parse card text", () => {
    const text =
      "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIGHBORN LADY triggered on play with strength debuff
    const highbornLady: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HIGHBORN LADY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(highbornLady),
    );
  });

  it.skip("Winnie the Pooh - Having a Think: should parse card text", () => {
    const text =
      "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HUNNY POT triggered on quest with optional inkwell effect
    const hunnyPot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HUNNY POT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-to-inkwell",
          from: "hand",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hunnyPot),
    );
  });

  it.skip("Alice - Growing Girl: should parse card text", () => {
    const text =
      "GOOD ADVICE Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nWHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: GOOD ADVICE static with Support grant
    const goodAdvice: StaticAbilityDefinition = {
      type: "static",
      name: "GOOD ADVICE",
      effect: {
        type: "grant-ability",
        ability: { type: "keyword", keyword: "Support" },
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goodAdvice),
    );

    // Second ability: WHAT DID I DO? static with conditional lore buff
    const whatDidIDo: StaticAbilityDefinition = {
      type: "static",
      name: "WHAT DID I DO?",
      effect: {
        type: "conditional",
        condition: { type: "has-strength", amount: 10 },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 4,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatDidIDo),
    );
  });

  it.skip("Robin Hood - Unrivaled Archer: should parse card text", () => {
    const text =
      "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FEED THE POOR triggered on play with conditional draw
    const feedThePoor: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FEED THE POOR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "opponent-has-more-cards" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(feedThePoor),
    );

    // Second ability: GOOD SHOT static with conditional Evasive
    const goodShot: StaticAbilityDefinition = {
      type: "static",
      name: "GOOD SHOT",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(goodShot),
    );
  });

  it.skip("Develop Your Brain: should parse card text", () => {
    const text =
      "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: look with selective draw
    const developYourBrain: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(developYourBrain),
    );
  });

  it.skip("Four Dozen Eggs: should parse card text", () => {
    const text =
      "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Resist +2 until next turn
    const fourDozenEggs: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fourDozenEggs),
    );
  });

  it.skip("One Jump Ahead: should parse card text", () => {
    const text =
      "Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: add top card to inkwell
    const oneJumpAhead: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "add-to-inkwell",
        from: "deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oneJumpAhead),
    );
  });

  it.skip("Dig a Little Deeper: should parse card text", () => {
    const text =
      "Sing Together 8 Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 8 keyword
    const singTogether: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Sing Together",
      cost: {
        ink: 8,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singTogether),
    );

    // Second ability: action with look/draw effect
    const digALittleDeeperAction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look",
        amount: 7,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(digALittleDeeperAction),
    );
  });

  it.skip("Aurelian Gyrosensor: should parse card text", () => {
    const text =
      "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEEKING KNOWLEDGE triggered on quest with scry effect
    const seekingKnowledge: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SEEKING KNOWLEDGE",
      trigger: {
        event: "quest",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "scry",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(seekingKnowledge),
    );
  });

  it.skip("Heart of Te Fiti: should parse card text", () => {
    const text =
      "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CREATE LIFE activated with exert + ink cost
    const createLife: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CREATE LIFE",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "add-to-inkwell",
        from: "deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(createLife),
    );
  });

  it.skip("Coconut Basket: should parse card text", () => {
    const text =
      "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONSIDER THE COCONUT triggered on character play with damage removal
    const considerTheCoconut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CONSIDER THE COCONUT",
      trigger: {
        event: "play",
        timing: "whenever",
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
      expect.objectContaining(considerTheCoconut),
    );
  });

  it.skip("Motunui - Island Paradise: should parse card text", () => {
    const text =
      "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // REINCARNATION triggered on banish at location with inkwell effect
    const reincarnation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "REINCARNATION",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-to-inkwell",
          target: "BANISHED_CARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reincarnation),
    );
  });

  it.skip("Philoctetes - No-Nonsense Instructor: should parse card text", () => {
    const text =
      "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU GOTTA STAY FOCUSED static with Challenger grant
    const youGottaStayFocused: StaticAbilityDefinition = {
      type: "static",
      name: "YOU GOTTA STAY FOCUSED",
      effect: {
        type: "grant-ability",
        ability: { type: "keyword", keyword: "Challenger", value: 1 },
        target: "YOUR_HERO_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youGottaStayFocused),
    );

    // Second ability: SHAMELESS PROMOTER triggered on Hero play with lore gain
    const shamelessPromoter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHAMELESS PROMOTER",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shamelessPromoter),
    );
  });

  it.skip("Mickey Mouse - Trumpeter: should parse card text", () => {
    const text = "SOUND THE CALL {E}, 2 {I} — Play a character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SOUND THE CALL activated with exert + ink cost
    const soundTheCall: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SOUND THE CALL",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "play-card",
        target: "CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(soundTheCall),
    );
  });

  it.skip("Nala - Undaunted Lioness: should parse card text", () => {
    const text =
      "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DETERMINED DIVERSION static with conditional lore buff and Resist
    const determinedDiversion: StaticAbilityDefinition = {
      type: "static",
      name: "DETERMINED DIVERSION",
      effect: {
        type: "conditional",
        condition: { type: "has-no-damage" },
        effect: { type: "sequence", effects: [] },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(determinedDiversion),
    );
  });

  it.skip("Lilo - Best Explorer Ever: should parse card text", () => {
    const text =
      "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)\nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: COME ON, PEOPLE, LET'S MOVE triggered on play
    const comeOnPeopleLetsMove: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "COME ON, PEOPLE, LET'S MOVE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(comeOnPeopleLetsMove),
    );

    // Second ability: GO GET 'EM triggered on quest
    const goGetEm: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GO GET 'EM",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(goGetEm),
    );
  });

  it.skip("Scar - Finally King: should parse card text", () => {
    const text =
      "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BE GRATEFUL static with strength buff
    const beGrateful: StaticAbilityDefinition = {
      type: "static",
      name: "BE GRATEFUL",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_ALLY_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beGrateful),
    );

    // Second ability: STICK WITH ME triggered at end of turn
    const stickWithMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STICK WITH ME",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: { type: "is-exerted" },
        effect: { type: "sequence", effects: [] },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stickWithMe),
    );
  });

  it.skip("Little John - Sir Reginald: should parse card text", () => {
    const text =
      "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT A BEAUTIFUL BRAWL! triggered on play with modal choice
    const whatABeautifulBrawl: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT A BEAUTIFUL BRAWL!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modal",
        options: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatABeautifulBrawl),
    );
  });

  it.skip("Robin Hood - Champion of Sherwood: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nSKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.\nTHE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3 keyword
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SKILLED COMBATANT triggered on banish
    const skilledCombatant: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SKILLED COMBATANT",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(skilledCombatant),
    );

    // Third ability: THE GOOD OF OTHERS triggered when this is banished
    const theGoodOfOthers: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE GOOD OF OTHERS",
      trigger: {
        event: "banish",
        timing: "when",
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
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(theGoodOfOthers),
    );
  });

  it.skip("Jasmine - Fearless Princess: should parse card text", () => {
    const text =
      "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TAKE THE LEAP static with Evasive during your turn
    const takeTheLeap: StaticAbilityDefinition = {
      type: "static",
      name: "TAKE THE LEAP",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(takeTheLeap),
    );

    // Second ability: NOW'S MY CHANCE activated with discard cost
    const nowsMyChance: ActivatedAbilityDefinition = {
      type: "activated",
      name: "NOW'S MY CHANCE",
      cost: {
        discard: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(nowsMyChance),
    );
  });

  it.skip("Benja - Guardian of the Dragon Gem: should parse card text", () => {
    const text =
      "WE HAVE A CHOICE When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WE HAVE A CHOICE triggered on play with optional banish
    const weHaveAChoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WE HAVE A CHOICE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_ITEM",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(weHaveAChoice),
    );
  });

  it.skip("Jafar - Royal Vizier: should parse card text", () => {
    const text =
      "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I DON'T TRUST HIM, SIRE static with Evasive during your turn
    const iDontTrustHimSire: StaticAbilityDefinition = {
      type: "static",
      name: "I DON'T TRUST HIM, SIRE",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iDontTrustHimSire),
    );
  });

  it.skip("Eeyore - Overstuffed Donkey: should parse card text", () => {
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

  it.skip("Robin Hood - Capable Fighter: should parse card text", () => {
    const text = "SKIRMISH {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SKIRMISH activated with exert cost
    const skirmish: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SKIRMISH",
      cost: {
        exert: true,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(skirmish),
    );
  });

  it.skip("Mickey Mouse - Standard Bearer: should parse card text", () => {
    const text =
      "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STAND STRONG triggered on play with Challenger grant
    const standStrong: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STAND STRONG",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(standStrong),
    );
  });

  it.skip("Hercules - Beloved Hero: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: Resist +1 keyword
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Lawrence - Jealous Manservant: should parse card text", () => {
    const text = "PAYBACK While this character has no damage, he gets +4 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PAYBACK static with conditional strength buff
    const payback: StaticAbilityDefinition = {
      type: "static",
      name: "PAYBACK",
      effect: {
        type: "conditional",
        condition: { type: "has-no-damage" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(payback),
    );
  });

  it.skip("Tinker Bell - Giant Fairy: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Tinker Bell.)\nROCK THE BOAT When you play this character, deal 1 damage to each opposing character.\nPUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4 keyword
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ROCK THE BOAT triggered on play
    const rockTheBoat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROCK THE BOAT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(rockTheBoat),
    );

    // Third ability: PUNY PIRATE! triggered on banish
    const punyPirate: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PUNY PIRATE!",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(punyPirate),
    );
  });

  it.skip("Tinker Bell - Tiny Tactician: should parse card text", () => {
    const text =
      "BATTLE PLANS {E} — Draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BATTLE PLANS activated with exert cost
    const battlePlans: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BATTLE PLANS",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(battlePlans),
    );
  });

  it.skip("Captain Hook - Captain of the Jolly Roger: should parse card text", () => {
    const text =
      "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DOUBLE THE POWDER! triggered on play with return to hand
    const doubleThePowder: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DOUBLE THE POWDER!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          from: "discard",
          target: "NAMED_CARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doubleThePowder),
    );
  });

  it.skip("Hercules - True Hero: should parse card text", () => {
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

  it.skip("John Silver - Greedy Treasure Seeker: should parse card text", () => {
    const text =
      "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CHART YOUR OWN COURSE static with for-each effect
    const chartYourOwnCourse: StaticAbilityDefinition = {
      type: "static",
      name: "CHART YOUR OWN COURSE",
      effect: {
        type: "for-each",
        count: "locations-in-play",
        effect: { type: "sequence", effects: [] },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chartYourOwnCourse),
    );
  });

  it.skip("Prince Eric - Dashing and Brave: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}).";
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

  it.skip("Ariel - Sonic Warrior: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Ariel.)\nAMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4 keyword
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: AMPLIFIED VOICE triggered on song play
    const amplifiedVoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AMPLIFIED VOICE",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 3,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(amplifiedVoice),
    );
  });

  it.skip("Ariel - Determined Mermaid: should parse card text", () => {
    const text =
      "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I WANT MORE triggered on song play with optional draw and discard
    const iWantMore: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I WANT MORE",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWantMore),
    );
  });

  it.skip("One Last Hope: should parse card text", () => {
    const text =
      "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Resist +2 with conditional bonus for Heroes
    const oneLastHope: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oneLastHope),
    );
  });

  it.skip("Smash: should parse card text", () => {
    const text = "Deal 3 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal 3 damage
    const smash: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(smash));
  });

  it.skip("I Find 'Em, I Flatten 'Em: should parse card text", () => {
    const text = "Banish all items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: banish all items
    const iFindEmIFlattenEm: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "ALL_ITEMS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iFindEmIFlattenEm),
    );
  });

  it.skip("Fire the Cannons!: should parse card text", () => {
    const text = "Deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal 2 damage
    const fireTheCannons: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fireTheCannons),
    );
  });

  it.skip("Strength of a Raging Fire: should parse card text", () => {
    const text =
      "Deal damage to chosen character equal to the number of characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal variable damage based on character count
    const strengthOfARagingFire: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: "characters-in-play",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(strengthOfARagingFire),
    );
  });

  it.skip("The Mob Song: should parse card text", () => {
    const text =
      "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 10 keyword
    const singTogether: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Sing Together",
      cost: {
        ink: 10,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singTogether),
    );

    // Second ability: action to deal damage
    const mobSongAction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTERS_OR_LOCATIONS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(mobSongAction),
    );
  });

  it.skip("Beast's Mirror: should parse card text", () => {
    const text =
      "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHOW ME activated with exert + ink cost
    const showMe: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SHOW ME",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "conditional",
        condition: { type: "no-cards-in-hand" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(showMe),
    );
  });

  it.skip("Maui's Place of Exile - Hidden Island: should parse card text", () => {
    const text =
      "ISOLATED Characters gain Resist +1 while here. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ISOLATED static with Resist grant at location
    const isolated: StaticAbilityDefinition = {
      type: "static",
      name: "ISOLATED",
      effect: {
        type: "grant-ability",
        ability: { type: "keyword", keyword: "Resist", value: 1 },
        target: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(isolated),
    );
  });
});
