// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 005 Card Text Parser Tests - Characters A M", () => {
  it.skip("Koda - Talkative Cub: should parse card text", () => {
    const text = "TELL EVERYBODY During opponents' turns, you can't lose lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: TELL EVERYBODY - protection from lore loss
    const tellEverybody = {
      effect: {
        restriction: "cant-quest",
        target: "CONTROLLER",
        type: "restriction",
      },
      name: "TELL EVERYBODY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tellEverybody));
  });

  it.skip("Kenai - Big Brother: should parse card text", () => {
    const text =
      "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BROTHERS FOREVER - conditional protection
    const brothersForever = {
      effect: {
        restriction: "cant-be-challenged",
        target: "YOUR_CHARACTERS",
        type: "restriction",
      },
      name: "BROTHERS FOREVER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(brothersForever));
  });

  it.skip("Lilo - Junior Cake Decorator: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("Fix-It Felix, Jr. - Trusty Builder: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
  });

  it.skip("Gazelle - Pop Star: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    const singer5: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(singer5));
  });

  it.skip("Fix-It Felix, Jr. - Niceland Steward: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)\nBUILDING TOGETHER Your locations get +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift3));

    // Second ability: BUILDING TOGETHER - static buff locations
    const buildingTogether = {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "YOUR_LOCATIONS",
        type: "modify-stat",
      },
      name: "BUILDING TOGETHER",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(buildingTogether));
  });

  it.skip("Kristoff - Reindeer Keeper: should parse card text", () => {
    const text =
      "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SONG OF THE HERD - cost reduction based on songs in discard
    const songOfTheHerd = {
      effect: {
        type: "cost-reduction",
      },
      name: "SONG OF THE HERD",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(songOfTheHerd));

    // Second ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(bodyguard));
  });

  it.skip("Mirabel Madrigal - Family Gatherer: should parse card text", () => {
    const text =
      "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOT WITHOUT MY FAMILY - play restriction
    const notWithoutMyFamily = {
      effect: {
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      name: "NOT WITHOUT MY FAMILY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(notWithoutMyFamily));
  });

  it.skip("Minnie Mouse - Drum Major: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Second ability: PARADE ORDER - triggered on play with shift condition
    const paradeOrder = {
      effect: {
        condition: { type: "used-shift" },
        then: {
          effect: {
            cardType: "character",
            putOnTop: true,
            reveal: true,
            type: "search-deck",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "PARADE ORDER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(paradeOrder));
  });

  it.skip("Daisy Duck - Donald's Date: should parse card text", () => {
    const text =
      "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BIG PRIZE - on quest, opponents reveal top card
    const bigPrize = {
      effect: {
        amount: 1,
        target: "OPPONENT",
        type: "reveal-top",
      },
      name: "BIG PRIZE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bigPrize));
  });

  it.skip("Fix-It Felix, Jr. - Delighted Sightseer: should parse card text", () => {
    const text =
      "OH, MY LAND! When you play this character, if you have a location in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: OH, MY LAND! - conditional draw on play
    const ohMyLand = {
      effect: {
        condition: { type: "at-location" },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      name: "OH, MY LAND!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ohMyLand));
  });

  it.skip("Alan-a-Dale - Rockin' Rooster: should parse card text", () => {
    const text = "FAN FAVORITE Whenever you play a song, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FAN FAVORITE - gain lore when playing song
    const fanFavorite = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "FAN FAVORITE",
      trigger: {
        event: "play",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(fanFavorite));
  });

  it.skip("Maid Marian - Lady of the Lists: should parse card text", () => {
    const text =
      "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IF IT PLEASES THE LADY - debuff on play
    const ifItPleasesTheLady = {
      effect: {
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      name: "IF IT PLEASES THE LADY",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ifItPleasesTheLady));
  });

  it.skip("Minnie Mouse - Compassionate Friend: should parse card text", () => {
    const text =
      "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PATCH THEM UP - on quest, remove damage
    const patchThemUp = {
      effect: {
        effect: {
          amount: 2,
          target: "CHOSEN_CHARACTER",
          type: "remove-damage",
        },
        type: "optional",
      },
      name: "PATCH THEM UP",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(patchThemUp));
  });

  it.skip("Healing Touch: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage and draw
    const healingTouch = {
      effect: {
        effects: [
          {
            amount: 4,
            target: "CHOSEN_CHARACTER",
            type: "remove-damage",
          },
          { amount: 1, target: "CONTROLLER", type: "draw" },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(healingTouch));
  });

  it.skip("Blast from Your Past: should parse card text", () => {
    const text =
      "Name a card. Return all character cards with that name from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: name a card, return from discard
    const blastFromYourPast = {
      effect: {
        effects: [
          { type: "name-a-card" },
          {
            target: "CHARACTER_FROM_DISCARD",
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(blastFromYourPast));
  });

  it.skip("Invited to the Ball: should parse card text", () => {
    const text =
      "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: reveal and filter cards
    const invitedToTheBall = {
      effect: {
        amount: 2,
        type: "scry",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(invitedToTheBall));
  });

  it.skip("Healing Decanter: should parse card text", () => {
    const text = "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RENEWING ESSENCE - exert to remove damage
    const renewingEssence = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      name: "RENEWING ESSENCE",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(renewingEssence));
  });

  it.skip("Amber Chromicon: should parse card text", () => {
    const text = "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMBER LIGHT - exert to remove damage from all
    const amberLight = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "YOUR_CHARACTERS",
        type: "remove-damage",
      },
      name: "AMBER LIGHT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(amberLight));
  });

  it.skip("Maleficent - Formidable Queen: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Maleficent.)\nLISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift6: KeywordAbilityDefinition = {
      cost: {
        ink: 6,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift6));

    // Second ability: LISTEN WELL, ALL OF YOU - triggered on play
    const listenWellAllOfYou = {
      effect: {
        counter: { controller: "you", type: "characters" },
        effect: { target: "CHOSEN_OPPOSING_CHARACTER", type: "return-to-hand" },
        type: "for-each",
      },
      name: "LISTEN WELL, ALL OF YOU",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(listenWellAllOfYou));
  });

  it.skip("Cogsworth - Illuminary Watchman: should parse card text", () => {
    const text =
      "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TIME TO MOVE IT! - grant Rush
    const timeToMoveIt = {
      effect: {
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "TIME TO MOVE IT!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(timeToMoveIt));
  });

  it.skip("Merlin - Turtle: should parse card text", () => {
    const text =
      "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GIVE ME TIME TO THINK - dual trigger
    const giveMeTimeToThink = {
      effect: {
        amount: 2,
        type: "scry",
      },
      name: "GIVE ME TIME TO THINK",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(giveMeTimeToThink));
  });

  it.skip("Archimedes - Exasperated Owl: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Bruni - Fire Salamander: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // Second ability: PARTING GIFT - triggered on banish
    const partingGift = {
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "PARTING GIFT",
      trigger: {
        event: "banish",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(partingGift));
  });

  it.skip("Earth Giant - Living Mountain: should parse card text", () => {
    const text = "UNEARTHED When you play this character, each opponent draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: UNEARTHED - opponents draw
    const unearthed = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "UNEARTHED",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(unearthed));
  });

  it.skip("Gale - Wind Spirit: should parse card text", () => {
    const text =
      "RECURRING GUST When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RECURRING GUST - on banish in challenge
    const recurringGust = {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "RECURRING GUST",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(recurringGust));
  });

  it.skip("Madam Mim - Elephant: should parse card text", () => {
    const text =
      "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A LITTLE GAME - triggered on play, choice
    const aLittleGame = {
      effect: {
        type: "choice",
      },
      name: "A LITTLE GAME",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(aLittleGame));

    // Second ability: SNEAKY MOVE - triggered at start of turn
    const sneakyMove = {
      effect: {
        effect: {
          amount: 2,
          from: "SELF",
          to: "CHOSEN_OPPOSING_CHARACTER",
          type: "move-damage",
        },
        type: "optional",
      },
      name: "SNEAKY MOVE",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(sneakyMove));
  });

  it.skip("Anna - Mystical Majesty: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Second ability: EXCEPTIONAL POWER - exert all opposing
    const exceptionalPower = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "exert",
      },
      name: "EXCEPTIONAL POWER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(exceptionalPower));
  });

  it.skip("Archimedes - Electrified Owl: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift3));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // Third ability: Challenger +3
    const challenger3: KeywordAbilityDefinition = {
      keyword: "Challenger",
      type: "keyword",
      value: 3,
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(challenger3));
  });

  it.skip("Elsa - The Fifth Spirit: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // Third ability: CRYSTALLIZE - triggered exert
    const crystallize = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "exert",
      },
      name: "CRYSTALLIZE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(crystallize));
  });

  it.skip("Genie - Main Attraction: should parse card text", () => {
    const text =
      "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PHENOMENAL SHOWMAN - conditional restriction
    const phenomenalShowman = {
      condition: {
        type: "self-exerted",
      },
      effect: {
        restriction: "cant-ready",
        target: "OPPOSING_CHARACTERS",
        type: "restriction",
      },
      name: "PHENOMENAL SHOWMAN",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(phenomenalShowman));
  });

  it.skip("Maleficent - Vexed Partygoer: should parse card text", () => {
    const text =
      "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: WHAT AN AWKWARD SITUATION - on quest, optional bounce
    const whatAnAwkwardSituation = {
      effect: {
        effect: {
          effects: [
            { amount: 1, target: "CONTROLLER", type: "discard" },
            {
              filter: { maxCost: 3 },
              target: "CHOSEN_CHARACTER",
              type: "return-to-hand",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "WHAT AN AWKWARD SITUATION",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(whatAnAwkwardSituation));
  });

  it.skip("Magica De Spell - Cruel Sorceress: should parse card text", () => {
    const text =
      "PLAYING WITH POWER During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PLAYING WITH POWER - replacement effect
    const playingWithPower = {
      effect: {
        replaces: "damage",
        type: "replacement",
        with: { amount: 1, target: "CONTROLLER", type: "draw" },
      },
      name: "PLAYING WITH POWER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(playingWithPower));
  });

  it.skip("Anna - Eager Acolyte: should parse card text", () => {
    const text =
      "GROWING POWERS When you play this character, each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GROWING POWERS - opponents choose and exert
    const growingPowers = {
      effect: {
        target: "THEIR_CHOSEN_CHARACTER",
        type: "exert",
      },
      name: "GROWING POWERS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(growingPowers));
  });

  it.skip("King of Hearts - Monarch of Wonderland: should parse card text", () => {
    const text =
      "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: PLEASING THE QUEEN - prevent ready
    const pleasingTheQueen = {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "CHOSEN_EXERTED_CHARACTER",
        type: "restriction",
      },
      name: "PLEASING THE QUEEN",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(pleasingTheQueen));
  });

  it.skip("Camilo Madrigal - Family Copycat: should parse card text", () => {
    const text =
      "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IMITATE - on quest, gain lore and return
    const imitate = {
      effect: {
        effect: {
          effects: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            },
            { target: "CHOSEN_OTHER_CHARACTER", type: "return-to-hand" },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "IMITATE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(imitate));
  });

  it.skip("Hypnotic Strength: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Challenger
    const hypnoticStrength = {
      effect: {
        effects: [
          { amount: 1, target: "CONTROLLER", type: "draw" },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: "CHOSEN_CHARACTER",
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(hypnoticStrength));
  });

  it.skip("Finders Keepers: should parse card text", () => {
    const text = "Draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw 3
    const findersKeepers = {
      effect: {
        amount: 3,
        type: "draw",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(findersKeepers));
  });

  it.skip("Gathering Knowledge and Wisdom: should parse card text", () => {
    const text = "Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: gain lore
    const gatheringKnowledgeAndWisdom = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gatheringKnowledgeAndWisdom),
    );
  });

  it.skip("Magical Aid: should parse card text", () => {
    const text =
      'Chosen character gains Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant keyword and ability
    const magicalAid = {
      effect: {
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 3,
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(magicalAid));
  });

  it.skip("Half Hexwell Crown: should parse card text", () => {
    const text =
      "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: AN UNEXPECTED FIND - draw
    const anUnexpectedFind = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "AN UNEXPECTED FIND",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(anUnexpectedFind));

    // Second ability: A PERILOUS POWER - exert
    const aPerilouspower = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "exert",
      },
      name: "A PERILOUS POWER",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(aPerilouspower));
  });

  it.skip("Amethyst Chromicon: should parse card text", () => {
    const text = "AMETHYST LIGHT {E} — Each player may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMETHYST LIGHT - each player draws
    const amethystLight = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "EACH_PLAYER",
        type: "draw",
      },
      name: "AMETHYST LIGHT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(amethystLight));
  });

  it.skip("Elsa's Ice Palace - Place of Solitude: should parse card text", () => {
    const text =
      "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ETERNAL WINTER - on play, lock character
    const eternalWinter = {
      effect: {
        restriction: "cant-ready",
        target: "CHOSEN_EXERTED_CHARACTER",
        type: "restriction",
      },
      name: "ETERNAL WINTER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(eternalWinter));
  });

  it.skip("Ed - Laughing Hyena: should parse card text", () => {
    const text =
      "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAUSE A PANIC - optional damage
    const causeAPanic = {
      effect: {
        effect: {
          amount: 2,
          target: "CHOSEN_DAMAGED_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      name: "CAUSE A PANIC",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(causeAPanic));
  });

  it.skip("Flora - Good Fairy: should parse card text", () => {
    const text = "FIDDLE FADDLE While being challenged, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: FIDDLE FADDLE - conditional buff when challenged
    const fiddleFaddle = {
      condition: {
        type: "being-challenged",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "FIDDLE FADDLE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(fiddleFaddle));
  });

  it.skip("Merryweather - Good Fairy: should parse card text", () => {
    const text =
      "RAY OF HOPE When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RAY OF HOPE - optional buff
    const rayOfHope = {
      effect: {
        effect: {
          cost: { ink: 1 },
          effect: {
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
          type: "pay-cost",
        },
        type: "optional",
      },
      name: "RAY OF HOPE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rayOfHope));
  });

  it.skip("Iago - Fake Flamingo: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // Second ability: IN DISGUISE - cost reduction on quest
    const inDisguise = {
      effect: {
        type: "cost-reduction",
      },
      name: "IN DISGUISE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(inDisguise));
  });

  it.skip("Ed - Hysterical Partygoer: should parse card text", () => {
    const text = "ROWDY GUEST Damaged characters can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: ROWDY GUEST - restriction
    const rowdyGuest = {
      effect: {
        restrictedTarget: "SELF",
        restriction: "cant-challenge",
        target: "OPPOSING_DAMAGED_CHARACTERS",
        type: "restriction",
      },
      name: "ROWDY GUEST",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rowdyGuest));
  });

  it.skip("Clarabelle - Light on Her Hooves: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)\nKEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift5));

    // Second ability: KEEP IN STEP - end of turn draw
    const keepInStep = {
      effect: {
        condition: {
          classification: "Musketeer",
          controller: "you",
          type: "has-character-with-classification",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      name: "KEEP IN STEP",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(keepInStep));
  });

  it.skip("Anna - Diplomatic Queen: should parse card text", () => {
    const text =
      "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: \n• Each opponent chooses and discards a card. \n• Chosen character gets +2 {S} this turn. \n• Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYAL RESOLUTION - modal choice
    const royalResolution = {
      effect: {
        effect: {
          cost: { ink: 2 },
          effect: {
            options: [
              { type: "discard", amount: 1, target: "EACH_OPPONENT" },
              {
                type: "modify-stat",
                stat: "strength",
                modifier: 2,
                target: "CHOSEN_CHARACTER",
                duration: "this-turn",
              },
              { type: "banish", target: "CHOSEN_DAMAGED_CHARACTER" },
            ],
            type: "modal",
          },
          type: "pay-cost",
        },
        type: "optional",
      },
      name: "ROYAL RESOLUTION",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(royalResolution));
  });

  it.skip("Clarabelle - Clumsy Guest: should parse card text", () => {
    const text =
      "BUTTERFINGERS When you play this character, you may pay 2 {I} to banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BUTTERFINGERS - optional banish item
    const butterfingers = {
      effect: {
        effect: {
          cost: { ink: 2 },
          effect: {
            target: "CHOSEN_ITEM",
            type: "banish",
          },
          type: "pay-cost",
        },
        type: "optional",
      },
      name: "BUTTERFINGERS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(butterfingers));
  });

  it.skip("Banzai - Taunting Hyena: should parse card text", () => {
    const text =
      "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HERE KITTY - optional exert
    const hereKitty = {
      effect: {
        effect: {
          target: "CHOSEN_DAMAGED_CHARACTER",
          type: "exert",
        },
        type: "optional",
      },
      name: "HERE KITTY, KITTY, KITTY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(hereKitty));
  });

  it.skip("Mother Gothel - Conceited Manipulator: should parse card text", () => {
    const text =
      "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOTHER KNOWS BEST - optional bounce
    const motherKnowsBest = {
      effect: {
        effect: {
          cost: { ink: 3 },
          effect: {
            target: "CHOSEN_CHARACTER",
            type: "return-to-hand",
          },
          type: "pay-cost",
        },
        type: "optional",
      },
      name: "MOTHER KNOWS BEST",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(motherKnowsBest));
  });

  it.skip("Clarabelle - Contented Wallflower: should parse card text", () => {
    const text =
      "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ONE STEP BEHIND - conditional draw
    const oneStepBehind = {
      effect: {
        condition: {
          type: "opponent-has-more-cards",
        },
        then: {
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "ONE STEP BEHIND",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(oneStepBehind));
  });

  it.skip("Mother Gothel - Unwavering Schemer: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)\nTHE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Second ability: THE WORLD IS DARK - opponents return characters
    const theWorldIsDark = {
      effect: {
        type: "return-to-hand",
      },
      name: "THE WORLD IS DARK",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(theWorldIsDark));
  });

  it.skip("Hypnotic Deduction: should parse card text", () => {
    const text =
      "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw then put back
    const hypnoticDeduction = {
      effect: {
        effects: [
          { amount: 3, target: "CONTROLLER", type: "draw" },
          {
            position: "top",
            type: "put-on-deck",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(hypnoticDeduction));
  });

  it.skip("Emerald Chromicon: should parse card text", () => {
    const text =
      "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: EMERALD LIGHT - on banish, optional bounce
    const emeraldLight = {
      effect: {
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
      name: "EMERALD LIGHT",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(emeraldLight));
  });

  it.skip("Maximus - Team Champion: should parse card text", () => {
    const text =
      "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYALLY BIG REWARDS - end of turn lore gain
    const royallyBigRewards = {
      effect: {
        condition: {
          strength: { min: 10 },
          type: "has-character-with-strength",
        },
        else: {
          condition: {
            strength: { min: 5 },
            type: "has-character-with-strength",
          },
          then: {
            amount: 2,
            type: "gain-lore",
          },
          type: "conditional",
        },
        then: {
          amount: 5,
          type: "gain-lore",
        },
        type: "conditional",
      },
      name: "ROYALLY BIG REWARDS",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(royallyBigRewards));
  });

  it.skip("Donald Duck - Pie Slinger: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)\nHUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses 2 lore.\nRAGING DUCK While an opponent has 10 or more lore, this character gets +6 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Second ability: HUMBLE PIE - conditional lore loss
    const humblePie = {
      effect: {
        condition: { type: "used-shift" },
        then: {
          amount: 2,
          target: "EACH_OPPONENT",
          type: "lose-lore",
        },
        type: "conditional",
      },
      name: "HUMBLE PIE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(humblePie));

    // Third ability: RAGING DUCK - conditional buff
    const ragingDuck = {
      condition: {
        amount: { min: 10 },
        type: "opponent-has-lore",
      },
      effect: {
        modifier: 6,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "RAGING DUCK",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(ragingDuck));
  });

  it.skip("Daisy Duck - Spotless Food-Fighter: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Mickey Mouse - Enthusiastic Dancer: should parse card text", () => {
    const text =
      "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PERFECT PARTNERS - conditional buff
    const perfectPartners = {
      condition: {
        name: "Minnie Mouse",
        type: "has-named-character",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "PERFECT PARTNERS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(perfectPartners));
  });

  it.skip("Gaston - Pure Paragon: should parse card text", () => {
    const text =
      "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A MAN AMONG MEN! - static cost reduction
    const aManAmongMen = {
      effect: {
        type: "cost-reduction",
      },
      name: "A MAN AMONG MEN!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(aManAmongMen));

    // Second ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Arthur - Novice Sparrow: should parse card text", () => {
    const text = "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Reckless keyword
    const reckless = Abilities.Keyword("Reckless");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(reckless));
  });

  it.skip("Donald Duck - Daisy's Date: should parse card text", () => {
    const text =
      "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PLUCKY PLAY - on challenge, opponent loses lore
    const pluckyPlay = {
      effect: {
        amount: 1,
        type: "lore-loss",
      },
      name: "PLUCKY PLAY",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(pluckyPlay));
  });

  it.skip("Minnie Mouse - Dazzling Dancer: should parse card text", () => {
    const text =
      "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DANCE-OFF - on challenge, gain lore
    const danceOff = {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "DANCE-OFF",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(danceOff));
  });

  it.skip("Break Free: should parse card text", () => {
    const text =
      "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: deal damage, grant Rush and buff
    const breakFree = {
      effect: {
        effects: [
          {
            amount: 1,
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "deal-damage",
          },
          {
            duration: "this-turn",
            keyword: "Rush",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "gain-keyword",
          },
          {
            duration: "this-turn",
            modifier: 1,
            stat: "strength",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(breakFree));
  });

  it.skip("Evil Comes Prepared: should parse card text", () => {
    const text =
      "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready, restriction, conditional lore
    const evilComesPrepared = {
      effect: {
        effects: [
          { target: "CHOSEN_CHARACTER_OF_YOURS", type: "ready" },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "restriction",
          },
          {
            condition: { type: "target-is-villain" },
            then: { amount: 1, type: "gain-lore" },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evilComesPrepared));
  });

  it.skip("Don't Let the Frostbite Bite: should parse card text", () => {
    const text = "Ready all your characters. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready all, restriction
    const dontLetTheFrostbiteBite = {
      effect: {
        effects: [
          { target: "YOUR_CHARACTERS", type: "ready" },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "YOUR_CHARACTERS",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(dontLetTheFrostbiteBite));
  });

  it.skip("Glimmer vs Glimmer: should parse card text", () => {
    const text = "Banish chosen character of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish own character to banish opponent character
    const glimmerVsGlimmer = {
      effect: {
        type: "banish",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(glimmerVsGlimmer));
  });

  it.skip("Merlin - Back from Bermuda: should parse card text", () => {
    const text =
      "LONG LIVE THE KING! Your characters named Arthur gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: LONG LIVE THE KING! - grant Resist
    const longLiveTheKing = {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      name: "LONG LIVE THE KING!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(longLiveTheKing));
  });

  it.skip("Chicha - Dedicated Mother: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));

    // Second ability: ONE ON THE WAY - triggered, on inkwell, conditional draw
    const oneOnTheWay = {
      effect: {
        condition: { type: "second-inkwell-this-turn" },
        then: {
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "ONE ON THE WAY",
      trigger: {
        event: "inkwell",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(oneOnTheWay));
  });

  it.skip("Kuzco - Selfish Emperor: should parse card text", () => {
    const text =
      "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: OUTPLACEMENT - on play, optional move to inkwell
    const outplacement = {
      effect: {
        effect: {
          exerted: true,
          target: "CHOSEN_ITEM_OR_LOCATION",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      name: "OUTPLACEMENT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(outplacement));

    // Second ability: BY INVITE ONLY - activated, pay ink, grant Resist
    const byInviteOnly = {
      cost: {
        ink: 4,
      },
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      name: "BY INVITE ONLY",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(byInviteOnly));
  });

  it.skip("Mufasa - Ruler of Pride Rock: should parse card text", () => {
    const text =
      "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A DELICATE BALANCE - on play, exert inkwell, return cards
    const aDelicateBalance = {
      effect: {
        effects: [
          { target: "ALL_CARDS_IN_INKWELL", type: "exert" },
          {
            amount: 2,
            target: "RANDOM_CARDS_IN_INKWELL",
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      name: "A DELICATE BALANCE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(aDelicateBalance));

    // Second ability: EVERYTHING THE LIGHT TOUCHES - on quest, ready inkwell
    const everythingTheLightTouches = {
      effect: {
        type: "ready",
      },
      name: "EVERYTHING THE LIGHT TOUCHES",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(everythingTheLightTouches));
  });

  it.skip("Minnie Mouse - Quick-Thinking Inventor: should parse card text", () => {
    const text =
      "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAKE CATAPULT - on play, debuff character
    const cakeCatapult = {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "CAKE CATAPULT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(cakeCatapult));
  });

  it.skip("Basil - Practiced Detective: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("King Candy - Sweet Abomination: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift3: KeywordAbilityDefinition = {
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift3));

    // Second ability: CHANGING THE CODE - on play, optional draw and tuck
    const changingTheCode = {
      effect: {
        effect: {
          effects: [
            { amount: 1, target: "CONTROLLER", type: "draw" },
            {
              position: "bottom",
              target: "CHOSEN_CARD_IN_HAND",
              type: "put-on-deck",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "CHANGING THE CODE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(changingTheCode));
  });

  it.skip("Donald Duck - Focused Flatfoot: should parse card text", () => {
    const text =
      "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BAFFLING MYSTERY - on play, optional inkwell
    const bafflingMystery = {
      effect: {
        effect: {
          exerted: true,
          target: "TOP_OF_DECK",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      name: "BAFFLING MYSTERY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bafflingMystery));
  });

  it.skip("Belle - Of the Ball: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nUSHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: USHERED INTO THE PARTY - on play, grant Ward
    const usheredIntoTheParty = {
      effect: {
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "USHERED INTO THE PARTY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(usheredIntoTheParty));
  });

  it.skip("Merlin - Intellectual Visionary: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Merlin.)\nOVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift5));

    // Second ability: OVERDEVELOPED BRAIN - on play, conditional search
    const overdevelopedBrain = {
      effect: {
        condition: { type: "used-shift" },
        then: {
          cardType: "action",
          putInHand: true,
          reveal: true,
          type: "search-deck",
        },
        type: "conditional",
      },
      name: "OVERDEVELOPED BRAIN",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(overdevelopedBrain));
  });

  it.skip("Ever as Before: should parse card text", () => {
    const text = "Remove up to 2 damage from any number of chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: heal characters
    const everAsBefore = {
      effect: {
        type: "heal",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(everAsBefore));
  });

  it.skip("Hide Away: should parse card text", () => {
    const text = "Put chosen item or location into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move to inkwell
    const hideAway = {
      effect: {
        type: "move-to-inkwell",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(hideAway));
  });

  it.skip("All Funned Out: should parse card text", () => {
    const text = "Put chosen character of yours into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move character to inkwell
    const allFunnedOut = {
      effect: {
        type: "move-to-inkwell",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(allFunnedOut));
  });

  it.skip("Medal of Heroes: should parse card text", () => {
    const text =
      "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: CONGRATULATIONS, SOLDIER - exert, pay ink, banish, buff lore
    const congratulationsSoldier = {
      cost: {
        banishSelf: true,
        exert: true,
        ink: 2,
      },
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "lore",
        target: "CHOSEN_CHARACTER_OF_YOURS",
        type: "modify-stat",
      },
      name: "CONGRATULATIONS, SOLDIER",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(congratulationsSoldier));
  });

  it.skip("Basil's Magnifying Glass: should parse card text", () => {
    const text =
      "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: FIND WHAT'S HIDDEN - exert, pay ink, look at deck
    const findWhatsHidden = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "look-at-deck",
      },
      name: "FIND WHAT'S HIDDEN",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(findWhatsHidden));
  });

  it.skip("Merlin's Carpetbag: should parse card text", () => {
    const text = "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: HOCKETY POCKETY - exert, pay ink, return from discard
    const hocketyPockety = {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "return-to-hand",
      },
      name: "HOCKETY POCKETY",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(hocketyPockety));
  });

  it.skip("Merlin's Cottage - The Wizard's Home: should parse card text", () => {
    const text = "KNOWLEDGE IS POWER Each player plays with the top card of their deck face up.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: KNOWLEDGE IS POWER - reveal top card
    const knowledgeIsPower = {
      effect: {
        type: "reveal-deck",
      },
      name: "KNOWLEDGE IS POWER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(knowledgeIsPower));
  });

  it.skip("Jafar - Tyrannical Hypnotist: should parse card text", () => {
    const text =
      "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +7
    const challenger7: KeywordAbilityDefinition = {
      keyword: "Challenger",
      type: "keyword",
      value: 7,
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger7));

    // Second ability: INTIMIDATING GAZE - static restriction
    const intimidatingGaze = {
      condition: {
        type: "opposing-character-has-less-strength",
      },
      effect: {
        restrictedTarget: "SELF",
        restriction: "cant-challenge",
        target: "OPPOSING_CHARACTERS",
        type: "restriction",
      },
      name: "INTIMIDATING GAZE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(intimidatingGaze));
  });

  it.skip("Mickey Mouse - Food Fight Defender: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    const resist1: KeywordAbilityDefinition = {
      keyword: "Resist",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(resist1));
  });

  it.skip("Kronk - Unlicensed Investigator: should parse card text", () => {
    const text = "Challenger +1 (While challenging, this character gets +1 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +1 keyword
    const challenger1: KeywordAbilityDefinition = {
      keyword: "Challenger",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger1));
  });

  it.skip("HeiHei - Protective Rooster: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
  });

  it.skip("Dopey - Knight Apprentice: should parse card text", () => {
    const text =
      "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: STRONGER TOGETHER - on play, conditional damage
    const strongerTogether = {
      effect: {
        condition: {
          classification: "Knight",
          other: true,
          type: "has-character-with-classification",
        },
        then: {
          effect: {
            amount: 1,
            target: "CHOSEN_CHARACTER_OR_LOCATION",
            type: "deal-damage",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "STRONGER TOGETHER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(strongerTogether));
  });

  it.skip("Kronk - Head of Security: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift5));

    // Second ability: ARE YOU ON THE LIST? - on banish, play for free
    const areYouOnTheList = {
      effect: {
        effect: {
          cardType: "character",
          costRestriction: { max: 3 },
          free: true,
          type: "play-card",
        },
        type: "optional",
      },
      name: "ARE YOU ON THE LIST?",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(areYouOnTheList));
  });

  it.skip("Grumpy - Skeptical Knight: should parse card text", () => {
    const text =
      "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2. (Damage dealt to them is reduced by 2.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BOON OF RESILIENCE - static, grant Resist at location
    const boonOfResilience = {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      name: "BOON OF RESILIENCE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(boonOfResilience));

    // Second ability: BURST OF SPEED - static, gain Evasive during turn
    const burstOfSpeed = {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "BURST OF SPEED",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(burstOfSpeed));
  });

  it.skip("Bashful - Adoring Knight: should parse card text", () => {
    const text =
      "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: IMPRESS THE PRINCESS - conditional Bodyguard
    const impressThePrincess = {
      effect: {
        keyword: "Bodyguard",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "IMPRESS THE PRINCESS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(impressThePrincess));
  });

  it.skip("Happy - Lively Knight: should parse card text", () => {
    const text =
      "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BURST OF SPEED - gain Evasive during turn
    const burstOfSpeed = {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "BURST OF SPEED",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(burstOfSpeed));
  });

  it.skip("Doc - Bold Knight: should parse card text", () => {
    const text =
      "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DRASTIC MEASURES - on play, optional discard/draw
    const drasticMeasures = {
      effect: {
        effect: {
          effects: [
            { amount: "all", target: "CONTROLLER", type: "discard" },
            { amount: 2, target: "CONTROLLER", type: "draw" },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "DRASTIC MEASURES",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(drasticMeasures));
  });

  it.skip("Arthur - King Victorious: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Arthur.)\nKNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift5: KeywordAbilityDefinition = {
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift5));

    // Second ability: KNIGHTED BY THE KING - on play, grant keywords
    const knightedByTheKing = {
      effect: {
        effects: [
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: "CHOSEN_CHARACTER",
            type: "gain-keyword",
            value: 2,
          },
          {
            duration: "this-turn",
            keyword: "Resist",
            target: "CHOSEN_CHARACTER",
            type: "gain-keyword",
            value: 2,
          },
          {
            ability: { type: "challenge-ready" },
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
      name: "KNIGHTED BY THE KING",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(knightedByTheKing));
  });

  it.skip("Duck for Cover!: should parse card text", () => {
    const text =
      "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant keywords
    const duckForCover = {
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(duckForCover));
  });

  it.skip("Food Fight!: should parse card text", () => {
    const text = 'Your characters gain "{E}, 1 {I} — Deal 1 damage to chosen character" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant activated ability
    const foodFight = {
      effect: {
        type: "gain-ability",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(foodFight));
  });

  it.skip("Bad-Anon - Villain Support Center: should parse card text", () => {
    const text =
      "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain \"{E}, 3 {I} — Play a character with the same name as this character for free\" while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: THERE'S NO ONE I'D RATHER BE THAN ME - grant ability
    const theresNoOneIdRatherBeThanMe = {
      effect: {
        type: "gain-ability",
      },
      name: "THERE'S NO ONE I'D RATHER BE THAN ME",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theresNoOneIdRatherBeThanMe),
    );
  });
});
