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

describe("Set 001 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Prince Phillip - Dragonslayer: should parse card text", () => {
    const text =
      "HEROISM When this character challenges and is banished, you may banish the challenged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const heroism = Abilities.Triggered({
      name: "HEROISM",
      trigger: Triggers.BanishInChallenge({
        timing: "when",
        on: "SELF",
      }),
      effect: Effects.Banish({
        target: Targets.ChallengedCharacter(),
        optional: true,
      }),
    });
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

    const gleamAndGlow = {
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

    const singer = Abilities.KeywordWithValue("Singer", { value: 4 });
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

    const bodyguard = Abilities.Keyword("Bodyguard");
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

    const tastesLikeChicken = {
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

  it.skip("Part of Your World: should parse card text", () => {
    const text = "Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const partOfYourWorld = {
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

    const youHaveForgottenMe = {
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

  it.skip("Pascal - Rapunzel's Companion: should parse card text", () => {
    const text =
      "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const camouflage = {
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

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Tinker Bell - Peter Pan's Ally: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive keyword
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // LOYAL AND DEVOTED static
    const loyalAndDevoted = {
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

  it.skip("Ursula - Power Hungry: should parse card text", () => {
    const text = "**IT";
    const result = parseAbilityTextMulti(text);
    // Text is truncated - cannot implement meaningful assertions
    expect(result.success).toBe(false);
  });

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

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 4,
    });
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Reflection: should parse card text", () => {
    const text =
      "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    // The main action is the scry-like effect
    const reflection = {
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

    const peerIntoTheDepths = {
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

  it.skip("Peter Pan - Never Landing: should parse card text", () => {
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

  it.skip("Stampede: should parse card text", () => {
    const text = "Deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const stampede = {
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

    const stealFromTheRich = {
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

    const theBeastIsMine = {
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

    const viciousBetrayal = {
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

  it.skip("Stolen Scimitar: should parse card text", () => {
    const text =
      "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const slash = {
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

  it.skip("Peter Pan - Fearless Fighter: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Pongo - Ol' Rascal: should parse card text", () => {
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

  it.skip("Scar - Shameless Firebrand: should parse card text", () => {
    const text =
      "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can";
    const result = parseAbilityTextMulti(text);
    // Text is truncated but Shift 6 may parse
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThanOrEqual(1);

    const shift = Abilities.Shift({ cost: Costs.Ink(6) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
  });

  it.skip("Te Kā - The Burning One: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless = Abilities.Keyword("Reckless");
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

    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Tangle: should parse card text", () => {
    const text = "Each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tangle = {
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

    const takeABite = {
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

    const fireproof = {
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

    const finalEnchantment = {
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

  it.skip("Philoctetes - Trainer of Heroes: should parse card text", () => {
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

  it.skip("Scar - Mastermind: should parse card text", () => {
    const text =
      "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const insidiousPlot = {
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
    const whatHaveWeHere = {
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
    const glam = {
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

  it.skip("Work Together: should parse card text", () => {
    const text =
      "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const workTogether = {
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

  it.skip("Scepter of Arendelle: should parse card text", () => {
    const text =
      "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const command = {
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

  it.skip("Simba - Future King: should parse card text", () => {
    const text =
      "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const guessWhat = {
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
    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 4,
    });
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // POUNCE static
    const pounce = {
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

    const iKnowWhatIHaveToDo = {
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

    const ayeAyeCaptain = {
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

    const seekTheHeart = {
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

  it.skip("Ransack: should parse card text", () => {
    const text = "Draw 2 cards, then choose and discard 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ransack = {
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

  it.skip("Plasma Blaster: should parse card text", () => {
    const text = "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const quickShot = {
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
