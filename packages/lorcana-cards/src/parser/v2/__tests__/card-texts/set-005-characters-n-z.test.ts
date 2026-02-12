// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 005 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Prince Naveen - Ukulele Player: should parse card text", () => {
    const text =
      "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 6
    const singer6: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 6,
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(singer6));

    // Second ability: IT'S BEAUTIFUL, NO? - triggered, play song for free
    const itsBeautifulNo = {
      effect: {
        effect: {
          cardType: "song",
          free: true,
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      name: "IT'S BEAUTIFUL, NO?",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(itsBeautifulNo));
  });

  it.skip("Rutt - Northern Moose: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Support keyword
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("Vanellope von Schweetz - Candy Mechanic: should parse card text", () => {
    const text =
      "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOU'VE GOT TO PAY TO PLAY - on quest, debuff
    const youveGotToPayToPlay = {
      effect: {
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      name: "YOU'VE GOT TO PAY TO PLAY",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(youveGotToPayToPlay));
  });

  it.skip("Vanellope von Schweetz - Sugar Rush Princess: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift2: KeywordAbilityDefinition = {
      cost: {
        ink: 2,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift2));

    // Second ability: I HEREBY DECREE - triggered when playing Princess
    const iHerebyDecree = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      name: "I HEREBY DECREE",
      trigger: {
        event: "play",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(iHerebyDecree));
  });

  it.skip("Wreck-It Ralph - Admiral Underpants: should parse card text", () => {
    const text =
      "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'VE GOT THE COOLEST FRIEND - return from discard with bonus
    const iveGotTheCoolestFriend = {
      effect: {
        effects: [
          { target: "CHARACTER_FROM_DISCARD", type: "return-to-hand" },
          {
            condition: { type: "is-princess" },
            then: { type: "gain-lore", amount: 2 },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      name: "I'VE GOT THE COOLEST FRIEND",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iveGotTheCoolestFriend));
  });

  it.skip("Sven - Reindeer Steed: should parse card text", () => {
    const text =
      "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REINDEER GAMES - optional ready with restriction
    const reindeerGames = {
      effect: {
        effect: {
          effects: [
            { type: "ready", target: "CHOSEN_CHARACTER" },
            {
              type: "restriction",
              restriction: "cant-quest-or-challenge",
              target: "CHOSEN_CHARACTER",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "REINDEER GAMES",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(reindeerGames));
  });

  it.skip("Try Everything: should parse card text", () => {
    const text =
      "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage, ready, then restrict
    const tryEverything = {
      effect: {
        effects: [
          {
            amount: 3,
            target: "CHOSEN_CHARACTER",
            type: "remove-damage",
          },
          { target: "CHOSEN_CHARACTER", type: "ready" },
          {
            duration: "this-turn",
            restriction: "cant-quest-or-challenge",
            target: "CHOSEN_CHARACTER",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tryEverything));
  });

  it.skip("Revive: should parse card text", () => {
    const text = "Play a character card with cost 5 or less from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: play from discard
    const revive = {
      effect: {
        free: true,
        from: "discard",
        type: "play-card",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(revive));
  });

  it.skip("Queen's Sensor Core: should parse card text", () => {
    const text =
      "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\nROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SYMBOL OF NOBILITY - triggered at start of turn
    const symbolOfNobility = {
      effect: {
        condition: {
          classification: "Princess",
          type: "have-character",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      name: "SYMBOL OF NOBILITY",
      trigger: {
        event: "start-of-turn",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(symbolOfNobility));

    // Second ability: ROYAL SEARCH - activated, exert + ink
    const royalSearch = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
        type: "reveal-top",
      },
      name: "ROYAL SEARCH",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(royalSearch));
  });

  it.skip("Rapunzel's Tower - Secluded Prison: should parse card text", () => {
    const text = "SAFE AND SOUND Characters get +3 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SAFE AND SOUND - buff characters at location
    const safeAndSound = {
      effect: {
        modifier: 3,
        stat: "willpower",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      name: "SAFE AND SOUND",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(safeAndSound));
  });

  it.skip("Pride Lands - Jungle Oasis: should parse card text", () => {
    const text =
      "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: OUR HUMBLE HOME - conditional effect
    const ourHumbleHome = {
      effect: {
        condition: {
          type: "has-character-here",
        },
        then: {
          free: true,
          from: "discard",
          type: "play-card",
        },
        type: "conditional",
      },
      name: "OUR HUMBLE HOME",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ourHumbleHome));
  });

  it.skip("The Nokk - Mythical Spirit: should parse card text", () => {
    const text =
      "TURNING TIDES When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TURNING TIDES - move damage
    const turningTides = {
      effect: {
        effect: {
          amount: 2,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
          type: "move-damage",
        },
        type: "optional",
      },
      name: "TURNING TIDES",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(turningTides));
  });

  it.skip("Olaf - Happy Passenger: should parse card text", () => {
    const text =
      "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CLEAR THE PATH - cost reduction
    const clearThePath = {
      effect: {
        type: "cost-reduction",
      },
      name: "CLEAR THE PATH",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(clearThePath));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Rafiki - Shaman Duelist: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: SURPRISING SKILL - grant Challenger
    const surprisingSkill = {
      effect: {
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      name: "SURPRISING SKILL",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(surprisingSkill));
  });

  it.skip("We Know the Way: should parse card text", () => {
    const text =
      "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle and conditional play
    const weKnowTheWay = {
      effect: {
        effects: [
          { target: "CHOSEN_CARD_IN_DISCARD", type: "shuffle-into-deck" },
          { target: "TOP_OF_DECK", type: "reveal" },
          {
            condition: { type: "revealed-has-same-name" },
            else: { target: "REVEALED_CARD", type: "put-in-hand" },
            then: {
              effect: {
                free: true,
                target: "REVEALED_CARD",
                type: "play-card",
              },
              type: "optional",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(weKnowTheWay));
  });

  it.skip("Retrosphere: should parse card text", () => {
    const text =
      "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF AMETHYST - bounce with cost
    const extractOfAmethyst = {
      cost: {
        banishSelf: true,
        ink: 2,
      },
      effect: {
        filter: { maxCost: 3 },
        target: "CHOSEN_CHARACTER",
        type: "return-to-hand",
      },
      name: "EXTRACT OF AMETHYST",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(extractOfAmethyst));
  });

  it.skip("The Library - A Gift for Belle: should parse card text", () => {
    const text = "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LOST IN A BOOK - on banish at location
    const lostInABook = {
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "LOST IN A BOOK",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(lostInABook));
  });

  it.skip("Robin Hood - Timely Contestant: should parse card text", () => {
    const text =
      "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TAG ME IN! - cost reduction
    const tagMeIn = {
      effect: {
        type: "cost-reduction",
      },
      name: "TAG ME IN!",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tagMeIn));

    // Second ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Shenzi - Scar's Accomplice: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nEASY PICKINGS While challenging a damaged character, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // Second ability: EASY PICKINGS - conditional buff
    const easyPickings = {
      condition: {
        type: "opponent-has-damaged-character",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "EASY PICKINGS",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(easyPickings));
  });

  it.skip("Zazu - Advisor to Mufasa: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Ulf - Mime: should parse card text", () => {
    const text = "SILENT PERFORMANCE This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SILENT PERFORMANCE - restriction
    const silentPerformance = {
      effect: {
        restriction: "cant-sing",
        target: "SELF",
        type: "restriction",
      },
      name: "SILENT PERFORMANCE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(silentPerformance));
  });

  it.skip("Robin Hood - Archery Contestant: should parse card text", () => {
    const text =
      "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TRICK SHOT - conditional lore gain
    const trickShot = {
      effect: {
        condition: {
          type: "opponent-has-damaged-character",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      name: "TRICK SHOT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(trickShot));
  });

  it.skip("Scroop - Odious Mutineer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));

    // Second ability: DO SAY HELLO - optional banish
    const doSayHello = {
      effect: {
        effect: {
          cost: { ink: 3 },
          effect: {
            type: "banish",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
          type: "pay-cost",
        },
        type: "optional",
      },
      name: "DO SAY HELLO TO MR. ARROW",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(doSayHello));
  });

  it.skip("Prince Phillip - Swordsman of the Realm: should parse card text", () => {
    const text =
      "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SLAYER OF DRAGONS - banish Dragon
    const slayerOfDragons = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "banish",
      },
      name: "SLAYER OF DRAGONS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(slayerOfDragons));

    // Second ability: PRESSING THE ADVANTAGE - ready after challenge
    const pressingTheAdvantage = {
      effect: {
        target: "SELF",
        type: "ready",
      },
      name: "PRESSING THE ADVANTAGE",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(pressingTheAdvantage));
  });

  it.skip("Robin Hood - Sneaky Sleuth: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.";
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

    // Second ability: CLEVER PLAN - lore boost
    const cleverPlan = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "CLEVER PLAN",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(cleverPlan));
  });

  it.skip("Shenzi - Head Hyena: should parse card text", () => {
    const text =
      "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: STICK AROUND FOR DINNER - buff based on Hyenas
    const stickAroundForDinner = {
      effect: {
        modifier: {
          counter: { controller: "you", type: "characters" },
          modifier: 1,
          type: "for-each",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "STICK AROUND FOR DINNER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(stickAroundForDinner));

    // Second ability: WHAT HAVE WE GOT HERE? - lore gain on challenge
    const whatHaveWeGotHere = {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "WHAT HAVE WE GOT HERE?",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(whatHaveWeGotHere));
  });

  it.skip("Scar - Vengeful Lion: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: LIFE'S NOT FAIR - draw on challenge
    const lifesNotFair = {
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "LIFE'S NOT FAIR, IS IT?",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(lifesNotFair));
  });

  it.skip("Night Howler Rage: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Reckless
    const nightHowlerRage = {
      effect: {
        effects: [
          { amount: 1, target: "CONTROLLER", type: "draw" },
          {
            duration: "next-turn",
            keyword: "Reckless",
            target: "CHOSEN_CHARACTER",
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(nightHowlerRage));
  });

  it.skip("You're Welcome: should parse card text", () => {
    const text =
      "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle into deck, player draws
    const youreWelcome = {
      effect: {
        effects: [
          {
            target: "CHOSEN_CHARACTER_ITEM_OR_LOCATION",
            type: "shuffle-into-deck",
          },
          { amount: 2, target: "THAT_PLAYER", type: "draw" },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(youreWelcome));
  });

  it.skip("Remember Who You Are: should parse card text", () => {
    const text =
      "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: conditional draw
    const rememberWhoYouAre = {
      effect: {
        condition: {
          type: "opponent-has-more-cards",
        },
        then: {
          target: "CONTROLLER",
          type: "draw-until",
          until: { type: "equal-cards-in-hand" },
        },
        type: "conditional",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rememberWhoYouAre));
  });

  it.skip("Prince John's Mirror: should parse card text", () => {
    const text =
      "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.\nA FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU LOOK REGAL - cost reduction
    const youLookRegal = {
      effect: {
        type: "cost-reduction",
      },
      name: "YOU LOOK REGAL",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(youLookRegal));

    // Second ability: A FEELING OF POWER - triggered discard
    const aFeelingOfPower = {
      effect: {
        condition: {
          count: 3,
          type: "opponent-has-more-than-cards",
        },
        then: {
          target: "OPPONENT",
          type: "discard-until",
          until: { type: "cards-in-hand", count: 3 },
        },
        type: "conditional",
      },
      name: "A FEELING OF POWER",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(aFeelingOfPower));
  });

  it.skip("Obscurosphere: should parse card text", () => {
    const text =
      "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF EMERALD - grant Ward
    const extractOfEmerald = {
      cost: {
        banishSelf: true,
        ink: 2,
      },
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      name: "EXTRACT OF EMERALD",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(extractOfEmerald));
  });

  it.skip("Sherwood Forest - Outlaw Hideaway: should parse card text", () => {
    const text =
      'FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and "{E}, 1 {I} — Deal 2 damage to chosen damaged character" while here. (Opponents can\'t choose them except to challenge.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FOREST HOME - free move
    const forestHome = {
      effect: {
        type: "cost-reduction",
      },
      name: "FOREST HOME",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(forestHome));

    // Second ability: FAMILIAR TERRAIN - grant abilities
    const familiarTerrain = {
      effect: {
        ability: { keyword: "Evasive", type: "keyword" },
        target: "YOUR_CHARACTERS",
        type: "grant-ability",
      },
      name: "FAMILIAR TERRAIN",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(familiarTerrain));
  });

  it.skip("Tropical Rainforest - Jaguar Lair: should parse card text", () => {
    const text =
      "SNACK TIME Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SNACK TIME - grant Reckless
    const snackTime = {
      effect: {
        keyword: "Reckless",
        target: "OPPOSING_CHARACTERS",
        type: "gain-keyword",
      },
      name: "SNACK TIME",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(snackTime));
  });

  it.skip("Wreck-It Ralph - Demolition Dude: should parse card text", () => {
    const text =
      "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REFRESHING BREAK - on ready, gain lore
    const refreshingBreak = {
      effect: {
        amount: { type: "damage-on-self" },
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "REFRESHING BREAK",
      trigger: {
        event: "ready",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(refreshingBreak));
  });

  it.skip("Turbo - Royal Hack: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: GAME JUMP - name alias
    const gameJump = {
      effect: {
        type: "property-modification",
      },
      name: "GAME JUMP",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(gameJump));
  });

  it.skip("Scar - Betrayer: should parse card text", () => {
    const text =
      "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LONG LIVE THE KING - optional banish Mufasa
    const longLiveTheKing = {
      effect: {
        effect: {
          target: {
            type: "query",
            query: { name: "Mufasa" },
          },
          type: "banish",
        },
        type: "optional",
      },
      name: "LONG LIVE THE KING",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(longLiveTheKing));
  });

  it.skip("Snowanna Rainbeau - Cool Competitor: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush keyword
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Ratigan - Raging Rat: should parse card text", () => {
    const text = "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOTHING CAN STAND IN MY WAY - conditional buff
    const nothingCanStandInMyWay = {
      condition: {
        type: "self-has-damage",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "NOTHING CAN STAND IN MY WAY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(nothingCanStandInMyWay));
  });

  it.skip("Taffyta Muttonfudge - Crowd Favorite: should parse card text", () => {
    const text =
      "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SHOWSTOPPER - conditional lore loss
    const showstopper = {
      effect: {
        condition: { type: "has-location-in-play" },
        then: {
          amount: 1,
          target: "EACH_OPPONENT",
          type: "lose-lore",
        },
        type: "conditional",
      },
      name: "SHOWSTOPPER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(showstopper));
  });

  it.skip("Pete - Steamboat Rival: should parse card text", () => {
    const text =
      "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SCRAM! - conditional banish
    const scram = {
      effect: {
        condition: {
          name: "Pete",
          other: true,
          type: "has-named-character",
        },
        then: {
          effect: {
            type: "banish",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "SCRAM!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(scram));
  });

  it.skip("Taffyta Muttonfudge - Sour Speedster: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)\nNEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift2: KeywordAbilityDefinition = {
      cost: {
        ink: 2,
      },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift2));

    // Second ability: NEW ROSTER - triggered, on move to location
    const newRoster = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      name: "NEW ROSTER",
      trigger: {
        event: "move",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(newRoster));
  });

  it.skip("Robin Hood - Sharpshooter: should parse card text", () => {
    const text =
      "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MY GREATEST PERFORMANCE - on quest, look/play action
    const myGreatestPerformance = {
      effect: {
        type: "look-at-deck",
      },
      name: "MY GREATEST PERFORMANCE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(myGreatestPerformance));
  });

  it.skip("Ratigan - Party Crasher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.";
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

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // Third ability: DELIGHTFULLY WICKED - static buff
    const delightfullyWicked = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_VILLAIN_CHARACTERS",
        type: "modify-stat",
      },
      name: "DELIGHTFULLY WICKED",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(delightfullyWicked));
  });

  it.skip("Vanellope von Schweetz - Random Roster Racer: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: PIXLEXIA - triggered, gain Evasive
    const pixlexia = {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "PIXLEXIA",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(pixlexia));
  });

  it.skip("Simba - Adventurous Successor: should parse card text", () => {
    const text =
      "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I LAUGH IN THE FACE OF DANGER - on play, buff character
    const iLaughInTheFaceOfDanger = {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "I LAUGH IN THE FACE OF DANGER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iLaughInTheFaceOfDanger));
  });

  it.skip("Who's With Me?: should parse card text", () => {
    const text =
      "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First effect: buff all characters
    const buffEffect = {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(buffEffect));

    // Second effect: triggered, on challenge with Reckless
    const challengeEffect = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(challengeEffect));
  });

  it.skip("Potion of Might: should parse card text", () => {
    const text =
      "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: VILE CONCOCTION - pay ink, banish item, buff
    const vileConcoction = {
      cost: {
        banishSelf: true,
        ink: 1,
      },
      effect: {
        condition: {
          type: "target-is-villain",
        },
        else: {
          duration: "this-turn",
          modifier: 3,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        then: {
          duration: "this-turn",
          modifier: 4,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      name: "VILE CONCOCTION",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(vileConcoction));
  });

  it.skip("The Sword Released: should parse card text", () => {
    const text =
      "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: POWER APPOINTED - start of turn, conditional
    const powerAppointed = {
      effect: {
        condition: {
          type: "has-strongest-character",
        },
        then: {
          effects: [
            { type: "lose-lore", amount: 1, target: "EACH_OPPONENT" },
            { type: "gain-lore", amount: { type: "lore-lost" } },
          ],
          type: "sequence",
        },
        type: "conditional",
      },
      name: "POWER APPOINTED",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(powerAppointed));
  });

  it.skip("Ruby Chromicon: should parse card text", () => {
    const text = "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RUBY LIGHT - exert, buff character
    const rubyLight = {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "RUBY LIGHT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rubyLight));
  });

  it.skip("Sugar Rush Speedway - Starting Line: should parse card text", () => {
    const text =
      "ON YOUR MARKS! Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: ON YOUR MARKS! - exert character, deal damage, move
    const onYourMarks = {
      cost: {
        exert: true,
        target: "CHOSEN_CHARACTER_HERE",
      },
      effect: {
        effects: [
          { amount: 1, target: "CHOSEN_CHARACTER_HERE", type: "deal-damage" },
          { free: true, target: "CHOSEN_CHARACTER_HERE", type: "move" },
        ],
        type: "sequence",
      },
      name: "ON YOUR MARKS!",
      restrictions: [{ type: "once-per-turn" }],
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(onYourMarks));
  });

  it.skip("Ratigan's Party - Seedy Back Room: should parse card text", () => {
    const text =
      "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: MISFITS' REVELRY - conditional lore buff
    const misfitsRevelry = {
      condition: {
        type: "has-damaged-character-here",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "MISFITS' REVELRY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(misfitsRevelry));
  });

  it.skip("The Queen - Cruelest of All: should parse card text", () => {
    const text = "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward keyword
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Prince John - Opportunistic Briber: should parse card text", () => {
    const text =
      "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TAXES NEVER FAIL ME - on play item, buff self
    const taxesNeverFailMe = {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "TAXES NEVER FAIL ME",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(taxesNeverFailMe));
  });

  it.skip("Pacha - Emperor's Guide: should parse card text", () => {
    const text =
      "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.\nPERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HELPFUL SUPPLIES - start of turn, conditional lore
    const helpfulSupplies = {
      effect: {
        condition: { type: "has-item-in-play" },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      name: "HELPFUL SUPPLIES",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(helpfulSupplies));

    // Second ability: PERFECT DIRECTIONS - start of turn, conditional lore
    const perfectDirections = {
      effect: {
        condition: { type: "has-location-in-play" },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      name: "PERFECT DIRECTIONS",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(perfectDirections));
  });

  it.skip("The Queen - Fairest of All: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.";
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

    // Second ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: REFLECTIONS OF VANITY - static lore buff
    const reflectionsOfVanity = {
      effect: {
        modifier: { of: "OTHER_QUEEN_CHARACTERS", type: "count" },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "REFLECTIONS OF VANITY",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(reflectionsOfVanity));
  });

  it.skip("Sheriff of Nottingham - Bushel Britches: should parse card text", () => {
    const text =
      "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVERY LITTLE BIT HELPS - cost reduction
    const everyLittleBitHelps = {
      effect: {
        type: "cost-reduction",
      },
      name: "EVERY LITTLE BIT HELPS",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(everyLittleBitHelps));

    // Second ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("Prince John - Gold Lover: should parse card text", () => {
    const text =
      "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: BEAUTIFUL, LOVELY TAXES - exert, play item for free
    const beautifulLovelyTaxes = {
      cost: {
        exert: true,
      },
      effect: {
        type: "play-card",
      },
      name: "BEAUTIFUL, LOVELY TAXES",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(beautifulLovelyTaxes));
  });

  it.skip("The Queen - Crown of the Council: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: GATHERER OF THE WICKED - on play, look at deck
    const gathererOfTheWicked = {
      effect: {
        type: "look-at-deck",
      },
      name: "GATHERER OF THE WICKED",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(gathererOfTheWicked));
  });

  it.skip("Tanana - Wise Woman: should parse card text", () => {
    const text =
      "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOUR BROTHERS NEED GUIDANCE - on play, heal
    const yourBrothersNeedGuidance = {
      effect: {
        effect: {
          amount: { upTo: 1 },
          target: "CHOSEN_CHARACTER_OR_LOCATION",
          type: "remove-damage",
        },
        type: "optional",
      },
      name: "YOUR BROTHERS NEED GUIDANCE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(yourBrothersNeedGuidance));
  });

  it.skip("Tipo - Growing Son: should parse card text", () => {
    const text =
      "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MEASURE ME AGAIN - on play, optional inkwell
    const measureMeAgain = {
      effect: {
        effect: {
          exerted: true,
          target: "CHOSEN_CARD_IN_HAND",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      name: "MEASURE ME AGAIN",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(measureMeAgain));
  });

  it.skip("Vision of the Future: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: look at deck
    const visionOfTheFuture = {
      effect: {
        type: "look-at-deck",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(visionOfTheFuture));
  });

  it.skip("Royal Tantrum: should parse card text", () => {
    const text =
      "Banish any number of your items, then draw a card for each item banished this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish items, draw cards
    const royalTantrum = {
      effect: {
        effects: [
          { target: "ANY_NUMBER_OF_YOUR_ITEMS", type: "banish" },
          {
            amount: { of: "ITEMS_BANISHED", type: "count" },
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(royalTantrum));
  });

  it.skip("Sapphire Chromicon: should parse card text", () => {
    const text =
      "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: POWERING UP - enters play exerted
    const poweringUp = {
      effect: {
        type: "enters-play-exerted",
      },
      name: "POWERING UP",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(poweringUp));

    // Second ability: SAPPHIRE LIGHT - activated, gain lore
    const sapphireLight = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      name: "SAPPHIRE LIGHT",
      type: "activated",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(sapphireLight));
  });

  it.skip("The Great Illuminary - Radiant Ballroom: should parse card text", () => {
    const text = "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: WARM WELCOME - buff characters at location
    const warmWelcome = {
      effect: {
        effects: [
          {
            modifier: 1,
            stat: "lore",
            target: "CHARACTERS_WITH_SUPPORT_HERE",
            type: "modify-stat",
          },
          {
            modifier: 2,
            stat: "willpower",
            target: "CHARACTERS_WITH_SUPPORT_HERE",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      name: "WARM WELCOME",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(warmWelcome));
  });

  it.skip("Stitch - Team Underdog: should parse card text", () => {
    const text =
      "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEAVE HO! - on play, optional damage
    const heaveHo = {
      effect: {
        effect: {
          amount: 2,
          target: "CHOSEN_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      name: "HEAVE HO!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(heaveHo));
  });

  it.skip("Simba - Lost Prince: should parse card text", () => {
    const text =
      "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FACE THE PAST - on banish in challenge, draw
    const faceThePast = {
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "FACE THE PAST",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(faceThePast));
  });

  it.skip("Sleepy - Sluggish Knight: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard keyword
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
  });

  it.skip("Sneezy - Noisy Knight: should parse card text", () => {
    const text =
      "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEADWIND - on play, grant Challenger
    const headwind = {
      effect: {
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      name: "HEADWIND",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(headwind));
  });

  it.skip("Namaari - Resolute Daughter: should parse card text", () => {
    const text =
      "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.\nResist +3 (Damage dealt to this character is reduced by 3.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I DON'T HAVE ANY OTHER CHOICE - cost reduction
    const iDontHaveAnyOtherChoice = {
      effect: {
        type: "cost-reduction",
      },
      name: "I DON'T HAVE ANY OTHER CHOICE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iDontHaveAnyOtherChoice));

    // Second ability: Resist +3
    const resist3: KeywordAbilityDefinition = {
      keyword: "Resist",
      type: "keyword",
      value: 3,
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(resist3));
  });

  it.skip("Snow White - Fair-Hearted: should parse card text", () => {
    const text =
      "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play. (Damage dealt to this character is reduced by 1 for each other Knight.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NATURAL LEADER - scalable Resist
    const naturalLeader = {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      name: "NATURAL LEADER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(naturalLeader));
  });

  it.skip("Yzma - Unjustly Treated: should parse card text", () => {
    const text =
      "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'M WARNING YOU! - on banish, optional damage
    const imWarningYou = {
      effect: {
        effect: {
          amount: 1,
          target: "CHOSEN_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      name: "I'M WARNING YOU!",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(imWarningYou));
  });

  it.skip("Pete - Wrestling Champ: should parse card text", () => {
    const text =
      "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RE-PETE - exert, reveal and conditional play
    const rePete = {
      cost: {
        exert: true,
      },
      effect: {
        effects: [
          { target: "TOP_OF_DECK", type: "reveal" },
          {
            condition: {
              name: "Pete",
              type: "revealed-is-character-named",
            },
            then: {
              effect: {
                free: true,
                target: "REVEALED_CARD",
                type: "play-card",
              },
              type: "optional",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      name: "RE-PETE",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rePete));
  });

  it.skip("Simba - Son of Mufasa: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.";
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

    // Second ability: FEARSOME ROAR - on play, optional banish
    const fearsomeRoar = {
      effect: {
        effect: {
          target: "CHOSEN_ITEM_OR_LOCATION",
          type: "banish",
        },
        type: "optional",
      },
      name: "FEARSOME ROAR",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(fearsomeRoar));
  });

  it.skip("Pete - Games Referee: should parse card text", () => {
    const text =
      "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BLOW THE WHISTLE - on play, restriction
    const blowTheWhistle = {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        type: "restriction",
      },
      name: "BLOW THE WHISTLE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(blowTheWhistle));
  });

  it.skip("Tug-of-War: should parse card text", () => {
    const text =
      "Choose one:\n• Deal 1 damage to each opposing character without Evasive.\n• Deal 3 damage to each opposing character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: choose one - modal damage
    const tugOfWar = {
      effect: {
        type: "modal",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tugOfWar));
  });

  it.skip("When Will My Life Begin?: should parse card text", () => {
    const text = "Chosen character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: restriction and draw
    const whenWillMyLifeBegin = {
      effect: {
        effects: [
          {
            duration: "next-turn",
            restriction: "cant-challenge",
            target: "CHOSEN_CHARACTER",
            type: "restriction",
          },
          { amount: 1, target: "CONTROLLER", type: "draw" },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(whenWillMyLifeBegin));
  });

  it.skip("Shield of Arendelle: should parse card text", () => {
    const text =
      "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: DEFLECT - banish self, grant Resist
    const deflect = {
      cost: {
        banishSelf: true,
      },
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      name: "DEFLECT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(deflect));
  });

  it.skip("Plate Armor: should parse card text", () => {
    const text =
      "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: WELL CRAFTED - exert, grant Resist
    const wellCrafted = {
      cost: {
        exert: true,
      },
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      name: "WELL CRAFTED",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(wellCrafted));
  });

  it.skip("Steel Chromicon: should parse card text", () => {
    const text = "STEEL LIGHT {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: STEEL LIGHT - exert, deal damage
    const steelLight = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        type: "deal-damage",
      },
      name: "STEEL LIGHT",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(steelLight));
  });

  it.skip("Seven Dwarfs' Mine - Secure Fortress: should parse card text", () => {
    const text =
      "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOUNTAIN DEFENSE - on move, conditional damage
    const mountainDefense = {
      effect: {
        effect: {
          condition: {
            type: "moved-character-is-knight",
          },
          else: {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER",
          },
          then: {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          type: "conditional",
        },
        type: "optional",
      },
      name: "MOUNTAIN DEFENSE",
      restrictions: [{ type: "first-time-each-turn" }],
      trigger: {
        event: "move",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(mountainDefense));
  });
});
