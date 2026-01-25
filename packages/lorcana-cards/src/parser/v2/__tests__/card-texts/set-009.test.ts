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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NOW, SING!",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Atlantica - Concert Hall: should parse card text", () => {
    const text =
      "UNDERWATER ACOUSTICS Characters count as having +2 cost to sing songs while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // UNDERWATER ACOUSTICS static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "UNDERWATER ACOUSTICS",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("The Queen - Wicked and Vain: should parse card text", () => {
    const text = "I SUMMON THEE {E} — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I SUMMON THEE activated
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "I SUMMON THEE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("Rafiki - Mystical Fighter: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S}.)\nANCIENT SKILLS Whenever he challenges a Hyena character, this character takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      }),
    );

    // Second ability: ANCIENT SKILLS triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ANCIENT SKILLS",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "prevention",
        }),
      }),
    );
  });

  it.skip("Ursula - Sea Witch: should parse card text", () => {
    const text =
      "YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU'RE TOO LATE triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'RE TOO LATE",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Jafar - Keeper of Secrets: should parse card text", () => {
    const text =
      "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIDDEN WONDERS static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "HIDDEN WONDERS",
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("Belle - Untrained Mystic: should parse card text", () => {
    const text =
      "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HERE NOW, DON'T DO THAT triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HERE NOW, DON'T DO THAT",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "move-damage",
        }),
      }),
    );
  });

  it.skip("Belle - Accomplished Mystic: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nENHANCED HEALING When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.";
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

    // Second ability: ENHANCED HEALING triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ENHANCED HEALING",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "move-damage",
        }),
      }),
    );
  });

  it.skip("Peter Pan's Shadow - Not Sewn On: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nTIPTOE Your other characters with Rush gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: TIPTOE static
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TIPTOE",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Elsa - Spirit of Winter: should parse card text", () => {
    const text =
      "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Elsa.)\nDEEP FREEZE When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 6,
        }),
      }),
    );

    // Second ability: DEEP FREEZE triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DEEP FREEZE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Ursula - Voice Stealer: should parse card text", () => {
    const text =
      "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SING FOR ME triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SING FOR ME",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Dumbo - Ninth Wonder of the Universe: should parse card text", () => {
    const text =
      'Evasive (Only characters with Evasive can challenge this character.)\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: BREAKING RECORDS activated
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BREAKING RECORDS",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );

    // Third ability: MAKING HISTORY static (grants ability)
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "MAKING HISTORY",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );
  });

  it.skip("Dumbo - The Flying Elephant: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.";
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

    // Second ability: AERIAL DUO triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AERIAL DUO",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Timothy Q. Mouse - Flight Instructor: should parse card text", () => {
    const text =
      "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET'S SHOW 'EM, DUMBO! static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LET'S SHOW 'EM, DUMBO!",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Elsa - Gloves Off: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S})";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +3 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      }),
    );
  });

  it.skip("Kuzco - Wanted Llama: should parse card text", () => {
    const text =
      "OK, WHERE AM I? When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OK, WHERE AM I? triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OK, WHERE AM I?",
        trigger: expect.objectContaining({
          event: "banish",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Tick-Tock - Ever-Present Pursuer: should parse card text", () => {
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

  it.skip("Dolores Madrigal - Easy Listener: should parse card text", () => {
    const text =
      "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAGICAL INFORMANT triggered with condition
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MAGICAL INFORMANT",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Camilo Madrigal - Prankster: should parse card text", () => {
    const text =
      "MANY FORMS At the start of your turn, you may choose one:\n- This character gets +1 {L} this turn.\n- This character gains Challenger +2 this turn.\n(While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MANY FORMS triggered with modal effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MANY FORMS",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "modal",
        }),
      }),
    );
  });

  it.skip("Elsa - Snow Queen: should parse card text", () => {
    const text = "FREEZE {E} — Exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FREEZE activated
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "FREEZE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Genie - Supportive Friend: should parse card text", () => {
    const text =
      "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THREE WISHES triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THREE WISHES",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Mama Odie - Voice of Wisdom: should parse card text", () => {
    const text =
      "LISTEN TO YOUR MAMA NOW Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LISTEN TO YOUR MAMA NOW triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LISTEN TO YOUR MAMA NOW",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Luisa Madrigal - Magically Strong One: should parse card text", () => {
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

  it.skip("Jafar - Lamp Thief: should parse card text", () => {
    const text =
      "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I AM YOUR MASTER NOW triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I AM YOUR MASTER NOW",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "scry",
        }),
      }),
    );
  });

  it.skip("Second Star to the Right: should parse card text", () => {
    const text = "Sing Together 10 Chosen player draws 5 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 10 and draw effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("Poor Unfortunate Souls: should parse card text", () => {
    const text =
      "Return chosen character, item, or location with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with return-to-hand effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Last-Ditch Effort: should parse card text", () => {
    const text =
      "Exert chosen opposing character. Chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("I'm Stuck!: should parse card text", () => {
    const text =
      "Chosen exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with restriction effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("The Magic Feather: should parse card text", () => {
    const text =
      "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: NOW YOU CAN FLY! triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NOW YOU CAN FLY!",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Second ability: GROUNDED activated
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "GROUNDED",
        cost: expect.objectContaining({
          ink: 3,
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Magic Mirror: should parse card text", () => {
    const text = "SPEAK! {E}, 4 {I} — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SPEAK! activated
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SPEAK!",
        cost: expect.objectContaining({
          exert: true,
          ink: 4,
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("White Rabbit's Pocket Watch: should parse card text", () => {
    const text =
      "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M LATE! activated
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "I'M LATE!",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Rose Lantern: should parse card text", () => {
    const text =
      "MYSTICAL PETALS {E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MYSTICAL PETALS activated
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "MYSTICAL PETALS",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "move-damage",
        }),
      }),
    );
  });

  it.skip("Casa Madrigal - Casita: should parse card text", () => {
    const text =
      "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OUR HOME triggered with condition
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OUR HOME",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Kuzco - Temperamental Emperor: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nNO TOUCHY! When this character is challenged and banished, you may banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: NO TOUCHY! triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NO TOUCHY!",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Cursed Merfolk - Ursula's Handiwork: should parse card text", () => {
    const text =
      "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // POOR SOULS triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "POOR SOULS",
        trigger: expect.objectContaining({
          event: "challenged",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "discard",
        }),
      }),
    );
  });

  it.skip("Prince Phillip - Warden of the Woods: should parse card text", () => {
    const text =
      "SHINING BEACON Your other Hero characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHINING BEACON static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SHINING BEACON",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Prince Phillip - Vanquisher of Foes: should parse card text", () => {
    const text =
      "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)\nEvasive (Only characters with Evasive can challenge this character.)\nSWIFT AND SURE When you play this character, banish all opposing damaged characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 6
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 6,
        }),
      }),
    );

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: SWIFT AND SURE triggered
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SWIFT AND SURE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Goofy - Set for Adventure: should parse card text", () => {
    const text =
      "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FAMILY VACATION triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FAMILY VACATION",
        trigger: expect.objectContaining({
          event: "move",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Max Goof - Rebellious Teen: should parse card text", () => {
    const text =
      "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PERSONAL SOUNDTRACK triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PERSONAL SOUNDTRACK",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Genie - Of the Lamp: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.";
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

    // Second ability: LET'S MAKE SOME MAGIC static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LET'S MAKE SOME MAGIC",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Max Goof - Chart Topper: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.";
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

    // Second ability: NUMBER ONE HIT triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NUMBER ONE HIT",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Bobby Zimuruski - Spray Cheese Kid: should parse card text", () => {
    const text =
      "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SO CHEESY triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SO CHEESY",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Megara - Pulling the Strings: should parse card text", () => {
    const text =
      "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WONDER BOY triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WONDER BOY",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Enchantress - Unexpected Judge: should parse card text", () => {
    const text =
      "TRUE FORM While being challenged, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TRUE FORM static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TRUE FORM",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Donald Duck - Sleepwalker: should parse card text", () => {
    const text =
      "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STARTLED AWAKE triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STARTLED AWAKE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Pegasus - Gift for Hercules: should parse card text", () => {
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

  it.skip("Donald Duck - Perfect Gentleman: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)\nALLOW ME At the start of your turn, each player may draw a card.";
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

    // Second ability: ALLOW ME triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ALLOW ME",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("Heihei - Bumbling Rooster: should parse card text", () => {
    const text =
      "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FATTEN YOU UP triggered with condition
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FATTEN YOU UP",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Shenzi - Hyena Pack Leader: should parse card text", () => {
    const text =
      "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I'LL HANDLE THIS static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I'LL HANDLE THIS",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Second ability: WHAT'S THE HURRY? triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT'S THE HURRY?",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Tinker Bell - Most Helpful: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPIXIE DUST When you play this character, chosen character gains Evasive this turn.";
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

    // Second ability: PIXIE DUST triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PIXIE DUST",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("John Silver - Alien Pirate: should parse card text", () => {
    const text =
      "PICK YOUR FIGHTS When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PICK YOUR FIGHTS triggered (multiple triggers)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PICK YOUR FIGHTS",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Ursula - Deceiver: should parse card text", () => {
    const text =
      "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU'LL NEVER EVEN MISS IT triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'LL NEVER EVEN MISS IT",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Wildcat - Mechanic: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDISASSEMBLE {E} – Banish chosen item.";
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

    // Second ability: DISASSEMBLE activated
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "DISASSEMBLE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Aladdin - Prince Ali: should parse card text", () => {
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

  it.skip("Daisy Duck - Secret Agent: should parse card text", () => {
    const text =
      "THWART Whenever this character quests, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THWART triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THWART",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "discard",
        }),
      }),
    );
  });

  it.skip("Stand Out: should parse card text", () => {
    const text =
      "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Sudden Chill: should parse card text", () => {
    const text = "Each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with discard effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "discard",
        }),
      }),
    );
  });

  it.skip("Improvise: should parse card text", () => {
    const text = "Chosen character gets +1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Under the Sea: should parse card text", () => {
    const text =
      "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 8
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "put-on-bottom",
        }),
      }),
    );
  });

  it.skip("Make the Potion: should parse card text", () => {
    const text =
      "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with modal effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modal",
        }),
      }),
    );
  });

  it.skip("Mother Knows Best: should parse card text", () => {
    const text = "Return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with return-to-hand effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Family Fishing Pole: should parse card text", () => {
    const text =
      "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WATCH CLOSELY static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WATCH CLOSELY",
        effect: expect.objectContaining({
          type: "enters-exerted",
        }),
      }),
    );

    // Second ability: THE PERFECT CAST activated
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THE PERFECT CAST",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
          sacrifice: true,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Signed Contract: should parse card text", () => {
    const text =
      "FINE PRINT Whenever an opponent plays a song, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FINE PRINT triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FINE PRINT",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Hidden Cove - Tranquil Haven: should parse card text", () => {
    const text =
      "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // REVITALIZING WATERS static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "REVITALIZING WATERS",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("LeFou - Instigator: should parse card text", () => {
    const text =
      "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FAN THE FLAMES triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FAN THE FLAMES",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Shere Khan - Menacing Predator: should parse card text", () => {
    const text =
      "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T INSULT MY INTELLIGENCE triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DON'T INSULT MY INTELLIGENCE",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Maui - Whale: should parse card text", () => {
    const text =
      "THIS MISSION IS CURSED This character can't ready at the start of your turn.\nI GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: THIS MISSION IS CURSED static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "THIS MISSION IS CURSED",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );

    // Second ability: I GOT YOUR BACK activated
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "I GOT YOUR BACK",
        cost: expect.objectContaining({
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Ariel - Adventurous Collector: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.) INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.";
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

    // Second ability: INSPIRING VOICE triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "INSPIRING VOICE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Maleficent - Monstrous Dragon: should parse card text", () => {
    const text =
      "DRAGON FIRE When you play this character, you may banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DRAGON FIRE triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DRAGON FIRE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Powerline - Taking the Stage: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 4 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 4,
      }),
    );
  });

  it.skip("Powerline - World's Greatest Rock Star: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.";
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

    // Second ability: Singer 9
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 9,
      }),
    );

    // Third ability: MASH-UP triggered
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MASH-UP",
        trigger: expect.objectContaining({
          event: "sing",
        }),
        effect: expect.objectContaining({
          type: "scry",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Brave Little Prince: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

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

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: CROWNING ACHIEVEMENT static
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CROWNING ACHIEVEMENT",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Max Goof - Rockin' Teen: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 5,
      }),
    );

    // Second ability: I JUST WANNA STAY HOME static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I JUST WANNA STAY HOME",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Roxanne - Powerline Fan: should parse card text", () => {
    const text =
      "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONCERT LOVER static with condition
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CONCERT LOVER",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("P.J. Pete - Caught Up in the Music: should parse card text", () => {
    const text =
      "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHOUT OUT LOUD! triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHOUT OUT LOUD!",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Gaston - Arrogant Hunter: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Reckless keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );
  });

  it.skip("Moana - Undeterred Voyager: should parse card text", () => {
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

  it.skip("Powerline - Musical Superstar: should parse card text", () => {
    const text =
      "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ELECTRIC MOVE static with condition
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ELECTRIC MOVE",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Sisu - Emboldened Warrior: should parse card text", () => {
    const text =
      "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SURGE OF POWER static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SURGE OF POWER",
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("Sisu - Daring Visitor: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nBRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.";
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

    // Second ability: BRING ON THE HEAT! triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BRING ON THE HEAT!",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Queen of Hearts - Sensing Weakness: should parse card text", () => {
    const text =
      "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)\nLET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.";
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

    // Second ability: LET THE GAME BEGIN triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LET THE GAME BEGIN",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Lumiere - Fiery Friend: should parse card text", () => {
    const text = "FERVENT ADDRESS Your other characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FERVENT ADDRESS static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FERVENT ADDRESS",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Queen of Hearts - Impulsive Ruler: should parse card text", () => {
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

  it.skip("Rapunzel - Letting Down Her Hair: should parse card text", () => {
    const text =
      "TANGLE When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TANGLE triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TANGLE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "lose-lore",
        }),
      }),
    );
  });

  it.skip("Mulan - Injured Soldier: should parse card text", () => {
    const text = "BATTLE WOUND This character enters play with 2 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BATTLE WOUND static (enters play with damage)
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BATTLE WOUND",
        effect: expect.objectContaining({
          type: "enters-with-damage",
        }),
      }),
    );
  });

  it.skip("Mulan - Elite Archer: should parse card text", () => {
    const text =
      "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nSTRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.\nTRIPLE SHOT During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // Second ability: STRAIGHT SHOOTER triggered with Shift condition
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STRAIGHT SHOOTER",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Third ability: TRIPLE SHOT triggered on damage dealt
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TRIPLE SHOT",
        trigger: expect.objectContaining({
          event: "damage-dealt",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("Raya - Headstrong: should parse card text", () => {
    const text =
      "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOTE TO SELF, DON'T DIE triggered on banish with optional ready + restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NOTE TO SELF, DON'T DIE",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Tuk Tuk - Lively Partner: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.) ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: ON A ROLL triggered on play with move + strength boost
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ON A ROLL",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("I2I: should parse card text", () => {
    const text =
      "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 9 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Sing Together",
        cost: expect.objectContaining({
          ink: 9,
        }),
      }),
    );

    // Second ability: action effect with draw, lore gain, and conditional ready
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("You Can Fly!: should parse card text", () => {
    const text =
      "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Evasive until start of next turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("A Pirate's Life: should parse card text", () => {
    const text = "Sing Together 6 Each opponent loses 2 lore. You gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 6 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Sing Together",
        cost: expect.objectContaining({
          ink: 6,
        }),
      }),
    );

    // Second ability: action effect with lore loss and lore gain
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Be King Undisputed: should parse card text", () => {
    const text = "Each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: opponent chooses and banishes their own character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Medallion Weights: should parse card text", () => {
    const text =
      "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DISCIPLINE AND STRENGTH activated with exert + ink cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "DISCIPLINE AND STRENGTH",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Dinner Bell: should parse card text", () => {
    const text =
      "YOU KNOW WHAT HAPPENS {E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU KNOW WHAT HAPPENS activated with draw based on damage + banish
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "YOU KNOW WHAT HAPPENS",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Anna - True-Hearted: should parse card text", () => {
    const text =
      "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET ME HELP YOU triggered on quest with lore buff for Heroes
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LET ME HELP YOU",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Huey - Savvy Nephew: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nTHREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );

    // Second ability: THREE NEPHEWS triggered on quest with conditional draw
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THREE NEPHEWS",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Dewey - Showy Nephew: should parse card text", () => {
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

  it.skip("Louie - Chill Nephew: should parse card text", () => {
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

  it.skip("Alice - Accidentally Adrift: should parse card text", () => {
    const text =
      "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: WASHED AWAY triggered on play with inkwell move
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WASHED AWAY",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Second ability: MAKING WAVES triggered on quest with strength debuff
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MAKING WAVES",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Mulan - Considerate Diplomat: should parse card text", () => {
    const text =
      "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IMPERIAL INVITATION triggered on quest with look/reveal/draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IMPERIAL INVITATION",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "look",
        }),
      }),
    );
  });

  it.skip("Cruella De Vil - Style Icon: should parse card text", () => {
    const text =
      "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: OUT OF SEASON triggered on banish with inkwell effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OUT OF SEASON",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "add-to-inkwell",
        }),
      }),
    );

    // Second ability: INSULTING REMARK static with strength debuff
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "INSULTING REMARK",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Cruella De Vil - Fashionable Cruiser: should parse card text", () => {
    const text =
      "NOW GET GOING During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW GET GOING static with conditional Evasive during your turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "NOW GET GOING",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Anna - Braving the Storm: should parse card text", () => {
    const text =
      "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I WAS BORN READY static with conditional lore buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I WAS BORN READY",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Hans - Noble Scoundrel: should parse card text", () => {
    const text =
      "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ROYAL SCHEMES triggered on play with conditional lore gain
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROYAL SCHEMES",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("The Queen - Mirror Seeker: should parse card text", () => {
    const text =
      "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CALCULATING AND VAIN triggered on quest with scry effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CALCULATING AND VAIN",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Grand Pabbie - Oldest and Wisest: should parse card text", () => {
    const text =
      "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ANCIENT INSIGHT triggered on damage removal with lore gain
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ANCIENT INSIGHT",
        trigger: expect.objectContaining({
          event: "remove-damage",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Hades - Infernal Schemer: should parse card text", () => {
    const text =
      "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IS THERE A DOWNSIDE TO THIS? triggered on play with inkwell move
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IS THERE A DOWNSIDE TO THIS?",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Mama Odie - Mystical Maven: should parse card text", () => {
    const text =
      "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THIS GOING TO BE GOOD triggered on song play with inkwell effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THIS GOING TO BE GOOD",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Aurora - Dreaming Guardian: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Aurora.)\nPROTECTIVE EMBRACE Your other characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Second ability: PROTECTIVE EMBRACE static with Ward grant
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PROTECTIVE EMBRACE",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );
  });

  it.skip("Aurora - Tranquil Princess: should parse card text", () => {
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

  it.skip("Jasmine - Heir of Agrabah: should parse card text", () => {
    const text =
      "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M A FAST LEARNER triggered on play with damage removal
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I'M A FAST LEARNER",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Belle - Inventive Engineer: should parse card text", () => {
    const text =
      "TINKER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TINKER triggered on quest with cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TINKER",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );
  });

  it.skip("Judy Hopps - Optimistic Officer: should parse card text", () => {
    const text =
      "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T CALL ME CUTE triggered on play with optional banish + draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DON'T CALL ME CUTE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Maid Marian - Delightful Dreamer: should parse card text", () => {
    const text =
      "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HIGHBORN LADY triggered on play with strength debuff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HIGHBORN LADY",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Winnie the Pooh - Having a Think: should parse card text", () => {
    const text =
      "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HUNNY POT triggered on quest with optional inkwell effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HUNNY POT",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Alice - Growing Girl: should parse card text", () => {
    const text =
      "GOOD ADVICE Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nWHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: GOOD ADVICE static with Support grant
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "GOOD ADVICE",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );

    // Second ability: WHAT DID I DO? static with conditional lore buff
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WHAT DID I DO?",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Robin Hood - Unrivaled Archer: should parse card text", () => {
    const text =
      "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FEED THE POOR triggered on play with conditional draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FEED THE POOR",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Second ability: GOOD SHOT static with conditional Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "GOOD SHOT",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Develop Your Brain: should parse card text", () => {
    const text =
      "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: look with selective draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "look",
        }),
      }),
    );
  });

  it.skip("Four Dozen Eggs: should parse card text", () => {
    const text =
      "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Resist +2 until next turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("One Jump Ahead: should parse card text", () => {
    const text =
      "Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: add top card to inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "add-to-inkwell",
        }),
      }),
    );
  });

  it.skip("Dig a Little Deeper: should parse card text", () => {
    const text =
      "Sing Together 8 Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 8 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Sing Together",
        cost: expect.objectContaining({
          ink: 8,
        }),
      }),
    );

    // Second ability: action with look/draw effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "look",
        }),
      }),
    );
  });

  it.skip("Aurelian Gyrosensor: should parse card text", () => {
    const text =
      "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEEKING KNOWLEDGE triggered on quest with scry effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SEEKING KNOWLEDGE",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Heart of Te Fiti: should parse card text", () => {
    const text =
      "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CREATE LIFE activated with exert + ink cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "CREATE LIFE",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "add-to-inkwell",
        }),
      }),
    );
  });

  it.skip("Coconut Basket: should parse card text", () => {
    const text =
      "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONSIDER THE COCONUT triggered on character play with damage removal
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CONSIDER THE COCONUT",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Motunui - Island Paradise: should parse card text", () => {
    const text =
      "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // REINCARNATION triggered on banish at location with inkwell effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REINCARNATION",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Philoctetes - No-Nonsense Instructor: should parse card text", () => {
    const text =
      "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU GOTTA STAY FOCUSED static with Challenger grant
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YOU GOTTA STAY FOCUSED",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );

    // Second ability: SHAMELESS PROMOTER triggered on Hero play with lore gain
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHAMELESS PROMOTER",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Trumpeter: should parse card text", () => {
    const text = "SOUND THE CALL {E}, 2 {I} — Play a character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SOUND THE CALL activated with exert + ink cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SOUND THE CALL",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("Nala - Undaunted Lioness: should parse card text", () => {
    const text =
      "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DETERMINED DIVERSION static with conditional lore buff and Resist
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "DETERMINED DIVERSION",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Lilo - Best Explorer Ever: should parse card text", () => {
    const text =
      "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)\nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: COME ON, PEOPLE, LET'S MOVE triggered on play
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "COME ON, PEOPLE, LET'S MOVE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Second ability: GO GET 'EM triggered on quest
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GO GET 'EM",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Scar - Finally King: should parse card text", () => {
    const text =
      "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BE GRATEFUL static with strength buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BE GRATEFUL",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Second ability: STICK WITH ME triggered at end of turn
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STICK WITH ME",
        trigger: expect.objectContaining({
          event: "end-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Little John - Sir Reginald: should parse card text", () => {
    const text =
      "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT A BEAUTIFUL BRAWL! triggered on play with modal choice
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT A BEAUTIFUL BRAWL!",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modal",
        }),
      }),
    );
  });

  it.skip("Robin Hood - Champion of Sherwood: should parse card text", () => {
    const text =
      "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nSKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.\nTHE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Second ability: SKILLED COMBATANT triggered on banish
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SKILLED COMBATANT",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );

    // Third ability: THE GOOD OF OTHERS triggered when this is banished
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THE GOOD OF OTHERS",
        trigger: expect.objectContaining({
          event: "banish",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Jasmine - Fearless Princess: should parse card text", () => {
    const text =
      "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TAKE THE LEAP static with Evasive during your turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TAKE THE LEAP",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Second ability: NOW'S MY CHANCE activated with discard cost
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "NOW'S MY CHANCE",
        cost: expect.objectContaining({
          discard: 1,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Benja - Guardian of the Dragon Gem: should parse card text", () => {
    const text =
      "WE HAVE A CHOICE When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WE HAVE A CHOICE triggered on play with optional banish
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WE HAVE A CHOICE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Jafar - Royal Vizier: should parse card text", () => {
    const text =
      "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I DON'T TRUST HIM, SIRE static with Evasive during your turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I DON'T TRUST HIM, SIRE",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Eeyore - Overstuffed Donkey: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        amount: 1,
      }),
    );
  });

  it.skip("Robin Hood - Capable Fighter: should parse card text", () => {
    const text = "SKIRMISH {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SKIRMISH activated with exert cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SKIRMISH",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Standard Bearer: should parse card text", () => {
    const text =
      "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STAND STRONG triggered on play with Challenger grant
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STAND STRONG",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Hercules - Beloved Hero: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: Resist +1 keyword
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        amount: 1,
      }),
    );
  });

  it.skip("Lawrence - Jealous Manservant: should parse card text", () => {
    const text = "PAYBACK While this character has no damage, he gets +4 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PAYBACK static with conditional strength buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PAYBACK",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Tinker Bell - Giant Fairy: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Tinker Bell.)\nROCK THE BOAT When you play this character, deal 1 damage to each opposing character.\nPUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 4,
        }),
      }),
    );

    // Second ability: ROCK THE BOAT triggered on play
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROCK THE BOAT",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );

    // Third ability: PUNY PIRATE! triggered on banish
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PUNY PIRATE!",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Tinker Bell - Tiny Tactician: should parse card text", () => {
    const text =
      "BATTLE PLANS {E} — Draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BATTLE PLANS activated with exert cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BATTLE PLANS",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Captain Hook - Captain of the Jolly Roger: should parse card text", () => {
    const text =
      "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DOUBLE THE POWDER! triggered on play with return to hand
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DOUBLE THE POWDER!",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Hercules - True Hero: should parse card text", () => {
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

  it.skip("John Silver - Greedy Treasure Seeker: should parse card text", () => {
    const text =
      "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CHART YOUR OWN COURSE static with for-each effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CHART YOUR OWN COURSE",
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("Prince Eric - Dashing and Brave: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}).";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +2 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        amount: 2,
      }),
    );
  });

  it.skip("Ariel - Sonic Warrior: should parse card text", () => {
    const text =
      "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Ariel.)\nAMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 4,
        }),
      }),
    );

    // Second ability: AMPLIFIED VOICE triggered on song play
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AMPLIFIED VOICE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Ariel - Determined Mermaid: should parse card text", () => {
    const text =
      "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I WANT MORE triggered on song play with optional draw and discard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WANT MORE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("One Last Hope: should parse card text", () => {
    const text =
      "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Resist +2 with conditional bonus for Heroes
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Smash: should parse card text", () => {
    const text = "Deal 3 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal 3 damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("I Find 'Em, I Flatten 'Em: should parse card text", () => {
    const text = "Banish all items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: banish all items
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Fire the Cannons!: should parse card text", () => {
    const text = "Deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal 2 damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("Strength of a Raging Fire: should parse card text", () => {
    const text =
      "Deal damage to chosen character equal to the number of characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal variable damage based on character count
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("The Mob Song: should parse card text", () => {
    const text =
      "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Sing Together 10 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Sing Together",
        cost: expect.objectContaining({
          ink: 10,
        }),
      }),
    );

    // Second ability: action to deal damage
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("Beast's Mirror: should parse card text", () => {
    const text =
      "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHOW ME activated with exert + ink cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SHOW ME",
        cost: expect.objectContaining({
          exert: true,
          ink: 3,
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Maui's Place of Exile - Hidden Island: should parse card text", () => {
    const text =
      "ISOLATED Characters gain Resist +1 while here. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ISOLATED static with Resist grant at location
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ISOLATED",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );
  });
});
