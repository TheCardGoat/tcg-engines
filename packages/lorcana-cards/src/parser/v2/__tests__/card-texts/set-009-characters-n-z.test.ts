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

describe("Set 009 Card Text Parser Tests - Characters N Z", () => {
  it.skip("The Queen - Conceited Ruler: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: ROYAL SUMMONS triggered
    const royalSummons = {
      effect: {
        effect: {
          type: "sequence",
          effects: [],
        },
        type: "optional",
      },
      name: "ROYAL SUMMONS",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
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
    const twilightBark = {
      cost: {
        ink: 2,
      },
      effect: {
        condition: { type: "card-type", cardType: "character" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
        type: "conditional",
      },
      name: "TWILIGHT BARK",
      type: "activated",
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
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ADORING FANS triggered
    const adoringFans = {
      effect: {
        effect: {
          type: "sequence",
          effects: [],
        },
        type: "optional",
      },
      name: "ADORING FANS",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(adoringFans),
    );
  });

  it.skip("Rapunzel - Sunshine: should parse card text", () => {
    const text =
      "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAGIC HAIR activated
    const magicHair = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      name: "MAGIC HAIR",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicHair),
    );
  });

  it.skip("Tinker Bell - Generous Fairy: should parse card text", () => {
    const text =
      "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MAKE A NEW FRIEND triggered
    const makeANewFriend = {
      effect: {
        amount: 4,
        type: "scry",
      },
      name: "MAKE A NEW FRIEND",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Third ability: GUARD DOG triggered
    const guardDog = {
      effect: {
        amount: 3,
        target: "SELF",
        type: "remove-damage",
      },
      name: "GUARD DOG",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(guardDog),
    );
  });

  it.skip("Pluto - Rescue Dog: should parse card text", () => {
    const text =
      "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TO THE RESCUE triggered
    const toTheRescue = {
      effect: {
        effect: {
          type: "remove-damage",
          amount: 3,
          target: "YOUR_CHARACTERS",
        },
        type: "optional",
      },
      name: "TO THE RESCUE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Pluto - Friendly Pooch: should parse card text", () => {
    const text =
      "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GOOD DOG activated
    const goodDog = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      name: "GOOD DOG",
      type: "activated",
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
      keyword: "Singer",
      type: "keyword",
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
    const allWaysHereAreMyWays = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      name: "ALL WAYS HERE ARE MY WAYS",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
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
    const ohana = {
      effect: {
        condition: { type: "character-count", count: 2 },
        effect: { type: "draw", amount: 2, target: "CONTROLLER" },
        type: "conditional",
      },
      name: "OHANA",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ohana));
  });

  it.skip("World's Greatest Criminal Mind: should parse card text", () => {
    const text = "Banish chosen character with 5 {S} or more.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with banish effect
    const worldsGreatestCriminalMind = {
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "banish",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(worldsGreatestCriminalMind),
    );
  });

  it.skip("Ursula's Shell Necklace: should parse card text", () => {
    const text =
      "NOW, SING! Whenever you play a song, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW, SING! triggered
    const nowSing = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "NOW, SING!",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowSing),
    );
  });

  it.skip("The Queen - Wicked and Vain: should parse card text", () => {
    const text = "I SUMMON THEE {E} — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I SUMMON THEE activated
    const iSummonThee = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "I SUMMON THEE",
      type: "activated",
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
      keyword: "Challenger",
      type: "keyword",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // Second ability: ANCIENT SKILLS triggered
    const ancientSkills = {
      effect: {
        prevents: "damage",
        target: "SELF",
        type: "prevention",
      },
      name: "ANCIENT SKILLS",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
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
    const youreTooLate = {
      effect: {
        restriction: "cant-ready",
        target: "CHOSEN_CHARACTER",
        type: "restriction",
      },
      name: "YOU'RE TOO LATE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreTooLate),
    );
  });

  it.skip("Peter Pan's Shadow - Not Sewn On: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nTIPTOE Your other characters with Rush gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: TIPTOE static
    const tiptoe = {
      effect: {
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      name: "TIPTOE",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(tiptoe),
    );
  });

  it.skip("Ursula - Voice Stealer: should parse card text", () => {
    const text =
      "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SING FOR ME triggered
    const singForMe = {
      effect: {
        effects: [],
        type: "sequence",
      },
      name: "SING FOR ME",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singForMe),
    );
  });

  it.skip("Timothy Q. Mouse - Flight Instructor: should parse card text", () => {
    const text =
      "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET'S SHOW 'EM, DUMBO! static
    const letsShowEmDumbo = {
      effect: {
        condition: { type: "has-character-with-keyword", keyword: "Evasive" },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
        type: "conditional",
      },
      name: "LET'S SHOW 'EM, DUMBO!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letsShowEmDumbo),
    );
  });

  it.skip("Tick-Tock - Ever-Present Pursuer: should parse card text", () => {
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

  it.skip("Second Star to the Right: should parse card text", () => {
    const text = "Sing Together 10 Chosen player draws 5 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 10 and draw effect
    const secondStarToTheRight = {
      effect: {
        amount: 5,
        target: "CHOSEN_PLAYER",
        type: "draw",
      },
      type: "action",
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
    const poorUnfortunateSouls = {
      effect: {
        target: "CHOSEN_CARD",
        type: "return-to-hand",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(poorUnfortunateSouls),
    );
  });

  it.skip("The Magic Feather: should parse card text", () => {
    const text =
      "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: NOW YOU CAN FLY! triggered
    const nowYouCanFly = {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "NOW YOU CAN FLY!",
      trigger: {
        event: "play",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowYouCanFly),
    );

    // Second ability: GROUNDED activated
    const grounded = {
      cost: {
        ink: 3,
      },
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "GROUNDED",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(grounded),
    );
  });

  it.skip("White Rabbit's Pocket Watch: should parse card text", () => {
    const text =
      "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M LATE! activated
    const imLate = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "I'M LATE!",
      type: "activated",
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
    const mysticalPetals = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
        type: "move-damage",
      },
      name: "MYSTICAL PETALS",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mysticalPetals),
    );
  });

  it.skip("Prince Phillip - Warden of the Woods: should parse card text", () => {
    const text =
      "SHINING BEACON Your other Hero characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHINING BEACON static
    const shiningBeacon = {
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      name: "SHINING BEACON",
      type: "static",
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
      cost: {
        ink: 6,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: SWIFT AND SURE triggered
    const swiftAndSure = {
      effect: {
        target: "OPPOSING_DAMAGED_CHARACTERS",
        type: "banish",
      },
      name: "SWIFT AND SURE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(swiftAndSure),
    );
  });

  it.skip("Pegasus - Gift for Hercules: should parse card text", () => {
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

  it.skip("Shenzi - Hyena Pack Leader: should parse card text", () => {
    const text =
      "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I'LL HANDLE THIS static
    const illHandleThis = {
      effect: {
        condition: { type: "at-location" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "SELF",
        },
        type: "conditional",
      },
      name: "I'LL HANDLE THIS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(illHandleThis),
    );

    // Second ability: WHAT'S THE HURRY? triggered
    const whatsTheHurry = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "WHAT'S THE HURRY?",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
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
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: PIXIE DUST triggered
    const pixieDust = {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "PIXIE DUST",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(pixieDust),
    );
  });

  it.skip("Ursula - Deceiver: should parse card text", () => {
    const text =
      "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU'LL NEVER EVEN MISS IT triggered
    const youllNeverEvenMissIt = {
      effect: {
        effects: [],
        type: "sequence",
      },
      name: "YOU'LL NEVER EVEN MISS IT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: DISASSEMBLE activated
    const disassemble = {
      cost: {
        exert: true,
      },
      effect: {
        target: "CHOSEN_ITEM",
        type: "banish",
      },
      name: "DISASSEMBLE",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(disassemble),
    );
  });

  it.skip("Stand Out: should parse card text", () => {
    const text =
      "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with sequence effect
    const standOut = {
      effect: {
        effects: [],
        type: "sequence",
      },
      type: "action",
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
    const suddenChill = {
      effect: {
        amount: 1,
        target: "OPPONENT",
        type: "discard",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(suddenChill),
    );
  });

  it.skip("Under the Sea: should parse card text", () => {
    const text =
      "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action with Sing Together 8
    const underTheSea = {
      effect: {
        target: "OPPOSING_CHARACTERS",
        type: "put-on-bottom",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(underTheSea),
    );
  });

  it.skip("Signed Contract: should parse card text", () => {
    const text =
      "FINE PRINT Whenever an opponent plays a song, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // FINE PRINT triggered
    const finePrint = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "FINE PRINT",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(finePrint),
    );
  });

  it.skip("Shere Khan - Menacing Predator: should parse card text", () => {
    const text =
      "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DON'T INSULT MY INTELLIGENCE triggered
    const dontInsultMyIntelligence = {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "DON'T INSULT MY INTELLIGENCE",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dontInsultMyIntelligence),
    );
  });

  it.skip("Powerline - Taking the Stage: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 4 keyword
    const singer: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
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
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Singer 9
    const singer: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 9,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(singer),
    );

    // Third ability: MASH-UP triggered
    const mashUp = {
      effect: {
        amount: 4,
        type: "scry",
      },
      name: "MASH-UP",
      trigger: {
        event: "sing",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(mashUp),
    );
  });

  it.skip("Roxanne - Powerline Fan: should parse card text", () => {
    const text =
      "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CONCERT LOVER static with condition
    const concertLover = {
      effect: {
        condition: { type: "has-character-with-keyword", keyword: "Singer" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
        type: "conditional",
      },
      name: "CONCERT LOVER",
      type: "static",
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
    const shoutOutLoud = {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "SHOUT OUT LOUD!",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shoutOutLoud),
    );
  });

  it.skip("Powerline - Musical Superstar: should parse card text", () => {
    const text =
      "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ELECTRIC MOVE static with condition
    const electricMove = {
      effect: {
        condition: { type: "played-song-this-turn" },
        effect: { type: "gain-keyword", keyword: "Rush", target: "SELF" },
        type: "conditional",
      },
      name: "ELECTRIC MOVE",
      type: "static",
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
    const surgeOfPower = {
      effect: {
        count: "cards-in-opponents-hands",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
        type: "for-each",
      },
      name: "SURGE OF POWER",
      type: "static",
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
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: BRING ON THE HEAT! triggered
    const bringOnTheHeat = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "banish",
      },
      name: "BRING ON THE HEAT!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
      cost: {
        ink: 2,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LET THE GAME BEGIN triggered
    const letTheGameBegin = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "LET THE GAME BEGIN",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letTheGameBegin),
    );
  });

  it.skip("Queen of Hearts - Impulsive Ruler: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush keyword
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Rapunzel - Letting Down Her Hair: should parse card text", () => {
    const text =
      "TANGLE When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TANGLE triggered
    const tangle = {
      effect: {
        amount: 1,
        target: "OPPONENT",
        type: "lose-lore",
      },
      name: "TANGLE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tangle),
    );
  });

  it.skip("Raya - Headstrong: should parse card text", () => {
    const text =
      "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOTE TO SELF, DON'T DIE triggered on banish with optional ready + restriction
    const noteToSelfDontDie = {
      effect: {
        effect: {
          type: "sequence",
          effects: [],
        },
        type: "optional",
      },
      name: "NOTE TO SELF, DON'T DIE",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
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
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ON A ROLL triggered on play with move + strength boost
    const onARoll = {
      effect: {
        effect: {
          type: "sequence",
          effects: [],
        },
        type: "optional",
      },
      name: "ON A ROLL",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(onARoll),
    );
  });

  it.skip("You Can Fly!: should parse card text", () => {
    const text =
      "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Evasive until start of next turn
    const youCanFly = {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youCanFly),
    );
  });

  it.skip("The Queen - Mirror Seeker: should parse card text", () => {
    const text =
      "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CALCULATING AND VAIN triggered on quest with scry effect
    const calculatingAndVain = {
      effect: {
        effect: {
          type: "scry",
          amount: 3,
        },
        type: "optional",
      },
      name: "CALCULATING AND VAIN",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(calculatingAndVain),
    );
  });

  it.skip("Winnie the Pooh - Having a Think: should parse card text", () => {
    const text =
      "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // HUNNY POT triggered on quest with optional inkwell effect
    const hunnyPot = {
      effect: {
        effect: {
          type: "add-to-inkwell",
          from: "hand",
        },
        type: "optional",
      },
      name: "HUNNY POT",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hunnyPot),
    );
  });

  it.skip("Robin Hood - Unrivaled Archer: should parse card text", () => {
    const text =
      "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FEED THE POOR triggered on play with conditional draw
    const feedThePoor = {
      effect: {
        condition: { type: "opponent-has-more-cards" },
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
        type: "conditional",
      },
      name: "FEED THE POOR",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(feedThePoor),
    );

    // Second ability: GOOD SHOT static with conditional Evasive
    const goodShot = {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "GOOD SHOT",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(goodShot),
    );
  });

  it.skip("One Jump Ahead: should parse card text", () => {
    const text =
      "Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: add top card to inkwell
    const oneJumpAhead = {
      effect: {
        from: "deck",
        type: "add-to-inkwell",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oneJumpAhead),
    );
  });

  it.skip("Philoctetes - No-Nonsense Instructor: should parse card text", () => {
    const text =
      "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU GOTTA STAY FOCUSED static with Challenger grant
    const youGottaStayFocused = {
      effect: {
        ability: { type: "keyword", keyword: "Challenger", value: 1 },
        target: "YOUR_HERO_CHARACTERS",
        type: "grant-ability",
      },
      name: "YOU GOTTA STAY FOCUSED",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youGottaStayFocused),
    );

    // Second ability: SHAMELESS PROMOTER triggered on Hero play with lore gain
    const shamelessPromoter = {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "SHAMELESS PROMOTER",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shamelessPromoter),
    );
  });

  it.skip("Nala - Undaunted Lioness: should parse card text", () => {
    const text =
      "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DETERMINED DIVERSION static with conditional lore buff and Resist
    const determinedDiversion = {
      effect: {
        condition: { type: "has-no-damage" },
        effect: { type: "sequence", effects: [] },
        type: "conditional",
      },
      name: "DETERMINED DIVERSION",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(determinedDiversion),
    );
  });

  it.skip("Scar - Finally King: should parse card text", () => {
    const text =
      "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BE GRATEFUL static with strength buff
    const beGrateful = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_ALLY_CHARACTERS",
        type: "modify-stat",
      },
      name: "BE GRATEFUL",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beGrateful),
    );

    // Second ability: STICK WITH ME triggered at end of turn
    const stickWithMe = {
      effect: {
        condition: { type: "is-exerted" },
        effect: { type: "sequence", effects: [] },
        type: "conditional",
      },
      name: "STICK WITH ME",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stickWithMe),
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
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SKILLED COMBATANT triggered on banish
    const skilledCombatant = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      name: "SKILLED COMBATANT",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(skilledCombatant),
    );

    // Third ability: THE GOOD OF OTHERS triggered when this is banished
    const theGoodOfOthers = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "THE GOOD OF OTHERS",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(theGoodOfOthers),
    );
  });

  it.skip("Robin Hood - Capable Fighter: should parse card text", () => {
    const text = "SKIRMISH {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SKIRMISH activated with exert cost
    const skirmish = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      name: "SKIRMISH",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(skirmish),
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
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: ROCK THE BOAT triggered on play
    const rockTheBoat = {
      effect: {
        amount: 1,
        target: "OPPOSING_CHARACTERS",
        type: "deal-damage",
      },
      name: "ROCK THE BOAT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(rockTheBoat),
    );

    // Third ability: PUNY PIRATE! triggered on banish
    const punyPirate = {
      effect: {
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
        type: "optional",
      },
      name: "PUNY PIRATE!",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
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
    const battlePlans = {
      cost: {
        exert: true,
      },
      effect: {
        effects: [],
        type: "sequence",
      },
      name: "BATTLE PLANS",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(battlePlans),
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
      keyword: "Challenger",
      type: "keyword",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("One Last Hope: should parse card text", () => {
    const text =
      "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: grant Resist +2 with conditional bonus for Heroes
    const oneLastHope = {
      effect: {
        effects: [],
        type: "sequence",
      },
      type: "action",
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
    const smash = {
      effect: {
        amount: 3,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(smash));
  });

  it.skip("Strength of a Raging Fire: should parse card text", () => {
    const text =
      "Deal damage to chosen character equal to the number of characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action: deal variable damage based on character count
    const strengthOfARagingFire = {
      effect: {
        amount: "characters-in-play",
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      type: "action",
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
      cost: {
        ink: 10,
      },
      keyword: "SingTogether",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singTogether),
    );

    // Second ability: action to deal damage
    const mobSongAction = {
      effect: {
        amount: 3,
        target: "CHOSEN_CHARACTERS_OR_LOCATIONS",
        type: "deal-damage",
      },
      type: "action",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(mobSongAction),
    );
  });
});
