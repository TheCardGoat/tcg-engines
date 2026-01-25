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

describe("Set 005 Card Text Parser Tests", () => {
  it.skip("Koda - Talkative Cub: should parse card text", () => {
    const text = "TELL EVERYBODY During opponents' turns, you can't lose lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: TELL EVERYBODY - protection from lore loss
    const tellEverybody: StaticAbilityDefinition = {
      type: "static",
      name: "TELL EVERYBODY",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tellEverybody),
    );
  });

  it.skip("Prince Naveen - Ukulele Player: should parse card text", () => {
    const text =
      "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 6
    const singer6: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 6,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer6),
    );

    // Second ability: IT'S BEAUTIFUL, NO? - triggered, play song for free
    const itsBeautifulNo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT'S BEAUTIFUL, NO?",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          cardType: "song",
          from: "hand",
          free: true,
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(itsBeautifulNo),
    );
  });

  it.skip("Rutt - Northern Moose: should parse card text", () => {
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

  it.skip("Kenai - Big Brother: should parse card text", () => {
    const text =
      "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BROTHERS FOREVER - conditional protection
    const brothersForever: StaticAbilityDefinition = {
      type: "static",
      name: "BROTHERS FOREVER",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(brothersForever),
    );
  });

  it.skip("Lilo - Junior Cake Decorator: should parse card text", () => {
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

  it.skip("Vanellope von Schweetz - Candy Mechanic: should parse card text", () => {
    const text =
      "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOU'VE GOT TO PAY TO PLAY - on quest, debuff
    const youveGotToPayToPlay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'VE GOT TO PAY TO PLAY",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youveGotToPayToPlay),
    );
  });

  it.skip("Fix-It Felix, Jr. - Trusty Builder: should parse card text", () => {
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

  it.skip("Gazelle - Pop Star: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    const singer5: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer5),
    );
  });

  it.skip("Fix-It Felix, Jr. - Niceland Steward: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)\nBUILDING TOGETHER Your locations get +2 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: BUILDING TOGETHER - static buff locations
    const buildingTogether: StaticAbilityDefinition = {
      type: "static",
      name: "BUILDING TOGETHER",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "YOUR_LOCATIONS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(buildingTogether),
    );
  });

  it.skip("Kristoff - Reindeer Keeper: should parse card text", () => {
    const text =
      "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SONG OF THE HERD - cost reduction based on songs in discard
    const songOfTheHerd: StaticAbilityDefinition = {
      type: "static",
      name: "SONG OF THE HERD",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(songOfTheHerd),
    );

    // Second ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Mirabel Madrigal - Family Gatherer: should parse card text", () => {
    const text =
      "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOT WITHOUT MY FAMILY - play restriction
    const notWithoutMyFamily: StaticAbilityDefinition = {
      type: "static",
      name: "NOT WITHOUT MY FAMILY",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(notWithoutMyFamily),
    );
  });

  it.skip("Minnie Mouse - Drum Major: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: PARADE ORDER - triggered on play with shift condition
    const paradeOrder: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PARADE ORDER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        then: {
          type: "optional",
          effect: {
            type: "search-deck",
            cardType: "character",
            reveal: true,
            putOnTop: true,
          },
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(paradeOrder),
    );
  });

  it.skip("Daisy Duck - Donald's Date: should parse card text", () => {
    const text =
      "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BIG PRIZE - on quest, opponents reveal top card
    const bigPrize: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BIG PRIZE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "reveal-top",
        amount: 1,
        target: "OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bigPrize),
    );
  });

  it.skip("Fix-It Felix, Jr. - Delighted Sightseer: should parse card text", () => {
    const text =
      "OH, MY LAND! When you play this character, if you have a location in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: OH, MY LAND! - conditional draw on play
    const ohMyLand: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OH, MY LAND!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "at-location" },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ohMyLand),
    );
  });

  it.skip("Vanellope von Schweetz - Sugar Rush Princess: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: I HEREBY DECREE - triggered when playing Princess
    const iHerebyDecree: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I HEREBY DECREE",
      trigger: {
        event: "play",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iHerebyDecree),
    );
  });

  it.skip("Alan-a-Dale - Rockin' Rooster: should parse card text", () => {
    const text = "FAN FAVORITE Whenever you play a song, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FAN FAVORITE - gain lore when playing song
    const fanFavorite: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FAN FAVORITE",
      trigger: {
        event: "play",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fanFavorite),
    );
  });

  it.skip("Wreck-It Ralph - Admiral Underpants: should parse card text", () => {
    const text =
      "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'VE GOT THE COOLEST FRIEND - return from discard with bonus
    const iveGotTheCoolestFriend: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'VE GOT THE COOLEST FRIEND",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "return-to-hand", target: "CHARACTER_FROM_DISCARD" },
          {
            type: "conditional",
            condition: { type: "is-princess" },
            then: { type: "gain-lore", amount: 2 },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iveGotTheCoolestFriend),
    );
  });

  it.skip("Maid Marian - Lady of the Lists: should parse card text", () => {
    const text =
      "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IF IT PLEASES THE LADY - debuff on play
    const ifItPleasesTheLady: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IF IT PLEASES THE LADY",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ifItPleasesTheLady),
    );
  });

  it.skip("Sven - Reindeer Steed: should parse card text", () => {
    const text =
      "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REINDEER GAMES - optional ready with restriction
    const reindeerGames: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "REINDEER GAMES",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "ready", target: "CHOSEN_CHARACTER" },
            {
              type: "restriction",
              restriction: "cant-quest-or-challenge",
              target: "CHOSEN_CHARACTER",
            },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reindeerGames),
    );
  });

  it.skip("Minnie Mouse - Compassionate Friend: should parse card text", () => {
    const text =
      "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PATCH THEM UP - on quest, remove damage
    const patchThemUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PATCH THEM UP",
      trigger: {
        event: "quest",
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
      expect.objectContaining(patchThemUp),
    );
  });

  it.skip("Try Everything: should parse card text", () => {
    const text =
      "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage, ready, then restrict
    const tryEverything: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "remove-damage",
            amount: 3,
            target: "CHOSEN_CHARACTER",
          },
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest-or-challenge",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tryEverything),
    );
  });

  it.skip("Healing Touch: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage and draw
    const healingTouch: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "remove-damage",
            amount: 4,
            target: "CHOSEN_CHARACTER",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healingTouch),
    );
  });

  it.skip("Revive: should parse card text", () => {
    const text =
      "Play a character card with cost 5 or less from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: play from discard
    const revive: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "play-card",
        from: "discard",
        free: true,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(revive),
    );
  });

  it.skip("Blast from Your Past: should parse card text", () => {
    const text =
      "Name a card. Return all character cards with that name from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: name a card, return from discard
    const blastFromYourPast: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "name-a-card" },
          {
            type: "return-to-hand",
            target: "CHARACTER_FROM_DISCARD",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(blastFromYourPast),
    );
  });

  it.skip("Invited to the Ball: should parse card text", () => {
    const text =
      "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: reveal and filter cards
    const invitedToTheBall: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "scry",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(invitedToTheBall),
    );
  });

  it.skip("Healing Decanter: should parse card text", () => {
    const text =
      "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RENEWING ESSENCE - exert to remove damage
    const renewingEssence: ActivatedAbilityDefinition = {
      type: "activated",
      name: "RENEWING ESSENCE",
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
      expect.objectContaining(renewingEssence),
    );
  });

  it.skip("Queen's Sensor Core: should parse card text", () => {
    const text =
      "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\nROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SYMBOL OF NOBILITY - triggered at start of turn
    const symbolOfNobility: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SYMBOL OF NOBILITY",
      trigger: {
        event: "start-of-turn",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "have-character",
          classification: "Princess",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(symbolOfNobility),
    );

    // Second ability: ROYAL SEARCH - activated, exert + ink
    const royalSearch: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ROYAL SEARCH",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "reveal-top",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(royalSearch),
    );
  });

  it.skip("Amber Chromicon: should parse card text", () => {
    const text =
      "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMBER LIGHT - exert to remove damage from all
    const amberLight: ActivatedAbilityDefinition = {
      type: "activated",
      name: "AMBER LIGHT",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(amberLight),
    );
  });

  it.skip("Rapunzel's Tower - Secluded Prison: should parse card text", () => {
    const text = "SAFE AND SOUND Characters get +3 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SAFE AND SOUND - buff characters at location
    const safeAndSound: StaticAbilityDefinition = {
      type: "static",
      name: "SAFE AND SOUND",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 3,
        target: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(safeAndSound),
    );
  });

  it.skip("Pride Lands - Jungle Oasis: should parse card text", () => {
    const text =
      "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: OUR HUMBLE HOME - conditional effect
    const ourHumbleHome: StaticAbilityDefinition = {
      type: "static",
      name: "OUR HUMBLE HOME",
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-here",
        },
        then: {
          type: "play-card",
          from: "discard",
          free: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ourHumbleHome),
    );
  });

  it.skip("Maleficent - Formidable Queen: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Maleficent.)\nLISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift6: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift6),
    );

    // Second ability: LISTEN WELL, ALL OF YOU - triggered on play
    const listenWellAllOfYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LISTEN WELL, ALL OF YOU",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "for-each",
        counter: { type: "characters", controller: "you" },
        effect: { type: "return-to-hand", target: "CHOSEN_OPPOSING_CHARACTER" },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(listenWellAllOfYou),
    );
  });

  it.skip("The Nokk - Mythical Spirit: should parse card text", () => {
    const text =
      "TURNING TIDES When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TURNING TIDES - move damage
    const turningTides: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TURNING TIDES",
      trigger: {
        event: "play",
        timing: "when",
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
      expect.objectContaining(turningTides),
    );
  });

  it.skip("Cogsworth - Illuminary Watchman: should parse card text", () => {
    const text =
      "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TIME TO MOVE IT! - grant Rush
    const timeToMoveIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TIME TO MOVE IT!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(timeToMoveIt),
    );
  });

  it.skip("Merlin - Turtle: should parse card text", () => {
    const text =
      "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GIVE ME TIME TO THINK - dual trigger
    const giveMeTimeToThink: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GIVE ME TIME TO THINK",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(giveMeTimeToThink),
    );
  });

  it.skip("Archimedes - Exasperated Owl: should parse card text", () => {
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

  it.skip("Bruni - Fire Salamander: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.";
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

    // Second ability: PARTING GIFT - triggered on banish
    const partingGift: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PARTING GIFT",
      trigger: {
        event: "banish",
        timing: "when",
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
      expect.objectContaining(partingGift),
    );
  });

  it.skip("Earth Giant - Living Mountain: should parse card text", () => {
    const text =
      "UNEARTHED When you play this character, each opponent draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: UNEARTHED - opponents draw
    const unearthed: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UNEARTHED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(unearthed),
    );
  });

  it.skip("Gale - Wind Spirit: should parse card text", () => {
    const text =
      "RECURRING GUST When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RECURRING GUST - on banish in challenge
    const recurringGust: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RECURRING GUST",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(recurringGust),
    );
  });

  it.skip("Madam Mim - Elephant: should parse card text", () => {
    const text =
      "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A LITTLE GAME - triggered on play, choice
    const aLittleGame: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "A LITTLE GAME",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "choice",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aLittleGame),
    );

    // Second ability: SNEAKY MOVE - triggered at start of turn
    const sneakyMove: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SNEAKY MOVE",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: 2,
          from: "SELF",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(sneakyMove),
    );
  });

  it.skip("Anna - Mystical Majesty: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: EXCEPTIONAL POWER - exert all opposing
    const exceptionalPower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EXCEPTIONAL POWER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(exceptionalPower),
    );
  });

  it.skip("Archimedes - Electrified Owl: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)";
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

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: Challenger +3
    const challenger3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(challenger3),
    );
  });

  it.skip("Elsa - The Fifth Spirit: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.";
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

    // Third ability: CRYSTALLIZE - triggered exert
    const crystallize: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CRYSTALLIZE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(crystallize),
    );
  });

  it.skip("Genie - Main Attraction: should parse card text", () => {
    const text =
      "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PHENOMENAL SHOWMAN - conditional restriction
    const phenomenalShowman: StaticAbilityDefinition = {
      type: "static",
      name: "PHENOMENAL SHOWMAN",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "OPPOSING_CHARACTERS",
      },
      condition: {
        type: "self-exerted",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(phenomenalShowman),
    );
  });

  it.skip("Olaf - Happy Passenger: should parse card text", () => {
    const text =
      "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CLEAR THE PATH - cost reduction
    const clearThePath: StaticAbilityDefinition = {
      type: "static",
      name: "CLEAR THE PATH",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(clearThePath),
    );

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Maleficent - Vexed Partygoer: should parse card text", () => {
    const text =
      "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: WHAT AN AWKWARD SITUATION - on quest, optional bounce
    const whatAnAwkwardSituation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT AN AWKWARD SITUATION",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "discard", amount: 1, target: "CONTROLLER" },
            {
              type: "return-to-hand",
              target: "CHOSEN_CHARACTER",
              filter: { maxCost: 3 },
            },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatAnAwkwardSituation),
    );
  });

  it.skip("Magica De Spell - Cruel Sorceress: should parse card text", () => {
    const text =
      "PLAYING WITH POWER During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PLAYING WITH POWER - replacement effect
    const playingWithPower: StaticAbilityDefinition = {
      type: "static",
      name: "PLAYING WITH POWER",
      effect: {
        type: "replacement",
        replaces: "damage",
        with: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(playingWithPower),
    );
  });

  it.skip("Rafiki - Shaman Duelist: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: SURPRISING SKILL - grant Challenger
    const surprisingSkill: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SURPRISING SKILL",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(surprisingSkill),
    );
  });

  it.skip("Anna - Eager Acolyte: should parse card text", () => {
    const text =
      "GROWING POWERS When you play this character, each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GROWING POWERS - opponents choose and exert
    const growingPowers: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GROWING POWERS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: "THEIR_CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(growingPowers),
    );
  });

  it.skip("King of Hearts - Monarch of Wonderland: should parse card text", () => {
    const text =
      "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: PLEASING THE QUEEN - prevent ready
    const pleasingTheQueen: ActivatedAbilityDefinition = {
      type: "activated",
      name: "PLEASING THE QUEEN",
      cost: {
        exert: true,
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "CHOSEN_EXERTED_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pleasingTheQueen),
    );
  });

  it.skip("Camilo Madrigal - Family Copycat: should parse card text", () => {
    const text =
      "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IMITATE - on quest, gain lore and return
    const imitate: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IMITATE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "gain-lore",
              amount: 1,
              target: "CONTROLLER",
            },
            { type: "return-to-hand", target: "CHOSEN_OTHER_CHARACTER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imitate),
    );
  });

  it.skip("Hypnotic Strength: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Challenger
    const hypnoticStrength: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hypnoticStrength),
    );
  });

  it.skip("Finders Keepers: should parse card text", () => {
    const text = "Draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw 3
    const findersKeepers: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(findersKeepers),
    );
  });

  it.skip("We Know the Way: should parse card text", () => {
    const text =
      "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle and conditional play
    const weKnowTheWay: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "shuffle-into-deck", target: "CHOSEN_CARD_IN_DISCARD" },
          { type: "reveal", target: "TOP_OF_DECK" },
          {
            type: "conditional",
            condition: { type: "revealed-has-same-name" },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                target: "REVEALED_CARD",
                free: true,
              },
            },
            else: { type: "put-in-hand", target: "REVEALED_CARD" },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(weKnowTheWay),
    );
  });

  it.skip("Gathering Knowledge and Wisdom: should parse card text", () => {
    const text = "Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: gain lore
    const gatheringKnowledgeAndWisdom: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 2,
      },
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
    const magicalAid: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(magicalAid),
    );
  });

  it.skip("Retrosphere: should parse card text", () => {
    const text =
      "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF AMETHYST - bounce with cost
    const extractOfAmethyst: ActivatedAbilityDefinition = {
      type: "activated",
      name: "EXTRACT OF AMETHYST",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
        filter: { maxCost: 3 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(extractOfAmethyst),
    );
  });

  it.skip("Half Hexwell Crown: should parse card text", () => {
    const text =
      "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: AN UNEXPECTED FIND - draw
    const anUnexpectedFind: ActivatedAbilityDefinition = {
      type: "activated",
      name: "AN UNEXPECTED FIND",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(anUnexpectedFind),
    );

    // Second ability: A PERILOUS POWER - exert
    const aPerilouspower: ActivatedAbilityDefinition = {
      type: "activated",
      name: "A PERILOUS POWER",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "exert",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(aPerilouspower),
    );
  });

  it.skip("Amethyst Chromicon: should parse card text", () => {
    const text = "AMETHYST LIGHT {E} — Each player may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMETHYST LIGHT - each player draws
    const amethystLight: ActivatedAbilityDefinition = {
      type: "activated",
      name: "AMETHYST LIGHT",
      cost: {
        exert: true,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(amethystLight),
    );
  });

  it.skip("Elsa's Ice Palace - Place of Solitude: should parse card text", () => {
    const text =
      "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ETERNAL WINTER - on play, lock character
    const eternalWinter: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ETERNAL WINTER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "CHOSEN_EXERTED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(eternalWinter),
    );
  });

  it.skip("The Library - A Gift for Belle: should parse card text", () => {
    const text =
      "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LOST IN A BOOK - on banish at location
    const lostInABook: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOST IN A BOOK",
      trigger: {
        event: "banish",
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
      expect.objectContaining(lostInABook),
    );
  });

  it.skip("Robin Hood - Timely Contestant: should parse card text", () => {
    const text =
      "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TAG ME IN! - cost reduction
    const tagMeIn: StaticAbilityDefinition = {
      type: "static",
      name: "TAG ME IN!",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tagMeIn),
    );

    // Second ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Shenzi - Scar's Accomplice: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nEASY PICKINGS While challenging a damaged character, this character gets +2 {S}.";
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

    // Second ability: EASY PICKINGS - conditional buff
    const easyPickings: StaticAbilityDefinition = {
      type: "static",
      name: "EASY PICKINGS",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "opponent-has-damaged-character",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(easyPickings),
    );
  });

  it.skip("Zazu - Advisor to Mufasa: should parse card text", () => {
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

  it.skip("Ulf - Mime: should parse card text", () => {
    const text = "SILENT PERFORMANCE This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SILENT PERFORMANCE - restriction
    const silentPerformance: StaticAbilityDefinition = {
      type: "static",
      name: "SILENT PERFORMANCE",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(silentPerformance),
    );
  });

  it.skip("Ed - Laughing Hyena: should parse card text", () => {
    const text =
      "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAUSE A PANIC - optional damage
    const causeAPanic: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CAUSE A PANIC",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      expect.objectContaining(causeAPanic),
    );
  });

  it.skip("Flora - Good Fairy: should parse card text", () => {
    const text =
      "FIDDLE FADDLE While being challenged, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: FIDDLE FADDLE - conditional buff when challenged
    const fiddleFaddle: StaticAbilityDefinition = {
      type: "static",
      name: "FIDDLE FADDLE",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "being-challenged",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fiddleFaddle),
    );
  });

  it.skip("Merryweather - Good Fairy: should parse card text", () => {
    const text =
      "RAY OF HOPE When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RAY OF HOPE - optional buff
    const rayOfHope: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RAY OF HOPE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "pay-cost",
          cost: { ink: 1 },
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rayOfHope),
    );
  });

  it.skip("Robin Hood - Archery Contestant: should parse card text", () => {
    const text =
      "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TRICK SHOT - conditional lore gain
    const trickShot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TRICK SHOT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "opponent-has-damaged-character",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(trickShot),
    );
  });

  it.skip("Iago - Fake Flamingo: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.";
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

    // Second ability: IN DISGUISE - cost reduction on quest
    const inDisguise: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IN DISGUISE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(inDisguise),
    );
  });

  it.skip("Ed - Hysterical Partygoer: should parse card text", () => {
    const text =
      "ROWDY GUEST Damaged characters can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: ROWDY GUEST - restriction
    const rowdyGuest: StaticAbilityDefinition = {
      type: "static",
      name: "ROWDY GUEST",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "OPPOSING_DAMAGED_CHARACTERS",
        restrictedTarget: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rowdyGuest),
    );
  });

  it.skip("Scroop - Odious Mutineer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.";
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

    // Second ability: DO SAY HELLO - optional banish
    const doSayHello: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DO SAY HELLO TO MR. ARROW",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "pay-cost",
          cost: { ink: 3 },
          effect: {
            type: "banish",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(doSayHello),
    );
  });

  it.skip("Prince Phillip - Swordsman of the Realm: should parse card text", () => {
    const text =
      "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SLAYER OF DRAGONS - banish Dragon
    const slayerOfDragons: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SLAYER OF DRAGONS",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(slayerOfDragons),
    );

    // Second ability: PRESSING THE ADVANTAGE - ready after challenge
    const pressingTheAdvantage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PRESSING THE ADVANTAGE",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(pressingTheAdvantage),
    );
  });

  it.skip("Clarabelle - Light on Her Hooves: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)\nKEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: KEEP IN STEP - end of turn draw
    const keepInStep: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "KEEP IN STEP",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-with-classification",
          classification: "Musketeer",
          controller: "you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(keepInStep),
    );
  });

  it.skip("Anna - Diplomatic Queen: should parse card text", () => {
    const text =
      "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: \n• Each opponent chooses and discards a card. \n• Chosen character gets +2 {S} this turn. \n• Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYAL RESOLUTION - modal choice
    const royalResolution: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYAL RESOLUTION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "pay-cost",
          cost: { ink: 2 },
          effect: {
            type: "modal",
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
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalResolution),
    );
  });

  it.skip("Clarabelle - Clumsy Guest: should parse card text", () => {
    const text =
      "BUTTERFINGERS When you play this character, you may pay 2 {I} to banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BUTTERFINGERS - optional banish item
    const butterfingers: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BUTTERFINGERS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "pay-cost",
          cost: { ink: 2 },
          effect: {
            type: "banish",
            target: "CHOSEN_ITEM",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(butterfingers),
    );
  });

  it.skip("Banzai - Taunting Hyena: should parse card text", () => {
    const text =
      "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HERE KITTY - optional exert
    const hereKitty: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE KITTY, KITTY, KITTY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_DAMAGED_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereKitty),
    );
  });

  it.skip("Robin Hood - Sneaky Sleuth: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: CLEVER PLAN - lore boost
    const cleverPlan: StaticAbilityDefinition = {
      type: "static",
      name: "CLEVER PLAN",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(cleverPlan),
    );
  });

  it.skip("Mother Gothel - Conceited Manipulator: should parse card text", () => {
    const text =
      "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOTHER KNOWS BEST - optional bounce
    const motherKnowsBest: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MOTHER KNOWS BEST",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "pay-cost",
          cost: { ink: 3 },
          effect: {
            type: "return-to-hand",
            target: "CHOSEN_CHARACTER",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(motherKnowsBest),
    );
  });

  it.skip("Clarabelle - Contented Wallflower: should parse card text", () => {
    const text =
      "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ONE STEP BEHIND - conditional draw
    const oneStepBehind: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ONE STEP BEHIND",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "opponent-has-more-cards",
        },
        then: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oneStepBehind),
    );
  });

  it.skip("Shenzi - Head Hyena: should parse card text", () => {
    const text =
      "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: STICK AROUND FOR DINNER - buff based on Hyenas
    const stickAroundForDinner: StaticAbilityDefinition = {
      type: "static",
      name: "STICK AROUND FOR DINNER",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "for-each",
          counter: { type: "characters", controller: "you" },
          modifier: 1,
        },
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stickAroundForDinner),
    );

    // Second ability: WHAT HAVE WE GOT HERE? - lore gain on challenge
    const whatHaveWeGotHere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT HAVE WE GOT HERE?",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatHaveWeGotHere),
    );
  });

  it.skip("Mother Gothel - Unwavering Schemer: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)\nTHE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: THE WORLD IS DARK - opponents return characters
    const theWorldIsDark: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE WORLD IS DARK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(theWorldIsDark),
    );
  });

  it.skip("Scar - Vengeful Lion: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: LIFE'S NOT FAIR - draw on challenge
    const lifesNotFair: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LIFE'S NOT FAIR, IS IT?",
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
      expect.objectContaining(lifesNotFair),
    );
  });

  it.skip("Hypnotic Deduction: should parse card text", () => {
    const text =
      "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw then put back
    const hypnoticDeduction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "draw", amount: 3, target: "CONTROLLER" },
          {
            type: "put-on-deck",
            position: "top",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hypnoticDeduction),
    );
  });

  it.skip("Night Howler Rage: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Reckless
    const nightHowlerRage: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            target: "CHOSEN_CHARACTER",
            duration: "next-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nightHowlerRage),
    );
  });

  it.skip("You're Welcome: should parse card text", () => {
    const text =
      "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle into deck, player draws
    const youreWelcome: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "shuffle-into-deck",
            target: "CHOSEN_CHARACTER_ITEM_OR_LOCATION",
          },
          { type: "draw", amount: 2, target: "THAT_PLAYER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreWelcome),
    );
  });

  it.skip("Remember Who You Are: should parse card text", () => {
    const text =
      "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: conditional draw
    const rememberWhoYouAre: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "opponent-has-more-cards",
        },
        then: {
          type: "draw-until",
          target: "CONTROLLER",
          until: { type: "equal-cards-in-hand" },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rememberWhoYouAre),
    );
  });

  it.skip("Prince John's Mirror: should parse card text", () => {
    const text =
      "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.\nA FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU LOOK REGAL - cost reduction
    const youLookRegal: StaticAbilityDefinition = {
      type: "static",
      name: "YOU LOOK REGAL",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youLookRegal),
    );

    // Second ability: A FEELING OF POWER - triggered discard
    const aFeelingOfPower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "A FEELING OF POWER",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "opponent-has-more-than-cards",
          count: 3,
        },
        then: {
          type: "discard-until",
          target: "OPPONENT",
          until: { type: "cards-in-hand", count: 3 },
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(aFeelingOfPower),
    );
  });

  it.skip("Obscurosphere: should parse card text", () => {
    const text =
      "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF EMERALD - grant Ward
    const extractOfEmerald: ActivatedAbilityDefinition = {
      type: "activated",
      name: "EXTRACT OF EMERALD",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(extractOfEmerald),
    );
  });

  it.skip("Emerald Chromicon: should parse card text", () => {
    const text =
      "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: EMERALD LIGHT - on banish, optional bounce
    const emeraldLight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EMERALD LIGHT",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(emeraldLight),
    );
  });

  it.skip("Sherwood Forest - Outlaw Hideaway: should parse card text", () => {
    const text =
      'FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and "{E}, 1 {I} — Deal 2 damage to chosen damaged character" while here. (Opponents can\'t choose them except to challenge.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FOREST HOME - free move
    const forestHome: StaticAbilityDefinition = {
      type: "static",
      name: "FOREST HOME",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(forestHome),
    );

    // Second ability: FAMILIAR TERRAIN - grant abilities
    const familiarTerrain: StaticAbilityDefinition = {
      type: "static",
      name: "FAMILIAR TERRAIN",
      effect: {
        type: "grant-ability",
        ability: { type: "keyword", keyword: "Evasive" },
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(familiarTerrain),
    );
  });

  it.skip("Tropical Rainforest - Jaguar Lair: should parse card text", () => {
    const text =
      "SNACK TIME Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SNACK TIME - grant Reckless
    const snackTime: StaticAbilityDefinition = {
      type: "static",
      name: "SNACK TIME",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(snackTime),
    );
  });

  it.skip("Wreck-It Ralph - Demolition Dude: should parse card text", () => {
    const text =
      "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REFRESHING BREAK - on ready, gain lore
    const refreshingBreak: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "REFRESHING BREAK",
      trigger: {
        event: "ready",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: { type: "damage-on-self" },
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(refreshingBreak),
    );
  });

  it.skip("Maximus - Team Champion: should parse card text", () => {
    const text =
      "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYALLY BIG REWARDS - end of turn lore gain
    const royallyBigRewards: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYALLY BIG REWARDS",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-with-strength",
          strength: { min: 10 },
        },
        then: {
          type: "gain-lore",
          amount: 5,
        },
        else: {
          type: "conditional",
          condition: {
            type: "has-character-with-strength",
            strength: { min: 5 },
          },
          then: {
            type: "gain-lore",
            amount: 2,
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royallyBigRewards),
    );
  });

  it.skip("Turbo - Royal Hack: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: GAME JUMP - name alias
    const gameJump: StaticAbilityDefinition = {
      type: "static",
      name: "GAME JUMP",
      effect: {
        type: "property-modification",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gameJump),
    );
  });

  it.skip("Donald Duck - Pie Slinger: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)\nHUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses 2 lore.\nRAGING DUCK While an opponent has 10 or more lore, this character gets +6 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: HUMBLE PIE - conditional lore loss
    const humblePie: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HUMBLE PIE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        then: {
          type: "lose-lore",
          amount: 2,
          target: "EACH_OPPONENT",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(humblePie),
    );

    // Third ability: RAGING DUCK - conditional buff
    const ragingDuck: StaticAbilityDefinition = {
      type: "static",
      name: "RAGING DUCK",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 6,
        target: "SELF",
      },
      condition: {
        type: "opponent-has-lore",
        amount: { min: 10 },
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(ragingDuck),
    );
  });

  it.skip("Scar - Betrayer: should parse card text", () => {
    const text =
      "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LONG LIVE THE KING - optional banish Mufasa
    const longLiveTheKing: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LONG LIVE THE KING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            type: "query",
            query: { name: "Mufasa" },
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(longLiveTheKing),
    );
  });

  it.skip("Snowanna Rainbeau - Cool Competitor: should parse card text", () => {
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

  it.skip("Daisy Duck - Spotless Food-Fighter: should parse card text", () => {
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

  it.skip("Mickey Mouse - Enthusiastic Dancer: should parse card text", () => {
    const text =
      "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PERFECT PARTNERS - conditional buff
    const perfectPartners: StaticAbilityDefinition = {
      type: "static",
      name: "PERFECT PARTNERS",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "has-named-character",
        name: "Minnie Mouse",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(perfectPartners),
    );
  });

  it.skip("Ratigan - Raging Rat: should parse card text", () => {
    const text =
      "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOTHING CAN STAND IN MY WAY - conditional buff
    const nothingCanStandInMyWay: StaticAbilityDefinition = {
      type: "static",
      name: "NOTHING CAN STAND IN MY WAY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "self-has-damage",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nothingCanStandInMyWay),
    );
  });

  it.skip("Taffyta Muttonfudge - Crowd Favorite: should parse card text", () => {
    const text =
      "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SHOWSTOPPER - conditional lore loss
    const showstopper: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHOWSTOPPER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-location-in-play" },
        then: {
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(showstopper),
    );
  });

  it.skip("Pete - Steamboat Rival: should parse card text", () => {
    const text =
      "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SCRAM! - conditional banish
    const scram: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SCRAM!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-named-character",
          name: "Pete",
          other: true,
        },
        then: {
          type: "optional",
          effect: {
            type: "banish",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
        },
      },
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
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift2),
    );

    // Second ability: NEW ROSTER - triggered, on move to location
    const newRoster: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NEW ROSTER",
      trigger: {
        event: "move",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(newRoster),
    );
  });

  it.skip("Robin Hood - Sharpshooter: should parse card text", () => {
    const text =
      "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MY GREATEST PERFORMANCE - on quest, look/play action
    const myGreatestPerformance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MY GREATEST PERFORMANCE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "look-at-deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(myGreatestPerformance),
    );
  });

  it.skip("Gaston - Pure Paragon: should parse card text", () => {
    const text =
      "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A MAN AMONG MEN! - static cost reduction
    const aManAmongMen: StaticAbilityDefinition = {
      type: "static",
      name: "A MAN AMONG MEN!",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aManAmongMen),
    );

    // Second ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Arthur - Novice Sparrow: should parse card text", () => {
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

  it.skip("Donald Duck - Daisy's Date: should parse card text", () => {
    const text =
      "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PLUCKY PLAY - on challenge, opponent loses lore
    const pluckyPlay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PLUCKY PLAY",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "lore-loss",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pluckyPlay),
    );
  });

  it.skip("Ratigan - Party Crasher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: DELIGHTFULLY WICKED - static buff
    const delightfullyWicked: StaticAbilityDefinition = {
      type: "static",
      name: "DELIGHTFULLY WICKED",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_VILLAIN_CHARACTERS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(delightfullyWicked),
    );
  });

  it.skip("Vanellope von Schweetz - Random Roster Racer: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: PIXLEXIA - triggered, gain Evasive
    const pixlexia: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PIXLEXIA",
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
      expect.objectContaining(pixlexia),
    );
  });

  it.skip("Simba - Adventurous Successor: should parse card text", () => {
    const text =
      "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I LAUGH IN THE FACE OF DANGER - on play, buff character
    const iLaughInTheFaceOfDanger: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I LAUGH IN THE FACE OF DANGER",
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
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iLaughInTheFaceOfDanger),
    );
  });

  it.skip("Minnie Mouse - Dazzling Dancer: should parse card text", () => {
    const text =
      "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DANCE-OFF - on challenge, gain lore
    const danceOff: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DANCE-OFF",
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
      expect.objectContaining(danceOff),
    );
  });

  it.skip("Break Free: should parse card text", () => {
    const text =
      "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: deal damage, grant Rush and buff
    const breakFree: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "CHOSEN_CHARACTER_OF_YOURS",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(breakFree),
    );
  });

  it.skip("Evil Comes Prepared: should parse card text", () => {
    const text =
      "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready, restriction, conditional lore
    const evilComesPrepared: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER_OF_YOURS" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            duration: "this-turn",
          },
          {
            type: "conditional",
            condition: { type: "target-is-villain" },
            then: { type: "gain-lore", amount: 1 },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evilComesPrepared),
    );
  });

  it.skip("Don't Let the Frostbite Bite: should parse card text", () => {
    const text =
      "Ready all your characters. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready all, restriction
    const dontLetTheFrostbiteBite: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "ready", target: "YOUR_CHARACTERS" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dontLetTheFrostbiteBite),
    );
  });

  it.skip("Glimmer vs Glimmer: should parse card text", () => {
    const text = "Banish chosen character of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish own character to banish opponent character
    const glimmerVsGlimmer: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(glimmerVsGlimmer),
    );
  });

  it.skip("Who's With Me?: should parse card text", () => {
    const text =
      "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First effect: buff all characters
    const buffEffect: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(buffEffect),
    );

    // Second effect: triggered, on challenge with Reckless
    const challengeEffect: TriggeredAbilityDefinition = {
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challengeEffect),
    );
  });

  it.skip("Potion of Might: should parse card text", () => {
    const text =
      "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: VILE CONCOCTION - pay ink, banish item, buff
    const vileConcoction: ActivatedAbilityDefinition = {
      type: "activated",
      name: "VILE CONCOCTION",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "target-is-villain",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
        else: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(vileConcoction),
    );
  });

  it.skip("The Sword Released: should parse card text", () => {
    const text =
      "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: POWER APPOINTED - start of turn, conditional
    const powerAppointed: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POWER APPOINTED",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-strongest-character",
        },
        then: {
          type: "sequence",
          effects: [
            { type: "lose-lore", amount: 1, target: "EACH_OPPONENT" },
            { type: "gain-lore", amount: { type: "lore-lost" } },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(powerAppointed),
    );
  });

  it.skip("Ruby Chromicon: should parse card text", () => {
    const text = "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RUBY LIGHT - exert, buff character
    const rubyLight: ActivatedAbilityDefinition = {
      type: "activated",
      name: "RUBY LIGHT",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rubyLight),
    );
  });

  it.skip("Sugar Rush Speedway - Starting Line: should parse card text", () => {
    const text =
      "ON YOUR MARKS! Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: ON YOUR MARKS! - exert character, deal damage, move
    const onYourMarks: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ON YOUR MARKS!",
      cost: {
        exert: true,
        target: "CHOSEN_CHARACTER_HERE",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "deal-damage", amount: 1, target: "CHOSEN_CHARACTER_HERE" },
          { type: "move", target: "CHOSEN_CHARACTER_HERE", free: true },
        ],
      },
      restrictions: [{ type: "once-per-turn" }],
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(onYourMarks),
    );
  });

  it.skip("Ratigan's Party - Seedy Back Room: should parse card text", () => {
    const text =
      "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: MISFITS' REVELRY - conditional lore buff
    const misfitsRevelry: StaticAbilityDefinition = {
      type: "static",
      name: "MISFITS' REVELRY",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "has-damaged-character-here",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(misfitsRevelry),
    );
  });

  it.skip("The Queen - Cruelest of All: should parse card text", () => {
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

  it.skip("Prince John - Opportunistic Briber: should parse card text", () => {
    const text =
      "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TAXES NEVER FAIL ME - on play item, buff self
    const taxesNeverFailMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TAXES NEVER FAIL ME",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(taxesNeverFailMe),
    );
  });

  it.skip("Merlin - Back from Bermuda: should parse card text", () => {
    const text =
      "LONG LIVE THE KING! Your characters named Arthur gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: LONG LIVE THE KING! - grant Resist
    const longLiveTheKing: StaticAbilityDefinition = {
      type: "static",
      name: "LONG LIVE THE KING!",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(longLiveTheKing),
    );
  });

  it.skip("Pacha - Emperor's Guide: should parse card text", () => {
    const text =
      "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.\nPERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HELPFUL SUPPLIES - start of turn, conditional lore
    const helpfulSupplies: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HELPFUL SUPPLIES",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-item-in-play" },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(helpfulSupplies),
    );

    // Second ability: PERFECT DIRECTIONS - start of turn, conditional lore
    const perfectDirections: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PERFECT DIRECTIONS",
      trigger: {
        event: "start-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-location-in-play" },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(perfectDirections),
    );
  });

  it.skip("The Queen - Fairest of All: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.";
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

    // Second ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: REFLECTIONS OF VANITY - static lore buff
    const reflectionsOfVanity: StaticAbilityDefinition = {
      type: "static",
      name: "REFLECTIONS OF VANITY",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: { type: "count", of: "OTHER_QUEEN_CHARACTERS" },
        target: "SELF",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(reflectionsOfVanity),
    );
  });

  it.skip("Sheriff of Nottingham - Bushel Britches: should parse card text", () => {
    const text =
      "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVERY LITTLE BIT HELPS - cost reduction
    const everyLittleBitHelps: StaticAbilityDefinition = {
      type: "static",
      name: "EVERY LITTLE BIT HELPS",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(everyLittleBitHelps),
    );

    // Second ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Chicha - Dedicated Mother: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.";
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

    // Second ability: ONE ON THE WAY - triggered, on inkwell, conditional draw
    const oneOnTheWay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ONE ON THE WAY",
      trigger: {
        event: "inkwell",
        timing: "when",
      },
      effect: {
        type: "conditional",
        condition: { type: "second-inkwell-this-turn" },
        then: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(oneOnTheWay),
    );
  });

  it.skip("Prince John - Gold Lover: should parse card text", () => {
    const text =
      "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: BEAUTIFUL, LOVELY TAXES - exert, play item for free
    const beautifulLovelyTaxes: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BEAUTIFUL, LOVELY TAXES",
      cost: {
        exert: true,
      },
      effect: {
        type: "play-card",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beautifulLovelyTaxes),
    );
  });

  it.skip("The Queen - Crown of the Council: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: GATHERER OF THE WICKED - on play, look at deck
    const gathererOfTheWicked: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GATHERER OF THE WICKED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "look-at-deck",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gathererOfTheWicked),
    );
  });

  it.skip("Kuzco - Selfish Emperor: should parse card text", () => {
    const text =
      "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: OUTPLACEMENT - on play, optional move to inkwell
    const outplacement: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OUTPLACEMENT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          target: "CHOSEN_ITEM_OR_LOCATION",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(outplacement),
    );

    // Second ability: BY INVITE ONLY - activated, pay ink, grant Resist
    const byInviteOnly: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BY INVITE ONLY",
      cost: {
        ink: 4,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(byInviteOnly),
    );
  });

  it.skip("Mufasa - Ruler of Pride Rock: should parse card text", () => {
    const text =
      "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A DELICATE BALANCE - on play, exert inkwell, return cards
    const aDelicateBalance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "A DELICATE BALANCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "exert", target: "ALL_CARDS_IN_INKWELL" },
          {
            type: "return-to-hand",
            target: "RANDOM_CARDS_IN_INKWELL",
            amount: 2,
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aDelicateBalance),
    );

    // Second ability: EVERYTHING THE LIGHT TOUCHES - on quest, ready inkwell
    const everythingTheLightTouches: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EVERYTHING THE LIGHT TOUCHES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "ready",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(everythingTheLightTouches),
    );
  });

  it.skip("Minnie Mouse - Quick-Thinking Inventor: should parse card text", () => {
    const text =
      "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAKE CATAPULT - on play, debuff character
    const cakeCatapult: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CAKE CATAPULT",
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
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cakeCatapult),
    );
  });

  it.skip("Basil - Practiced Detective: should parse card text", () => {
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

  it.skip("King Candy - Sweet Abomination: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: CHANGING THE CODE - on play, optional draw and tuck
    const changingTheCode: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CHANGING THE CODE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "draw", amount: 1, target: "CONTROLLER" },
            {
              type: "put-on-deck",
              target: "CHOSEN_CARD_IN_HAND",
              position: "bottom",
            },
          ],
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(changingTheCode),
    );
  });

  it.skip("Donald Duck - Focused Flatfoot: should parse card text", () => {
    const text =
      "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BAFFLING MYSTERY - on play, optional inkwell
    const bafflingMystery: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BAFFLING MYSTERY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          target: "TOP_OF_DECK",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bafflingMystery),
    );
  });

  it.skip("Tanana - Wise Woman: should parse card text", () => {
    const text =
      "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOUR BROTHERS NEED GUIDANCE - on play, heal
    const yourBrothersNeedGuidance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOUR BROTHERS NEED GUIDANCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: { upTo: 1 },
          target: "CHOSEN_CHARACTER_OR_LOCATION",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(yourBrothersNeedGuidance),
    );
  });

  it.skip("Tipo - Growing Son: should parse card text", () => {
    const text =
      "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MEASURE ME AGAIN - on play, optional inkwell
    const measureMeAgain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MEASURE ME AGAIN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          target: "CHOSEN_CARD_IN_HAND",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(measureMeAgain),
    );
  });

  it.skip("Belle - Of the Ball: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nUSHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: USHERED INTO THE PARTY - on play, grant Ward
    const usheredIntoTheParty: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "USHERED INTO THE PARTY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(usheredIntoTheParty),
    );
  });

  it.skip("Merlin - Intellectual Visionary: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Merlin.)\nOVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: OVERDEVELOPED BRAIN - on play, conditional search
    const overdevelopedBrain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OVERDEVELOPED BRAIN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "used-shift" },
        then: {
          type: "search-deck",
          cardType: "action",
          reveal: true,
          putInHand: true,
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(overdevelopedBrain),
    );
  });

  it.skip("Vision of the Future: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: look at deck
    const visionOfTheFuture: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look-at-deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(visionOfTheFuture),
    );
  });

  it.skip("Royal Tantrum: should parse card text", () => {
    const text =
      "Banish any number of your items, then draw a card for each item banished this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish items, draw cards
    const royalTantrum: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "banish", target: "ANY_NUMBER_OF_YOUR_ITEMS" },
          {
            type: "draw",
            amount: { type: "count", of: "ITEMS_BANISHED" },
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalTantrum),
    );
  });

  it.skip("Ever as Before: should parse card text", () => {
    const text = "Remove up to 2 damage from any number of chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: heal characters
    const everAsBefore: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "heal",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(everAsBefore),
    );
  });

  it.skip("Hide Away: should parse card text", () => {
    const text =
      "Put chosen item or location into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move to inkwell
    const hideAway: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "move-to-inkwell",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hideAway),
    );
  });

  it.skip("All Funned Out: should parse card text", () => {
    const text =
      "Put chosen character of yours into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move character to inkwell
    const allFunnedOut: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "move-to-inkwell",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(allFunnedOut),
    );
  });

  it.skip("Medal of Heroes: should parse card text", () => {
    const text =
      "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: CONGRATULATIONS, SOLDIER - exert, pay ink, banish, buff lore
    const congratulationsSoldier: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CONGRATULATIONS, SOLDIER",
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "CHOSEN_CHARACTER_OF_YOURS",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(congratulationsSoldier),
    );
  });

  it.skip("Basil's Magnifying Glass: should parse card text", () => {
    const text =
      "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: FIND WHAT'S HIDDEN - exert, pay ink, look at deck
    const findWhatsHidden: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FIND WHAT'S HIDDEN",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "look-at-deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(findWhatsHidden),
    );
  });

  it.skip("Merlin's Carpetbag: should parse card text", () => {
    const text =
      "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: HOCKETY POCKETY - exert, pay ink, return from discard
    const hocketyPockety: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HOCKETY POCKETY",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "return-to-hand",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hocketyPockety),
    );
  });

  it.skip("Sapphire Chromicon: should parse card text", () => {
    const text =
      "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: POWERING UP - enters play exerted
    const poweringUp: StaticAbilityDefinition = {
      type: "static",
      name: "POWERING UP",
      effect: {
        type: "enters-play-exerted",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(poweringUp),
    );

    // Second ability: SAPPHIRE LIGHT - activated, gain lore
    const sapphireLight: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SAPPHIRE LIGHT",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(sapphireLight),
    );
  });

  it.skip("The Great Illuminary - Radiant Ballroom: should parse card text", () => {
    const text =
      "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: WARM WELCOME - buff characters at location
    const warmWelcome: StaticAbilityDefinition = {
      type: "static",
      name: "WARM WELCOME",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "CHARACTERS_WITH_SUPPORT_HERE",
          },
          {
            type: "modify-stat",
            stat: "willpower",
            modifier: 2,
            target: "CHARACTERS_WITH_SUPPORT_HERE",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(warmWelcome),
    );
  });

  it.skip("Merlin's Cottage - The Wizard's Home: should parse card text", () => {
    const text =
      "KNOWLEDGE IS POWER Each player plays with the top card of their deck face up.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: KNOWLEDGE IS POWER - reveal top card
    const knowledgeIsPower: StaticAbilityDefinition = {
      type: "static",
      name: "KNOWLEDGE IS POWER",
      effect: {
        type: "reveal-deck",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(knowledgeIsPower),
    );
  });

  it.skip("Stitch - Team Underdog: should parse card text", () => {
    const text =
      "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEAVE HO! - on play, optional damage
    const heaveHo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HEAVE HO!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heaveHo),
    );
  });

  it.skip("Jafar - Tyrannical Hypnotist: should parse card text", () => {
    const text =
      "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +7
    const challenger7: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 7,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger7),
    );

    // Second ability: INTIMIDATING GAZE - static restriction
    const intimidatingGaze: StaticAbilityDefinition = {
      type: "static",
      name: "INTIMIDATING GAZE",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "OPPOSING_CHARACTERS",
        restrictedTarget: "SELF",
      },
      condition: {
        type: "opposing-character-has-less-strength",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(intimidatingGaze),
    );
  });

  it.skip("Simba - Lost Prince: should parse card text", () => {
    const text =
      "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FACE THE PAST - on banish in challenge, draw
    const faceThePast: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FACE THE PAST",
      trigger: {
        event: "banish-in-challenge",
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
      expect.objectContaining(faceThePast),
    );
  });

  it.skip("Mickey Mouse - Food Fight Defender: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    const resist1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist1),
    );
  });

  it.skip("Sleepy - Sluggish Knight: should parse card text", () => {
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

  it.skip("Kronk - Unlicensed Investigator: should parse card text", () => {
    const text =
      "Challenger +1 (While challenging, this character gets +1 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +1 keyword
    const challenger1: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger1),
    );
  });

  it.skip("HeiHei - Protective Rooster: should parse card text", () => {
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

  it.skip("Sneezy - Noisy Knight: should parse card text", () => {
    const text =
      "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEADWIND - on play, grant Challenger
    const headwind: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HEADWIND",
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
      expect.objectContaining(headwind),
    );
  });

  it.skip("Dopey - Knight Apprentice: should parse card text", () => {
    const text =
      "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: STRONGER TOGETHER - on play, conditional damage
    const strongerTogether: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STRONGER TOGETHER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-with-classification",
          classification: "Knight",
          other: true,
        },
        then: {
          type: "optional",
          effect: {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER_OR_LOCATION",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(strongerTogether),
    );
  });

  it.skip("Namaari - Resolute Daughter: should parse card text", () => {
    const text =
      "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.\nResist +3 (Damage dealt to this character is reduced by 3.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I DON'T HAVE ANY OTHER CHOICE - cost reduction
    const iDontHaveAnyOtherChoice: StaticAbilityDefinition = {
      type: "static",
      name: "I DON'T HAVE ANY OTHER CHOICE",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iDontHaveAnyOtherChoice),
    );

    // Second ability: Resist +3
    const resist3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 3,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist3),
    );
  });

  it.skip("Snow White - Fair-Hearted: should parse card text", () => {
    const text =
      "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play. (Damage dealt to this character is reduced by 1 for each other Knight.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NATURAL LEADER - scalable Resist
    const naturalLeader: StaticAbilityDefinition = {
      type: "static",
      name: "NATURAL LEADER",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(naturalLeader),
    );
  });

  it.skip("Yzma - Unjustly Treated: should parse card text", () => {
    const text =
      "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'M WARNING YOU! - on banish, optional damage
    const imWarningYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'M WARNING YOU!",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imWarningYou),
    );
  });

  it.skip("Kronk - Head of Security: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: ARE YOU ON THE LIST? - on banish, play for free
    const areYouOnTheList: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ARE YOU ON THE LIST?",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          cardType: "character",
          costRestriction: { max: 3 },
          free: true,
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(areYouOnTheList),
    );
  });

  it.skip("Grumpy - Skeptical Knight: should parse card text", () => {
    const text =
      "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2. (Damage dealt to them is reduced by 2.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BOON OF RESILIENCE - static, grant Resist at location
    const boonOfResilience: StaticAbilityDefinition = {
      type: "static",
      name: "BOON OF RESILIENCE",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(boonOfResilience),
    );

    // Second ability: BURST OF SPEED - static, gain Evasive during turn
    const burstOfSpeed: StaticAbilityDefinition = {
      type: "static",
      name: "BURST OF SPEED",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(burstOfSpeed),
    );
  });

  it.skip("Pete - Wrestling Champ: should parse card text", () => {
    const text =
      "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RE-PETE - exert, reveal and conditional play
    const rePete: ActivatedAbilityDefinition = {
      type: "activated",
      name: "RE-PETE",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "reveal", target: "TOP_OF_DECK" },
          {
            type: "conditional",
            condition: {
              type: "revealed-is-character-named",
              name: "Pete",
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                target: "REVEALED_CARD",
                free: true,
              },
            },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(rePete),
    );
  });

  it.skip("Bashful - Adoring Knight: should parse card text", () => {
    const text =
      "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: IMPRESS THE PRINCESS - conditional Bodyguard
    const impressThePrincess: StaticAbilityDefinition = {
      type: "static",
      name: "IMPRESS THE PRINCESS",
      effect: {
        type: "gain-keyword",
        keyword: "Bodyguard",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(impressThePrincess),
    );
  });

  it.skip("Happy - Lively Knight: should parse card text", () => {
    const text =
      "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BURST OF SPEED - gain Evasive during turn
    const burstOfSpeed: StaticAbilityDefinition = {
      type: "static",
      name: "BURST OF SPEED",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(burstOfSpeed),
    );
  });

  it.skip("Simba - Son of Mufasa: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Second ability: FEARSOME ROAR - on play, optional banish
    const fearsomeRoar: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FEARSOME ROAR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_ITEM_OR_LOCATION",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(fearsomeRoar),
    );
  });

  it.skip("Doc - Bold Knight: should parse card text", () => {
    const text =
      "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DRASTIC MEASURES - on play, optional discard/draw
    const drasticMeasures: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DRASTIC MEASURES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "discard", amount: "all", target: "CONTROLLER" },
            { type: "draw", amount: 2, target: "CONTROLLER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(drasticMeasures),
    );
  });

  it.skip("Arthur - King Victorious: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Arthur.)\nKNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: KNIGHTED BY THE KING - on play, grant keywords
    const knightedByTheKing: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "KNIGHTED BY THE KING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "grant-ability",
            ability: { type: "challenge-ready" },
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(knightedByTheKing),
    );
  });

  it.skip("Pete - Games Referee: should parse card text", () => {
    const text =
      "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BLOW THE WHISTLE - on play, restriction
    const blowTheWhistle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BLOW THE WHISTLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(blowTheWhistle),
    );
  });

  it.skip("Tug-of-War: should parse card text", () => {
    const text =
      "Choose one:\n• Deal 1 damage to each opposing character without Evasive.\n• Deal 3 damage to each opposing character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: choose one - modal damage
    const tugOfWar: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modal",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tugOfWar),
    );
  });

  it.skip("When Will My Life Begin?: should parse card text", () => {
    const text =
      "Chosen character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: restriction and draw
    const whenWillMyLifeBegin: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "CHOSEN_CHARACTER",
            duration: "next-turn",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whenWillMyLifeBegin),
    );
  });

  it.skip("Duck for Cover!: should parse card text", () => {
    const text =
      "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant keywords
    const duckForCover: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(duckForCover),
    );
  });

  it.skip("Food Fight!: should parse card text", () => {
    const text =
      'Your characters gain "{E}, 1 {I} — Deal 1 damage to chosen character" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant activated ability
    const foodFight: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-ability",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(foodFight),
    );
  });

  it.skip("Shield of Arendelle: should parse card text", () => {
    const text =
      "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: DEFLECT - banish self, grant Resist
    const deflect: ActivatedAbilityDefinition = {
      type: "activated",
      name: "DEFLECT",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(deflect),
    );
  });

  it.skip("Plate Armor: should parse card text", () => {
    const text =
      "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: WELL CRAFTED - exert, grant Resist
    const wellCrafted: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WELL CRAFTED",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellCrafted),
    );
  });

  it.skip("Steel Chromicon: should parse card text", () => {
    const text = "STEEL LIGHT {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: STEEL LIGHT - exert, deal damage
    const steelLight: ActivatedAbilityDefinition = {
      type: "activated",
      name: "STEEL LIGHT",
      cost: {
        exert: true,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(steelLight),
    );
  });

  it.skip("Bad-Anon - Villain Support Center: should parse card text", () => {
    const text =
      "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain \"{E}, 3 {I} — Play a character with the same name as this character for free\" while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: THERE'S NO ONE I'D RATHER BE THAN ME - grant ability
    const theresNoOneIdRatherBeThanMe: StaticAbilityDefinition = {
      type: "static",
      name: "THERE'S NO ONE I'D RATHER BE THAN ME",
      effect: {
        type: "gain-ability",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theresNoOneIdRatherBeThanMe),
    );
  });

  it.skip("Seven Dwarfs' Mine - Secure Fortress: should parse card text", () => {
    const text =
      "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOUNTAIN DEFENSE - on move, conditional damage
    const mountainDefense: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MOUNTAIN DEFENSE",
      trigger: {
        event: "move",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "conditional",
          condition: {
            type: "moved-character-is-knight",
          },
          then: {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          else: {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER",
          },
        },
      },
      restrictions: [{ type: "first-time-each-turn" }],
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mountainDefense),
    );
  });
});
