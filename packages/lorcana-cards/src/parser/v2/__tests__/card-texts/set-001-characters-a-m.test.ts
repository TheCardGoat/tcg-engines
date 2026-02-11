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

describe("Set 001 Card Text Parser Tests - Characters A M", () => {
  it.skip("Ariel - On Human Legs: should parse card text", () => {
    const text = "VOICELESS This character can't {E} to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const voiceless = {
      effect: {
        restriction: "cant-sing",
        target: "SELF",
        type: "restriction",
      },
      name: "VOICELESS",
      type: "static",
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
    const singer = Abilities.KeywordWithValue("Singer", { value: 5 });
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );

    // Second ability: MUSICAL DEBUT triggered
    const musicalDebut = Abilities.Triggered({
      effect: {
        amount: 4,
        type: "scry",
      },
      name: "MUSICAL DEBUT",
      trigger: Triggers.WhenYouPlay(),
    });
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
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: AND TWO FOR TEA! triggered
    const andTwoForTea = Abilities.Triggered({
      effect: Effects.Optional(
        Effects.RemoveDamage({
          amount: 2,
          target: Targets.YourMusketeers(),
          upTo: true,
        }),
      ),
      name: "AND TWO FOR TEA!",
      trigger: Triggers.WhenYouPlay(),
    });
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
    const shift = Abilities.Shift({ cost: Costs.Ink(6) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SINISTER PLOT static
    const sinisterPlot = Abilities.Static({
      effect: {
        modifier: {
          type: "for-each",
          counter: "characters",
          modifier: 1,
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "SINISTER PLOT",
    });
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

    const wellOfSouls = Abilities.Triggered({
      effect: Effects.ReturnToHand({
        target: Targets.CharacterFromDiscard(),
      }),
      name: "WELL OF SOULS",
      trigger: Triggers.WhenYouPlay(),
    });
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

    const support = Abilities.Keyword("Support");
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

    const loyal = {
      effect: {
        reduction: { ink: 1 },
        target: "SELF",
        type: "cost-reduction",
      },
      name: "LOYAL",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(loyal));
  });

  it.skip("Maximus - Palace Horse: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    const support = Abilities.Keyword("Support");
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

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const horseKick = {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "HORSE KICK",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(horseKick),
    );
  });

  it.skip("Control Your Temper!: should parse card text", () => {
    const text = "Chosen character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const controlYourTemper = {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      type: "action",
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

    const hakunaMatata = {
      effect: {
        amount: 3,
        target: "YOUR_CHARACTERS",
        type: "remove-damage",
      },
      type: "action",
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

    const healingGlow = {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      type: "action",
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

    const justInTime = {
      effect: {
        filter: { maxCost: 5, cardType: "character" },
        free: true,
        from: "hand",
        type: "play-card",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justInTime),
    );
  });

  it.skip("Dinglehopper: should parse card text", () => {
    const text =
      "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const straightenHair = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      name: "STRAIGHTEN HAIR",
      type: "activated",
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

    const annaAbility = {
      effect: {
        condition: { type: "has-character-named", name: "Elsa" },
        effect: {
          type: "restriction",
          restriction: "doesnt-ready",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
        type: "conditional",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const shift = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // INTO THE SHADOWS triggered
    const intoTheShadows = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "BANISHED_CHARACTER",
        },
        type: "optional",
      },
      name: "INTO THE SHADOWS",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
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

    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 2,
    });
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

    const dreamsMadeReal = {
      effect: {
        effect: {
          type: "scry",
          amount: 2,
        },
        type: "optional",
      },
      name: "DREAMS MADE REAL",
      trigger: {
        event: "play",
        on: "SONGS",
        timing: "whenever",
      },
      type: "triggered",
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
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // DEXTEROUS LUNGE static
    const dexterousLunge = {
      effect: {
        keyword: "Rush",
        target: "YOUR_JETSAM_CHARACTERS",
        type: "gain-keyword",
      },
      name: "DEXTEROUS LUNGE",
      type: "static",
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

    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 3,
    });
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
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // SINISTER SLITHER static
    const sinisterSlither = {
      effect: {
        keyword: "Evasive",
        target: "YOUR_FLOTSAM_CHARACTERS",
        type: "gain-keyword",
      },
      name: "SINISTER SLITHER",
      type: "static",
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

    const sweep = {
      effect: {
        effect: {
          type: "shuffle-into-deck",
          target: "CARD_FROM_ANY_DISCARD",
        },
        type: "optional",
      },
      name: "SWEEP",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(sweep));
  });

  it.skip("Maleficent - Sorceress: should parse card text", () => {
    const text =
      "CAST MY SPELL! When you play this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const castMySpell = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "CAST MY SPELL!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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

    const durable = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "SELF",
        },
        type: "optional",
      },
      name: "DURABLE",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const animateBroom = {
      effect: {
        reduction: { ink: 1 },
        target: "BROOM_CHARACTERS",
        type: "cost-reduction",
      },
      name: "ANIMATE BROOM",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(animateBroom),
    );

    // CEASELESS WORKER triggered
    const ceaselessWorker = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "BANISHED_CHARACTER",
        },
        type: "optional",
      },
      name: "CEASELESS WORKER",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_BROOM_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ceaselessWorker),
    );
  });

  it.skip("Befuddle - undefined: should parse card text", () => {
    const text =
      "Return a character or item with cost 2 or less to their player";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const befuddle = {
      effect: {
        filter: { maxCost: 2 },
        target: "CHARACTER_OR_ITEM",
        type: "return-to-hand",
      },
      type: "action",
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

    const freeze = {
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "exert",
      },
      type: "action",
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

    const friendsOnTheOtherSide = {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(friendsOnTheOtherSide),
    );
  });

  it.skip("Beast - Wolfsbane: should parse card text", () => {
    const text = "**Rush** _(This character can challenge the turn they";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - partial keyword may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Cheshire Cat - Not All There: should parse card text", () => {
    const text =
      "**Lose something?** When this character is challenged and banished, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const loseSomething = {
      effect: {
        target: "CHALLENGING_CHARACTER",
        type: "banish",
      },
      name: "Lose something?",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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

    const youllBeSorry = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "YOU'LL BE SORRY!",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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

    const hereComesTheSmolder = {
      effect: {
        amount: 1,
        target: "CHALLENGING_PLAYER",
        type: "discard",
      },
      name: "HERE COMES THE SMOLDER",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
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

    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    const disappear = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "DISAPPEAR",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const shift = Abilities.Shift({ cost: Costs.Ink(6) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // PHENOMENAL COSMIC POWER triggered
    const phenomenalCosmicPower = {
      effect: {
        effect: {
          type: "play-card",
          from: "hand",
          filter: { maxCost: 5, cardType: "action" },
          free: true,
        },
        type: "optional",
      },
      name: "PHENOMENAL COSMIC POWER",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
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

    const youGotAProblem = {
      cost: {
        exert: true,
      },
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "YOU GOT A PROBLEM?",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youGotAProblem),
    );
  });

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

    const doItAgain = {
      effect: {
        effect: {
          type: "return-to-hand",
          target: "ACTION_FROM_DISCARD",
        },
        type: "optional",
      },
      name: "DO IT AGAIN!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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

    const teaParty = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "TEA PARTY",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(teaParty),
    );
  });

  it.skip("Mickey Mouse - Artful Rogue: should parse card text", () => {
    const text =
      "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated but Shift 5 may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    const shift = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
  });

  it.skip("Mother Gothel - Selfish Manipulator: should parse card text", () => {
    const text =
      "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const skipTheDrama = {
      effect: {
        condition: { type: "self-exerted" },
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "OPPOSING_CHARACTERS",
        },
        type: "conditional",
      },
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(skipTheDrama),
    );
  });

  it.skip("Do It Again!: should parse card text", () => {
    const text = "Return an action card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const doItAgain = {
      effect: {
        target: "ACTION_FROM_DISCARD",
        type: "return-to-hand",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(doItAgain),
    );
  });

  it.skip("Dr. Facilier's Cards: should parse card text", () => {
    const text =
      "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theCardsWillTell = {
      cost: {
        exert: true,
      },
      effect: {
        reduction: { ink: 1 },
        target: "NEXT_ACTION",
        type: "cost-reduction",
      },
      name: "THE CARDS WILL TELL",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theCardsWillTell),
    );
  });

  it.skip("Aladdin - Heroic Outlaw: should parse card text", () => {
    const text =
      "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
    const shift = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // DARING EXPLOIT triggered
    const daringExploit = {
      effect: {
        effects: [
          { type: "gain-lore", amount: 2, target: "CONTROLLER" },
          { type: "lose-lore", amount: 2, target: "OPPONENTS" },
        ],
        type: "sequence",
      },
      name: "DARING EXPLOIT",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
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

    const improvise = {
      effect: {
        amount: 1,
        target: "OPPONENTS",
        type: "lose-lore",
      },
      name: "IMPROVISE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // YOU COWARD! static
    const youCoward = {
      effect: {
        condition: { type: "self-exerted" },
        effect: {
          type: "gain-keyword",
          keyword: "Reckless",
          target: "OPPOSING_EVASIVE_CHARACTERS",
        },
        type: "conditional",
      },
      name: "YOU COWARD!",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youCoward),
    );
  });

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

    const evasive = Abilities.Keyword("Evasive");
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

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const reckless = Abilities.Keyword("Reckless");
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

    const evasive = Abilities.Keyword("Evasive");
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

    const thisIsNotWhoYouAre = {
      effect: {
        effect: {
          type: "banish",
          target: "CHOSEN_TE_KA_CHARACTER",
        },
        type: "optional",
      },
      name: "THIS IS NOT WHO YOU ARE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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

    const leadByExample = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      name: "LEAD BY EXAMPLE",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(leadByExample),
    );
  });

  it.skip("Be Prepared: should parse card text", () => {
    const text = "Banish all characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bePrepared = {
      effect: {
        target: "ALL_CHARACTERS",
        type: "banish",
      },
      type: "action",
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

    const cutToTheChase = {
      effect: {
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      type: "action",
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

    const fanTheFlames = {
      effect: {
        effects: [
          { type: "ready", target: "CHOSEN_CHARACTER" },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "sequence",
      },
      type: "action",
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

    const hesGotASword = {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hesGotASword),
    );
  });

  it.skip("Ariel - Whoseit Collector: should parse card text", () => {
    const text =
      "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookAtThisStuff = {
      effect: {
        effect: {
          type: "ready",
          target: "SELF",
        },
        type: "optional",
      },
      name: "LOOK AT THIS STUFF",
      trigger: {
        event: "play",
        on: { cardType: "item" },
        timing: "whenever",
      },
      type: "triggered",
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

    const disarmingBeauty = {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "DISARMING BEAUTY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const readABook = {
      effect: {
        amount: 1,
        type: "additional-inkwell",
      },
      name: "READ A BOOK",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(readABook),
    );

    // MY FAVOURITE PART! static
    const myFavouritePart = {
      effect: {
        condition: { type: "inkwell-count", controller: "you", minimum: 10 },
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 4,
          target: "SELF",
        },
        type: "conditional",
      },
      name: "MY FAVOURITE PART!",
      type: "static",
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

    const support = Abilities.Keyword("Support");
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

    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Gramma Tala - Storyteller: should parse card text", () => {
    const text =
      "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iWillBeWithYou = {
      effect: {
        effect: {
          type: "put-into-inkwell",
          target: "SELF",
          exerted: true,
        },
        type: "optional",
      },
      name: "I WILL BE WITH YOU",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const shift = Abilities.Shift({ cost: Costs.Ink(3) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // CARETAKER dual-triggered
    const caretaker = {
      effect: {
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "YOUR_CHARACTERS",
        },
        type: "optional",
      },
      name: "CARETAKER",
      trigger: {
        events: ["play", "quest"],
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const giveItATry = {
      effect: {
        reduction: { ink: 2 },
        target: "NEXT_ITEM",
        type: "cost-reduction",
      },
      name: "GIVE IT A TRY",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(giveItATry),
    );

    // IT WORKS! triggered
    const itWorks = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "IT WORKS!",
      trigger: {
        event: "play",
        on: { cardType: "item" },
        timing: "whenever",
      },
      type: "triggered",
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

    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("If it's Not Baroque: should parse card text", () => {
    const text = "Return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ifItsNotBaroque = {
      effect: {
        target: "ITEM_FROM_DISCARD",
        type: "return-to-hand",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ifItsNotBaroque),
    );
  });

  it.skip("Let It Go: should parse card text", () => {
    const text =
      "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement complete meaningful assertions
    expect(result.success).toBe(true);
  });

  it.skip("Eye of the Fates: should parse card text", () => {
    const text = "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const seeTheFuture = {
      cost: {
        exert: true,
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "SEE THE FUTURE",
      type: "activated",
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

    const goAheadAndSign = {
      cost: {
        exert: true,
      },
      effect: {
        target: "CARD_FROM_HAND",
        type: "put-into-inkwell",
      },
      name: "GO AHEAD AND SIGN",
      type: "activated",
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

    const healingPollen = {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: 3,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      name: "HEALING POLLEN",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(healingPollen),
    );
  });

  it.skip("Beast - Hardheaded: should parse card text", () => {
    const text =
      "BREAK When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const breakAbility = {
      effect: {
        effect: {
          type: "banish",
          target: "CHOSEN_ITEM",
        },
        type: "optional",
      },
      name: "BREAK",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
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
    const shift = Abilities.Shift({ cost: Costs.Ink(3) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Challenger +3
    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 3,
    });
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // STOLEN DUST static
    const stolenDust = {
      effect: {
        restriction: "cant-challenge",
        target: "CHARACTERS_COST_3_OR_LESS",
        type: "restriction",
      },
      name: "STOLEN DUST",
      type: "static",
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
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // STAY ALERT! static
    const stayAlert = {
      effect: {
        keyword: "Evasive",
        target: "YOUR_MUSKETEER_CHARACTERS",
        type: "gain-keyword",
      },
      name: "STAY ALERT!",
      type: "static",
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

    const underArrest = {
      effect: {
        restriction: "cant-challenge",
        target: "CHARACTERS_COST_2_OR_LESS",
        type: "restriction",
      },
      name: "UNDER ARREST",
      type: "static",
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

    const stageALittleAccident = {
      effect: {
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "STAGE A LITTLE ACCIDENT",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
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
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // ALL FOR ONE static
    const allForOne = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_OTHER_MUSKETEER_CHARACTERS",
        type: "modify-stat",
      },
      name: "ALL FOR ONE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(allForOne),
    );
  });

  it.skip("A Whole New World: should parse card text", () => {
    const text =
      "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // Main action is discard + draw
    const aWholeNewWorld = {
      effect: {
        effects: [
          { type: "discard", target: "ALL_PLAYERS", amount: "HAND" },
          { type: "draw", amount: 7, target: "ALL_PLAYERS" },
        ],
        type: "sequence",
      },
      type: "action",
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

    const breakAction = {
      effect: {
        target: "CHOSEN_ITEM",
        type: "banish",
      },
      type: "action",
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

    const grabYourSword = {
      effect: {
        amount: 2,
        target: "OPPOSING_CHARACTERS",
        type: "deal-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(grabYourSword),
    );
  });

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

    const allForOneAndOneForAll = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "ALL FOR ONE AND ONE FOR ALL",
      trigger: {
        event: "banish",
        on: "YOUR_BODYGUARD_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(allForOneAndOneForAll),
    );
  });
});
