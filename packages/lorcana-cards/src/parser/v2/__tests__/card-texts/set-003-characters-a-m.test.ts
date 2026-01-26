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

describe("Set 003 Card Text Parser Tests - Characters A M", () => {
  it.skip("Baloo - von Bruinwald XIII: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.";
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

    // Second ability: LET'S MAKE LIKE A TREE (triggered)
    const letsMakeLikeATree: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LET'S MAKE LIKE A TREE",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letsMakeLikeATree),
    );
  });

  it.skip("Bernard - Brand-New Agent: should parse card text", () => {
    const text =
      "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'LL CHECK IT OUT (triggered)
    const illCheckItOut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'LL CHECK IT OUT",
      trigger: {
        event: "end-of-turn",
        timing: "at",
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
      expect.objectContaining(illCheckItOut),
    );
  });

  it.skip("Chernabog - Evildoer: should parse card text", () => {
    const text =
      "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.\nSUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // THE POWER OF EVIL (static - cost reduction)
    const thePowerOfEvil: StaticAbilityDefinition = {
      type: "static",
      name: "THE POWER OF EVIL",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thePowerOfEvil),
    );

    // SUMMON THE SPIRITS (triggered)
    const summonTheSpirits: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SUMMON THE SPIRITS",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "shuffle-into-deck",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(summonTheSpirits),
    );
  });

  it.skip("Joshua Sweet - The Doctor: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Kida - Protector of Atlantis: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kida.)\nPERHAPS WE CAN SAVE OUR FUTURE When you play this character, all characters get -3 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
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

    // PERHAPS WE CAN SAVE OUR FUTURE (triggered)
    const perhapsWeCanSaveOurFuture: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PERHAPS WE CAN SAVE OUR FUTURE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(perhapsWeCanSaveOurFuture),
    );
  });

  it.skip("Lucky - The 15th Puppy: should parse card text", () => {
    const text =
      "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.\nPUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // GOOD AS NEW (activated)
    const goodAsNew: ActivatedAbilityDefinition = {
      type: "activated",
      name: "GOOD AS NEW",
      cost: {
        exert: true,
      },
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goodAsNew),
    );

    // PUPPY LOVE (triggered)
    const puppyLove: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PUPPY LOVE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(puppyLove),
    );
  });

  it.skip("Minnie Mouse - Musical Artist: should parse card text", () => {
    const text =
      "Singer 3 (This character counts as cost 3 to sing songs.)\nENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Singer 3
    const singer3: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer3),
    );

    // ENTOURAGE (triggered)
    const entourage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENTOURAGE",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(entourage),
    );
  });

  it.skip("Miss Bianca - Rescue Aid Society Agent: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Singer 4
    const singer4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 4,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer4),
    );
  });

  it.skip("Boss's Orders: should parse card text", () => {
    const text =
      "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Cleansing Rainwater: should parse card text", () => {
    const text =
      "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // ANCIENT POWER (activated)
    const ancientPower: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ANCIENT POWER",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ancientPower),
    );
  });

  it.skip("Heart of Atlantis: should parse card text", () => {
    const text =
      "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LIFE GIVER (activated)
    const lifeGiver: ActivatedAbilityDefinition = {
      type: "activated",
      name: "LIFE GIVER",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lifeGiver),
    );
  });

  it.skip("Alice - Tea Alchemist: should parse card text", () => {
    const text =
      "CURIOUSER AND CURIOUSER {E} — Exert chosen opposing character and all other opposing characters with the same name.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CURIOUSER AND CURIOUSER (activated)
    const curiouserAndCuriouser: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CURIOUSER AND CURIOUSER",
      cost: {
        exert: true,
      },
      effect: {
        type: "exert",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(curiouserAndCuriouser),
    );
  });

  it.skip("Chernabog's Followers - Creatures of Evil: should parse card text", () => {
    const text =
      "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // RESTLESS SOULS (triggered)
    const restlessSouls: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "RESTLESS SOULS",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(restlessSouls),
    );
  });

  it.skip("Diablo - Faithful Pet: should parse card text", () => {
    const text =
      "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LOOKING FOR AURORA (triggered)
    const lookingForAurora: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOKING FOR AURORA",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookingForAurora),
    );
  });

  it.skip("Hydros - Ice Titan: should parse card text", () => {
    const text = "BLIZZARD {E} — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // BLIZZARD (activated)
    const blizzard: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BLIZZARD",
      cost: {
        exert: true,
      },
      effect: {
        type: "exert",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(blizzard),
    );
  });

  it.skip("Iago - Pretty Polly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Jafar - Striking Illusionist: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jafar.)\nEvasive (Only characters with Evasive can challenge this character.)\nPOWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Shift 5
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

    // Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // POWER BEYOND MEASURE (triggered)
    const powerBeyondMeasure: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POWER BEYOND MEASURE",
      trigger: {
        event: "draw",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(powerBeyondMeasure),
    );
  });

  it.skip("Lena Sabrewing - Rebellious Teenager: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Magic Broom - Dancing Duster: should parse card text", () => {
    const text =
      "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // POWER CLEAN (triggered)
    const powerClean: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POWER CLEAN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(powerClean),
    );
  });

  it.skip("Magic Broom - Swift Cleaner: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nCLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // CLEAN THIS, CLEAN THAT (triggered)
    const cleanThisCleanThat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLEAN THIS, CLEAN THAT",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(cleanThisCleanThat),
    );
  });

  it.skip("Magic Broom - The Big Sweeper: should parse card text", () => {
    const text =
      "CLEAN SWEEP While this character is at a location, it gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CLEAN SWEEP (static)
    const cleanSweep: StaticAbilityDefinition = {
      type: "static",
      name: "CLEAN SWEEP",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cleanSweep),
    );
  });

  it.skip("Magic Carpet - Flying Rug: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nFIND THE WAY {E} — Move a character of yours to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // FIND THE WAY (activated)
    const findTheWay: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FIND THE WAY",
      cost: {
        exert: true,
      },
      effect: {
        type: "move",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(findTheWay),
    );
  });

  it.skip("Magica De Spell - The Midas Touch: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Magica De Spell.)\nALL MINE Whenever this character quests, gain lore equal to the cost of one of your items in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
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

    // ALL MINE (triggered)
    const allMine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ALL MINE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(allMine),
    );
  });

  it.skip("Magica De Spell - Thieving Sorceress: should parse card text", () => {
    const text =
      "TELEKINESIS {E} — Return chosen item with cost equal to or less than this character's {S} to its player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // TELEKINESIS (activated)
    const telekinesis: ActivatedAbilityDefinition = {
      type: "activated",
      name: "TELEKINESIS",
      cost: {
        exert: true,
      },
      effect: {
        type: "return-to-hand",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(telekinesis),
    );
  });

  it.skip("Maleficent - Mistress of All Evil: should parse card text", () => {
    const text =
      "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // DARK KNOWLEDGE (triggered)
    const darkKnowledge: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DARK KNOWLEDGE",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(darkKnowledge),
    );

    // DIVINATION (triggered)
    const divination: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DIVINATION",
      trigger: {
        event: "draw",
        timing: "whenever",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(divination),
    );
  });

  it.skip("Bestow a Gift: should parse card text", () => {
    const text =
      "Move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "move-damage",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("It Calls Me: should parse card text", () => {
    const text =
      "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Cubby - Mighty Lost Boy: should parse card text", () => {
    const text =
      "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THE BEAR (triggered)
    const theBear: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE BEAR",
      trigger: {
        event: "move",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBear),
    );
  });

  it.skip("Don Karnage - Prince of Pirates: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Flotsam - Riffraff: should parse card text", () => {
    const text = "EERIE PAIR Your characters named Jetsam get +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // EERIE PAIR (static)
    const eeriePair: StaticAbilityDefinition = {
      type: "static",
      name: "EERIE PAIR",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(eeriePair),
    );
  });

  it.skip("Friar Tuck - Priest of Nottingham: should parse card text", () => {
    const text =
      "YOU THIEVING SCOUNDREL When you play this character, the player or players with the most cards in their hand chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // YOU THIEVING SCOUNDREL (triggered)
    const youThievingScoundrel: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU THIEVING SCOUNDREL",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "discard",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youThievingScoundrel),
    );
  });

  it.skip("Helga Sinclair - Femme Fatale: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)\nTHIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
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

    // THIS CHANGES EVERYTHING (triggered)
    const thisChangesEverything: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS CHANGES EVERYTHING",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thisChangesEverything),
    );
  });

  it.skip("Helga Sinclair - Vengeful Partner: should parse card text", () => {
    const text =
      "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOTHING PERSONAL (triggered)
    const nothingPersonal: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOTHING PERSONAL",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nothingPersonal),
    );
  });

  it.skip("Jetsam - Riffraff: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nEERIE PAIR Your characters named Flotsam gain Ward.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // EERIE PAIR (static)
    const eeriePair: StaticAbilityDefinition = {
      type: "static",
      name: "EERIE PAIR",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(eeriePair),
    );
  });

  it.skip("Kit Cloudkicker - Tough Guy: should parse card text", () => {
    const text =
      "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SKYSURFING (triggered)
    const skysurfing: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SKYSURFING",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(skysurfing),
    );
  });

  it.skip("Lyle Tiberius Rourke - Cunning Mercenary: should parse card text", () => {
    const text =
      "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)\nTHANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // WELL, NOW YOU KNOW (triggered)
    const wellNowYouKnow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WELL, NOW YOU KNOW",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellNowYouKnow),
    );

    // THANKS FOR VOLUNTEERING (triggered)
    const thanksForVolunteering: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THANKS FOR VOLUNTEERING",
      trigger: {
        event: "banish",
        timing: "whenever",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thanksForVolunteering),
    );
  });

  it.skip("Milo Thatch - King of Atlantis: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Milo Thatch.)\nTAKE THEM BY SURPRISE When this character is banished, return all opposing characters to their players' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 4
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

    // TAKE THEM BY SURPRISE (triggered)
    const takeThemBySurprise: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TAKE THEM BY SURPRISE",
      trigger: {
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(takeThemBySurprise),
    );
  });

  it.skip("Morph - Space Goo: should parse card text", () => {
    const text =
      "MIMICRY You may play any character with Shift on this character as if this character had any name.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MIMICRY (static)
    const mimicry: StaticAbilityDefinition = {
      type: "static",
      name: "MIMICRY",
      effect: {
        type: "grant-keyword",
        keyword: "Shift",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mimicry),
    );
  });

  it.skip("Has Set My Heaaaaaaart . . .: should parse card text", () => {
    const text = "Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("I Will Find My Way: should parse card text", () => {
    const text =
      "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Airfoil: should parse card text", () => {
    const text =
      "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I GOT TO BE GOING (activated)
    const iGotToBeGoing: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I GOT TO BE GOING",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iGotToBeGoing),
    );
  });

  it.skip("Fang - River City: should parse card text", () => {
    const text =
      "SURROUNDED BY WATER Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // SURROUNDED BY WATER (static)
    const surroundedByWater: StaticAbilityDefinition = {
      type: "static",
      name: "SURROUNDED BY WATER",
      effect: {
        type: "grant-keywords",
        keywords: [{ keyword: "Ward" }, { keyword: "Evasive" }],
        target: "CHARACTERS_HERE",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(surroundedByWater),
    );
  });

  it.skip("Kuzco's Palace - Home of the Emperor: should parse card text", () => {
    const text =
      "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CITY WALLS (triggered)
    const cityWalls: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CITY WALLS",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cityWalls),
    );
  });

  it.skip("Captain Hook - Master Swordsman: should parse card text", () => {
    const text =
      "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.\nMAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // NEMESIS (triggered)
    const nemesis: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NEMESIS",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nemesis),
    );

    // MAN-TO-MAN (static)
    const manToMan: StaticAbilityDefinition = {
      type: "static",
      name: "MAN-TO-MAN",
      effect: {
        type: "restriction",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(manToMan),
    );
  });

  it.skip("Della Duck - Unstoppable Mom: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("HeiHei - Accidental Explorer: should parse card text", () => {
    const text =
      "MINDLESS WANDERING Once per turn, when this character moves to a location, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // MINDLESS WANDERING (triggered)
    const mindlessWandering: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MINDLESS WANDERING",
      trigger: {
        event: "move",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mindlessWandering),
    );
  });

  it.skip("Hydra - Deadly Serpent: should parse card text", () => {
    const text =
      "WATCH THE TEETH Whenever this character is dealt damage, deal that much damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // WATCH THE TEETH (triggered)
    const watchTheTeeth: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WATCH THE TEETH",
      trigger: {
        event: "deal-damage",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: { ref: "trigger-source" },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(watchTheTeeth),
    );
  });

  it.skip("Jim Hawkins - Space Traveler: should parse card text", () => {
    const text =
      "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.\nTAKE THE HELM Whenever you play a location, this character may move there for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // THIS IS IT! (triggered)
    const thisIsIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS IS IT!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsIt),
    );

    // TAKE THE HELM (triggered)
    const takeTheHelm: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TAKE THE HELM",
      trigger: {
        event: "play",
        timing: "whenever",
      },
      effect: {
        type: "move",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(takeTheHelm),
    );
  });

  it.skip("Kakamora - Menacing Sailor: should parse card text", () => {
    const text =
      "PLUNDER When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // PLUNDER (triggered)
    const plunder: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "PLUNDER",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(plunder),
    );
  });

  it.skip("Madame Medusa - The Boss: should parse card text", () => {
    const text =
      "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THAT TERRIBLE WOMAN (triggered)
    const thatTerribleWoman: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THAT TERRIBLE WOMAN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thatTerribleWoman),
    );
  });

  it.skip("Maui - Soaring Demigod: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nIN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Reckless
    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );

    // IN MA BELLY (triggered)
    const inMaBelly: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IN MA BELLY",
      trigger: {
        event: "quest",
        timing: "whenever",
      },
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(inMaBelly),
    );
  });

  it.skip("Milo Thatch - Spirited Scholar: should parse card text", () => {
    const text =
      "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // I'M YOUR MAN! (static)
    const imYourMan: StaticAbilityDefinition = {
      type: "static",
      name: "I'M YOUR MAN!",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imYourMan),
    );
  });

  it.skip("Moana - Born Leader: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Moana.)\nWELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
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

    // WELCOME TO MY BOAT (triggered)
    const welcomeToMyBoat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WELCOME TO MY BOAT",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(welcomeToMyBoat),
    );
  });

  it.skip("Divebomb: should parse card text", () => {
    const text =
      "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("I've Got a Dream: should parse card text", () => {
    const text =
      "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Maui's Fish Hook: should parse card text", () => {
    const text =
      "IT'S MAUI TIME! If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\nSHAPESHIFT {E}, 2 {I} — Choose one:\n• Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)\n• Chosen character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // IT'S MAUI TIME! (static)
    const itsMauiTime: StaticAbilityDefinition = {
      type: "static",
      name: "IT'S MAUI TIME!",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itsMauiTime),
    );

    // SHAPESHIFT (activated with modal)
    const shapeshift: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SHAPESHIFT",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "modal",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shapeshift),
    );
  });

  it.skip("Jolly Roger - Hook's Ship: should parse card text", () => {
    const text =
      "LOOK ALIVE, YOU SWABS! Characters gain Rush while here. (They can challenge the turn they're played.)\nALL HANDS ON DECK! Your Pirate characters may move here for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // LOOK ALIVE, YOU SWABS! (static)
    const lookAliveYouSwabs: StaticAbilityDefinition = {
      type: "static",
      name: "LOOK ALIVE, YOU SWABS!",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookAliveYouSwabs),
    );

    // ALL HANDS ON DECK! (static)
    const allHandsOnDeck: StaticAbilityDefinition = {
      type: "static",
      name: "ALL HANDS ON DECK!",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(allHandsOnDeck),
    );
  });

  it.skip("Audrey Ramirez - The Engineer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nSPARE PARTS Whenever this character quests, ready one of your items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // SPARE PARTS (triggered)
    const spareParts: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SPARE PARTS",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "ready",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(spareParts),
    );
  });

  it.skip("Captain Amelia - First in Command: should parse card text", () => {
    const text =
      "DISCIPLINE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // DISCIPLINE (static)
    const discipline: StaticAbilityDefinition = {
      type: "static",
      name: "DISCIPLINE",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(discipline),
    );
  });

  it.skip("Flintheart Glomgold - Lone Cheater: should parse card text", () => {
    const text =
      "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THEY'LL NEVER SEE IT COMING! (static)
    const theyllNeverSeeItComing: StaticAbilityDefinition = {
      type: "static",
      name: "THEY'LL NEVER SEE IT COMING!",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theyllNeverSeeItComing),
    );
  });

  it.skip("Gramma Tala - Keeper of Ancient Stories: should parse card text", () => {
    const text =
      "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // THERE WAS ONLY OCEAN (triggered)
    const thereWasOnlyOcean: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THERE WAS ONLY OCEAN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "look-at-top",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thereWasOnlyOcean),
    );
  });

  it.skip("Gramma Tala - Spirit of the Ocean: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Gramma Tala.)\nDO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 5
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

    // DO YOU KNOW WHO YOU ARE? (triggered)
    const doYouKnowWhoYouAre: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DO YOU KNOW WHO YOU ARE?",
      trigger: {
        event: "put-into-inkwell",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(doYouKnowWhoYouAre),
    );
  });

  it.skip("Gyro Gearloose - Gadget Whiz: should parse card text", () => {
    const text =
      "NOW TRY TO KEEP UP {E} — Put an item card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NOW TRY TO KEEP UP (activated)
    const nowTryToKeepUp: ActivatedAbilityDefinition = {
      type: "activated",
      name: "NOW TRY TO KEEP UP",
      cost: {
        exert: true,
      },
      effect: {
        type: "put-on-top",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nowTryToKeepUp),
    );
  });

  it.skip("Kit Cloudkicker - Navigator: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 3
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

    // Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Kit Cloudkicker - Spunky Bear Cub: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Distract: should parse card text", () => {
    const text = "Chosen character gets -2 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Friend Like Me: should parse card text", () => {
    const text =
      "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "put-into-inkwell",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("How Far I'll Go: should parse card text", () => {
    const text =
      "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "look-at-top",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Lucky Dime: should parse card text", () => {
    const text =
      "NUMBER ONE {E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // NUMBER ONE (activated)
    const numberOne: ActivatedAbilityDefinition = {
      type: "activated",
      name: "NUMBER ONE",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-lore",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(numberOne),
    );
  });

  it.skip("Belle's House - Maurice's Workshop: should parse card text", () => {
    const text =
      "LABORATORY If you have a character here, you pay 1 {I} less to play items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LABORATORY (static)
    const laboratory: StaticAbilityDefinition = {
      type: "static",
      name: "LABORATORY",
      effect: {
        type: "cost-reduction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(laboratory),
    );
  });

  it.skip("Gustav the Giant - Terror of the Kingdom: should parse card text", () => {
    const text =
      "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.\nBREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // ALL TIED UP (static)
    const allTiedUp: StaticAbilityDefinition = {
      type: "static",
      name: "ALL TIED UP",
      effect: {
        type: "restriction",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(allTiedUp),
    );

    // BREAK FREE (triggered)
    const breakFree: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BREAK FREE",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(breakFree),
    );
  });

  it.skip("Hades - Hotheaded Ruler: should parse card text", () => {
    const text = "CALL THE TITANS {E} — Ready your Titan characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CALL THE TITANS (activated)
    const callTheTitans: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CALL THE TITANS",
      cost: {
        exert: true,
      },
      effect: {
        type: "ready",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(callTheTitans),
    );
  });

  it.skip("Helga Sinclair - Right-Hand Woman: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Challenger +2
    const challenger2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger2),
    );
  });

  it.skip("Kida - Royal Warrior: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
  });

  it.skip("Little John - Resourceful Outlaw: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Little John.)\nOKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Shift 4
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

    // OKAY, BIG SHOT (static)
    const okayBigShot: StaticAbilityDefinition = {
      type: "static",
      name: "OKAY, BIG SHOT",
      effect: {
        type: "compound",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(okayBigShot),
    );
  });

  it.skip("Little John - Robin's Pal: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDISGUISED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // DISGUISED (static)
    const disguised: StaticAbilityDefinition = {
      type: "static",
      name: "DISGUISED",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(disguised),
    );
  });

  it.skip("Lythos - Rock Titan: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nSTONE SKIN {E} — Chosen character gains Resist +2 this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Resist +2
    const resist2: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist2),
    );

    // STONE SKIN (activated)
    const stoneSkin: ActivatedAbilityDefinition = {
      type: "activated",
      name: "STONE SKIN",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stoneSkin),
    );
  });

  it.skip("Mickey Mouse - Stalwart Explorer: should parse card text", () => {
    const text =
      "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // LET'S TAKE A LOOK (static)
    const letsTakeALook: StaticAbilityDefinition = {
      type: "static",
      name: "LET'S TAKE A LOOK",
      effect: {
        type: "for-each",
        counter: { type: "items-in-play", controller: "you" },
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letsTakeALook),
    );
  });

  it.skip("Minnie Mouse - Funky Spelunker: should parse card text", () => {
    const text =
      "JOURNEY While this character is at a location, she gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // JOURNEY (static)
    const journey: StaticAbilityDefinition = {
      type: "static",
      name: "JOURNEY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(journey),
    );
  });

  it.skip("Mr. Smee - Bumbling Mate: should parse card text", () => {
    const text =
      "OH DEAR, DEAR, DEAR At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // OH DEAR, DEAR, DEAR (triggered)
    const ohDearDearDear: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OH DEAR, DEAR, DEAR",
      trigger: {
        event: "end-of-turn",
        timing: "at",
      },
      effect: {
        type: "conditional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ohDearDearDear),
    );
  });

  it.skip("And Then Along Came Zeus: should parse card text", () => {
    const text = "Deal 5 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 5,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Ba-Boom!: should parse card text", () => {
    const text = "Deal 2 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Action ability
    const actionAbility: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(actionAbility),
    );
  });

  it.skip("Captain Hook's Rapier: should parse card text", () => {
    const text =
      "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\nLET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // GET THOSE SCURVY BRATS! (triggered)
    const getThoseScurvyBrats: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GET THOSE SCURVY BRATS!",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
      },
      effect: {
        type: "optional",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(getThoseScurvyBrats),
    );

    // LET'S HAVE AT IT! (static)
    const letsHaveAtIt: StaticAbilityDefinition = {
      type: "static",
      name: "LET'S HAVE AT IT!",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letsHaveAtIt),
    );
  });

  it.skip("Gizmosuit: should parse card text", () => {
    const text =
      "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // CYBERNETIC ARMOR (activated)
    const cyberneticArmor: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CYBERNETIC ARMOR",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cyberneticArmor),
    );
  });

  it.skip("Map of Treasure Planet: should parse card text", () => {
    const text =
      "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.\nSHOW THE WAY You pay 1 {I} less to move your characters to a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // KEY TO THE PORTAL (activated)
    const keyToThePortal: ActivatedAbilityDefinition = {
      type: "activated",
      name: "KEY TO THE PORTAL",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(keyToThePortal),
    );

    // SHOW THE WAY (static)
    const showTheWay: StaticAbilityDefinition = {
      type: "static",
      name: "SHOW THE WAY",
      effect: {
        type: "cost-reduction",
        amount: 1,
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(showTheWay),
    );
  });
});
