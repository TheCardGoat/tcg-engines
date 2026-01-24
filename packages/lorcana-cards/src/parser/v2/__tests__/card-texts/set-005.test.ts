import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 005 Card Text Parser Tests", () => {
  it.skip("Koda - Talkative Cub: should parse card text", () => {
    const text = "TELL EVERYBODY During opponents' turns, you can't lose lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: TELL EVERYBODY - protection from lore loss
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TELL EVERYBODY",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Prince Naveen - Ukulele Player: should parse card text", () => {
    const text =
      "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Singer 6
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 6,
      }),
    );

    // Second ability: IT'S BEAUTIFUL, NO? - triggered, play song for free
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IT'S BEAUTIFUL, NO?",
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

  it.skip("Rutt - Northern Moose: should parse card text", () => {
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

  it.skip("Kenai - Big Brother: should parse card text", () => {
    const text =
      "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BROTHERS FOREVER - conditional protection
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BROTHERS FOREVER",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Lilo - Junior Cake Decorator: should parse card text", () => {
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

  it.skip("Vanellope von Schweetz - Candy Mechanic: should parse card text", () => {
    const text =
      "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOU'VE GOT TO PAY TO PLAY - on quest, debuff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'VE GOT TO PAY TO PLAY",
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

  it.skip("Fix-It Felix, Jr. - Trusty Builder: should parse card text", () => {
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

  it.skip("Gazelle - Pop Star: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 5 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 5,
      }),
    );
  });

  it.skip("Fix-It Felix, Jr. - Niceland Steward: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)\nBUILDING TOGETHER Your locations get +2 {W}.";
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

    // Second ability: BUILDING TOGETHER - static buff locations
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BUILDING TOGETHER",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Kristoff - Reindeer Keeper: should parse card text", () => {
    const text =
      "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SONG OF THE HERD - cost reduction based on songs in discard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SONG OF THE HERD",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: Bodyguard
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("Mirabel Madrigal - Family Gatherer: should parse card text", () => {
    const text =
      "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOT WITHOUT MY FAMILY - play restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "NOT WITHOUT MY FAMILY",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Minnie Mouse - Drum Major: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.";
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

    // Second ability: PARADE ORDER - triggered on play with shift condition
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PARADE ORDER",
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

  it.skip("Daisy Duck - Donald's Date: should parse card text", () => {
    const text =
      "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BIG PRIZE - on quest, opponents reveal top card
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BIG PRIZE",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "reveal",
        }),
      }),
    );
  });

  it.skip("Fix-It Felix, Jr. - Delighted Sightseer: should parse card text", () => {
    const text =
      "OH, MY LAND! When you play this character, if you have a location in play, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: OH, MY LAND! - conditional draw on play
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OH, MY LAND!",
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

  it.skip("Vanellope von Schweetz - Sugar Rush Princess: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.";
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

    // Second ability: I HEREBY DECREE - triggered when playing Princess
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I HEREBY DECREE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Alan-a-Dale - Rockin' Rooster: should parse card text", () => {
    const text = "FAN FAVORITE Whenever you play a song, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FAN FAVORITE - gain lore when playing song
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FAN FAVORITE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Wreck-It Ralph - Admiral Underpants: should parse card text", () => {
    const text =
      "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'VE GOT THE COOLEST FRIEND - return from discard with bonus
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I'VE GOT THE COOLEST FRIEND",
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

  it.skip("Maid Marian - Lady of the Lists: should parse card text", () => {
    const text =
      "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IF IT PLEASES THE LADY - debuff on play
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IF IT PLEASES THE LADY",
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

  it.skip("Sven - Reindeer Steed: should parse card text", () => {
    const text =
      "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REINDEER GAMES - optional ready with restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REINDEER GAMES",
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

  it.skip("Minnie Mouse - Compassionate Friend: should parse card text", () => {
    const text =
      "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PATCH THEM UP - on quest, remove damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PATCH THEM UP",
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

  it.skip("Try Everything: should parse card text", () => {
    const text =
      "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage, ready, then restrict
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Healing Touch: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: remove damage and draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Revive: should parse card text", () => {
    const text =
      "Play a character card with cost 5 or less from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: play from discard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("Blast from Your Past: should parse card text", () => {
    const text =
      "Name a card. Return all character cards with that name from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: name a card, return from discard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Invited to the Ball: should parse card text", () => {
    const text =
      "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: reveal and filter cards
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "reveal",
        }),
      }),
    );
  });

  it.skip("Healing Decanter: should parse card text", () => {
    const text =
      "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RENEWING ESSENCE - exert to remove damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "RENEWING ESSENCE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Queen's Sensor Core: should parse card text", () => {
    const text =
      "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\nROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SYMBOL OF NOBILITY - triggered at start of turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SYMBOL OF NOBILITY",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Second ability: ROYAL SEARCH - activated, exert + ink
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "ROYAL SEARCH",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "reveal",
        }),
      }),
    );
  });

  it.skip("Amber Chromicon: should parse card text", () => {
    const text =
      "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMBER LIGHT - exert to remove damage from all
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "AMBER LIGHT",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Rapunzel's Tower - Secluded Prison: should parse card text", () => {
    const text = "SAFE AND SOUND Characters get +3 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SAFE AND SOUND - buff characters at location
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SAFE AND SOUND",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Pride Lands - Jungle Oasis: should parse card text", () => {
    const text =
      "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: OUR HUMBLE HOME - conditional effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "OUR HUMBLE HOME",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Maleficent - Formidable Queen: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Maleficent.)\nLISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.";
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

    // Second ability: LISTEN WELL, ALL OF YOU - triggered on play
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LISTEN WELL, ALL OF YOU",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("The Nokk - Mythical Spirit: should parse card text", () => {
    const text =
      "TURNING TIDES When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TURNING TIDES - move damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TURNING TIDES",
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

  it.skip("Cogsworth - Illuminary Watchman: should parse card text", () => {
    const text =
      "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TIME TO MOVE IT! - grant Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIME TO MOVE IT!",
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

  it.skip("Merlin - Turtle: should parse card text", () => {
    const text =
      "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GIVE ME TIME TO THINK - dual trigger
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GIVE ME TIME TO THINK",
        effect: expect.objectContaining({
          type: "look-at-top",
        }),
      }),
    );
  });

  it.skip("Archimedes - Exasperated Owl: should parse card text", () => {
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

  it.skip("Bruni - Fire Salamander: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.";
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

    // Second ability: PARTING GIFT - triggered on banish
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PARTING GIFT",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Earth Giant - Living Mountain: should parse card text", () => {
    const text =
      "UNEARTHED When you play this character, each opponent draws a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: UNEARTHED - opponents draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "UNEARTHED",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("Gale - Wind Spirit: should parse card text", () => {
    const text =
      "RECURRING GUST When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RECURRING GUST - on banish in challenge
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RECURRING GUST",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Madam Mim - Elephant: should parse card text", () => {
    const text =
      "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A LITTLE GAME - triggered on play, choice
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "A LITTLE GAME",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "choice",
        }),
      }),
    );

    // Second ability: SNEAKY MOVE - triggered at start of turn
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SNEAKY MOVE",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Anna - Mystical Majesty: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.";
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

    // Second ability: EXCEPTIONAL POWER - exert all opposing
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EXCEPTIONAL POWER",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Archimedes - Electrified Owl: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

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

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: Challenger +3
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      }),
    );
  });

  it.skip("Elsa - The Fifth Spirit: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.";
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

    // Third ability: CRYSTALLIZE - triggered exert
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CRYSTALLIZE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Genie - Main Attraction: should parse card text", () => {
    const text =
      "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PHENOMENAL SHOWMAN - conditional restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PHENOMENAL SHOWMAN",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Olaf - Happy Passenger: should parse card text", () => {
    const text =
      "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CLEAR THE PATH - cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CLEAR THE PATH",
        effect: expect.objectContaining({
          type: "cost-reduction",
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
  });

  it.skip("Maleficent - Vexed Partygoer: should parse card text", () => {
    const text =
      "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: WHAT AN AWKWARD SITUATION - on quest, optional bounce
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT AN AWKWARD SITUATION",
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

  it.skip("Magica De Spell - Cruel Sorceress: should parse card text", () => {
    const text =
      "PLAYING WITH POWER During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PLAYING WITH POWER - replacement effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PLAYING WITH POWER",
        effect: expect.objectContaining({
          type: "replacement",
        }),
      }),
    );
  });

  it.skip("Rafiki - Shaman Duelist: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: SURPRISING SKILL - grant Challenger
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SURPRISING SKILL",
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

  it.skip("Anna - Eager Acolyte: should parse card text", () => {
    const text =
      "GROWING POWERS When you play this character, each opponent chooses and exerts one of their ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: GROWING POWERS - opponents choose and exert
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GROWING POWERS",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("King of Hearts - Monarch of Wonderland: should parse card text", () => {
    const text =
      "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: PLEASING THE QUEEN - prevent ready
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "PLEASING THE QUEEN",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Camilo Madrigal - Family Copycat: should parse card text", () => {
    const text =
      "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: IMITATE - on quest, gain lore and return
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IMITATE",
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

  it.skip("Hypnotic Strength: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Challenger
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Finders Keepers: should parse card text", () => {
    const text = "Draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "draw",
          amount: 3,
        }),
      }),
    );
  });

  it.skip("We Know the Way: should parse card text", () => {
    const text =
      "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle and conditional play
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Gathering Knowledge and Wisdom: should parse card text", () => {
    const text = "Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: gain lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Magical Aid: should parse card text", () => {
    const text =
      'Chosen character gains Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant keyword and ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Retrosphere: should parse card text", () => {
    const text =
      "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF AMETHYST - bounce with cost
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "EXTRACT OF AMETHYST",
        cost: expect.objectContaining({
          ink: 2,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Half Hexwell Crown: should parse card text", () => {
    const text =
      "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: AN UNEXPECTED FIND - draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "AN UNEXPECTED FIND",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );

    // Second ability: A PERILOUS POWER - exert
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "A PERILOUS POWER",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Amethyst Chromicon: should parse card text", () => {
    const text = "AMETHYST LIGHT {E} — Each player may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: AMETHYST LIGHT - each player draws
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "AMETHYST LIGHT",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "draw",
        }),
      }),
    );
  });

  it.skip("Elsa's Ice Palace - Place of Solitude: should parse card text", () => {
    const text =
      "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ETERNAL WINTER - on play, lock character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ETERNAL WINTER",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("The Library - A Gift for Belle: should parse card text", () => {
    const text =
      "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LOST IN A BOOK - on banish at location
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOST IN A BOOK",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Robin Hood - Timely Contestant: should parse card text", () => {
    const text =
      "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TAG ME IN! - cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "TAG ME IN!",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: Ward
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Shenzi - Scar's Accomplice: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nEASY PICKINGS While challenging a damaged character, this character gets +2 {S}.";
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

    // Second ability: EASY PICKINGS - conditional buff
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "EASY PICKINGS",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Zazu - Advisor to Mufasa: should parse card text", () => {
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

  it.skip("Ulf - Mime: should parse card text", () => {
    const text = "SILENT PERFORMANCE This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SILENT PERFORMANCE - restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SILENT PERFORMANCE",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Ed - Laughing Hyena: should parse card text", () => {
    const text =
      "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAUSE A PANIC - optional damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CAUSE A PANIC",
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

  it.skip("Flora - Good Fairy: should parse card text", () => {
    const text =
      "FIDDLE FADDLE While being challenged, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: FIDDLE FADDLE - conditional buff when challenged
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FIDDLE FADDLE",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Merryweather - Good Fairy: should parse card text", () => {
    const text =
      "RAY OF HOPE When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: RAY OF HOPE - optional buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RAY OF HOPE",
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

  it.skip("Robin Hood - Archery Contestant: should parse card text", () => {
    const text =
      "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TRICK SHOT - conditional lore gain
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TRICK SHOT",
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

  it.skip("Iago - Fake Flamingo: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.";
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

    // Second ability: IN DISGUISE - cost reduction on quest
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IN DISGUISE",
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

  it.skip("Ed - Hysterical Partygoer: should parse card text", () => {
    const text =
      "ROWDY GUEST Damaged characters can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: ROWDY GUEST - restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ROWDY GUEST",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Scroop - Odious Mutineer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.";
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

    // Second ability: DO SAY HELLO - optional banish
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DO SAY HELLO TO MR. ARROW",
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

  it.skip("Prince Phillip - Swordsman of the Realm: should parse card text", () => {
    const text =
      "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SLAYER OF DRAGONS - banish Dragon
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SLAYER OF DRAGONS",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );

    // Second ability: PRESSING THE ADVANTAGE - ready after challenge
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PRESSING THE ADVANTAGE",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Clarabelle - Light on Her Hooves: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)\nKEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: KEEP IN STEP - end of turn draw
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "KEEP IN STEP",
        trigger: expect.objectContaining({
          event: "end-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Anna - Diplomatic Queen: should parse card text", () => {
    const text =
      "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: \n• Each opponent chooses and discards a card. \n• Chosen character gets +2 {S} this turn. \n• Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYAL RESOLUTION - modal choice
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROYAL RESOLUTION",
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

  it.skip("Clarabelle - Clumsy Guest: should parse card text", () => {
    const text =
      "BUTTERFINGERS When you play this character, you may pay 2 {I} to banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BUTTERFINGERS - optional banish item
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BUTTERFINGERS",
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

  it.skip("Banzai - Taunting Hyena: should parse card text", () => {
    const text =
      "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HERE KITTY - optional exert
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HERE KITTY, KITTY, KITTY",
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

  it.skip("Robin Hood - Sneaky Sleuth: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.";
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

    // Second ability: CLEVER PLAN - lore boost
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CLEVER PLAN",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Mother Gothel - Conceited Manipulator: should parse card text", () => {
    const text =
      "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOTHER KNOWS BEST - optional bounce
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MOTHER KNOWS BEST",
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

  it.skip("Clarabelle - Contented Wallflower: should parse card text", () => {
    const text =
      "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ONE STEP BEHIND - conditional draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ONE STEP BEHIND",
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

  it.skip("Shenzi - Head Hyena: should parse card text", () => {
    const text =
      "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: STICK AROUND FOR DINNER - buff based on Hyenas
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STICK AROUND FOR DINNER",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Second ability: WHAT HAVE WE GOT HERE? - lore gain on challenge
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT HAVE WE GOT HERE?",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Mother Gothel - Unwavering Schemer: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)\nTHE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.";
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

    // Second ability: THE WORLD IS DARK - opponents return characters
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THE WORLD IS DARK",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Scar - Vengeful Lion: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: LIFE'S NOT FAIR - draw on challenge
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LIFE'S NOT FAIR, IS IT?",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Hypnotic Deduction: should parse card text", () => {
    const text =
      "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw then put back
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Night Howler Rage: should parse card text", () => {
    const text =
      "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: draw and grant Reckless
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("You're Welcome: should parse card text", () => {
    const text =
      "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: shuffle into deck, player draws
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Remember Who You Are: should parse card text", () => {
    const text =
      "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: conditional draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Prince John's Mirror: should parse card text", () => {
    const text =
      "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.\nA FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: YOU LOOK REGAL - cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YOU LOOK REGAL",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: A FEELING OF POWER - triggered discard
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "A FEELING OF POWER",
        trigger: expect.objectContaining({
          event: "end-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Obscurosphere: should parse card text", () => {
    const text =
      "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: EXTRACT OF EMERALD - grant Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "EXTRACT OF EMERALD",
        cost: expect.objectContaining({
          ink: 2,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Emerald Chromicon: should parse card text", () => {
    const text =
      "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: EMERALD LIGHT - on banish, optional bounce
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EMERALD LIGHT",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Sherwood Forest - Outlaw Hideaway: should parse card text", () => {
    const text =
      'FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and "{E}, 1 {I} — Deal 2 damage to chosen damaged character" while here. (Opponents can\'t choose them except to challenge.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: FOREST HOME - free move
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FOREST HOME",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: FAMILIAR TERRAIN - grant abilities
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FAMILIAR TERRAIN",
        effect: expect.objectContaining({
          type: "grant-ability",
        }),
      }),
    );
  });

  it.skip("Tropical Rainforest - Jaguar Lair: should parse card text", () => {
    const text =
      "SNACK TIME Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: SNACK TIME - grant Reckless
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SNACK TIME",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Wreck-It Ralph - Demolition Dude: should parse card text", () => {
    const text =
      "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: REFRESHING BREAK - on ready, gain lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REFRESHING BREAK",
        trigger: expect.objectContaining({
          event: "ready",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Maximus - Team Champion: should parse card text", () => {
    const text =
      "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: ROYALLY BIG REWARDS - end of turn lore gain
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROYALLY BIG REWARDS",
        trigger: expect.objectContaining({
          event: "end-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Turbo - Royal Hack: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: GAME JUMP - name alias
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "GAME JUMP",
        effect: expect.objectContaining({
          type: "property-modification",
        }),
      }),
    );
  });

  it.skip("Donald Duck - Pie Slinger: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)\nHUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses 2 lore.\nRAGING DUCK While an opponent has 10 or more lore, this character gets +6 {S}.";
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

    // Second ability: HUMBLE PIE - conditional lore loss
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HUMBLE PIE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Third ability: RAGING DUCK - conditional buff
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "RAGING DUCK",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Scar - Betrayer: should parse card text", () => {
    const text =
      "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: LONG LIVE THE KING - optional banish Mufasa
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LONG LIVE THE KING",
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

  it.skip("Snowanna Rainbeau - Cool Competitor: should parse card text", () => {
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

  it.skip("Daisy Duck - Spotless Food-Fighter: should parse card text", () => {
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

  it.skip("Mickey Mouse - Enthusiastic Dancer: should parse card text", () => {
    const text =
      "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: PERFECT PARTNERS - conditional buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PERFECT PARTNERS",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Ratigan - Raging Rat: should parse card text", () => {
    const text =
      "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NOTHING CAN STAND IN MY WAY - conditional buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "NOTHING CAN STAND IN MY WAY",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Taffyta Muttonfudge - Crowd Favorite: should parse card text", () => {
    const text =
      "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SHOWSTOPPER - conditional lore loss
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHOWSTOPPER",
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

  it.skip("Pete - Steamboat Rival: should parse card text", () => {
    const text =
      "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: SCRAM! - conditional banish
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SCRAM!",
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

  it.skip("Taffyta Muttonfudge - Sour Speedster: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)\nNEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.";
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

    // Second ability: NEW ROSTER - triggered, on move to location
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NEW ROSTER",
        trigger: expect.objectContaining({
          event: "move",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Robin Hood - Sharpshooter: should parse card text", () => {
    const text =
      "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MY GREATEST PERFORMANCE - on quest, look/play action
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MY GREATEST PERFORMANCE",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "look-at-deck",
        }),
      }),
    );
  });

  it.skip("Gaston - Pure Paragon: should parse card text", () => {
    const text =
      "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A MAN AMONG MEN! - static cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "A MAN AMONG MEN!",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: Rush
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Arthur - Novice Sparrow: should parse card text", () => {
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

  it.skip("Donald Duck - Daisy's Date: should parse card text", () => {
    const text =
      "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: PLUCKY PLAY - on challenge, opponent loses lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PLUCKY PLAY",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "lore-loss",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Ratigan - Party Crasher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.";
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

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: DELIGHTFULLY WICKED - static buff
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "DELIGHTFULLY WICKED",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Vanellope von Schweetz - Random Roster Racer: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: PIXLEXIA - triggered, gain Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PIXLEXIA",
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

  it.skip("Simba - Adventurous Successor: should parse card text", () => {
    const text =
      "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I LAUGH IN THE FACE OF DANGER - on play, buff character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I LAUGH IN THE FACE OF DANGER",
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

  it.skip("Minnie Mouse - Dazzling Dancer: should parse card text", () => {
    const text =
      "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DANCE-OFF - on challenge, gain lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DANCE-OFF",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Break Free: should parse card text", () => {
    const text =
      "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: deal damage, grant Rush and buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Evil Comes Prepared: should parse card text", () => {
    const text =
      "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready, restriction, conditional lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Don't Let the Frostbite Bite: should parse card text", () => {
    const text =
      "Ready all your characters. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: ready all, restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Glimmer vs Glimmer: should parse card text", () => {
    const text = "Banish chosen character of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish own character to banish opponent character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Who's With Me?: should parse card text", () => {
    const text =
      "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First effect: buff all characters
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Second effect: triggered, on challenge with Reckless
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Potion of Might: should parse card text", () => {
    const text =
      "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: VILE CONCOCTION - pay ink, banish item, buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "VILE CONCOCTION",
        cost: expect.objectContaining({
          ink: 1,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("The Sword Released: should parse card text", () => {
    const text =
      "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: POWER APPOINTED - start of turn, conditional
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "POWER APPOINTED",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Ruby Chromicon: should parse card text", () => {
    const text = "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RUBY LIGHT - exert, buff character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "RUBY LIGHT",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Sugar Rush Speedway - Starting Line: should parse card text", () => {
    const text =
      "ON YOUR MARKS! Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: ON YOUR MARKS! - exert character, deal damage, move
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "ON YOUR MARKS!",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Ratigan's Party - Seedy Back Room: should parse card text", () => {
    const text =
      "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: MISFITS' REVELRY - conditional lore buff
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "MISFITS' REVELRY",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("The Queen - Cruelest of All: should parse card text", () => {
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

  it.skip("Prince John - Opportunistic Briber: should parse card text", () => {
    const text =
      "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: TAXES NEVER FAIL ME - on play item, buff self
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TAXES NEVER FAIL ME",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Merlin - Back from Bermuda: should parse card text", () => {
    const text =
      "LONG LIVE THE KING! Your characters named Arthur gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: LONG LIVE THE KING! - grant Resist
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LONG LIVE THE KING!",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Pacha - Emperor's Guide: should parse card text", () => {
    const text =
      "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.\nPERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: HELPFUL SUPPLIES - start of turn, conditional lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HELPFUL SUPPLIES",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Second ability: PERFECT DIRECTIONS - start of turn, conditional lore
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PERFECT DIRECTIONS",
        trigger: expect.objectContaining({
          event: "start-of-turn",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("The Queen - Fairest of All: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

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

    // Second ability: Ward
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Third ability: REFLECTIONS OF VANITY - static lore buff
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "REFLECTIONS OF VANITY",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Sheriff of Nottingham - Bushel Britches: should parse card text", () => {
    const text =
      "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: EVERY LITTLE BIT HELPS - cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "EVERY LITTLE BIT HELPS",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: Support
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Chicha - Dedicated Mother: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );

    // Second ability: ONE ON THE WAY - triggered, on inkwell, conditional draw
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ONE ON THE WAY",
        trigger: expect.objectContaining({
          event: "inkwell",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Prince John - Gold Lover: should parse card text", () => {
    const text =
      "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: BEAUTIFUL, LOVELY TAXES - exert, play item for free
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BEAUTIFUL, LOVELY TAXES",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("The Queen - Crown of the Council: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: GATHERER OF THE WICKED - on play, look at deck
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GATHERER OF THE WICKED",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "look-at-deck",
        }),
      }),
    );
  });

  it.skip("Kuzco - Selfish Emperor: should parse card text", () => {
    const text =
      "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: OUTPLACEMENT - on play, optional move to inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OUTPLACEMENT",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Second ability: BY INVITE ONLY - activated, pay ink, grant Resist
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BY INVITE ONLY",
        cost: expect.objectContaining({
          ink: 4,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Mufasa - Ruler of Pride Rock: should parse card text", () => {
    const text =
      "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: A DELICATE BALANCE - on play, exert inkwell, return cards
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "A DELICATE BALANCE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );

    // Second ability: EVERYTHING THE LIGHT TOUCHES - on quest, ready inkwell
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EVERYTHING THE LIGHT TOUCHES",
        trigger: expect.objectContaining({
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "ready",
        }),
      }),
    );
  });

  it.skip("Minnie Mouse - Quick-Thinking Inventor: should parse card text", () => {
    const text =
      "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: CAKE CATAPULT - on play, debuff character
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CAKE CATAPULT",
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

  it.skip("Basil - Practiced Detective: should parse card text", () => {
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

  it.skip("King Candy - Sweet Abomination: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.";
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

    // Second ability: CHANGING THE CODE - on play, optional draw and tuck
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CHANGING THE CODE",
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

  it.skip("Donald Duck - Focused Flatfoot: should parse card text", () => {
    const text =
      "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BAFFLING MYSTERY - on play, optional inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BAFFLING MYSTERY",
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

  it.skip("Tanana - Wise Woman: should parse card text", () => {
    const text =
      "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: YOUR BROTHERS NEED GUIDANCE - on play, heal
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOUR BROTHERS NEED GUIDANCE",
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

  it.skip("Tipo - Growing Son: should parse card text", () => {
    const text =
      "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MEASURE ME AGAIN - on play, optional inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MEASURE ME AGAIN",
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

  it.skip("Belle - Of the Ball: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nUSHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: USHERED INTO THE PARTY - on play, grant Ward
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "USHERED INTO THE PARTY",
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

  it.skip("Merlin - Intellectual Visionary: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Merlin.)\nOVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: OVERDEVELOPED BRAIN - on play, conditional search
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OVERDEVELOPED BRAIN",
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

  it.skip("Vision of the Future: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: look at deck
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "look-at-deck",
        }),
      }),
    );
  });

  it.skip("Royal Tantrum: should parse card text", () => {
    const text =
      "Banish any number of your items, then draw a card for each item banished this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: banish items, draw cards
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Ever as Before: should parse card text", () => {
    const text = "Remove up to 2 damage from any number of chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: heal characters
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "heal",
        }),
      }),
    );
  });

  it.skip("Hide Away: should parse card text", () => {
    const text =
      "Put chosen item or location into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move to inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "move-to-inkwell",
        }),
      }),
    );
  });

  it.skip("All Funned Out: should parse card text", () => {
    const text =
      "Put chosen character of yours into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: move character to inkwell
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "move-to-inkwell",
        }),
      }),
    );
  });

  it.skip("Medal of Heroes: should parse card text", () => {
    const text =
      "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: CONGRATULATIONS, SOLDIER - exert, pay ink, banish, buff lore
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "CONGRATULATIONS, SOLDIER",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Basil's Magnifying Glass: should parse card text", () => {
    const text =
      "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: FIND WHAT'S HIDDEN - exert, pay ink, look at deck
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "FIND WHAT'S HIDDEN",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "look-at-deck",
        }),
      }),
    );
  });

  it.skip("Merlin's Carpetbag: should parse card text", () => {
    const text =
      "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: HOCKETY POCKETY - exert, pay ink, return from discard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "HOCKETY POCKETY",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Sapphire Chromicon: should parse card text", () => {
    const text =
      "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: POWERING UP - enters play exerted
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "POWERING UP",
        effect: expect.objectContaining({
          type: "enters-play-exerted",
        }),
      }),
    );

    // Second ability: SAPPHIRE LIGHT - activated, gain lore
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SAPPHIRE LIGHT",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("The Great Illuminary - Radiant Ballroom: should parse card text", () => {
    const text =
      "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: WARM WELCOME - buff characters at location
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WARM WELCOME",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Merlin's Cottage - The Wizard's Home: should parse card text", () => {
    const text =
      "KNOWLEDGE IS POWER Each player plays with the top card of their deck face up.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: KNOWLEDGE IS POWER - reveal top card
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "KNOWLEDGE IS POWER",
        effect: expect.objectContaining({
          type: "reveal-deck",
        }),
      }),
    );
  });

  it.skip("Stitch - Team Underdog: should parse card text", () => {
    const text =
      "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEAVE HO! - on play, optional damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HEAVE HO!",
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

  it.skip("Jafar - Tyrannical Hypnotist: should parse card text", () => {
    const text =
      "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +7
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 7,
      }),
    );

    // Second ability: INTIMIDATING GAZE - static restriction
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "INTIMIDATING GAZE",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Simba - Lost Prince: should parse card text", () => {
    const text =
      "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: FACE THE PAST - on banish in challenge, draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FACE THE PAST",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Food Fight Defender: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Resist +1 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 1,
      }),
    );
  });

  it.skip("Sleepy - Sluggish Knight: should parse card text", () => {
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

  it.skip("Kronk - Unlicensed Investigator: should parse card text", () => {
    const text =
      "Challenger +1 (While challenging, this character gets +1 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +1 keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 1,
      }),
    );
  });

  it.skip("HeiHei - Protective Rooster: should parse card text", () => {
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

  it.skip("Sneezy - Noisy Knight: should parse card text", () => {
    const text =
      "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: HEADWIND - on play, grant Challenger
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HEADWIND",
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

  it.skip("Dopey - Knight Apprentice: should parse card text", () => {
    const text =
      "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: STRONGER TOGETHER - on play, conditional damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STRONGER TOGETHER",
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

  it.skip("Namaari - Resolute Daughter: should parse card text", () => {
    const text =
      "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.\nResist +3 (Damage dealt to this character is reduced by 3.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: I DON'T HAVE ANY OTHER CHOICE - cost reduction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "I DON'T HAVE ANY OTHER CHOICE",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // Second ability: Resist +3
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 3,
      }),
    );
  });

  it.skip("Snow White - Fair-Hearted: should parse card text", () => {
    const text =
      "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play. (Damage dealt to this character is reduced by 1 for each other Knight.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: NATURAL LEADER - scalable Resist
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "NATURAL LEADER",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Yzma - Unjustly Treated: should parse card text", () => {
    const text =
      "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: I'M WARNING YOU! - on banish, optional damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I'M WARNING YOU!",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Kronk - Head of Security: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: ARE YOU ON THE LIST? - on banish, play for free
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ARE YOU ON THE LIST?",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Grumpy - Skeptical Knight: should parse card text", () => {
    const text =
      "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2. (Damage dealt to them is reduced by 2.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: BOON OF RESILIENCE - static, grant Resist at location
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BOON OF RESILIENCE",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Second ability: BURST OF SPEED - static, gain Evasive during turn
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BURST OF SPEED",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Pete - Wrestling Champ: should parse card text", () => {
    const text =
      "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: RE-PETE - exert, reveal and conditional play
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "RE-PETE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Bashful - Adoring Knight: should parse card text", () => {
    const text =
      "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: IMPRESS THE PRINCESS - conditional Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "IMPRESS THE PRINCESS",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Happy - Lively Knight: should parse card text", () => {
    const text =
      "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: BURST OF SPEED - gain Evasive during turn
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BURST OF SPEED",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Simba - Son of Mufasa: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.";
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

    // Second ability: FEARSOME ROAR - on play, optional banish
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FEARSOME ROAR",
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

  it.skip("Doc - Bold Knight: should parse card text", () => {
    const text =
      "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: DRASTIC MEASURES - on play, optional discard/draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DRASTIC MEASURES",
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

  it.skip("Arthur - King Victorious: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Arthur.)\nKNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

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

    // Second ability: KNIGHTED BY THE KING - on play, grant keywords
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "KNIGHTED BY THE KING",
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

  it.skip("Pete - Games Referee: should parse card text", () => {
    const text =
      "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: BLOW THE WHISTLE - on play, restriction
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BLOW THE WHISTLE",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Tug-of-War: should parse card text", () => {
    const text =
      "Choose one:\n• Deal 1 damage to each opposing character without Evasive.\n• Deal 3 damage to each opposing character with Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: choose one - modal damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modal",
        }),
      }),
    );
  });

  it.skip("When Will My Life Begin?: should parse card text", () => {
    const text =
      "Chosen character can't challenge during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: restriction and draw
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Duck for Cover!: should parse card text", () => {
    const text =
      "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant keywords
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Food Fight!: should parse card text", () => {
    const text =
      'Your characters gain "{E}, 1 {I} — Deal 1 damage to chosen character" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability: grant activated ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-ability",
        }),
      }),
    );
  });

  it.skip("Shield of Arendelle: should parse card text", () => {
    const text =
      "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: DEFLECT - banish self, grant Resist
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "DEFLECT",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Plate Armor: should parse card text", () => {
    const text =
      "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: WELL CRAFTED - exert, grant Resist
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "WELL CRAFTED",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Steel Chromicon: should parse card text", () => {
    const text = "STEEL LIGHT {E} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Activated ability: STEEL LIGHT - exert, deal damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "STEEL LIGHT",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Bad-Anon - Villain Support Center: should parse card text", () => {
    const text =
      "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain \"{E}, 3 {I} — Play a character with the same name as this character for free\" while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Static ability: THERE'S NO ONE I'D RATHER BE THAN ME - grant ability
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "THERE'S NO ONE I'D RATHER BE THAN ME",
        effect: expect.objectContaining({
          type: "gain-ability",
        }),
      }),
    );
  });

  it.skip("Seven Dwarfs' Mine - Secure Fortress: should parse card text", () => {
    const text =
      "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Triggered ability: MOUNTAIN DEFENSE - on move, conditional damage
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MOUNTAIN DEFENSE",
        trigger: expect.objectContaining({
          event: "move",
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });
});
