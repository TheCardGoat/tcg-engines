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

describe("Set 006 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Owl - Pirate Lookout: should parse card text", () => {
    const text =
      "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: WELL SPOTTED (triggered)
    const wellSpotted = {
      type: "triggered",
      name: "WELL SPOTTED",
      trigger: {
        event: "put-into-inkwell",
        timing: "whenever",
        on: "CONTROLLER",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellSpotted),
    );
  });

  it.skip("Winnie the Pooh - Hunny Pirate: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: WE'RE PIRATES, YOU SEE (triggered)
    const werePiratesYouSee = {
      type: "triggered",
      name: "WE'RE PIRATES, YOU SEE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "NEXT_PIRATE_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(werePiratesYouSee),
    );
  });

  it.skip("Prince Naveen - Vigilant First Mate: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Tiana - Restaurant Owner: should parse card text", () => {
    const text =
      "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SPECIAL RESERVATION (triggered)
    const specialReservation = {
      type: "triggered",
      name: "SPECIAL RESERVATION",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHALLENGING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(specialReservation),
    );
  });

  it.skip("Nani - Caring Sister: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Simba - Pride Protector: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: UNDERSTAND THE BALANCE (triggered)
    const understandTheBalance = {
      type: "triggered",
      name: "UNDERSTAND THE BALANCE",
      trigger: {
        event: "end-of-turn",
        timing: "at",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(understandTheBalance),
    );
  });

  it.skip("Rabbit - Indignant Pirate: should parse card text", () => {
    const text =
      "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BE MORE CAREFUL (triggered)
    const beMoreCareful = {
      type: "triggered",
      name: "BE MORE CAREFUL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beMoreCareful),
    );
  });

  it.skip("Roo - Littlest Pirate: should parse card text", () => {
    const text =
      "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I'M A PIRATE TOO! (triggered)
    const imAPirateToo = {
      type: "triggered",
      name: "I'M A PIRATE TOO!",
      trigger: {
        event: "play",
        timing: "when",
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
      expect.objectContaining(imAPirateToo),
    );
  });

  it.skip("Stitch - Little Trickster: should parse card text", () => {
    const text = "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: NEED A HAND? (activated)
    const needAHand = {
      type: "activated",
      name: "NEED A HAND?",
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
      expect.objectContaining(needAHand),
    );
  });

  it.skip("Rescue Rangers Away!: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Safe and Sound: should parse card text", () => {
    const text =
      "Chosen character of yours can’t be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Naveen's Ukulele: should parse card text", () => {
    const text =
      "MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pooh Pirate Ship: should parse card text", () => {
    const text =
      "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: MAKE A RESCUE (activated)
    const makeARescue = {
      type: "activated",
      name: "MAKE A RESCUE",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "return-to-hand",
        target: "PIRATE_CHARACTER_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeARescue),
    );
  });

  it.skip("Scrump: should parse card text", () => {
    const text =
      "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I MADE HER (activated)
    const iMadeHer = {
      type: "activated",
      name: "I MADE HER",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iMadeHer),
    );
  });

  it.skip("Sugar Rush Speedway - Finish Line: should parse card text", () => {
    const text =
      "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BRING IT HOME, LITTLE ONE! (triggered)
    const bringItHomeLittleOne = {
      type: "triggered",
      name: "BRING IT HOME, LITTLE ONE!",
      trigger: {
        event: "move",
        timing: "when",
        on: "CHARACTERS_MOVED_HERE",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "banish", target: "SELF" },
            { type: "gain-lore", amount: 3 },
            { type: "draw", amount: 3, target: "CONTROLLER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bringItHomeLittleOne),
    );
  });

  it.skip("Sisu - In Her Element: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}).";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger +2
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("The White Rose - Jewel of the Garden: should parse card text", () => {
    const text =
      "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE BEAUTY OF THE WORLD (triggered)
    const theBeautyOfTheWorld = {
      type: "triggered",
      name: "THE BEAUTY OF THE WORLD",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBeautyOfTheWorld),
    );
  });

  it.skip("Tinker Bell - Fast Flier: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Carpenter - Dinner Companion: should parse card text", () => {
    const text =
      "I'LL GET YOU! When this character is banished, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I'LL GET YOU! (triggered)
    const illGetYou = {
      type: "triggered",
      name: "I'LL GET YOU!",
      trigger: {
        event: "banish",
        timing: "when",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(illGetYou),
    );
  });

  it.skip("Scar - Tempestuous Lion: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger keyword
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Tinker Bell - Queen of the Azurite Fairies: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: SHINING EXAMPLE
    const shiningExample = {
      type: "triggered",
      name: "SHINING EXAMPLE",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_FAIRY_CHARACTERS",
        duration: "this-turn",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shiningExample),
    );
  });

  it.skip("Rafiki - Ethereal Guide: should parse card text", () => {
    const text =
      "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 7
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 7 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: ASTRAL ATTUNEMENT
    const astralAttunement = {
      type: "triggered",
      name: "ASTRAL ATTUNEMENT",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
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
      expect.objectContaining(astralAttunement),
    );
  });

  it.skip("Sisu - Uniting Dragon: should parse card text", () => {
    const text =
      "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: TRUST BUILDS TRUST
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TRUST BUILDS TRUST",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Yzma - Conniving Chemist: should parse card text", () => {
    const text =
      "FEEL THE POWER {E} - If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Shadow Catcher: should parse card text", () => {
    const text =
      "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: GOTCHA! (triggered)
    const gotcha = {
      type: "triggered",
      name: "GOTCHA!",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gotcha),
    );
  });

  it.skip("Seeking the Half Crown: should parse card text", () => {
    const text =
      "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Cost reduction (static)
    const costReduction = {
      type: "static",
      effect: {
        type: "for-each",
        count: {
          type: "characters",
          filter: { classification: "Sorcerer" },
          controller: "you",
        },
        effect: {
          type: "cost-reduction",
          reduction: { ink: 1 },
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(costReduction),
    );

    // Ability 2: Draw 2 (action)
    const draw2 = {
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(draw2));
  });

  it.skip("Pixie Dust: should parse card text", () => {
    const text =
      "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FAITH AND TRUST (activated)
    const faithAndTrust = {
      type: "activated",
      name: "FAITH AND TRUST",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-keyword",
        keywords: ["Challenger +2", "Evasive"],
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(faithAndTrust),
    );
  });

  it.skip("Stitch - Alien Buccaneer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Stitch.)\nREADY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: READY FOR ACTION (triggered)
    const readyForAction = {
      type: "triggered",
      name: "READY FOR ACTION",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-deck",
          cardType: "action",
          from: "discard",
          position: "top",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(readyForAction),
    );
  });

  it.skip("Prince Phillip - Royal Explorer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Never Land Prankster: should parse card text", () => {
    const text =
      "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: LOOK INNOCENT
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LOOK INNOCENT",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Prepare to Board!: should parse card text", () => {
    const text =
      "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Prepare to Board! (action)
    const prepareToBoard = {
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "classification",
          classification: "Pirate",
          target: "CHOSEN_CHARACTER",
        },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(prepareToBoard),
    );
  });

  it.skip("You Came Back: should parse card text", () => {
    const text = "Ready chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: You Came Back (action)
    const youCameBack = {
      type: "action",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youCameBack),
    );
  });

  it.skip("Transport Pod: should parse card text", () => {
    const text =
      "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perilous Maze - Watery Labyrinth: should parse card text", () => {
    const text =
      "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: LOST IN THE WAVES (triggered)
    const lostInTheWaves = {
      type: "triggered",
      name: "LOST IN THE WAVES",
      trigger: {
        timing: "whenever",
        event: "challenged",
        on: "CHARACTER_HERE",
      },
      effect: {
        type: "discard",
        amount: 1,
        chosenBy: "opponent",
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lostInTheWaves),
    );
  });

  it.skip("Owl Island - Secluded Entrance: should parse card text", () => {
    const text =
      "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: TEAMWORK (static)
    const teamwork = {
      type: "static",
      name: "TEAMWORK",
      effect: {
        type: "for-each",
        count: {
          type: "characters-here",
          controller: "you",
        },
        effect: {
          type: "cost-reduction",
          reduction: { ink: 1 },
          target: "FIRST_ACTION_EACH_TURN",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(teamwork),
    );

    // Ability 2: LOTS TO LEARN (triggered)
    const lotsToLearn = {
      type: "triggered",
      name: "LOTS TO LEARN",
      trigger: {
        timing: "whenever",
        event: "play-second-action",
        on: "CONTROLLER",
      },
      effect: {
        type: "gain-lore",
        amount: 3,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(lotsToLearn),
    );
  });

  it.skip("Raya - Kumandran Rider: should parse card text", () => {
    const text =
      "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Wendy Darling - Courageous Captain: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Vanellope Von Schweetz - Gutsy Go-Getter: should parse card text", () => {
    const text =
      "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Tigger - In the Crow's Nest: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SWASH YOUR BUCKLES
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SWASH YOUR BUCKLES",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Scar - Heartless Hunter: should parse card text", () => {
    const text =
      "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BARED TEETH
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BARED TEETH",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Thievery: should parse card text", () => {
    const text = "Chosen opponent loses 1 lore. Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("The Islands I Pulled from the Sea: should parse card text", () => {
    const text =
      "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "search-deck",
        }),
      }),
    );
  });

  it.skip("Skull Rock - Isolated Fortress: should parse card text", () => {
    const text =
      "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: FAMILIAR GROUND
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FAMILIAR GROUND",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Zipper - Astute Decoy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: RUN INTERFERENCE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RUN INTERFERENCE",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Oswald - The Lucky Rabbit: should parse card text", () => {
    const text =
      "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FAVORABLE CHANCE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FAVORABLE CHANCE",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Yokai - Enigmatic Inventor: should parse card text", () => {
    const text =
      "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: TIME TO UPGRADE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIME TO UPGRADE",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Pleakley - Scientific Expert: should parse card text", () => {
    const text =
      "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: REPORTING FOR DUTY
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REPORTING FOR DUTY",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Sour Bill - Surly Henchman: should parse card text", () => {
    const text =
      "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: UNPALATABLE (triggered)
    const unpalatable = {
      type: "triggered",
      name: "UNPALATABLE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(unpalatable),
    );
  });

  it.skip("Nick Wilde - Soggy Fox: should parse card text", () => {
    const text =
      "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Wasabi - Methodical Engineer: should parse card text", () => {
    const text =
      "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: BLADES OF FURY
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BLADES OF FURY",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Nick Wilde - Sly Fox: should parse card text", () => {
    const text =
      "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Tadashi Hamada - Baymax Inventor: should parse card text", () => {
    const text =
      "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Tadashi Hamada - Gifted Roboticist: should parse card text", () => {
    const text =
      "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Yokai - Scientific Supervillain: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 3: TECHNICAL GAIN
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TECHNICAL GAIN",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("We Could Be Immortals: should parse card text", () => {
    const text =
      "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted. (Damage dealt to them is reduced by 6.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Your Inventor
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "Your Inventor",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Sail the Azurite Sea: should parse card text", () => {
    const text =
      "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Prepare Your Bot: should parse card text", () => {
    const text =
      "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Rescue Rangers Submarine - Mobile Headquarters: should parse card text", () => {
    const text =
      "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Pluto - Guard Dog: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );

    // Ability 2: static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Wreck-It Ralph - Ham Hands: should parse card text", () => {
    const text =
      "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I WRECK THINGS
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WRECK THINGS",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Twin Fire: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Unfortunate Situation: should parse card text", () => {
    const text =
      "Each opponent chooses one of their characters and deals 4 damage to them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Training Dummy: should parse card text", () => {
    const text =
      "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Sunglasses: should parse card text", () => {
    const text = "SPYCRAFT {E} - Draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Treasure Mountain - Azurite Sea Island: should parse card text", () => {
    const text =
      "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});
