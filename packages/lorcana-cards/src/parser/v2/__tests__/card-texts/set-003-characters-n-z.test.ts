// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 003 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Patch - Intimidating Pup: should parse card text", () => {
    const text = "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BARK (activated)
    const bark = {
      cost: {
        exert: true,
      },
      effect: {
        modifier: -2,
        stat: "strength",
        type: "modify-stat",
      },
      name: "BARK",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bark));
  });

  it.skip("Perdita - Devoted Mother: should parse card text", () => {
    const text =
      "COME ALONG, CHILDREN When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // COME ALONG, CHILDREN (triggered with dual trigger)
    const comeAlongChildren = {
      effect: {
        type: "optional",
      },
      name: "COME ALONG, CHILDREN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(comeAlongChildren));
  });

  it.skip("Piglet - Pooh Pirate Captain: should parse card text", () => {
    const text =
      "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // AND I'M THE CAPTAIN! (static)
    const andImTheCaptain = {
      effect: {
        modifier: 2,
        stat: "lore",
        type: "modify-stat",
      },
      name: "AND I'M THE CAPTAIN!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(andImTheCaptain));
  });

  it.skip("Rolly - Hungry Pup: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("99 Puppies: should parse card text", () => {
    const text = "Whenever one of your characters quests this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "triggered",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Quick Patch: should parse card text", () => {
    const text = "Remove up to 3 damage from chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        amount: 3,
        type: "remove-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("The Bare Necessities: should parse card text", () => {
    const text =
      "Chosen opponent reveals their hand and discards a non-character card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Wildcat's Wrench: should parse card text", () => {
    const text = "REBUILD {E} — Remove up to 2 damage from chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // REBUILD (activated)
    const rebuild = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        type: "remove-damage",
      },
      name: "REBUILD",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rebuild));
  });

  it.skip("Pride Lands - Pride Rock: should parse card text", () => {
    const text =
      "WE ARE ALL CONNECTED Characters get +2 {W} while here.\nLION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // WE ARE ALL CONNECTED (static)
    const weAreAllConnected = {
      effect: {
        modifier: 2,
        stat: "willpower",
        type: "modify-stat",
      },
      name: "WE ARE ALL CONNECTED",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(weAreAllConnected));

    // LION HOME (static)
    const lionHome = {
      effect: {
        type: "cost-reduction",
      },
      name: "LION HOME",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(lionHome));
  });

  it.skip("Tiana's Palace - Jazz Restaurant: should parse card text", () => {
    const text = "NIGHT OUT Characters can't be challenged while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NIGHT OUT (static)
    const nightOut = {
      effect: {
        restriction: "cant-be-challenged",
        type: "restriction",
      },
      name: "NIGHT OUT",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(nightOut));
  });

  it.skip("Pua - Potbellied Buddy: should parse card text", () => {
    const text =
      "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ALWAYS THERE (triggered)
    const alwaysThere = {
      effect: {
        type: "optional",
      },
      name: "ALWAYS THERE",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(alwaysThere));
  });

  it.skip("Stratos - Tornado Titan: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nCYCLONE {E} — Gain lore equal to the number of Titan characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // CYCLONE (activated)
    const cyclone = {
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-lore",
      },
      name: "CYCLONE",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(cyclone));
  });

  it.skip("Treasure Guardian - Protector of the Cave: should parse card text", () => {
    const text =
      "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHO DISTURBS MY SLUMBER? (static)
    const whoDisturbsMySlumber = {
      effect: {
        type: "restriction",
      },
      name: "WHO DISTURBS MY SLUMBER?",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(whoDisturbsMySlumber));
  });

  it.skip("The Boss is on a Roll: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("The Lamp: should parse card text", () => {
    const text =
      "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // GOOD OR EVIL (activated)
    const goodOrEvil = {
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "conditional",
      },
      name: "GOOD OR EVIL",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(goodOrEvil));
  });

  it.skip("The Sorcerer's Hat: should parse card text", () => {
    const text =
      "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // INCREDIBLE ENERGY (activated)
    const incredibleEnergy = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "compound",
      },
      name: "INCREDIBLE ENERGY",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(incredibleEnergy));
  });

  it.skip("The Queen's Castle - Mirror Chamber: should parse card text", () => {
    const text =
      "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // USING THE MIRROR (triggered)
    const usingTheMirror = {
      effect: {
        type: "optional",
      },
      name: "USING THE MIRROR",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(usingTheMirror));
  });

  it.skip("The Sorcerer's Tower - Wondrous Workspace: should parse card text", () => {
    const text =
      "BROOM CLOSET Your characters named Magic Broom may move here for free.\nMAGICAL POWER Characters get +1 {L} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // BROOM CLOSET (static)
    const broomCloset = {
      effect: {
        type: "cost-reduction",
      },
      name: "BROOM CLOSET",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(broomCloset));

    // MAGICAL POWER (static)
    const magicalPower = {
      effect: {
        modifier: 1,
        stat: "lore",
        type: "modify-stat",
      },
      name: "MAGICAL POWER",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(magicalPower));
  });

  it.skip("Peter Pan - Lost Boy Leader: should parse card text", () => {
    const text =
      "I CAME TO LISTEN TO THE STORIES Once per turn, when this character moves to a location, gain lore equal to that location's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I CAME TO LISTEN TO THE STORIES (triggered)
    const iCameToListenToTheStories = {
      effect: {
        type: "gain-lore",
      },
      name: "I CAME TO LISTEN TO THE STORIES",
      trigger: {
        event: "move",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iCameToListenToTheStories));
  });

  it.skip("Prince John - Phony King: should parse card text", () => {
    const text =
      "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // COLLECT TAXES (triggered)
    const collectTaxes = {
      effect: {
        amount: 2,
        type: "lose-lore",
      },
      name: "COLLECT TAXES",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(collectTaxes));
  });

  it.skip("Sir Hiss - Aggravating Asp: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Skippy - Energetic Rabbit: should parse card text", () => {
    const text = "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Stitch - Covert Agent: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nHIDE While this character is at a location, he gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // HIDE (static)
    const hide = {
      effect: {
        keyword: "Ward",
        type: "gain-keyword",
      },
      name: "HIDE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(hide));
  });

  it.skip("Ursula - Deceiver of All: should parse card text", () => {
    const text =
      "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WHAT A DEAL (triggered)
    const whatADeal = {
      effect: {
        type: "optional",
      },
      name: "WHAT A DEAL",
      trigger: {
        event: "sing",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(whatADeal));
  });

  it.skip("Zazu - Steward of the Pride Lands: should parse card text", () => {
    const text = "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // IT'S TIME TO GO! (static)
    const itsTimeToGo = {
      effect: {
        modifier: 1,
        stat: "lore",
        type: "modify-stat",
      },
      name: "IT'S TIME TO GO!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(itsTimeToGo));
  });

  it.skip("Strike a Good Match: should parse card text", () => {
    const text = "Draw 2 cards, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Robin's Bow: should parse card text", () => {
    const text =
      "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.\nA BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // FOREST'S GIFT (activated)
    const forestsGift = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        type: "deal-damage",
      },
      name: "FOREST'S GIFT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(forestsGift));

    // A BIT OF A LARK (triggered)
    const aBitOfALark = {
      effect: {
        type: "optional",
      },
      name: "A BIT OF A LARK",
      trigger: {
        event: "quest",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(aBitOfALark));
  });

  it.skip("Starlight Vial: should parse card text", () => {
    const text =
      "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.\nTRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // EFFICIENT ENERGY (activated)
    const efficientEnergy = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        type: "cost-reduction",
      },
      name: "EFFICIENT ENERGY",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(efficientEnergy));

    // TRAP (activated)
    const trap = {
      cost: {
        banishSelf: true,
        ink: 2,
      },
      effect: {
        type: "compound",
      },
      name: "TRAP",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(trap));
  });

  it.skip("Peter Pan - Never Land Hero: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nOVER HERE, TINK While you have a character named Tinker Bell in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // OVER HERE, TINK (static)
    const overHereTink = {
      effect: {
        modifier: 2,
        stat: "strength",
        type: "modify-stat",
      },
      name: "OVER HERE, TINK",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(overHereTink));
  });

  it.skip("Peter Pan - Pirate's Bane: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Peter Pan.)\nEvasive (Only characters with Evasive can challenge this character.)\nYOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // YOU'RE NEXT! (triggered)
    const youreNext = {
      effect: {
        type: "prevention",
      },
      name: "YOU'RE NEXT!",
      trigger: {
        event: "challenge",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(youreNext));
  });

  it.skip("Prince Eric - Expert Helmsman: should parse card text", () => {
    const text =
      "SURPRISE MANEUVER When this character is banished, you may banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SURPRISE MANEUVER (triggered)
    const surpriseManeuver = {
      effect: {
        type: "optional",
      },
      name: "SURPRISE MANEUVER",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(surpriseManeuver));
  });

  it.skip("Scroop - Backstabber: should parse card text", () => {
    const text = "BRUTE While this character has damage, he gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BRUTE (static)
    const brute = {
      effect: {
        modifier: 3,
        stat: "strength",
        type: "modify-stat",
      },
      name: "BRUTE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(brute));
  });

  it.skip("Slightly - Lost Boy: should parse card text", () => {
    const text =
      "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // THE FOX (static)
    const theFox = {
      effect: {
        type: "cost-reduction",
      },
      name: "THE FOX",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(theFox));

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Stitch - Little Rocket: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Trigger - Not-So-Sharp Shooter: should parse card text", () => {
    const text = "OLD BETSY Your characters named Nutsy get +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OLD BETSY (static)
    const oldBetsy = {
      effect: {
        modifier: 1,
        stat: "lore",
        type: "modify-stat",
      },
      name: "OLD BETSY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(oldBetsy));
  });

  it.skip("On Your Feet! Now!: should parse card text", () => {
    const text =
      "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "compound",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Voyage: should parse card text", () => {
    const text = "Move up to 2 characters of yours to the same location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "move",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Sumerian Talisman: should parse card text", () => {
    const text =
      "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SOURCE OF MAGIC (triggered)
    const sourceOfMagic = {
      effect: {
        type: "optional",
      },
      name: "SOURCE OF MAGIC",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(sourceOfMagic));
  });

  it.skip("RLS Legacy - Solar Galleon: should parse card text", () => {
    const text =
      "THIS IS OUR SHIP Characters gain Evasive while here. (Only characters with Evasive can challenge them.)\nHEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // THIS IS OUR SHIP (static)
    const thisIsOurShip = {
      effect: {
        keyword: "Evasive",
        type: "gain-keyword",
      },
      name: "THIS IS OUR SHIP",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(thisIsOurShip));

    // HEAVE TOGETHER NOW (static)
    const heaveTogetherNow = {
      effect: {
        type: "cost-reduction",
      },
      name: "HEAVE TOGETHER NOW",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(heaveTogetherNow));
  });

  it.skip("Rufus - Orphanage Cat: should parse card text", () => {
    const text =
      "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TOO OLD TO BE CHASING MICE (triggered)
    const tooOldToBeChasingMice = {
      effect: {
        type: "optional",
      },
      name: "TOO OLD TO BE CHASING MICE",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tooOldToBeChasingMice));
  });

  it.skip("Scrooge McDuck - Richest Duck in the World: should parse card text", () => {
    const text =
      "I'M GOING HOME! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nI DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // I'M GOING HOME! (static)
    const imGoingHome = {
      effect: {
        keyword: "Evasive",
        type: "gain-keyword",
      },
      name: "I'M GOING HOME!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(imGoingHome));

    // I DIDN'T GET RICH BY BEING STUPID (triggered)
    const iDidntGetRichByBeingStupid = {
      effect: {
        type: "optional",
      },
      name: "I DIDN'T GET RICH BY BEING STUPID",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iDidntGetRichByBeingStupid),
    );
  });

  it.skip("Scrooge McDuck - Uncle Moneybags: should parse card text", () => {
    const text =
      "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TREASURE FINDER (triggered)
    const treasureFinder = {
      effect: {
        amount: 1,
        type: "cost-reduction",
      },
      name: "TREASURE FINDER",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(treasureFinder));
  });

  it.skip("Tinker Bell - Very Clever Fairy: should parse card text", () => {
    const text =
      "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I CAN USE THAT (triggered)
    const iCanUseThat = {
      effect: {
        type: "optional",
      },
      name: "I CAN USE THAT",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iCanUseThat));
  });

  it.skip("Wendy Darling - Authority on Peter Pan: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("Repair: should parse card text", () => {
    const text = "Remove up to 3 damage from one of your locations or characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        amount: 3,
        type: "remove-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Scrooge's Top Hat: should parse card text", () => {
    const text =
      "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BUSINESS EXPERTISE (activated)
    const businessExpertise = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        type: "cost-reduction",
      },
      name: "BUSINESS EXPERTISE",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(businessExpertise));
  });

  it.skip("Vault Door: should parse card text", () => {
    const text =
      "SEALED AWAY Your locations and characters at locations gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SEALED AWAY (static)
    const sealedAway = {
      effect: {
        keyword: "Resist",
        type: "gain-keyword",
        value: 1,
      },
      name: "SEALED AWAY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(sealedAway));
  });

  it.skip("Pyros - Lava Titan: should parse card text", () => {
    const text =
      "ERUPTION During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ERUPTION (triggered)
    const eruption = {
      effect: {
        type: "optional",
      },
      name: "ERUPTION",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(eruption));
  });

  it.skip("Razoul - Palace Guard: should parse card text", () => {
    const text = "LOOKY HERE While this character has no damage, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LOOKY HERE (static)
    const lookyHere = {
      effect: {
        modifier: 2,
        stat: "strength",
        type: "modify-stat",
      },
      name: "LOOKY HERE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(lookyHere));
  });

  it.skip("Sheriff of Nottingham - Corrupt Official: should parse card text", () => {
    const text =
      "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TAXES SHOULD HURT (triggered)
    const taxesShouldHurt = {
      effect: {
        type: "optional",
      },
      name: "TAXES SHOULD HURT",
      trigger: {
        event: "discard",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(taxesShouldHurt));
  });

  it.skip("Simba - Fighting Prince: should parse card text", () => {
    const text =
      "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // STEP DOWN OR FIGHT (triggered with modal)
    const stepDownOrFight = {
      effect: {
        type: "optional",
      },
      name: "STEP DOWN OR FIGHT",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(stepDownOrFight));
  });

  it.skip("Simba - Rightful King: should parse card text", () => {
    const text =
      "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TRIUMPHANT STANCE (triggered)
    const triumphantStance = {
      effect: {
        type: "restriction",
      },
      name: "TRIUMPHANT STANCE",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(triumphantStance));
  });

  it.skip("Thaddeus E. Klang - Metallic Leader: should parse card text", () => {
    const text =
      "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MY TEETH ARE SHARPER (triggered)
    const myTeethAreSharper = {
      effect: {
        type: "optional",
      },
      name: "MY TEETH ARE SHARPER",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(myTeethAreSharper));
  });

  it.skip("Olympus Would Be That Way: should parse card text", () => {
    const text = "Your characters get +3 {S} while challenging a location this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        modifier: 3,
        stat: "strength",
        type: "modify-stat",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("Rise of the Titans: should parse card text", () => {
    const text = "Banish chosen location or item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility = {
      effect: {
        type: "banish",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(actionAbility));
  });

  it.skip("The Bayou - Mysterious Swamp: should parse card text", () => {
    const text =
      "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SHOW ME THE WAY (triggered)
    const showMeTheWay = {
      effect: {
        type: "optional",
      },
      name: "SHOW ME THE WAY",
      trigger: {
        event: "quest",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(showMeTheWay));
  });
});
