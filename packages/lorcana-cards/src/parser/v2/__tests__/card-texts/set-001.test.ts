import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 001 Card Text Parser Tests", () => {
  it.skip("Ariel - On Human Legs: should parse card text", () => {
    const text = "VOICELESS This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "VOICELESS",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Ariel - Spectacular Singer: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nMUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.";
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

    // Second ability: MUSICAL DEBUT triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MUSICAL DEBUT",
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

  it.skip("Goofy - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nAND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: AND TWO FOR TEA! triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AND TWO FOR TEA!",
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

  it.skip("Hades - King of Olympus: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)\nSINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.";
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

    // Second ability: SINISTER PLOT static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SINISTER PLOT",
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("Hades - Lord of the Underworld: should parse card text", () => {
    const text =
      "WELL OF SOULS When you play this character, return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WELL OF SOULS",
        trigger: expect.objectContaining({
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-from-discard",
        }),
      }),
    );
  });

  it.skip("HeiHei - Boat Snack: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("LeFou - Bumbler: should parse card text", () => {
    const text =
      "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LOYAL",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );
  });

  it.skip("Maximus - Palace Horse: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Maximus - Relentless Pursuer: should parse card text", () => {
    const text =
      "Rush HORSE KICK When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HORSE KICK",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Prince Phillip - Dragonslayer: should parse card text", () => {
    const text =
      "HEROISM When this character challenges and is banished, you may banish the challenged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HEROISM",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Rapunzel - Gifted with Healing: should parse card text", () => {
    const text =
      "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GLEAM AND GLOW",
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

  it.skip("Sebastian - Court Composer: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 4,
      }),
    );
  });

  it.skip("Simba - Protective Cub: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );
  });

  it.skip("Timon - Grub Rustler: should parse card text", () => {
    const text =
      "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TASTES LIKE CHICKEN",
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

  it.skip("Control Your Temper!: should parse card text", () => {
    const text = "Chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
        }),
      }),
    );
  });

  it.skip("Hakuna Matata: should parse card text", () => {
    const text = "Remove up to 3 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 3,
        }),
      }),
    );
  });

  it.skip("Healing Glow: should parse card text", () => {
    const text = "Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Just in Time: should parse card text", () => {
    const text = "You may play a character with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("Part of Your World: should parse card text", () => {
    const text = "Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-from-discard",
        }),
      }),
    );
  });

  it.skip("You Have Forgotten Me: should parse card text", () => {
    const text = "Each opponent chooses and discards 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "discard",
        }),
      }),
    );
  });

  it.skip("Dinglehopper: should parse card text", () => {
    const text =
      "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "STRAIGHTEN HAIR",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Anna - Heir to Arendelle: should parse card text", () => {
    const text =
      "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
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

  it.skip("Dr. Facilier - Agent Provocateur: should parse card text", () => {
    const text =
      "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // INTO THE SHADOWS triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "INTO THE SHADOWS",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Dr. Facilier - Charlatan: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 2,
      }),
    );
  });

  it.skip("Dr. Facilier - Remarkable Gentleman: should parse card text", () => {
    const text =
      "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DREAMS MADE REAL",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Flotsam - Ursula's Spy: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDEXTEROUS LUNGE Your characters named Jetsam gain Rush.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // DEXTEROUS LUNGE static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "DEXTEROUS LUNGE",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Jafar - Wicked Sorcerer: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      }),
    );
  });

  it.skip("Jetsam - Ursula's Spy: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSINISTER SLITHER Your characters named Flotsam gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // SINISTER SLITHER static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SINISTER SLITHER",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Magic Broom - Bucket Brigade: should parse card text", () => {
    const text =
      "**SWEEP** When you play this character, you may shuffle a card from any discard into its player";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SWEEP",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Maleficent - Sorceress: should parse card text", () => {
    const text =
      "CAST MY SPELL! When you play this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CAST MY SPELL!",
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

  it.skip("Marshmallow - Persistent Guardian: should parse card text", () => {
    const text =
      "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DURABLE",
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

  it.skip("Mickey Mouse - Wayward Sorcerer: should parse card text", () => {
    const text =
      "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // ANIMATE BROOM static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ANIMATE BROOM",
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // CEASELESS WORKER triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CEASELESS WORKER",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Pascal - Rapunzel's Companion: should parse card text", () => {
    const text =
      "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "CAMOUFLAGE",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Rafiki - Mysterious Sage: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Tinker Bell - Peter Pan's Ally: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // LOYAL AND DEVOTED static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LOYAL AND DEVOTED",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Ursula - Power Hungry: should parse card text", () => {
    const text = "**IT";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement meaningful assertions
    expect(result.success).toBe(false);
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Yzma - Alchemist: should parse card text", () => {
    const text = "**YOU";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement meaningful assertions
    expect(result.success).toBe(false);
  });

  it.skip("Zeus - God of Lightning: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nChallenger +4 (While challenging, this character gets +4 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 4,
      }),
    );
  });

  it.skip("Befuddle - undefined: should parse card text", () => {
    const text =
      "Return a character or item with cost 2 or less to their player";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-to-hand",
        }),
      }),
    );
  });

  it.skip("Freeze: should parse card text", () => {
    const text = "Exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "exert",
        }),
      }),
    );
  });

  it.skip("Friends on the Other Side: should parse card text", () => {
    const text = "Draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "draw",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Reflection: should parse card text", () => {
    const text =
      "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // The main action is the scry-like effect
    const lastAbility = result.abilities[result.abilities.length - 1];
    expect(lastAbility.ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "scry",
        }),
      }),
    );
  });

  it.skip("Ursula's Cauldron: should parse card text", () => {
    const text =
      "PEER INTO THE DEPTHS {E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "PEER INTO THE DEPTHS",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "scry",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Beast - Wolfsbane: should parse card text", () => {
    const text = "**Rush** _(This character can challenge the turn they";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - partial keyword may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Cheshire Cat - Not All There: should parse card text", () => {
    const text =
      "**Lose something?** When this character is challenged and banished, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "Lose something?",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Cruella De Vil - Miserable as Usual: should parse card text", () => {
    const text =
      "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'LL BE SORRY!",
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

  it.skip("Flynn Rider - Charming Rogue: should parse card text", () => {
    const text =
      "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HERE COMES THE SMOLDER",
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

  it.skip("Genie - On the Job: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDISAPPEAR When you play this character, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // DISAPPEAR triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DISAPPEAR",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Genie - Powers Unleashed: should parse card text", () => {
    const text =
      "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 6
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 6,
        }),
      }),
    );

    // Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // PHENOMENAL COSMIC POWER triggered
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "PHENOMENAL COSMIC POWER",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Iago - Loud-Mouthed Parrot: should parse card text", () => {
    const text =
      "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "YOU GOT A PROBLEM?",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Jasper - Common Crook: should parse card text", () => {
    const text =
      "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement meaningful assertions
    expect(result.success).toBe(false);
  });

  it.skip("Lady Tremaine - Wicked Stepmother: should parse card text", () => {
    const text =
      "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DO IT AGAIN!",
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

  it.skip("Mad Hatter - Gracious Host: should parse card text", () => {
    const text =
      "TEA PARTY Whenever this character is challenged, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TEA PARTY",
        trigger: expect.objectContaining({
          event: "challenged",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Mickey Mouse - Artful Rogue: should parse card text", () => {
    const text =
      "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated but Shift 5 may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
      }),
    );
  });

  it.skip("Mother Gothel - Selfish Manipulator: should parse card text", () => {
    const text =
      "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "SKIP THE DRAMA, STAY WITH MAMA",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Peter Pan - Never Landing: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Do It Again!: should parse card text", () => {
    const text = "Return an action card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-from-discard",
        }),
      }),
    );
  });

  it.skip("Stampede: should parse card text", () => {
    const text = "Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Steal from the Rich: should parse card text", () => {
    const text =
      "Whenever one of your characters quests this turn, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "triggered",
        }),
      }),
    );
  });

  it.skip("The Beast is Mine!: should parse card text", () => {
    const text =
      "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Vicious Betrayal - undefined: should parse card text", () => {
    const text =
      "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Dr. Facilier's Cards: should parse card text", () => {
    const text =
      "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THE CARDS WILL TELL",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );
  });

  it.skip("Stolen Scimitar: should parse card text", () => {
    const text =
      "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SLASH",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Aladdin - Heroic Outlaw: should parse card text", () => {
    const text =
      "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 5,
        }),
      }),
    );

    // DARING EXPLOIT triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DARING EXPLOIT",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
      }),
    );
  });

  it.skip("Aladdin - Street Rat: should parse card text", () => {
    const text =
      "IMPROVISE When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IMPROVISE",
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

  it.skip("Captain Hook - Ruthless Pirate: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nYOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // YOU COWARD! static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YOU COWARD!",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Elsa - Ice Surfer: should parse card text", () => {
    const text = "**THAT";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement meaningful assertions
    expect(result.success).toBe(false);
  });

  it.skip("Goofy - Daredevil: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Maui - Hero to All: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );
  });

  it.skip("Mickey Mouse - Brave Little Tailor: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Moana - Chosen by the Ocean: should parse card text", () => {
    const text =
      "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THIS IS NOT WHO YOU ARE",
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

  it.skip("Mulan - Imperial Soldier: should parse card text", () => {
    const text =
      "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LEAD BY EXAMPLE",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Peter Pan - Fearless Fighter: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Pongo - Ol' Rascal: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Scar - Shameless Firebrand: should parse card text", () => {
    const text =
      "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated but Shift 6 may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 6,
        }),
      }),
    );
  });

  it.skip("Te Kā - The Burning One: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );
  });

  it.skip("Tigger - Wonderful Thing: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Be Prepared: should parse card text", () => {
    const text = "Banish all characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Cut to the Chase: should parse card text", () => {
    const text =
      "Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Fan the Flames: should parse card text", () => {
    const text =
      "Ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("He's Got a Sword!: should parse card text", () => {
    const text = "Chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
        }),
      }),
    );
  });

  it.skip("Tangle: should parse card text", () => {
    const text = "Each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "lose-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Poisoned Apple - undefined: should parse card text", () => {
    const text =
      "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "TAKE A BITE . . .",
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

  it.skip("Shield of Virtue: should parse card text", () => {
    const text =
      "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "FIREPROOF",
        cost: expect.objectContaining({
          exert: true,
          ink: 3,
        }),
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Sword of Truth - undefined: should parse card text", () => {
    const text =
      "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "FINAL ENCHANTMENT",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Ariel - Whoseit Collector: should parse card text", () => {
    const text =
      "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOOK AT THIS STUFF",
        trigger: expect.objectContaining({
          event: "play",
          on: expect.objectContaining({ cardType: "item" }),
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Aurora - Briar Rose: should parse card text", () => {
    const text =
      "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DISARMING BEAUTY",
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

  it.skip("Belle - Strange but Special: should parse card text", () => {
    const text =
      "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // READ A BOOK static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "READ A BOOK",
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );

    // MY FAVOURITE PART! static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "MY FAVOURITE PART!",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Chief Tui - Respected Leader: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Donald Duck - Strutting His Stuff: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Gramma Tala - Storyteller: should parse card text", () => {
    const text =
      "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WILL BE WITH YOU",
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

  it.skip("Jasmine - Queen of Agrabah: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jasmine.)\nCARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // CARETAKER dual-triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CARETAKER",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Maurice - World-Famous Inventor: should parse card text", () => {
    const text =
      "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\nIT WORKS! Whenever you play an item, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // GIVE IT A TRY triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GIVE IT A TRY",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
        }),
      }),
    );

    // IT WORKS! triggered
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IT WORKS!",
        trigger: expect.objectContaining({
          event: "play",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Merlin - Self-Appointed Mentor: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Philoctetes - Trainer of Heroes: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Scar - Mastermind: should parse card text", () => {
    const text =
      "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "INSIDIOUS PLOT",
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

  it.skip("Tamatoa - So Shiny!: should parse card text", () => {
    const text =
      "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.\nGLAM This character gets +1 {L} for each item you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // WHAT HAVE WE HERE? dual-triggered
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHAT HAVE WE HERE?",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // GLAM static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "GLAM",
        effect: expect.objectContaining({
          type: "for-each",
        }),
      }),
    );
  });

  it.skip("If it's Not Baroque: should parse card text", () => {
    const text = "Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "return-from-discard",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Let It Go: should parse card text", () => {
    const text =
      "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement complete meaningful assertions
    expect(result.success).toBe(true);
  });

  it.skip("Work Together: should parse card text", () => {
    const text =
      "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Eye of the Fates: should parse card text", () => {
    const text = "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SEE THE FUTURE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
        }),
      }),
    );
  });

  it.skip("Fishbone Quill - undefined: should parse card text", () => {
    const text =
      "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "GO AHEAD AND SIGN",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "put-into-inkwell",
        }),
      }),
    );
  });

  it.skip("Magic Golden Flower: should parse card text", () => {
    const text =
      "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "HEALING POLLEN",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );
  });

  it.skip("Scepter of Arendelle: should parse card text", () => {
    const text =
      "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "COMMAND",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Beast - Hardheaded: should parse card text", () => {
    const text =
      "BREAK When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BREAK",
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

  it.skip("Captain Hook - Thinking a Happy Thought: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nChallenger +3 (While challenging, this character gets +3 {S}.)\nSTOLEN DUST Characters with cost 3 or less can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: expect.objectContaining({
          ink: 3,
        }),
      }),
    );

    // Challenger +3
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      }),
    );

    // STOLEN DUST static
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STOLEN DUST",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Donald Duck - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTAY ALERT! During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // STAY ALERT! static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "STAY ALERT!",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Gantu - Galactic Federation Captain: should parse card text", () => {
    const text =
      "UNDER ARREST Characters with cost 2 or less can't challenge your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "UNDER ARREST",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Hans - Thirteenth in Line: should parse card text", () => {
    const text =
      "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STAGE A LITTLE ACCIDENT",
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

  it.skip("Mickey Mouse - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nALL FOR ONE Your other Musketeer characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // ALL FOR ONE static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ALL FOR ONE",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Simba - Future King: should parse card text", () => {
    const text =
      "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GUESS WHAT?",
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

  it.skip("Simba - Returned King: should parse card text", () => {
    const text =
      "Challenger +4 (While challenging, this character gets +4 {S}.)\nPOUNCE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Challenger +4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
        value: 4,
      }),
    );

    // POUNCE static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "POUNCE",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Simba - Rightful Heir: should parse card text", () => {
    const text =
      "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I KNOW WHAT I HAVE TO DO",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Starkey - Hook's Henchman: should parse card text", () => {
    const text =
      "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "AYE AYE, CAPTAIN",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Te Kā - Heartless: should parse card text", () => {
    const text =
      "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SEEK THE HEART",
        trigger: expect.objectContaining({
          event: "banish-in-challenge",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("A Whole New World: should parse card text", () => {
    const text =
      "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // Main action is discard + draw
    const lastAbility = result.abilities[result.abilities.length - 1];
    expect(lastAbility.ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Break: should parse card text", () => {
    const text = "Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
        }),
      }),
    );
  });

  it.skip("Grab Your Sword: should parse card text", () => {
    const text = "Deal 2 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 2,
        }),
      }),
    );
  });

  it.skip("Ransack: should parse card text", () => {
    const text = "Draw 2 cards, then choose and discard 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Frying Pan - undefined: should parse card text", () => {
    const text = "**CLANG!** Banish this item - Chosen character can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement complete meaningful assertions
    expect(result.success).toBe(false);
  });

  it.skip("Musketeer Tabard: should parse card text", () => {
    const text =
      "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ALL FOR ONE AND ONE FOR ALL",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Plasma Blaster: should parse card text", () => {
    const text = "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "QUICK SHOT",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 1,
        }),
      }),
    );
  });
});
