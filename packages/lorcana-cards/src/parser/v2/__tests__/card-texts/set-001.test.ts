import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 001 Card Text Parser Tests", () => {
  it.skip("Ariel - On Human Legs: should parse card text", () => {
    const text = "VOICELESS This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const voiceless: StaticAbilityDefinition = {
      type: "static",
      name: "VOICELESS",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(voiceless),
    );
  });

  it.skip("Ariel - Spectacular Singer: should parse card text", () => {
    const text =
      "Singer 5 (This character counts as cost 5 to sing songs.)\nMUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.";
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

    // Second ability: MUSICAL DEBUT triggered
    const musicalDebut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MUSICAL DEBUT",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(musicalDebut),
    );
  });

  it.skip("Goofy - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nAND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: AND TWO FOR TEA! triggered
    const andTwoForTea: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AND TWO FOR TEA!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "YOUR_MUSKETEER_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(andTwoForTea),
    );
  });

  it.skip("Hades - King of Olympus: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)\nSINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 6 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SINISTER PLOT static
    const sinisterPlot: StaticAbilityDefinition = {
      type: "static",
      name: "SINISTER PLOT",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "for-each",
          counter: "characters",
          modifier: 1,
        },
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(sinisterPlot),
    );
  });

  it.skip("Hades - Lord of the Underworld: should parse card text", () => {
    const text =
      "WELL OF SOULS When you play this character, return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wellOfSouls: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WELL OF SOULS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "CHARACTER_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellOfSouls),
    );
  });

  it.skip("HeiHei - Boat Snack: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("LeFou - Bumbler: should parse card text", () => {
    const text =
      "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const loyal: StaticAbilityDefinition = {
      type: "static",
      name: "LOYAL",
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(loyal));
  });

  it.skip("Maximus - Palace Horse: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Maximus - Relentless Pursuer: should parse card text", () => {
    const text =
      "Rush HORSE KICK When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const horseKick: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HORSE KICK",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(horseKick),
    );
  });

  it.skip("Prince Phillip - Dragonslayer: should parse card text", () => {
    const text =
      "HEROISM When this character challenges and is banished, you may banish the challenged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const heroism: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HEROISM",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHALLENGED_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heroism),
    );
  });

  it.skip("Rapunzel - Gifted with Healing: should parse card text", () => {
    const text =
      "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const gleamAndGlow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GLEAM AND GLOW",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "remove-damage", amount: 3, target: "YOUR_CHARACTERS" },
          { type: "draw", amount: "DAMAGE_REMOVED", target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gleamAndGlow),
    );
  });

  it.skip("Sebastian - Court Composer: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 4,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Simba - Protective Cub: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Timon - Grub Rustler: should parse card text", () => {
    const text =
      "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tastesLikeChicken: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TASTES LIKE CHICKEN",
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
      expect.objectContaining(tastesLikeChicken),
    );
  });

  it.skip("Control Your Temper!: should parse card text", () => {
    const text = "Chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const controlYourTemper: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(controlYourTemper),
    );
  });

  it.skip("Hakuna Matata: should parse card text", () => {
    const text = "Remove up to 3 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hakunaMatata: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hakunaMatata),
    );
  });

  it.skip("Healing Glow: should parse card text", () => {
    const text = "Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const healingGlow: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healingGlow),
    );
  });

  it.skip("Just in Time: should parse card text", () => {
    const text = "You may play a character with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justInTime: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
        filter: { maxCost: 5, cardType: "character" },
        free: true,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justInTime),
    );
  });

  it.skip("Part of Your World: should parse card text", () => {
    const text = "Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const partOfYourWorld: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHARACTER_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(partOfYourWorld),
    );
  });

  it.skip("You Have Forgotten Me: should parse card text", () => {
    const text = "Each opponent chooses and discards 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youHaveForgottenMe: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "discard",
        amount: 2,
        target: "OPPONENTS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youHaveForgottenMe),
    );
  });

  it.skip("Dinglehopper: should parse card text", () => {
    const text =
      "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const straightenHair: ActivatedAbilityDefinition = {
      type: "activated",
      name: "STRAIGHTEN HAIR",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(straightenHair),
    );
  });

  it.skip("Anna - Heir to Arendelle: should parse card text", () => {
    const text =
      "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const annaAbility: TriggeredAbilityDefinition = {
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: { type: "has-character-named", name: "Elsa" },
        effect: {
          type: "restriction",
          restriction: "doesnt-ready",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(annaAbility),
    );
  });

  it.skip("Dr. Facilier - Agent Provocateur: should parse card text", () => {
    const text =
      "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // INTO THE SHADOWS triggered
    const intoTheShadows: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INTO THE SHADOWS",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "BANISHED_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(intoTheShadows),
    );
  });

  it.skip("Dr. Facilier - Charlatan: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Dr. Facilier - Remarkable Gentleman: should parse card text", () => {
    const text =
      "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const dreamsMadeReal: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DREAMS MADE REAL",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "SONGS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "scry",
          amount: 2,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dreamsMadeReal),
    );
  });

  it.skip("Flotsam - Ursula's Spy: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDEXTEROUS LUNGE Your characters named Jetsam gain Rush.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // DEXTEROUS LUNGE static
    const dexterousLunge: StaticAbilityDefinition = {
      type: "static",
      name: "DEXTEROUS LUNGE",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_JETSAM_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(dexterousLunge),
    );
  });

  it.skip("Jafar - Wicked Sorcerer: should parse card text", () => {
    const text =
      "Challenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Jetsam - Ursula's Spy: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSINISTER SLITHER Your characters named Flotsam gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // SINISTER SLITHER static
    const sinisterSlither: StaticAbilityDefinition = {
      type: "static",
      name: "SINISTER SLITHER",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_FLOTSAM_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(sinisterSlither),
    );
  });

  it.skip("Magic Broom - Bucket Brigade: should parse card text", () => {
    const text =
      "**SWEEP** When you play this character, you may shuffle a card from any discard into its player";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const sweep: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SWEEP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: "CARD_FROM_ANY_DISCARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(sweep));
  });

  it.skip("Maleficent - Sorceress: should parse card text", () => {
    const text =
      "CAST MY SPELL! When you play this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const castMySpell: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CAST MY SPELL!",
      trigger: {
        event: "play",
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
      expect.objectContaining(castMySpell),
    );
  });

  it.skip("Marshmallow - Persistent Guardian: should parse card text", () => {
    const text =
      "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const durable: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DURABLE",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(durable),
    );
  });

  it.skip("Mickey Mouse - Wayward Sorcerer: should parse card text", () => {
    const text =
      "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // ANIMATE BROOM static
    const animateBroom: StaticAbilityDefinition = {
      type: "static",
      name: "ANIMATE BROOM",
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "BROOM_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(animateBroom),
    );

    // CEASELESS WORKER triggered
    const ceaselessWorker: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CEASELESS WORKER",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "YOUR_BROOM_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "BANISHED_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ceaselessWorker),
    );
  });

  it.skip("Pascal - Rapunzel's Companion: should parse card text", () => {
    const text =
      "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const camouflage: StaticAbilityDefinition = {
      type: "static",
      name: "CAMOUFLAGE",
      effect: {
        type: "conditional",
        condition: { type: "has-another-character" },
        effect: {
          type: "gain-keyword",
          keyword: "Evasive",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(camouflage),
    );
  });

  it.skip("Rafiki - Mysterious Sage: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Tinker Bell - Peter Pan's Ally: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // LOYAL AND DEVOTED static
    const loyalAndDevoted: StaticAbilityDefinition = {
      type: "static",
      name: "LOYAL AND DEVOTED",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: "YOUR_PETER_PAN_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(loyalAndDevoted),
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

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 4,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Befuddle - undefined: should parse card text", () => {
    const text =
      "Return a character or item with cost 2 or less to their player";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const befuddle: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHARACTER_OR_ITEM",
        filter: { maxCost: 2 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(befuddle),
    );
  });

  it.skip("Freeze: should parse card text", () => {
    const text = "Exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const freeze: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(freeze),
    );
  });

  it.skip("Friends on the Other Side: should parse card text", () => {
    const text = "Draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const friendsOnTheOtherSide: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(friendsOnTheOtherSide),
    );
  });

  it.skip("Reflection: should parse card text", () => {
    const text =
      "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // The main action is the scry-like effect
    const reflection: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "scry",
        amount: 3,
      },
    };
    const lastAbility = result.abilities[result.abilities.length - 1];
    expect(lastAbility.ability).toEqual(expect.objectContaining(reflection));
  });

  it.skip("Ursula's Cauldron: should parse card text", () => {
    const text =
      "PEER INTO THE DEPTHS {E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const peerIntoTheDepths: ActivatedAbilityDefinition = {
      type: "activated",
      name: "PEER INTO THE DEPTHS",
      cost: {
        exert: true,
      },
      effect: {
        type: "scry",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(peerIntoTheDepths),
    );
  });

  // TRUNCATED TEXT - Card text is incomplete
  it.skip("Beast - Wolfsbane: should parse card text", () => {
    const text = "**Rush** _(This character can challenge the turn they";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - partial keyword may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Cheshire Cat - Not All There: should parse card text", () => {
    const text =
      "**Lose something?** When this character is challenged and banished, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const loseSomething: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "Lose something?",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: "CHALLENGING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(loseSomething),
    );
  });

  it.skip("Cruella De Vil - Miserable as Usual: should parse card text", () => {
    const text =
      "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youllBeSorry: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'LL BE SORRY!",
      trigger: {
        event: "banish-in-challenge",
        timing: "when",
        on: "SELF",
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
      expect.objectContaining(youllBeSorry),
    );
  });

  it.skip("Flynn Rider - Charming Rogue: should parse card text", () => {
    const text =
      "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hereComesTheSmolder: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE COMES THE SMOLDER",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "CHALLENGING_PLAYER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereComesTheSmolder),
    );
  });

  it.skip("Genie - On the Job: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDISAPPEAR When you play this character, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const disappear: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DISAPPEAR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(disappear),
    );
  });

  it.skip("Genie - Powers Unleashed: should parse card text", () => {
    const text =
      "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 6
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 6 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // PHENOMENAL COSMIC POWER triggered
    const phenomenalCosmicPower: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PHENOMENAL COSMIC POWER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          filter: { maxCost: 5, cardType: "action" },
          free: true,
        },
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(phenomenalCosmicPower),
    );
  });

  it.skip("Iago - Loud-Mouthed Parrot: should parse card text", () => {
    const text =
      "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youGotAProblem: ActivatedAbilityDefinition = {
      type: "activated",
      name: "YOU GOT A PROBLEM?",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youGotAProblem),
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

    const doItAgain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DO IT AGAIN!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "ACTION_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doItAgain),
    );
  });

  it.skip("Mad Hatter - Gracious Host: should parse card text", () => {
    const text =
      "TEA PARTY Whenever this character is challenged, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const teaParty: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TEA PARTY",
      trigger: {
        event: "challenged",
        timing: "whenever",
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
      expect.objectContaining(teaParty),
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

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
  });

  it.skip("Mother Gothel - Selfish Manipulator: should parse card text", () => {
    const text =
      "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const skipTheDrama: StaticAbilityDefinition = {
      type: "static",
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      effect: {
        type: "conditional",
        condition: { type: "self-exerted" },
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "OPPOSING_CHARACTERS",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(skipTheDrama),
    );
  });

  it.skip("Peter Pan - Never Landing: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Do It Again!: should parse card text", () => {
    const text = "Return an action card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const doItAgain: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "ACTION_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doItAgain),
    );
  });

  it.skip("Stampede: should parse card text", () => {
    const text = "Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stampede: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stampede),
    );
  });

  it.skip("Steal from the Rich: should parse card text", () => {
    const text =
      "Whenever one of your characters quests this turn, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stealFromTheRich: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "triggered",
        trigger: {
          event: "quest",
          timing: "whenever",
          on: "YOUR_CHARACTERS",
        },
        effect: {
          type: "lose-lore",
          amount: 1,
          target: "OPPONENTS",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stealFromTheRich),
    );
  });

  it.skip("The Beast is Mine!: should parse card text", () => {
    const text =
      "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theBeastIsMine: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBeastIsMine),
    );
  });

  it.skip("Vicious Betrayal - undefined: should parse card text", () => {
    const text =
      "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const viciousBetrayal: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "conditional",
        condition: { type: "is-villain" },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(viciousBetrayal),
    );
  });

  it.skip("Dr. Facilier's Cards: should parse card text", () => {
    const text =
      "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theCardsWillTell: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE CARDS WILL TELL",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "NEXT_ACTION",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theCardsWillTell),
    );
  });

  it.skip("Stolen Scimitar: should parse card text", () => {
    const text =
      "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const slash: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SLASH",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: { type: "is-named", name: "Aladdin" },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(slash));
  });

  it.skip("Aladdin - Heroic Outlaw: should parse card text", () => {
    const text =
      "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // DARING EXPLOIT triggered
    const daringExploit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DARING EXPLOIT",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "gain-lore", amount: 2, target: "CONTROLLER" },
          { type: "lose-lore", amount: 2, target: "OPPONENTS" },
        ],
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(daringExploit),
    );
  });

  it.skip("Aladdin - Street Rat: should parse card text", () => {
    const text =
      "IMPROVISE When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const improvise: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IMPROVISE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "OPPONENTS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(improvise),
    );
  });

  it.skip("Captain Hook - Ruthless Pirate: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nYOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush keyword
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // YOU COWARD! static
    const youCoward: StaticAbilityDefinition = {
      type: "static",
      name: "YOU COWARD!",
      effect: {
        type: "conditional",
        condition: { type: "self-exerted" },
        effect: {
          type: "gain-keyword",
          keyword: "Reckless",
          target: "OPPOSING_EVASIVE_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youCoward),
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

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Maui - Hero to All: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Mickey Mouse - Brave Little Tailor: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Moana - Chosen by the Ocean: should parse card text", () => {
    const text =
      "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisIsNotWhoYouAre: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS IS NOT WHO YOU ARE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_TE_KA_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsNotWhoYouAre),
    );
  });

  it.skip("Mulan - Imperial Soldier: should parse card text", () => {
    const text =
      "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const leadByExample: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LEAD BY EXAMPLE",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(leadByExample),
    );
  });

  it.skip("Peter Pan - Fearless Fighter: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Pongo - Ol' Rascal: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
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

    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 6 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
  });

  it.skip("Te Kā - The Burning One: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Tigger - Wonderful Thing: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Be Prepared: should parse card text", () => {
    const text = "Banish all characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bePrepared: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "ALL_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bePrepared),
    );
  });

  it.skip("Cut to the Chase: should parse card text", () => {
    const text =
      "Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const cutToTheChase: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cutToTheChase),
    );
  });

  it.skip("Fan the Flames: should parse card text", () => {
    const text =
      "Ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fanTheFlames: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fanTheFlames),
    );
  });

  it.skip("He's Got a Sword!: should parse card text", () => {
    const text = "Chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hesGotASword: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hesGotASword),
    );
  });

  it.skip("Tangle: should parse card text", () => {
    const text = "Each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tangle: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "OPPONENTS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tangle),
    );
  });

  it.skip("Poisoned Apple - undefined: should parse card text", () => {
    const text =
      "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const takeABite: ActivatedAbilityDefinition = {
      type: "activated",
      name: "TAKE A BITE . . .",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "conditional",
        condition: { type: "is-princess" },
        ifTrue: { type: "banish", target: "CHOSEN_CHARACTER" },
        ifFalse: { type: "exert", target: "CHOSEN_CHARACTER" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(takeABite),
    );
  });

  it.skip("Shield of Virtue: should parse card text", () => {
    const text =
      "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fireproof: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FIREPROOF",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "sequence",
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fireproof),
    );
  });

  it.skip("Sword of Truth - undefined: should parse card text", () => {
    const text =
      "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const finalEnchantment: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FINAL ENCHANTMENT",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_VILLAIN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(finalEnchantment),
    );
  });

  it.skip("Ariel - Whoseit Collector: should parse card text", () => {
    const text =
      "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookAtThisStuff: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOK AT THIS STUFF",
      trigger: {
        event: "play",
        timing: "whenever",
        on: { cardType: "item" },
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookAtThisStuff),
    );
  });

  it.skip("Aurora - Briar Rose: should parse card text", () => {
    const text =
      "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const disarmingBeauty: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DISARMING BEAUTY",
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
      expect.objectContaining(disarmingBeauty),
    );
  });

  it.skip("Belle - Strange but Special: should parse card text", () => {
    const text =
      "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // READ A BOOK static
    const readABook: StaticAbilityDefinition = {
      type: "static",
      name: "READ A BOOK",
      effect: {
        type: "additional-inkwell",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(readABook),
    );

    // MY FAVOURITE PART! static
    const myFavouritePart: StaticAbilityDefinition = {
      type: "static",
      name: "MY FAVOURITE PART!",
      effect: {
        type: "conditional",
        condition: { type: "inkwell-count", controller: "you", minimum: 10 },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 4,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(myFavouritePart),
    );
  });

  it.skip("Chief Tui - Respected Leader: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Donald Duck - Strutting His Stuff: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Gramma Tala - Storyteller: should parse card text", () => {
    const text =
      "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iWillBeWithYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I WILL BE WITH YOU",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          target: "SELF",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWillBeWithYou),
    );
  });

  it.skip("Jasmine - Queen of Agrabah: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jasmine.)\nCARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // CARETAKER dual-triggered
    const caretaker: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CARETAKER",
      trigger: {
        events: ["play", "quest"],
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(caretaker),
    );
  });

  it.skip("Maurice - World-Famous Inventor: should parse card text", () => {
    const text =
      "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\nIT WORKS! Whenever you play an item, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // GIVE IT A TRY triggered
    const giveItATry: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GIVE IT A TRY",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 2 },
        target: "NEXT_ITEM",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(giveItATry),
    );

    // IT WORKS! triggered
    const itWorks: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT WORKS!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: { cardType: "item" },
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
      expect.objectContaining(itWorks),
    );
  });

  it.skip("Merlin - Self-Appointed Mentor: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Philoctetes - Trainer of Heroes: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Scar - Mastermind: should parse card text", () => {
    const text =
      "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const insidiousPlot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INSIDIOUS PLOT",
      trigger: {
        event: "play",
        timing: "when",
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
      expect.objectContaining(insidiousPlot),
    );
  });

  it.skip("Tamatoa - So Shiny!: should parse card text", () => {
    const text =
      "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.\nGLAM This character gets +1 {L} for each item you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // WHAT HAVE WE HERE? dual-triggered
    const whatHaveWeHere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT HAVE WE HERE?",
      trigger: {
        events: ["play", "quest"],
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "ITEM_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatHaveWeHere),
    );

    // GLAM static
    const glam: StaticAbilityDefinition = {
      type: "static",
      name: "GLAM",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "for-each",
          counter: "items",
          modifier: 1,
        },
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(glam));
  });

  it.skip("If it's Not Baroque: should parse card text", () => {
    const text = "Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ifItsNotBaroque: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "ITEM_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ifItsNotBaroque),
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

    const workTogether: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(workTogether),
    );
  });

  it.skip("Eye of the Fates: should parse card text", () => {
    const text = "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const seeTheFuture: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SEE THE FUTURE",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(seeTheFuture),
    );
  });

  it.skip("Fishbone Quill - undefined: should parse card text", () => {
    const text =
      "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const goAheadAndSign: ActivatedAbilityDefinition = {
      type: "activated",
      name: "GO AHEAD AND SIGN",
      cost: {
        exert: true,
      },
      effect: {
        type: "put-into-inkwell",
        target: "CARD_FROM_HAND",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goAheadAndSign),
    );
  });

  it.skip("Magic Golden Flower: should parse card text", () => {
    const text =
      "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const healingPollen: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HEALING POLLEN",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healingPollen),
    );
  });

  it.skip("Scepter of Arendelle: should parse card text", () => {
    const text =
      "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const command: ActivatedAbilityDefinition = {
      type: "activated",
      name: "COMMAND",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(command),
    );
  });

  it.skip("Beast - Hardheaded: should parse card text", () => {
    const text =
      "BREAK When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const breakAbility: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BREAK",
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
      expect.objectContaining(breakAbility),
    );
  });

  it.skip("Captain Hook - Thinking a Happy Thought: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nChallenger +3 (While challenging, this character gets +3 {S}.)\nSTOLEN DUST Characters with cost 3 or less can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Challenger +3
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // STOLEN DUST static
    const stolenDust: StaticAbilityDefinition = {
      type: "static",
      name: "STOLEN DUST",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "CHARACTERS_COST_3_OR_LESS",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(stolenDust),
    );
  });

  it.skip("Donald Duck - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTAY ALERT! During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // STAY ALERT! static
    const stayAlert: StaticAbilityDefinition = {
      type: "static",
      name: "STAY ALERT!",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_MUSKETEER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stayAlert),
    );
  });

  it.skip("Gantu - Galactic Federation Captain: should parse card text", () => {
    const text =
      "UNDER ARREST Characters with cost 2 or less can't challenge your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const underArrest: StaticAbilityDefinition = {
      type: "static",
      name: "UNDER ARREST",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "CHARACTERS_COST_2_OR_LESS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(underArrest),
    );
  });

  it.skip("Hans - Thirteenth in Line: should parse card text", () => {
    const text =
      "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stageALittleAccident: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STAGE A LITTLE ACCIDENT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
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
      expect.objectContaining(stageALittleAccident),
    );
  });

  it.skip("Mickey Mouse - Musketeer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nALL FOR ONE Your other Musketeer characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard keyword
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // ALL FOR ONE static
    const allForOne: StaticAbilityDefinition = {
      type: "static",
      name: "ALL FOR ONE",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_OTHER_MUSKETEER_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(allForOne),
    );
  });

  it.skip("Simba - Future King: should parse card text", () => {
    const text =
      "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const guessWhat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GUESS WHAT?",
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
            { type: "discard", amount: 1, target: "CONTROLLER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(guessWhat),
    );
  });

  it.skip("Simba - Returned King: should parse card text", () => {
    const text =
      "Challenger +4 (While challenging, this character gets +4 {S}.)\nPOUNCE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Challenger +4
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 4,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // POUNCE static
    const pounce: StaticAbilityDefinition = {
      type: "static",
      name: "POUNCE",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(pounce),
    );
  });

  it.skip("Simba - Rightful Heir: should parse card text", () => {
    const text =
      "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iKnowWhatIHaveToDo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I KNOW WHAT I HAVE TO DO",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iKnowWhatIHaveToDo),
    );
  });

  it.skip("Starkey - Hook's Henchman: should parse card text", () => {
    const text =
      "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ayeAyeCaptain: StaticAbilityDefinition = {
      type: "static",
      name: "AYE AYE, CAPTAIN",
      effect: {
        type: "conditional",
        condition: { type: "has-captain-character" },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ayeAyeCaptain),
    );
  });

  it.skip("Te Kā - Heartless: should parse card text", () => {
    const text =
      "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const seekTheHeart: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SEEK THE HEART",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(seekTheHeart),
    );
  });

  it.skip("A Whole New World: should parse card text", () => {
    const text =
      "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // Main action is discard + draw
    const aWholeNewWorld: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "discard", target: "ALL_PLAYERS", amount: "HAND" },
          { type: "draw", amount: 7, target: "ALL_PLAYERS" },
        ],
      },
    };
    const lastAbility = result.abilities[result.abilities.length - 1];
    expect(lastAbility.ability).toEqual(
      expect.objectContaining(aWholeNewWorld),
    );
  });

  it.skip("Break: should parse card text", () => {
    const text = "Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const breakAction: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_ITEM",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(breakAction),
    );
  });

  it.skip("Grab Your Sword: should parse card text", () => {
    const text = "Deal 2 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const grabYourSword: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(grabYourSword),
    );
  });

  it.skip("Ransack: should parse card text", () => {
    const text = "Draw 2 cards, then choose and discard 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ransack: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          { type: "draw", amount: 2, target: "CONTROLLER" },
          { type: "discard", amount: 2, target: "CONTROLLER" },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ransack),
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

    const allForOneAndOneForAll: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ALL FOR ONE AND ONE FOR ALL",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_BODYGUARD_CHARACTERS",
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
      expect.objectContaining(allForOneAndOneForAll),
    );
  });

  it.skip("Plasma Blaster: should parse card text", () => {
    const text = "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const quickShot: ActivatedAbilityDefinition = {
      type: "activated",
      name: "QUICK SHOT",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(quickShot),
    );
  });
});
